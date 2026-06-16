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
      icon: <Cpu className="w-6 h-6 text-[#0D4F9C]" />,
      title: 'IN DỮ LIỆU BIẾN ĐỔI TRÊN TỪNG TỜ VÉ',
      desc: 'Ứng dụng công nghệ in kỹ thuật số biến đổi dữ liệu phục vụ in số dự thưởng, ký hiệu và các thông tin riêng biệt trên từng tờ vé.',
      badge: 'Công nghệ in biến đổi'
    },
    {
      id: 2,
      icon: <QrCode className="w-6 h-6 text-[#0D4F9C]" />,
      title: 'TÍCH HỢP QR CODE ĐỊNH DANH',
      desc: 'Mỗi tờ vé được tích hợp mã QR Code riêng biệt phục vụ kiểm tra, đối chiếu và xác thực thông tin trong quá trình sử dụng.',
      badge: 'QR Code định danh'
    },
    {
      id: 3,
      icon: <Database className="w-6 h-6 text-[#0D4F9C]" />,
      title: 'QUẢN LÝ DỮ LIỆU TẬP TRUNG',
      desc: 'Hệ thống hỗ trợ quản lý dữ liệu phát hành và truy xuất thông tin nhanh chóng, phục vụ công tác kiểm tra và đối chiếu khi cần thiết.',
      badge: 'Quản lý dữ liệu'
    },
    {
      id: 4,
      icon: <CheckCircle className="w-6 h-6 text-[#0D4F9C]" />,
      title: 'HỖ TRỢ DÒ KẾT QUẢ NHANH CHÓNG',
      desc: 'QR Code hỗ trợ người sử dụng tra cứu thông tin vé và đối chiếu kết quả dự thưởng thuận tiện.',
      badge: 'Xác thực thông tin'
    },
    {
      id: 5,
      icon: <RefreshCw className="w-6 h-6 text-emerald-600" />,
      title: 'ĐỒNG BỘ DỮ LIỆU SẢN XUẤT',
      desc: 'Thông tin dữ liệu được kiểm soát trong suốt quá trình sản xuất nhằm đảm bảo tính chính xác và đồng nhất.',
      badge: 'Kiểm soát chất lượng sản xuất'
    }
  ];

  return (
    <section id="technology" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 text-[#374151] relative overflow-hidden">
      {/* Decorative subtle gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading Badge & Title */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#0D4F9C] font-display text-xs font-black uppercase tracking-wider mb-4 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D4F9C] animate-pulse"></span>
            Công Nghệ In Hiện Đại
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl tracking-tight uppercase leading-tight text-[#0D4F9C]"
            style={{ fontWeight: 800 }}
          >
            CÔNG NGHỆ IN KỸ THUẬT SỐ BIẾN ĐỔI DỮ LIỆU
          </motion.h2>
          
          <div className="w-24 h-1 bg-[#0D4F9C] mx-auto mt-4 rounded-full"></div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#153A6B] font-sans text-sm sm:text-base mt-6 leading-relaxed max-w-3xl mx-auto font-normal"
          >
            Xí Nghiệp In Tài Chính TP. Hồ Chí Minh ứng dụng hệ thống in kỹ thuật số biến đổi dữ liệu kết hợp công nghệ QR Code nhằm phục vụ sản xuất các ấn phẩm vé số kiến thiết, vé số cào, chứng từ và các biểu mẫu ngành tài chính.
          </motion.p>
        </div>

        {/* 6 Grid items including 5 modern tech cards and 1 offset production bento */}
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
              className="group bg-white border border-slate-200 p-6 sm:p-7 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-[#0D4F9C]/30 text-[#374151] cursor-default relative overflow-hidden shadow-sm"
              style={{
                transform: hoveredCard === index ? 'translateY(-6px)' : 'translateY(0px)'
              }}
            >
              {/* Card top banner accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0D4F9C] group-hover:bg-red-655 transition-colors"></div>
              
              <div>
                {/* Icon & Badge row */}
                <div className="flex justify-between items-center mb-6">
                  <div className="p-3 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-800 group-hover:text-[#0D4F9C] transition-colors w-min shadow-sm">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-extrabold tracking-widest font-display text-slate-500 group-hover:text-[#0D4F9C] uppercase bg-amber-50 border border-amber-100/50 px-2.5 py-1 rounded-md transition-colors">
                    {feat.badge}
                  </span>
                </div>

                {/* Title */}
                <div className="flex gap-2.5 mb-3">
                  <span className="text-[#0D4F9C] font-black shrink-0 mt-0.5">✔</span>
                  <h3 className="text-sm sm:text-base font-bold text-[#0D4F9C] leading-snug group-hover:text-red-600 transition-colors">
                    {feat.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-slate-600 font-sans text-xs sm:text-[13px] leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </div>

              {/* Decorative accent graphic */}
              <div className="mt-6 flex justify-end">
                <span className="text-[10px] font-semibold tracking-widest text-slate-300 group-hover:text-[#0D4F9C]/20 uppercase font-mono transition-colors">
                  DATA_MGT_0{feat.id}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Card 6: Offset production bento */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            className="bg-gradient-to-br from-[#0D4F9C] via-[#1E63B5] to-[#2F7DD1] border border-[#2F7DD1]/15 p-6 sm:p-7 rounded-2xl flex flex-col justify-between text-white md:col-span-2 lg:col-span-1 shadow-xl relative overflow-hidden group hover:border-[#F4C542]/30"
          >
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-2xl rounded-full pointer-events-none"></div>
            
            <div>
              <div className="flex items-center gap-3 mb-5 border-b border-white/10 pb-4">
                <div className="p-3 rounded-xl bg-white/5 text-brand-gold">
                  <Printer className="w-6 h-6 text-[#F4C542]" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-widest text-[#F4C542] uppercase font-display font-bold">HỆ THỐNG IN OFFSET HIỆN ĐẠI</h4>
                  <p className="text-[10px] text-slate-250">Công nghệ sản xuất ổn định</p>
                </div>
              </div>
              
              <ul className="space-y-2.5 text-xs text-slate-200 font-light font-sans mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  Vận hành trên hệ thống máy in Komori
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  Máy in Mitsubishi 4 màu – 5 màu
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  Đáp ứng yêu cầu chất lượng và sản lượng ổn định
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  Phù hợp sản xuất vé số kiến thiết, vé số cào và các ấn phẩm ngành tài chính
                </li>
              </ul>
            </div>

            <button 
              onClick={() => {
                const servicesSec = document.getElementById('services');
                if (servicesSec) {
                  servicesSec.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-xs font-bold text-center w-full bg-red-650 hover:bg-red-700 text-white py-2.5 rounded-xl uppercase transition-colors cursor-pointer shadow-md"
            >
              TÌM HIỂU THÊM
            </button>
          </motion.div>
        </div>

        {/* III. Closing Paragraph Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-lg transition-all shadow-md text-slate-950 border-l-[6px] border-l-[#0D4F9C]"
        >
          <div className="flex-1 flex gap-4 items-start">
            <div className="p-3 bg-blue-50 rounded-xl text-[#0D4F9C] shrink-0 mt-1">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0D4F9C] uppercase tracking-wide font-display mb-1.5 flex items-center gap-2">
                <span>🔧</span> HỆ THỐNG MÁY IN OFFSET KOMORI & MITSUBISHI 4 MÀU – 5 MÀU
              </h4>
              <p className="text-[#374151] font-sans text-xs sm:text-sm leading-relaxed font-normal">
                Xí Nghiệp In Tài Chính TP. Hồ Chí Minh vận hành hệ thống máy in offset Komori và Mitsubishi 4 màu – 5 màu nhằm đáp ứng yêu cầu chất lượng và sản lượng đối với các sản phẩm vé số kiến thiết, vé số cào, chứng từ và các ấn phẩm ngành tài chính.
                <br /><br />
                Kết hợp cùng hệ thống in kỹ thuật số biến đổi dữ liệu, đơn vị có khả năng tích hợp QR Code định danh và quản lý dữ liệu trên từng sản phẩm.
              </p>
            </div>
          </div>
          
          <div className="bg-slate-50 border border-slate-100 px-5 py-3 rounded-xl shrink-0 flex items-center gap-2 shadow-inner">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-slate-700 text-xs font-bold font-sans">Kiểm soát chất lượng sản xuất</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

