import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  QrCode, 
  Database, 
  CheckCircle, 
  RefreshCw, 
  Printer, 
  Layers, 
  ShieldCheck,
  Check
} from 'lucide-react';

export default function Technology() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      id: 1,
      icon: <Cpu className="w-6 h-6 text-red-600" />,
      title: 'In dữ liệu biến đổi trên từng tờ vé',
      desc: 'Ứng dụng công nghệ in phun kỹ thuật số tốc độ cao, cho phép hiển thị số sê-ri, số súp và ký hiệu dự thưởng thay đổi liên tục một cách sắc nét, chính xác tuyệt đối.',
      badge: 'Dữ liệu biến thiên'
    },
    {
      id: 2,
      icon: <QrCode className="w-6 h-6 text-[#0A3273]" />,
      title: 'Tích hợp QR Code định danh riêng biệt',
      desc: 'Mỗi tờ vé số hoặc chứng từ tài chính được đồng bộ một mã QR Code duy nhất định danh sản phẩm, tối ưu khả năng bảo mật thông tin và nâng cao độ tin cậy.',
      badge: 'QR Code độc bản'
    },
    {
      id: 3,
      icon: <Database className="w-6 h-6 text-[#0A3273]" />,
      title: 'Quản lý và kiểm tra thông tin nhanh chóng',
      desc: 'Hệ thống cơ sở dữ liệu khép kín lưu trữ thông tin phát hành giúp xí nghiệp và các cơ quan chủ quản quản lý, đối chiếu dữ liệu một cách an toàn và tức thì.',
      badge: 'Quản lý thông suốt'
    },
    {
      id: 4,
      icon: <CheckCircle className="w-6 h-6 text-red-600" />,
      title: 'Hỗ trợ dò kết quả và xác thực dữ liệu',
      desc: 'Tích hợp giải pháp quét thông tin thông minh hỗ trợ khách hàng dò kết quả nhanh chóng, đồng thời giúp đại lý xác thực vé thật - giả chính xác thông qua hệ thống QR Code.',
      badge: 'Xác thực nhanh'
    },
    {
      id: 5,
      icon: <RefreshCw className="w-6 h-6 text-emerald-600" />,
      title: 'Đảm bảo tính đồng bộ sản xuất',
      desc: 'Mã số biến đổi và QR Code được in đồng bộ hóa trực tiếp với phôi in offset, loại bỏ hoàn toàn nguy cơ trùng lặp dữ liệu hoặc sai số trong suốt quy trình in sản lượng lớn.',
      badge: 'Đồng bộ 100%'
    }
  ];

  return (
    <section id="technology" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#051B3X] text-white relative overflow-hidden">
      {/* Decorative gradient glowing orb */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#0A3273]/35 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading Badge & Title */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 font-display text-xs font-black uppercase tracking-wider mb-4 shadow-inner"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            Công Nghệ In Hiện Đại
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight uppercase leading-tight"
          >
            🔴 CÔNG NGHỆ IN KỸ THUẬT SỐ BIẾN ĐỔI DỮ LIỆU
          </motion.h2>
          
          <div className="w-24 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 font-sans text-sm sm:text-base mt-6 leading-relaxed max-w-3xl mx-auto font-light"
          >
            Xí Nghiệp In Tài Chính TP. Hồ Chí Minh ứng dụng hệ thống in kỹ thuật số biến đổi dữ liệu kết hợp công nghệ QR Code nhằm phục vụ sản xuất vé số kiến thiết và các ấn phẩm ngành tài chính.
          </motion.p>
        </div>

        {/* 5 Core App features displayed in cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-16">
          {features.map((feat, index) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group bg-white border border-slate-200 p-6 sm:p-7 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/20 hover:border-red-500/30 text-slate-900 cursor-default relative overflow-hidden"
              style={{
                transform: hoveredCard === index ? 'translateY(-6px)' : 'translateY(0px)'
              }}
            >
              {/* Card top banner accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0A3273] group-hover:bg-red-600 transition-colors"></div>
              
              <div>
                {/* Icon & Badge row */}
                <div className="flex justify-between items-center mb-6">
                  <div className="p-3 rounded-xl bg-slate-100 group-hover:bg-red-50 text-slate-800 group-hover:text-red-700 transition-colors w-min shadow-sm">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-extrabold tracking-widest font-display text-slate-400 group-hover:text-[#0A3273] uppercase bg-slate-50 border border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100/50 px-2.5 py-1 rounded-md transition-colors">
                    {feat.badge}
                  </span>
                </div>

                {/* Title */}
                <div className="flex gap-2.5 mb-3">
                  <span className="text-[#0A3273] font-black shrink-0 mt-0.5">✔</span>
                  <h3 className="text-sm sm:text-base font-bold text-[#0A3273] leading-snug group-hover:text-red-600 transition-colors">
                    {feat.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-slate-600 font-sans text-xs sm:text-[13px] leading-relaxed font-light">
                  {feat.desc}
                </p>
              </div>

              {/* Decorative accent graphic */}
              <div className="mt-6 flex justify-end">
                <span className="text-[10px] font-black tracking-widest text-[#000]/10 group-hover:text-[#0A3273]/15 uppercase font-mono transition-colors">
                  SECURE_DATA_T0{feat.id}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Secondary CTA/Fleet highlights integrated inside the bento layout as the 6th element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            className="bg-gradient-to-br from-[#0A3273] to-[#051B3X] border border-white/10 p-6 sm:p-7 rounded-2xl flex flex-col justify-between text-white md:col-span-2 lg:col-span-1 shadow-2xl relative overflow-hidden group hover:border-red-600/30"
          >
            {/* Subtle background circuit pattern decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-2xl rounded-full pointer-events-none group-hover:bg-red-600/5 transition-colors"></div>
            
            <div>
              <div className="flex items-center gap-3 mb-5 border-b border-white/10 pb-4">
                <div className="p-3 rounded-xl bg-white/5 text-brand-gold">
                  <Printer className="w-6 h-6 text-[#DCA92A]" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-widest text-[#DCA92A] uppercase font-display font-bold">DâY CHUYỀN OFFSET PHỤ TRỢ</h4>
                  <p className="text-[10px] text-slate-400">Đồng bộ giải pháp chất lượng cao</p>
                </div>
              </div>
              
              <h3 className="text-sm sm:text-base font-bold text-white mb-3">
                Tính năng sản xuất nâng cao
              </h3>
              
              <ul className="space-y-2.5 text-xs text-slate-300 font-light font-sans mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  Quản lý mã vạch nhảy tự động
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  Mực bảo an phản quang chống sao chép
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  Không chồng hạt nhòe sọc lỗi
                </li>
              </ul>
            </div>

            <div className="text-[11px] font-bold text-brand-gold bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-center select-none group-hover:border-red-500/20 transition-colors">
              XNITC PRODUCTION STANDARDS
            </div>
          </motion.div>
        </div>

        {/* Closing Paragraph Box (Offset system integration) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl transition-all shadow-sm text-slate-900 border-l-[6px] border-l-red-600"
        >
          <div className="flex-1 flex gap-4 items-start">
            <div className="p-3 bg-red-50 rounded-xl text-red-600 shrink-0 mt-1">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0A3273] uppercase tracking-wide font-display mb-1.5">HỆ THỐNG MÁY IN OFFSET KOMORI & MITSUBISHI 4 MÀU - 5 MÀU</h4>
              <p className="text-slate-600 font-sans text-xs sm:text-sm leading-relaxed font-light">
                Đơn vị đồng thời vận hành hệ thống máy in offset Komori và Mitsubishi 4 màu – 5 màu nhằm đáp ứng yêu cầu chất lượng và sản lượng in ổn định trong mọi điều kiện phát hành số lượng cực lớn.
              </p>
            </div>
          </div>
          
          <div className="bg-slate-50 border border-slate-100 px-5 py-3 rounded-xl shrink-0 flex items-center gap-2 shadow-inner">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-slate-700 text-xs font-bold font-sans">Bảo chứng màu sắc & độ bền</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
