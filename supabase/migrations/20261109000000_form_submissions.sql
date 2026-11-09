-- Migration: Create form_submissions table with RLS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL DEFAULT 'contact',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  company TEXT,
  company_name TEXT,
  service TEXT,
  service_type TEXT,
  quantity TEXT,
  deadline TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'pending', 'contacted', 'processed', 'archived')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON public.form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON public.form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_type ON public.form_submissions(form_type);

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "form_submissions_anon_insert" ON public.form_submissions;
DROP POLICY IF EXISTS "CMS users can view form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "form_submissions_auth_select" ON public.form_submissions;
DROP POLICY IF EXISTS "CMS users can update form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "form_submissions_auth_update" ON public.form_submissions;
DROP POLICY IF EXISTS "Admins can delete form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "form_submissions_admin_delete" ON public.form_submissions;

CREATE POLICY "form_submissions_anon_insert" ON public.form_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "form_submissions_auth_select" ON public.form_submissions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "form_submissions_auth_update" ON public.form_submissions
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "form_submissions_admin_delete" ON public.form_submissions
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'approver')
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid())
  );
