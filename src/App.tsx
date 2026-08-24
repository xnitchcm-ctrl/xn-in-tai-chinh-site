import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Phone, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Public Components
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import Introduction from './components/Introduction';
import Services from './components/Services';
import Technology from './components/Technology';
import QRCodeProtection from './components/QRCodeProtection';
import Gallery from './components/Gallery';
import NewsSection from './components/NewsSection';
import Recruitment from './components/Recruitment';
import Contact from './components/Contact';
import CompanyFooter from './components/CompanyFooter';
import QuoteModal from './components/QuoteModal';
import Preloader from './components/Preloader';
import OrgChart from './components/OrgChart';
import { COMPANY_INFO } from './data/companyData';

// CMS Components
import CMSLogin from './components/cms/CMSLogin';
import CMSForgotPassword from './components/cms/CMSForgotPassword';
import CMSLayout from './components/cms/CMSLayout';
import CMSOverview from './components/cms/views/CMSOverview';
import CMSPages from './components/cms/views/CMSPages';
import CMSPosts from './components/cms/views/CMSPosts';
import CMSCategories from './components/cms/views/CMSCategories';
import CMSMedia from './components/cms/views/CMSMedia';
import CMSBanners from './components/cms/views/CMSBanners';
import CMSServices from './components/cms/views/CMSServices';
import CMSTechnology from './components/cms/views/CMSTechnology';
import CMSGallery from './components/cms/views/CMSGallery';
import CMSRecruitment from './components/cms/views/CMSRecruitment';
import CMSContacts from './components/cms/views/CMSContacts';
import CMSBrand from './components/cms/views/CMSBrand';
import CMSSEO from './components/cms/views/CMSSEO';
import CMSUsers from './components/cms/views/CMSUsers';
import CMSAuditLogs from './components/cms/views/CMSAuditLogs';
import CMSSettings from './components/cms/views/CMSSettings';

import { useCMS } from './context/CMSContext';

// Protected Route Guard for CMS Admin Area
function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isInitialized } = useCMS();

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#F7FAFF] flex items-center justify-center p-4">
        <div className="flex items-center gap-3 font-bold text-[#174A87]">
          <div className="w-5 h-5 border-2 border-[#174A87] border-t-transparent rounded-full animate-spin" />
          <span>Đang kiểm tra quyền truy cập hệ thống Supabase CMS...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

// Role-based Route Guard to block Editor from accessing Admin/Approver routes
function RoleGuard({ 
  children, 
  allowedRoles = ['super_admin', 'admin'] 
}: { 
  children: React.ReactNode; 
  allowedRoles?: string[];
}) {
  const { currentUser } = useCMS();
  if (currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/admin/tong-quan" replace />;
  }
  return <>{children}</>;
}

