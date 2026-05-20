import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, 
  Users, 
  Calculator, 
  Briefcase, 
  Layers, 
  Printer, 
  Sliders, 
  Package, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Clock, 
  HelpCircle,
  Building,
  Target,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';

interface DepartmentNode {
  id: string;
  role: string;
  name: string;
  leaderTitle: string;
  icon: React.ReactNode;
  benefits?: string[];
  tasks: string[];
  color: string;
}

export default function OrgChart() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Exquisite corporate nodes data structure
  const directorNode: DepartmentNode = {
    id: 'giamdoc',
    role: 'GIÁM ĐỐC BAN ĐIỀU HÀNH',
    name: 'Đại Diện Pháp Luật & Tổng Chỉ Huy',
    leaderTitle: 'Phụ trách toàn diện chiến lược, kinh doanh và bảo mật hệ thống nhà nước.',
    icon: <UserCheck className="w-6 h-6 text-brand-gold" />,
    tasks: [
      'Chỉ đạo hoạch định chiến lược kinh doanh trung và dài hạn.',
      'Chịu trách nhiệm tối cao về an ninh in ấn & tiêu chuẩn bảo mật nhà nước.',
      'Phê duyệt các dự án đầu tư máy móc công nghệ Đức & Nhật.',
      'Quản trị dòng tài chính phát triển của doanh nghiệp.'
    ],
    color: 'border-brand-gold shadow-[0_0_20px_rgba(220,169,42,0.25)]'
  };

  const deputyDirectorNode: DepartmentNode = {
    id: 'phogiamdoc',
    role: 'PHÓ GIÁM ĐỐC KỸ THUẬT & SẢN XUẤT',
    name: 'Quản Trị Vận Hành & Khép Kín Hệ Thống',
    leaderTitle: 'Trực tiếp giám sát chất lượng KCS, tiến độ Offset và phối hợp các phân xưởng.',
    icon: <Users className="w-6 h-6 text-[#60a5fa]" />,
    tasks: [
      'Điều phối trực tiếp hoạt động 4 xưởng sản xuất chủ lực.',
      'Kiểm soát quy trình kiểm định chất lượng sản phẩm KCS 3 khối.',
      'Phát triển nguồn lực nhân sự, định mức kỹ thuật chuyên sâu.',
      'Giám sát an toàn thông tin sê-ri chống trùng lắp bí mật quốc gia.'
    ],
    color: 'border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.15)]'
  };

  // Administration, account support branches of general org
  const administrationNodes: DepartmentNode[] = [
    {
      id: 'ketoan',
      role: 'PHÒNG KẾ TOÁN - NGHIỆP VỤ',
      name: 'Phòng Kế Toán - Nghiệp Vụ Kinh Doanh',
      leaderTitle: 'Kế toán trưởng & Đội ngũ chuyên viên báo giá',
      icon: <Calculator className="w-5 h-5 text-emerald-400" />,
      tasks: [
        'Lập dự toán chi phí, lập bảng chào giá in chính xác.',
        'Quản lý hợp đồng bảo mật, sê-ri vé số phát hành toàn quốc.',
        'Kết toán tài chính minh bạch cho các công ty Xổ số Kiến thiết.'
      ],
      color: 'border-emerald-500/50 hover:border-emerald-400'
    },
    {
      id: 'hanhchinh',
      role: 'PHÒNG HÀNH CHÍNH - TỔ CHỨC',
      name: 'Phòng Hành Chính - Tổ Chức Nhân Sự',
      leaderTitle: 'Trưởng phòng Nhân sự & Quản trị văn phòng',
      icon: <Briefcase className="w-5 h-5 text-purple-400" />,
      tasks: [
        'Tuyển dụng & đào tạo thợ in có tay nghề chuyên sâu.',
        'Tổ chức kiểm đới an ninh nhà xưởng thực tế hành chính.',
        'Đảm bảo quy chuẩn bảo hộ lao động và chính sách phúc lợi.'
      ],
      color: 'border-purple-500/50 hover:border-purple-400'
    }
  ];

  // Heavy duty machinery printing branches
  const workshopNodes: DepartmentNode[] = [
    {
      id: 'cheban',
      role: 'PHÂN XƯỞNG CHẾ BẢN',
      name: 'Quy Trình Chế Bản Thượng Hạng',
      leaderTitle: 'Đội trưởng kỹ thuật & Chuyên viên CTP',
      icon: <Layers className="w-5 h-5 text-amber-500" />,
      tasks: [
        'Tiếp nhận file thiết kế gốc & ra kẽm CTP bảo mật cao.',
        'Thiết lập thông số sê-ri mã hóa số nhảy tự động.',
        'Cung cấp bản mẫu kỹ thuật duyệt khối chuẩn KCS trước khi in offset.'
      ],
      color: 'border-amber-400/50 hover:border-amber-300'
    },
    {
      id: 'offset',
      role: 'PHÂN XƯỞNG OFFSET',
      name: 'Dây Chuyền In Offset Tốc Độ Cao',
      leaderTitle: 'Đội trưởng vận hành dòng máy Heidelberg Đức',
      icon: <Printer className="w-5 h-5 text-sky-400" />,
      tasks: [
        'In offset chính xác chồng màu lót và lưới phản quang.',
        'Điện toán hóa mực thông minh chống mờ nhòe chống nước.',
        'Giám sát vận hành máy 24/7 đạt hiệu suất hàng vạn tờ/giờ.'
      ],
      color: 'border-sky-400/50 hover:border-sky-300'
    },
    {
      id: 'batnhap',
      role: 'PHÂN XƯỞNG BẮT NHÁP CẶP',
      name: 'Kiểm Đếm & Bắt Nháp Cặp Số Nhảy',
      leaderTitle: 'Tổ cơ cấu so khớp logic sê-ri điện tử',
      icon: <Sliders className="w-5 h-5 text-pink-400" />,
      tasks: [
        'Ghép cặp, bắt nháp xếp chồng đúng thứ tự sê-ri kín.',
        'Loại bỏ lập tức các trang in hỏng, lệch mực hoặc sọc nhạt.',
        'Đảm bảo không xảy ra trùng lắp số nhảy hoặc mất sê-ri.'
      ],
      color: 'border-pink-400/50 hover:border-pink-300'
    },
    {
      id: 'thanhpham',
      role: 'PHÂN XƯỞNG THÀNH PHẨM',
      name: 'Đóng Gói Thành Phẩm & Khóa Niêm',
      leaderTitle: 'Tổ đóng gói bao bì & Kỹ thuật cắt xén Đức Polar',
      icon: <Package className="w-5 h-5 text-indigo-400" />,
      tasks: [
        'Xén góc phẳng tuyệt đối bằng dao lập trình Polar hiện đại.',
        'Điện tử hóa niêm ròng, đóng bó và co màng nhiệt bảo ôn.',
        'Vận chuyển xe chuyên dụng an toàn tuyệt mật về kho bàn giao.'
      ],
      color: 'border-indigo-400/50 hover:border-indigo-300'
    }
  ];

  return (
    <section id="org-chart" className="w-full bg-slate-950 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* High-end decorative overlays (corporate gradient) */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-900/10 via-slate-950/10 to-transparent pointer-events-none" />
      <span className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Decorative Gold & Blue Neon blur clouds, representing tech corporate vibe */}
      <span className="absolute top-10 right-10 w-[450px] h-[450px] bg-brand-blue/15 rounded-full blur-[140px] pointer-events-none" />
      <span className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER BLOCK */}
        <div className="text-center flex flex-col items-center mb-16 relative z-15">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-brand-gold text-[10px] uppercase font-black font-display tracking-widest mb-4"
          >
            <Cpu className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
            <span>Kết Kấu Quản Trị Hệ Thống Doanh Nghiệp Nhà Nước</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4.5xl lg:text-5xl font-black font-display text-white tracking-tight leading-none uppercase"
          >
            SƠ ĐỒ TỔ CHỨC
          </motion.h2>
          
          <div className="w-16 h-1.5 bg-gradient-to-r from-brand-gold to-yellow-500 rounded-full mt-4 mb-4" />
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-450 font-sans text-xs sm:text-sm max-w-2xl text-center leading-relaxed text-slate-400"
          >
            Quy chuẩn quản lý nhân sự đa tầng, khép kín từ Ban giám đốc tài ba đến các bộ phận phân xưởng. 
            Đảm bảo tính chịu trách nhiệm tuyệt đối, tăng cường KCS chuẩn mực quốc tế và bảo vệ an ninh thông tin.
          </motion.p>
        </div>

        {/* CLICK NOTIFICATION PROMPT ACCORD */}
        <div className="text-center mb-4 block lg:hidden">
          <span className="text-[10px] text-brand-gold/80 italic font-medium">👉 Nhấp vào từng phòng ban để xem chi tiết nghiệp vụ sản xuất</span>
        </div>

        {/* ================= DESKTOP TREE VIEW (Visible on lg screening) ================= */}
        <div className="hidden lg:flex flex-col items-center relative z-20 pb-16">
          
          {/* TIER 1: GIÁM ĐỐC */}
          <div className="flex flex-col items-center relative w-full mb-8">
            <motion.div
              whileHover={{ 
                scale: 1.03, 
                boxShadow: '0 0 35px rgba(220, 169, 42, 0.35)' 
              }}
              onHoverStart={() => setHoveredNode(directorNode.id)}
              onHoverEnd={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(selectedNode === directorNode.id ? null : directorNode.id)}
              className={`w-[450px] p-6 rounded-2xl bg-slate-900/80 border text-left cursor-pointer transition-all duration-300 relative overflow-hidden backdrop-blur-md ${directorNode.color} group`}
            >
              {/* Gold light corner sweep */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-2xl pointer-events-none group-hover:bg-brand-gold/15 transition-all" />
              
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-brand-gold/15 rounded-xl border border-brand-gold/30 shrink-0 text-brand-gold shadow-[0_0_15px_rgba(220,169,42,0.1)] group-hover:scale-105 transition-transform">
                  {directorNode.icon}
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-black tracking-widest text-brand-gold uppercase font-display leading-none">
                    {directorNode.role}
                  </span>
                  <h3 className="text-base font-black text-white font-display mt-1.5 uppercase tracking-wide">
                    {directorNode.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans font-light">
                    {directorNode.leaderTitle}
                  </p>
                  
                  {/* Expand tasks indicator */}
                  <div className="mt-3 flex items-center gap-1 text-[10px] text-brand-gold font-bold">
                    <span>{selectedNode === directorNode.id ? 'Thu gọn thông tin' : 'Xem nhiệm vụ cốt lõi'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${selectedNode === directorNode.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Collapsible Duty List block */}
              <AnimatePresence>
                {selectedNode === directorNode.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-white/10"
                  >
                    <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mb-2">NHIỆM VỤ ĐẮC LỰC:</p>
                    <ul className="space-y-2">
                      {directorNode.tasks.map((task, i) => (
                        <li key={i} className="flex gap-2 text-xs text-slate-300 leading-relaxed font-light">
                          <span className="text-brand-gold font-bold select-none">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Direct Line connecting Tier 1 to Tier 2 */}
            <div className="h-10 w-[2px] bg-gradient-to-b from-brand-gold to-blue-400 relative">
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            </div>
          </div>

          {/* TIER 2: PHÓ GIÁM ĐỐC */}
          <div className="flex flex-col items-center relative w-full mb-12">
            <motion.div
              whileHover={{ 
                scale: 1.03, 
                boxShadow: '0 0 30px rgba(96, 165, 250, 0.3)' 
              }}
              onHoverStart={() => setHoveredNode(deputyDirectorNode.id)}
              onHoverEnd={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(selectedNode === deputyDirectorNode.id ? null : deputyDirectorNode.id)}
              className={`w-[450px] p-6 rounded-2xl bg-slate-900/80 border text-left cursor-pointer transition-all duration-300 relative overflow-hidden backdrop-blur-md ${deputyDirectorNode.color} group`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl pointer-events-none group-hover:bg-blue-500/15 transition-all" />

              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-blue-500/15 rounded-xl border border-blue-400/30 shrink-0 text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.1)] group-hover:scale-105 transition-transform">
                  {deputyDirectorNode.icon}
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-black tracking-widest text-[#60a5fa] uppercase font-display leading-none">
                    {deputyDirectorNode.role}
                  </span>
                  <h3 className="text-base font-black text-white font-display mt-1.5 uppercase tracking-wide">
                    {deputyDirectorNode.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans font-light">
                    {deputyDirectorNode.leaderTitle}
                  </p>

                  {/* Expand tasks indicator */}
                  <div className="mt-3 flex items-center gap-1 text-[10px] text-[#60a5fa] font-bold">
                    <span>{selectedNode === deputyDirectorNode.id ? 'Thu gọn thông tin' : 'Xem nhiệm vụ cốt lõi'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${selectedNode === deputyDirectorNode.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Collapsible Deputy Duty List block */}
              <AnimatePresence>
                {selectedNode === deputyDirectorNode.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-white/10"
                  >
                    <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mb-2">QUẢN TRỊ NGHIỆP VỤ PHÒNG BAN & PHÂN XƯỞNG:</p>
                    <ul className="space-y-2">
                      {deputyDirectorNode.tasks.map((task, i) => (
                        <li key={i} className="flex gap-2 text-xs text-slate-300 leading-relaxed font-light">
                          <span className="text-[#60a5fa] font-bold select-none">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Complex SVG Connector tree lines drawing */}
            <div className="relative w-full h-16">
              {/* Solid horizontal line connecting the bounds */}
              <div className="absolute top-1/2 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-emerald-500/40 via-blue-400 to-[#dca92a]/40" />
              
              {/* Vertical line descending from Deputy Director node center */}
              <div className="absolute top-0 bottom-1/2 left-1/2 w-[2px] bg-blue-400" />

              {/* Verticals dropping under the horizontal bridge to the columns */}
              {/* Dropping to Administration columns center */}
              <div className="absolute top-1/2 bottom-full left-[25%] w-[2px]" />
              <div className="absolute top-1/2 bottom-0 left-[25%] w-[2px] bg-emerald-500/60" />

              {/* Dropping to production workspace columns center */}
              <div className="absolute top-1/2 bottom-0 left-[75%] w-[2px] bg-brand-gold/60" />
            </div>
          </div>

          {/* TIER 3: TWO MAJOR GENERAL BLOCKS FOR ADMIN & WORKSPACE */}
          <div className="grid grid-cols-2 gap-12 w-full relative z-10 px-8">
            
            {/* LEFT COUPLING: PHÒNG BAN QUẢN LÝ (EMERALD VIBE) */}
            <div className="flex flex-col items-center gap-6 border-r border-white/5 pr-6">
              <div className="flex items-center gap-2 mb-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase font-display tracking-wider">CƠ CẤU NGHIỆP VỤ BÀN GIẤY</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {administrationNodes.map((node) => {
                  const isNodeSelected = selectedNode === node.id;
                  return (
                    <motion.div
                      key={node.id}
                      whileHover={{ scale: 1.025, boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)' }}
                      onClick={() => setSelectedNode(isNodeSelected ? null : node.id)}
                      className={`p-5 rounded-2xl bg-slate-900/75 border border-slate-850 cursor-pointer text-left transition-all duration-300 relative group overflow-hidden ${node.color}`}
                    >
                      {/* Hover effect flash */}
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                          {node.icon}
                        </div>
                        <div>
                          <span className="text-[9px] font-extrabold text-emerald-400 tracking-wider block font-display">{node.role}</span>
                          <h4 className="text-xs font-black text-white uppercase tracking-normal mt-0.5">{node.name}</h4>
                        </div>
                      </div>
                      
                      <p className="text-[11px] text-slate-400 mt-2 font-light leading-relaxed truncate-2-lines line-clamp-2">
                        {node.leaderTitle}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-[9px] font-bold text-slate-400">
                        <span className="group-hover:text-emerald-400">Chi tiết nhiệm vụ</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isNodeSelected ? 'rotate-180 text-emerald-400' : ''}`} />
                      </div>

                      {/* Expand detail */}
                      <AnimatePresence>
                        {isNodeSelected && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3.5 pt-3 border-t border-white/5 space-y-1.5 overflow-hidden"
                          >
                            {node.tasks.map((t, idx) => (
                              <div key={idx} className="text-[11px] text-slate-350 leading-relaxed font-light flex items-start gap-1.5">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{t}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COUPLING: CÁC PHÂN XƯỞNG CHẾ BẢN - SẢN XUẤT (GOLD VIBE) */}
            <div className="flex flex-col items-center gap-6 pl-6">
              <div className="flex items-center gap-2 mb-2 bg-brand-gold/10 border border-brand-gold/20 px-3 py-1.5 rounded-full">
                <Target className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-[10px] font-black text-brand-gold uppercase font-display tracking-wider">CƠ CẤU PHÂN XƯỞNG THỰC ĐỊA NGŨ TUYẾN</span>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                {workshopNodes.map((node) => {
                  const isNodeSelected = selectedNode === node.id;
                  return (
                    <motion.div
                      key={node.id}
                      whileHover={{ scale: 1.025, boxShadow: '0 4px 20px rgba(220, 169, 42, 0.15)' }}
                      onClick={() => setSelectedNode(isNodeSelected ? null : node.id)}
                      className={`p-5 rounded-2xl bg-slate-900/75 border border-slate-850 cursor-pointer text-left transition-all duration-300 relative group overflow-hidden ${node.color}`}
                    >
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-brand-gold/10 rounded-xl text-brand-gold group-hover:bg-brand-gold group-hover:text-slate-950 transition-colors">
                          {node.icon}
                        </div>
                        <div>
                          <span className="text-[9px] font-extrabold text-brand-gold tracking-wider block font-display leading-tight">{node.role}</span>
                          <h4 className="text-xs font-black text-white uppercase tracking-normal mt-0.5">{node.name}</h4>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-2 font-light leading-relaxed truncate-2-lines line-clamp-2">
                        {node.leaderTitle}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-[9px] font-bold text-slate-400">
                        <span className="group-hover:text-brand-gold">Chi tiết nhiệm vụ</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isNodeSelected ? 'rotate-180 text-brand-gold' : ''}`} />
                      </div>

                      {/* Expand detail */}
                      <AnimatePresence>
                        {isNodeSelected && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3.5 pt-3 border-t border-white/5 space-y-1.5 overflow-hidden"
                          >
                            {node.tasks.map((t, idx) => (
                              <div key={idx} className="text-[11px] text-slate-350 leading-relaxed font-light flex items-start gap-1.5">
                                <span className="text-brand-gold font-bold">•</span>
                                <span>{t}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ================= MOBILE TIMELINE VIEW (Visible under lg screening) ================= */}
        <div className="lg:hidden flex flex-col gap-6 relative z-15 px-2">
          
          {/* Vertical central tracking line */}
          <div className="absolute left-[30px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-brand-gold via-blue-400 to-emerald-500/20" />

          {/* 1. Director Mob */}
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={() => setSelectedNode(selectedNode === 'mob-giamdoc' ? null : 'mob-giamdoc')}
            className="flex gap-4 relative"
          >
            {/* Timeline icon node badge */}
            <div className="w-12 h-12 rounded-full bg-brand-gold border-2 border-slate-900 flex items-center justify-center text-slate-950 z-20 shrink-0 shadow-lg shadow-brand-gold/10">
              <UserCheck className="w-5 h-5" />
            </div>
            
            <div className={`flex-1 p-5 rounded-2xl bg-slate-900 border ${selectedNode === 'mob-giamdoc' ? 'border-brand-gold shadow-[0_0_15px_rgba(220,169,42,0.15)] bg-slate-900/95' : 'border-slate-800 bg-slate-900/80'} cursor-pointer`}>
              <span className="text-[9px] font-black tracking-widest text-brand-gold uppercase font-display leading-none">GIÁM ĐỐC BAN ĐIỀU HÀNH</span>
              <h3 className="text-sm font-black text-white font-display mt-1">{directorNode.name}</h3>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-light">{directorNode.leaderTitle}</p>
              
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-brand-gold font-bold">
                <span>{selectedNode === 'mob-giamdoc' ? 'Thu gọn nhiệm vụ' : 'Chạm xem nhiệm vụ chính'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${selectedNode === 'mob-giamdoc' ? 'rotate-180' : ''}`} />
              </div>

              {/* collapsible inner task timeline mob */}
              {selectedNode === 'mob-giamdoc' && (
                <ul className="mt-3 pt-3 border-t border-white/5 space-y-2">
                  {directorNode.tasks.map((t, idx) => (
                    <li key={idx} className="text-xs text-slate-300 font-light flex items-start gap-1.5">
                      <span className="text-brand-gold font-bold leading-none">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>

          {/* 2. Deputy Director Mob */}
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={() => setSelectedNode(selectedNode === 'mob-phogiamdoc' ? null : 'mob-phogiamdoc')}
            className="flex gap-4 relative"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center text-slate-950 z-20 shrink-0 shadow-lg shadow-blue-500/10">
              <Users className="w-5 h-5 text-white" />
            </div>
            
            <div className={`flex-1 p-5 rounded-2xl bg-slate-900 border ${selectedNode === 'mob-phogiamdoc' ? 'border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.15)] bg-slate-900/95' : 'border-slate-800 bg-slate-900/80'} cursor-pointer`}>
              <span className="text-[9px] font-black tracking-widest text-blue-400 uppercase font-display leading-none">PHÓ GIÁM ĐỐC KỸ THUẬT & SẢN XUẤT</span>
              <h3 className="text-sm font-black text-white font-display mt-1">{deputyDirectorNode.name}</h3>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-light">{deputyDirectorNode.leaderTitle}</p>
              
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-blue-400 font-bold">
                <span>{selectedNode === 'mob-phogiamdoc' ? 'Thu gọn nhiệm vụ' : 'Chạm xem nhiệm vụ chính'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${selectedNode === 'mob-phogiamdoc' ? 'rotate-180' : ''}`} />
              </div>

              {/* collapsible */}
              {selectedNode === 'mob-phogiamdoc' && (
                <ul className="mt-3 pt-3 border-t border-white/5 space-y-2">
                  {deputyDirectorNode.tasks.map((t, idx) => (
                    <li key={idx} className="text-xs text-slate-300 font-light flex items-start gap-1.5">
                      <span className="text-blue-400 font-bold leading-none">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>

          {/* Loop all administrative & workshop nodes seamlessly as an elegant chain */}
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-4 mb-2 pl-14">PHÒNG NGHIỆP VỤ & PHÂN XƯỞNG THÀNH VIÊN</p>

          {[...administrationNodes, ...workshopNodes].map((node, index) => {
            const isSelected = selectedNode === `mob-${node.id}`;
            const isFinishedShop = index >= 2; // Color variation
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onClick={() => setSelectedNode(isSelected ? null : `mob-${node.id}`)}
                className="flex gap-4 relative"
              >
                <div className={`w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center z-20 shrink-0 shadow-md ${
                  isFinishedShop 
                    ? 'bg-slate-950 text-brand-gold border-brand-gold/40' 
                    : 'bg-slate-950 text-emerald-400 border-emerald-500/45'
                }`}>
                  {node.icon}
                </div>

                <div className={`flex-1 p-5 rounded-2xl bg-slate-900 border ${
                  isSelected 
                    ? isFinishedShop 
                      ? 'border-brand-gold bg-slate-900/95 shadow-lg shadow-brand-gold/5' 
                      : 'border-emerald-500 bg-slate-900/95 shadow-lg shadow-emerald-500/5'
                    : 'border-slate-800 bg-slate-900/80'
                } cursor-pointer`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-black tracking-widest uppercase font-display leading-none ${
                      isFinishedShop ? 'text-brand-gold' : 'text-emerald-400'
                    }`}>
                      {node.role}
                    </span>
                    <span className="text-[8px] text-slate-500 font-mono">BỘ PHẬN NO.0{index + 1}</span>
                  </div>
                  <h3 className="text-sm font-black text-white font-display mt-1.5">{node.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 lines-2 font-light">{node.leaderTitle}</p>
                  
                  <div className={`mt-3 flex items-center gap-1 text-[10px] font-bold ${
                    isFinishedShop ? 'text-brand-gold' : 'text-emerald-400'
                  }`}>
                    <span>{isSelected ? 'Thu gọn nhiệm vụ' : 'Chạm xem chi tiết nghiệp vụ'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Collapsible details list */}
                  {isSelected && (
                    <ul className="mt-3.5 pt-3.5 border-t border-white/5 space-y-2">
                      {node.tasks.map((t, idx) => (
                        <li key={idx} className="text-xs text-slate-350 font-light flex items-start gap-1.5 leading-relaxed">
                          <span className={`font-bold select-none ${isFinishedShop ? 'text-brand-gold' : 'text-emerald-400'}`}>•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            );
          })}

        </div>

        {/* ================= EXTRA UX: SYSTEM STATISTICS PANEL AT THE BOTTOM ================= */}
        <div className="mt-20 pt-16 border-t border-white/5 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-5xl mx-auto">
            
            {/* Stat 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:bg-white/[0.04] hover:border-brand-gold/30 transition-all shadow-sm"
            >
              <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-none">
                45+ <span className="text-sm font-semibold text-brand-gold">Năm</span>
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 font-display leading-tight">
                Kinh Nghiệm Ngành In
              </p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:bg-white/[0.04] hover:border-brand-gold/30 transition-all shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-none">
                200+ <span className="text-sm font-semibold text-blue-400">Thợ in</span>
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 font-display leading-tight">
                Nhân Sự Chuyên Nghiệp
              </p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:bg-white/[0.04] hover:border-brand-gold/30 transition-all shadow-sm"
            >
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-none">
                100%
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 font-display leading-tight">
                An Toàn Bảo Mật ISO
              </p>
            </motion.div>

            {/* Stat 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:bg-white/[0.04] hover:border-brand-gold/30 transition-all shadow-sm"
            >
              <div className="w-12 h-12 bg-pink-500/10 text-pink-400 rounded-full flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-none">
                24/7
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 font-display leading-tight">
                Vận Hành Nhà Máy Khép Kín
              </p>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
