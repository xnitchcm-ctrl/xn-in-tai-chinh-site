import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getSupabaseClient, 
  isSupabaseConfigured, 
  Profile, 
  NewsArticle, 
  SupabaseGalleryItem, 
  AuditLogItem,
  slugify
} from '../utils/supabase';
import { COMPANY_INFO, STATISTICS, SERVICE_ITEMS, TECHNOLOGIES, GALLERY_ITEMS, VACANCIES } from '../data/companyData';
import { 
  ServiceItem, 
  TechnologyItem, 
  GalleryItem, 
  JobVacancy, 
  UserRole, 
  CMSUser, 
  CMSBrand, 
  CMSSEO, 
  CMSCategory, 
  CMSMedia, 
  CMSAuditLog, 
  CMSSession,
  QuoteRequest,
  ArticleWorkflowStatus
} from '../types';
import { NewsPost, DEFAULT_MOCK_NEWS, NEWS_CATEGORIES } from '../utils/firebase';

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  badgeText: string;
  targetId: string;
}

export interface CMSContextType {
  // Public data state (synced with Supabase if available)
  companyInfo: typeof COMPANY_INFO;
  statistics: typeof STATISTICS;
  slides: HeroSlide[];
  services: ServiceItem[];
  technologies: TechnologyItem[];
  gallery: GalleryItem[];
  vacancies: JobVacancy[];
  news: NewsPost[];
  categories: CMSCategory[];
  mediaList: CMSMedia[];
  quotes: QuoteRequest[];
  users: CMSUser[];
  brand: CMSBrand;
  seo: CMSSEO;
  auditLogs: CMSAuditLog[];
  activeSessions: CMSSession[];
  
  // Status & Auth
  loading: boolean;
  isInitialized: boolean;
  currentUser: CMSUser | null;
  isAdmin: boolean;
  isApprover: boolean;
  isEditor: boolean;
  userRole: UserRole | null;
  adminEmail: string | null;
  supabaseConnected: boolean;
  
  // Supabase Auth & Account operations
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateUserPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateUserRole: (uid: string, newRole: UserRole) => Promise<void>;
  toggleUserStatus: (uid: string, currentStatus: 'active' | 'locked') => Promise<void>;
  deleteUserAccount: (uid: string) => Promise<void>;
  
  // Role & Permissions check
  hasPermission: (permission: 'manage_users' | 'publish_post' | 'review_post' | 'edit_post' | 'upload_media' | 'manage_gallery') => boolean;
  
  // Storage & Upload
  uploadMediaFile: (file: File, folder?: string) => Promise<string>;
  
  // News Article Workflow
  saveNewsPost: (post: Partial<NewsPost>) => Promise<NewsPost>;
  submitNewsForReview: (id: string) => Promise<void>;
  approveAndPublishNews: (id: string) => Promise<void>;
  rejectNewsPost: (id: string, reason: string) => Promise<void>;
  hideNewsPost: (id: string) => Promise<void>;
  deleteNewsPost: (id: string) => Promise<void>;
  
