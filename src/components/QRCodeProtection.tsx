import { useState } from 'react';
import { motion } from 'motion/react';
import { QrCode, ShieldAlert, Cpu, Server, CheckCircle2, Check, ArrowRight, UserCheck, Landmark, SlidersHorizontal } from 'lucide-react';

export default function QRCodeProtection() {
  const [activeTab, setActiveTab] = useState<'customer' | 'company' | 'printer'>('customer');

  const tabBenefits = {
    customer: {
      title: 'Dành cho Khách hàng dự thưởng',
      icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
      bullets: [
        'Quét mã QR Code trực tiếp qua điện thoại di động để kiểm chứng thông tin phát hành vé số.',
        'Hỗ trợ tra cứu kết quả kỳ mở thưởng và đối chiếu số dự thưởng tự động.',
        'Nhận diện thông tin giải thưởng nhanh chóng, hạn chế sai sót bốc thăm dò thủ công.',
        'Xác minh nguồn gốc vé thật - giả tức thời nhờ chữ ký số mã hóa bảo mật.'
      ]
    },
    company: {
      title: 'Dành cho Công ty Xổ số kiến thiết',
      icon: <Landmark className="w-5 h-5 text-amber-400" />,
      bullets: [
        'Truy vết thông tin sê-ri vé phát hành toàn bộ vòng đời phân phối đại lý.',
        'Quản lý dữ liệu kết quả từng kỳ mở thưởng tập trung và đồng bộ hóa tức thì.',
        'Xác thực tính toàn vẹn của tờ vé trúng thưởng và cùi vé cuộn đại lý hoàn trả.',
        'Số hóa quy trình kiểm kê, giảm thiểu áp lực quản lý, tăng tính minh bạch tài chính.'
      ]
    },
    printer: {
      title: 'Dành cho Nhà in chuyên nghiệp',
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      bullets: [
        'Kiểm soát dữ liệu đầu vào và đầu ra tự động trong suốt quá trình in ấn sê-ri.',
        'Đối chiếu thông tin mật mã hóa với máy chủ, triệt tiêu sai số trùng lặp khi sản xuất.',
        'Camera chuyên dụng quét hậu kiểm trực tiếp trên băng chuyền sản xuất siêu tốc.',
        'Hỗ trợ quản lý thống kê hao hụt dữ liệu và tinh chỉnh chất lượng in ấn đỉnh cao.'
      ]
    }
  };

  return (
    <section id="qrcode-sec" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#123A78] text-white relative overflow-hidden">
      {/* Visual cyber mesh wallpaper decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F3268_1px,transparent_1px),linear-gradient(to_bottom,#0F3268_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
      
      {/* Decorative gradient glow spots */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-red-950/40 border border-red-500/30 rounded-full text-red-400 text-[10px] uppercase font-black font-display tracking-widest mb-4"
          >
            <QrCode className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Chuyển đổi số ngành xổ số</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white uppercase leading-tight select-none"
          >
            🔐 CÔNG NGHỆ QR CODE BẢO MẬT ĐA LỚP
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed mt-4"
          >
            Hệ thống in vé số kiến thiết được tích hợp công nghệ QR Code định danh riêng biệt cho từng tờ vé, 
            ứng dụng nền tảng mã hóa dữ liệu hai chiều nhiều lớp nhằm nâng cao khả năng bảo mật, chống giả 
            và hỗ trợ quản lý hiện đại tối ưu.
          </motion.p>
          
          <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-brand-gold rounded-full mt-5"></div>
        </div>

        {/* Dynamic Multi-column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-16">
          
          {/* Column 1: Core Technology (Left - 6 columns) */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#0F3268]/60 border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#123A78]/80 transition-all duration-300 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-red-950/50 flex items-center justify-center border border-red-500/20">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-black font-display tracking-wider text-white uppercase">
                    Tính năng bảo an chủ chốt
                  </h3>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">Dữ liệu biến đổi số hoá tích hợp</p>
                </div>
              </div>

              {/* Core Features bullets */}
              <div className="flex flex-col gap-4">
                {[
                  {
                    title: 'Mã định danh duy nhất',
                    desc: 'Mỗi tờ vé số được hệ thống máy in KTS gán một mã QR Code độc lập, hoàn toàn không trùng lặp đại trà.'
                  },
                  {
                    title: 'Đầy đủ thông tin thiết yếu',
                    desc: 'Tích hợp đầy đủ dữ liệu: Ký hiệu vé số, Ngày mở thưởng chính xác, Dãy số lựa chọn dự thưởng, Ký tự bảo an nhận dạng và Mẫu sê-ri.'
                  },
                  {
                    title: 'Mã hóa hai chiều chuyên sâu',
                    desc: 'Ứng dụng mật mã học phân lớp để ngăn ngừa xâm nhập, bẻ khóa cơ sở hay làm nhái mặt vé bằng vật lý.'
                  },
                  {
                    title: 'Phục vụ chuyển đổi số',
                    desc: 'Dữ liệu được tập trung hóa trên máy chủ quốc gia an toàn, sẵn sàng kết nối cùng ứng dụng phát sinh tiện ích tương lai.'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-3 item">
                    <div className="mt-1 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase font-display select-none">{item.title}</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed font-sans font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom tag indicator */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">Mã hóa logic số: AES-256 HSM</span>
              <span className="flex items-center gap-1.5 font-display font-medium text-brand-gold text-[10px] uppercase">
                <Server className="w-3.5 h-3.5 text-brand-gold" /> Backup độc lập 100%
              </span>
            </div>
          </div>

          {/* Column 2: System Benefits tabbed view (Right - 6 columns) */}
          <div className="lg:col-span-6 flex flex-col bg-[#0F3268]/60 border border-white/10 rounded-2xl p-6 sm:p-8 flex-1">
            <div className="flex flex-col gap-4">
              
              <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                <SlidersHorizontal className="w-4 h-4 text-brand-gold shrink-0" />
                <h3 className="text-xs sm:text-sm font-black font-display text-white tracking-wider uppercase select-none">
                  Lợi ích hệ thống QR Code thiết kế
                </h3>
              </div>

              {/* Tab Selector Buttons */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#123A78]/70 rounded-xl border border-white/5">
                {(Object.keys(tabBenefits) as Array<keyof typeof tabBenefits>).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-2.5 rounded-lg text-[10px] sm:text-xs font-black font-display uppercase tracking-widest text-center transition-all ${
                      activeTab === tab 
                        ? 'bg-brand-gold text-brand-blue font-extrabold shadow-md' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab === 'customer' ? 'Khách hàng' : tab === 'company' ? 'Công ty XS' : 'Nhà in'}
                  </button>
                ))}
              </div>

              {/* Tab Content rendering area */}
              <div className="p-4 rounded-xl bg-[#123A78]/40 border border-white/5 flex flex-col gap-4 min-h-[240px] justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    {tabBenefits[activeTab].icon}
                    <h4 className="text-xs sm:text-sm font-bold font-display text-slate-100 uppercase select-none">
                      {tabBenefits[activeTab].title}
                    </h4>
                  </div>
                  
                  <ul className="flex flex-col gap-2.5 mt-2">
                    {tabBenefits[activeTab].bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300 font-sans font-light leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-white/5 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Dịch vụ tự động 24/7</span>
                  <span className="text-brand-gold hover:underline cursor-pointer flex items-center gap-1 font-display uppercase font-bold tracking-widest text-[9px]">
                    Tìm hiểu cổng dữ liệu <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Big visual Highlight strip requested */}
        <div className="w-full">
          <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-red-950 via-[#0F3268] to-red-950 border border-red-500/25 shadow-xl shadow-red-950/20 text-center relative overflow-hidden group hover:border-red-500/40 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2 h-full bg-brand-gold"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4">
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <p className="text-xs sm:text-sm md:text-base font-black text-red-100 tracking-wide uppercase font-display leading-tight select-none">
                QR CODE ĐỊNH DANH RIÊNG BIỆT – BẢO MẬT CAO – HỖ TRỢ DÒ KẾT QUẢ NHANH CHÓNG
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
