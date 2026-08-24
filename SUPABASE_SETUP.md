# HƯỚNG DẪN THIẾT LẬP SUPABASE & BIẾN MÔI TRƯỜNG TRÊN VERCEL
### Xí Nghiệp In Tài Chính TP. Hồ Chí Minh — CMS Quản Trị

---

## 1. Tạo Project Supabase Mới

1. Truy cập [https://supabase.com](https://supabase.com) và đăng nhập hoặc đăng ký tài khoản.
2. Nhấp **"New Project"**.
3. Điền các thông tin:
   - **Name**: `xnghiepinttc-cms` (hoặc tên tùy chọn)
   - **Database Password**: Đặt mật khẩu an toàn (lưu lại để dùng khi cần kết nối trực tiếp).
   - **Region**: Chọn `Singapore (ap-southeast-1)` để tối ưu tốc độ tại Việt Nam.
4. Nhấp **"Create new project"** và đợi 1-2 phút để hệ thống khởi tạo hoàn tất.

---

## 2. Khởi Tạo Cơ Sở Dữ Liệu & Phân Quyền RLS (SQL Schema)

1. Trong Dashboard Supabase của bạn, ở thanh menu bên trái, nhấp vào biểu tượng **SQL Editor**.
2. Nhấp **"New query"**.
3. Dán toàn bộ đoạn mã SQL dưới đây vào và nhấp nút **"Run"** (hoặc nhấn `Ctrl + Enter`):

```sql
-- =================================================================
-- XÍ NGHIỆP IN TÀI CHÍNH - SUPABASE CMS SCHEMA & RLS POLICIES
-- BẢNG DỮ LIỆU THẬT & PHÂN QUYỀN RBAC CHO QUẢN TRỊ VIÊN, DUYỆT BÀI & BIÊN TẬP
-- =================================================================

-- 1. BẬT EXTENSION TỰ TẠO UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TẠO BẢNG HỒ SƠ TÀI KHOẢN (PROFILES) LIÊN KẾT VỚI AUTH.USERS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'approver', 'editor')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG BÀI VIẾT TIN TỨC & HOẠT ĐỘNG (NEWS_ARTICLES)
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Hoạt Động Sản Xuất',
  image_url TEXT,
  video_url TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  author_name TEXT NOT NULL DEFAULT 'Ban Biên Tập',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'rejected', 'hidden')),
  rejection_reason TEXT,
  views_count INT DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG THƯ VIỆN ẢNH (GALLERY_ITEMS)
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('machinery', 'products', 'activities', 'certificates')),
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'pending_review', 'published', 'hidden')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG NHẬT KÝ AN NINH (AUDIT_LOGS)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_name TEXT,
  user_role TEXT,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'success',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TỰ ĐỘNG CẬP NHẬT PROFILE KHI TẠO USER MỚI TRONG AUTH.USERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'editor'),
    'active'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. THIẾT LẬP ROW LEVEL SECURITY (RLS) BẢO MẬT TUYỆT ĐỐI
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions lấy Role của user hiện tại
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 8. POLICIES CHO BẢNG PROFILES
CREATE POLICY "Cho phép xem danh sách profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin hoặc chính chủ cập nhật profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.get_my_role() = 'admin');

-- 9. POLICIES CHO BẢNG NEWS_ARTICLES (TIN TỨC)
CREATE POLICY "Công chúng xem bài đã đăng" ON public.news_articles
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admin và Approver xem mọi bài viết" ON public.news_articles
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN ('admin', 'approver') OR created_by = auth.uid());

CREATE POLICY "Editor, Approver, Admin thêm bài viết" ON public.news_articles
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    (
      public.get_my_role() IN ('admin', 'approver') OR
      (public.get_my_role() = 'editor' AND status IN ('draft', 'pending_review'))
    )
  );

CREATE POLICY "Sửa bài viết theo phân quyền" ON public.news_articles
  FOR UPDATE TO authenticated
  USING (
    public.get_my_role() IN ('admin', 'approver') OR
    (public.get_my_role() = 'editor' AND created_by = auth.uid())
  );

CREATE POLICY "Admin và Approver được xóa bài" ON public.news_articles
  FOR DELETE TO authenticated
  USING (public.get_my_role() IN ('admin', 'approver'));

-- 10. POLICIES CHO BẢNG GALLERY_ITEMS (THƯ VIỆN ẢNH)
CREATE POLICY "Công chúng xem thư viện ảnh đã đăng" ON public.gallery_items
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admin và Approver xem mọi ảnh thư viện" ON public.gallery_items
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN ('admin', 'approver') OR created_by = auth.uid());

CREATE POLICY "Thêm ảnh thư viện" ON public.gallery_items
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Cập nhật sắp xếp ảnh thư viện" ON public.gallery_items
  FOR UPDATE TO authenticated
  USING (public.get_my_role() IN ('admin', 'approver') OR created_by = auth.uid());

CREATE POLICY "Admin và Approver xóa ảnh thư viện" ON public.gallery_items
  FOR DELETE TO authenticated
  USING (public.get_my_role() IN ('admin', 'approver'));

-- 11. POLICIES CHO BẢNG AUDIT_LOGS
CREATE POLICY "Admin xem nhật ký hệ thống" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Ghi nhật ký an ninh" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- 12. TẠO BUCKET STORAGE "media" CHO TẢI ẢNH THẬT
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Công chúng xem và tải ảnh từ bucket media" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

CREATE POLICY "Người dùng đăng nhập tải ảnh lên bucket media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Admin và Approver xóa ảnh trong bucket media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media');
```

---

## 3. Lấy API Keys từ Supabase

1. Trong Dashboard Supabase, vào **Project Settings** (biểu tượng bánh răng ở góc dưới bên trái) -> **API**.
2. Tìm 2 giá trị:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **Project API Keys**: `anon` / `public` key (dãy ký tự `eyJhbGciOi...`).

---

## 4. Thiết Lập Biến Môi Trường Trên Vercel

1. Đăng nhập vào [Vercel](https://vercel.com) và vào Project của bạn.
2. Vào tab **Settings** -> **Environment Variables**.
3. Thêm 2 biến môi trường sau:
   - **Key**: `VITE_SUPABASE_URL`
     - **Value**: URL Supabase của bạn (ví dụ: `https://xyzcompany.supabase.co`)
     - Chọn cả 3 môi trường: `Production`, `Preview`, `Development`.
   - **Key**: `VITE_SUPABASE_ANON_KEY`
     - **Value**: Anon Public Key của bạn
     - Chọn cả 3 môi trường: `Production`, `Preview`, `Development`.
4. Nhấp **Save**.
5. Thực hiện **Redeploy** lại project trên Vercel để áp dụng biến môi trường mới nhất.

---

## 5. Tạo Tài Khoản Quản Trị Viên Ban Đầu

1. Vào tab **Authentication** -> **Users** trong Supabase Dashboard.
2. Nhấp **"Add user"** -> **"Create user"**:
   - **Email**: `admin@intaichinh.vn` (hoặc email của bạn)
   - **Password**: Nhập mật khẩu quản trị an toàn (tối thiểu 8 ký tự).
   - **Auto Confirm User**: Bật ON (để không cần xác thực email).
3. Nhấp **"Create user"**.
4. Vào **SQL Editor** và nâng quyền Quản trị viên (admin) cho tài khoản này bằng lệnh:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin', full_name = 'Quản Trị Viên Trưởng'
   WHERE email = 'admin@intaichinh.vn';
   ```
5. Đăng nhập vào hệ thống tại đường dẫn `/admin/login` bằng email và mật khẩu vừa tạo.
