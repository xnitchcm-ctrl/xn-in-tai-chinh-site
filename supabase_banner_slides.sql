-- ==============================================================================
-- BẢNG DỮ LIỆU PUBLIC.BANNER_SLIDES VÀ PHÂN QUYỀN RLS
-- Dự án: Xí Nghiệp In Tài Chính TP. Hồ Chí Minh
-- Supabase Project ID: zdxfunpysjufddkgjhiw
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.banner_slides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  badge_text TEXT DEFAULT 'XÍ NGHIỆP IN TÀI CHÍNH',
  cta_text TEXT DEFAULT 'KHÁM PHÁ NGAY',
  target_id TEXT DEFAULT 'services',
  image TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_banner_slides_active ON public.banner_slides(is_active);
CREATE INDEX IF NOT EXISTS idx_banner_slides_order ON public.banner_slides(display_order ASC, created_at DESC);

ALTER TABLE public.banner_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "banner_slides_select" ON public.banner_slides;
DROP POLICY IF EXISTS "banner_slides_insert" ON public.banner_slides;
DROP POLICY IF EXISTS "banner_slides_update" ON public.banner_slides;
DROP POLICY IF EXISTS "banner_slides_delete" ON public.banner_slides;

-- Khách truy cập chỉ xem banner đang bật (is_active = true); Admin & Approver xem tất cả
CREATE POLICY "banner_slides_select" ON public.banner_slides
  FOR SELECT TO anon, authenticated
  USING (
    is_active = true
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND status = 'active' AND role IN ('admin', 'super_admin', 'approver')
    )
  );

-- Admin & Approver được thêm, sửa, xóa Banner Slide
CREATE POLICY "banner_slides_insert" ON public.banner_slides
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND status = 'active' AND role IN ('admin', 'super_admin', 'approver')
    )
  );

CREATE POLICY "banner_slides_update" ON public.banner_slides
  FOR UPDATE TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND status = 'active' AND role IN ('admin', 'super_admin', 'approver')
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND status = 'active' AND role IN ('admin', 'super_admin', 'approver')
    )
  );

CREATE POLICY "banner_slides_delete" ON public.banner_slides
  FOR DELETE TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND status = 'active' AND role IN ('admin', 'super_admin', 'approver')
    )
  );
