import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Phone, Mail, MapPin, Building, Globe } from 'lucide-react';
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

  // Scroll handler to make navbar sticky on page scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
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
    { id: 'about', label: 'GIỚI THIỆU' },
    { id: 'services', label: 'DỊCH VỤ IN' },
    { id: 'technology', label: 'CÔNG NGHỆ' },
    { id: 'gallery', label: 'THƯ VIỆN HÌNH ẢNH' },
    { id: 'recruitment', label: 'TUYỂN DỤNG' },
    { id: 'contact', label: 'LIÊN HỆ' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchNotification(`Đang tìm kiếm: "${searchQuery}" trên toàn hệ thống...`);
    setTimeout(() => setSearchNotification(''), 4500);
  };

  return (
    <header className="w-full flex flex-col z-50 bg-white shadow-sm transition-all duration-300">
      {/* Top Banner & Info Bar (Static / Pre-header) */}
      <div className="w-full bg-slate-50 border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Building className="w-3.5 h-3.5 text-brand-blue" />
              Chủ quản: <span className="text-zinc-900 font-semibold">{COMPANY_INFO.parentCompany}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-brand-blue" />
              Website: <a href={`http://${COMPANY_INFO.website}`} className="hover:text-amber-600 hover:underline">{COMPANY_INFO.website}</a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-brand-blue">
              <MapPin className="w-3.5 h-3.5 text-brand-gold" />
              Cụm công nghiệp Nhị Xuân, Hóc Môn
            </span>
          </div>
        </div>
      </div>

      {/* Main Branding Logo & Hotlines Bar */}
      <div className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo Brand Title with official Vietnam State styling */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleNavClick('hero')}>
            {/* Corporate Round Emblem (SVG rendering the XSKT circular badge motif) */}
            <div className="relative w-16 h-16 bg-gradient-to-tr from-brand-blue to-blue-800 rounded-full flex flex-col items-center justify-center border-4 border-brand-gold shadow-md shrink-0">
              {/* Star details inside the emblem */}
              <div className="absolute top-1 text-[8px] font-bold text-brand-gold leading-none">XỔ SỐ</div>
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-display font-black text-amber-300 text-sm mt-1 shadow-inner bg-slate-800/20">
                IT
              </div>
              <div className="absolute bottom-1 text-[8px] font-bold text-white tracking-widest leading-none">TP.HCM</div>
            </div>

            {/* Typography labels */}
            <div>
              <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-500 font-display">
                {COMPANY_INFO.parentCompany}
              </p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-brand-blue font-display tracking-tight leading-tight uppercase">
                {COMPANY_INFO.name}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="h-[2px] w-8 bg-brand-gold rounded-full"></span>
                <p className="text-[10px] sm:text-xs font-bold text-brand-gold tracking-widest uppercase font-display">
                  CHẤT LƯỢNG HÔM NAY – GIÁ TRỊ NGÀY MAI
                </p>
              </div>
            </div>
          </div>

          {/* Quick Contacts & Search Bar */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 w-full md:w-auto">
            
            {/* Contact numbers */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-blue/5 border border-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue">
                <Phone className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Hotline Tư vấn</p>
                <p className="text-base font-black text-brand-blue font-mono">{COMPANY_INFO.phoneDisplay}</p>
              </div>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-xs sm:w-60 md:w-64">
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ, kỹ thuật..."
                value={searchQuery}
                aria-label="Tìm kiếm"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 text-xs bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
              />
              <button
                type="submit"
                aria-label="Tìm"
                className="absolute right-1 p-1.5 text-white bg-brand-blue hover:bg-brand-blue-dark rounded-full transition-all cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        </div>
      </div>

      {/* Floating Query Feedback Note */}
      {searchNotification && (
        <div className="bg-amber-100 text-amber-900 text-xs text-center py-2 px-4 shadow-inner">
          {searchNotification}
        </div>
      )}

      {/* Desktop & Mobile Navigation (Sticky-capable) */}
      <div 
        className={`w-full transition-all duration-300 ${
          isSticky 
            ? 'fixed top-0 left-0 right-0 shadow-lg bg-brand-blue text-white py-3' 
            : 'bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* Brand Prefix in compact Sticky state */}
          {isSticky && (
            <div 
              className="flex items-center gap-2 cursor-pointer transition-all duration-300 text-brand-gold hover:text-white"
              onClick={() => handleNavClick('hero')}
            >
              <div className="w-7 h-7 bg-brand-gold text-brand-blue rounded-full flex items-center justify-center font-bold text-xs">
                IN
              </div>
              <span className="font-display font-bold text-sm tracking-wider uppercase">IN TÀI CHÍNH</span>
            </div>
          )}

          {/* Desktop Navigation Link row */}
          <nav className="hidden lg:flex items-center divide-x divide-white/10 flex-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-5 py-3.5 text-xs font-bold font-display tracking-widest cursor-pointer transition-all relative ${
                    isActive 
                      ? 'bg-brand-gold text-brand-blue' 
                      : 'hover:bg-black/15 text-white'
                  }`}
                >
                  {link.label}
                  {isActive && !isSticky && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-white"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Free quote action button inside header */}
          <div className="hidden sm:block">
            <button
              onClick={openQuoteModal}
              className="px-5 py-2 text-xs font-extrabold tracking-wider font-display rounded-full bg-brand-gold text-brand-blue hover:bg-yellow-400 border border-amber-300 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md uppercase"
            >
              ĐĂNG KÝ TƯ VẤN IN
            </button>
          </div>

          {/* Mobile hamburger icon */}
          <div className="lg:hidden flex items-center justify-between w-full sm:w-auto py-2">
            {!isSticky && (
              <span className="font-display font-medium text-xs tracking-wider text-amber-300 font-bold block sm:hidden">
                {COMPANY_INFO.slogan}
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

      {/* Mobile Drawer Slide-out Nav Block */}
      {isMenuOpen && (
        <div className="lg:hidden w-full bg-brand-blue border-t border-brand-blue-dark py-4 px-4 transition-all duration-300 shadow-2xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold tracking-wider font-display transition-all ${
                    isActive 
                      ? 'bg-brand-gold text-brand-blue' 
                      : 'text-white hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <div className="pt-4 border-t border-white/10 mt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openQuoteModal();
                }}
                className="w-full py-3 text-center text-xs font-black font-display tracking-widest rounded-lg bg-brand-gold text-brand-blue hover:bg-yellow-400 text-shadow cursor-pointer shadow"
              >
                ĐĂNG KÝ TƯ VẤN IN NGAY
              </button>
              <div className="text-center text-[10px] text-slate-300 pt-2 font-display">
                <p>Hotline: {COMPANY_INFO.phone}</p>
                <p>Địa chỉ: {COMPANY_INFO.address}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