// Main Public Website View Component
function PublicWebsite({ newsPage = false }: { newsPage?: boolean }) {
  const [loading, setLoading] = useState(!newsPage);
  const [activeSection, setActiveSection] = useState(newsPage ? 'news' : 'hero');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const sections = ['hero', 'about', 'org-chart', 'services', 'technology', 'qrcode-sec', 'gallery', 'recruitment', 'contact'];
    
    const handleScrollActiveLink = () => {
      if (newsPage) return;

      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollActiveLink);
    return () => window.removeEventListener('scroll', handleScrollActiveLink);
  }, [newsPage]);

  const handleNavigate = (sectionId: string, category?: string) => {
    if (sectionId === 'news') {
      setSelectedNewsCategory(category || 'All');
      navigate('/tin-tuc-hoat-dong');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (newsPage) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
        }
      }, 150);
      return;
    }

    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      const offsetTop = el.offsetTop - (sectionId === 'hero' ? 0 : 120);
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const handleOpenQuoteWithService = (serviceTitle: string) => {
    setPreselectedService(serviceTitle);
    setIsQuoteModalOpen(true);
  };

  const handleOpenGeneralQuote = () => {
    setPreselectedService('');
    setIsQuoteModalOpen(true);
  };

  return (
    <>
      {!newsPage && (
        <AnimatePresence mode="wait">
          {loading && (
            <Preloader key="preloader" onComplete={() => setLoading(false)} />
          )}
        </AnimatePresence>
      )}

      <div className="min-h-screen flex flex-col font-sans antialiased overflow-x-hidden bg-[#F7FAFF] text-slate-800">
        
        {/* Header Bar */}
        <Header 
          activeSection={activeSection} 
          onNavigate={handleNavigate} 
          openQuoteModal={handleOpenGeneralQuote} 
        />

        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 w-full flex flex-col"
        >
          {newsPage ? (
            <NewsSection 
              onBackToHome={() => navigate('/')}
              preSelectedCategory={selectedNewsCategory}
            />
          ) : (
            <>
              <div id="hero">
                <HeroSlider 
                  onLearnMore={handleNavigate} 
                  openQuoteModal={handleOpenGeneralQuote} 
                />
              </div>

              <motion.div 
                id="about"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <Introduction />
              </motion.div>

              <OrgChart />

              <motion.div 
                id="services"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <Services onSelectServiceForQuote={handleOpenQuoteWithService} />
              </motion.div>

              <motion.div 
                id="technology"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <Technology />
              </motion.div>

              <motion.div 
                id="qrcode-sec"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <QRCodeProtection />
              </motion.div>

              <motion.div 
                id="gallery"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <Gallery />
              </motion.div>

              <motion.div 
                id="recruitment"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <Recruitment />
              </motion.div>

              <motion.div 
                id="contact"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <Contact />
              </motion.div>
            </>
          )}
        </motion.main>

        <CompanyFooter onNavigate={handleNavigate} />

        <QuoteModal 
          isOpen={isQuoteModalOpen} 
          onClose={() => setIsQuoteModalOpen(false)} 
          preselectedService={preselectedService} 
        />

        {/* Floating Hotline / BackToTop Widget */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3.5">
          {showBackToTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Về đầu trang"
              className="w-11 h-11 bg-[#F5C542] text-[#174A87] hover:bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer border border-amber-300"
            >
              <ArrowUp className="w-5 h-5 font-black" />
            </button>
          )}

          <button
            onClick={() => window.location.href = `tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
            aria-label="Gọi điện thoại tư vấn ngay"
            className="w-14 h-14 bg-gradient-to-tr from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all cursor-pointer relative group"
          >
            <span className="absolute -inset-1.5 rounded-full bg-rose-600/35 animate-ping pointer-events-none z-0" />
            <Phone className="w-6 h-6 rotate-12 relative z-10" />
            <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#174A87] text-white text-[11px] font-black tracking-wider px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border border-[#123C70] hidden sm:block">
              Gọi: {COMPANY_INFO.phoneDisplay}
            </div>
          </button>
        </div>

      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<PublicWebsite />} />
        <Route path="/tin-tuc-hoat-dong" element={<PublicWebsite newsPage />} />

        {/* CMS AUTHENTICATION ROUTES */}
        <Route path="/admin/login" element={<CMSLogin />} />
        <Route path="/admin/forgot-password" element={<CMSForgotPassword />} />
        <Route path="/quan-tri/dang-nhap" element={<CMSLogin />} />
        <Route path="/quan-tri/quen-mat-khau" element={<CMSForgotPassword />} />
        <Route path="/quan-tri/dat-lai-mat-khau" element={<CMSForgotPassword />} />

        {/* CMS PROTECTED ADMIN PANEL */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <CMSLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/tong-quan" replace />} />
          <Route path="tong-quan" element={<CMSOverview />} />
          <Route path="bai-viet" element={<CMSPosts />} />
          <Route path="thu-vien" element={<CMSGallery />} />
          <Route path="hinh-anh" element={<CMSMedia />} />

          {/* APPROVER & ADMIN ROUTES (Blocked for Editor) */}
          <Route path="danh-muc" element={<RoleGuard allowedRoles={['super_admin', 'admin', 'approver']}><CMSCategories /></RoleGuard>} />
          <Route path="trang" element={<RoleGuard allowedRoles={['super_admin', 'admin', 'approver']}><CMSPages /></RoleGuard>} />
          <Route path="banner" element={<RoleGuard allowedRoles={['super_admin', 'admin', 'approver']}><CMSBanners /></RoleGuard>} />
          <Route path="dich-vu" element={<RoleGuard allowedRoles={['super_admin', 'admin', 'approver']}><CMSServices /></RoleGuard>} />
          <Route path="cong-nghe" element={<RoleGuard allowedRoles={['super_admin', 'admin', 'approver']}><CMSTechnology /></RoleGuard>} />
          <Route path="tuyen-dung" element={<RoleGuard allowedRoles={['super_admin', 'admin', 'approver']}><CMSRecruitment /></RoleGuard>} />
          <Route path="lien-he" element={<RoleGuard allowedRoles={['super_admin', 'admin', 'approver']}><CMSContacts /></RoleGuard>} />

          {/* ADMIN ONLY ROUTES (Blocked for Editor & Approver) */}
          <Route path="thuong-hieu" element={<RoleGuard allowedRoles={['super_admin', 'admin']}><CMSBrand /></RoleGuard>} />
          <Route path="seo" element={<RoleGuard allowedRoles={['super_admin', 'admin']}><CMSSEO /></RoleGuard>} />
          <Route path="nguoi-dung" element={<RoleGuard allowedRoles={['super_admin', 'admin']}><CMSUsers /></RoleGuard>} />
          <Route path="nhat-ky" element={<RoleGuard allowedRoles={['super_admin', 'admin']}><CMSAuditLogs /></RoleGuard>} />
          <Route path="cai-dat" element={<RoleGuard allowedRoles={['super_admin', 'admin']}><CMSSettings /></RoleGuard>} />
        </Route>

        {/* ALIAS FOR /quan-tri */}
        <Route path="/quan-tri/*" element={<Navigate to="/admin" replace />} />

        {/* FALLBACK CATCH-ALL REDIRECT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
