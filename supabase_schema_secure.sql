-- ==============================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU VÀ BẢO MẬT PHÂN QUYỀN SUPABASE (SECURE RBAC & RLS)
-- Dự án: Xí Nghiệp In Tài Chính TP. Hồ Chí Minh
-- File: supabase_schema_secure.sql
-- ==============================================================================

-- ==============================================================================
-- 1. KHỞI TẠO CÁC BẢNG DỮ LIỆU CƠ BẢN (TABLES)
-- ==============================================================================

-- 1.1. Bảng profiles (Hồ sơ người dùng & Phân quyền)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'approver', 'editor', 'super_admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked')),
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.2. Bảng news_articles (Tin tức & Hoạt động)
-- Hỗ trợ các trạng thái: draft (nháp), revision_requested (yêu cầu sửa lại), pending_review (chờ duyệt), published (đã xuất bản), rejected (từ chối), hidden (ẩn)
CREATE TABLE IF NOT EXISTS public.news_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Hoạt động doanh nghiệp',
  summary TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT 'Ban Biên Tập',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'revision_requested', 'pending_review', 'published', 'rejected', 'hidden')),
  views INTEGER DEFAULT 0 NOT NULL,
  featured BOOLEAN DEFAULT false NOT NULL,
  reject_reason TEXT DEFAULT '',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.3. Bảng gallery_items (Thư viện hình ảnh)
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Dây chuyền thiết bị',
  image TEXT NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.4. Bảng categories (Danh mục tin tức)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'post',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.5. Bảng page_contents (Nội dung các trang tĩnh / Giới thiệu / Thiết bị)
CREATE TABLE IF NOT EXISTS public.page_contents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.6. Bảng audit_logs (Nhật ký thao tác hệ thống)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ==============================================================================
-- 2. HÀM PHỤ TRỢ KIỂM TRA PHÂN QUYỀN (SECURITY DEFINER VỚI search_path = '')
-- ==============================================================================

-- 2.1. Lấy vai trò của tài khoản đang đăng nhập
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE sql 
SECURITY DEFINER 
STABLE
SET search_path = ''
AS $$
  SELECT role FROM public.profiles 
  WHERE id = auth.uid() AND status = 'active'
  LIMIT 1;
$$;

-- 2.2. Kiểm tra có phải Quản trị viên (Admin)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
LANGUAGE sql 
SECURITY DEFINER 
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND status = 'active' 
      AND role IN ('admin', 'super_admin')
  );
$$;

-- 2.3. Kiểm tra có phải Người duyệt bài (Approver) hoặc Quản trị viên
CREATE OR REPLACE FUNCTION public.is_approver_or_admin()
RETURNS BOOLEAN 
LANGUAGE sql 
SECURITY DEFINER 
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND status = 'active' 
      AND role IN ('admin', 'super_admin', 'approver')
  );
$$;

-- 2.4. Kiểm tra tài khoản CMS hợp lệ (bất kỳ vai trò nào nhưng không bị khóa)
CREATE OR REPLACE FUNCTION public.is_cms_user()
RETURNS BOOLEAN 
LANGUAGE sql 
SECURITY DEFINER 
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND status = 'active'
  );
$$;

-- Phân quyền thực thi: Thu hồi khỏi PUBLIC và anon; chỉ cấp EXECUTE cho authenticated và service_role
REVOKE EXECUTE ON FUNCTION public.get_current_user_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.is_approver_or_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_approver_or_admin() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.is_cms_user() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_cms_user() TO authenticated, service_role;


-- ==============================================================================
-- 3. TRIGGER TỰ ĐỒNG BỘ AUTH.USERS SANG PROFILES (Chỉ Trigger được thực thi)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
DECLARE
  initial_role TEXT;
  user_count INT;
BEGIN
  -- Tài khoản đầu tiên tự động nhận quyền admin, các tài khoản sau mặc định là editor
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  IF user_count = 0 THEN
    initial_role := 'admin';
  ELSE
    initial_role := COALESCE(NEW.raw_user_meta_data->>'role', 'editor');
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    initial_role,
    'active'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = CASE WHEN profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END;
  RETURN NEW;
END;
$$;

-- Hàm handle_new_user() chỉ được gọi tự động bởi trigger PostgreSQL (chạy dưới quyền postgres/superuser)
-- Thu hồi toàn bộ quyền EXECUTE khỏi PUBLIC, anon và authenticated
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==============================================================================
-- 4. BẢO MẬT ROW LEVEL SECURITY (RLS) THEO ĐÚNG TỪNG VAI TRÒ
-- ==============================================================================

