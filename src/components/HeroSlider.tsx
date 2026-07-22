import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCMS } from '../context/CMSContext';
import { 
  Shield, 
  Eye, 
  Award, 
  Cpu, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Video, 
  VideoOff, 
  FlameKindling,
  Sparkles,
  Check,
  QrCode,
  Printer,
  ShieldCheck
} from 'lucide-react';

interface HeroSliderProps {
  onLearnMore: (id: string) => void;
  openQuoteModal: () => void;
}

export default function HeroSlider({ onLearnMore, openQuoteModal }: HeroSliderProps) {
  const { slides } = useCMS();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Rotate slides automatically every 8 seconds
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8500);
    return () => clearInterval(interval);
  }, [slides?.length]);

  // Adjust video play state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying && isVideoActive) {
        videoRef.current.play().catch(() => {
          // Auto-play was prevented, handle gracefully
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, isVideoActive]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleToggleVideoMode = () => {
    setIsVideoActive(!isVideoActive);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const corePillars = [
    {
      icon: <Cpu className="w-5 h-5 text-[#0A3273]" />,
      title: 'CÔNG NGHỆ IN KTS BIẾN ĐỔI DỮ LIỆU',
      desc: 'Ứng dụng hệ thống in kỹ thuật số hiện đại hỗ trợ in dữ liệu biến đổi, tích hợp QR Code định danh và số dự thưởng trên từng tờ vé.',
      color: 'border-slate-200 bg-white hover:border-[#0A3273]/40 hover:shadow-lg'
    },
    {
      icon: <Printer className="w-5 h-5 text-red-600" />,
      title: 'HỆ THỐNG IN OFFSET HIỆN ĐẠI',
      desc: 'Vận hành trên dây chuyền máy in Komori và Mitsubishi 4 màu – 5 màu, đáp ứng chất lượng in sắc nét và ổn định cho sản lượng lớn.',
      color: 'border-slate-200 bg-white hover:border-red-600/40 hover:shadow-lg'
    },
    {
      icon: <QrCode className="w-5 h-5 text-[#0A3273]" />,
      title: 'QUẢN LÝ DỮ LIỆU & QR CODE',
      desc: 'Mỗi tờ vé được quản lý bằng dữ liệu riêng biệt, hỗ trợ kiểm tra, xác thực thông tin và dò kết quả nhanh chóng bằng QR Code.',
      color: 'border-slate-200 bg-white hover:border-[#0A3273]/40 hover:shadow-lg'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-red-600" />,
      title: 'CHẤT LƯỢNG IN ỔN ĐỊNH',
      desc: 'Thành phẩm được kiểm soát chất lượng trong từng công đoạn, đảm bảo độ chính xác màu sắc, tính đồng đều và khả năng bảo quản tốt.',
      color: 'border-slate-200 bg-white hover:border-red-600/40 hover:shadow-lg'
    }
  ];

  return (
    <section className="relative w-full bg-[#123A78] overflow-hidden text-white" id="hero-banner">
      
      {/* 1. LAYER UNDERLAY: DEEP CYBER GRADIENT VIGNETTE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(10,50,115,0.45),transparent_60%)] z-10 pointer-events-none"></div>

      {/* 2. LAYER CYBER-GRID DECOR (0.08 opacity for a subtle high-tech safety security theme) */}
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] z-10 pointer-events-none"></div>

      {/* 3. SECURITY SCANNING LASER EFFECT (Moving neon blue laser sweep representing security verification) */}
      {isVideoActive && isPlaying && (
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.7)] animate-scanline z-10 pointer-events-none"></div>
      )}

      {/* 4. ACTUAL BACKGROUND CONTROLLER (Video loops vs Photorealistic Image Slider) */}
      <div className="relative min-h-[820px] sm:min-h-[720px] lg:h-[750px] w-full flex items-center justify-center bg-gradient-to-br from-[#0D4F9C] via-[#1E63B5] to-[#2F7DD1]">
        
        {/* Full screen Video component */}
        {isVideoActive && !videoError && (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {/* Brighter 20% overlay on top of video */}
            <div className="absolute inset-0 bg-[#00004D]/20 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D4F9C]/40 via-[#1E63B5]/30 to-[#2F7DD1]/10 z-10"></div>
            
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              onCanPlay={() => setVideoLoaded(true)}
              onError={() => {
                setVideoError(true);
                setIsVideoActive(false);
              }}
              poster={slides[0].image}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-65"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-printing-machine-in-action-close-up-40453-large.mp4" type="video/mp4" />
              <source src="https://assets.mixkit.co/videos/preview/mixkit-printing-press-machine-printing-newspaper-41566-large.mp4" type="video/mp4" />
            </video>
          </div>
        )}

        {/* Photorealistic static fallback slide images inside AnimatePresence */}
        {(!isVideoActive || videoError) && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Brighter 20% overlay on top of slide images with corporate gradient blend */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0D4F9C]/80 via-[#1E63B5]/75 to-[#2F7DD1]/60 z-10"></div>
              <div className="absolute inset-0 bg-[#00004D]/20 z-10"></div>
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover object-center scale-100"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* 5. TEXT CONTENT & CALLS-TO-ACTION LAYOUT OVERLAY */}
        <div className="absolute inset-0 z-20 flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center pt-16 sm:pt-4 pb-28 lg:pb-0">
            
            {/* Left Column: Slider Heading, Badge, Subtitle & Buttons */}
            <div className="lg:col-span-7 flex flex-col items-start gap-4 sm:gap-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -25, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-start gap-4"
                >
                  {/* Micro tag badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black tracking-widest bg-brand-gold text-brand-blue rounded font-display uppercase shadow-sm">
                    <Sparkles className="w-3 h-3 text-brand-blue-dark animate-pulse" />
                    {slides[currentSlide].badgeText}
                  </span>

                  {/* Main Heading headline splits */}
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white uppercase leading-tight">
                    {slides[currentSlide].title.split('–')[0]}
                    {slides[currentSlide].title.includes('–') && (
                      <span className="text-brand-gold block xl:inline mt-1 xl:mt-0 xl:before:content-['-'] xl:before:mx-2 text-shadow-glow">
                        {slides[currentSlide].title.split('–')[1]}
                      </span>
                    )}
                  </h2>

                  {/* Support detail text */}
                  <p className="text-sm sm:text-[15px] text-slate-200 font-sans leading-relaxed max-w-2xl font-light">
                    {slides[currentSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Mobile/Tablet inline Highlight Block for QR & Digital tech */}
              <div className="block lg:hidden w-full mt-1">
                <div className="bg-[#0F3268]/85 backdrop-blur-md border border-brand-gold/30 rounded-lg p-4 shadow-xl">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/10 mb-2.5">
                    <Cpu className="w-4 h-4 text-brand-gold shrink-0 animate-pulse" />
                    <span className="text-xs font-black text-white uppercase tracking-wider font-display">🚀 CÔNG NGHỆ IN KTS HIỆN ĐẠI</span>
                  </div>
                  
                  <div className="p-2 py-1.5 rounded bg-red-950/50 border border-red-500/25 mb-2.5 flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-black text-red-200 uppercase tracking-widest leading-tight">
                      KÈM MÃ QR CODE 2 CHIỀU TÍCH HỢP SỐ DỰ THƯỞNG DÒ KẾT QUẢ
                    </span>
                  </div>

                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-slate-300">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> In vé số máy KTS tiên tiến</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Tích hợp QR Code 2 chiều</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Dò thưởng nhanh & chính xác</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Tăng bảo mật & dữ liệu gốc</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Sắc nét – tốc độ cao – ổn định</li>
                  </ul>
                </div>
              </div>

              {/* Always static interactive CTA Row */}
              <div className="flex flex-wrap gap-3.5 mt-2">
                <button
                  onClick={() => onLearnMore(slides[currentSlide].targetId)}
                  className="flex items-center gap-2 px-6 py-3.5 bg-brand-gold text-brand-blue hover:bg-yellow-400 hover:shadow-lg rounded font-display font-extrabold text-xs tracking-widest uppercase transition-all duration-200 scale-100 hover:scale-[1.03] active:scale-95 cursor-pointer shadow-md"
                >
                  KHÁM PHÁ NGAY <ArrowRight className="w-4 h-4 text-brand-blue" />
                </button>
                
                <button
                  onClick={openQuoteModal}
                  className="flex items-center gap-2 px-6 py-3.5 bg-white/10 text-white border border-white/20 hover:bg-white hover:text-brand-blue hover:border-white rounded font-display font-bold text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer backdrop-blur-sm"
                >
                  GỬI YÊU CẦU BÁO GIÁ
                </button>
              </div>
            </div>

            {/* Right Column: Modern tech block - always visible on desktop, high-contrast, premium styling */}
            <div className="lg:col-span-5 hidden lg:block">
              <motion.div 
                initial={{ opacity: 0, x: 35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative bg-[#0F3268]/85 backdrop-blur-md border border-brand-gold/30 rounded-xl p-6 shadow-2xl hover:border-brand-gold/50 transition-all duration-300 group overflow-hidden"
              >
                {/* Ambient glowing radial effects */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-4">
                  
                  {/* Box Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <div className="w-9 h-9 rounded bg-brand-gold/10 flex items-center justify-center border border-brand-gold/25">
                      <Cpu className="w-5 h-5 text-brand-gold animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-gold uppercase font-black tracking-widest font-display block select-none">Giải pháp đột phá</span>
                      <h3 className="text-sm font-black text-white tracking-wider uppercase font-display flex items-center gap-1.5 select-none">
                        🚀 CÔNG NGHỆ IN KTS HIỆN ĐẠI
                      </h3>
                    </div>
                  </div>

                  {/* QR Highlight Line requested */}
                  <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/20 shadow-inner flex items-start gap-2.5">
                    <span className="flex h-2 w-2 relative mt-1 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <p className="text-xs font-black text-red-200 tracking-wide uppercase leading-relaxed font-display">
                      KÈM MÃ QR CODE 2 CHIỀU TÍCH HỢP SỐ DỰ THƯỞNG DÒ KẾT QUẢ
                    </p>
                  </div>

                  {/* Advantages bullet list */}
                  <ul className="flex flex-col gap-3">
                    {[
                      "In vé số kiến thiết trên hệ thống máy in kỹ thuật số tiên tiến",
                      "Tích hợp mã QR Code 2 chiều hiện đại",
                      "Hỗ trợ dò kết quả dự thưởng nhanh chóng và chính xác",
                      "Tăng tính bảo mật, quản lý dữ liệu hiệu quả",
                      "Chất lượng in sắc nét – tốc độ cao – độ ổn định vượt trội"
                    ].map((text, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 group/item">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/25 group-hover/item:bg-emerald-500/20 transition-all duration-150">
                          <Check className="w-3.5 h-3.5 text-emerald-400 font-extrabold" />
                        </div>
                        <span className="text-xs text-slate-300 leading-normal font-sans group-hover/item:text-white transition-colors duration-150">
                          {text}
                        </span>
                      </li>
                    ))}
                  </ul>

                </div>
              </motion.div>
            </div>

          </div>
        </div>

        {/* 6. CORNER VIDEO BACKDROP CONTROL CENTER */}
        <div className="absolute bottom-32 sm:bottom-28 right-4 sm:right-6 lg:right-8 z-30 flex items-center gap-2 bg-[#0F3268]/80 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 shadow-lg">
          
          {/* Main system mode switcher */}
          <button
            onClick={handleToggleVideoMode}
            title={isVideoActive ? "Chuyển sang chế độ Slide ảnh" : "Bật video nghiệp vụ nhà máy"}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black font-display px-2.5 py-1.5 rounded transition-all duration-150 cursor-pointer bg-[#123A78] text-slate-200 hover:bg-brand-gold hover:text-brand-blue"
          >
            {isVideoActive ? (
              <>
                <VideoOff className="w-3.5 h-3.5 shrink-0" />
                <span>ẢNH THỰC TẾ</span>
              </>
            ) : (
              <>
                <Video className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                <span>PHIM SẢN XUẤT</span>
              </>
            )}
          </button>

          {/* Divider */}
          <span className="w-px h-4 bg-white/10 block"></span>

          {/* Play & Pause video handler */}
          {isVideoActive && (
            <button
              onClick={handleTogglePlay}
              aria-label={isPlaying ? "Tạm dừng video" : "Phát tiếp video"}
              className="w-8 h-8 rounded bg-white/10 hover:bg-brand-gold hover:text-brand-blue flex items-center justify-center transition-colors cursor-pointer text-slate-200"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
          )}

          {/* Quick status dot */}
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isVideoActive && isPlaying ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isVideoActive && isPlaying ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>

        </div>

        {/* 7. PREV & NEXT ARROWS OVERLAY */}
        <button
          onClick={prevSlide}
          aria-label="Slide trước"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-[#00004D]/40 hover:bg-brand-gold hover:text-brand-blue border border-white/15 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={nextSlide}
          aria-label="Slide sau"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-[#00004D]/40 hover:bg-brand-gold hover:text-brand-blue border border-white/15 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* 8. MINI DOT LIST INDICATORS */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Đi tới slide ${idx + 1}`}
              className={`w-10 h-1.5 rounded transition-all cursor-pointer ${
                idx === currentSlide ? 'bg-brand-gold' : 'bg-white/45 hover:bg-white/85'
              }`}
            ></button>
          ))}
        </div>

      </div>

      {/* 9. FLOATING MULTI-UNIT BENTO GRIDS (REMAIN SECURE AND STATIC AT BOTTOM FOLD) */}
      <div className="relative z-30 w-full px-4 sm:px-6 lg:px-8 -mt-24 pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {corePillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ y: 55, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`p-6 rounded-xl bg-white text-slate-900 border ${pillar.color} shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 group flex flex-col gap-3.5`}
            >
              <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-gold/20 transition-all select-none duration-250">
                {pillar.icon}
              </div>
              <div>
                <h3 className="text-xs font-black tracking-wider text-brand-blue uppercase font-display mb-1.5 group-hover:text-brand-blue-dark transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans font-normal">
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
