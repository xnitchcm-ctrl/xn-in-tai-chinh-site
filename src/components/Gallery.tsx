import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Eye, X, ChevronLeft, ChevronRight, Filter, ZoomIn, ShieldCheck, Compass } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/companyData';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'machinery' | 'products' | 'certificates'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const filters = [
    { value: 'all', label: 'Tất Cả Hình Ảnh' },
    { value: 'machinery', label: 'Dây Chuyền Thiết Bị' },
    { value: 'products', label: 'Ấn Phẩm Bảo Mật' },
    { value: 'certificates', label: 'Kiểm Định & KCS' }
  ] as const;

  // Filter items based on selected category
  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  // Access keyboard shortcuts for convenient accessibility (Escape, Left, Right keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
        setIsZoomed(false);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
        setIsZoomed(false);
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
    setIsZoomed(false);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
    setIsZoomed(false);
  };

  // Pre-determined exquisite aspect ratios to ensure true masonry aesthetic feeling
  const masonryAspects = [
    'aspect-[4/3] sm:aspect-[3/2]',
    'aspect-[3/4] sm:aspect-[4/5]',
    'aspect-square',
    'aspect-[16/10]',
    'aspect-[3/4] sm:aspect-[2/3]',
    'aspect-[4/3] sm:aspect-[16/11]',
  ];

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      
      {/* Decorative subtle background highlights */}
      <span className="absolute top-1/4 left-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
      <span className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center flex flex-col items-center gap-2 mb-16 relative z-10">
          <span className="text-xs font-bold tracking-widest text-brand-gold uppercase font-side-decor flex items-center gap-2">
            <Compass className="w-4 h-4 text-brand-gold animate-spin-slow" />
            THƯ VIỆN ĐỘC QUYỀN THÀNH PHẨM
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-brand-blue tracking-tight leading-none uppercase mt-2">
            KHÔNG GIAN NHÀ XƯỞNG THỰC TẾ
          </h2>
          <div className="w-16 h-1 bg-brand-gold rounded-full mt-3"></div>
          <p className="text-slate-500 font-sans text-xs sm:text-sm max-w-xl mt-4 leading-relaxed">
            HÌnh ảnh thật 100% được tập hợp tại xưởng sản xuất Hóc Môn. Quy trình vận hành kiểm tra nghiêm ngặt, khép kín, tuyệt mật theo triết lý bảo toàn thông tin tối cao.
          </p>
        </div>

        {/* Filter Toolbar Options with Premium Pill Styling */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mb-12 bg-white/85 p-2 border border-slate-200/60 rounded-2xl max-w-2xl mx-auto shadow-sm backdrop-blur">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setActiveFilter(f.value);
                setLightboxIndex(null);
                setIsZoomed(false);
              }}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-display text-xs font-extrabold tracking-wider transition-all cursor-pointer select-none focus:outline-none ${
                activeFilter === f.value
                  ? 'bg-brand-blue text-white shadow shadow-brand-blue/20'
                  : 'text-slate-600 hover:text-brand-blue hover:bg-slate-100/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* CSS Masonry Multi-Column Layout */}
        <motion.div 
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance] w-full"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const aspectClass = masonryAspects[index % masonryAspects.length];
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45 }}
                  onClick={() => {
                    setLightboxIndex(index);
                    setIsZoomed(false);
                  }}
                  className={`break-inside-avoid relative overflow-hidden rounded-2xl border border-slate-250/70 bg-slate-900 group cursor-pointer shadow hover:shadow-2xl transition-all duration-300 ${aspectClass}`}
                >
                  {/* Image tag with lazy support */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-[0.93] group-hover:brightness-100"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />

                  {/* Laser Scan Sweeper decoration on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold or to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_rgb(220,169,42)] absolute-scan" />

                  {/* Exquisite Double Masking gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-5 sm:p-6 flex flex-col justify-end z-20">
                    
                    {/* Floating Meta */}
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                      <div className="flex items-center gap-1.5 text-brand-gold text-[9px] uppercase font-black tracking-widest font-display">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Hệ thống ISO 27001</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-blue flex items-center justify-center shadow-lg transform scale-90 hover:scale-100 transition-transform">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-white font-display uppercase tracking-wide leading-snug mt-2.5 truncate-2-lines line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  {/* Absolute category tag spacer */}
                  <span className="absolute top-3.5 right-3.5 bg-slate-950/60 backdrop-blur-md text-white/90 font-display font-medium text-[8px] tracking-widest uppercase py-1 px-2.5 rounded-full border border-white/10 opacity-75 group-hover:opacity-100 transition-opacity">
                    Khu vực #0{index + 1}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Premium Glassmorphism Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && filteredItems[lightboxIndex] && (
            <div 
              className="fixed inset-0 z-[200] flex flex-col justify-between bg-slate-950/98 backdrop-blur-2xl p-4 sm:p-6 select-none"
              onClick={() => setLightboxIndex(null)}
            >
              {/* top Navigation header */}
              <div className="w-full max-w-7xl mx-auto flex justify-between items-center py-4 relative z-[210] border-b border-white/5">
                <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-3 text-white text-xs font-display bg-white/5 px-4.5 py-2.5 rounded-xl border border-white/10 backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4 text-brand-gold" />
                  <span>
                    ẢNH THỰC TẾ {lightboxIndex + 1} / {filteredItems.length} – <strong className="text-brand-gold uppercase">{activeFilter}</strong>
                  </span>
                </div>

                {/* Top Center Controls bar */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className={`p-3 rounded-xl border transition-all text-white backdrop-blur-md cursor-pointer ${isZoomed ? 'bg-brand-gold text-brand-blue border-brand-gold' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    title="Phóng to ảnh"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLightboxIndex(null)}
                    className="p-3 bg-red-650/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/20 rounded-xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
                    aria-label="Đóng cửa sổ"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Content: Slider and Arrows */}
              <div 
                className="relative max-w-6xl w-full mx-auto flex-1 flex items-center justify-center my-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                
                {/* Left/Right controls (floating overlays) */}
                <button
                  onClick={prevImage}
                  aria-label="Hình trước"
                  className="absolute left-2 sm:left-4 z-[220] w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/60 hover:bg-brand-gold hover:text-brand-blue border border-white/10 text-white rounded-2xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-md group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Hình kế"
                  className="absolute right-2 sm:right-4 z-[220] w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/60 hover:bg-brand-gold hover:text-brand-blue border border-white/10 text-white rounded-2xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-md group"
                >
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Centered Image with cross-fade animate */}
                <div className="max-w-full max-h-[62vh] relative">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={filteredItems[lightboxIndex].id}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ 
                        opacity: 1, 
                        scale: isZoomed ? 1.3 : 1,
                        cursor: isZoomed ? 'zoom-out' : 'zoom-in'
                      }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                      src={filteredItems[lightboxIndex].image}
                      alt={filteredItems[lightboxIndex].title}
                      onClick={() => setIsZoomed(!isZoomed)}
                      className="max-w-full max-h-[62vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>
                </div>

              </div>

              {/* Bottom Image description panel & Thumbnails roll */}
              <div 
                className="w-full max-w-4xl mx-auto pb-4 relative z-[210] flex flex-col gap-4 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Meta block */}
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 max-w-2xl mx-auto backdrop-blur-md">
                  <p className="text-[10px] font-black text-brand-gold tracking-widest uppercase font-display mb-1 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                    CAM CHẾT KHÔNG GIAN BẢO MẬT KHÉP KÍN
                  </p>
                  <h4 className="text-sm font-bold text-white font-display tracking-wide uppercase leading-normal">
                    {filteredItems[lightboxIndex].title}
                  </h4>
                </div>

                {/* Clickable horizontal Thumbnails list for fast navigation */}
                <div className="flex justify-center items-center gap-2.5 overflow-x-auto max-w-full py-1.5 px-4 scrollbar-thin">
                  {filteredItems.map((thumb, idx) => {
                    const isSelected = idx === lightboxIndex;
                    return (
                      <button
                        key={thumb.id}
                        onClick={() => {
                          setLightboxIndex(idx);
                          setIsZoomed(false);
                        }}
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden cursor-pointer transition-all border shrink-0 ${
                          isSelected 
                            ? 'border-brand-gold scale-105 shadow-md shadow-brand-gold/15' 
                            : 'border-white/10 opacity-40 hover:opacity-15 hover:scale-102'
                        }`}
                      >
                        <img 
                          src={thumb.image} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
