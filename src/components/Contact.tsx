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
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      
      {/* High-end decorative background overlays and light grids */}
      <span className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#03091e] to-slate-950 pointer-events-none" />
      
      {/* Dynamic blurred color nodes matching navy blue + gold gold theme */}
      <span className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <span className="absolute bottom-1/4 left-0 w-[350px] h-[350px] bg-brand-gold/10 rounded-full blur-[125px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* SECTION HEADER BLOCK */}
        <div className="text-center flex flex-col items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3.5 py-1 bg-white/5 border border-white/10 rounded-full text-brand-gold text-[10px] uppercase font-black tracking-widest mb-4"
          >
            <Globe className="w-3.5 h-3.5 text-brand-gold animate-spin-slow" />
            <span>Kênh tiếp nhận hỗ trợ đại lý & doanh nghiệp toàn quốc</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-4.5xl font-black font-display text-white tracking-tight leading-tight uppercase"
          >
            LIÊN HỆ & QUY TRÌNH BÁO GIÁ
          </motion.h2>
          
          <div className="w-16 h-1.5 bg-gradient-to-r from-brand-gold to-yellow-500 rounded-full mt-4 mb-4" />
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 font-sans text-xs sm:text-sm max-w-2xl text-center leading-relaxed"
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
                boxShadow: '0 0 35px rgba(220,169,42,0.12)',
              }}
              className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 transition-all duration-300 relative overflow-hidden group shadow-xl"
            >
              {/* Light accent lines */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-2xl pointer-events-none group-hover:bg-brand-gold/10 transition-colors" />
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-550" />

              <div>
                <span className="text-[9px] font-black tracking-widest text-[#60a5fa] uppercase font-display leading-none">
                  {COMPANY_INFO.parentCompany}
                </span>
                <h3 className="text-base sm:text-lg font-black font-display text-white uppercase tracking-wide mt-1.5 leading-snug">
                  {COMPANY_INFO.name}
                </h3>
                <div className="w-12 h-[3px] bg-brand-gold rounded-full mt-3" />
              </div>

              {/* Grid lists of location info with premium icons */}
              <div className="space-y-5 text-xs sm:text-sm">
                
                {/* 1. Address Row with Radar Pin */}
                <div className="flex gap-4 items-start group/item">
                  <div className="relative p-2.5 bg-brand-gold/10 rounded-xl text-brand-gold shrink-0 border border-brand-gold/20 group-hover/item:scale-105 transition-transform duration-300 shadow-[0_0_10px_rgba(220,169,42,0.1)]">
                    <MapPin className="w-5 h-5" />
                    <span className="absolute inset-0 rounded-xl bg-brand-gold/25 animate-ping opacity-60" />
                  </div>
                  <div>
                    <h4 className="font-extrabold font-display text-[10px] tracking-widest uppercase text-brand-gold">Địa chỉ hành chính & xưởng sản xuất:</h4>
                    <p className="text-slate-250 mt-1 leading-relaxed font-sans font-light">
                      {COMPANY_INFO.address}
                    </p>
                  </div>
                </div>

                {/* 2. Phone */}
                <div className="flex gap-4 items-start group/item">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 shrink-0 border border-blue-500/20 group-hover/item:scale-105 transition-transform duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold font-display text-[10px] tracking-widest uppercase text-blue-400">Số máy tổng đài:</h4>
                    <p className="text-slate-200 mt-1 leading-none font-mono font-medium tracking-wide">
                      {COMPANY_INFO.phone}
                    </p>
                  </div>
                </div>

                {/* 3. Email */}
                <div className="flex gap-4 items-start group/item">
                  <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 shrink-0 border border-purple-500/20 group-hover/item:scale-105 transition-transform duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold font-display text-[10px] tracking-widest uppercase text-purple-400">Email giao thiệp sê-ri:</h4>
                    <p className="text-slate-200 mt-1 leading-none font-sans font-medium hover:text-brand-gold transition-colors">
                      {COMPANY_INFO.email}
                    </p>
                  </div>
                </div>

                {/* 4. Hours */}
                <div className="flex gap-4 items-start group/item">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0 border border-emerald-500/20 group-hover/item:scale-105 transition-transform duration-300">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold font-display text-[10px] tracking-widest uppercase text-emerald-450 text-emerald-400">Giờ giao thu nhận công văn:</h4>
                    <p className="text-slate-350 mt-1 leading-relaxed font-sans font-light text-xs">
                      Thứ Hai – Thứ Sáu: <span className="font-medium text-slate-200">07:30 – 16:30</span><br />
                      Thứ Bảy: <span className="font-medium text-slate-200">07:30 – 11:30</span> <span className="text-[10px] text-brand-gold italic">(Chỉ nhận sê-ri vé số khẩn)</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Google maps route navigation action button */}
              <div className="pt-2 border-t border-white/5">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=C%E1%BB%A5m+C%C3%B4ng+Nghi%E1%BB%87p+Nh%E1%BB%8B+Xu%C3%A2n"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-gold to-yellow-500 hover:from-yellow-500 hover:to-brand-gold text-slate-950 font-black font-display text-xs tracking-widest uppercase transition-all duration-300 shadow shadow-brand-gold/15 flex items-center justify-center gap-2 group/btn select-none cursor-pointer"
                >
                  <Map className="w-4 h-4 text-slate-950 group-hover/btn:rotate-12 transition-transform" />
                  <span>XEM ĐƯỜNG ĐI TRÊN GOOGLE MAPS</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-950 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Security advice block inside the glass */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex gap-3">
                <HelpCircle className="w-4.5 h-4.5 text-brand-gold shrink-0 mt-0.5" />
                <p className="text-[10.5px] text-slate-400 leading-normal font-light">
                  <span className="font-bold text-slate-300 uppercase">Quy định bảo mật:</span> Đơn vị đến làm việc chuyển nhận phôi kẽm thiết kế gốc cần xuất trình Giấy giới thiệu có con dấu chính chủ của Tổng công ty Xổ Số cùng CCCD hợp pháp.
                </p>
              </div>

            </motion.div>

            {/* Embedded Active Google Map Frame pointing to CCN Nhị Xuân - Upgraded design */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative h-72 sm:h-80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-slate-900 group"
            >
              <div className="absolute top-4 left-4 z-20 bg-slate-950/80 border border-white/10 text-brand-gold text-[9px] font-black uppercase font-display px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
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
                className="w-full h-full grayscale contrast-125 brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-700 pointer-events-auto"
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
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl flex-1 flex flex-col"
            >
              
              {/* Tabs list with gold accents */}
              <div className="flex gap-3 border-b border-white/5 pb-4 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setFormType('contact');
                    setIsSuccess(false);
                  }}
                  className={`flex-1 py-3 text-center border-b-2 font-display text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                    formType === 'contact'
                      ? 'border-brand-gold text-white bg-white/5'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
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
                      ? 'border-brand-gold text-white bg-white/5'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                  }`}
                >
                  Yêu Cầu Báo Giá In
                </button>
              </div>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-emerald-500/10 border border-emerald-500/25 rounded-2xl gap-4 my-auto"
                >
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-400/30 shadow-lg">
                    <ThumbsUp className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-black text-white font-display tracking-wider uppercase">GỬI YÊU CẦU THÀNH CÔNG!</h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                    Yêu cầu thông tin báo giá đã được luân chuyển an toàn về Ban Kế hoạch Kỹ thuật của Xí nghiệp. 
                    Chúng tôi sẽ điện thoại xác thực mã số sê-ri báo giá sớm nhất.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2.5 text-xs font-black font-display bg-brand-gold hover:bg-yellow-500 text-slate-950 rounded transition-colors uppercase tracking-wider"
                  >
                    Quay lại biểu mẫu
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  
                  {/* Name & phone side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-black text-slate-350 uppercase tracking-widest mb-1.5 font-display">
                        Họ & Tên Đơn Vị/Đối Tác: <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 text-xs bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-550 focus:outline-none focus:border-brand-gold focus:bg-slate-950 transition-all font-sans font-light"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-350 uppercase tracking-widest mb-1.5 font-display">
                        Điện thoại liên lỷ: <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ví dụ: 091 xxx xxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 text-xs bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-550 focus:outline-none focus:border-brand-gold focus:bg-slate-950 transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Mail box entry */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-350 uppercase tracking-widest mb-1.5 font-display">
                      Địa chỉ Email đối soát:
                    </label>
                    <input
                      type="email"
                      placeholder="business@partner.com.vn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 text-xs bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-550 focus:outline-none focus:border-brand-gold focus:bg-slate-950 transition-all font-sans font-light"
                    />
                  </div>

                  {/* Dynamic sections depending on form category selectors in UI */}
                  {formType === 'contact' ? (
                    <>
                      {/* Topic title */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-350 uppercase tracking-widest mb-1.5 font-display">
                          Tiêu đề sự vụ và sê-ri hợp đồng:
                        </label>
                        <input
                          type="text"
                          placeholder="Mẫu vẽ số xuân hỷ / Sắp xếp bàn giao..."
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-4 py-3 text-xs bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-550 focus:outline-none focus:border-brand-gold focus:bg-slate-950 transition-all font-sans font-light"
                        />
                      </div>

                      {/* Content rich text letters */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-350 uppercase tracking-widest mb-1.5 font-display">
                          Yêu cầu nội dung chi tiết:
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Bổ sung thắc mắc nghiệp vụ thiết kế kẽm in hoặc quy cách bảo hộ tại xưởng..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-3 text-xs bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-550 focus:outline-none focus:border-brand-gold focus:bg-slate-950 transition-all font-sans font-light"
                        ></textarea>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Dropdown service lists & expected quantity */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[10px] font-black text-slate-350 uppercase tracking-widest mb-1.5 font-display">
                            Vận Đơn Sản Phẩm Cần In:
                          </label>
                          <select
                            value={quoteService}
                            onChange={(e) => setQuoteService(e.target.value)}
                            className="w-full px-4 py-3 text-xs bg-slate-950 border border-white/10 rounded-xl text-slate-300 focus:outline-none focus:border-brand-gold select-none"
                          >
                            <option value="In Vé Số Kiến Thiết">In Vé Số Kiến Thiết</option>
                            <option value="In Vé Cào Cào Bảo Mật">In Vé Cào Cào Bảo Mật</option>
                            <option value="In Hóa Đơn Tài Chính GTGT">In Hóa Đơn Tài Chính GTGT</option>
                            <option value="In Chứng Từ Carbonless Nhiều Liên">In Chứng Từ Carbonless Nhiều Liên</option>
                            <option value="In Ấn Phẩm Hologram/UV Chống Giả">In Ấn Phẩm Hologram/UV Chống Giả</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-350 uppercase tracking-widest mb-1.5 font-display">
                            Sản Lượng / Số Véc-tờ Dự Kiến: <span className="text-brand-gold">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ví dụ: 10,000 tờ hoặc 1,000 cuốn phôi..."
                            value={quoteQuantity}
                            onChange={(e) => setQuoteQuantity(e.target.value)}
                            className="w-full px-4 py-3 text-xs bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-550 focus:outline-none focus:border-brand-gold focus:bg-slate-950 transition-all font-sans font-light"
                          />
                        </div>
                      </div>

                      {/* Specs information details */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-350 uppercase tracking-widest mb-1.5 font-display">
                          Phân cấp chất liệu, cán bóng & màng kẽm UV:
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Mô tả các yêu cầu kĩ thuật chuyên môn: Giấy Carbonless 3 liên, số nhảy mực sê-ri nhạy nhiệt, tem vỡ hologram dán chặt gia công đóng tập..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-3 text-xs bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-550 focus:outline-none focus:border-brand-gold focus:bg-slate-950 transition-all font-sans font-light"
                        ></textarea>
                      </div>
                    </>
                  )}

                  {/* Submission triggers */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 text-xs font-black font-display tracking-widest text-slate-950 rounded-xl transition-all duration-300 cursor-pointer shadow-lg uppercase flex items-center justify-center gap-2 ${
                      isSubmitting 
                        ? 'bg-slate-600 border border-transparent text-slate-400 cursor-not-allowed' 
                        : 'bg-brand-gold hover:bg-yellow-500 shadow-brand-gold/10'
                    }`}
                  >
                    <Send className="w-4 h-4 text-slate-950 shrink-0" />
                    {isSubmitting ? <span>ĐANG XỬ LÝ GỬI THƯ...</span> : <span>GỬI YÊU CẦU NGHIỆP VỤ NGAY</span>}
                  </button>
                </form>
              )}

              {/* Verified badges */}
              <div className="mt-8 pt-5 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-slate-450 gap-4">
                <span className="flex items-center gap-1.5 font-light">
                  <ShieldAlert className="w-4 h-4 text-brand-gold shrink-0" /> Bảo mật thông tin dòng vé tuyệt đối
                </span>
                <span className="flex items-center gap-1.5 font-light">
                  <Award className="w-4 h-4 text-[#60a5fa] shrink-0" /> Chứng nhận bảo mật ISO 27001
                </span>
              </div>

            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
