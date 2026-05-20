import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, MapPin, DollarSign, Calendar, FileText, CheckCircle, ChevronDown, Check, GraduationCap } from 'lucide-react';
import { VACANCIES } from '../data/companyData';

export default function Recruitment() {
  const [expandedVacancyId, setExpandedVacancyId] = useState<string | null>(VACANCIES[0].id);
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

  return (
    <section id="recruitment" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center flex flex-col items-center gap-2 mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-gold uppercase font-display">
            CƠ HỘI NGHỀ NGHIỆP TẠI IN TÀI CHÍNH
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-brand-blue tracking-tight leading-tight uppercase">
            GIA NHẬP ĐỘI NGŨ KỸ SƯ IN ẤN BẢO MẬT HÀNG ĐẦU
          </h2>
          <div className="w-20 h-1 bg-brand-gold rounded-full mt-2"></div>
          <p className="text-slate-500 font-sans text-xs sm:text-sm max-w-xl mt-2">
            Lao động tích cực, bảo an tuyệt đối, hướng tới phúc lợi ổn định dài lâu và tiến bộ công nghệ vượt bậc.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Vacancies Board List (Left 7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="text-xs font-black text-brand-blue tracking-widest uppercase font-display mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-gold" /> VỊ TRÍ TUYỂN DỤNG HIỆN HÀNH
            </h3>

            <div className="space-y-4">
              {VACANCIES.map((job) => {
                const isExpanded = expandedVacancyId === job.id;
                return (
                  <div 
                    key={job.id}
                    className={`border rounded-xl transition-all overflow-hidden ${
                      isExpanded ? 'border-brand-blue ring-1 ring-brand-blue/15 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Accordion Trigger row */}
                    <button
                      onClick={() => toggleAccordion(job.id)}
                      className="w-full text-left p-5 flex justify-between items-start gap-4 cursor-pointer focus:outline-none"
                    >
                      <div className="flex-1">
                        <span className="px-2.5 py-0.5 text-[9px] font-black font-display tracking-widest bg-brand-blue text-white rounded uppercase mb-2 inline-block">
                          {job.department}
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-brand-blue font-display">
                          {job.title}
                        </h4>
                        
                        {/* Quick meta blocks */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <DollarSign className="w-3.5 h-3.5 text-brand-gold" /> {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> Cụm CN Nhị Xuân, TP.HCM
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
                          className="border-t border-slate-200"
                        >
                          <div className="p-5 flex flex-col gap-5 text-xs text-slate-600">
                            
                            {/* Requirements box */}
                            <div>
                              <h5 className="font-extrabold text-slate-800 tracking-wider font-display uppercase mb-2">
                                YÊU CẦU CÔNG VIỆC:
                              </h5>
                              <ul className="space-y-1.5">
                                {job.requirements.map((req, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-xs">
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0"></span>
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Benefits box */}
                            <div>
                              <h5 className="font-extrabold text-slate-800 tracking-wider font-display uppercase mb-2">
                                PHÚC LỢI ĐƯỢC HƯỞNG:
                              </h5>
                              <ul className="space-y-1.5">
                                {job.benefits.map((ben, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-xs">
                                    <span className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                                      <Check className="w-3 h-3" />
                                    </span>
                                    <span>{ben}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* CTAs row */}
                            <div className="pt-4 border-t border-slate-200/60 flex justify-end">
                              <button
                                onClick={() => {
                                  setApplyVacancyTitle(job.title);
                                  // Scroll to candidate form smoothly
                                  document.getElementById('candidate-apply-form')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-5 py-2.5 text-xs font-black tracking-widest bg-brand-gold text-brand-blue hover:bg-yellow-400 rounded transition-all cursor-pointer font-display uppercase shadow-sm shrink-0"
                              >
                                Nộp hồ sơ ứng tuyển vị trí này
                              </button>
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
            <h3 className="text-xs font-black text-brand-blue tracking-widest uppercase font-display mb-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-brand-gold" /> NỘP HỒ SƠ ỨNG TUYỂN NHANH
            </h3>
            <p className="text-[10.5px] text-slate-500 font-sans mb-5 leading-relaxed">
              Hãy gửi thông tin sơ bộ của bạn, phòng Nhân sự của Xổ Số Kiến Thiết TP.HCM sẽ liên hệ trực tiếp trong vòng 3 ngày làm việc.
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
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                    required
                  >
                    <option value="" disabled>--- Chọn vị trí cần ứng tuyển ---</option>
                    {VACANCIES.map((j) => (
                      <option key={j.id} value={j.title}>{j.title}</option>
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
                  disabled={isSubmitting}
                  className={`w-full py-3 mt-2 text-xs font-black font-display tracking-widest text-white rounded transition-all cursor-pointer shadow uppercase flex items-center justify-center gap-2 ${
                    isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-blue-dark'
                  }`}
                >
                  {isSubmitting ? (
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
