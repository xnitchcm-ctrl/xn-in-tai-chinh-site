import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCMS } from '../context/CMSContext';
import { 
  Ticket, 
  FileSpreadsheet, 
  ShieldAlert, 
  Cpu, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Lock, 
  Shield 
} from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

export default function Services({ onSelectServiceForQuote }: ServicesProps) {
  const { services: SERVICE_ITEMS } = useCMS();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Ticket':
        return <Ticket className="w-6 h-6" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-6 h-6" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6" />;
      default:
        return <ShieldCheck className="w-6 h-6" />;
    }
  };

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#F5F8FC] relative overflow-hidden">
      {/* Decorative corporate background elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 -right-64 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-64 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Large Typography */}
        <div className="text-center flex flex-col items-center gap-3 mb-16 relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-black tracking-widest text-[#F4C542] uppercase font-display bg-[#0D4F9C]/5 px-4 py-1.5 rounded-full border border-[#0D4F9C]/10 animate-fade"
          >
            SẢN PHẨM & DỊCH VỤ CHỦ LỰC
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-black font-display text-[#0D4F9C] tracking-tight leading-tight uppercase max-w-4xl mt-2"
          >
            LĨNH VỰC IN ẤN TÀI CHÍNH & BẢO MẬT CHUYÊN SÂU
          </motion.h2>
          
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="w-24 h-1 bg-gradient-to-r from-[#0D4F9C] via-[#F4C542] to-[#0D4F9C] rounded-full mt-3"
          ></motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-[#153A6B] font-sans text-sm sm:text-base max-w-2xl mt-3 leading-relaxed font-semibold opacity-90"
          >
            Quy trình sản xuất chuyên nghiệp, được kiểm soát chặt chẽ từ khâu tiếp nhận dữ liệu, chế bản, in ấn cho đến hoàn thiện và giao thành phẩm.
          </motion.p>
        </div>

        {/* REQUIRED: Banner nổi bật đầu section: CHUYÊN IN VÉ SỐ KIẾN THIẾT & ẤN PHẨM TÀI CHÍNH */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 bg-[#0D4F9C] border border-[#F4C542]/30 rounded-2xl overflow-hidden relative shadow-2xl p-6 sm:p-10 text-white"
        >
          {/* Pattern Overlay representing security / technology */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          
          {/* Glow effects in background */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#F4C542]/10 blur-[130px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-[#1E63B5]/50 blur-[90px] rounded-full pointer-events-none"></div>
          
          {/* Golden security top block line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0D4F9C] via-[#F4C542] to-[#1E63B5]"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4C542]/15 border border-[#F4C542]/35 rounded-full text-[10px] uppercase font-black tracking-widest text-[#F4C542] font-display mb-4">
                <span className="w-2 h-2 rounded-full bg-[#F4C542] animate-pulse"></span>
                Dây Chuyền In Chất Lượng Đạt Chuẩn ISO 9001:2015
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-[#F4C542] tracking-tight uppercase leading-tight mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                🔴 CHUYÊN IN VÉ SỐ KIẾN THIẾT & ẤN PHẨM TÀI CHÍNH
              </h3>
              
              <div className="w-full h-px bg-white/10 my-4"></div>
              
              <p className="text-slate-300 text-xs sm:text-sm font-sans mb-6 leading-relaxed">
                Xí nghiệp vận hành quy trình sản xuất khép kín chuyên nghiệp, đáp ứng đầy đủ yêu cầu cho các sản phẩm in ấn đặc thù phục vụ ngành xổ số và tài chính:
              </p>
              
              {/* Bullet points summarizing "CHUYÊN IN" */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 font-sans">
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#F4C542]/15 border border-[#F4C542]/30 text-[#F4C542] shrink-0 mt-0.5 shadow-sm">
                    <Ticket className="w-3.5 h-3.5" />
                  </span>
                  <div className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                    <strong className="text-white">Vé số kiến thiết:</strong> Vận hành trên máy in Komori/Mitsubishi và hệ thống in kỹ thuật số biến đổi mã vạch, QR Code định danh, tối ưu hóa công tác dò số đối so kết quả.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#F4C542]/15 border border-[#F4C542]/30 text-[#F4C542] shrink-0 mt-0.5 shadow-sm">
                    <Cpu className="w-3.5 h-3.5" />
                  </span>
                  <div className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                    <strong className="text-white">Vé số cào:</strong> Sản xuất trên hệ thống chuyên dụng phủ nhôm latex chống soi đạt yêu cầu và mẫu phủ bóng bảo quản sản phẩm hoàn thiện.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#F4C542]/15 border border-[#F4C542]/30 text-[#F4C542] shrink-0 mt-0.5 shadow-sm">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  </span>
                  <div className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                    <strong className="text-white">Ngành tài chính:</strong> Chứng từ, biểu mẫu đa liên carbonless tự sao, hóa đơn đỏ, và các ấn phẩm đặc thù doanh nghiệp khác.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Elegant Slogan Box */}
            <div className="shrink-0 lg:w-80 bg-white border border-[#D8E4F5] rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-[0_8px_24px_rgba(13,79,156,0.08)] gap-5 relative group overflow-hidden">
              {/* Corner tech lines */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D8E4F5]"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#D8E4F5]"></div>
              
              <p className="text-[10px] font-black tracking-widest text-[#0D4F9C] font-display uppercase">Slogan Nổi Bật</p>
              
              <div className="flex flex-col gap-2 my-1">
                <span className="text-2xl sm:text-3xl font-black font-display tracking-widest text-[#0D4F9C] uppercase">UY TÍN</span>
                <span className="text-2xl sm:text-3xl font-black font-display tracking-widest text-[#1E63B5] uppercase">CHẤT LƯỢNG</span>
                <span className="text-2xl sm:text-3xl font-black font-display tracking-widest text-[#F4C542] uppercase">NHANH CHÓNG</span>
              </div>
              
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#0D4F9C]/40 to-transparent"></div>
              <p className="text-[11px] text-slate-600 font-sans leading-relaxed italic">
                Kim chỉ nam định hướng mọi quy trình vận hành và giữ trọn niềm tin của cơ quan quản lý và đối tác.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 3-Column Enterprise Grid with Card Lift, Hover Glow & Smooth Transitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {SERVICE_ITEMS.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="group flex flex-col bg-white border border-[#D8E4F5] rounded-2xl overflow-hidden hover:border-[#2F7DD1]/50 shadow-[0_8px_24px_rgba(13,79,156,0.08)] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              {/* Image Frame with hover scaling zoom & security watermark effect */}
              <div className="relative h-60 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-50 transition-opacity"></div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#0D4F9C]/10 z-20 pointer-events-none transition-all duration-300"></div>
                
                {/* Security lines overlay representing precision */}
                <div className="absolute inset-0 pointer-events-none z-10 opacity-15 overflow-hidden">
                  <div className="w-full h-1 bg-[#F4C542] absolute animate-scanline pointer-events-none"></div>
                </div>

                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Service Badge Icon */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold text-[#0D4F9C] shadow-lg group-hover:bg-[#0D4F9C] group-hover:text-white transition-all duration-300">
                  {getIcon(service.iconName)}
                </div>

                {/* Secure Badge Tag */}
                <span className="absolute top-4 right-4 z-20 px-2.5 py-1 text-[9px] font-bold tracking-widest bg-slate-950/80 border border-brand-gold/30 text-brand-gold uppercase rounded backdrop-blur-sm">
                  SECURE AREA
                </span>
              </div>

              {/* Service Details info */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col gap-4 text-slate-800">
                <span className="text-[10px] text-[#0D4F9C] font-bold tracking-widest uppercase font-display leading-none">
                  LĨNH VỰC 0{i + 1}
                </span>
                
                <h3 className="text-lg sm:text-xl font-bold text-[#0D4F9C] font-display tracking-tight uppercase group-hover:text-[#1E63B5] transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-xs font-normal text-slate-600 leading-relaxed min-h-[40px]">
                  {service.shortDesc}
                </p>

                {/* Divider */}
                <div className="w-full h-px bg-slate-100 my-1"></div>

                {/* Bullets lists */}
                <ul className="space-y-3 text-xs text-slate-700 flex-1">
                  {service.bullets.slice(0, 4).map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="p-0.5 rounded-full bg-[#0D4F9C]/10 text-[#0D4F9C] shrink-0 mt-0.5 border border-[#0D4F9C]/20">
                        <Check className="w-2.5 h-2.5 text-[#0D4F9C]" />
                      </span>
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Sub-actions buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedService(service);
                    }}
                    className="w-full sm:w-auto text-xs font-bold tracking-wider text-slate-600 hover:text-[#0D4F9C] transition-colors flex items-center justify-center gap-1.5 py-2 group-hover:scale-105 transform duration-300 cursor-pointer font-display"
                  >
                    Xem Chi Tiết <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectServiceForQuote(service.title);
                    }}
                    className="w-full sm:flex-1 py-2.5 px-4 text-xs font-black tracking-widest bg-[#F4C542] hover:bg-[#0D4F9C] text-[#0D4F9C] hover:text-white font-display rounded-lg transition-all duration-300 cursor-pointer uppercase shadow-sm flex items-center justify-center gap-1.5"
                  >
                    Tư vấn ngay
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Service Detail Modal Container */}
        <AnimatePresence>
          {selectedService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              
              {/* Dismiss backing overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedService(null)}
                className="fixed inset-0 bg-slate-950/80 z-40 backdrop-blur-sm"
              />

              <motion.div
                initial={{ scale: 0.94, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                className="relative w-full max-w-3xl bg-white text-[#153A6B] border border-[#D8E4F5] rounded-2xl shadow-2xl overflow-hidden z-50 my-8"
              >
                {/* Top banner aspect with image */}
                <div className="relative h-48 sm:h-64 md:h-72 w-full bg-slate-950">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent z-10"></div>
                  <img
                    src={selectedService.image}
                    alt={selectedService.title}
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating tags */}
                  <span className="absolute top-4 left-4 z-20 px-3 py-1 text-[10px] font-black tracking-widest bg-brand-gold text-slate-950 uppercase rounded font-display select-none">
                    TIÊU CHUẨN AN TOÀN NHÀ NƯỚC
                  </span>

                  {/* Close Button top-right */}
                  <button
                    onClick={() => setSelectedService(null)}
                    className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/60 hover:bg-brand-gold text-white hover:text-slate-950 rounded-full flex items-center justify-center transition-colors cursor-pointer text-2xl font-light"
                    aria-label="Đóng"
                  >
                    &times;
                  </button>

                  {/* Absolute titles on image */}
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight text-shadow-glow uppercase">
                      {selectedService.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#F4C542] font-sans tracking-tight mt-1.5 font-medium">
                      {selectedService.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 flex flex-col gap-6 max-h-[calc(100vh-280px)] overflow-y-auto font-sans">
                  <div>
                    <h4 className="text-[10px] font-bold text-[#0D4F9C] tracking-widest uppercase font-display mb-2 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#0D4F9C]" /> MÔ TẢ CHI TIẾT NGHIỆP VỤ
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {selectedService.longDesc}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-[#0D4F9C] tracking-widest uppercase font-display mb-3 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#0D4F9C]" /> CÁC TIÊU CHUẨN KỸ THUẬT QUY CƠ
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-sans">
                      {selectedService.bullets.map((bullet, idx) => (
                        <div key={idx} className="p-3.5 rounded-lg bg-[#F5F8FC] border border-[#D8E4F5] flex items-start gap-3 hover:border-[#1E63B5]/20 transition-all duration-300">
                          <span className="p-1 rounded-full bg-[#0D4F9C]/10 text-[#0D4F9C] shrink-0 mt-0.5 border border-[#0D4F9C]/20">
                            <Check className="w-3 text-[#0D4F9C]" />
                          </span>
                          <p className="text-xs text-slate-700 font-sans font-medium leading-relaxed">
                            {bullet}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end items-center gap-4 mt-2 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedService(null)}
                      className="px-5 py-2.5 text-xs text-slate-500 hover:text-[#0D4F9C] font-semibold uppercase rounded cursor-pointer transition-colors"
                    >
                      Đóng cửa sổ
                    </button>
                    <button
                      onClick={() => {
                        onSelectServiceForQuote(selectedService.title);
                        setSelectedService(null);
                      }}
                      className="px-6 py-2.5 text-xs font-black tracking-widest bg-[#F4C542] text-[#0D4F9C] hover:bg-[#0D4F9C] hover:text-white rounded-lg transition-all duration-300 cursor-pointer font-display uppercase shadow-md"
                    >
                      Tư vấn ngay
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
