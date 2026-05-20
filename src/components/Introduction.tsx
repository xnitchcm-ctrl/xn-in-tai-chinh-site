import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShieldCheck, Target, Zap, Clock, ThumbsUp } from 'lucide-react';
import { COMPANY_INFO, STATISTICS } from '../data/companyData';

export default function Introduction() {
  const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'values' | 'history'>('mission');

  const tabContents = {
    mission: {
      icon: <Target className="w-8 h-8 text-brand-blue" />,
      title: 'SỨ MỆNH CỦA CHÚNG TÔI',
      subtitle: 'Phục vụ thị trường xổ số kiến thiết tài chính trung thực và an toàn tuyệt đối.',
      paragraphs: [
        'Xí nghiệp In Tài Chính có sứ mệnh cao cả trong việc cung cấp các ấn phẩm vé số truyền thống, vé số tự chọn, phiếu thu chi nghiệp vụ và các loại chứng từ bảo mật đạt tiêu chuẩn chống sao chép khắt khe nhất của Nhà nước.',
        'Chúng tôi đồng hành với ngân sách nhà nước thông qua việc đảm bảo phát hành xổ số kiến thiết thuận lợi, trung thực, hỗ trợ các chương trình phúc lợi công ích đầy nhân văn của Công Ty TNHH MTV Xổ Số Kiến Thiết TP.HCM.'
      ]
    },
    vision: {
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      title: 'TẦM NHÌN CHIẾN LƯỢC',
      subtitle: 'Trở thành tập đoàn in ấn và giải pháp bảo an kỹ thuật số hàng đầu Đông Nam Á.',
      paragraphs: [
        'Đến năm 2030, Xí nghiệp phấn đấu chuyển dịch 100% dây chuyền quản lý sang số hóa đồng bộ, áp dụng trí tuệ nhân tạo (AI) trong kiểm định chất lượng ấn phẩm (KCS) thời gian thực.',
        'Mở rộng hợp tác in gia công bảo mật cho các đối tác quốc tế từ Lào, Campuchia và các tập đoàn tài chính đa quốc gia kinh doanh tại Việt Nam.'
      ]
    },
    values: {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
      title: 'GIÁ TRỊ CỐT LÕI',
      subtitle: 'CHUYÊN NGHIỆP – CHÍNH XÁC – BẢO MẬT làm nền tảng phát sinh thịnh vượng.',
      paragraphs: [
        'CHUYÊN NGHIỆP: Quy trình làm việc tự động hóa khép kín, đội ngũ thợ lành nghề, phục vụ tận tâm từ khâu thiết kế đến vận chuyển bàn giao.',
        'CHÍNH XÁC: Số tự động nhảy không sai một ly, màu lót sắc nét kháng nước đạt tỷ lệ đồng bộ tuyệt đối.',
        'BẢO MẬT: Hồ sơ sê-ri được mã hóa lưu trữ đa luồng vật lý và máy chủ đám mây, chống rò rỉ và chống làm giả triệt để.'
      ]
    },
    history: {
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      title: 'CHẶNG ĐƯỜNG PHÁT TRIỂN',
      subtitle: 'Hơn 45 năm đồng hành và rạng danh cùng TP.Hồ Chí Minh hùng cường.',
      paragraphs: [
        'Thành lập từ cuối thập niên 1970 từ một xưởng in ấn đơn giản chuyên in phiếu công ích xã hội, xí nghiệp đã liên tục cải biến và sáp nhập vào hệ thống Công Ty TNHH MTV Xổ Số Kiến Thiết TP.HCM năm 1992.',
        'Tọa lạc tại Cụm công nghiệp Nhị Xuân (Hóc Môn) quy mô diện tích xưởng trên 5,000m2, chúng tôi tự hào sở hữu hệ máy in Offset hiện đại cùng chứng nhận hệ thống an toàn thông tin ISO 27001 hàng năm.'
      ]
    }
  };

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Block: Narrative text & tab-based interactive block */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Outline section header */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold tracking-widest text-brand-gold uppercase font-display">
                VỀ CHÚNG TÔI
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-brand-blue tracking-tight leading-tight uppercase">
                HƠN 45 NĂM KIẾN TẠO LÒNG TIN VÀ CHẤT LƯỢNG IN ẤN
              </h2>
              <div className="w-20 h-1 bg-brand-gold rounded-full mt-2"></div>
            </div>

            <p className="text-slate-600 font-sans leading-relaxed text-sm sm:text-base">
              Nằm trong hệ thống cốt lõi của <strong className="text-brand-blue">{COMPANY_INFO.parentCompany}</strong>, Xí nghiệp In Tài Chính đã bền bỉ phục vụ nhu cầu in vé số và ấn chỉ bảo mật chất lượng cao trên toàn quốc suốt hơn 4 thập kỷ qua. Chúng tôi cam kết đem lại giá trị tối đa dựa trên nền tảng kỹ nghệ in ấn thượng hạng từ Đức.
            </p>

            {/* Interactive Tabs Menu for Vision / Mission / Values & History */}
            <div className="mt-4 flex flex-wrap gap-2 border-b border-slate-200 relative">
              {(['mission', 'vision', 'values', 'history'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-4 sm:px-6 py-3 font-display text-xs font-extrabold tracking-widest uppercase relative cursor-pointer focus:outline-none transition-colors duration-200 z-10"
                    style={{ color: isActive ? '#0a3273' : '#64748b' }}
                  >
                    {tab === 'mission' && 'Sứ Mệnh'}
                    {tab === 'vision' && 'Tầm Nhìn'}
                    {tab === 'values' && 'Giá Trị'}
                    {tab === 'history' && 'Lịch Sử'}
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBackground"
                        className="absolute inset-0 bg-brand-blue/5 rounded-t-lg -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Tab Content frame with crossfade animation */}
            <div className="bg-white border border-slate-100 rounded-xl shadow-sm min-h-[220px] overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-zinc-50 rounded-lg shrink-0 border border-slate-100/80">
                      {tabContents[activeTab].icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-brand-blue font-display tracking-wider">
                        {tabContents[activeTab].title}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">
                        {tabContents[activeTab].subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 mt-4 text-xs font-sans text-slate-600 leading-relaxed">
                    {tabContents[activeTab].paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Right Block: Fast stats grid & ISO certified stamps */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Statistics Dashboard representation */}
            <div className="grid grid-cols-2 gap-4">
              {STATISTICS.map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
                  whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                  className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-brand-blue hover:shadow-md transition-all group cursor-pointer"
                >
                  <p className="text-3xl sm:text-4xl font-black text-brand-blue group-hover:text-brand-gold transition-colors font-mono">
                    {stat.value}
                  </p>
                  <p className="text-xs font-extrabold text-slate-700 tracking-wider font-display uppercase mt-1">
                    {stat.label}
                  </p>
                  <p className="text-[10px] text-slate-500 font-sans leading-normal mt-1 block">
                    {stat.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* ISO compliance and state credentials box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="p-5 rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue-dark text-white shadow-xl flex items-center gap-4 relative overflow-hidden group border border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Award className="w-14 h-14 text-brand-gold shrink-0 animate-pulse relative z-10" />
              <div className="relative z-10">
                <p className="text-[10px] tracking-widest text-amber-300 font-bold uppercase font-display leading-none">
                  HỆ THỐNG QUẢN LÝ ĐÃ ĐƯỢC CHỨNG NHẬN
                </p>
                <h4 className="text-sm font-bold font-display tracking-tight text-white mt-1 uppercase">
                  TIÊU CHUẨN ISO 9001:2015 & ISO/IEC 27001
                </h4>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed mt-1">
                  Xí nghiệp thiết lập hệ thống bảo vệ thông tin mật và chất lượng ấn phẩm tối cao của Tổ chức Tiêu chuẩn hóa quốc tế SGS giám định định kỳ.
                </p>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