  // Gallery Management with ordering & replacement
  saveGalleryItem: (item: GalleryItem, status?: ArticleWorkflowStatus) => Promise<void>;
  reorderGalleryItems: (items: GalleryItem[]) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  
  // Content Updaters
  saveCompanyInfo: (info: typeof COMPANY_INFO) => Promise<void>;
  saveStatistics: (stats: typeof STATISTICS) => Promise<void>;
  saveSlides: (slides: HeroSlide[]) => Promise<void>;
  saveBrand: (brand: CMSBrand) => Promise<void>;
  saveSEO: (seo: CMSSEO) => Promise<void>;
  saveService: (service: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  saveTechnology: (tech: TechnologyItem) => Promise<void>;
  deleteTechnology: (id: string) => Promise<void>;
  saveVacancy: (vacancy: JobVacancy) => Promise<void>;
  deleteVacancy: (id: string) => Promise<void>;
  saveCategory: (category: CMSCategory) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  saveMedia: (media: CMSMedia) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  saveQuote: (quote: QuoteRequest) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  
  // Audit Logs
  addAuditLog: (action: string, target: string, details: string, status?: 'success' | 'failure') => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

// Default Seed Data
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: '/src/assets/images/printing_hero_1779242674142.png',
    title: 'UY TÍN – CHẤT LƯỢNG – NHANH CHÓNG',
    subtitle: 'Xí Nghiệp In Tài Chính TP. Hồ Chí Minh chuyên in vé số kiến thiết, vé số cào và các loại ấn phẩm chứng từ chuyên ngành tài chính chất lượng cao, bảo mật tối thượng.',
    badgeText: 'Chất Lượng Vượt Trội',
    targetId: 'about',
  },
  {
    id: 'slide-2',
    image: '/src/assets/images/lottery_sheet_1779242696323.png',
    title: 'CHUYÊN IN VÉ SỐ KIẾN THIẾT & VÉ SỐ CÀO',
    subtitle: 'Ứng dụng công nghệ in kỹ thuật số hiện đại tích hợp mã vạch 2 chiều dự thưởng, kết hợp màng dập hologram bảo an và hệ thống mực nhạy cảm để đảm bảo tin cậy tối ưu.',
    badgeText: 'Công Nghệ Đột Phá',
    targetId: 'services',
  },
  {
    id: 'slide-3',
    image: '/src/assets/images/security_lens_1779242712535.png',
    title: 'ẤN PHẨM & CHỨNG TỪ NGÀNH TÀI CHÍNH',
    subtitle: 'Hệ thống thiết bị in Offset thông minh hiện đại chuẩn quốc tế giúp đảm bảo độ chuẩn xác sê-ri, liên tục không sai sót cho hàng triệu bản in tài chính.',
    badgeText: 'Năng Lực Sản Xuất Lớn',
    targetId: 'technology',
  }
];

const DEFAULT_BRAND: CMSBrand = {
  id: 'brand-config',
  desktopLogoUrl: '',
  mobileLogoUrl: '',
  footerLogoUrl: '',
  cmsLogoUrl: '',
  loginLogoUrl: '',
  faviconUrl: '',
  ogImageUrl: '',
  primaryColor: '#174A87',
  hoverColor: '#123C70',
  activeColor: '#0D315E',
  accentColor: '#F5C542',
  pageBgColor: '#F7FAFF',
  cardBgColor: '#FFFFFF',
  borderColor: '#DCE7F2',
  textColor: '#173F72'
};

const DEFAULT_SEO: CMSSEO = {
  id: 'seo-config',
  siteTitle: 'XÍ NGHIỆP IN TÀI CHÍNH TP. HỒ CHÍ MINH',
  titleTemplate: '%s | Xí nghiệp In Tài chính TP.HCM',
  metaDescription: 'Xí nghiệp In Tài chính TP.HCM chuyên in vé số kiến thiết, vé số cào bảo mật, chứng từ kế toán, hóa đơn carbonless chất lượng cao ISO 9001:2015.',
  metaKeywords: 'in vé số, xổ số kiến thiết, in chứng từ tài chính, in hóa đơn, in bảo mật, xí nghiệp in tài chính, xổ số tphcm',
  ogTitle: 'XÍ NGHIỆP IN TÀI CHÍNH TP. HỒ CHÍ MINH',
  ogDescription: 'Chuyên in vé số kiến thiết, vé số cào bảo mật và chứng từ ngành tài chính.',
  ogImage: '/src/assets/images/printing_hero_1779242674142.png',
  canonicalUrl: 'https://www.xskthcm.com',
  robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/'
};

