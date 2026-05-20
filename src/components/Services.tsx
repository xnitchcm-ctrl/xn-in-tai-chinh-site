import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { SERVICE_ITEMS } from '../data/companyData';
import { ServiceItem } from '../types';

interface ServicesProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

export default function Services({ onSelectServiceForQuote }: ServicesProps) {
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
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
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
            className="text-xs sm:text-sm font-black tracking-widest text-[#DCA92A] uppercase font-display bg-brand-blue/5 px-4 py-1.5 rounded-full border border-brand-blue/10 animate-fade"
          >
            SẢN PHẨM & DỊCH VỤ CHỦ LỰC
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-black font-display text-brand-blue tracking-tight leading-tight uppercase max-w-4xl mt-2"
          >
            LĨNH VỰC IN ẤN TÀI CHÍNH & BẢO MẬT CHUYÊN SÂU
          </motion.h2>
          
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="w-24 h-1 bg-gradient-to-r from-brand-blue via-brand-gold to-brand-blue rounded-full mt-3"
          ></motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-slate-600 font-sans text-sm sm:text-base max-w-2xl mt-3 leading-relaxed"
          >
            Mọi quy trình sản xuất đều tuân thủ các quy định bảo mật khắt khe của Nhà nước, giám sát tự động bằng trí tuệ nhân tạo và hệ thống KCS đa lớp khép kín.
          </motion.p>
        </div>

        {/* REQUIRED: Banner nổi bật đầu section: CHUYÊN IN TÀI CHÍNH - BẢO MẬT CAO */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 bg-[#0A3273] border border-brand-gold/30 rounded-2xl overflow-hidden relative shadow-2xl p-6 sm:p-10 text-white"
        >
          {/* Pattern Overlay representing security / technology */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          
          {/* Glow effects in background */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#DCA92A]/10 blur-[130px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-[#07224f]/50 blur-[90px] rounded-full pointer-events-none"></div>
          
          {/* Golden security top block line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0A3273] via-[#DCA92A] to-[#07224f]"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DCA92A]/10 border border-[#DCA92A]/20 rounded-full text-[10px] uppercase font-black tracking-widest text-[#DCA92A] font-display mb-4">
                <span className="w-2 h-2 rounded-full bg-[#DCA92A] animate-pulse"></span>
                Dây Chuyền In Đạt Chuẩn ISO 9001 & ISO 27001
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight uppercase leading-tight mb-4">
                CHUYÊN IN TÀI CHÍNH - BẢO MẬT CAO
              </h3>
              
              <div className="w-full h-px bg-white/10 my-4"></div>
              
              <p className="text-slate-300 text-xs sm:text-sm font-sans mb-6 leading-relaxed">
                Hệ thống xí nghiệp vận hành quy trình khép kín hoạt động tự động hóa cao, cam kết đáp ứng trọn vẹn những sản phẩm chuyên sâu đòi hỏi nghiệp vụ tài chính tiền tệ nghiêm ngặt hàng đầu:
              </p>
              
              {/* Bullet points summarizing "CHUYÊN IN" */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 font-sans">
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#DCA92A]/10 border border-[#DCA92A]/30 text-[#DCA92A] shrink-0 mt-0.5 shadow-sm">
                    <Ticket className="w-3.5 h-3.5" />
                  </span>
                  <div className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                    <strong className="text-white">Vé số kiến thiết:</strong> In bằng máy in KTS hiện đại kèm mã vạch 2 chiều tích hợp số dự thưởng nhảy dữ liệu biến đổi chống trùng lặp.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#DCA92A]/10 border border-[#DCA92A]/30 text-[#DCA92A] shrink-0 mt-0.5 shadow-sm">
                    <Cpu className="w-3.5 h-3.5" />
                  </span>
                  <div className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                    <strong className="text-white">Vé số cào:</strong> Sản xuất trên hệ thống thiết bị phủ latex nhôm và mực chống soi hiện đại bảo đảm độ che phủ 100%, bảo mật mật độ tuyệt mật.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#DCA92A]/10 border border-[#DCA92A]/30 text-[#DCA92A] shrink-0 mt-0.5 shadow-sm">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  </span>
                  <div className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                    <strong className="text-white">Ngành tài chính:</strong> Chứng từ, biểu mẫu đa liên carbonless tự sao, hóa đơn đỏ, và các ấn phẩm đặc thù doanh nghiệp khác.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Elegant Slogan Box */}
            <div className="shrink-0 lg:w-80 bg-slate-900/60 backdrop-blur-md border border-[#DCA92A]/20 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-2xl gap-5 relative group overflow-hidden">
              {/* Corner tech lines */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#DCA92A]/30"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#DCA92A]/30"></div>
              
              <p className="text-[10px] font-black tracking-widest text-[#DCA92A] font-display uppercase">Slogan Nổi Bật</p>
              
              <div className="flex flex-col gap-2 my-1">
                <span className="text-2xl sm:text-3xl font-black font-display tracking-widest text-[#DCA92A] uppercase">UY TÍN</span>
                <span className="text-2xl sm:text-3xl font-black font-display tracking-widest text-white uppercase">CHẤT LƯỢNG</span>
                <span className="text-2xl sm:text-3xl font-black font-display tracking-widest text-[#DCA92A] uppercase">NHANH CHÓNG</span>
              </div>
              
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#DCA92A]/40 to-transparent"></div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed italic">
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
              className="group flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-[#DCA92A]/50 hover:shadow-[0_0_35px_rgba(220,169,42,0.18)] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              {/* Image Frame with hover scaling zoom & security watermark effect */}
              <div className="relative h-60 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-50 transition-opacity"></div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#DCA92A]/10 z-20 pointer-events-none transition-all duration-300"></div>
                
                {/* Security lines overlay representing precision */}
                <div className="absolute inset-0 pointer-events-none z-10 opacity-15 overflow-hidden">
                  <div className="w-full h-1 bg-[#DCA92A] absolute animate-scanline pointer-events-none"></div>
                </div>

                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Service Badge Icon */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold text-brand-blue shadow-lg group-hover:bg-white group-hover:text-brand-blue transition-all duration-300">
                  {getIcon(service.iconName)}
                </div>

                {/* Secure Badge Tag */}
                <span className="absolute top-4 right-4 z-20 px-2.5 py-1 text-[9px] font-bold tracking-widest bg-slate-950/80 border border-brand-gold/30 text-brand-gold uppercase rounded backdrop-blur-sm">
                  SECURE AREA
                </span>
              </div>

              {/* Service Details info */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col gap-4 text-white">
                <span className="text-[10px] text-brand-gold font-bold tracking-widest uppercase font-display leading-none text-shadow-glow">
                  LĨNH VỰC 0{i + 1}
                </span>
                
                <h3 className="text-lg sm:text-xl font-bold text-white font-display tracking-tight uppercase group-hover:text-brand-gold transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-xs font-normal text-slate-300 leading-relaxed min-h-[40px]">
                  {service.shortDesc}
                </p>

                {/* Divider */}
                <div className="w-full h-px bg-slate-800/80 my-1"></div>

                {/* Bullets lists */}
                <ul className="space-y-3 text-xs text-slate-300 flex-1">
                  {service.bullets.slice(0, 4).map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="p-0.5 rounded-full bg-brand-gold/15 text-brand-gold shrink-0 mt-0.5 border border-brand-gold/30">
                        <Check className="w-3 h-3 text-brand-gold" />
                      </span>
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Sub-actions buttons */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedService(service);
                    }}
                    className="w-full sm:w-auto text-xs font-bold tracking-wider text-slate-300 hover:text-brand-gold transition-colors flex items-center justify-center gap-1.5 py-2 group-hover:scale-105 transform duration-300 cursor-pointer font-display"
                  >
                    Xem Chi Tiết <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectServiceForQuote(service.title);
                    }}
                    className="w-full sm:flex-1 py-2.5 px-4 text-xs font-black tracking-widest bg-brand-gold hover:bg-white text-slate-950 hover:text-brand-blue font-display rounded-lg transition-all duration-300 cursor-pointer uppercase shadow-md flex items-center justify-center gap-1.5"
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
                className="fixed inset-0 bg-slate-950/85 z-40 backdrop-blur-sm"
              />

              <motion.div
                initial={{ scale: 0.94, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                className="relative w-full max-w-3xl bg-slate-900 text-white border border-[#DCA92A]/30 rounded-2xl shadow-2xl overflow-hidden z-50 my-8"
              >
                {/* Top banner aspect with image */}
                <div className="relative h-48 sm:h-64 md:h-72 w-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10"></div>
                  <img
                    src={selectedService.image}
                    alt={selectedService.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating tags */}
                  <span className="absolute top-4 left-4 z-20 px-3 py-1 text-[10px] font-black tracking-widest bg-brand-gold text-slate-950 uppercase rounded font-display select-none">
                    TIÊU CHUẨN AN TOÀN NHÀ NƯỚC
                  </span>

                  {/* Close Button top-right */}
                  <button
                    onClick={() => setSelectedService(null)}
                    className="absolute top-4 right-4 z-30 w-10 h-10 bg-slate-950/70 hover:bg-brand-gold text-white hover:text-slate-950 rounded-full flex items-center justify-center transition-colors cursor-pointer text-2xl font-light"
                    aria-label="Đóng"
                  >
                    &times;
                  </button>

                  {/* Absolute titles on image */}
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight text-shadow-glow uppercase">
                      {selectedService.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-brand-gold font-sans tracking-tight mt-1.5 font-medium">
                      {selectedService.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 flex flex-col gap-6 max-h-[calc(100vh-280px)] overflow-y-auto font-sans">
                  <div>
                    <h4 className="text-[10px] font-black text-brand-gold tracking-widest uppercase font-display mb-2 border-b border-slate-800 pb-1.5 flex items-center gap-1.5 font-bold">
                      <Lock className="w-3.5 h-3.5 text-brand-gold" /> MÔ TẢ CHI TIẾT NGHIỆP VỤ
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                      {selectedService.longDesc}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-brand-gold tracking-widest uppercase font-display mb-3 border-b border-slate-800 pb-1.5 flex items-center gap-1.5 font-bold">
                      <Shield className="w-3.5 h-3.5 text-brand-gold" /> CÁC TIÊU CHUẨN KỸ THUẬT QUY CƠ
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-sans">
                      {selectedService.bullets.map((bullet, idx) => (
                        <div key={idx} className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800/60 flex items-start gap-3 hover:border-brand-gold/20 transition-all duration-300">
                          <span className="p-1 rounded-full bg-brand-gold/10 text-brand-gold shrink-0 mt-0.5 border border-brand-gold/20">
                            <Check className="w-3 text-brand-gold" />
                          </span>
                          <p className="text-xs text-slate-300 font-sans font-medium leading-relaxed">
                            {bullet}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end items-center gap-4 mt-2 pt-4 border-t border-slate-800/80">
                    <button
                      onClick={() => setSelectedService(null)}
                      className="px-5 py-2.5 text-xs text-slate-400 hover:text-white font-semibold uppercase rounded cursor-pointer transition-colors"
                    >
                      Đóng cửa sổ
                    </button>
                    <button
                      onClick={() => {
                        onSelectServiceForQuote(selectedService.title);
                        setSelectedService(null);
                      }}
                      className="px-6 py-2.5 text-xs font-black tracking-widest bg-brand-gold text-slate-950 hover:bg-white hover:text-brand-blue rounded-lg transition-all duration-300 cursor-pointer font-display uppercase shadow-md"
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
