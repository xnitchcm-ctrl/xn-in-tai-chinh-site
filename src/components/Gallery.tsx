import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Eye, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/companyData';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'machinery' | 'products' | 'certificates'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filters = [
    { value: 'all', label: 'Tất Cả Hình Ảnh' },
    { value: 'machinery', label: 'Dây Chuyền Thiết Bị' },
    { value: 'products', label: 'Ấn Phẩm - Vé Số - Hóa Đơn' },
    { value: 'certificates', label: 'Nghiệp Vụ Kiểm Tra & ISO' }
  ] as const;

  // Filter products based on selected tab
  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % filteredItems.length;
    });
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + filteredItems.length) % filteredItems.length;
    });
  };

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center flex flex-col items-center gap-2 mb-12">
          <span className="text-xs font-bold tracking-widest text-brand-gold uppercase font-display">
            THƯ VIỆN HÌNH ẢNH THỰC TẾ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-brand-blue tracking-tight leading-tight uppercase">
            HÌNH ẢNH HOẠT ĐỘNG XÍ NGHIỆP TẠI NHÀ XƯỞNG
          </h2>
          <div className="w-20 h-1 bg-brand-gold rounded-full mt-2"></div>
          <p className="text-slate-500 font-sans text-xs sm:text-sm max-w-xl mt-2">
            Ghi nhận chân thực về không gian sản xuất khép kín, trang thiết bị tối tân và quy trình làm việc chuẩn mực nghiêm túc của mỗi công đoàn viên.
          </p>
        </div>

        {/* Filter Toolbar Options */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-10 bg-white p-3 border border-slate-200 rounded-full max-w-3xl mx-auto shadow-sm">
          <Filter className="w-4 h-4 text-brand-blue ml-3 hidden sm:block shrink-0" />
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setActiveFilter(f.value);
                setLightboxIndex(null); // Reset lightbox on filter change
              }}
              className={`px-4 sm:px-5 py-2 rounded-full font-display text-xs font-bold tracking-wider transition-all cursor-pointer ${
                activeFilter === f.value
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-brand-blue'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Dynamic Image Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setLightboxIndex(index)}
                className="group relative h-72 rounded-xl overflow-hidden shadow-md border border-slate-200 bg-slate-300 cursor-pointer"
              >
                {/* Visual Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Cover Overlay Slide up */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark/90 via-brand-blue/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 z-20">
                  <div className="flex items-center gap-2 text-brand-gold mb-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-widest font-display">Phóng To Ảnh</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white font-display uppercase tracking-wide leading-snug">
                    {item.title}
                  </h3>
                  <div className="mt-3 w-8 h-8 rounded-full bg-brand-gold text-brand-blue flex items-center justify-center shadow">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal Carousel Window */}
        <AnimatePresence>
          {lightboxIndex !== null && filteredItems[lightboxIndex] && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Outer details frame */}
              <div className="absolute top-4 left-4 text-white text-xs font-display flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-white/10">
                <ImageIcon className="w-4 h-4 text-brand-gold" />
                <span>Ảnh {lightboxIndex + 1} / {filteredItems.length} - <strong className="text-brand-gold uppercase">{activeFilter}</strong></span>
              </div>

              {/* Close Button Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 z-50 w-11 h-11 bg-black/50 hover:bg-brand-gold border border-white/15 text-white hover:text-brand-blue rounded-full flex items-center justify-center transition-all cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Main Carousel Element container */}
              <div 
                className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()} // Stop propagation to prevent closing
              >
                
                {/* Image tag */}
                <motion.img
                  key={filteredItems[lightboxIndex].id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={filteredItems[lightboxIndex].image}
                  alt={filteredItems[lightboxIndex].title}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg border border-white/10"
                  referrerPolicy="no-referrer"
                />

                {/* Left/Right carousel controls */}
                <button
                  onClick={prevImage}
                  aria-label="Ảnh trước"
                  className="absolute left-2 sm:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/55 hover:bg-brand-gold text-white hover:text-brand-blue rounded-full flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Ảnh sau"
                  className="absolute right-2 sm:-right-16 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/55 hover:bg-brand-gold text-white hover:text-brand-blue rounded-full flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Captions card */}
                <div className="absolute -bottom-14 left-0 right-0 text-center bg-black/60 p-3 rounded border border-white/10">
                  <p className="text-xs font-semibold text-white font-display uppercase tracking-wider">
                    {filteredItems[lightboxIndex].title}
                  </p>
                </div>

              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
