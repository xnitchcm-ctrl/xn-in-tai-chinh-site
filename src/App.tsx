import { useState, useEffect } from 'react';
import { Phone, ArrowUp, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import Introduction from './components/Introduction';
import Services from './components/Services';
import Technology from './components/Technology';
import Gallery from './components/Gallery';
import NewsSection from './components/NewsSection';
import Recruitment from './components/Recruitment';
import Contact from './components/Contact';
import CompanyFooter from './components/CompanyFooter';
import QuoteModal from './components/QuoteModal';
import Preloader from './components/Preloader';
import OrgChart from './components/OrgChart';
import { COMPANY_INFO } from './data/companyData';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // HTML5 History pathing state
  const [currentPage, setCurrentPage] = useState<'home' | 'news'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/tin-tuc-hoat-dong') {
      return 'news';
    }
    return 'home';
  });
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string | null>(null);

  // Sync back/forward browser navigation buttons
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/tin-tuc-hoat-dong') {
        setCurrentPage('news');
        setActiveSection('news');
      } else {
        setCurrentPage('home');
        setActiveSection('hero');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // IntersectionObserver to dynamically highlight active sticky menu link on scroll
  useEffect(() => {
    const sections = ['hero', 'about', 'org-chart', 'services', 'technology', 'gallery', 'recruitment', 'contact'];
    
    const handleScrollActiveLink = () => {
      if (currentPage === 'news') {
        setActiveSection('news');
        return;
      }
      const scrollPos = window.scrollY + 200; // Offset for sticky menu height
      
      // Determine if back to top toggle is visible
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

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
  }, [currentPage]);

  // Standard smooth navigation trigger supporting paths pre-selected categories filters
  const handleNavigate = (sectionId: string, category?: string) => {
    if (sectionId === 'news') {
      setCurrentPage('news');
      setSelectedNewsCategory(category || 'All');
      setActiveSection('news');
      window.history.pushState({}, '', '/tin-tuc-hoat-dong');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Switch to home root if clicked other menus
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
    setActiveSection(sectionId);

    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        const offsetTop = el.offsetTop - (sectionId === 'hero' ? 0 : 120); // Accounting for double-tier header
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  const handleOpenQuoteWithService = (serviceTitle: string) => {
    setPreselectedService(serviceTitle);
    setIsQuoteModalOpen(true);
  };

  const handleOpenGeneralQuote = () => {
    setPreselectedService('');
    setIsQuoteModalOpen(true);
  };

  const handleCallHotline = () => {
    window.location.href = `tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`;
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <Preloader key="preloader" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <div className={`min-h-screen flex flex-col font-sans antialiased overflow-x-hidden transition-all duration-300 ${
        currentPage === 'news' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'
      }`}>
        
        {/* 1. DOUBLE-TIER CORPOREATE HEADER NAVIGATION BAR */}
        <Header 
          activeSection={activeSection} 
          onNavigate={handleNavigate} 
          openQuoteModal={handleOpenGeneralQuote} 
        />

        {/* MAIN CONTAINER CONTENT SECTION */}
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1 w-full flex flex-col"
        >
          {currentPage === 'news' ? (
            <NewsSection 
              onBackToHome={() => handleNavigate('hero')}
              preSelectedCategory={selectedNewsCategory}
            />
          ) : (
            <>
              {/* 2. DYNAMICAL INTERACTIVE HERO SLIDER BANNER & FLOATING BADGES COLUMN */}
              <div id="hero">
                <HeroSlider 
                  onLearnMore={handleNavigate} 
                  openQuoteModal={handleOpenGeneralQuote} 
                />
              </div>

              {/* 3. EXPERIENCE METRICS, TIMELINE AND TABS VISION/MISSION INTRODUCTION SECTION */}
              <motion.div 
                id="about"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Introduction />
              </motion.div>

              {/* SƠ ĐỒ TỔ CHỨC CORPORATE PREMIUM */}
              <OrgChart />

              {/* 4. CHUYÊN NGHIỆP FIVE CORE SERVICE DIVISION & EXPANDABLE DETAILS PANELS */}
              <motion.div 
                id="services"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Services onSelectServiceForQuote={handleOpenQuoteWithService} />
              </motion.div>

              {/* 5. HEIDELBERG & KBA HIGH CAPACITY German MACHINERY SPEC viewer SECTION */}
              <motion.div 
                id="technology"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Technology />
              </motion.div>

              {/* 6. REALISTIC PLANT PICTURES AND SPECIFIC CERTIFICATES FILTERABLE GALLERY */}
              <motion.div 
                id="gallery"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Gallery />
              </motion.div>

              {/* 7. OPEN TALENT JOBS SYSTEM & CANDIDATE CV REGISTRATION FORM */}
              <motion.div 
                id="recruitment"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Recruitment />
              </motion.div>

              {/* 8. WORK COMMUNICATOR FEEDBACK RFQ BOARD & MAP */}
              <motion.div 
                id="contact"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Contact />
              </motion.div>
            </>
          )}

        </motion.main>

        {/* 9. LICENSED STATE ENTERPRISE LEGAL FOOTER MARKER */}
        <CompanyFooter onNavigate={handleNavigate} />

        {/* 10. ONLINE INQUIRY SPEC RFQ BOX DIALOG POP-WINDOW */}
        <QuoteModal 
          isOpen={isQuoteModalOpen} 
          onClose={() => setIsQuoteModalOpen(false)} 
          preselectedService={preselectedService} 
        />

        {/* 11. FLOATING QUICK HELPMATE TOOLS (Zalo/Hotline and BackToTop) */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3.5">
          
          {/* Back To Top arrow visual widget */}
          {showBackToTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Về đầu trang"
              className="w-11 h-11 bg-brand-gold text-brand-blue hover:bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300"
            >
              <ArrowUp className="w-5 h-5 font-black" />
            </button>
          )}

          {/* Corporate direct rapid reached hotline phone widget */}
          <button
            onClick={handleCallHotline}
            aria-label="Gọi điện thoại tư vấn ngay"
            className="w-14 h-14 bg-gradient-to-tr from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer relative group"
          >
            {/* Wave radar pulse ring decor */}
            <span className="absolute -inset-1.5 rounded-full bg-rose-600/35 animate-ping pointers-none z-0"></span>
            <Phone className="w-6 h-6 rotate-12 relative z-10" />
            
            <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-black tracking-wider px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border border-slate-700 hidden sm:block">
              Gọi: {COMPANY_INFO.phoneDisplay}
            </div>
          </button>

        </div>

      </div>
    </>
  );
}
