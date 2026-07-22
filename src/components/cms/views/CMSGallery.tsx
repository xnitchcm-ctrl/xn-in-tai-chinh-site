import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { GalleryItem } from '../../../types';

export default function CMSGallery() {
  const { gallery, saveGalleryItem, deleteGalleryItem, hasPermission } = useCMS();

  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem>>({
    title: '',
    category: 'Sản xuất',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    caption: ''
  });

  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleOpenCreate = () => {
    setEditingItem({
      id: `gallery-${Date.now()}`,
      title: '',
      category: 'Phân Xưởng In Offset',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      caption: ''
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem({ ...item });
    setIsEditing(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem.title || !editingItem.imageUrl) {
      setNotice({ type: 'error', msg: 'Vui lòng điền Tiêu đề và URL Hình ảnh.' });
      return;
    }

    try {
      await saveGalleryItem({
        id: editingItem.id || `gallery-${Date.now()}`,
        title: editingItem.title,
        category: editingItem.category || 'Phân xưởng',
        imageUrl: editingItem.imageUrl,
        caption: editingItem.caption || ''
      });

      setNotice({ type: 'success', msg: 'Đã lưu hình ảnh thư viện thành công!' });
      setIsEditing(false);
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi lưu hình ảnh.' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Xóa hình ảnh "${title}" khỏi thư viện?`)) return;
    await deleteGalleryItem(id);
    setNotice({ type: 'success', msg: 'Đã xóa hình ảnh.' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Quản Lý Thư Viện Hình Ảnh Xí Nghiệp
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bộ sưu tập hình ảnh nhà xưởng, dây chuyền máy in, hoạt động phong trào đoàn thể ({gallery.length} ảnh)
          </p>
        </div>

        {hasPermission('manage_content') && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Ảnh Thư Viện</span>
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

      {/* Grid of Gallery Photos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {gallery.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-[#DCE7F2] shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="relative h-44 bg-slate-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded">
                {item.category}
              </span>
            </div>

            <div className="p-3 bg-white space-y-2">
              <h4 className="font-bold text-slate-900 text-xs truncate">{item.title}</h4>
              <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-[#174A87] hover:bg-[#174A87]/10 rounded-lg cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Edit / Create */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#DCE7F2] shadow-2xl w-full max-w-md overflow-hidden my-auto"
            >
              <div className="p-6 bg-[#174A87] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#F5C542]" />
                  <h3 className="font-black font-display text-sm uppercase tracking-wider">
                    {editingItem.id ? 'Chỉnh Sửa Hình Ảnh' : 'Thêm Hình Ảnh Mới'}
                  </h3>
                </div>
                <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-white/10 rounded-lg text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Tên / Chú Thích Hình Ảnh *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Danh Mục Thư Viện
                  </label>
                  <input
                    type="text"
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="Phân xưởng, Máy in, Đoàn thể..."
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    URL Hình Ảnh *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.imageUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-mono text-slate-700"
                  />
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
                    Lưu Hình Ảnh
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
