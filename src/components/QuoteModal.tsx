import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, Ticket, Printer, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService: string;
}

export default function QuoteModal({ isOpen, onClose, preselectedService }: QuoteModalProps) {
  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [serviceType, setServiceType] = useState('In Vé Số Kiến Thiết');
  const [quantity, setQuantity] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync preselectedService whenever it changes
  useEffect(() => {
    if (preselectedService) {
      setServiceType(preselectedService);
    }
  }, [preselectedService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !serviceType) return;

    setIsSending(true);
    // Simulate server side post processing
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      
      // Clean up fields after success
      setFullName('');
      setEmail('');
      setPhone('');
      setCompanyName('');
      setQuantity('');
      setDeadline('');
      setNotes('');
    }, 1800);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal headers display */}
        <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark py-5 px-6 text-white flex justify-between items-center relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-brand-gold shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold tracking-widest text-amber-300">Biểu mẫu yêu cầu trực tuyến</p>
              <h3 className="text-base font-black font-display text-white uppercase tracking-wider leading-none mt-1">
                Yêu cầu tư vấn in ấn tài chính
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="w-8 h-8 rounded-full bg-black/15 hover:bg-brand-gold text-white hover:text-brand-blue flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content boxes */}
        <div className="p-6">
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-6 flex flex-col items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-xl"
            >
              <CheckCircle2 className="w-14 h-14 text-emerald-600 animate-pulse" />
              <h4 className="text-base font-black text-emerald-950 font-display uppercase tracking-wider">ĐĂNG KÝ THÔNG TIN THÀNH CÔNG</h4>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-sm">
                Chúng tôi đã tiếp nhận yêu cầu đăng ký tư vấn báo giá dịch vụ: <strong className="text-brand-blue">"{serviceType}"</strong>. Đội ngũ Kỹ thư Ký của Xí nghiệp In Tài Chính sẽ liên hệ hỗ trợ bạn thông qua số điện thoại sớm nhất!
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 mt-2 text-xs font-black font-display tracking-widest text-white rounded bg-emerald-700 hover:bg-emerald-800 transition-all cursor-pointer"
              >
                Đồng Ý & Quay Lại
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                Để phục vụ việc tính giá thành phẩm tối ưu cùng điều kiện kiểm soát chất lượng chính xác, vui lòng gửi các gợi ý nghiệp vụ ban đầu sau. Mọi dữ liệu cam kết được bảo mật hoàn toàn.
              </p>

              {/* Grid 1: Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                    Họ Tên Quý Khách / Đại Diện: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                    Số Điện Thoại Di Động: <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0901 234..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white pl-9"
                    />
                    <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Grid 2: Company/Unit and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                    Đơn Vị Công Tác / Công Ty Xổ Số Tỉnh:
                  </label>
                  <input
                    type="text"
                    placeholder="Công ty Xổ số Kiến thiết Tỉnh..."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                    Hòm thư điện tử (Email): <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="contact@xskttinh.vn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white pl-9"
                    />
                    <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Grid 3: Service Selection and Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                    Dịch Vụ Cần Đăng Ký In:
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white cursor-pointer"
                  >
                    <option value="IN VÉ SỐ TRUYỀN THỐNG & TỰ CHỌN">In Vé Số Truyền Thống / Tự Chọn</option>
                    <option value="IN ẤN BẢO MẬT CHẤT LƯỢNG CAO">In Ấn Phẩm Bảo Mật Chống Giả</option>
                    <option value="IN CHỨNG TỪ TÀI CHÍNH & HÓA ĐƠN">In Chứng Từ Carbonless Nhiều Liên</option>
                    <option value="GIA CÔNG THÀNH PHẨM SAU IN">Gia Công Sau In / Co Màng Bản Niêm Phong</option>
                    <option value="KIỂM SOÁT CHẤT LƯỢNG (KCS)">Yêu Cầu Giám Định Hệ Thống KCS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                    Số lượng dự thảo phát hành:
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 10,000 tờ / tuần hoặc 1,000 cuốn..."
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white"
                  />
                </div>
              </div>

              {/* Target finishing deadline date */}
              <div>
                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                  Hạn hoàn thiện sản phẩm mong muốn:
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={deadline}
                    min="2026-05-20"
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white pl-9"
                  />
                  <Calendar className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              {/* Detailed specs description notes */}
              <div>
                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1 font-display">
                  Yêu Cầu Kỹ Thuật Đặc Biệt (Loại mực phát quang UV, Tem dính, dập chìm sê-ri...):
                </label>
                <textarea
                  rows={3}
                  placeholder="Hãy ghi chú khổ in cụ thể, liên hóa đơn, yêu cầu bảo bọc màng co nhiệt..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded font-sans focus:outline-none focus:border-brand-blue focus:bg-white"
                ></textarea>
              </div>

              {/* Interactive buttons */}
              <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-brand-blue bg-neutral-100 duration-150 rounded cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-2.5 text-xs font-extrabold tracking-widest bg-brand-gold text-brand-blue hover:bg-yellow-400 hover:shadow shadow-md rounded transition-all cursor-pointer font-display uppercase flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  {isSending ? 'ĐANG GỬI...' : 'ĐĂNG KÝ NGAY'}
                </button>
              </div>

              {/* Security confirmation footer note */}
              <div className="flex items-center gap-2 mt-2 pt-2 text-[9px] text-zinc-400 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Mã hóa bảo mật TLSv1.3. Hồ sơ được lưu trữ nội bộ khép kín theo hệ thống quản lý chất lượng ISO 9001:2015.</span>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