-- Kích hoạt RLS trên tất cả các bảng dữ liệu
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 4.1. POLICIES CHO BẢNG: profiles
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;

-- Xem: Tất cả tài khoản CMS đang active đều xem được danh sách nhân sự
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_cms_user());

-- Thêm: Chỉ Admin được thêm profile mới
CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- Sửa: 
-- 1. Người dùng chỉ được sửa thông tin cá nhân (full_name, avatar_url), KHÔNG ĐƯỢC tự đổi role hoặc status của chính mình.
-- 2. Admin được sửa tất cả (bao gồm role, status).
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (
    public.is_admin() OR (auth.uid() = id AND public.is_cms_user())
  )
  WITH CHECK (
    public.is_admin() OR (
      auth.uid() = id 
      AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
      AND status = (SELECT p.status FROM public.profiles p WHERE p.id = auth.uid())
    )
  );

-- Xóa: Chỉ Admin được xóa profile
CREATE POLICY "profiles_delete" ON public.profiles
  FOR DELETE TO authenticated
  USING (public.is_admin());


-- ------------------------------------------------------------------------------
-- 4.2. POLICIES CHO BẢNG: news_articles
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "news_select" ON public.news_articles;
DROP POLICY IF EXISTS "news_insert" ON public.news_articles;
DROP POLICY IF EXISTS "news_update" ON public.news_articles;
DROP POLICY IF EXISTS "news_delete" ON public.news_articles;

-- Xem: 
-- - Khách vãng lai (anon): chỉ xem được bài đã xuất bản (status = 'published').
-- - Biên tập viên (Editor): xem bài published + bài của chính mình.
-- - Approver & Admin: xem được toàn bộ bài viết.
CREATE POLICY "news_select" ON public.news_articles
  FOR SELECT TO anon, authenticated
  USING (
    status = 'published' 
    OR public.is_approver_or_admin()
    OR (auth.uid() = author_id AND public.is_cms_user())
  );

-- Tạo bài: 
-- - Editor: chỉ được tạo bài có status là 'draft' hoặc 'pending_review', author_id phải là chính mình.
-- - Approver & Admin: được tạo bài ở bất kỳ trạng thái nào.
CREATE POLICY "news_insert" ON public.news_articles
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_approver_or_admin()
    OR (
      public.is_cms_user() 
      AND (author_id = auth.uid() OR author_id IS NULL)
      AND status IN ('draft', 'pending_review')
    )
  );

-- Sửa bài:
-- - Editor: CHỈ ĐƯỢC SỬA khi author_id = auth.uid() và status IN ('draft', 'revision_requested').
--   Và CHỈ ĐƯỢC CHUYỂN (WITH CHECK) sang status IN ('draft', 'pending_review').
-- - Approver & Admin: toàn quyền duyệt, xuất bản, ẩn bài hoặc sửa nội dung.
CREATE POLICY "news_update" ON public.news_articles
  FOR UPDATE TO authenticated
  USING (
    public.is_approver_or_admin()
    OR (
      author_id = auth.uid()
      AND public.is_cms_user()
      AND status IN ('draft', 'revision_requested')
    )
  )
  WITH CHECK (
    public.is_approver_or_admin()
    OR (
      author_id = auth.uid()
      AND public.is_cms_user()
      AND status IN ('draft', 'pending_review')
    )
  );

-- Xóa bài: Chỉ Approver và Admin được xóa bài viết
CREATE POLICY "news_delete" ON public.news_articles
  FOR DELETE TO authenticated
  USING (public.is_approver_or_admin());


-- ------------------------------------------------------------------------------
-- 4.3. POLICIES CHO BẢNG: gallery_items
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "gallery_select" ON public.gallery_items;
DROP POLICY IF EXISTS "gallery_insert" ON public.gallery_items;
DROP POLICY IF EXISTS "gallery_update" ON public.gallery_items;
DROP POLICY IF EXISTS "gallery_delete" ON public.gallery_items;

-- Xem: Công khai xem toàn bộ thư viện ảnh
CREATE POLICY "gallery_select" ON public.gallery_items
  FOR SELECT TO anon, authenticated
  USING (true);

-- Thêm ảnh: Thành viên CMS active được phép thêm ảnh
CREATE POLICY "gallery_insert" ON public.gallery_items
  FOR INSERT TO authenticated
  WITH CHECK (public.is_cms_user());

