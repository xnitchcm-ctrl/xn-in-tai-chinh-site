import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCMS } from '../context/CMSContext';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  FileText, 
  CheckCircle, 
  ChevronDown, 
  Check, 
  GraduationCap,
  Cpu,
  Palette,
  Printer,
  Layers,
  Settings
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

export default function Recruitment() {
  const { vacancies: VACANCIES, companyInfo } = useCMS();
  const [expandedVacancyId, setExpandedVacancyId] = useState<string | null>(() => {
    return VACANCIES && VACANCIES.length > 0 ? VACANCIES[0].id : null;
  });
  const [applyVacancyTitle, setApplyVacancyTitle] = useState<string | null>(null);

  // Form states
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [cvLink, setCvLink] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAccordion = (id: string) => {
    setExpandedVacancyId((prev) => (prev === id ? null : id));
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !candidateEmail || !candidatePhone) return;

    setIsSubmitting(true);
    // Custom email submission notification for xnitchcm@gmail.com
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      // Clean up Form fields
      setCandidateName('');
      setCandidateEmail('');
      setCandidatePhone('');
      setCvLink('');
      setCoverLetter('');
    }, 1800);
  };

  const getJobIcon = (id: string) => {
    if (id === 'v1') return <Cpu className="w-5 h-5 text-red-600" />;
    if (id === 'v2') return <Palette className="w-5 h-5 text-[#0A3273]" />;
    return <Briefcase className="w-5 h-5 text-brand-gold" />;
  };

  const getJobIconBg = (id: string) => {
    if (id === 'v1') return 'bg-red-50 border border-red-100';
    if (id === 'v2') return 'bg-blue-50 border border-blue-100/60';
    return 'bg-amber-50 border border-amber-100';
  };

  return (
    <section id="recruitment" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center flex flex-col items-center gap-2 mb-16">
          <span className="text-xs font-bold tracking-widest text-[#0A3273] uppercase font-display">
            CƠ HỘI NGHỀ NGHIỆP TẠI IN TÀI CHÍNH
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#0A3273] tracking-tight leading-tight uppercase">
            🔴 TUYỂN DỤNG CƠ CẤU VẬN HÀNH THẾ HỆ MỚI
          </h2>
          <div className="w-20 h-1 bg-red-600 rounded-full mt-2"></div>
          <p className="text-slate-500 font-sans text-xs sm:text-sm max-w-xl mt-3">
            Gia nhập Đội ngũ xí nghiệp sản xuất in ấn chuyên nghiệp, phục vụ nhu cầu in vé số kiến thiết và các ấn phẩm tài chính chất lượng cao.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Vacancies Board List (Left 7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="text-xs font-black text-[#0A3273] tracking-widest uppercase font-display mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-red-600" /> VỊ TRÍ TUYỂN DỤNG HIỆN HÀNH
            </h3>

            <div className="space-y-4">
              {VACANCIES.map((job) => {
                const isExpanded = expandedVacancyId === job.id;
                const isClosed = job.isClosed;
                return (
                  <div 
                    key={job.id}
                    className={`border rounded-xl transition-all overflow-hidden ${
                      isClosed ? 'opacity-85 bg-slate-50/50' : ''
                    } ${
                      isExpanded ? 'border-brand-blue ring-1 ring-brand-blue/15 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Accordion Trigger row */}
                    <button
                      onClick={() => toggleAccordion(job.id)}
                      className="w-full text-left p-5 flex items-center gap-4 cursor-pointer focus:outline-none"
                    >
                      <div className={`p-3 rounded-xl ${getJobIconBg(job.id)} shrink-0 self-center hidden sm:block`}>
                        {getJobIcon(job.id)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 text-[9px] font-black font-display tracking-widest bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded uppercase inline-block">
                            {job.department}
                          </span>
                          {isClosed && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-650 text-white text-[9.5px] font-bold uppercase tracking-wider shrink-0 shadow-sm animate-pulse">
                              <span>⛔</span> ĐÃ HẾT TUYỂN DỤNG
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-brand-blue font-display flex items-center gap-2">
                          <span className="sm:hidden shrink-0">{getJobIcon(job.id)}</span>
                          {job.title}
                        </h4>
                        
                        {/* Quick meta blocks */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <DollarSign className="w-3.5 h-3.5 text-[#DCA92A]" /> {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> Tp. Hồ Chí Minh
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Hạn nộp: {job.deadline}
                          </span>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 mt-1 transition-transform ${isExpanded ? 'rotate-180 text-brand-blue' : ''}`} />
                    </button>

                    {/* Accordion Content Panel */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-slate-200 bg-white"
                        >
                          <div className="p-5 flex flex-col gap-6 text-xs text-slate-600">
                            
                            {/* Job Description (Mô tả công việc) */}
                            {job.tasks && job.tasks.length > 0 && (
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h5 className="font-extrabold text-[#0A3273] tracking-wider font-display uppercase mb-3 flex items-center gap-2 text-xs">
                                  <Settings className="w-4 h-4 text-red-600 shrink-0" />
                                  MÔ TẢ CÔNG VIỆC:
                                </h5>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {job.tasks.map((task, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-slate-700">
                                      <span className="p-0.5 rounded-full bg-red-50 text-red-600 shrink-0 mt-0.5">
                                        <Check className="w-3 h-3" />
                                      </span>
                                      <span className="font-sans leading-relaxed text-xs">{task}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Requirements box */}
                            <div>
                              <h5 className="font-extrabold text-[#0A3273] tracking-wider font-display uppercase mb-3 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-[#DCA92A]" />
                                YÊU CẦU TUYỂN DỤNG:
                              </h5>
                              <ul className="space-y-2">
                                {job.requirements.map((req, idx) => (
                                  <li key={idx} className="flex items-start gap-2.5 text-slate-700">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                    <span className="font-sans leading-relaxed">{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Benefits box */}
                            <div>
                              <h5 className="font-extrabold text-[#0A3273] tracking-wider font-display uppercase mb-3 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-brand-blue" />
                                PHÚC LỢI ĐƯỢC HƯỞNG:
                              </h5>
                              <ul className="space-y-2">
                                {job.benefits.map((ben, idx) => (
                                  <li key={idx} className="flex items-start gap-2.5 text-slate-700">
                                    <span className="p-0.5 rounded-full bg-blue-50 text-brand-blue shrink-0 mt-0.5">
                                      <Check className="w-3 h-3" />
                                    </span>
                                    <span className="font-sans leading-semibold">{ben}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* CTAs row */}
                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                              {isClosed ? (
                                <button
                                  disabled
                                  className="px-5 py-2.5 text-xs font-semibold tracking-widest bg-slate-200 text-slate-500 border border-slate-300 rounded cursor-not-allowed font-display uppercase shrink-0"
                                >
                                  ❌ Tạm dừng nhận hồ sơ
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setApplyVacancyTitle(job.title);
                                    // Scroll to candidate form smoothly
                                    document.getElementById('candidate-apply-form')?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  className="px-5 py-2.5 text-xs font-black tracking-widest bg-red-600 hover:bg-red-700 text-white rounded transition-all cursor-pointer font-display uppercase shadow-md shrink-0"
                                >
                                  Nộp hồ sơ ứng tuyển vị trí này
                                </button>
                              )}
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Candidate Form (Right 5 cols) */}
          <div id="candidate-apply-form" className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-black text-[#0A3273] tracking-widest uppercase font-display mb-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-red-600" /> NỘP HỒ SƠ ỨNG TUYỂN NHANH
            </h3>
            <p className="text-[10.5px] text-slate-500 font-sans mb-5 leading-relaxed">
              Hãy gửi thông tin sơ bộ của bạn, phòng Nhân sự của Xí Nghiệp In Tài Chính TP. Hồ Chí Minh sẽ liên hệ trực tiếp trong vòng 3 ngày làm việc.
            </p>

            {formSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center flex flex-col items-center gap-3"
              >
                <CheckCircle className="w-12 h-12 text-emerald-600 animate-bounce" />
                <h4 className="text-sm font-bold text-emerald-900 font-display">NỘP ĐƠN HỒ SƠ THÀNH CÔNG!</h4>
                <p className="text-xs text-emerald-700 leading-normal">
                  Hệ thống Xí nghiệp In Tài Chính đã ghi nhận hồ sơ ứng cử viên. Chúng tôi đã gửi email tự động xác nhận tới địa chỉ của bạn. Trân trọng cảm ơn!
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-4 py-2 mt-2 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold font-display rounded transition-colors cursor-pointer"
                >
                  Nộp Đơn Khác
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                
                {/* Auto selected or user selected position header */}
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                    Vị Trí Ứng Tuyển:
                  </label>
                  <select
                    value={applyVacancyTitle || ''}
                    onChange={(e) => setApplyVacancyTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                    required
                    disabled={VACANCIES.every(v => v.isClosed)}
                  >
                    <option value="" disabled>--- Chọn vị trí cần ứng tuyển ---</option>
                    {VACANCIES.map((j) => (
                      <option key={j.id} value={j.title} disabled={j.isClosed}>
                        {j.title} {j.isClosed ? '(Đã hết tuyển dụng)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Candidate Name */}
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                    Họ và Tên Ứng Viên: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue"
                  />
                </div>

                {/* Input row phone and email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                      Số Điện Thoại: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0901234..."
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                      Thư Điện Tử (Email): <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="example@gmail.com"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                {/* Portfolio / Link CV drive */}
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                    Đường Dẫn Hồ Sơ / CV (Drive, PDF Dropbox...):
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={cvLink}
                      onChange={(e) => setCvLink(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue pl-9"
                    />
                    <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Optional Cover letter text */}
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                    Giới Thiệu Bản Thân / Nguyện Vọng Ca Kíp:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Sơ lược về kinh nghiệm của bạn hoặc ca trực tối mong muốn ứng tuyển tuyển..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={VACANCIES.every(v => v.isClosed) || isSubmitting}
                  className={`w-full py-3 mt-2 text-xs font-black font-display tracking-widest text-white rounded transition-all shadow uppercase flex items-center justify-center gap-2 ${
                    VACANCIES.every(v => v.isClosed)
                      ? 'bg-red-600 hover:bg-red-700 cursor-not-allowed'
                      : isSubmitting 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : 'bg-brand-blue hover:bg-brand-blue-dark cursor-pointer'
                  }`}
                >
                  {VACANCIES.every(v => v.isClosed) ? (
                    <span>🔴 TẠM THỜI KHÔNG NHẬN HỒ SƠ</span>
                  ) : isSubmitting ? (
                    <span>ĐANG GỬI HỒ SƠ...</span>
                  ) : (
                    <>GỬI HỒ SƠ XÉT DUYỆT</>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