const DEFAULT_CATEGORIES: CMSCategory[] = [
  { id: 'cat-1', name: 'Hoạt động sản xuất', slug: 'hoat-dong-san-xuat', type: 'post', description: 'Cập nhật tiến độ kỹ thuật, dây chuyền và KCS', createdAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Hoạt động đoàn thể', slug: 'hoat-dong-doan-the', type: 'post', description: 'Đại hội công đoàn, phong trào đoàn thanh niên', createdAt: new Date().toISOString() },
  { id: 'cat-3', name: 'Thi đua - Khen thưởng', slug: 'thi-dua-khen-thuong', type: 'post', description: 'Tôn vinh cá nhân và tập thể xuất sắc', createdAt: new Date().toISOString() },
  { id: 'cat-4', name: 'Công nghệ in mới', slug: 'cong-nghe-in-moi', type: 'post', description: 'Dây chuyền in Offset, KTS và máy móc hiện đại', createdAt: new Date().toISOString() },
  { id: 'cat-5', name: 'Thông báo doanh nghiệp', slug: 'thong-bao-doanh-nghiep', type: 'post', description: 'Thông báo chính thức và văn bản quy định', createdAt: new Date().toISOString() },
  { id: 'cat-6', name: 'Văn hoá doanh nghiệp', slug: 'van-hoa-doanh-nghiep', type: 'post', description: 'Hoạt động cộng đồng và giá trị cốt lõi', createdAt: new Date().toISOString() }
];

const INITIAL_LOCAL_USERS: CMSUser[] = [
  {
    uid: 'demo-admin-id',
    email: 'admin@intaichinh.vn',
    fullName: 'Quản Trị Viên Trưởng',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  },
  {
    uid: 'demo-approver-id',
    email: 'duyetbai@intaichinh.vn',
    fullName: 'Người Duyệt Bài & Xuất Bản',
    role: 'approver',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    uid: 'demo-editor-id',
    email: 'bientap@intaichinh.vn',
    fullName: 'Biên Tập Viên Nội Dung',
    role: 'editor',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState<typeof COMPANY_INFO>(COMPANY_INFO);
  const [statistics, setStatistics] = useState<typeof STATISTICS>(STATISTICS);
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [services, setServices] = useState<ServiceItem[]>(SERVICE_ITEMS);
  const [technologies, setTechnologies] = useState<TechnologyItem[]>(TECHNOLOGIES);
  const [gallery, setGallery] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [vacancies, setVacancies] = useState<JobVacancy[]>(VACANCIES);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [categories, setCategories] = useState<CMSCategory[]>(DEFAULT_CATEGORIES);
  const [mediaList, setMediaList] = useState<CMSMedia[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [users, setUsers] = useState<CMSUser[]>(INITIAL_LOCAL_USERS);
  const [brand, setBrand] = useState<CMSBrand>(DEFAULT_BRAND);
  const [seo, setSEO] = useState<CMSSEO>(DEFAULT_SEO);
  const [auditLogs, setAuditLogs] = useState<CMSAuditLog[]>([]);
  const [activeSessions, setActiveSessions] = useState<CMSSession[]>([]);

  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<CMSUser | null>(null);
  const [supabaseConnected, setSupabaseConnected] = useState(isSupabaseConfigured);

  const supabase = getSupabaseClient();

  // Helper: map Supabase Profile to CMSUser
  const mapProfileToUser = (p: any): CMSUser => ({
    uid: p.id,
    email: p.email,
    fullName: p.full_name || p.email?.split('@')[0] || 'Người dùng',
    role: (p.role as UserRole) || 'editor',
    status: p.status || 'active',
    avatarUrl: p.avatar_url,
    createdAt: p.created_at || new Date().toISOString(),
    lastLoginAt: p.updated_at
  });

  // Helper: map Supabase news_articles row to NewsPost
  const mapArticleFromDb = (item: any): NewsPost => ({
    id: item.id,
    title: item.title || '',
    subtitle: item.summary || '',
    content: item.content || '',
    category: item.category || 'Hoạt động sản xuất',
    imageUrl: item.image || '/src/assets/images/printing_hero_1779242674142.png',
    videoUrl: item.video_url || undefined,
    isPinned: Boolean(item.featured),
    author: item.author || 'Ban Biên Tập',
    status: (item.status as ArticleWorkflowStatus) || 'draft',
    rejectionReason: item.reject_reason || '',
    createdBy: item.author_id,
    reviewedBy: item.reviewed_by,
    publishedAt: item.published_at,
    viewsCount: item.views || 0,
    createdAt: item.created_at || new Date().toISOString()
  });

  // Dedicated helper to refresh news from Supabase news_articles
  const loadNewsFromSupabase = async (): Promise<NewsPost[]> => {
    if (!supabase) return [];
    const { data: newsData, error: newsErr } = await supabase
      .from('news_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (newsErr) {
      console.error('Lỗi khi đọc bảng news_articles từ Supabase:', newsErr);
      throw new Error(`Lỗi tải dữ liệu Supabase: ${newsErr.message}`);
    }

    const mappedNews: NewsPost[] = (newsData || []).map(mapArticleFromDb);
    setNews(mappedNews);
    return mappedNews;
  };

  // Fetch Supabase data when connected
  const loadSupabaseData = async () => {
    if (!supabase) return;
    try {
      // 1. Fetch News
      await loadNewsFromSupabase();

      // 2. Fetch Gallery
      const { data: galleryData, error: galErr } = await supabase
        .from('gallery_items')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (!galErr && galleryData && galleryData.length > 0) {
        const mappedGal: GalleryItem[] = galleryData.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          image: item.image_url
        }));
        setGallery(mappedGal);
      }

      // 3. Fetch Profiles / Users
      const { data: profilesData, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!profErr && profilesData && profilesData.length > 0) {
        setUsers(profilesData.map(mapProfileToUser));
      }

      // 4. Fetch Audit Logs
      const { data: logsData, error: logErr } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!logErr && logsData && logsData.length > 0) {
        setAuditLogs(logsData.map((l: any) => ({
          id: l.id,
          timestamp: l.created_at,
          userId: l.user_id || 'unknown',
          userEmail: l.user_email || 'unknown',
          userName: l.user_name || 'Hệ thống',
          userRole: (l.user_role as UserRole) || 'editor',
          action: l.action,
          target: l.target,
          details: l.details || '',
          ipAddress: 'Supabase Server',
          userAgent: 'Web App',
          status: l.status || 'success'
        })));
      }

      setSupabaseConnected(true);
    } catch (err: any) {
      console.error('Supabase load data error:', err);
    }
  };

  // Auth state listener
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      if (supabase && isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Load user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setCurrentUser(mapProfileToUser(profile));
            } else {
              setCurrentUser({
                uid: session.user.id,
                email: session.user.email || '',
                fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Quản Trị Viên',
                role: (session.user.user_metadata?.role as UserRole) || 'admin',
                status: 'active',
                createdAt: session.user.created_at
              });
            }
          }

          // Listen to auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (profile) {
                setCurrentUser(mapProfileToUser(profile));
              } else {
                setCurrentUser({
                  uid: session.user.id,
                  email: session.user.email || '',
                  fullName: session.user.user_metadata?.full_name || 'Người Dùng CMS',
                  role: (session.user.user_metadata?.role as UserRole) || 'editor',
                  status: 'active',
                  createdAt: session.user.created_at
                });
              }
            } else {
              setCurrentUser(null);
            }
          });

          await loadSupabaseData();
        } catch (error) {
          console.error('Supabase auth initialization error:', error);
        }
      }
      setIsInitialized(true);
      setLoading(false);
    };

    initAuth();
  }, []);

  // Compute permissions & roles
  const userRole = currentUser?.role || null;
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const isApprover = isAdmin || userRole === 'approver';
  const isEditor = isApprover || userRole === 'editor';
  const adminEmail = currentUser?.email || null;

  const hasPermission = (permission: 'manage_users' | 'publish_post' | 'review_post' | 'edit_post' | 'upload_media' | 'manage_gallery'): boolean => {
    if (!currentUser) return false;
    if (isAdmin) return true;
    if (permission === 'manage_users') return isAdmin;
    if (permission === 'publish_post' || permission === 'review_post') return isApprover;
    if (permission === 'edit_post' || permission === 'upload_media' || permission === 'manage_gallery') return isEditor;
    return false;
  };

  // Add Audit Log
  const addAuditLog = async (action: string, target: string, details: string, status: 'success' | 'failure' = 'success') => {
    const newLog: CMSAuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      userId: currentUser?.uid || 'guest',
      userEmail: currentUser?.email || 'unauthenticated',
      userName: currentUser?.fullName || 'Khách',
      userRole: currentUser?.role || 'editor',
      action,
      target,
      details,
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent,
      status
    };

    setAuditLogs(prev => [newLog, ...prev]);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('audit_logs').insert([{
          user_id: currentUser?.uid ? currentUser.uid : null,
          user_email: currentUser?.email,
          user_name: currentUser?.fullName,
          user_role: currentUser?.role,
          action,
          target,
          details,
          status
        }]);
      } catch (e) {
        console.warn('Failed to write remote audit log:', e);
      }
    }
  };

  // Auth: Login
  const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // 1. Try Supabase Auth first
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile?.status === 'locked') {
            await supabase.auth.signOut();
            return { success: false, error: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản trị viên.' };
          }

          if (profile) {
            setCurrentUser(mapProfileToUser(profile));
          }
          await addAuditLog('Đăng nhập Supabase', 'Authentication', `Đăng nhập thành công với email ${email}`);
          return { success: true };
        }
      } catch (err: any) {
        console.error('Supabase Login Error:', err);
        return { success: false, error: err.message || 'Lỗi xác thực Supabase' };
      }
    }

    // 2. Fallback local / demo authentication
    const trimmedEmail = email.trim().toLowerCase();
    const matched = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (matched) {
      if (matched.status === 'locked') {
        return { success: false, error: 'Tài khoản đã bị tạm khóa bởi Quản trị viên.' };
      }
      setCurrentUser(matched);
      await addAuditLog('Đăng nhập CMS (Demo Mode)', 'Authentication', `Đăng nhập vai trò ${matched.role}`);
      return { success: true };
    }

    // Auto-create local admin if default admin email provided
    if (trimmedEmail.includes('admin') || trimmedEmail === 'xnitchcm@gmail.com') {
      const demoUser: CMSUser = {
        uid: 'user-' + Date.now(),
        email: trimmedEmail,
        fullName: 'Quản Trị Viên',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      setUsers(prev => [demoUser, ...prev]);
      setCurrentUser(demoUser);
      return { success: true };
    }

    return { success: false, error: 'Email hoặc mật khẩu không chính xác. Hãy kiểm tra thông tin hoặc cấu hình Supabase.' };
  };

  // Auth: Register new user (Admin creates user)
  const registerUser = async (email: string, password: string, fullName: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin) {
      return { success: false, error: 'Chỉ Quản trị viên mới có quyền tạo tài khoản mới.' };
    }

    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role
            }
          }
        });

        if (error) return { success: false, error: error.message };

        if (data.user) {
          // Update profile in profiles table
          await supabase.from('profiles').upsert([{
            id: data.user.id,
            email,
            full_name: fullName,
            role,
            status: 'active'
          }]);

          await addAuditLog('Tạo tài khoản mới', 'User Management', `Tạo user ${email} với vai trò ${role}`);
          await loadSupabaseData();
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Local fallback
    const newUser: CMSUser = {
      uid: 'user-' + Date.now(),
      email,
      fullName,
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [newUser, ...prev]);
    await addAuditLog('Tạo tài khoản (Local)', 'User Management', `Tạo user ${email} (${role})`);
    return { success: true };
  };

  // Auth: Logout
  const logoutAdmin = async () => {
    await addAuditLog('Đăng xuất', 'Authentication', `Người dùng ${currentUser?.email} đăng xuất khỏi hệ thống`);
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    setCurrentUser(null);
  };

  // Password reset request
  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (supabase && isSupabaseConfigured) {
      const redirectUrl = typeof window !== 'undefined' && window.location?.origin
        ? `${window.location.origin}/admin/reset-password`
        : '/admin/reset-password';

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
    return { success: true };
  };

  // Password reset update
  const updateUserPassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { success: false, error: error.message };
      await addAuditLog('Cập nhật mật khẩu', 'Authentication', 'Người dùng cập nhật mật khẩu mới qua link khôi phục');
      return { success: true };
    }
    return { success: true };
  };

  // Update user role
  const updateUserRole = async (uid: string, newRole: UserRole) => {
    if (!isAdmin) throw new Error('Chỉ Quản trị viên mới có thể thay đổi phân quyền.');
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    if (currentUser?.uid === uid) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
    }
    if (supabase && isSupabaseConfigured) {
      await supabase.from('profiles').update({ role: newRole, updated_at: new Date().toISOString() }).eq('id', uid);
    }
    await addAuditLog('Đổi phân quyền', 'User Management', `Đổi vai trò user ${uid} sang ${newRole}`);
  };

  // Toggle user active/locked status
  const toggleUserStatus = async (uid: string, currentStatus: 'active' | 'locked') => {
    if (!isAdmin) throw new Error('Chỉ Quản trị viên mới có thể khóa hoặc mở khóa tài khoản.');
    const nextStatus = currentStatus === 'active' ? 'locked' : 'active';
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, status: nextStatus } : u));
    if (supabase && isSupabaseConfigured) {
      await supabase.from('profiles').update({ status: nextStatus, updated_at: new Date().toISOString() }).eq('id', uid);
    }
    await addAuditLog('Thay đổi trạng thái tài khoản', 'User Management', `${nextStatus === 'locked' ? 'Khóa' : 'Mở khóa'} tài khoản ${uid}`);
  };

  // Delete user account
  const deleteUserAccount = async (uid: string) => {
    if (!isAdmin) throw new Error('Chỉ Quản trị viên mới có thể xóa tài khoản.');
    setUsers(prev => prev.filter(u => u.uid !== uid));
    if (supabase && isSupabaseConfigured) {
      await supabase.from('profiles').delete().eq('id', uid);
    }
    await addAuditLog('Xóa tài khoản', 'User Management', `Xóa tài khoản ${uid}`);
  };

  // Real Supabase Storage File Upload
  const uploadMediaFile = async (file: File, folder: string = 'posts'): Promise<string> => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('Chưa cấu hình kết nối Supabase Storage.');
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${folder}/${Date.now()}_${cleanName}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      throw new Error(`Lỗi tải ảnh lên Supabase Storage (bucket "media"): ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);

    // Add to media library list
    const newMedia: CMSMedia = {
      id: 'media-' + Date.now(),
      title: file.name,
      url: publicUrl,
      type: file.type.startsWith('video') ? 'video' : 'image',
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      category: folder,
      createdAt: new Date().toISOString(),
      uploadedBy: currentUser?.fullName || 'Quản trị viên'
    };
    setMediaList(prev => [newMedia, ...prev]);

    await addAuditLog('Tải lên tệp Media', 'Storage', `Tải lên tệp ${file.name} vào thư mục ${folder}`);
    return publicUrl;
  };

  // News Workflow: Create / Update backed strictly by public.news_articles
  const saveNewsPost = async (post: Partial<NewsPost>): Promise<NewsPost> => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('Chưa kết nối Supabase. Vui lòng kiểm tra lại cấu hình.');
    }

    // 1. Determine UUID
    const isNew = !post.id || post.id.startsWith('news-') || post.id.startsWith('tin-');
    const postId = isNew ? crypto.randomUUID() : (post.id as string);

    // 2. Author ID from logged in user
    let authorId = currentUser?.uid;
    if (!authorId) {
      const { data: authData } = await supabase.auth.getUser();
      authorId = authData?.user?.id;
    }

    // 3. Determine workflow status
    let targetStatus: ArticleWorkflowStatus = post.status || 'draft';
    if (!isApprover && targetStatus === 'published') {
      targetStatus = 'pending_review';
    }

    const generatedSlug = (post.title ? slugify(post.title) : 'bai-viet') + '-' + postId.slice(0, 8);
    const publishedAtValue = targetStatus === 'published' 
      ? (post.publishedAt || new Date().toISOString()) 
      : null;

    // 4. Strict DB Payload matching public.news_articles
    const dbPayload = {
      id: postId,
      title: post.title?.trim() || 'Bài viết không tiêu đề',
      slug: (post as any).slug || generatedSlug,
      category: post.category || 'Hoạt động sản xuất',
      summary: post.subtitle || (post as any).summary || '',
      content: post.content || '',
      image: post.imageUrl || (post as any).image || '',
      author: post.author || currentUser?.fullName || 'Ban Biên Tập',
      author_id: authorId || null,
      status: targetStatus,
      views: post.viewsCount || (post as any).views || 0,
      featured: Boolean(post.isPinned || (post as any).featured),
      reject_reason: post.rejectionReason || (post as any).reject_reason || null,
      published_at: publishedAtValue,
      updated_at: new Date().toISOString()
    };

    // 5. Execute DB Upsert
    const { error: upsertError } = await supabase
      .from('news_articles')
      .upsert([dbPayload], { onConflict: 'id' });

    if (upsertError) {
      console.error('Lỗi khi lưu bài viết lên Supabase news_articles:', upsertError);
      throw new Error(`Lỗi Supabase: ${upsertError.message || JSON.stringify(upsertError)}`);
    }

    // 6. Reload from Supabase
    await loadNewsFromSupabase();

    await addAuditLog(
      isNew ? 'Tạo bài viết' : 'Cập nhật bài viết', 
      'News Management', 
      `Bài: "${dbPayload.title}" - Trạng thái: ${dbPayload.status}`
    );

    return mapArticleFromDb(dbPayload);
  };

  // Submit article for review (Editor action)
  const submitNewsForReview = async (id: string) => {
    if (!supabase || !isSupabaseConfigured) throw new Error('Chưa kết nối Supabase.');

    const { error } = await supabase
      .from('news_articles')
      .update({ 
        status: 'pending_review', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      console.error('Lỗi gửi duyệt bài viết:', error);
      throw new Error(`Lỗi Supabase: ${error.message}`);
    }

    await loadNewsFromSupabase();
    await addAuditLog('Gửi duyệt bài viết', 'News Workflow', `Gửi duyệt bài ID ${id}`);
  };

  // Approve & Publish article (Approver / Admin action)
  const approveAndPublishNews = async (id: string) => {
    if (!isApprover) throw new Error('Bạn không có quyền duyệt bài viết.');
    if (!supabase || !isSupabaseConfigured) throw new Error('Chưa kết nối Supabase.');

    const { error } = await supabase
      .from('news_articles')
      .update({ 
        status: 'published', 
        published_at: new Date().toISOString(),
        reject_reason: null,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      console.error('Lỗi duyệt bài viết:', error);
      throw new Error(`Lỗi Supabase: ${error.message}`);
    }

    await loadNewsFromSupabase();
    await addAuditLog('Duyệt & Xuất bản bài viết', 'News Workflow', `Đã duyệt và công khai bài ID ${id}`);
  };

  // Reject article with reason (Approver / Admin action)
  const rejectNewsPost = async (id: string, reason: string) => {
    if (!isApprover) throw new Error('Bạn không có quyền từ chối duyệt bài.');
    if (!supabase || !isSupabaseConfigured) throw new Error('Chưa kết nối Supabase.');

    const { error } = await supabase
      .from('news_articles')
      .update({ 
        status: 'revision_requested', 
        reject_reason: reason,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      console.error('Lỗi từ chối bài viết:', error);
      throw new Error(`Lỗi Supabase: ${error.message}`);
    }

    await loadNewsFromSupabase();
    await addAuditLog('Từ chối bài viết', 'News Workflow', `Yêu cầu sửa lại bài ID ${id}. Lý do: ${reason}`);
  };

  // Hide article (Approver / Admin action)
  const hideNewsPost = async (id: string) => {
    if (!isApprover) throw new Error('Bạn không có quyền ẩn bài viết.');
    if (!supabase || !isSupabaseConfigured) throw new Error('Chưa kết nối Supabase.');

    const { error } = await supabase
      .from('news_articles')
      .update({ 
        status: 'hidden', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      console.error('Lỗi ẩn bài viết:', error);
      throw new Error(`Lỗi Supabase: ${error.message}`);
    }

    await loadNewsFromSupabase();
    await addAuditLog('Ẩn bài viết', 'News Workflow', `Đã ẩn bài ID ${id} khỏi trang công chúng`);
  };

  // Delete article
  const deleteNewsPost = async (id: string) => {
    if (!isApprover) throw new Error('Bạn không có quyền xóa bài viết.');
    if (!supabase || !isSupabaseConfigured) throw new Error('Chưa kết nối Supabase.');

    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Lỗi xóa bài viết:', error);
      throw new Error(`Lỗi Supabase: ${error.message}`);
    }

    await loadNewsFromSupabase();
    await addAuditLog('Xóa bài viết', 'News Management', `Đã xóa vĩnh viễn bài ID ${id}`);
  };

  // Gallery: Save / Replace Item
  const saveGalleryItem = async (item: GalleryItem, status: ArticleWorkflowStatus = 'published') => {
    const isNew = !gallery.some(g => g.id === item.id);
    setGallery(prev => {
      const exists = prev.some(g => g.id === item.id);
      if (exists) {
        return prev.map(g => g.id === item.id ? item : g);
      }
      return [item, ...prev];
    });

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('gallery_items').upsert([{
          id: item.id.includes('-') && !item.id.startsWith('gal-') ? item.id : undefined,
          title: item.title,
          category: item.category,
          image_url: item.image,
          status,
          updated_at: new Date().toISOString()
        }]);
      } catch (e) {
        console.warn('Gallery Supabase sync warning:', e);
      }
    }

    await addAuditLog(
      isNew ? 'Thêm ảnh thư viện' : 'Cập nhật/Thay thế ảnh thư viện',
      'Gallery Management',
      `Ảnh: "${item.title}" (${item.category})`
    );
  };

  // Gallery: Reorder
  const reorderGalleryItems = async (items: GalleryItem[]) => {
    setGallery(items);
    if (supabase && isSupabaseConfigured) {
      try {
        const updates = items.map((item, index) => 
          supabase.from('gallery_items').update({ display_order: index }).eq('id', item.id)
        );
        await Promise.all(updates);
      } catch (e) {
        console.warn('Reorder gallery sync warning:', e);
      }
    }
    await addAuditLog('Sắp xếp lại thư viện ảnh', 'Gallery Management', `Cập nhật thứ tự hiển thị cho ${items.length} hình ảnh`);
  };

  // Gallery: Delete
  const deleteGalleryItem = async (id: string) => {
    if (!isApprover) throw new Error('Bạn không có quyền xóa ảnh thư viện.');
    setGallery(prev => prev.filter(g => g.id !== id));
    if (supabase && isSupabaseConfigured) {
      await supabase.from('gallery_items').delete().eq('id', id);
    }
    await addAuditLog('Xóa ảnh thư viện', 'Gallery Management', `Đã xóa ảnh ID ${id}`);
  };

  // Public entity management helpers
  const saveCompanyInfo = async (info: typeof COMPANY_INFO) => setCompanyInfo(info);
  const saveStatistics = async (stats: typeof STATISTICS) => setStatistics(stats);
  const saveSlides = async (newSlides: HeroSlide[]) => setSlides(newSlides);
  const saveBrand = async (newBrand: CMSBrand) => setBrand(newBrand);
  const saveSEO = async (newSEO: CMSSEO) => setSEO(newSEO);
  
  const saveService = async (service: ServiceItem) => {
    setServices(prev => {
      const exists = prev.some(s => s.id === service.id);
      return exists ? prev.map(s => s.id === service.id ? service : s) : [service, ...prev];
    });
  };
  const deleteService = async (id: string) => setServices(prev => prev.filter(s => s.id !== id));

  const saveTechnology = async (tech: TechnologyItem) => {
    setTechnologies(prev => {
      const exists = prev.some(t => t.id === tech.id);
      return exists ? prev.map(t => t.id === tech.id ? tech : t) : [tech, ...prev];
    });
  };
  const deleteTechnology = async (id: string) => setTechnologies(prev => prev.filter(t => t.id !== id));

  const saveVacancy = async (vac: JobVacancy) => {
    setVacancies(prev => {
      const exists = prev.some(v => v.id === vac.id);
      return exists ? prev.map(v => v.id === vac.id ? vac : v) : [vac, ...prev];
    });
  };
  const deleteVacancy = async (id: string) => setVacancies(prev => prev.filter(v => v.id !== id));

  const saveCategory = async (cat: CMSCategory) => {
    setCategories(prev => {
      const exists = prev.some(c => c.id === cat.id);
      return exists ? prev.map(c => c.id === cat.id ? cat : c) : [cat, ...prev];
    });
  };
  const deleteCategory = async (id: string) => setCategories(prev => prev.filter(c => c.id !== id));

  const saveMedia = async (med: CMSMedia) => {
    setMediaList(prev => [med, ...prev]);
  };
  const deleteMedia = async (id: string) => setMediaList(prev => prev.filter(m => m.id !== id));

  const saveQuote = async (quote: QuoteRequest) => {
    setQuotes(prev => [quote, ...prev]);
  };
  const deleteQuote = async (id: string) => setQuotes(prev => prev.filter(q => q.id !== id));

  return (
    <CMSContext.Provider
      value={{
        companyInfo,
        statistics,
        slides,
        services,
        technologies,
        gallery,
        vacancies,
        news,
        categories,
        mediaList,
        quotes,
        users,
        brand,
        seo,
        auditLogs,
        activeSessions,

        loading,
        isInitialized,
        currentUser,
        isAdmin,
        isApprover,
        isEditor,
        userRole,
        adminEmail,
        supabaseConnected,

        loginAdmin,
        registerUser,
        logoutAdmin,
        requestPasswordReset,
        updateUserPassword,
        updateUserRole,
        toggleUserStatus,
        deleteUserAccount,
        hasPermission,

        uploadMediaFile,
        saveNewsPost,
        submitNewsForReview,
        approveAndPublishNews,
        rejectNewsPost,
        hideNewsPost,
        deleteNewsPost,

        saveGalleryItem,
        reorderGalleryItems,
        deleteGalleryItem,

        saveCompanyInfo,
        saveStatistics,
        saveSlides,
        saveBrand,
        saveSEO,
        saveService,
        deleteService,
        saveTechnology,
        deleteTechnology,
        saveVacancy,
        deleteVacancy,
        saveCategory,
        deleteCategory,
        saveMedia,
        deleteMedia,
        saveQuote,
        deleteQuote,

        addAuditLog,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
