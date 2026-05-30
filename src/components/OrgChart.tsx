import React from 'react';
import { motion } from 'motion/react';
import { 
  UserCheck, 
  Users, 
  Calculator, 
  Briefcase, 
  Layers, 
  Printer, 
  Sliders, 
  Package, 
  Cpu, 
  Building2,
  Boxes,
  Compass
} from 'lucide-react';

export default function OrgChart() {
  // Director Node
  const directorNode = {
    role: 'BAN GIÁM ĐỐC',
    name: 'GIÁM ĐỐC',
    icon: <UserCheck className="w-6 h-6 text-brand-gold" />,
    color: 'border-brand-gold/50 shadow-[0_0_25px_rgba(220,169,42,0.12)] bg-slate-900/90 hover:border-brand-gold hover:shadow-[0_0_30px_rgba(220,169,42,0.2)]'
  };

  // Deputy Director Node
  const deputyDirectorNode = {
    role: 'BAN GIÁM ĐỐC',
    name: 'PHÓ GIÁM ĐỐC',
    icon: <Users className="w-6 h-6 text-blue-400" />,
    color: 'border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)] bg-slate-900/90 hover:border-blue-450 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]'
  };

  // 2 Administration Departments (Placed Bottom Left)
  const administrationNodes = [
    {
      id: 'ketoan',
      tag: 'PHÒNG NGHIỆP VỤ',
      name: 'Phòng Kế toán - Nghiệp vụ kinh doanh',
      icon: <Calculator className="w-5 h-5 text-emerald-400" />,
      glowColor: 'hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:border-emerald-400/60'
    },
    {
      id: 'hanhchinh',
      tag: 'PHÒNG NGHIỆP VỤ',
      name: 'Phòng Hành chính - Tổ chức',
      icon: <Briefcase className="w-5 h-5 text-purple-400" />,
      glowColor: 'hover:shadow-[0_0_20px_rgba(192,132,252,0.15)] hover:border-purple-400/60'
    }
  ];

  // 4 Workshops (Placed Bottom Right)
  const workshopNodes = [
    {
      id: 'cheban',
      tag: 'PHÂN XƯỞNG SẢN XUẤT',
      name: 'Phân xưởng Chế bản',
      icon: <Layers className="w-5 h-5 text-amber-500" />,
      glowColor: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-amber-500/60'
    },
    {
      id: 'offset',
      tag: 'PHÂN XƯỞNG SẢN XUẤT',
      name: 'Phân xưởng In Offset',
      icon: <Printer className="w-5 h-5 text-sky-400" />,
      glowColor: 'hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] hover:border-sky-400/60'
    },
    {
      id: 'batnhap',
      tag: 'PHÂN XƯỞNG SẢN XUẤT',
      name: 'Phân xưởng Bắt nhấp cặp',
      icon: <Sliders className="w-5 h-5 text-pink-400" />,
      glowColor: 'hover:shadow-[0_0_20px_rgba(244,114,182,0.15)] hover:border-pink-400/60'
    },
    {
      id: 'thanhpham',
      tag: 'PHÂN XƯỞNG SẢN XUẤT',
      name: 'Phân xưởng Thành phẩm',
      icon: <Package className="w-5 h-5 text-indigo-400" />,
      glowColor: 'hover:shadow-[0_0_20px_rgba(129,140,248,0.15)] hover:border-indigo-400/60'
    }
  ];

  return (
    <section id="org-chart" className="w-full bg-slate-950 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      
      {/* Dynamic tech-grid background patterning */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/40 to-slate-950 pointer-events-none" />

      {/* Corporate high-end gold & deep blue ambient lighting highlights */}
      <span className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[130px] pointer-events-none" />
      <span className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <span className="absolute top-10 right-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* SECTION HEADER BLOCK */}
        <div className="text-center flex flex-col items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-brand-gold text-[10px] uppercase font-black font-display tracking-widest mb-4"
          >
            <Cpu className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
            <span>MÔ HÌNH VẬN HÀNH DOANH NGHIỆP NHÀ NƯỚC</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4.5xl lg:text-5xl font-black font-display text-white tracking-tight leading-none uppercase"
          >
            SƠ ĐỒ TỔ CHỨC
          </motion.h2>
          
          <div className="w-16 h-1 bg-gradient-to-r from-brand-gold via-yellow-500 to-amber-600 rounded-full mt-4" />
        </div>

        {/* ================= DESKTOP TREE VIEW (Visible on lg screens) ================= */}
        <div className="hidden lg:flex flex-col items-center w-full relative z-20 pb-4">
          
          {/* TIER 1: GIÁM ĐỐC */}
          <div className="flex flex-col items-center relative w-full mb-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`w-[320px] p-5 rounded-xl border text-center transition-all duration-300 relative overflow-hidden backdrop-blur-md ${directorNode.color} group`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 blur-xl pointer-events-none group-hover:bg-brand-gold/10 transition-all" />
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-brand-gold/10 rounded-xl border border-brand-gold/20 text-brand-gold shrink-0">
                  {directorNode.icon}
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-widest text-brand-gold/85 uppercase font-display block leading-none mb-1">
                    {directorNode.role}
                  </span>
                  <h3 className="text-xl font-black text-white font-display uppercase tracking-wide">
                    {directorNode.name}
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* Connection line: T1 to T2 */}
            <div className="h-10 w-[2px] bg-gradient-to-b from-brand-gold to-blue-400 relative">
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
            </div>
          </div>

          {/* TIER 2: PHÓ GIÁM ĐỐC */}
          <div className="flex flex-col items-center relative w-full mb-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`w-[320px] p-5 rounded-xl border text-center transition-all duration-300 relative overflow-hidden backdrop-blur-md ${deputyDirectorNode.color} group`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-xl pointer-events-none group-hover:bg-blue-500/10 transition-all" />
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-400/20 text-blue-400 shrink-0">
                  {deputyDirectorNode.icon}
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-widest text-blue-400 uppercase font-display block leading-none mb-1">
                    {deputyDirectorNode.role}
                  </span>
                  <h3 className="text-xl font-black text-white font-display uppercase tracking-wide">
                    {deputyDirectorNode.name}
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* Symmetrical Connector Lines System */}
            <div className="relative w-full h-12">
              {/* Center vertical node drop */}
              <div className="absolute top-0 bottom-1/2 left-1/2 w-[2px] bg-slate-800" />
              {/* Horizontal crossbar line linking the two main branches */}
              <div className="absolute top-1/2 left-[25%] right-[25%] h-[2px] bg-slate-800" />
              
              {/* Drop down line left (to Administration) */}
              <div className="absolute top-1/2 bottom-0 left-[25%] w-[2px] bg-slate-800" />
              {/* Drop down line right (to Workshops) */}
              <div className="absolute top-1/2 bottom-0 right-[25%] w-[2px] bg-slate-800" />
            </div>
          </div>

          {/* TIER 3: GRID SPLIT: SYMMETRICAL HEIGHT LAYOUT */}
          <div className="grid grid-cols-2 gap-12 w-full relative z-10 px-6">
            
            {/* LEFT SECTOR: 2 CO-EQUAL PHÒNG BAN MANAGEMENT (STRETCHY OR ALIGNED STACK) */}
            <div className="flex flex-col items-center h-full">
              {/* Category indicator label */}
              <div className="flex items-center gap-2 mb-6 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full shrink-0">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase font-display tracking-widest">CƠ CẤU PHÒNG BAN QUẢN LÝ (02)</span>
              </div>

              {/* Symmetrical vertical stack in 2 rows, matching the height of the right-side grid */}
              <div className="grid grid-cols-1 gap-4 w-full max-w-md h-full">
                {administrationNodes.map((node, i) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    className={`flex items-center gap-4 p-5 rounded-xl border bg-slate-900/60 transition-all duration-300 group overflow-hidden ${node.glowColor}`}
                  >
                    <div className="p-3.5 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 shrink-0">
                      {node.icon}
                    </div>
                    <div className="text-left min-w-0">
                      <span className="text-[8px] font-extrabold text-emerald-400/80 tracking-wider block font-display uppercase leading-none mb-1.5">
                        {node.tag}
                      </span>
                      <h4 className="text-sm font-extrabold text-white group-hover:text-emerald-350 transition-colors duration-300 leading-snug">
                        {node.name}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT SECTOR: 4 PHÂN XƯỞNG PRODUCTION GRID IN 2x2 */}
            <div className="flex flex-col items-center h-full">
              {/* Category indicator label */}
              <div className="flex items-center gap-2 mb-6 bg-brand-gold/10 border border-brand-gold/15 px-3.5 py-1.5 rounded-full shrink-0">
                <Boxes className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-[10px] font-bold text-brand-gold uppercase font-display tracking-widest">CƠ CẤU PHÂN XƯỞNG SẢN XUẤT (04)</span>
              </div>

              {/* Responsive 2x2 grid representing production flow */}
              <div className="grid grid-cols-2 gap-4 w-full h-full">
                {workshopNodes.map((node, i) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
                    className={`flex items-center gap-3.5 p-5 rounded-xl border bg-slate-900/60 transition-all duration-300 group overflow-hidden ${node.glowColor}`}
                  >
                    <div className="p-3.5 bg-brand-gold/10 rounded-lg text-brand-gold group-hover:bg-brand-gold group-hover:text-slate-950 transition-all duration-300 shrink-0">
                      {node.icon}
                    </div>
                    <div className="text-left min-w-0">
                      <span className="text-[8px] font-extrabold text-brand-gold/80 tracking-wider block font-display uppercase leading-none mb-1.5">
                        {node.tag}
                      </span>
                      <h4 className="text-sm font-extrabold text-white group-hover:text-brand-gold transition-colors duration-300 leading-snug">
                        {node.name}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ================= MOBILE VIEW (Adaptive flow, clean spacing) ================= */}
        <div className="lg:hidden flex flex-col gap-6 relative z-15 px-2">
          
          {/* Subtle side tracker alignment line */}
          <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-brand-gold via-blue-500 to-transparent opacity-30" />

          {/* 1. GIÁM ĐỐC */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-4 relative"
          >
            <div className="w-11 h-11 rounded-full bg-slate-900 border-2 border-brand-gold flex items-center justify-center text-brand-gold z-20 shrink-0 shadow-lg shadow-brand-gold/10">
              <UserCheck className="w-5 h-5" />
            </div>
            
            <div className="flex-1 p-4 rounded-xl bg-slate-900/90 border border-brand-gold/20 text-left">
              <span className="text-[8px] font-black tracking-widest text-brand-gold uppercase font-display">BAN GIÁM ĐỐC</span>
              <h3 className="text-base font-black text-white font-display mt-0.5">GIÁM ĐỐC</h3>
            </div>
          </motion.div>

          {/* 2. PHÓ GIÁM ĐỐC */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-4 relative"
          >
            <div className="w-11 h-11 rounded-full bg-slate-900 border-2 border-blue-500/60 flex items-center justify-center text-blue-450 z-20 shrink-0 shadow-lg shadow-blue-500/10">
              <Users className="w-5 h-5" />
            </div>
            
            <div className="flex-1 p-4 rounded-xl bg-slate-900/90 border border-blue-500/15 text-left">
              <span className="text-[8px] font-black tracking-widest text-blue-450 uppercase font-display">BAN GIÁM ĐỐC</span>
              <h3 className="text-base font-black text-white font-display mt-0.5">PHÓ GIÁM ĐỐC</h3>
            </div>
          </motion.div>

          {/* Section Divider on Mobile */}
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-4 pl-14 text-left">CẤC PHÒNG NGHIỆP VỤ (02)</p>

          {/* 3. Room Stack */}
          {administrationNodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-4 relative"
            >
              <div className="w-11 h-11 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-emerald-400 z-20 shrink-0 shadow-md">
                {node.icon}
              </div>

              <div className="flex-1 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
                <span className="text-[8px] font-extrabold text-emerald-400/85 uppercase block tracking-widest font-display leading-none mb-1">
                  {node.tag}
                </span>
                <h3 className="text-sm font-extrabold text-white leading-snug">{node.name}</h3>
              </div>
            </motion.div>
          ))}

          {/* Workshops Section Divider on Mobile */}
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-4 pl-14 text-left">PHÂN XƯỞNG SẢN XUẤT (04)</p>

          {/* 4. workshops Stack */}
          {workshopNodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-4 relative"
            >
              <div className="w-11 h-11 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-brand-gold z-20 shrink-0 shadow-md">
                {node.icon}
              </div>

              <div className="flex-1 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
                <span className="text-[8px] font-extrabold text-brand-gold/85 uppercase block tracking-widest font-display leading-none mb-1">
                  {node.tag}
                </span>
                <h3 className="text-sm font-extrabold text-white leading-snug">{node.name}</h3>
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
