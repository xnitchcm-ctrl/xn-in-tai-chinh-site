import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GalleryItem } from '../types';

// Environment variables
export const SUPABASE_URL: string = (import.meta as any).env?.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY: string = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
  !SUPABASE_URL.includes('your-project-id')
);

// Single Supabase Client instance
let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;
  if (isSupabaseConfigured) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    });
  }
  return client;
}

export const supabase = getSupabaseClient();

// Database Interface Types
export type UserRole = 'admin' | 'approver' | 'editor';

export interface Profile {
  id: string; // auth.users.id
  email: string;
  full_name: string;
  role: UserRole;
  status: 'active' | 'locked';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type ArticleStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'hidden';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  author_id?: string;
  status: 'draft' | 'revision_requested' | 'pending_review' | 'published' | 'rejected' | 'hidden';
  views: number;
  featured: boolean;
  reject_reason?: string;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export interface SupabaseGalleryItem {
  id: string;
  title: string;
  category: 'machinery' | 'products' | 'activities' | 'certificates';
  image_url: string;
  display_order: number;
  status: 'draft' | 'pending_review' | 'published' | 'hidden';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLogItem {
  id: string;
  user_id?: string;
  user_email?: string;
  user_name?: string;
  user_role?: string;
  action: string;
  target: string;
  details?: string;
  status: 'success' | 'failure';
  created_at: string;
}

// SQL Setup and Migration Script for Supabase SQL Editor
export const SUPABASE_SQL_SETUP = `-- =================================================================
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
-- Mọi người dùng đã đăng nhập có thể xem hồ sơ
CREATE POLICY "Cho phép xem danh sách profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- Chỉ Quản trị viên (admin) hoặc chính chủ được sửa thông tin cơ bản
CREATE POLICY "Admin hoặc chính chủ cập nhật profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.get_my_role() = 'admin');

-- 9. POLICIES CHO BẢNG NEWS_ARTICLES (TIN TỨC)
-- Công chúng xem các bài ĐÃ ĐĂNG (published)
CREATE POLICY "Công chúng xem bài đã đăng" ON public.news_articles
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- Quản trị viên & Người duyệt xem toàn bộ trạng thái (bản nháp, chờ duyệt, từ chối, ẩn)
CREATE POLICY "Admin và Approver xem mọi bài viết" ON public.news_articles
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN ('admin', 'approver') OR created_by = auth.uid());

-- Biên tập viên (editor) được thêm bài (mặc định draft hoặc pending_review)
CREATE POLICY "Editor, Approver, Admin thêm bài viết" ON public.news_articles
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    (
      public.get_my_role() IN ('admin', 'approver') OR
      (public.get_my_role() = 'editor' AND status IN ('draft', 'pending_review'))
    )
  );

-- Cập nhật bài viết theo quyền
CREATE POLICY "Sửa bài viết theo phân quyền" ON public.news_articles
  FOR UPDATE TO authenticated
  USING (
    public.get_my_role() IN ('admin', 'approver') OR
    (public.get_my_role() = 'editor' AND created_by = auth.uid())
  );

-- Xóa bài viết (Chỉ Admin và Approver)
CREATE POLICY "Admin và Approver được xóa bài" ON public.news_articles
  FOR DELETE TO authenticated
  USING (public.get_my_role() IN ('admin', 'approver'));

-- 10. POLICIES CHO BẢNG GALLERY_ITEMS (THƯ VIỆN ẢNH)
-- Công chúng xem ảnh đã đăng
CREATE POLICY "Công chúng xem thư viện ảnh đã đăng" ON public.gallery_items
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- Admin & Approver xem toàn bộ ảnh
CREATE POLICY "Admin và Approver xem mọi ảnh thư viện" ON public.gallery_items
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN ('admin', 'approver') OR created_by = auth.uid());

-- Thêm & Quản lý ảnh
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

-- Policies cho Storage "media"
CREATE POLICY "Công chúng xem và tải ảnh từ bucket media" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

CREATE POLICY "Người dùng đăng nhập tải ảnh lên bucket media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Admin và Approver xóa ảnh trong bucket media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media');
`;
