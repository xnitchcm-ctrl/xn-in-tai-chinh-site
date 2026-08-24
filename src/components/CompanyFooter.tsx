import { Building, Phone, Mail, MapPin, ChevronUp, Globe, ShieldCheck, Lock } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function CompanyFooter({ onNavigate }: FooterProps) {
  const { companyInfo: COMPANY_INFO } = useCMS();
  const currentYear = new Date().getFullYear();

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinksLeft = [
    { label: 'Trang Chủ', target: 'hero' },
    { label: 'Giới Thiệu Xí Nghiệp', target: 'about' },
    { label: 'Sản Phẩm & Dịch Vụ', target: 'services' },
    { label: 'Hạ Tầng Công Nghệ', target: 'technology' },
  ];

  const footerLinksRight = [
    { label: 'Thư Viện Ảnh Nhà Máy', target: 'gallery' },
    { label: 'Tuyển Dụng Thợ In', target: 'recruitment' },
    { label: 'Yêu Cầu Báo Giá', target: 'contact' },
    { label: 'Ý Kiến Phản Hồi', target: 'contact' },
  ];

  return (
    <footer className="bg-[#00004D] text-slate-300 pt-16 pb-8 border-t-4 border-brand-gold relative overflow-hidden">
      {/* Structural layout decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Upper footer zone */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-white/10 pb-12">
          
          {/* Main Brand Title Column (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-gold text-brand-blue rounded-full font-bold flex items-center justify-center font-display text-sm border border-white/15 shadow">
                IN
              </div>
              <div>
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest font-display leading-none">
                  {COMPANY_INFO.parentCompany}
                </p>
                <h3 className="text-base font-black text-white uppercase tracking-tight font-display mt-1">
                  {COMPANY_INFO.name}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed mt-2">
              Chúng tôi cam kết cung cấp các dịch vụ in ấn vé số, biểu mẫu, hóa đơn tài chính chất lượng cao, quy trình kiểm soát chất lượng chặt chẽ và ứng dụng công nghệ in ấn dữ liệu biến đổi hiện đại.
            </p>

            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                Hệ thống quản lý chất lượng ISO 9001:2015
              </span>
            </div>
            
            <div className="mt-4 flex items-center gap-2 select-none">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/50 border border-red-500/20 rounded-md shadow-lg shadow-red-950/30 group hover:border-red-500/40 transition-all duration-300">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-black text-red-400 tracking-wider font-display uppercase leading-none">
                  SLOGAN: {COMPANY_INFO.slogan}
                </span>
              </div>
            </div>
          </div>

          {/* Site Navigation Links Grid (4 Cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-black text-white hover:text-brand-gold font-display tracking-widest uppercase mb-4 border-l-2 border-brand-gold pl-3 transition-colors">
              Chuyên Mục Nổi Bật
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              <ul className="space-y-2">
                {footerLinksLeft.map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => onNavigate(link.target)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left block"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {footerLinksRight.map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => onNavigate(link.target)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left block"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* HQ Logistics Locations (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h4 className="text-xs font-black text-white hover:text-brand-gold font-display tracking-widest uppercase mb-1 border-l-2 border-brand-gold pl-3 transition-colors">
              Thông Tin Liên Hệ Hành Chính
            </h4>
            <div className="space-y-3.5 text-xs text-slate-400">
              <div className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span className="leading-snug">Địa chỉ: {COMPANY_INFO.address}</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Số máy văn phòng: <strong className="text-slate-200 font-mono">{COMPANY_INFO.phone}</strong></span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Email: <a href={`mailto:${COMPANY_INFO.email}`} className="text-slate-200 hover:underline">{COMPANY_INFO.email}</a></span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Globe className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Hệ thống mạng: <a href={`https://${COMPANY_INFO.website}`} target="_blank" rel="noreferrer" className="text-amber-500 hover:underline font-semibold">{COMPANY_INFO.website}</a></span>
              </div>
            </div>
          </div>

        </div>

        {/* Lower copyright legal zone */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
          
          {/* Legal texts */}
          <div className="text-center md:text-left flex-1">
            <p className="font-semibold text-slate-400 uppercase tracking-wide">
              &copy; 2026 XÍ NGHIỆP IN TÀI CHÍNH TP. HỒ CHÍ MINH. Đơn vị trực thuộc Công Ty TNHH MTV Xổ Số Kiến Thiết TP. Hồ Chí Minh.
            </p>
            <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
              Bản quyền website thuộc về Xí Nghiệp In Tài Chính TP. Hồ Chí Minh. Nghiêm cấm sao chép, trích xuất dữ liệu hoặc giả mạo thiết kế hoa văn, ký hiệu, số sê-ri và các nội dung thuộc quyền quản lý của đơn vị dưới mọi hình thức.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Prominent CMS Button */}
            <a
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#F5C542] text-white hover:text-[#174A87] font-bold text-xs uppercase tracking-wider font-display border border-white/20 hover:border-[#F5C542] shadow-sm hover:shadow transition-all group cursor-pointer"
              title="Truy cập Hệ thống Quản trị Nội dung CMS Supabase"
            >
              <Lock className="w-3.5 h-3.5 text-[#F5C542] group-hover:text-[#174A87] transition-colors" />
              <span>CMS QUẢN TRỊ</span>
            </a>

            {/* Scroll back to top circle */}
            <button
              onClick={handleBackToTop}
              className="w-10 h-10 bg-white/5 hover:bg-brand-gold text-slate-400 hover:text-brand-blue rounded-full flex items-center justify-center transition-all cursor-pointer shadow hover:scale-105 group border border-white/5 hover:border-brand-gold"
              aria-label="Lên đầu trang"
            >
              <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
