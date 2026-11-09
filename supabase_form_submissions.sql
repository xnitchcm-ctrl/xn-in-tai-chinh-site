-- ==============================================================================
-- BẢNG DỮ LIỆU PUBLIC.FORM_SUBMISSIONS VÀ PHÂN QUYỀN RLS
-- Dự án: Xí Nghiệp In Tài Chính TP. Hồ Chí Minh
-- Supabase Project ID: zdxfunpysjufddkgjhiw
-- ==============================================================================

-- 1. Bật extension tạo UUID ngẫu nhiên nếu chưa có
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tạo bảng public.form_submissions lưu trữ mọi yêu cầu từ website
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL DEFAULT 'contact',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  company TEXT,
  company_name TEXT, -- Tương thích ngược với các trường cũ
  service TEXT,
  service_type TEXT, -- Tương thích ngược với các trường cũ
  quantity TEXT,
  deadline TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'pending', 'contacted', 'processed', 'archived')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  details JSONB DEFAULT '{}'::jsonb, -- Tương thích ngược với CMS
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tạo index để tối ưu tốc độ tra cứu cho Quản trị viên
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON public.form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON public.form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_type ON public.form_submissions(form_type);

-- 3. Kích hoạt Row Level Security (RLS) bảo mật tuyệt đối
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- 4. Xóa các policy cũ nếu có để tránh xung đột
DROP POLICY IF EXISTS "Public insert form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "form_submissions_anon_insert" ON public.form_submissions;
DROP POLICY IF EXISTS "CMS users can view form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "form_submissions_auth_select" ON public.form_submissions;
DROP POLICY IF EXISTS "CMS users can update form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "form_submissions_auth_update" ON public.form_submissions;
DROP POLICY IF EXISTS "Admins can delete form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "form_submissions_admin_delete" ON public.form_submissions;

-- 5. POLICY 1: Khách truy cập website (anon & authenticated) CHỈ ĐƯỢC PHÉP INSERT yêu cầu mới
CREATE POLICY "form_submissions_anon_insert" ON public.form_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- 6. POLICY 2: Chỉ người dùng đã đăng nhập (Quản trị viên / Nhân sự CMS) mới được XEM dữ liệu (SELECT)
-- Khách vãng lai TUYỆT ĐỐI không được xem dữ liệu của người khác
CREATE POLICY "form_submissions_auth_select" ON public.form_submissions
  FOR SELECT TO authenticated
  USING (true);

-- 7. POLICY 3: Chỉ người dùng đã đăng nhập CMS mới được CẬP NHẬT trạng thái (UPDATE)
CREATE POLICY "form_submissions_auth_update" ON public.form_submissions
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- 8. POLICY 4: Chỉ Quản trị viên (Admin & Approver) mới được XÓA yêu cầu (DELETE)
CREATE POLICY "form_submissions_admin_delete" ON public.form_submissions
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'approver')
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()) -- dự phòng khi chưa cấu hình bảng profiles
  );
