import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCMS } from '../context/CMSContext';
import { Award, ShieldCheck, Target, Zap, Clock, ThumbsUp, TrendingUp, Factory, Cpu, QrCode, Database } from 'lucide-react';

export default function Introduction() {
  const { companyInfo: COMPANY_INFO, statistics: STATISTICS } = useCMS();
  const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'values' | 'history'>('mission');

  const tabContents = {
    mission: {
      icon: <Target className="w-8 h-8 text-brand-blue" />,
      title: '🎯 SỨ MỆNH PHÁT TRIỂN',
      subtitle: 'Sản xuất và in ấn tài chính chuyên nghiệp, định hướng hiện đại hóa công nghệ.',
      paragraphs: [
        'Xí nghiệp In Tài Chính TP. Hồ Chí Minh thực hiện nhiệm vụ sản xuất và in ấn vé số kiến thiết, vé số cào, chứng từ và các ấn phẩm phục vụ ngành tài chính trên hệ thống thiết bị in hiện đại.',
        'Đơn vị không ngừng ứng dụng công nghệ in kỹ thuật số biến đổi dữ liệu, tích hợp QR Code và các giải pháp quản lý thông tin nhằm nâng cao chất lượng sản phẩm, hỗ trợ công tác kiểm tra, xác thực và quản lý dữ liệu hiệu quả.',
        'Với định hướng phát triển ổn định và hiện đại, xí nghiệp luôn chú trọng chất lượng in ấn, tiến độ sản xuất và khả năng đáp ứng nhu cầu ngày càng cao của thị trường.'
      ]
    },
    vision: {
      icon: <TrendingUp className="w-8 h-8 text-red-600" />,
      title: 'TẦM NHÌN ĐẾN NĂM 2050',
      subtitle: 'Đơn vị in tài chính và công nghệ cao, phát triển hệ thống sản xuất thông minh.',
      paragraphs: [
        'Trở thành đơn vị in tài chính và in công nghệ cao uy tín, hiện đại, từng bước phát triển hệ thống sản xuất thông minh, ứng dụng công nghệ số và dữ liệu biến đổi trong ngành in.',
        'Định hướng mở rộng lĩnh vực sản xuất bao bì tự động bằng hệ thống máy móc hiện đại, nâng cao chất lượng sản phẩm, tối ưu năng suất và đáp ứng nhu cầu phát triển của thị trường in ấn trong thời đại chuyển đổi số.'
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
        'Tọa lạc tại Cụm công nghiệp - Khu dân cư Nhị Xuân (Xã Xuân Thới Sơn, TP.HCM) quy mô diện tích xưởng trên 5,000m2, chúng tôi tự hào sở hữu hệ máy in Offset hiện đại cùng hệ thống quản lý chất lượng ISO 9001:2015 nhằm duy trì chất lượng ổn định và cải tiến liên tục sản xuất hàng năm.'
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
              Nằm trong hệ thống cốt lõi của <strong className="text-brand-blue">{COMPANY_INFO.parentCompany}</strong>, Xí nghiệp In Tài Chính đã bền bỉ phục vụ nhu cầu in vé số và ấn chỉ bảo mật chất lượng cao trên toàn quốc suốt hơn 4 thập kỷ qua. Chúng tôi cam kết đem lại giá trị tối đa dựa trên hệ thống trang thiết bị in ấn thế hệ mới hiện đại, chính xác.
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
                  <div className="space-y-4 mt-4 text-xs font-sans text-slate-600 leading-relaxed">
                    {activeTab === 'mission' ? (
                      <div className="flex flex-col gap-4 animate-fadeIn">
                        {/* Paragraph 1 */}
                        <div className="flex gap-3 p-3.5 bg-slate-50/70 border border-slate-200/60 rounded-xl hover:border-slate-300 transition-colors">
                          <Factory className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                          <p className="text-slate-700 leading-relaxed text-xs sm:text-[13px]">
                            {tabContents.mission.paragraphs[0]}
                          </p>
                        </div>
                        
                        {/* Paragraph 2 - Core tech with highlights */}
                        <div className="flex flex-col sm:flex-row items-start gap-4 bg-gradient-to-br from-red-50 to-red-100/30 border border-red-200/50 p-4 rounded-xl shadow-sm relative overflow-hidden group hover:border-red-300 transition-all">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-xl pointer-events-none"></div>
                          
                          <div className="flex gap-2.5 shrink-0 mt-1">
                            <Cpu className="w-5 h-5 text-red-600 animate-pulse" />
                            <QrCode className="w-5 h-5 text-brand-blue" />
                            <Database className="w-5 h-5 text-emerald-600" />
                          </div>
                          
                          <p className="text-slate-800 text-xs sm:text-[13px] leading-relaxed">
                            Đơn vị không ngừng ứng dụng công nghệ <span className="text-red-700 font-extrabold bg-red-100/60 px-1.5 py-0.5 rounded shadow-sm">in kỹ thuật số biến đổi dữ liệu</span>, tích hợp <span className="text-brand-blue font-extrabold bg-blue-50 px-1.5 py-0.5 rounded shadow-sm">QR Code</span> và các giải pháp <span className="text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded shadow-sm">quản lý dữ liệu</span> thông tin nhằm nâng cao chất lượng sản phẩm, hỗ trợ công tác kiểm tra, xác thực và quản lý dữ liệu hiệu quả.
                          </p>
                        </div>

                        {/* Paragraph 3 */}
                        <div className="flex gap-3 p-3.5 bg-[#0a3273]/5 border border-[#0a3273]/10 rounded-xl">
                          <ShieldCheck className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                          <p className="text-slate-700 font-medium leading-relaxed text-xs sm:text-[13px]">
                            {tabContents.mission.paragraphs[2]}
                          </p>
                        </div>
                      </div>
                    ) : activeTab === 'vision' ? (
                      <div className="flex flex-col gap-4 animate-fadeIn">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 bg-red-50/70 border border-red-200/50 p-4 rounded-xl shadow-sm relative overflow-hidden group hover:border-red-300 transition-all">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-xl pointer-events-none"></div>
                          <div className="bg-gradient-to-br from-red-600 to-red-700 text-white font-black font-display tracking-wider text-xl sm:text-2xl px-3.5 py-1.5 rounded-lg flex items-center justify-center shadow-md shadow-red-200 select-none shrink-0">
                            2050
                          </div>
                          <p className="text-slate-800 font-bold text-xs sm:text-[13px] leading-relaxed">
                            {tabContents.vision.paragraphs[0]}
                          </p>
                        </div>
                        <div className="flex gap-2.5 p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                          <Factory className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                          <p className="text-slate-600 leading-relaxed">
                            {tabContents.vision.paragraphs[1]}
                          </p>
                        </div>
                      </div>
                    ) : (
                      tabContents[activeTab].paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))
                    )}
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
                  HỆ THỐNG QUẢN LÝ CHẤT LƯỢNG ĐÃ ĐƯỢC CHỨNG NHẬN
                </p>
                <h4 className="text-sm font-bold font-display tracking-tight text-white mt-1 uppercase">
                  TIÊU CHUẨN ISO 9001:2015
                </h4>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed mt-1">
                  Xí Nghiệp In Tài Chính TP. Hồ Chí Minh áp dụng và duy trì hệ thống quản lý chất lượng theo tiêu chuẩn ISO 9001:2015 nhằm nâng cao hiệu quả quản lý, kiểm soát chất lượng sản phẩm, cải tiến liên tục và đáp ứng yêu cầu của khách hàng.
                </p>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
