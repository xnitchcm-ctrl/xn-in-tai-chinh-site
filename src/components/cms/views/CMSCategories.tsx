import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';

export default function CMSCategories() {
  const { categories, saveCategory, deleteCategory } = useCMS();
  const [newCatName, setNewCatName] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleAddCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      await saveCategory({
        id: `cat-${Date.now()}`,
        name: newCatName.trim(),
        slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
        type: 'news'
      });
      setNewCatName('');
      setNotice({ type: 'success', msg: 'Đã thêm danh mục mới thành công.' });
    } catch (err: any) {
      setNotice({ type: 'error', msg: 'Lỗi khi thêm danh mục.' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Xóa danh mục "${name}"?`)) return;
    await deleteCategory(id);
    setNotice({ type: 'success', msg: 'Đã xóa danh mục.' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Quản Lý Danh Mục Tin Tức & Sản Phẩm
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Phân loại bài viết, tin tức chuyên đề và sản phẩm in ({categories.length} danh mục)
          </p>
        </div>
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

      {/* Add Category Input */}
      <form onSubmit={handleAddCat} className="bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm flex items-center gap-4">
        <input
          type="text"
          required
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          placeholder="Nhập tên danh mục mới (Ví dụ: Công nghệ in 3D, Phong trào thanh niên...)"
          className="flex-1 px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold"
        />
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục</span>
        </button>
      </form>

      {/* Category List */}
      <div className="bg-white rounded-2xl border border-[#DCE7F2] shadow-sm p-6 space-y-3">
        <h3 className="text-xs font-black text-[#173F72] uppercase tracking-wider font-display mb-4">
          Danh Sách Danh Mục Đang Hoạt Động
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="p-4 bg-[#F7FAFF] rounded-xl border border-[#DCE7F2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#174A87]" />
                <span className="text-xs font-bold text-slate-800">{cat.name}</span>
              </div>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
