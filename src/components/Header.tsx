import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Globe, 
  ChevronDown,
  Ticket,
  FileSpreadsheet,
  ShieldCheck,
  Cpu,
  CheckSquare,
  ShieldAlert,
  Target,
  History,
  ArrowRight,
  Award,
  Home,
  Image as ImageIcon,
  Users
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  openQuoteModal: () => void;
}

export default function Header({ activeSection, onNavigate, openQuoteModal }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchNotification, setSearchNotification] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<'services' | 'about' | null>(null);

  // Scroll handler to make navbar sticky on page scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'TRANG CHỦ' },
    { id: 'about', label: 'GIỚI THIỆU', hasDropdown: true, dropdownType: 'about' as const },
    { id: 'services', label: 'DỊCH VỤ IN', hasDropdown: true, dropdownType: 'services' as const },
    { id: 'technology', label: 'CÔNG NGHỆ' },
    { id: 'gallery', label: 'THƯ VIỆN' },
    { id: 'recruitment', label: 'TUYỂN DỤNG' },
    { id: 'contact', label: 'LIÊN HỆ' },
  ];

  const handleNavClick = (id: string, subSubid?: string) => {
    onNavigate(id);
    setActiveDropdown(null);
    setIsMenuOpen(false);
    
    // If we specifically linked a sub-item, scroll to it or perform tab triggers
    if (subSubid) {
      setTimeout(() => {
        const el = document.getElementById(subSubid);
        if (el) {
          const elOffset = el.offsetTop - 130;
          window.scrollTo({ top: elOffset, behavior: 'smooth' });
        }
      }, 350);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchNotification(`Đang tra cứu dữ liệu bảo mật cho: "${searchQuery}"...`);
    setTimeout(() => setSearchNotification(''), 4500);
  };

  const getNavLinkIcon = (id: string) => {
    switch (id) {
      case 'hero': return <Home className="w-4 h-4" />;
      case 'about': return <Target className="w-4 h-4" />;
      case 'services': return <Ticket className="w-4 h-4" />;
      case 'technology': return <Cpu className="w-4 h-4" />;
      case 'gallery': return <ImageIcon className="w-4 h-4" />;
      case 'recruitment': return <Users className="w-4 h-4" />;
      case 'contact': return <Mail className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  const getNavLinkDesc = (id: string) => {
    switch (id) {
      case 'hero': return 'Trang chủ Tổng công ty';
      case 'about': return 'Lịch sử thành lập & Sứ mệnh';
      case 'services': return 'Vé số, hóa đơn & biểu mẫu bảo mật';
      case 'technology': return 'Máy móc nhập khẩu Đức & Nhật';
      case 'gallery': return 'Thành phẩm & Hình ảnh nhà xưởng';
      case 'recruitment': return 'Cơ hội phát triển nghề nghiệp';
      case 'contact': return 'Hợp tác in ấn & Địa chỉ và Bản đồ';
      default: return '';
    }
  };

  return (
    <header className="w-full flex flex-col z-50 bg-white shadow-sm transition-all duration-300 relative">
      
      {/* 2.1 PRE-HEADER TRADING METRICS BAR */}
      <div className="w-full bg-slate-900 border-b border-slate-800 py-2 px-4 sm:px-6 lg:px-8 text-xs text-slate-350 hidden md:block relative z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 font-medium text-slate-305">
              <Building className="w-3.5 h-3.5 text-brand-gold" />
              Chủ quản: <span className="text-white font-semibold">{COMPANY_INFO.parentCompany}</span>
            </span>
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              Trang tin: <a href={`http://${COMPANY_INFO.website}`} className="hover:text-brand-gold hover:underline transition-colors">{COMPANY_INFO.website}</a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-brand-gold">
              <MapPin className="w-3.5 h-3.5" />
              Văn phòng sản xuất: Hóc Môn, TP. Hồ Chí Minh
            </span>
          </div>
        </div>
      </div>

      {/* 2.2 MAIN BRANDING TITLES & PHONE PANEL */}
      <div className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-white border-b border-amber-100/45 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo brand configuration with official coat of arms colors */}
          <div className="flex items-center gap-4 select-none cursor-pointer" onClick={() => handleNavClick('hero')}>
            {/* Round coat-of-arms graphic emblem */}
            <div className="relative w-14 h-14 bg-gradient-to-tr from-brand-blue to-blue-800 rounded-full flex flex-col items-center justify-center border-2 border-brand-gold shadow-md shrink-0">
              <div className="absolute top-1 text-[7px] font-black text-brand-gold leading-none tracking-wider">XỔ SỐ</div>
              <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center font-display font-black text-white text-xs mt-1 shadow-inner bg-slate-950/20">
                ITC
              </div>
              <div className="absolute bottom-1 text-[7px] font-bold text-slate-200 tracking-wider leading-none">TP.HCM</div>
            </div>

            {/* Logo captions */}
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate-500 font-display">
                {COMPANY_INFO.parentCompany}
              </p>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-brand-blue font-display tracking-tight leading-none uppercase mt-0.5">
                {COMPANY_INFO.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-[2px] w-6 bg-brand-gold rounded-full"></span>
                <p className="text-[9px] font-extrabold text-brand-gold tracking-widest uppercase font-display leading-none">
                  TIÊU CHUẨN QUỐC GIA – CHẤT LƯỢNG QUỐC TẾ
                </p>
              </div>
            </div>
          </div>

          {/* Hotline & Search controls */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 w-full md:w-auto">
            
            {/* Hotline number block */}
            <div className="flex items-center gap-2.5">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 bg-brand-blue/5 border border-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue"
              >
                <Phone className="w-4.5 h-4.5 text-brand-blue animate-pulse" />
              </motion.div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest font-display leading-none mb-1">Hotline nghiệp vụ</p>
                <p className="text-base font-black text-brand-blue font-mono tracking-tight leading-none">{COMPANY_INFO.phoneDisplay}</p>
              </div>
            </div>

            {/* Custom search */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-xs sm:w-56 lg:w-60">
              <input
                type="text"
                placeholder="Tìm dịch vụ, KCS, ISO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-brand-blue focus:bg-white focus:shadow-sm transition-all text-slate-800"
              />
              <button
                type="submit"
                aria-label="Tìm kiếm sản phẩm"
                className="absolute right-1 p-1.5 text-white bg-brand-blue hover:bg-brand-blue-dark rounded-full transition-all cursor-pointer"
              >
                <Search className="w-3 h-3" />
              </button>
            </form>

          </div>
        </div>
      </div>

      {/* 2.3 STICKY/FADING DECORATIVE SEARCH NOTIFICATION */}
      <AnimatePresence>
        {searchNotification && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-50 text-amber-900 border-b border-amber-200 text-xs text-center py-2.5 px-4 font-normal shadow-inner relative z-30"
          >
            {searchNotification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2.4 MAIN STICKY NAVIGATION BAR WITH SMOOTH ENHANCEMENTS */}
      <div 
        className={`w-full z-40 transition-all duration-300 ${
          isSticky 
            ? 'fixed top-0 left-0 right-0 shadow-xl bg-brand-blue/95 backdrop-blur-md text-white py-2 z-50 animate-fadeIn border-b border-brand-blue' 
            : 'bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-14">
          
          {/* Logo overlay on Sticky state */}
          {isSticky && (
            <div 
              className="flex items-center gap-2 cursor-pointer transition-all duration-305 text-brand-gold hover:text-white"
              onClick={() => handleNavClick('hero')}
            >
              <div className="w-8 h-8 bg-brand-gold text-brand-blue rounded-full flex items-center justify-center font-black text-xs shadow">
                ITC
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xs tracking-wider uppercase leading-none">IN TÀI CHÍNH</span>
                <span className="text-[8px] text-white/70 tracking-widest uppercase font-display leading-none mt-0.5">XỐ SỐ TP.HCM</span>
              </div>
            </div>
          )}

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center h-full flex-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <div
                  key={link.id}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => link.hasDropdown ? setActiveDropdown(link.dropdownType) : setActiveDropdown(null)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className={`px-5 py-5 text-xs font-black font-display tracking-widest cursor-pointer transition-colors relative flex items-center gap-1 focus:outline-none h-full ${
                      isActive 
                        ? 'text-brand-gold' 
                        : 'text-white/90 hover:text-brand-gold'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.hasDropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === link.dropdownType ? 'rotate-180 text-brand-gold' : ''}`} />
                    )}

                    {/* Exquisite magnetic border hover effect */}
                    {isActive && (
                      <motion.div 
                        layoutId="navUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-gold"
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    )}
                  </button>

                  {/* dropdown content rendering */}
                  {link.hasDropdown && activeDropdown === link.dropdownType && (
                    <div className="absolute top-[100%] left-0 pt-1 pointer-events-auto z-50">
                      {link.dropdownType === 'services' ? (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="w-[450px] bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-100 p-4 grid grid-cols-1 gap-1"
                        >
                          <div className="border-b border-slate-100 pb-2 mb-2">
                            <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-display">CHUYÊN PHÂN LỚP IN ĐẠT TIÊU CHUẨN QUỐC GIA</h3>
                          </div>
                          <div className="space-y-1">
                            {/* Service dropdown items */}
                            <div 
                              onClick={() => handleNavClick('services', 'service-in-ve-so')}
                              className="group/item flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 group-hover/item:bg-brand-blue group-hover/item:text-white transition-colors">
                                <Ticket className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 group-hover/item:text-brand-blue transition-colors flex items-center gap-1.5 leading-none">
                                  In Vé Số Truyền Thống & Tự Chọn
                                  <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                                </h4>
                                <p className="text-[10px] text-slate-500 mt-1 font-light leading-relaxed">Công nghệ số biến đổi sê-ri liên tục không trùng lắp lý tưởng.</p>
                              </div>
                            </div>

                            <div 
                              onClick={() => handleNavClick('services', 'service-in-chung-tu')}
                              className="group/item flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 group-hover/item:bg-brand-blue group-hover/item:text-white transition-colors">
                                <FileSpreadsheet className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 group-hover/item:text-brand-blue transition-colors flex items-center gap-1.5 leading-none">
                                  In Chứng Từ Tài Chính & Hóa Đơn
                                  <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                                </h4>
                                <p className="text-[10px] text-slate-500 mt-1 font-light leading-relaxed">Biểu mẫu nhiều liên carbonless nhạy chữ, rách ròi, chống giả tốt.</p>
                              </div>
                            </div>

                            <div 
                              onClick={() => handleNavClick('services', 'service-in-bao-mat')}
                              className="group/item flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                <ShieldAlert className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 group-hover/item:text-brand-blue transition-colors flex items-center gap-1.5 leading-none">
                                  In Bảo Mật Chống Giả Tối Cao
                                  <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                                </h4>
                                <p className="text-[10px] text-slate-500 mt-1 font-light leading-relaxed">Tích hợp dập Hologram óng ánh vàng, mực UV vô hình đặc thù.</p>
                              </div>
                            </div>

                            <div 
                              onClick={() => handleNavClick('services', 'service-gia-cong-sau-in')}
                              className="group/item flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover/item:bg-amber-600 group-hover/item:text-white transition-colors">
                                <Cpu className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 group-hover/item:text-brand-blue transition-colors flex items-center gap-1.5 leading-none">
                                  Gia Công Sau In & Đóng Bó Tự Động
                                  <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                                </h4>
                                <p className="text-[10px] text-slate-500 mt-1 font-light leading-relaxed">Sử dụng dao xén lập trình Polar Đức vác nếp bén gạt an toàn.</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-slate-50 p-2.5 rounded-lg mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                              Được kiểm chứng KCS 3 khối
                            </div>
                            <span className="text-[9px] text-blue-700 font-bold uppercase hover:underline cursor-pointer" onClick={openQuoteModal}>In thử mẫu ngay</span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="w-[320px] bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-100 p-4"
                        >
                          <div className="border-b border-slate-100 pb-2 mb-2">
                            <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-display">VỀ CHÚNG TÔI</h3>
                          </div>
                          <div className="space-y-1">
                            <div 
                              onClick={() => handleNavClick('about')}
                              className="group/item flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded bg-brand-blue/5 text-brand-blue flex items-center justify-center shrink-0">
                                <Target className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 group-hover/item:text-brand-blue transition-colors">Tầm Nhìn & Sứ Mệnh</h4>
                                <p className="text-[9px] text-slate-400 mt-0.5 font-light">Thước đo định lượng chất lượng & bảo mật</p>
                              </div>
                            </div>

                            <div 
                              onClick={() => handleNavClick('about')}
                              className="group/item flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                <History className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 group-hover/item:text-brand-blue transition-colors">Lịch Sử Phát Triển</h4>
                                <p className="text-[9px] text-slate-400 mt-0.5 font-light">Đồng hành cùng ngành Xổ số kiến thiết từ 1978</p>
                              </div>
                            </div>

                            <div 
                              onClick={() => handleNavClick('about')}
                              className="group/item flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <Award className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 group-hover/item:text-brand-blue transition-colors">Chứng Nhận Hệ Thống KCS</h4>
                                <p className="text-[9px] text-slate-400 mt-0.5 font-light">Chứng nhận bảo mật quốc tế ISO 27001</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Consultation Registration button */}
          <div className="hidden sm:block">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(220,169,42,0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={openQuoteModal}
              className="px-5 py-2.5 text-xs font-black tracking-widest font-display rounded bg-brand-gold text-brand-blue hover:bg-yellow-400 border border-amber-300 transition-all cursor-pointer shadow uppercase"
            >
              YÊU CẦU BÁO GIÁ TRỰC TUYẾN
            </motion.button>
          </div>

          {/* Mobile menu toggle container */}
          <div className="lg:hidden flex items-center justify-between w-full sm:w-auto py-2">
            {!isSticky && (
              <span className="font-display font-black text-[10px] tracking-wider text-amber-300 uppercase block sm:hidden">
                CHUYÊN NGHIỆP – CHÍNH XÁC – BẢO MẬT
              </span>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 ml-auto text-white hover:text-brand-gold focus:outline-none transition-all cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 2.5 PREMIUM FULL-WINDOW MOBILE SIDEBAR SLIDE-IN */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop cover with high glassmorphism filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[100] lg:hidden"
            />

            {/* Premium Slate-dark Right Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0.95 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-[350px] bg-slate-950 text-white z-[101] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto lg:hidden border-l border-white/10"
            >
              <div>
                {/* Drawer Header Brand Titles */}
                <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-brand-blue to-blue-700 rounded-full flex items-center justify-center border border-brand-gold">
                      <span className="text-[10px] font-black font-display text-white">ITC</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-brand-gold tracking-widest font-display leading-none">XN IN TÀI CHÍNH</p>
                      <p className="text-[7px] text-slate-400 font-sans tracking-wide leading-none mt-1">TP. HỒ CHÍ MINH</p>
                    </div>
                  </div>
                  
                  {/* Close drawer icon */}
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 bg-white/5 hover:bg-white/10 hover:text-brand-gold rounded-full text-white cursor-pointer"
                    aria-label="Đóng menu"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Mobile Menu Links with responsive Icons, tags & spacing */}
                <div className="space-y-2">
                  <p className="text-[8px] font-black tracking-widest text-slate-500 uppercase font-display mb-3 px-2">CHUYÊN MỤC TRUY CẬP NHANH</p>
                  
                  {navLinks.map((link) => {
                    const isActive = activeSection === link.id;
                    return (
                      <motion.div
                        key={link.id}
                        whileHover={{ x: 6 }}
                        className="w-full"
                      >
                        <button
                          onClick={() => handleNavClick(link.id)}
                          className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center gap-3.5 group cursor-pointer border ${
                            isActive 
                              ? 'bg-gradient-to-r from-brand-blue to-blue-900 border-brand-gold/50 text-white shadow-lg shadow-brand-blue/10 font-bold' 
                              : 'bg-white/[0.02] border-transparent text-slate-300 hover:text-white hover:bg-white/[0.06] hover:border-white/5'
                          }`}
                        >
                          <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-brand-gold text-brand-blue' : 'bg-white/5 text-slate-400 group-hover:text-brand-gold'}`}>
                            {getNavLinkIcon(link.id)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold font-display tracking-widest block">{link.label}</span>
                            <span className="text-[9px] text-slate-400 font-light block mt-0.5 truncate">{getNavLinkDesc(link.id)}</span>
                          </div>
                          <ArrowRight className={`w-3 h-3 text-slate-500 transition-transform ${isActive ? 'text-brand-gold translate-x-0.5' : 'group-hover:translate-x-1 group-hover:text-white'}`} />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Info Footer & Action triggers */}
              <div className="mt-8 pt-5 border-t border-white/10 space-y-4">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openQuoteModal();
                  }}
                  className="w-full py-3.5 text-center text-xs font-black font-display tracking-widest rounded bg-brand-gold text-brand-blue hover:bg-yellow-400 transition-colors cursor-pointer shadow-lg hover:shadow-yellow-500/20 active:scale-[0.98]"
                >
                  ĐĂNG KÝ TƯ VẤN THÀNH PHẨM IN
                </button>

                {/* Hotline metadata shortcut */}
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-[9px] font-black text-brand-gold tracking-widest uppercase">Phòng nghiệp vụ in</h5>
                    <p className="text-xs font-black text-white font-mono mt-0.5">{COMPANY_INFO.phoneDisplay}</p>
                  </div>
                </div>

                <div className="text-center text-[9px] text-slate-500 font-display uppercase tracking-widest leading-relaxed">
                  <p>MÃ KHU VỰC SẢN XUẤT: HN_NZ_7900</p>
                  <p className="mt-1 lowercase font-sans text-slate-400 hover:underline cursor-pointer">{COMPANY_INFO.email}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
