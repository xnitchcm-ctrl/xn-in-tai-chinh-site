import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  AlertCircle,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { HeroSlide } from '../../../types';

export default function CMSBanners() {
  const {
    slides,
    slidesError,
    slidesLoading,
    loadSlidesFromSupabase,
    saveHeroSlide,
    deleteHeroSlide,
    toggleHeroSlideActive,
    reorderHeroSlides,
    uploadMediaFile,
    isAdmin,
    isApprover,
  } = useCMS();

  const safeSlides: HeroSlide[] = Array.isArray(slides) ? slides : [];
  const canManageBanners = isAdmin || isApprover;

  const [isEditing, setIsEditing] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide>>({
    id: '',
    title: '',
    subtitle: '',
    badgeText: 'XÍ NGHIỆP IN TÀI CHÍNH',
    ctaText: 'KHÁM PHÁ NGAY',
    targetId: 'services',
    image: '',
    isActive: true,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingSlide, setSavingSlide] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalInfo, setModalInfo] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenCreate = () => {
    setModalError(null);
    setModalInfo(null);
    setEditingSlide({
      id: `slide-${Date.now()}`,
      title: '',
      subtitle: '',
      badgeText: 'XÍ NGHIỆP IN TÀI CHÍNH',
      ctaText: 'KHÁM PHÁ NGAY',
      targetId: 'services',
      image: '',
      isActive: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setModalError(null);
    setModalInfo(null);
    setEditingSlide({
      id: slide.id,
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      badgeText: slide.badgeText || '',
      ctaText: slide.ctaText || 'KHÁM PHÁ NGAY',
      targetId: slide.targetId || 'services',
      image: slide.image || '',
      isActive: slide.isActive !== false,
      displayOrder: slide.displayOrder,
    });
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setModalError(null);
    setModalInfo(null);
    try {
      const publicUrl = await uploadMediaFile(files[0], 'banners');
      setEditingSlide(prev => ({ ...prev, image: publicUrl }));
      setModalInfo('Đã đính kèm ảnh Banner từ Supabase Storage. Bấm "Lưu Banner" để lưu vào cơ sở dữ liệu.');
    } catch (err: any) {
      const msg = 'Lỗi tải ảnh lên Storage: ' + (err?.message || 'Vui lòng thử lại');
      setModalError(msg);
      setNotice({ type: 'error', msg });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage || savingSlide) return;

    setModalError(null);
    const trimmedTitle = (editingSlide.title || '').trim();
    const trimmedImage = (editingSlide.image || '').trim();

    if (!trimmedTitle) {
      setModalError('Vui lòng nhập Tiêu đề Banner.');
      return;
    }

    if (!trimmedImage) {
      setModalError('Vui lòng chọn ảnh từ máy tính hoặc nhập URL hình ảnh Banner.');
      return;
    }

    setSavingSlide(true);
    try {
      await saveHeroSlide({
        id: editingSlide.id || `slide-${Date.now()}`,
        title: trimmedTitle,
        subtitle: (editingSlide.subtitle || '').trim(),
        badgeText: (editingSlide.badgeText || '').trim() || 'XÍ NGHIỆP IN TÀI CHÍNH',
        ctaText: (editingSlide.ctaText || '').trim() || 'KHÁM PHÁ NGAY',
        targetId: (editingSlide.targetId || '').trim() || 'services',
        image: trimmedImage,
        isActive: editingSlide.isActive !== false,
        displayOrder: editingSlide.displayOrder,
      });

      setNotice({ type: 'success', msg: 'Đã lưu Banner Slide thành công!' });
      setIsEditing(false);
    } catch (err: any) {
      const msg = err?.message || 'Lỗi khi lưu Banner Slide lên Supabase.';
      setModalError(msg);
      setNotice({ type: 'error', msg });
    } finally {
      setSavingSlide(false);
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    const nextState = slide.isActive === false;
    try {
      await toggleHeroSlideActive(slide.id, nextState);
      setNotice({
        type: 'success',
        msg: nextState
          ? `Đã bật hiển thị Banner "${slide.title}".`
          : `Đã ẩn Banner "${slide.title}".`,
      });
    } catch (err: any) {
      setNotice({ type: 'error', msg: err?.message || 'Lỗi cập nhật trạng thái Banner.' });
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= safeSlides.length) return;

    const reordered = [...safeSlides];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    try {
      await reorderHeroSlides(reordered);
      setNotice({ type: 'success', msg: 'Đã cập nhật thứ tự hiển thị Banner Slide!' });
    } catch (err: any) {
      setNotice({ type: 'error', msg: err?.message || 'Lỗi cập nhật thứ tự Banner.' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Xóa vĩnh viễn Banner Slide "${title}"?`)) return;
    try {
      await deleteHeroSlide(id);
      setNotice({ type: 'success', msg: 'Đã xóa Banner Slide thành công.' });
    } catch (err: any) {
      setNotice({ type: 'error', msg: err?.message || 'Lỗi khi xóa Banner Slide.' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
              Quản Lý Banner &amp; Hero Slides
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#174A87] text-white">
              {safeSlides.length} banner
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Thay đổi hình ảnh slide nổi bật trên trang chủ, tiêu đề, nội dung và nút liên kết
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadSlidesFromSupabase()}
            disabled={slidesLoading}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
            title="Tải lại danh sách Banner từ Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${slidesLoading ? 'animate-spin' : ''}`} />
            <span>Tải lại</span>
          </button>

          {canManageBanners && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Banner Slide Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Supabase Error Alert (Never white screen) */}
      {slidesError && (
        <div className="p-4 rounded-xl text-xs flex items-start justify-between gap-3 font-medium bg-rose-50 border border-rose-200 text-rose-900">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Không thể tải dữ liệu Banner từ Supabase</p>
              <p className="mt-0.5 text-rose-800">{slidesError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => loadSlidesFromSupabase()}
            className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold shrink-0 hover:bg-rose-700 cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {notice && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between font-medium border ${
          notice.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : notice.type === 'info'
              ? 'bg-blue-50 border-blue-200 text-blue-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <span>{notice.msg}</span>
          <button type="button" onClick={() => setNotice(null)} className="p-1 hover:opacity-75 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading State */}
      {slidesLoading && safeSlides.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#DCE7F2]">
          <div className="w-8 h-8 border-2 border-[#174A87] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Đang tải danh sách Banner Slide từ Supabase...</p>
        </div>
      ) : safeSlides.length === 0 ? (
        /* Empty State */
        <div className="bg-white p-12 text-center rounded-2xl border border-[#DCE7F2] shadow-sm">
          <Sliders className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-black text-slate-700 uppercase font-display">
            Chưa có Banner
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Danh sách Banner Slide hiện đang trống. Bấm &quot;Thêm Banner Slide Mới&quot; để tạo banner đầu tiên.
          </p>
          {canManageBanners && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-4 px-4 py-2 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Banner Slide Mới</span>
            </button>
          )}
        </div>
      ) : (
        /* Slide Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safeSlides.map((slide, index) => {
            const isActive = slide.isActive !== false;
            return (
              <div
                key={slide.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col justify-between transition-all ${
                  isActive ? 'border-[#DCE7F2]' : 'border-slate-200 opacity-75'
                }`}
              >
                <div className="relative h-52 overflow-hidden bg-slate-900">
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt={slide.title || 'Banner'}
                      className="w-full h-full object-cover opacity-85"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-xs">Chưa có ảnh Banner</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-white/95 text-[#173F72] text-[11px] font-black shadow">
                      #{index + 1}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase shadow ${
                        isActive ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-100'
                      }`}
                    >
                      {isActive ? 'Đang hiển thị' : 'Đang ẩn'}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent p-4 flex flex-col justify-end text-white pointer-events-none">
                    <span className="text-[10px] font-black uppercase text-[#F5C542] tracking-wider mb-1 font-display">
                      {slide.badgeText || 'XÍ NGHIỆP IN TÀI CHÍNH'}
                    </span>
                    <h3 className="font-bold text-sm line-clamp-1">{slide.title || '(Chưa có tiêu đề)'}</h3>
                    <p className="text-xs text-slate-200 line-clamp-2 mt-0.5">{slide.subtitle || ''}</p>
                  </div>
                </div>

                <div className="p-4 bg-white flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                  <div className="text-[11px] font-mono font-bold text-slate-500 truncate max-w-[220px]">
                    Nút: {slide.ctaText || 'KHÁM PHÁ NGAY'} ({slide.targetId || 'services'})
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      title="Đưa lên trước"
                      className="p-2 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#174A87] rounded-lg disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === safeSlides.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      title="Đưa xuống sau"
                      className="p-2 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#174A87] rounded-lg disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(slide)}
                      title={isActive ? 'Tắt hiển thị Banner' : 'Bật hiển thị Banner'}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{isActive ? 'Ẩn' : 'Hiện'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(slide)}
                      title="Chỉnh sửa Banner"
                      className="p-2 bg-[#174A87]/10 text-[#174A87] hover:bg-[#174A87]/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(slide.id, slide.title || slide.id)}
                      title="Xóa Banner"
                      className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
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
                    {safeSlides.some(s => s.id === editingSlide.id)
                      ? 'Chỉnh Sửa Banner Slide'
                      : 'Thêm Banner Slide Mới'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSubmit} className="p-6 space-y-4 text-xs">
                {modalError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{modalError}</span>
                  </div>
                )}

                {modalInfo && (
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px]">
                    {modalInfo}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Nhãn Nổi Bật (Badge Header)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.badgeText || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, badgeText: e.target.value })}
                    placeholder="Ví dụ: Chất Lượng Vượt Trội"
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Tiêu Đề Banner *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.title || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                    placeholder="Ví dụ: UY TÍN – CHẤT LƯỢNG – NHANH CHÓNG"
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Nội Dung Mô Tả
                  </label>
                  <textarea
                    rows={3}
                    value={editingSlide.subtitle || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                    placeholder="Mô tả ngắn hiển thị bên dưới tiêu đề Banner..."
                    className="w-full p-3 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                  />
                </div>

                {/* Image Upload & Preview */}
                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Hình Ảnh Banner (Tải lên Supabase Storage hoặc nhập URL) *
                  </label>
                  <div className="p-3.5 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl space-y-3">
                    <div className="h-36 bg-slate-100 rounded-xl overflow-hidden border border-[#DCE7F2] flex items-center justify-center">
                      {(editingSlide.image || '').trim() ? (
                        <img
                          src={editingSlide.image}
                          alt="Banner Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 gap-1 text-center px-4">
                          <ImageIcon className="w-8 h-8 text-slate-300" />
                          <span className="text-[11px]">
                            Chưa có ảnh Banner — chọn ảnh từ máy hoặc nhập URL thật
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={uploadingImage || savingSlide}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-[#174A87] hover:bg-[#123C70] text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Đang tải ảnh lên...' : 'Chọn Ảnh Từ Máy Tính'}</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      required
                      value={editingSlide.image || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                      placeholder="Hoặc dán URL hình ảnh Banner (https://...)..."
                      className="w-full px-3 py-2 text-[11px] bg-white border border-[#DCE7F2] rounded-lg font-mono text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                      Chữ Nút Liên Kết (CTA)
                    </label>
                    <input
                      type="text"
                      value={editingSlide.ctaText || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                      placeholder="KHÁM PHÁ NGAY"
                      className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                      Liên Kết Đích (Section ID hoặc URL)
                    </label>
                    <input
                      type="text"
                      value={editingSlide.targetId || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, targetId: e.target.value })}
                      placeholder="services, about, technology hoặc https://..."
                      className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-mono"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={editingSlide.isActive !== false}
                    onChange={(e) => setEditingSlide({ ...editingSlide, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-[#174A87] cursor-pointer"
                  />
                  <span className="font-bold text-[#173F72]">Bật hiển thị Banner này trên trang chủ</span>
                </label>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={savingSlide}
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingImage || savingSlide}
                    className="px-6 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>
                      {uploadingImage
                        ? 'Đang tải ảnh...'
                        : savingSlide
                          ? 'Đang lưu...'
                          : 'Lưu Banner'}
                    </span>
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
