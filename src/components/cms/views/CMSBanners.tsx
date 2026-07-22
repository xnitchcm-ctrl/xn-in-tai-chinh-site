import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  ExternalLink
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { HeroSlide } from '../../../types';

export default function CMSBanners() {
  const { heroSlides, saveHeroSlide, deleteHeroSlide, hasPermission } = useCMS();

  const [isEditing, setIsEditing] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide>>({
    title: '',
    subtitle: '',
    badge: 'XÍ NGHIỆP IN TÀI CHÍNH',
    ctaText: 'Khám Phá Ngay',
    ctaLink: '#dich-vu',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  });

  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleOpenCreate = () => {
    setEditingSlide({
      id: `slide-${Date.now()}`,
      title: '',
      subtitle: '',
      badge: 'XÍ NGHIỆP IN TÀI CHÍNH',
      ctaText: 'Khám Phá Ngay',
      ctaLink: '#dich-vu',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide({ ...slide });
    setIsEditing(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide.title || !editingSlide.imageUrl) {
      setNotice({ type: 'error', msg: 'Vui lòng nhập đầy đủ Tiêu đề và URL Hình ảnh.' });
      return;
    }

    try {
      await saveHeroSlide({
        id: editingSlide.id || `slide-${Date.now()}`,
        title: editingSlide.title,
        subtitle: editingSlide.subtitle || '',
        badge: editingSlide.badge || 'XÍ NGHIỆP IN TÀI CHÍNH',
        ctaText: editingSlide.ctaText || 'Khám Phá Dịch Vụ',
        ctaLink: editingSlide.ctaLink || '#dich-vu',
        imageUrl: editingSlide.imageUrl
      });

      setNotice({ type: 'success', msg: 'Đã lưu Banner Slide thành công!' });
      setIsEditing(false);
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi lưu Banner.' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Xóa banner slide "${title}"?`)) return;
    await deleteHeroSlide(id);
    setNotice({ type: 'success', msg: 'Đã xóa banner slide.' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Quản Lý Banner & Hero Slides
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thay đổi hình ảnh slide nổi bật trên trang chủ, slogan và nút điều hướng ({heroSlides.length} slides)
          </p>
        </div>

        {hasPermission('manage_content') && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Banner Slide Mới</span>
          </button>
        )}
      </div>

      {notice && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between font-medium ${
          notice.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          <span>{notice.msg}</span>
          <button onClick={() => setNotice(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Slide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {heroSlides.map((slide) => (
          <div key={slide.id} className="bg-white rounded-2xl border border-[#DCE7F2] shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden bg-slate-900">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-black uppercase text-[#F5C542] tracking-wider mb-1 font-display">
                  {slide.badge}
                </span>
                <h3 className="font-bold text-sm line-clamp-1">{slide.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{slide.subtitle}</p>
              </div>
            </div>

            <div className="p-4 bg-white flex items-center justify-between border-t border-slate-100">
              <span className="text-[11px] font-mono font-bold text-slate-500">CTA: {slide.ctaText} ({slide.ctaLink})</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(slide)}
                  className="px-3 py-1.5 bg-[#174A87]/10 text-[#174A87] hover:bg-[#174A87]/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id, slide.title)}
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#DCE7F2] shadow-2xl w-full max-w-xl overflow-hidden my-auto"
            >
              <div className="p-6 bg-[#174A87] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#F5C542]" />
                  <h3 className="font-black font-display text-sm uppercase tracking-wider">
                    {editingSlide.id ? 'Chỉnh Sửa Banner Slide' : 'Thêm Banner Slide Mới'}
                  </h3>
                </div>
                <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-white/10 rounded-lg text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Nhãn Nổi Bật (Badge Header)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.badge || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                    placeholder="XÍ NGHIỆP IN TÀI CHÍNH TP.HCM"
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Tiêu Đề Slide *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.title || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Mô Tả Phụ Đề
                  </label>
                  <textarea
                    rows={2}
                    value={editingSlide.subtitle || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                    className="w-full p-3 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    URL Hình Ảnh Banner Nền *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.imageUrl || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-mono text-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                      Chữ Nút Điều Hương (CTA)
                    </label>
                    <input
                      type="text"
                      value={editingSlide.ctaText || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                      Đường Link Nút (CTA Link)
                    </label>
                    <input
                      type="text"
                      value={editingSlide.ctaLink || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, ctaLink: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow"
                  >
                    Lưu Slide
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
