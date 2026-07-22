import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Palette, 
  Image as ImageIcon, 
  Check, 
  RotateCcw, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Eye,
  Globe
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { CMSBrand as CMSBrandType } from '../../../types';

export default function CMSBrand() {
  const { brand, saveBrand, hasPermission } = useCMS();

  const [formBrand, setFormBrand] = useState<CMSBrandType>({ ...brand });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleResetDefaults = () => {
    setFormBrand({
      id: 'brand-config',
      desktopLogoUrl: '',
      mobileLogoUrl: '',
      footerLogoUrl: '',
      cmsLogoUrl: '',
      loginLogoUrl: '',
      faviconUrl: '',
      ogImageUrl: '',
      primaryColor: '#174A87',
      hoverColor: '#123C70',
      activeColor: '#0D315E',
      accentColor: '#F5C542',
      pageBgColor: '#F7FAFF',
      cardBgColor: '#FFFFFF',
      borderColor: '#DCE7F2',
      textColor: '#173F72'
    });
    setNotice({ type: 'success', msg: 'Đã khôi phục bảng màu và logo về chuẩn ban đầu.' });
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      await saveBrand(formBrand);
      setNotice({ type: 'success', msg: 'Đã lưu cấu hình thương hiệu và bảng màu thành công!' });
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi lưu cấu hình thương hiệu.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Cấu Hình Thương Hiệu & Bảng Màu
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Chỉnh sửa logo, biểu tượng favicon, ảnh chia sẻ mạng xã hội và bảng màu nhận diện chuẩn Xí nghiệp In Tài Chính.
          </p>
        </div>

        {hasPermission('manage_brand') && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefaults}
              type="button"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mặc Định</span>
            </button>
            <button
              onClick={handleSaveSubmit}
              type="button"
              disabled={saving}
              className="px-6 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Đang lưu...' : 'Lưu Cấu Hình'}</span>
            </button>
          </div>
        )}
      </div>

      {notice && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-3 font-medium ${
          notice.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{notice.msg}</span>
        </div>
      )}

      {/* Main Form Settings */}
      <form onSubmit={handleSaveSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Brand Colors (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Palette className="w-5 h-5 text-[#174A87]" />
              <h2 className="text-sm font-black text-[#173F72] font-display uppercase tracking-wider">
                Bảng Màu Chuẩn Thương Hiệu
              </h2>
            </div>

            {/* Primary Navy */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider">
                  Màu Xanh Dương Chính (Navy Primary)
                </label>
                <p className="text-[10px] text-slate-400">Thanh menu, nút chính, tiêu đề lớn</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formBrand.primaryColor || '#174A87'}
                  onChange={(e) => setFormBrand({ ...formBrand, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={formBrand.primaryColor || '#174A87'}
                  onChange={(e) => setFormBrand({ ...formBrand, primaryColor: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                />
              </div>
            </div>

            {/* Hover Navy */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider">
                  Màu Rê Chuột (Navy Hover)
                </label>
                <p className="text-[10px] text-slate-400">Hiệu ứng rê chuột vào nút hoặc thẻ</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formBrand.hoverColor || '#123C70'}
                  onChange={(e) => setFormBrand({ ...formBrand, hoverColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={formBrand.hoverColor || '#123C70'}
                  onChange={(e) => setFormBrand({ ...formBrand, hoverColor: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                />
              </div>
            </div>

            {/* Accent Yellow */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider">
                  Màu Vàng Điểm Nhấn (Accent Gold/Yellow)
                </label>
                <p className="text-[10px] text-slate-400">Thanh trang trí, nút hành động nổi bật</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formBrand.accentColor || '#F5C542'}
                  onChange={(e) => setFormBrand({ ...formBrand, accentColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={formBrand.accentColor || '#F5C542'}
                  onChange={(e) => setFormBrand({ ...formBrand, accentColor: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                />
              </div>
            </div>

            {/* Page Background */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider">
                  Nền Trang Nền Sáng (Page Background)
                </label>
                <p className="text-[10px] text-slate-400">Nền tổng thể nội dung (#F7FAFF hoặc #FFFFFF)</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formBrand.pageBgColor || '#F7FAFF'}
                  onChange={(e) => setFormBrand({ ...formBrand, pageBgColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={formBrand.pageBgColor || '#F7FAFF'}
                  onChange={(e) => setFormBrand({ ...formBrand, pageBgColor: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                />
              </div>
            </div>

            {/* Card Background */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider">
                  Nền Thẻ / Khối (Card Background)
                </label>
                <p className="text-[10px] text-slate-400">Nền trắng tinh (#FFFFFF) cho các khối bài viết</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formBrand.cardBgColor || '#FFFFFF'}
                  onChange={(e) => setFormBrand({ ...formBrand, cardBgColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={formBrand.cardBgColor || '#FFFFFF'}
                  onChange={(e) => setFormBrand({ ...formBrand, cardBgColor: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                />
              </div>
            </div>

            {/* Border & Text Colors */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider">
                  Đường Viền Nối (Border Line)
                </label>
                <p className="text-[10px] text-slate-400">Đường viền mảnh nhạt (#DCE7F2)</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formBrand.borderColor || '#DCE7F2'}
                  onChange={(e) => setFormBrand({ ...formBrand, borderColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={formBrand.borderColor || '#DCE7F2'}
                  onChange={(e) => setFormBrand({ ...formBrand, borderColor: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Logos & Asset URLs (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <ImageIcon className="w-5 h-5 text-[#174A87]" />
              <h2 className="text-sm font-black text-[#173F72] font-display uppercase tracking-wider">
                Logo & Biểu Tượng Thương Hiệu
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                URL Logo Header (Desktop)
              </label>
              <input
                type="text"
                value={formBrand.desktopLogoUrl || ''}
                onChange={(e) => setFormBrand({ ...formBrand, desktopLogoUrl: e.target.value })}
                placeholder="https://... (Đề trống để dùng Logo Quốc Huy ITC mặc định)"
                className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                URL Logo Footer / Đáy Trang
              </label>
              <input
                type="text"
                value={formBrand.footerLogoUrl || ''}
                onChange={(e) => setFormBrand({ ...formBrand, footerLogoUrl: e.target.value })}
                placeholder="https://... (Đề trống để dùng Logo mặc định)"
                className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                URL Logo CMS & Đăng Nhập
              </label>
              <input
                type="text"
                value={formBrand.loginLogoUrl || ''}
                onChange={(e) => setFormBrand({ ...formBrand, loginLogoUrl: e.target.value })}
                placeholder="https://... (Logo hiển thị tại trang Login)"
                className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                URL Favicon (Biểu Tượng Tab Trình Duyệt)
              </label>
              <input
                type="text"
                value={formBrand.faviconUrl || ''}
                onChange={(e) => setFormBrand({ ...formBrand, faviconUrl: e.target.value })}
                placeholder="https://.../favicon.ico"
                className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                URL Ảnh Đại Diện Mạng Xã Hội (OG Image)
              </label>
              <input
                type="text"
                value={formBrand.ogImageUrl || ''}
                onChange={(e) => setFormBrand({ ...formBrand, ogImageUrl: e.target.value })}
                placeholder="https://... (Ảnh hiển thị khi chia sẻ link Facebook, Zalo)"
                className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87]"
              />
            </div>

            {/* Live Color Preview Block */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-4 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Xem Trước Mẫu Thẻ Giao Diện</span>
              <div 
                style={{ backgroundColor: formBrand.cardBgColor || '#FFFFFF', borderColor: formBrand.borderColor || '#DCE7F2' }}
                className="p-4 rounded-xl border shadow-sm space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div 
                    style={{ backgroundColor: formBrand.primaryColor || '#174A87', color: formBrand.accentColor || '#F5C542' }}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black"
                  >
                    ITC
                  </div>
                  <h4 style={{ color: formBrand.textColor || '#173F72' }} className="text-xs font-black uppercase">
                    XÍ NGHIỆP IN TÀI CHÍNH
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500">Mẫu phối màu trực quan áp dụng cho giao diện web public và CMS.</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    style={{ backgroundColor: formBrand.primaryColor || '#174A87' }}
                    className="px-3 py-1 rounded text-white text-[10px] font-bold"
                  >
                    Nút Chính
                  </button>
                  <button
                    type="button"
                    style={{ backgroundColor: formBrand.accentColor || '#F5C542', color: formBrand.primaryColor || '#174A87' }}
                    className="px-3 py-1 rounded text-[10px] font-bold"
                  >
                    Nút Điểm Nhấn
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
}
