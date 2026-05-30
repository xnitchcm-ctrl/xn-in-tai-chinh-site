import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Award, Milestone, Settings, ShieldCheck, ChevronRight, Zap } from 'lucide-react';
import { TECHNOLOGIES } from '../data/companyData';

export default function Technology() {
  const [selectedTechId, setSelectedTechId] = useState(TECHNOLOGIES[0].id);

  const activeTech = TECHNOLOGIES.find(t => t.id === selectedTechId) || TECHNOLOGIES[0];

  const getMachineMetric = (id: string) => {
    switch (id) {
      case 'komori-offset':
        return { value: '16K', unit: 'Tờ/giờ', label: 'Tốc độ cực đại' };
      case 'mitsubishi':
        return { value: '15K', unit: 'Tờ/giờ', label: 'Tốc độ sản xuất' };
      case 'digital-inkjet-control':
        return { value: '300', unit: 'Mét/phút', label: 'Tốc độ phun liên tục' };
      case 'polar-cutting':
        return { value: '0.01', unit: 'Mili-mét', label: 'Dung sai tối đa' };
      default:
        return { value: '100%', label: 'Tự động hóa' };
    }
  };

  const metric = getMachineMetric(activeTech.id);

  return (
    <section id="technology" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative">
      {/* Structural background decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(10,50,115,0.35),transparent)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold tracking-widest text-brand-gold uppercase font-display">
              NĂNG LỰC CÔNG NGHỆ CHỐNG GIẢ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight leading-tight uppercase">
              THIẾT BỊ TÂN TIẾN – BẢO AN THƯỢNG HẠNG
            </h2>
            <div className="w-20 h-1 bg-brand-gold rounded-full mt-2"></div>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Hạ tầng kỹ thuật được nhập khẩu đồng bộ từ các nhà sản xuất thiết bị in ấn danh tiếng tại Đức, Mỹ, và Nhật Bản, giám sát chất thông qua nền tảng kỹ thuật số hoàn chỉnh.
          </p>
        </div>

        {/* Machinery Spec Viewer Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          
          {/* Machine selector column (Left 4 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <span className="text-[10px] text-brand-gold font-bold tracking-widest uppercase font-display mb-1 inline-block">
              DANH MỤC THIẾT BỊ CHỦ LỰC
            </span>
            <div className="space-y-3">
              {TECHNOLOGIES.map((tech) => {
                const isActive = tech.id === selectedTechId;
                return (
                  <motion.button
                    key={tech.id}
                    onClick={() => setSelectedTechId(tech.id)}
                    whileHover={{ x: 4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 border flex items-center justify-between gap-4 cursor-pointer relative overflow-hidden ${
                      isActive 
                        ? 'bg-gradient-to-r from-brand-blue to-blue-900 border-brand-gold shadow-lg text-white' 
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isActive ? 'bg-amber-400 text-brand-blue' : 'bg-white/10 text-white'}`}>
                        {tech.category === 'printing' ? <Cpu className="w-4 h-4" /> : tech.category === 'security' ? <ShieldCheck className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold font-display leading-tight">
                          {tech.title.replace('Hệ Thống ', '').replace('Máy In ', '')}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-1">Xuất xứ: {tech.origin}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-brand-gold rotate-90' : 'text-slate-500'}`} />
                  </motion.button>
                );
              })}
            </div>

            {/* General technology highlight card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-5 mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-brand-gold flex items-start gap-3"
            >
              <Zap className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-[11px] font-bold uppercase font-display">TÍCH HỢP PHẦN MỀM CHỐNG GIẢ</p>
                <p className="text-[10px] text-slate-300 font-sans leading-relaxed mt-1">
                  Mã nguồn sê-ri vé số được phát sinh tự động bằng giải pháp mã hóa ba lớp, lưu trên máy chủ độc lập tách biệt với hệ thống mạng công ty để tránh các cuộc tấn công rò rỉ.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Machine details console (Right 7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/50 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col shadow-2xl relative overflow-hidden backdrop-blur-md min-h-[460px]">
            {/* Top glass highlights decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 blur-xl rounded-full"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTech.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex flex-col justify-between h-full flex-1"
              >
                <div className="flex flex-col gap-6">
                  {/* Header metrics */}
                  <div className="flex justify-between items-start flex-wrap gap-4 border-b border-white/10 pb-6">
                    <div>
                      <span className="px-2.5 py-1 text-[9px] font-black font-display tracking-widest bg-brand-gold text-brand-blue rounded uppercase mb-2 inline-block">
                        CƠ KHÍ {activeTech.origin.toUpperCase()} CHUẨN XÁC
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-white font-display tracking-tight leading-snug">
                        {activeTech.title}
                      </h3>
                    </div>

                    {/* Performance Speed dials */}
                    <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                      <div className="text-right">
                        <p className="text-xl sm:text-2xl font-black text-brand-gold font-mono leading-none">
                          {metric.value}
                        </p>
                        {metric.unit && <p className="text-[9px] text-slate-400 font-sans mt-0.5">{metric.unit}</p>}
                      </div>
                      <div className="h-6 w-[1px] bg-white/15"></div>
                      <p className="text-[9px] text-slate-300 uppercase leading-none font-bold tracking-wider max-w-[80px]">
                        {metric.label}
                      </p>
                    </div>
                  </div>

                  {/* Description summary */}
                  <div>
                    <h4 className="text-[10px] font-black text-brand-gold tracking-widest uppercase font-display mb-2">
                      GIỚI THIỆU CHỨNG NĂNG
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      {activeTech.description}
                    </p>
                  </div>

                  {/* Key specification parameters list */}
                  <div>
                    <h4 className="text-[10px] font-black text-brand-gold tracking-widest uppercase font-display mb-3">
                      THÔNG SỐ KỸ THUẬT CHI TIẾT
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeTech.specs.map((spec, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300 leading-relaxed font-sans hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-1.5 h-1.5 bg-brand-gold rounded-full shrink-0"></span>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Thông Số T0{i + 1}</p>
                          </div>
                          <p className="pl-3.5 text-xs text-stone-200 mt-1 font-medium">{spec}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quality Commitment seal in footer area */}
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-4">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Kiểm định chất lượng 100% trước khi bàn giao
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    XNITC_TECH_CAT: {activeTech.category.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
