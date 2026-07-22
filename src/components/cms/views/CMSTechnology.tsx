import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Wrench
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { PrintingTechnology } from '../../../types';

export default function CMSTechnology() {
  const { technologies, saveTechnology, deleteTechnology, hasPermission } = useCMS();

  const [isEditing, setIsEditing] = useState(false);
  const [editingTech, setEditingTech] = useState<Partial<PrintingTechnology>>({
    name: '',
    origin: 'Đức (Heidelberg)',
    desc: '',
    specs: [''],
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
  });

  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleOpenCreate = () => {
    setEditingTech({
      id: `tech-${Date.now()}`,
      name: '',
      origin: 'CHLB Đức',
      desc: '',
      specs: ['Tốc độ 15.000 tờ/giờ', 'Định lượng giấy 60 - 400g/m²'],
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (t: PrintingTechnology) => {
    setEditingTech({ ...t });
    setIsEditing(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTech.name || !editingTech.desc) {
      setNotice({ type: 'error', msg: 'Vui lòng điền tên máy và mô tả kỹ thuật.' });
      return;
    }

    try {
      await saveTechnology({
        id: editingTech.id || `tech-${Date.now()}`,
        name: editingTech.name,
        origin: editingTech.origin || 'CHLB Đức',
        desc: editingTech.desc,
        specs: editingTech.specs || [],
        imageUrl: editingTech.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
      });

      setNotice({ type: 'success', msg: 'Đã lưu thiết bị công nghệ thành công!' });
      setIsEditing(false);
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi lưu máy móc.' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Xóa thiết bị "${name}"?`)) return;
    await deleteTechnology(id);
    setNotice({ type: 'success', msg: 'Đã xóa thiết bị.' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Quản Lý Trang Thiết Bị & Công Nghệ Máy In
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý thông số máy in Offset Heidelberg (Đức), Komori (Nhật Bản), máy quét sê-ri OCR ({technologies.length} thiết bị)
          </p>
        </div>

        {hasPermission('manage_content') && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Máy Móc Mới</span>
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

      {/* Grid of Machinery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technologies.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-[#DCE7F2] shadow-sm p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-40 rounded-xl object-cover border border-slate-200"
              />
              <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded font-display">
                Xuất xứ: {item.origin}
              </span>
              <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>

            {item.specs && item.specs.length > 0 && (
              <ul className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
                {item.specs.map((spec, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#174A87]" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">ID: {item.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 bg-[#174A87]/10 text-[#174A87] hover:bg-[#174A87]/20 rounded-lg text-xs font-bold transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all"
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
              className="bg-white rounded-2xl border border-[#DCE7F2] shadow-2xl w-full max-w-xl overflow-hidden my-auto"
            >
              <div className="p-6 bg-[#174A87] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#F5C542]" />
                  <h3 className="font-black font-display text-sm uppercase tracking-wider">
                    {editingTech.id ? 'Chỉnh Sửa Máy Móc In' : 'Thêm Máy Móc In Mới'}
                  </h3>
                </div>
                <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-white/10 rounded-lg text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Tên Thiết Bị / Dây Chuyền Máy In *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTech.name || ''}
                    onChange={(e) => setEditingTech({ ...editingTech, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Xuất Xứ Công Nghệ
                  </label>
                  <input
                    type="text"
                    value={editingTech.origin || ''}
                    onChange={(e) => setEditingTech({ ...editingTech, origin: e.target.value })}
                    placeholder="CHLB Đức, Komori Nhật Bản..."
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    URL Hình Ảnh Máy In
                  </label>
                  <input
                    type="text"
                    value={editingTech.imageUrl || ''}
                    onChange={(e) => setEditingTech({ ...editingTech, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Mô Tả Kỹ Thuật
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={editingTech.desc || ''}
                    onChange={(e) => setEditingTech({ ...editingTech, desc: e.target.value })}
                    className="w-full p-3 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
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
                    Lưu Máy Móc
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
