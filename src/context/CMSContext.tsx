import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword
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
import { COMPANY_INFO, STATISTICS, SERVICE_ITEMS, GALLERY_ITEMS, VACANCIES } from '../data/companyData';
import { ServiceItem, GalleryItem, JobVacancy } from '../types';

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
  gallery: GalleryItem[];
  vacancies: JobVacancy[];
  news: NewsPost[];
  loading: boolean;
  isAdmin: boolean;
  adminEmail: string | null;
  firebaseConnected: boolean;
  
  // Auth Operations
  loginAdmin: (email: string, password: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  
  // Content Updaters
  saveCompanyInfo: (info: typeof COMPANY_INFO) => Promise<void>;
  saveStatistics: (stats: typeof STATISTICS) => Promise<void>;
  saveSlides: (slides: HeroSlide[]) => Promise<void>;
  
  // Entity Updaters
  saveService: (service: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  
  // Gallery Updaters
  saveGalleryItem: (item: GalleryItem) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  
  // Vacancy Updaters
  saveVacancy: (vacancy: JobVacancy) => Promise<void>;
  deleteVacancy: (id: string) => Promise<void>;
  
  // News Updaters
  saveNewsPost: (post: Omit<NewsPost, 'id'> & { id?: string }) => Promise<NewsPost>;
  deleteNewsPost: (id: string) => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

// Initial Default Hero Banner Slides
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

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState<typeof COMPANY_INFO>(COMPANY_INFO);
  const [statistics, setStatistics] = useState<typeof STATISTICS>(STATISTICS);
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [services, setServices] = useState<ServiceItem[]>(SERVICE_ITEMS);
  const [gallery, setGallery] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [vacancies, setVacancies] = useState<JobVacancy[]>(VACANCIES);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  // Initialize and Sync
  useEffect(() => {
    let unsubsAuth: (() => void) | null = null;

    const bootstrapAllData = async () => {
      setLoading(true);
      
      // Listen to Auth State if firebase is enabled
      if (isFirebaseAvailable && auth) {
        unsubsAuth = onAuthStateChanged(auth, (user) => {
          if (user && user.email === 'xnitchcm@gmail.com') {
            setIsAdmin(true);
            setAdminEmail(user.email);
          } else {
            setIsAdmin(false);
            setAdminEmail(null);
          }
        });
      } else {
        // LocalStorage fallback auth check
        const isLocalAdmin = localStorage.getItem('local_admin_signed_in') === 'true';
        setIsAdmin(isLocalAdmin);
        setAdminEmail(isLocalAdmin ? 'xnitchcm@gmail.com' : null);
      }

      try {
        // 1. Fetch News
        await newsService.bootstrap();
        const newsList = await newsService.getAllNews();
        setNews(newsList);

        // 2. Load CMS general options (CompanyInfo, Stats, Slides)
        if (isFirebaseAvailable && db) {
          try {
            // Load Settings Document
            const settingsDocRef = doc(db, 'settings', 'config');
            const settingsSnap = await getDoc(settingsDocRef);
            
            if (settingsSnap.exists()) {
              const data = settingsSnap.data();
              if (data.companyInfo) setCompanyInfo(data.companyInfo);
              if (data.statistics) setStatistics(data.statistics);
              if (data.slides) setSlides(data.slides);
            } else {
              // Seed Settings config document
              await setDoc(settingsDocRef, {
                companyInfo: COMPANY_INFO,
                statistics: STATISTICS,
                slides: DEFAULT_SLIDES
              });
            }

            // Load Services Collection
            const servicesSnap = await getDocs(collection(db, 'services'));
            if (!servicesSnap.empty) {
              const sList: ServiceItem[] = [];
              servicesSnap.forEach(d => sList.push(d.data() as ServiceItem));
              setServices(sList);
            } else {
              // Seed Services
              for (const s of SERVICE_ITEMS) {
                await setDoc(doc(db, 'services', s.id), s);
              }
            }

            // Load Gallery Collection
            const gallerySnap = await getDocs(collection(db, 'gallery'));
            if (!gallerySnap.empty) {
              const gList: GalleryItem[] = [];
              gallerySnap.forEach(d => gList.push(d.data() as GalleryItem));
              setGallery(gList);
            } else {
              // Seed Gallery
              for (const g of GALLERY_ITEMS) {
                await setDoc(doc(db, 'gallery', g.id), g);
              }
            }

            // Load Vacancies Collection
            const vacanciesSnap = await getDocs(collection(db, 'vacancies'));
            if (!vacanciesSnap.empty) {
              const vList: JobVacancy[] = [];
              vacanciesSnap.forEach(d => vList.push(d.data() as JobVacancy));
              setVacancies(vList);
            } else {
              // Seed Vacancies
              for (const v of VACANCIES) {
                await setDoc(doc(db, 'vacancies', v.id), v);
              }
            }

          } catch (configErr) {
            console.warn('Firestore CMS documents could not be synced immediately. Opting for fallback caching.', configErr);
            loadLocalConfigs();
          }
        } else {
          loadLocalConfigs();
        }
      } catch (err) {
        console.error('Master bootstrap CMS error, falling back completely.', err);
        loadLocalConfigs();
      } finally {
        setLoading(false);
      }
    };

    bootstrapAllData();

    return () => {
      if (unsubsAuth) unsubsAuth();
    };
  }, []);

  const loadLocalConfigs = () => {
    // Local storage loaded values
    const cachedCompanyInfo = localStorage.getItem('cms_company_info');
    if (cachedCompanyInfo) setCompanyInfo(JSON.parse(cachedCompanyInfo));

    const cachedStats = localStorage.getItem('cms_statistics');
    if (cachedStats) setStatistics(JSON.parse(cachedStats));

    const cachedSlides = localStorage.getItem('cms_slides');
    if (cachedSlides) setSlides(JSON.parse(cachedSlides));

    const cachedServices = localStorage.getItem('cms_services');
    if (cachedServices) setServices(JSON.parse(cachedServices));

    const cachedGallery = localStorage.getItem('cms_gallery');
    if (cachedGallery) setGallery(JSON.parse(cachedGallery));

    const cachedVacancies = localStorage.getItem('cms_vacancies');
    if (cachedVacancies) setVacancies(JSON.parse(cachedVacancies));
  };

  // Auth Operations
  const loginAdmin = async (email: string, password: string) => {
    if (email !== 'xnitchcm@gmail.com') {
      throw new Error('Chỉ tài khoản admin xnitchcm@gmail.com mới quyền truy cập.');
    }

    if (isFirebaseAvailable && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        // If user is not found, auto-bootstrap / register this first-use admin!
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.message?.includes('user-not-found')) {
          try {
            console.log('Admin account not found. Seeding first-time admin credentials as requested.');
            await createUserWithEmailAndPassword(auth, email, password);
          } catch (createErr) {
            console.error('Failed to auto register initial admin user:', createErr);
            throw err; // throw original
          }
        } else {
          throw err;
        }
      }
    } else {
      // Local fallback auth
      if (password && password.length >= 6) {
        localStorage.setItem('local_admin_signed_in', 'true');
        setIsAdmin(true);
        setAdminEmail('xnitchcm@gmail.com');
      } else {
        throw new Error('Mật khẩu ngoại tuyến phải dài ít nhất 6 ký tự.');
      }
    }
  };

  const logoutAdmin = async () => {
    if (isFirebaseAvailable && auth) {
      await signOut(auth);
    } else {
      localStorage.removeItem('local_admin_signed_in');
    }
    setIsAdmin(false);
    setAdminEmail(null);
  };

  // Save General configs
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
  };

  // Service CRUD
  const saveService = async (item: ServiceItem) => {
    const updated = services.map(s => s.id === item.id ? item : s);
    const exists = services.some(s => s.id === item.id);
    const finalServices = exists ? updated : [...services, item];
    
    setServices(finalServices);
    localStorage.setItem('cms_services', JSON.stringify(finalServices));

    if (isFirebaseAvailable && db) {
      try {
        await setDoc(doc(db, 'services', item.id), item);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `services/${item.id}`);
      }
    }
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
  };

  // Gallery CRUD
  const saveGalleryItem = async (item: GalleryItem) => {
    const updated = gallery.map(g => g.id === item.id ? item : g);
    const exists = gallery.some(g => g.id === item.id);
    const finalGallery = exists ? updated : [...gallery, item];

    setGallery(finalGallery);
    localStorage.setItem('cms_gallery', JSON.stringify(finalGallery));

    if (isFirebaseAvailable && db) {
      try {
        await setDoc(doc(db, 'gallery', item.id), item);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `gallery/${item.id}`);
      }
    }
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
  };

  // Vacancy CRUD
  const saveVacancy = async (item: JobVacancy) => {
    const updated = vacancies.map(v => v.id === item.id ? item : v);
    const exists = vacancies.some(v => v.id === item.id);
    const finalVacancies = exists ? updated : [...vacancies, item];

    setVacancies(finalVacancies);
    localStorage.setItem('cms_vacancies', JSON.stringify(finalVacancies));

    if (isFirebaseAvailable && db) {
      try {
        await setDoc(doc(db, 'vacancies', item.id), item);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `vacancies/${item.id}`);
      }
    }
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
  };

  // News CRUD
  const saveNewsPost = async (post: Omit<NewsPost, 'id'> & { id?: string }) => {
    const freshDoc = await newsService.addNews(post);
    // Refresh News
    const newsList = await newsService.getAllNews();
    setNews(newsList);
    return freshDoc;
  };

  const deleteNewsPost = async (id: string) => {
    await newsService.deleteNews(id);
    // Refresh News
    const newsList = await newsService.getAllNews();
    setNews(newsList);
  };

  return (
    <CMSContext.Provider
      value={{
        companyInfo,
        statistics,
        slides,
        services,
        gallery,
        vacancies,
        news,
        loading,
        isAdmin,
        adminEmail,
        firebaseConnected: isFirebaseAvailable,
        loginAdmin,
        logoutAdmin,
        saveCompanyInfo,
        saveStatistics,
        saveSlides,
        saveService,
        deleteService,
        saveGalleryItem,
        deleteGalleryItem,
        saveVacancy,
        deleteVacancy,
        saveNewsPost,
        deleteNewsPost
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
