import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Ticket, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { ServiceItem } from '../../../types';

export default function CMSServices() {
  const { services, saveService, deleteService, hasPermission } = useCMS();

  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Partial<ServiceItem>>({
    title: '',
    shortDesc: '',
    longDesc: '',
    image: '/src/assets/images/lottery_sheet_1779242696323.png',
    iconName: 'Ticket',
    bullets: ['']
  });

  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleOpenCreate = () => {
    setEditingService({
      id: `service-${Date.now()}`,
      title: '',
      shortDesc: '',
      longDesc: '',
      image: '/src/assets/images/lottery_sheet_1779242696323.png',
      iconName: 'Ticket',
      bullets: ['']
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (s: ServiceItem) => {
    setEditingService({ ...s });
    setIsEditing(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService.title || !editingService.shortDesc) {
      setNotice({ type: 'error', msg: 'Vui lòng điền đầy đủ Tiêu đề và Mô tả ngắn.' });
      return;
    }

    try {
      await saveService({
        id: editingService.id || `service-${Date.now()}`,
        title: editingService.title,
        shortDesc: editingService.shortDesc,
        longDesc: editingService.longDesc || editingService.shortDesc,
        image: editingService.image || '/src/assets/images/lottery_sheet_1779242696323.png',
        iconName: editingService.iconName || 'Ticket',
        bullets: editingService.bullets?.filter(b => b.trim().length > 0) || []
      });

      setNotice({ type: 'success', msg: 'Đã lưu dịch vụ in ấn thành công!' });
      setIsEditing(false);
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi lưu dịch vụ.' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Xóa dịch vụ "${title}"?`)) return;
    await deleteService(id);
    setNotice({ type: 'success', msg: 'Đã xóa dịch vụ thành công.' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Quản Lý Dịch Vụ In Ấn Bảo Mật
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý danh mục 5 khối dịch vụ in chủ lực: Vé số KTS, Vé số cào, Hóa đơn tài chính, Giấy chứng từ ({services.length} dịch vụ)
          </p>
        </div>

        {hasPermission('manage_content') && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Dịch Vụ Mới</span>
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

      {/* Grid of Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-[#DCE7F2] shadow-sm p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.shortDesc}</p>
              </div>
            </div>

            {item.bullets && item.bullets.length > 0 && (
              <ul className="space-y-1 text-[11px] text-slate-600 bg-[#F7FAFF] p-3 rounded-xl border border-[#DCE7F2]">
                {item.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{b}</span>
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
                  onClick={() => handleDelete(item.id, item.title)}
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
                  <Ticket className="w-5 h-5 text-[#F5C542]" />
                  <h3 className="font-black font-display text-sm uppercase tracking-wider">
                    {editingService.id ? 'Chỉnh Sửa Dịch Vụ In' : 'Thêm Dịch Vụ In Mới'}
                  </h3>
                </div>
                <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-white/10 rounded-lg text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Tên Dịch Vụ In *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Mô Tả Ngắn
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.shortDesc || ''}
                    onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    URL Hình Ảnh Minh Họa
                  </label>
                  <input
                    type="text"
                    value={editingService.image || ''}
                    onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Mô Tả Chi Tiết Quy Trình Sản Xuất
                  </label>
                  <textarea
                    rows={4}
                    value={editingService.longDesc || ''}
                    onChange={(e) => setEditingService({ ...editingService, longDesc: e.target.value })}
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
                    Lưu Dịch Vụ
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
