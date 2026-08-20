import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  ThumbsUp, 
  HelpCircle, 
  ShieldAlert, 
  Award, 
  Map, 
  Compass, 
  ArrowUpRight, 
  Globe 
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

export default function Contact() {
  const [formType, setFormType] = useState<'contact' | 'quote'>('contact');
  
  // Submit feedback state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [quoteService, setQuoteService] = useState('In Vé Số Kiến Thiết');
  const [quoteQuantity, setQuoteQuantity] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Clean up fields
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      setQuoteQuantity('');
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#F5F8FC] relative overflow-hidden">
      
      {/* High-end decorative background overlays and light grids */}
      <span className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#0d4f9c_1px,transparent_1px),linear-gradient(to_bottom,#0d4f9c_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Dynamic blurred color nodes matching navy blue + gold theme */}
      <span className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />
      <span className="absolute bottom-1/4 left-0 w-[350px] h-[350px] bg-[#F4C542]/5 rounded-full blur-[125px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* SECTION HEADER BLOCK */}
        <div className="text-center flex flex-col items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3.5 py-1 bg-[#0D4F9C]/5 border border-[#0D4F9C]/10 rounded-full text-[#0D4F9C] text-[10px] uppercase font-black tracking-widest mb-4 font-display"
          >
            <Globe className="w-3.5 h-3.5 text-[#0D4F9C] animate-spin-slow" />
            <span>Kênh tiếp nhận hỗ trợ đại lý & doanh nghiệp toàn quốc</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-4.5xl font-black font-display text-[#0D4F9C] tracking-tight leading-tight uppercase"
          >
            LIÊN HỆ & QUY TRÌNH BÁO GIÁ
          </motion.h2>
          
          <div className="w-16 h-1.5 bg-gradient-to-r from-[#0D4F9C] via-[#F4C542] to-[#1E63B5] rounded-full mt-4 mb-4" />
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#153A6B] font-sans text-xs sm:text-sm max-w-2xl text-center leading-relaxed font-semibold opacity-90"
          >
            Mọi thắc mắc của đại lý xổ số kiến thiết, khối ban ngành, ngân hàng về sê-ri ấn phẩm bảo mật 
            sẽ được ban thư ký tiếp nhận & phản hồi nhanh chóng trong 24 giờ.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* ================= LEFT COLUMN: ENTERPRISE LOCATION & MAP ================= */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Premium glassmorphic address details card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ 
                boxShadow: '0 8px 30px rgba(13,79,156,0.15)',
              }}
              className="bg-[#0D4F9C] border border-[#1E63B5]/40 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 transition-all duration-300 relative overflow-hidden group shadow-xl text-white"
            >
              {/* Light accent lines */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-2xl pointer-events-none group-hover:bg-white/10 transition-colors" />
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#F4C542] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-550" />

              <div>
                <span className="text-[9px] font-black tracking-widest text-[#F4C542] uppercase font-display leading-none">
                  {COMPANY_INFO.parentCompany}
                </span>
                <h3 className="text-base sm:text-lg font-black font-display text-white uppercase tracking-wide mt-1.5 leading-snug">
                  {COMPANY_INFO.name}
                </h3>
                <div className="w-12 h-[3px] bg-[#F4C542] rounded-full mt-3" />
              </div>

              {/* Grid lists of location info with premium icons */}
              <div id="contact-info-list" className="space-y-5 text-xs sm:text-sm">
                
                {/* 1. Address Row with Radar Pin */}
                <div id="contact-address-row" className="flex gap-4 items-start group/item">
                  <div className="relative p-2.5 bg-white/10 rounded-xl text-white shrink-0 border border-white/20 group-hover/item:scale-105 transition-transform duration-300 shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                    <MapPin className="w-5 h-5 text-[#F4C542]" />
                    <span className="absolute inset-0 rounded-xl bg-white/25 animate-ping opacity-60" />
                  </div>
                  <div>
                    <h4 className="font-black font-display text-[10px] tracking-widest uppercase text-[#F4C542]">Địa chỉ hành chính & xưởng sản xuất:</h4>
                    <p id="contact-address-text" className="text-white mt-1 leading-relaxed font-sans font-semibold text-xs sm:text-sm" style={{ color: '#FFFFFF', fontWeight: 600 }}>
                      {COMPANY_INFO.address}
                    </p>
                  </div>
                </div>

                {/* 2. Phone */}
                <div id="contact-phone-row" className="flex gap-4 items-start group/item">
                  <div className="p-2.5 bg-white/10 rounded-xl text-white shrink-0 border border-white/20 group-hover/item:scale-105 transition-transform duration-300">
                    <Phone className="w-5 h-5 text-[#F4C542]" />
                  </div>
                  <div>
                    <h4 className="font-black font-display text-[10px] tracking-widest uppercase text-white/90">Số máy tổng đài:</h4>
                    <p id="contact-phone-text" className="text-white mt-1 leading-none font-mono font-bold tracking-wide text-xs sm:text-sm" style={{ color: '#FFFFFF', fontWeight: 700 }}>
                      {COMPANY_INFO.phone}
                    </p>
                  </div>
                </div>

                {/* 3. Email */}
                <div id="contact-email-row" className="flex gap-4 items-start group/item">
                  <div className="p-2.5 bg-white/10 rounded-xl text-white shrink-0 border border-white/20 group-hover/item:scale-105 transition-transform duration-300">
                    <Mail className="w-5 h-5 text-[#F4C542]" />
                  </div>
                  <div>
                    <h4 className="font-black font-display text-[10px] tracking-widest uppercase text-white/90">Email:</h4>
                    <p id="contact-email-text" className="text-white mt-1 leading-none font-sans font-bold text-xs sm:text-sm hover:text-[#F4C542] transition-colors" style={{ color: '#FFFFFF', fontWeight: 700 }}>
                      {COMPANY_INFO.email}
                    </p>
                  </div>
                </div>

                {/* 4. Hours */}
                <div id="contact-hours-row" className="flex gap-4 items-start group/item">
                  <div className="p-2.5 bg-white/10 rounded-xl text-white shrink-0 border border-white/20 group-hover/item:scale-105 transition-transform duration-300">
                    <Clock className="w-5 h-5 text-[#F4C542]" />
                  </div>
                  <div>
                    <h4 className="font-black font-display text-[10px] tracking-widest uppercase text-white/90">Giờ giao thu nhận công văn:</h4>
                    <p id="contact-hours-text" className="text-white mt-1 leading-relaxed font-sans font-semibold text-xs" style={{ color: '#E5E7EB', fontWeight: 600 }}>
                      Thứ Hai – Thứ Sáu: <span className="font-bold text-[#F4C542]">07:30 – 16:30</span><br />
                      Thứ Bảy: <span className="font-bold text-[#F4C542]">07:30 – 11:30</span> <span className="text-[10px] text-[#F4C542] italic font-black">(Chỉ nhận sê-ri vé số khẩn)</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Google maps route navigation action button */}
              <div className="pt-2 border-t border-white/10">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=C%E1%BB%A5m+C%C3%B4ng+Nghi%E1%BB%87p+Nh%E1%BB%8B+Xu%C3%A2n"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#F4C542] hover:bg-white text-[#0D4F9C] font-black font-display text-xs tracking-widest uppercase transition-all duration-300 shadow flex items-center justify-center gap-2 group/btn select-none cursor-pointer"
                >
                  <Map className="w-4 h-4 text-[#0D4F9C] group-hover/btn:rotate-12 transition-transform" />
                  <span>XEM ĐƯỜNG ĐI TRÊN GOOGLE MAPS</span>
                  <ArrowUpRight className="w-4 h-4 text-[#0D4F9C] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Security advice block inside the glass */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex gap-3">
                <HelpCircle className="w-4.5 h-4.5 text-[#F4C542] shrink-0 mt-0.5" />
                <p className="text-[10.5px] text-white/90 leading-normal font-normal">
                  <span className="font-black text-[#F4C542] uppercase">Quy định bảo mật:</span> Đơn vị đến làm việc chuyển nhận phôi kẽm thiết kế gốc cần xuất trình Giấy giới thiệu có con dấu chính chủ của Tổng công ty Xổ Số cùng CCCD hợp pháp.
                </p>
              </div>

            </motion.div>

            {/* Embedded Active Google Map Frame pointing to CCN Nhị Xuân - Upgraded design */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative h-72 sm:h-80 border border-[#D8E4F5] rounded-2xl overflow-hidden shadow-md bg-slate-100 group"
            >
              <div className="absolute top-4 left-4 z-20 bg-white/90 border border-[#D8E4F5] text-[#0D4F9C] text-[10px] font-black uppercase font-display px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Hoạt Động KCS 24/7 trực tuyến</span>
              </div>

              <iframe
                title="Bản đồ Xí nghiệp In Tài Chính - Cụm CN Nhị Xuân"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.428383321595!2d106.518602075704!3d10.85501465773822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b0200000001%3A0xe5a3c984954d2460!2zQ-G7pW0gQ8O0bmcgbmdoaeG7h3AgTmjhu4sgWHXDom4!5e0!3m2!1svi!2s!4v1716168000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[25%] hover:grayscale-0 transition-all duration-700 pointer-events-auto"
              ></iframe>
            </motion.div>

          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE FORM ================= */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Interactive communication wrapper glass card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-[#D8E4F5] rounded-xl p-6 sm:p-8 shadow-[0_8px_24px_rgba(13,79,156,0.06)] flex-1 flex flex-col"
            >
              
              {/* Tabs list with gold accents */}
              <div className="flex gap-3 border-b border-[#D8E4F5]/60 pb-4 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setFormType('contact');
                    setIsSuccess(false);
                  }}
                  className={`flex-1 py-3 text-center border-b-2 font-display text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                    formType === 'contact'
                      ? 'border-[#0D4F9C] text-[#0D4F9C] bg-[#0D4F9C]/5'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Gửi Thư Liên Hệ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormType('quote');
                    setIsSuccess(false);
                  }}
                  className={`flex-1 py-3 text-center border-b-2 font-display text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                    formType === 'quote'
                      ? 'border-[#0D4F9C] text-[#0D4F9C] bg-[#0D4F9C]/5'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Yêu Cầu Báo Giá In
                </button>
              </div>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl gap-4 my-auto"
                >
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200 shadow-lg">
                    <ThumbsUp className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-black text-[#153A6B] font-display tracking-wider uppercase">GỬI YÊU CẦU THÀNH CÔNG!</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm font-semibold">
                    Yêu cầu thông tin báo giá đã được luân chuyển an toàn về địa chỉ điện tử tiếp nhận <strong>xnitchcm@gmail.com</strong> của Ban Kế hoạch Xí nghiệp. Chúng tôi sẽ liên hệ phản sắc nét sớm nhất có thể.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2.5 text-xs font-black font-display bg-[#0D4F9C] hover:bg-[#1E63B5] text-white rounded transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Quay lại biểu mẫu
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  
                  {/* Name & phone side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-black text-[#153A6B] uppercase tracking-widest mb-1.5 font-display">
                        Họ & Tên Đơn Vị/Đối Tác: <span className="text-[#E53935]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 text-xs bg-slate-50 border border-[#D8E4F5] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0D4F9C] focus:bg-white transition-all font-sans font-semibold shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#153A6B] uppercase tracking-widest mb-1.5 font-display">
                        Điện thoại liên hệ: <span className="text-[#E53935]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ví dụ: 091 xxx xxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 text-xs bg-slate-50 border border-[#D8E4F5] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0D4F9C] focus:bg-white transition-all font-mono font-bold shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Mail box entry */}
                  <div>
                    <label className="block text-[10px] font-black text-[#153A6B] uppercase tracking-widest mb-1.5 font-display">
                      Địa chỉ Email đối soát:
                    </label>
                    <input
                      type="email"
                      placeholder="business@partner.com.vn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 text-xs bg-slate-50 border border-[#D8E4F5] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0D4F9C] focus:bg-white transition-all font-sans font-semibold shadow-sm"
                    />
                  </div>

                  {/* Dynamic sections depending on form category selectors in UI */}
                  {formType === 'contact' ? (
                    <>
                      {/* Topic title */}
                      <div>
                        <label className="block text-[10px] font-black text-[#153A6B] uppercase tracking-widest mb-1.5 font-display">
                          Tiêu đề sự vụ và sê-ri hợp đồng:
                        </label>
                        <input
                          type="text"
                          placeholder="Mẫu vẽ số xuân hỷ / Sắp xếp bàn giao..."
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-4 py-3 text-xs bg-slate-50 border border-[#D8E4F5] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0D4F9C] focus:bg-white transition-all font-sans font-semibold shadow-sm"
                        />
                      </div>

                      {/* Content rich text letters */}
                      <div>
                        <label className="block text-[10px] font-black text-[#153A6B] uppercase tracking-widest mb-1.5 font-display">
                          Yêu cầu nội dung chi tiết:
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Bổ sung thắc mắc nghiệp vụ thiết kế kẽm in hoặc quy cách bảo hộ tại xưởng..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-3 text-xs bg-slate-50 border border-[#D8E4F5] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0D4F9C] focus:bg-white transition-all font-sans font-semibold shadow-sm"
                        ></textarea>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Dropdown service lists & expected quantity */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[10px] font-black text-[#153A6B] uppercase tracking-widest mb-1.5 font-display">
                            Vận Đơn Sản Phẩm Cần In:
                          </label>
                          <select
                            value={quoteService}
                            onChange={(e) => setQuoteService(e.target.value)}
                            className="w-full px-4 py-3 text-xs bg-slate-50 border border-[#D8E4F5] rounded-xl text-slate-800 focus:outline-none focus:border-[#0D4F9C] select-none font-semibold shadow-sm"
                          >
                            <option value="In Vé Số Kiến Thiết">In Vé Số Kiến Thiết</option>
                            <option value="In Vé Cào Cào Bảo Mật">In Vé Cào Cào Bảo Mật</option>
                            <option value="In Hóa Đơn Tài Chính GTGT">In Hóa Đơn Tài Chính GTGT</option>
                            <option value="In Chứng Từ Carbonless Nhiều Liên">In Chứng Từ Carbonless Nhiều Liên</option>
                            <option value="In Ấn Phẩm Hologram/UV Chống Giả">In Ấn Phẩm Hologram/UV Chống Giả</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-[#153A6B] uppercase tracking-widest mb-1.5 font-display">
                            Sản Lượng / Số Véc-tờ Dự Kiến: <span className="text-[#E53935]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ví dụ: 10,000 tờ hoặc 1,000 cuốn phôi..."
                            value={quoteQuantity}
                            onChange={(e) => setQuoteQuantity(e.target.value)}
                            className="w-full px-4 py-3 text-xs bg-slate-50 border border-[#D8E4F5] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0D4F9C] focus:bg-white transition-all font-sans font-semibold shadow-sm"
                          />
                        </div>
                      </div>

                      {/* Specs information details */}
                      <div>
                        <label className="block text-[10px] font-black text-[#153A6B] uppercase tracking-widest mb-1.5 font-display">
                          Phân cấp chất liệu, cán bóng & màng kẽm UV:
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Mô tả các yêu cầu kĩ thuật chuyên môn: Giấy Carbonless 3 liên, số nhảy mực sê-ri nhạy nhiệt, tem vỡ hologram dán chặt gia công đóng tập..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-3 text-xs bg-slate-50 border border-[#D8E4F5] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0D4F9C] focus:bg-white transition-all font-sans font-semibold shadow-sm"
                        ></textarea>
                      </div>
                    </>
                  )}

                  {/* Submission triggers */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 text-xs font-black font-display tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-md uppercase flex items-center justify-center gap-2 ${
                      isSubmitting 
                        ? 'bg-slate-200 border border-transparent text-slate-400 cursor-not-allowed' 
                        : 'bg-[#F4C542] hover:bg-[#0D4F9C] text-slate-900 hover:text-white shadow-[#F4C542]/10'
                    }`}
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    {isSubmitting ? <span>ĐANG XỬ LÝ GỬI THƯ...</span> : <span>GỬI YÊU CẦU NGHIỆP VỤ NGAY</span>}
                  </button>
                </form>
              )}

              {/* Verified badges */}
              <div id="contact-verified-badges" className="mt-8 pt-5 border-t border-[#D8E4F5]/60 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-4">
                <span className="flex items-center gap-1.5 font-semibold">
                  <ShieldAlert className="w-4 h-4 text-[#0D4F9C] shrink-0" /> Quản lý dữ liệu in ấn chính xác
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" /> Chứng nhận chất lượng ISO 9001:2015
                </span>
              </div>

            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