-- Sửa ảnh / Đổi thứ tự: Editor chỉ sửa ảnh do mình tải lên; Approver và Admin được sửa tất cả
CREATE POLICY "gallery_update" ON public.gallery_items
  FOR UPDATE TO authenticated
  USING (
    public.is_approver_or_admin() 
    OR (uploaded_by = auth.uid() AND public.is_cms_user())
  )
  WITH CHECK (
    public.is_approver_or_admin() 
    OR (uploaded_by = auth.uid() AND public.is_cms_user())
  );

-- Xóa ảnh: Chỉ Approver và Admin được xóa ảnh
CREATE POLICY "gallery_delete" ON public.gallery_items
  FOR DELETE TO authenticated
  USING (public.is_approver_or_admin());


-- ------------------------------------------------------------------------------
-- 4.4. POLICIES CHO BẢNG: categories
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "categories_select" ON public.categories;
DROP POLICY IF EXISTS "categories_modify" ON public.categories;

-- Xem: Công khai xem danh mục
CREATE POLICY "categories_select" ON public.categories
  FOR SELECT TO anon, authenticated
  USING (true);

-- Thêm/Sửa/Xóa danh mục: Chỉ Approver và Admin
CREATE POLICY "categories_modify" ON public.categories
  FOR ALL TO authenticated
  USING (public.is_approver_or_admin())
  WITH CHECK (public.is_approver_or_admin());


-- ------------------------------------------------------------------------------
-- 4.5. POLICIES CHO BẢNG: page_contents (Chỉ Admin có quyền chỉnh sửa)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "page_contents_select" ON public.page_contents;
DROP POLICY IF EXISTS "page_contents_modify" ON public.page_contents;

-- Xem: Công khai xem nội dung trang
CREATE POLICY "page_contents_select" ON public.page_contents
  FOR SELECT TO anon, authenticated
  USING (true);

-- Sửa/Thêm/Xóa nội dung trang: DUY NHẤT ADMIN
CREATE POLICY "page_contents_modify" ON public.page_contents
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ------------------------------------------------------------------------------
-- 4.6. POLICIES CHO BẢNG: audit_logs (Bảo mật tuyệt đối nhật ký)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "audit_logs_select" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_update" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_delete" ON public.audit_logs;

-- Xem: DUY NHẤT ADMIN được xem nhật ký
CREATE POLICY "audit_logs_select" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- Thêm: Mọi thành viên CMS active được ghi log hệ thống
CREATE POLICY "audit_logs_insert" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_cms_user());

-- KHÔNG CẤP QUYỀN UPDATE & DELETE (Bảo đảm tính bất biến của nhật ký)


-- ==============================================================================
-- 5. CẤU HÌNH STORAGE BUCKET 'media' VÀ POLICIES DÙNG owner_id
-- ==============================================================================

-- Tạo bucket 'media' chế độ công khai
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Xóa các policy storage cũ
DROP POLICY IF EXISTS "storage_media_public_select" ON storage.objects;
DROP POLICY IF EXISTS "storage_media_editor_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_media_user_update" ON storage.objects;
DROP POLICY IF EXISTS "storage_media_user_delete" ON storage.objects;

-- 5.1. Xem file: Công khai xem toàn bộ hình ảnh trong bucket 'media'
CREATE POLICY "storage_media_public_select" ON storage.objects 
  FOR SELECT TO public 
  USING (bucket_id = 'media');

-- 5.2. Tải file lên: Thành viên CMS active được phép tải file lên bucket 'media'
CREATE POLICY "storage_media_editor_insert" ON storage.objects 
  FOR INSERT TO authenticated 
  WITH CHECK (
    bucket_id = 'media' 
    AND public.is_cms_user()
  );

-- 5.3. Sửa file: 
-- - Editor chỉ được sửa file do chính mình tải lên (owner_id = auth.uid()::text).
-- - Approver & Admin được sửa tất cả file.
CREATE POLICY "storage_media_user_update" ON storage.objects 
  FOR UPDATE TO authenticated 
  USING (
    bucket_id = 'media' 
    AND (public.is_approver_or_admin() OR (owner_id = (auth.uid())::text AND public.is_cms_user()))
  )
  WITH CHECK (
    bucket_id = 'media' 
    AND (public.is_approver_or_admin() OR (owner_id = (auth.uid())::text AND public.is_cms_user()))
  );

-- 5.4. Xóa file: 
-- - Editor chỉ được xóa file của chính mình.
-- - Approver & Admin được xóa mọi file.
CREATE POLICY "storage_media_user_delete" ON storage.objects 
  FOR DELETE TO authenticated 
  USING (
    bucket_id = 'media' 
    AND (public.is_approver_or_admin() OR (owner_id = (auth.uid())::text AND public.is_cms_user()))
  );
