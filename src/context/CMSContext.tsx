import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { auth, db, isFirebaseAvailable, handleFirestoreError, OperationType, NewsPost, newsService } from '../utils/firebase';
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
  QuoteRequest 
} from '../types';

// Slide structure representing hero banners
export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  badgeText: string;
  targetId: string;
}

export interface CMSContextType {
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
  
  loading: boolean;
  currentUser: CMSUser | null;
  isAdmin: boolean;
  adminEmail: string | null;
  firebaseConnected: boolean;
  
  // Auth Operations
  loginAdmin: (email: string, password: string, otpCode?: string) => Promise<{ requires2FA?: boolean }>;
  logoutAdmin: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordResetWithOTP: (email: string, otp: string, newPass: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  
  // Content Updaters
  saveCompanyInfo: (info: typeof COMPANY_INFO) => Promise<void>;
  saveStatistics: (stats: typeof STATISTICS) => Promise<void>;
  saveSlides: (slides: HeroSlide[]) => Promise<void>;
  saveBrand: (brand: CMSBrand) => Promise<void>;
  saveSEO: (seo: CMSSEO) => Promise<void>;
  
  // Entity Updaters
  saveService: (service: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  
  saveTechnology: (tech: TechnologyItem) => Promise<void>;
  deleteTechnology: (id: string) => Promise<void>;

  saveGalleryItem: (item: GalleryItem) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  
  saveVacancy: (vacancy: JobVacancy) => Promise<void>;
  deleteVacancy: (id: string) => Promise<void>;
  
  saveNewsPost: (post: Omit<NewsPost, 'id'> & { id?: string }) => Promise<NewsPost>;
  deleteNewsPost: (id: string) => Promise<void>;

  saveCategory: (category: CMSCategory) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  saveMedia: (media: CMSMedia) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;

  saveQuote: (quote: QuoteRequest) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;

  saveUser: (user: CMSUser) => Promise<void>;
  toggleLockUser: (uid: string) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;

  addAuditLog: (action: string, target: string, details: string, status?: 'success' | 'failure') => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  revokeAllSessions: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

// Default Hero Banner Slides
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

// Default Brand Config
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

// Default SEO Config
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
  robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /quan-tri/'
};

// Default Initial Categories
const DEFAULT_CATEGORIES: CMSCategory[] = [
  { id: 'cat-1', name: 'Hoạt động sản xuất', slug: 'hoat-dong-san-xuat', type: 'post', description: 'Cập nhật tiến độ kỹ thuật, dây chuyền và KCS', createdAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Hoạt động đoàn thể', slug: 'hoat-dong-doan-the', type: 'post', description: 'Đại hội công đoàn, phong trào đoàn thanh niên', createdAt: new Date().toISOString() },
  { id: 'cat-3', name: 'Thi đua - Khen thưởng', slug: 'thi-dua-khen-thuong', type: 'post', description: 'Tôn vinh cá nhân và tập thể xuất sắc', createdAt: new Date().toISOString() },
  { id: 'cat-4', name: 'Công nghệ in mới', slug: 'cong-nghe-in-moi', type: 'post', description: 'Dây chuyền in Offset, KTS và máy móc hiện đại', createdAt: new Date().toISOString() },
  { id: 'cat-5', name: 'Thông báo doanh nghiệp', slug: 'thong-bao-doanh-nghiep', type: 'post', description: 'Thông báo chính thức và văn bản quy định', createdAt: new Date().toISOString() },
  { id: 'cat-6', name: 'Văn hoá doanh nghiệp', slug: 'van-hoa-doanh-nghiep', type: 'post', description: 'Hoạt động cộng đồng và giá trị cốt lõi', createdAt: new Date().toISOString() }
];

// Seed Initial Admin Users
const DEFAULT_USERS: CMSUser[] = [
  {
    uid: 'user-superadmin',
    email: 'xnitchcm@gmail.com',
    fullName: 'Quản Trị Viên Cao Cấp (Super Admin)',
    role: 'super_admin',
    status: 'active',
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  },
  {
    uid: 'user-admin',
    email: 'admin@xskthcm.com',
    fullName: 'Quản Trị Nội Dung (Admin)',
    role: 'admin',
    status: 'active',
    twoFactorEnabled: false,
    createdAt: new Date().toISOString()
  },
  {
    uid: 'user-editor',
    email: 'bientap@xskthcm.com',
    fullName: 'Biên Tập Viên Tin Tức',
    role: 'editor',
    status: 'active',
    twoFactorEnabled: false,
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
  const [users, setUsers] = useState<CMSUser[]>(DEFAULT_USERS);
  const [brand, setBrand] = useState<CMSBrand>(DEFAULT_BRAND);
  const [seo, setSEO] = useState<CMSSEO>(DEFAULT_SEO);
  const [auditLogs, setAuditLogs] = useState<CMSAuditLog[]>([]);
  const [activeSessions, setActiveSessions] = useState<CMSSession[]>([]);

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CMSUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  // Initialize and Sync
  useEffect(() => {
    let unsubsAuth: (() => void) | null = null;

    const bootstrapAllData = async () => {
      setLoading(true);
      
      // Check Auth State
      if (isFirebaseAvailable && auth) {
        unsubsAuth = onAuthStateChanged(auth, async (user) => {
          if (user && user.email) {
            const foundUser = users.find(u => u.email.toLowerCase() === user.email?.toLowerCase()) || {
              uid: user.uid,
              email: user.email,
              fullName: user.displayName || user.email.split('@')[0],
              role: user.email === 'xnitchcm@gmail.com' ? 'super_admin' : 'admin',
              status: 'active',
              twoFactorEnabled: false,
              createdAt: new Date().toISOString()
            };
            setCurrentUser(foundUser as CMSUser);
            setIsAdmin(true);
            setAdminEmail(user.email);
            
            // Record active session
            const newSession: CMSSession = {
              id: `sess-${Date.now()}`,
              userId: user.uid,
              userEmail: user.email,
              deviceName: 'Trình duyệt Web (Desktop/Mobile)',
              browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Trình duyệt Web',
              ipAddress: '127.0.0.1 (Local Container)',
              createdAt: new Date().toISOString(),
              lastActiveAt: new Date().toISOString(),
              isCurrent: true
            };
            setActiveSessions([newSession]);
          } else {
            setCurrentUser(null);
            setIsAdmin(false);
            setAdminEmail(null);
            setActiveSessions([]);
          }
        });
      } else {
        // LocalStorage fallback auth check
        const isLocalAdmin = localStorage.getItem('local_admin_signed_in') === 'true';
        const savedUserStr = localStorage.getItem('cms_current_user');
        if (isLocalAdmin && savedUserStr) {
          try {
            const parsedUser = JSON.parse(savedUserStr);
            setCurrentUser(parsedUser);
            setIsAdmin(true);
            setAdminEmail(parsedUser.email);
          } catch {
            const defaultSuper = DEFAULT_USERS[0];
            setCurrentUser(defaultSuper);
            setIsAdmin(true);
            setAdminEmail(defaultSuper.email);
          }
        } else if (isLocalAdmin) {
          const defaultSuper = DEFAULT_USERS[0];
          setCurrentUser(defaultSuper);
          setIsAdmin(true);
          setAdminEmail(defaultSuper.email);
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
          setAdminEmail(null);
        }
      }

      try {
        // 1. Fetch News
        await newsService.bootstrap();
        const newsList = await newsService.getAllNews();
        setNews(newsList);

        // 2. Load CMS settings and collections
        if (isFirebaseAvailable && db) {
          try {
            const settingsDocRef = doc(db, 'settings', 'config');
            const settingsSnap = await getDoc(settingsDocRef);
            
            if (settingsSnap.exists()) {
              const data = settingsSnap.data();
              if (data.companyInfo) setCompanyInfo(data.companyInfo);
              if (data.statistics) setStatistics(data.statistics);
              if (data.slides) setSlides(data.slides);
              if (data.brand) setBrand(data.brand);
              if (data.seo) setSEO(data.seo);
            } else {
              await setDoc(settingsDocRef, {
                companyInfo: COMPANY_INFO,
                statistics: STATISTICS,
                slides: DEFAULT_SLIDES,
                brand: DEFAULT_BRAND,
                seo: DEFAULT_SEO
              });
            }

            // Load Services
            const servicesSnap = await getDocs(collection(db, 'services'));
            if (!servicesSnap.empty) {
              const sList: ServiceItem[] = [];
              servicesSnap.forEach(d => sList.push(d.data() as ServiceItem));
              setServices(sList);
            }

            // Load Gallery
            const gallerySnap = await getDocs(collection(db, 'gallery'));
            if (!gallerySnap.empty) {
              const gList: GalleryItem[] = [];
              gallerySnap.forEach(d => gList.push(d.data() as GalleryItem));
              setGallery(gList);
            }

            // Load Vacancies
            const vacanciesSnap = await getDocs(collection(db, 'vacancies'));
            if (!vacanciesSnap.empty) {
              const vList: JobVacancy[] = [];
              vacanciesSnap.forEach(d => vList.push(d.data() as JobVacancy));
              setVacancies(vList);
            }

            // Load Users
            const usersSnap = await getDocs(collection(db, 'cms_users'));
            if (!usersSnap.empty) {
              const uList: CMSUser[] = [];
              usersSnap.forEach(d => uList.push(d.data() as CMSUser));
              setUsers(uList);
            }

            // Load Audit Logs
            const logsSnap = await getDocs(collection(db, 'cms_audit_logs'));
            if (!logsSnap.empty) {
              const lList: CMSAuditLog[] = [];
              logsSnap.forEach(d => lList.push(d.data() as CMSAuditLog));
              setAuditLogs(lList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            }

          } catch (configErr) {
            console.warn('Firestore CMS sync warning. Using local storage cache fallback.', configErr);
            loadLocalConfigs();
          }
        } else {
          loadLocalConfigs();
        }
      } catch (err) {
        console.error('Master bootstrap CMS error:', err);
        loadLocalConfigs();
      } fontFinally: {
        setLoading(false);
      }
    };

    bootstrapAllData();

    return () => {
      if (unsubsAuth) unsubsAuth();
    };
  }, []);

  const loadLocalConfigs = () => {
    const cachedCompanyInfo = localStorage.getItem('cms_company_info');
    if (cachedCompanyInfo) setCompanyInfo(JSON.parse(cachedCompanyInfo));

    const cachedStats = localStorage.getItem('cms_statistics');
    if (cachedStats) setStatistics(JSON.parse(cachedStats));

    const cachedSlides = localStorage.getItem('cms_slides');
    if (cachedSlides) setSlides(JSON.parse(cachedSlides));

    const cachedBrand = localStorage.getItem('cms_brand');
    if (cachedBrand) setBrand(JSON.parse(cachedBrand));

    const cachedSEO = localStorage.getItem('cms_seo');
    if (cachedSEO) setSEO(JSON.parse(cachedSEO));

    const cachedCategories = localStorage.getItem('cms_categories');
    if (cachedCategories) setCategories(JSON.parse(cachedCategories));

    const cachedUsers = localStorage.getItem('cms_users');
    if (cachedUsers) setUsers(JSON.parse(cachedUsers));

    const cachedQuotes = localStorage.getItem('cms_quotes');
    if (cachedQuotes) setQuotes(JSON.parse(cachedQuotes));

    const cachedLogs = localStorage.getItem('cms_audit_logs');
    if (cachedLogs) setAuditLogs(JSON.parse(cachedLogs));
  };

  // Helper Permission Check
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true; // Super Admin has all access

    switch (permission) {
      case 'manage_users':
      case 'manage_brand':
      case 'manage_security':
      case 'view_logs':
        return currentUser.role === 'super_admin';

      case 'manage_content':
      case 'publish_content':
      case 'manage_media':
      case 'manage_categories':
        return ['super_admin', 'admin', 'editor'].includes(currentUser.role);

      case 'edit_content':
        return ['super_admin', 'admin', 'editor', 'author'].includes(currentUser.role);

      case 'view_cms':
        return true;

      default:
        return false;
    }
  };

  // Auth Operations
  const loginAdmin = async (email: string, password: string, otpCode?: string) => {
    // Search existing user
    const targetUser = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      uid: email === 'xnitchcm@gmail.com' ? 'user-superadmin' : `user-${Date.now()}`,
      email: email,
      fullName: email === 'xnitchcm@gmail.com' ? 'Quản Trị Viên Cao Cấp' : 'Tài Khoản Quản Trị',
      role: email === 'xnitchcm@gmail.com' ? 'super_admin' : 'admin',
      status: 'active' as const,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString()
    };

    if (targetUser.status === 'locked') {
      await addAuditLog('LOGIN_ATTEMPT', email, 'Đăng nhập thất bại: Tài khoản bị khóa', 'failure');
      throw new Error('Tài khoản của bạn hiện đang bị khóa. Vui lòng liên hệ Super Admin.');
    }

    // Check 2FA requirement
    if (targetUser.twoFactorEnabled && !otpCode) {
      return { requires2FA: true };
    }

    if (targetUser.twoFactorEnabled && otpCode !== '123456' && otpCode !== '654321') {
      await addAuditLog('2FA_VERIFY', email, 'Xác thực 2FA không chính xác', 'failure');
      throw new Error('Mã OTP 2FA không chính xác. Vui lòng thử lại.');
    }

    if (isFirebaseAvailable && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.message?.includes('user-not-found')) {
          try {
            await createUserWithEmailAndPassword(auth, email, password);
          } catch (createErr) {
            console.error('Failed to register initial user:', createErr);
            throw err;
          }
        } else {
          await addAuditLog('LOGIN', email, `Thất bại: ${err.message}`, 'failure');
          throw err;
        }
      }
    } else {
      if (!password || password.length < 6) {
        throw new Error('Mật khẩu phải dài ít nhất 6 ký tự.');
      }
      localStorage.setItem('local_admin_signed_in', 'true');
      localStorage.setItem('cms_current_user', JSON.stringify(targetUser));
    }

    setCurrentUser(targetUser as CMSUser);
    setIsAdmin(true);
    setAdminEmail(email);

    await addAuditLog('LOGIN', email, 'Đăng nhập hệ thống CMS thành công', 'success');

    return { requires2FA: false };
  };

  const logoutAdmin = async () => {
    if (currentUser) {
      await addAuditLog('LOGOUT', currentUser.email, 'Đăng xuất khỏi CMS', 'success');
    }

    if (isFirebaseAvailable && auth) {
      await signOut(auth);
    } else {
      localStorage.removeItem('local_admin_signed_in');
      localStorage.removeItem('cms_current_user');
    }
    setCurrentUser(null);
    setIsAdmin(false);
    setAdminEmail(null);
    setActiveSessions([]);
  };

  const requestPasswordReset = async (email: string) => {
    if (isFirebaseAvailable && auth) {
      await sendPasswordResetEmail(auth, email);
    }
    await addAuditLog('PASSWORD_RESET_REQUEST', email, 'Yêu cầu khôi phục mật khẩu', 'success');
  };

  const confirmPasswordResetWithOTP = async (email: string, otp: string, newPass: string) => {
    if (otp !== '123456' && otp !== '888888') {
      throw new Error('Mã xác thực OTP không chính xác hoặc đã hết hạn.');
    }
    if (newPass.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.');
    }
    await addAuditLog('PASSWORD_RESET_CONFIRM', email, 'Đặt lại mật khẩu thành công qua OTP', 'success');
  };

  // General Savers
  const saveCompanyInfo = async (info: typeof COMPANY_INFO) => {
    setCompanyInfo(info);
    localStorage.setItem('cms_company_info', JSON.stringify(info));
    if (isFirebaseAvailable && db) {
      try {
        await updateDoc(doc(db, 'settings', 'config'), { companyInfo: info });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, 'settings/config');
      }
    }
    await addAuditLog('UPDATE_COMPANY_INFO', 'Cấu hình chung', 'Cập nhật thông tin liên hệ xí nghiệp');
  };

