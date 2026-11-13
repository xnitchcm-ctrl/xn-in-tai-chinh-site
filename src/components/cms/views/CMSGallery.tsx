import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { GalleryItem } from '../../../types';

const categoryOptions = [
  { value: 'machinery', label: 'Dây chuyền thiết bị' },
  { value: 'products', label: 'Ấn phẩm bảo mật' },
  { value: 'certificates', label: 'Kiểm định & KCS' },
  { value: 'activities', label: 'Hoạt động & Đoàn thể' }
] as const;

type GalleryCategoryValue = (typeof categoryOptions)[number]['value'];

const getCategoryLabel = (value: string): string => {
  return categoryOptions.find(opt => opt.value === value)?.label || value;
};

export default function CMSGallery() {
  const { 
    gallery, 
    galleryError,
    saveGalleryItem, 
    reorderGalleryItems, 
    deleteGalleryItem, 
    uploadMediaFile,
    isApprover,
  } = useCMS();

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    title: string;
    category: string;
    image: string;
  }>({
    id: '',
    title: '',
    category: 'machinery',
    image: ''
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalInfo, setModalInfo] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);
  const [replacingItemId, setReplacingItemId] = useState<string | null>(null);

  const filteredGallery = gallery.filter(item => {
    if (selectedCat === 'all') return true;
    return item.category === selectedCat;
  });

  const handleOpenCreate = () => {
    setModalError(null);
    setModalInfo(null);
    setEditingItem({
      id: `gal-${Date.now()}`,
      title: '',
      category: 'machinery',
      image: ''
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setModalError(null);
    setModalInfo(null);
    const isKnownCategory = categoryOptions.some(opt => opt.value === item.category);
    setEditingItem({
      id: item.id,
      title: item.title,
      category: isKnownCategory ? item.category : 'machinery',
      image: item.image || ''
    });
    setIsEditing(true);
  };

  // Upload image to Supabase Storage (does not save gallery_items record yet)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setModalError(null);
    setModalInfo(null);
    try {
      const publicUrl = await uploadMediaFile(files[0], 'gallery');
      setEditingItem(prev => ({ ...prev, image: publicUrl }));
      setModalInfo('Đã đính kèm ảnh từ Storage. Bấm "Lưu Vào Thư Viện" để lưu bản ghi vào cơ sở dữ liệu.');
    } catch (err: any) {
      const errMsg = 'Lỗi tải ảnh lên Storage: ' + (err.message || 'Thử lại sau');
      setModalError(errMsg);
      setNotice({ type: 'error', msg: errMsg });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Direct quick replace of an image card
  const handleQuickReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !replacingItemId) return;

    const targetItem = gallery.find(g => g.id === replacingItemId);
    if (!targetItem) {
      e.target.value = '';
      setReplacingItemId(null);
      return;
    }

    setNotice({ type: 'info', msg: 'Đang tải và thay thế ảnh...' });
    try {
      const publicUrl = await uploadMediaFile(files[0], 'gallery');
      await saveGalleryItem({
        ...targetItem,
        image: publicUrl
      });
      setNotice({ type: 'success', msg: `Đã lưu thành công! Đã thay thế ảnh cho "${targetItem.title}".` });
    } catch (err: any) {
      setNotice({ type: 'error', msg: 'Lỗi khi thay thế ảnh: ' + (err.message || 'Thử lại sau') });
    } finally {
      setReplacingItemId(null);
      e.target.value = '';
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage || savingItem) return;

    setModalError(null);
    const trimmedTitle = editingItem.title.trim();
    const trimmedImage = editingItem.image.trim();

    if (!trimmedTitle) {
      const msg = 'Vui lòng nhập Tiêu đề / Chú thích ảnh.';
      setModalError(msg);
      setNotice({ type: 'error', msg });
      return;
    }

    if (!trimmedImage) {
      const msg = 'Vui lòng chọn tải ảnh lên hoặc nhập URL hình ảnh thật.';
      setModalError(msg);
      setNotice({ type: 'error', msg });
      return;
    }

    setSavingItem(true);
    try {
      await saveGalleryItem({
        id: editingItem.id || `gal-${Date.now()}`,
        title: trimmedTitle,
        category: editingItem.category as GalleryCategoryValue,
        image: trimmedImage
      });

      setNotice({ type: 'success', msg: 'Đã lưu thành công!' });
      setIsEditing(false);
    } catch (err: any) {
      const msg = err.message || 'Lỗi khi lưu hình ảnh lên Supabase.';
      setModalError(msg);
      setNotice({ type: 'error', msg });
    } finally {
      setSavingItem(false);
    }
  };

  // Move item up / down in order
  const handleMove = async (filteredIndex: number, direction: 'up' | 'down') => {
    const targetFilteredIndex = direction === 'up' ? filteredIndex - 1 : filteredIndex + 1;
    if (targetFilteredIndex < 0 || targetFilteredIndex >= filteredGallery.length) return;

    const currentItem = filteredGallery[filteredIndex];
    const swapItem = filteredGallery[targetFilteredIndex];
    const fullIndexA = gallery.findIndex(g => g.id === currentItem.id);
    const fullIndexB = gallery.findIndex(g => g.id === swapItem.id);
    if (fullIndexA === -1 || fullIndexB === -1) return;

    const newItems = [...gallery];
    newItems[fullIndexA] = gallery[fullIndexB];
    newItems[fullIndexB] = gallery[fullIndexA];

    try {
      await reorderGalleryItems(newItems);
      setNotice({ type: 'success', msg: 'Đã cập nhật thứ tự hiển thị của thư viện ảnh!' });
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi cập nhật thứ tự ảnh.' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Xóa vĩnh viễn hình ảnh "${title}" khỏi thư viện?`)) return;
    try {
      await deleteGalleryItem(id);
      setNotice({ type: 'success', msg: 'Đã xóa hình ảnh.' });
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi xóa ảnh.' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hidden file input for quick replacement */}
      <input
        type="file"
        ref={replaceFileInputRef}
        onChange={handleQuickReplaceFile}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
              Quản Lý Thư Viện Hình Ảnh
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#174A87] text-white">
              {gallery.length} ảnh
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý, thay thế và sắp xếp thứ tự hiển thị hình ảnh trong trang <strong>Thư viện</strong> công khai
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-[#174A87]/20 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Ảnh Mới</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCat === 'all'
                ? 'bg-[#174A87] text-white shadow-sm'
                : 'text-slate-600 hover:bg-[#F7FAFF] hover:text-[#174A87]'
            }`}
          >
            Tất cả danh mục ({gallery.length})
          </button>
          {categoryOptions.map(cat => {
            const count = gallery.filter(g => g.category === cat.value).length;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCat(cat.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCat === cat.value
                    ? 'bg-[#174A87] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-[#F7FAFF] hover:text-[#174A87]'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          Dùng nút mũi tên để đổi thứ tự ảnh
        </span>
      </div>

      {galleryError && (
        <div className="p-4 rounded-xl text-xs flex items-center gap-2 font-medium border bg-rose-50 border-rose-200 text-rose-900">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{galleryError}</span>
        </div>
      )}

      {notice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-xs flex items-center justify-between font-medium border ${
            notice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
            notice.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-900' :
            'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <span>{notice.msg}</span>
          <button onClick={() => setNotice(null)} className="p-1 hover:opacity-75 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Grid of Gallery Photos with Reorder and Replace */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGallery.map((item, index) => (
          <motion.div 
            key={item.id}
            layout
            className="bg-white rounded-2xl border border-[#DCE7F2] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            {/* Image Preview & Category Badge */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-[11px]">Không có ảnh</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
              
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#174A87]/90 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg shadow">
                {getCategoryLabel(item.category)}
              </span>

              {/* Order number tag */}
              <span className="absolute top-3 right-3 w-6 h-6 bg-white/90 text-[#173F72] text-[11px] font-black rounded-full flex items-center justify-center shadow">
                #{index + 1}
              </span>

              {/* Quick Replace Button Hover */}
              <button
                onClick={() => {
                  setReplacingItemId(item.id);
                  replaceFileInputRef.current?.click();
                }}
                className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#F5C542] hover:bg-yellow-400 text-[#174A87] text-[11px] font-bold rounded-xl shadow flex items-center gap-1.5 transition-transform cursor-pointer"
                title="Thay thế hình ảnh này bằng ảnh mới từ máy"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Thay ảnh</span>
              </button>
            </div>

            {/* Info & Title */}
            <div className="p-4 space-y-3">
              <h4 className="font-bold text-[#173F72] text-xs line-clamp-2 leading-snug">
                {item.title}
              </h4>

              {/* Action Buttons: Move Up, Move Down, Edit, Delete */}
              <div className="flex items-center justify-between pt-3 border-t border-[#DCE7F2]">
                {/* Reorder arrows */}
                <div className="flex items-center gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#174A87] rounded-lg disabled:opacity-30 cursor-pointer"
                    title="Di chuyển lên trước"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === filteredGallery.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#174A87] rounded-lg disabled:opacity-30 cursor-pointer"
                    title="Di chuyển về sau"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-[#174A87] hover:bg-blue-50 rounded-lg cursor-pointer"
                    title="Chỉnh sửa thông tin"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {isApprover && (
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Xóa hình ảnh này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredGallery.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#DCE7F2]">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-black text-slate-600 uppercase font-display">Chưa có hình ảnh nào</h3>
          <p className="text-xs text-slate-400 mt-1">Bấm "Thêm Ảnh Mới" để tải ảnh đầu tiên lên thư viện.</p>
        </div>
      )}

      {/* Edit / Create Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#DCE7F2]">
                <h3 className="text-sm font-black text-[#173F72] uppercase font-display">
                  {editingItem.id && gallery.some(g => g.id === editingItem.id) ? 'Chỉnh Sửa Hình Ảnh' : 'Thêm Hình Ảnh Thư Viện'}
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSubmit} className="space-y-4 py-4 text-xs">
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

                {/* Title */}
                <div>
                  <label className="block font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                    Tiêu Đề / Chú Thích Ảnh *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="Ví dụ: Máy in Offset Heidelberg 5 màu tự động..."
                    className="w-full p-3 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87] font-semibold text-slate-800"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                    Danh Mục Thư Viện
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full p-3 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87] font-semibold text-slate-800"
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Image Upload & Preview */}
                <div>
                  <label className="block font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                    Tải Ảnh Lên Supabase Storage *
                  </label>
                  <div className="p-4 bg-[#F7FAFF] border border-[#DCE7F2] rounded-2xl space-y-3">
                    <div className="h-36 bg-slate-100 rounded-xl overflow-hidden border border-[#DCE7F2] flex items-center justify-center">
                      {editingItem.image.trim() ? (
                        <img
                          src={editingItem.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 px-4 text-center">
                          <ImageIcon className="w-8 h-8 text-slate-300" />
                          <span className="text-[11px] font-medium">
                            Chưa có hình ảnh — vui lòng chọn ảnh từ máy hoặc nhập URL thật
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={uploadingImage || savingItem}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-[#174A87] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-[#123C70] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Đang tải lên...' : 'Chọn Ảnh Từ Máy Tính'}</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      required
                      value={editingItem.image}
                      onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                      placeholder="Hoặc dán URL hình ảnh thật (https://...)..."
                      className="w-full p-2 bg-white border border-[#DCE7F2] rounded-lg text-[11px]"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-3 border-t border-[#DCE7F2] flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={savingItem}
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#DCE7F2] text-slate-600 font-bold hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingImage || savingItem}
                    className="px-5 py-2.5 rounded-xl bg-[#174A87] hover:bg-[#123C70] text-white font-bold shadow-md shadow-[#174A87]/20 cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {uploadingImage
                        ? 'Đang tải ảnh...'
                        : savingItem
                          ? 'Đang lưu...'
                          : 'Lưu Vào Thư Viện'}
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
