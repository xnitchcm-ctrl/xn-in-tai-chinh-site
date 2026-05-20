import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, Send, ThumbsUp, HelpCircle, ShieldAlert, Award } from 'lucide-react';
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
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center flex flex-col items-center gap-2 mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-gold uppercase font-display">
            LIÊN HỆ & BÁO GIÁ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-brand-blue tracking-tight leading-tight uppercase">
            HỢP TÁC VỮNG BỀN – Ý KIẾN PHẢN HỒI
          </h2>
          <div className="w-20 h-1 bg-brand-gold rounded-full mt-2"></div>
          <p className="text-slate-500 font-sans text-xs sm:text-sm max-w-xl mt-2">
            Mọi thắc mắc của cơ quan phát hành vé số, tổ chức ngân hàng tài chính sẽ được bộ phận nghiệp vụ tiếp nhận và phản hồi tối đa trong vòng 24 giờ làm việc.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Corporate Logistics Info Block (Left 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Direct details info list */}
            <div className="bg-gradient-to-br from-brand-blue to-brand-blue-dark text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
              
              <div>
                <p className="text-[10px] text-amber-300 font-black tracking-widest uppercase font-display">
                  {COMPANY_INFO.parentCompany}
                </p>
                <h3 className="text-lg sm:text-xl font-bold font-display uppercase tracking-wider mt-1.5 text-white">
                  {COMPANY_INFO.name}
                </h3>
                <div className="w-12 h-1 bg-brand-gold rounded-full mt-3"></div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Map pin */}
                <div className="flex gap-3.5 items-start">
                  <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold font-display text-xs tracking-wider uppercase text-amber-300">Địa chỉ xưởng:</h4>
                    <p className="text-slate-200 mt-1 leading-relaxed font-sans">{COMPANY_INFO.address}</p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex gap-3.5 items-start">
                  <Phone className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold font-display text-xs tracking-wider uppercase text-amber-300">Điện thoại bàn:</h4>
                    <p className="text-slate-200 mt-0.5 leading-none font-mono font-medium">{COMPANY_INFO.phone}</p>
                  </div>
                </div>

                {/* Mail address */}
                <div className="flex gap-3.5 items-start">
                  <Mail className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold font-display text-xs tracking-wider uppercase text-amber-300">Hòm thư điện tử:</h4>
                    <p className="text-slate-200 mt-0.5 leading-none font-sans font-medium">{COMPANY_INFO.email}</p>
                  </div>
                </div>

                {/* Office hours */}
                <div className="flex gap-3.5 items-start">
                  <Clock className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold font-display text-xs tracking-wider uppercase text-amber-300">Giờ thu nhận công văn:</h4>
                    <p className="text-slate-200 mt-1 leading-relaxed font-sans">
                      Thứ Hai – Thứ Sáu: 07:30 – 16:30<br />
                      Thứ Bảy: 07:30 – 11:30 (Chỉ tiếp nhận hồ sơ sê-ri khẩn)
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Policy Reminder */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-white/10 flex items-start gap-3 mt-2">
                <HelpCircle className="w-5 h-5 text-brand-gold shrink-0" />
                <p className="text-[11px] text-slate-300 leading-normal">
                  Lưu ý: Để phục vụ mục đích bảo mật, khách hàng khi đến làm việc trực tiếp về bản gốc thiết kế vé số vui lòng đem theo Giấy giới thiệu có mộc đỏ và Căn cước công dân khớp thông tin đăng ký.
                </p>
              </div>

            </div>

            {/* Embedded Active Google Map Frame pointing to CCN Nhị Xuân */}
            <div className="relative h-64 sm:h-72 border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-slate-300">
              <iframe
                title="Bản đồ Xí nghiệp In Tài Chính - Cụm CN Nhị Xuân"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.428383321595!2d106.518602075704!3d10.85501465773822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b0200000001%3A0xe5a3c984954d2460!2zQ-G7pW0gQ8O0bmcgbmdoaeG7h3AgTmjhu4sgWHXDom4!5e0!3m2!1svi!2s!4v1716168000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-300"
              ></iframe>
            </div>

          </div>

          {/* Interactive communications feedback/quote form (Right 7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
            
            {/* Form category selection tabs */}
            <div className="flex gap-3 border-b border-slate-200 pb-4 mb-6">
              <button
                type="button"
                onClick={() => {
                  setFormType('contact');
                  setIsSuccess(false);
                }}
                className={`flex-1 py-3 text-center border-b-2 font-display text-xs font-black tracking-widest uppercase transition-all cursor-pointer ${
                  formType === 'contact'
                    ? 'border-brand-blue text-brand-blue bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-brand-blue hover:bg-zinc-50'
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
                className={`flex-1 py-3 text-center border-b-2 font-display text-xs font-black tracking-widest uppercase transition-all cursor-pointer ${
                  formType === 'quote'
                    ? 'border-brand-blue text-brand-blue bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-brand-blue hover:bg-zinc-50'
                }`}
              >
                Yêu Cầu Báo Giá In
              </button>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-emerald-50/70 border border-emerald-200 rounded-xl gap-4 my-auto"
              >
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <ThumbsUp className="w-8 h-8" />
                </div>
                <h4 className="text-base font-black text-emerald-950 font-display">GỬI YÊU CẦU THÀNH CÔNG!</h4>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-sm">
                  Yêu cầu liên hệ / nghiệp vụ báo giá của bạn đã được chuyển tới Ban Thư ký Kỹ thuật của Xí nghiệp In Tài Chính. Chúng tôi sẽ nhanh chóng rà soát thông tin để thiết lập cuộc gọi bàn bạc chi tiết.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="px-5 py-2 text-xs font-extrabold font-display bg-brand-blue hover:bg-brand-blue-dark text-white rounded transition-colors"
                >
                  Quay lại biểu mẫu
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                
                {/* Contact Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                      Họ và Tên Đối Tác / Đơn Vị: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                      Số điện thoại di động / nội bộ: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="091 xxx xxxx hoặc 028 xxx..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white"
                    />
                  </div>
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                    Địa chỉ thư điện tử (Email):
                  </label>
                  <input
                    type="email"
                    placeholder="partner@com.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white"
                  />
                </div>

                {/* Dynamic fields based on active tab type selection */}
                {formType === 'contact' ? (
                  <>
                    {/* Subject line */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                        Tiêu đề Liên hệ / Sự vụ:
                      </label>
                      <input
                        type="text"
                        placeholder="In vé số Tết / Thắc mắc nghiệp vụ hoa văn..."
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white"
                      />
                    </div>

                    {/* Content text */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                        Nội dung chi tiết:
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Viết nội dung thắc mắc hoặc phản ánh ý kiến về dịch vụ của chúng tôi ở đây..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white"
                      ></textarea>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Quotation inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                          Phân Loại Ấn Phẩm Cần In:
                        </label>
                        <select
                          value={quoteService}
                          onChange={(e) => setQuoteService(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white"
                        >
                          <option value="In Vé Số Kiến Thiết">In Vé Số Kiến Thiết</option>
                          <option value="In Vé Cào Cào Bảo Mật">In Vé Cào Cào Bảo Mật</option>
                          <option value="In Hóa Đơn Tài Chính GTGT">In Hóa Đơn Tài Chính GTGT</option>
                          <option value="In Chứng Từ Carbonless Nhiều Liên">In Chứng Từ Carbonless Nhiều Liên</option>
                          <option value="In Ấn Phẩm Hologram/UV Chống Giả">In Ấn Phẩm Hologram/UV Chống Giả</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                          Số Lượng Dự Kiến (Tờ/Cuốn): <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: 10,000 tờ hoặc 500 cuốn..."
                          value={quoteQuantity}
                          onChange={(e) => setQuoteQuantity(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Requirements specifications details */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                        Mô tả Quy cách / Khổ in / Loại giấy (nếu có):
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Hãy bổ sung quy cách mong muốn ví dụ khổ A5, Giấy carbonless 3 liên trắng-hồng-xanh, cán màng Hologram tem chống giả mộc rải rác..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white"
                      ></textarea>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 text-xs font-black font-display tracking-widest text-white rounded transition-all cursor-pointer shadow uppercase flex items-center justify-center gap-2 ${
                    isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-blue-dark'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? <span>ĐANG XỬ LÝ GỬI THƯ...</span> : <span>GỬI YÊU CẦU NGAY</span>}
                </button>
              </form>
            )}

            {/* Quick trust metrics row inside Contact */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-brand-gold shrink-0" /> Cam kết bảo mật dữ liệu khách hàng 100%
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-brand-blue shrink-0" /> Chứng nhận chuẩn ISO/IEC 27001
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