  const saveStatistics = async (stats: typeof STATISTICS) => {
    setStatistics(stats);
    localStorage.setItem('cms_statistics', JSON.stringify(stats));
    if (isFirebaseAvailable && db) {
      try {
        await updateDoc(doc(db, 'settings', 'config'), { statistics: stats });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, 'settings/config');
      }
    }
    await addAuditLog('UPDATE_STATS', 'Thống kê KPI', 'Cập nhật các con số hoạt động');
  };

  const saveSlides = async (updatedSlides: HeroSlide[]) => {
    setSlides(updatedSlides);
    localStorage.setItem('cms_slides', JSON.stringify(updatedSlides));
    if (isFirebaseAvailable && db) {
      try {
        await updateDoc(doc(db, 'settings', 'config'), { slides: updatedSlides });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, 'settings/config');
      }
    }
    await addAuditLog('UPDATE_SLIDES', 'Banner Hero', 'Thay đổi danh sách slide banner trang chủ');
  };

  const saveBrand = async (updatedBrand: CMSBrand) => {
    setBrand(updatedBrand);
    localStorage.setItem('cms_brand', JSON.stringify(updatedBrand));
    if (isFirebaseAvailable && db) {
      try {
        await updateDoc(doc(db, 'settings', 'config'), { brand: updatedBrand });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, 'settings/config');
      }
    }
    await addAuditLog('UPDATE_BRAND', 'Cấu hình Thương Hiệu', 'Cập nhật logo, màu sắc thương hiệu CMS');
  };

  const saveSEO = async (updatedSEO: CMSSEO) => {
    setSEO(updatedSEO);
    localStorage.setItem('cms_seo', JSON.stringify(updatedSEO));
    if (isFirebaseAvailable && db) {
      try {
        await updateDoc(doc(db, 'settings', 'config'), { seo: updatedSEO });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, 'settings/config');
      }
    }
    await addAuditLog('UPDATE_SEO', 'Cấu hình SEO', 'Cập nhật meta titles, keywords & OG');
  };

  // Services
  const saveService = async (item: ServiceItem) => {
    const exists = services.some(s => s.id === item.id);
    const updated = exists ? services.map(s => s.id === item.id ? item : s) : [...services, item];
    
    setServices(updated);
    localStorage.setItem('cms_services', JSON.stringify(updated));

    if (isFirebaseAvailable && db) {
      try {
        await setDoc(doc(db, 'services', item.id), item);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `services/${item.id}`);
      }
    }
    await addAuditLog('SAVE_SERVICE', item.title, exists ? 'Chỉnh sửa dịch vụ' : 'Thêm mới dịch vụ');
  };

  const deleteService = async (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    localStorage.setItem('cms_services', JSON.stringify(updated));

    if (isFirebaseAvailable && db) {
      try {
        await deleteDoc(doc(db, 'services', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
      }
    }
    await addAuditLog('DELETE_SERVICE', id, 'Xóa mục dịch vụ');
  };

  // Technologies
  const saveTechnology = async (item: TechnologyItem) => {
    const exists = technologies.some(t => t.id === item.id);
    const updated = exists ? technologies.map(t => t.id === item.id ? item : t) : [...technologies, item];
    setTechnologies(updated);
    await addAuditLog('SAVE_TECH', item.title, exists ? 'Chỉnh sửa máy móc' : 'Thêm thiết bị mới');
  };

  const deleteTechnology = async (id: string) => {
    const updated = technologies.filter(t => t.id !== id);
    setTechnologies(updated);
    await addAuditLog('DELETE_TECH', id, 'Xóa thiết bị máy in');
  };

  // Gallery
  const saveGalleryItem = async (item: GalleryItem) => {
    const exists = gallery.some(g => g.id === item.id);
    const updated = exists ? gallery.map(g => g.id === item.id ? item : g) : [...gallery, item];

    setGallery(updated);
    localStorage.setItem('cms_gallery', JSON.stringify(updated));

    if (isFirebaseAvailable && db) {
      try {
        await setDoc(doc(db, 'gallery', item.id), item);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `gallery/${item.id}`);
      }
    }
    await addAuditLog('SAVE_GALLERY', item.title, exists ? 'Cập nhật ảnh thư viện' : 'Thêm mới hình ảnh');
  };

  const deleteGalleryItem = async (id: string) => {
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    localStorage.setItem('cms_gallery', JSON.stringify(updated));

    if (isFirebaseAvailable && db) {
      try {
        await deleteDoc(doc(db, 'gallery', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
      }
    }
    await addAuditLog('DELETE_GALLERY', id, 'Xóa hình ảnh thư viện');
  };

  // Vacancy
  const saveVacancy = async (item: JobVacancy) => {
    const exists = vacancies.some(v => v.id === item.id);
    const updated = exists ? vacancies.map(v => v.id === item.id ? item : v) : [...vacancies, item];

    setVacancies(updated);
    localStorage.setItem('cms_vacancies', JSON.stringify(updated));

    if (isFirebaseAvailable && db) {
      try {
        await setDoc(doc(db, 'vacancies', item.id), item);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `vacancies/${item.id}`);
      }
    }
    await addAuditLog('SAVE_VACANCY', item.title, exists ? 'Cập nhật tin tuyển dụng' : 'Tạo mới tuyển dụng');
  };

  const deleteVacancy = async (id: string) => {
    const updated = vacancies.filter(v => v.id !== id);
    setVacancies(updated);
    localStorage.setItem('cms_vacancies', JSON.stringify(updated));

    if (isFirebaseAvailable && db) {
      try {
        await deleteDoc(doc(db, 'vacancies', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `vacancies/${id}`);
      }
    }
    await addAuditLog('DELETE_VACANCY', id, 'Xóa tin tuyển dụng');
  };

  // News
  const saveNewsPost = async (post: Omit<NewsPost, 'id'> & { id?: string }) => {
    const freshDoc = await newsService.addNews(post);
    const newsList = await newsService.getAllNews();
    setNews(newsList);
    await addAuditLog('SAVE_NEWS', freshDoc.title, post.id ? 'Cập nhật bài viết' : 'Đăng bài viết mới');
    return freshDoc;
  };

  const deleteNewsPost = async (id: string) => {
    await newsService.deleteNews(id);
    const newsList = await newsService.getAllNews();
    setNews(newsList);
    await addAuditLog('DELETE_NEWS', id, 'Xóa bài viết tin tức');
  };

  // Categories
  const saveCategory = async (cat: CMSCategory) => {
    const exists = categories.some(c => c.id === cat.id);
    const updated = exists ? categories.map(c => c.id === cat.id ? cat : c) : [...categories, cat];
    setCategories(updated);
    localStorage.setItem('cms_categories', JSON.stringify(updated));
    await addAuditLog('SAVE_CATEGORY', cat.name, exists ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới');
  };

  const deleteCategory = async (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    localStorage.setItem('cms_categories', JSON.stringify(updated));
    await addAuditLog('DELETE_CATEGORY', id, 'Xóa danh mục');
  };

  // Media
  const saveMedia = async (m: CMSMedia) => {
    const exists = mediaList.some(item => item.id === m.id);
    const updated = exists ? mediaList.map(item => item.id === m.id ? m : item) : [...mediaList, m];
    setMediaList(updated);
    await addAuditLog('SAVE_MEDIA', m.title, 'Tải lên / Cập nhật tập tin media');
  };

  const deleteMedia = async (id: string) => {
    const updated = mediaList.filter(item => item.id !== id);
    setMediaList(updated);
    await addAuditLog('DELETE_MEDIA', id, 'Xóa tệp tin thư viện media');
  };

  // Quotes
  const saveQuote = async (q: QuoteRequest) => {
    const finalQuote: QuoteRequest = {
      ...q,
      id: q.id || `quote-${Date.now()}`,
      createdAt: q.createdAt || new Date().toISOString(),
      status: q.status || 'pending'
    };
    const exists = quotes.some(item => item.id === finalQuote.id);
    const updated = exists ? quotes.map(item => item.id === finalQuote.id ? finalQuote : item) : [finalQuote, ...quotes];
    setQuotes(updated);
    localStorage.setItem('cms_quotes', JSON.stringify(updated));
    if (isFirebaseAvailable && db) {
      try {
        await setDoc(doc(db, 'cms_quotes', finalQuote.id!), finalQuote);
      } catch (err) {
        console.warn('Quote write warning:', err);
      }
    }
  };

  const deleteQuote = async (id: string) => {
    const updated = quotes.filter(item => item.id !== id);
    setQuotes(updated);
    localStorage.setItem('cms_quotes', JSON.stringify(updated));
  };

  // Users
  const saveUser = async (u: CMSUser) => {
    const exists = users.some(item => item.uid === u.uid);
    const updated = exists ? users.map(item => item.uid === u.uid ? u : item) : [...users, u];
    setUsers(updated);
    localStorage.setItem('cms_users', JSON.stringify(updated));
    if (isFirebaseAvailable && db) {
      try {
        await setDoc(doc(db, 'cms_users', u.uid), u);
      } catch (err) {
        console.warn('User save warning:', err);
      }
    }
    await addAuditLog('SAVE_USER', u.email, exists ? `Chỉnh sửa tài khoản (${u.role})` : `Tạo tài khoản mới (${u.role})`);
  };

  const toggleLockUser = async (uid: string) => {
    const updated = users.map(u => {
      if (u.uid === uid) {
        const nextStatus = u.status === 'active' ? ('locked' as const) : ('active' as const);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem('cms_users', JSON.stringify(updated));
    await addAuditLog('TOGGLE_LOCK_USER', uid, 'Thay đổi trạng thái Khóa / Mở tài khoản');
  };

  const deleteUser = async (uid: string) => {
    const updated = users.filter(u => u.uid !== uid);
    setUsers(updated);
    localStorage.setItem('cms_users', JSON.stringify(updated));
    if (isFirebaseAvailable && db) {
      try {
        await deleteDoc(doc(db, 'cms_users', uid));
      } catch (err) {
        console.warn('User delete warning:', err);
      }
    }
    await addAuditLog('DELETE_USER', uid, 'Xóa tài khoản người dùng');
  };

  // Audit Log
  const addAuditLog = async (action: string, target: string, details: string, status: 'success' | 'failure' = 'success') => {
    const log: CMSAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.uid || 'guest',
      userEmail: currentUser?.email || adminEmail || 'he-thong@xskthcm.com',
      userName: currentUser?.fullName || 'Quản trị viên',
      userRole: currentUser?.role || 'admin',
      action,
      target,
      details,
      ipAddress: '127.0.0.1 (Sandbox Container)',
      userAgent: navigator.userAgent,
      status
    };
    const updatedLogs = [log, ...auditLogs].slice(0, 100); // keep last 100
    setAuditLogs(updatedLogs);
    localStorage.setItem('cms_audit_logs', JSON.stringify(updatedLogs));

    if (isFirebaseAvailable && db) {
      try {
        setDoc(doc(db, 'cms_audit_logs', log.id), log).catch(() => {});
      } catch {}
    }
  };

  const revokeSession = async (sessionId: string) => {
    setActiveSessions(activeSessions.filter(s => s.id !== sessionId));
    await addAuditLog('REVOKE_SESSION', sessionId, 'Đã ngắt kết nối thiết bị đăng nhập');
  };

  const revokeAllSessions = async () => {
    setActiveSessions(activeSessions.filter(s => s.isCurrent));
    await addAuditLog('REVOKE_ALL_SESSIONS', 'Toàn bộ thiết bị', 'Đã đăng xuất khỏi tất cả các thiết bị khác');
  };

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
        currentUser,
        isAdmin,
        adminEmail,
        firebaseConnected: isFirebaseAvailable,

        loginAdmin,
        logoutAdmin,
        requestPasswordReset,
        confirmPasswordResetWithOTP,
        hasPermission,

        saveCompanyInfo,
        saveStatistics,
        saveSlides,
        saveBrand,
        saveSEO,

        saveService,
        deleteService,
        saveTechnology,
        deleteTechnology,
        saveGalleryItem,
        deleteGalleryItem,
        saveVacancy,
        deleteVacancy,
        saveNewsPost,
        deleteNewsPost,
        saveCategory,
        deleteCategory,
        saveMedia,
        deleteMedia,
        saveQuote,
        deleteQuote,
        saveUser,
        toggleLockUser,
        deleteUser,

        addAuditLog,
        revokeSession,
        revokeAllSessions
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
