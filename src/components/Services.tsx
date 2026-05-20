import { useState } from 'react';
import { motion } from 'motion/react';
import { Ticket, FileSpreadsheet, ShieldAlert, Cpu, CheckSquare, ArrowRight, ShieldCheck, Check } from 'lucide-react';
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
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6" />;
      case 'CheckSquare':
        return <CheckSquare className="w-6 h-6" />;
      default:
        return <ShieldCheck className="w-6 h-6" />;
    }
  };

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center flex flex-col items-center gap-2 mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-gold uppercase font-display">
            SẢN PHẨM & DỊCH VỤ CHỦ LỰC
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-brand-blue tracking-tight leading-tight uppercase max-w-2xl">
            LĨNH VỰC IN ẤN TÀI CHÍNH & BẢO MẬT CHIÊN SÂU
          </h2>
          <div className="w-20 h-1 bg-brand-gold rounded-full mt-2"></div>
          <p className="text-slate-500 font-sans text-xs sm:text-sm max-w-xl mt-2">
            Mọi quy trình đều trực thuộc quy chuẩn tuyệt mật nghiêm ngặt khép kín, được phê duyệt và giám định trực tiếp từ Hội đồng quản trị Tổng công ty.
          </p>
        </div>

        {/* 5-Column Grid with special layout features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICE_ITEMS.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group flex flex-col bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:bg-white hover:border-brand-blue/30 hover:shadow-2xl transition-all duration-300 transform"
            >
              {/* Image Frame with hover scaling zoom */}
              <div className="relative h-56 overflow-hidden bg-slate-200">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Service Badge Icon */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center justify-center w-12 h-12 rounded-xl bg-brand-blue text-brand-gold shadow-lg group-hover:bg-brand-gold group-hover:text-brand-blue transition-all">
                  {getIcon(service.iconName)}
                </div>
              </div>

              {/* Service Details info */}
              <div className="p-6 flex-1 flex flex-col gap-4">
                <p className="text-[10px] text-brand-gold font-bold tracking-widest uppercase font-display leading-none">
                  LĨNH VỰC 0{i + 1}
                </p>
                <h3 className="text-sm font-black text-brand-blue font-display tracking-wider uppercase group-hover:text-brand-gold-dark transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed line-clamp-2">
                  {service.shortDesc}
                </p>

                {/* Bullets lists */}
                <ul className="space-y-2 text-xs text-slate-500">
                  {service.bullets.slice(0, 3).map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="p-0.5 rounded-full bg-slate-200 text-brand-blue shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-brand-blue" />
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <hr className="border-slate-200 my-1 group-hover:border-slate-300" />

                {/* Sub-actions buttons */}
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="text-xs font-bold tracking-wider text-brand-blue group-hover:text-brand-gold-dark transition-colors flex items-center gap-1.5 cursor-pointer font-display"
                  >
                    Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSelectServiceForQuote(service.title)}
                    className="px-3 py-1.5 text-[10px] sm:text-xs font-black tracking-widest bg-brand-blue hover:bg-brand-gold text-white hover:text-brand-blue font-display rounded transition-all cursor-pointer uppercase border border-transparent"
                  >
                    Tư vấn in
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Service Detail Modal Container */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Top banner aspect with image */}
              <div className="relative h-64 sm:h-72 w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark via-brand-blue-dark/50 to-transparent z-10"></div>
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating tags */}
                <span className="absolute top-4 left-4 z-20 px-3 py-1 text-[10px] font-black tracking-widest bg-brand-gold text-brand-blue uppercase rounded font-display">
                  TIÊU CHUẨN AN TOÀN NHÀ NƯỚC
                </span>

                {/* Close Button top-right */}
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/45 hover:bg-brand-gold text-white hover:text-brand-blue rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Đóng"
                >
                  <span className="text-xl font-bold">&times;</span>
                </button>

                {/* Absolute titles on image */}
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight text-shadow-lg uppercase">
                    {selectedService.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-300 font-sans tracking-tight mt-1">
                    {selectedService.shortDesc}
                  </p>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 sm:p-8 flex flex-col gap-6">
                <div>
                  <h4 className="text-xs font-black text-brand-blue font-display tracking-widest uppercase mb-1.5">
                    MÔ TẢ CHI TIẾT NGHIỆP VỤ
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {selectedService.longDesc}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-black text-brand-blue font-display tracking-widest uppercase mb-2">
                    CÁC THƯƠNG PHƯƠNG QUY CHUẨN KỸ THUẬT
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {selectedService.bullets.map((bullet, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-3">
                        <span className="p-1 rounded-full bg-emerald-100 text-emerald-600 shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-emerald-600" />
                        </span>
                        <p className="text-xs text-slate-600 font-sans font-medium">
                          {bullet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3.5 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="px-5 py-2.5 text-xs text-slate-600 hover:text-brand-blue font-semibold uppercase rounded cursor-pointer"
                  >
                    Đóng cửa sổ
                  </button>
                  <button
                    onClick={() => {
                      onSelectServiceForQuote(selectedService.title);
                      setSelectedService(null);
                    }}
                    className="px-6 py-2.5 text-xs font-extrabold tracking-widest bg-brand-gold text-brand-blue hover:bg-yellow-400 rounded transition-all cursor-pointer font-display uppercase shadow-md"
                  >
                    Đăng Ký Tư Vấn Ngay
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </section>
  );
}
