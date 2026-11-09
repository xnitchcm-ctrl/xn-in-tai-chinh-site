-- Migration: Create recruitment_positions table with strict RLS and one-time initial seed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.recruitment_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT,
  salary TEXT,
  quantity INTEGER DEFAULT 1,
  deadline DATE,
  requirements JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  display_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recruitment_positions_status ON public.recruitment_positions(status);
CREATE INDEX IF NOT EXISTS idx_recruitment_positions_order ON public.recruitment_positions(display_order ASC, created_at DESC);

ALTER TABLE public.recruitment_positions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "recruitment_positions_select_public" ON public.recruitment_positions;
DROP POLICY IF EXISTS "recruitment_positions_insert_admin" ON public.recruitment_positions;
DROP POLICY IF EXISTS "recruitment_positions_update_admin" ON public.recruitment_positions;
DROP POLICY IF EXISTS "recruitment_positions_delete_admin" ON public.recruitment_positions;

CREATE POLICY "recruitment_positions_select_public" ON public.recruitment_positions
  FOR SELECT TO anon, authenticated
  USING (
    status = 'active' OR public.is_admin()
  );

CREATE POLICY "recruitment_positions_insert_admin" ON public.recruitment_positions
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "recruitment_positions_update_admin" ON public.recruitment_positions
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "recruitment_positions_delete_admin" ON public.recruitment_positions
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- Seed once if not present
INSERT INTO public.recruitment_positions (
  id,
  title,
  department,
  salary,
  quantity,
  deadline,
  requirements,
  description,
  status,
  display_order
)
SELECT
  'e7f5024b-32bf-4632-a9b1-5dfa5e8e8111'::uuid,
  'Kỹ Sư Công Nghệ In',
  'Phòng Kỹ thuật & Công nghệ In',
  'Mức lương thỏa thuận',
  1,
  '2026-06-30'::date,
  '["Tốt nghiệp chuyên ngành Kỹ sư Công nghệ In", "Có kiến thức về quy trình in offset và in kỹ thuật số", "Hiểu cơ bản về chế bản, quản lý màu và file in", "Có tinh thần trách nhiệm và khả năng làm việc nhóm", "Ưu tiên ứng viên có kinh nghiệm trong ngành in vé số hoặc in ấn tài chính"]'::jsonb,
  'Theo dõi và hỗ trợ vận hành sản xuất in ấn; Kiểm tra chất lượng file và thành phẩm in; Hỗ trợ quản lý dữ liệu in biến đổi và QR Code; Phối hợp giữa bộ phận chế bản và phân xưởng in.',
  'active',
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.recruitment_positions WHERE title = 'Kỹ Sư Công Nghệ In'
);

INSERT INTO public.recruitment_positions (
  id,
  title,
  department,
  salary,
  quantity,
  deadline,
  requirements,
  description,
  status,
  display_order
)
SELECT
  'c9e33481-9b48-4cb2-83de-a89e4c8bc222'::uuid,
  'Họa Sĩ Thiết Kế Đồ Họa',
  'Phân Xưởng Chế Bản',
  'Mức lương thỏa thuận',
  1,
  '2026-07-15'::date,
  '["Thành thạo Adobe Illustrator, Photoshop", "Có kiến thức về thiết kế và chế bản ngành in", "Hiểu cơ bản về màu sắc, dàn trang và file xuất in", "Có khả năng làm việc cẩn thận, chính xác"]'::jsonb,
  'Thiết kế và chỉnh sửa file in; Tạo mẫu phục vụ sản xuất vé số và ấn phẩm tài chính; Thực hiện công việc tại phân xưởng chế bản; Chuẩn bị file in kỹ thuật số và offset.',
  'active',
  2
WHERE NOT EXISTS (
  SELECT 1 FROM public.recruitment_positions WHERE title = 'Họa Sĩ Thiết Kế Đồ Họa'
);
