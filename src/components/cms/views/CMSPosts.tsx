import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Pin, 
  CheckCircle, 
  X, 
  AlertCircle, 
  Image as ImageIcon,
  Tag,
  Calendar,
  User,
  Filter
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { NewsPost } from '../../../utils/firebase';

export default function CMSPosts() {
  const { news, saveNewsPost, deleteNewsPost, categories, hasPermission, currentUser } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<NewsPost>>({
    title: '',
    subtitle: '',
    content: '',
    category: 'Hoạt động sản xuất',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    isPinned: false,
    author: currentUser?.fullName || 'Phòng Biên tập & Truyền thông'
  });

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const filteredNews = news.filter((post) => {
    const matchesQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  const handleOpenCreate = () => {
    setEditingPost({
      title: '',
      subtitle: '',
      content: '',
      category: categories[0]?.name || 'Hoạt động sản xuất',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      isPinned: false,
      author: currentUser?.fullName || 'Phòng Biên tập'
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (post: NewsPost) => {
    setEditingPost({ ...post });
    setIsEditing(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost.title || !editingPost.content) {
      setNotice({ type: 'error', msg: 'Vui lòng nhập đầy đủ Tiêu đề và Nội dung bài viết.' });
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      await saveNewsPost({
        id: editingPost.id,
        title: editingPost.title,
        subtitle: editingPost.subtitle || '',
        content: editingPost.content,
        category: editingPost.category || 'Hoạt động sản xuất',
        imageUrl: editingPost.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        videoUrl: editingPost.videoUrl || '',
        isPinned: !!editingPost.isPinned,
        createdAt: editingPost.createdAt || new Date().toISOString(),
        author: editingPost.author || currentUser?.fullName || 'Biên tập viên'
      });

      setNotice({ type: 'success', msg: 'Đã lưu bài viết thành công!' });
      setIsEditing(false);
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi lưu bài viết.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) return;
    try {
      await deleteNewsPost(id);
      setNotice({ type: 'success', msg: 'Đã xóa bài viết thành công.' });
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi xóa bài viết.' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Quản Lý Bài Viết & Tin Tức
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Đăng tin hoạt động xí nghiệp, thông báo, đoàn thể, công nghệ in mới ({news.length} bài viết)
          </p>
        </div>

        {hasPermission('publish_content') && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng Bài Viết Mới</span>
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

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DCE7F2] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#174A87] text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-[#174A87] text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Article List Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#DCE7F2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#F7FAFF] text-[#173F72] uppercase font-bold text-[10px] tracking-wider border-b border-[#DCE7F2]">
              <tr>
                <th className="p-4 w-16 text-center">Ghim</th>
                <th className="p-4">Hình ảnh</th>
                <th className="p-4">Tiêu đề bài viết</th>
                <th className="p-4">Chuyên mục</th>
                <th className="p-4">Tác giả</th>
                <th className="p-4">Ngày đăng</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Không tìm thấy bài viết nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredNews.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 text-center">
                      {post.isPinned && (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700" title="Đã ghim nổi bật">
                          <Pin className="w-3.5 h-3.5 fill-current" />
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                    </td>
                    <td className="p-4 max-w-xs">
                      <h3 className="font-bold text-slate-900 line-clamp-2">{post.title}</h3>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{post.subtitle}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full font-bold text-[10px] border border-blue-100">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-600">{post.author}</td>
                    <td className="p-4 font-mono text-slate-500">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-2 text-[#174A87] hover:bg-[#174A87]/10 rounded-lg transition-colors cursor-pointer"
                          title="Chỉnh sửa bài viết"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {hasPermission('publish_content') && (
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa bài viết"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#DCE7F2] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="p-6 bg-[#174A87] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#F5C542]" />
                  <h3 className="font-black font-display text-sm uppercase tracking-wider">
                    {editingPost.id ? 'Chỉnh Sửa Bài Viết' : 'Soạn Bài Viết Mới'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Tiêu Đề Bài Viết *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    placeholder="Nhập tiêu đề tin tức, hoạt động xí nghiệp..."
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87] font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Tóm Tắt / Phụ Đề
                  </label>
                  <textarea
                    rows={2}
                    value={editingPost.subtitle || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, subtitle: e.target.value })}
                    placeholder="Tóm tắt ngắn 1-2 câu về nội dung chính bài viết..."
                    className="w-full p-3 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                      Chuyên Mục
                    </label>
                    <select
                      value={editingPost.category || categories[0]?.name}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                      Tác Giả / Phòng Bàn
                    </label>
                    <input
                      type="text"
                      value={editingPost.author || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                      placeholder="Phòng Kỹ Thuật, Ban Giám Đốc..."
                      className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    URL Ảnh Đại Diện Bài Viết
                  </label>
                  <input
                    type="url"
                    value={editingPost.imageUrl || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Nội Dung Bài Viết *
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={editingPost.content || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    placeholder="Nhập nội dung đầy đủ bài viết..."
                    className="w-full p-4 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87] leading-relaxed font-sans"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!editingPost.isPinned}
                      onChange={(e) => setEditingPost({ ...editingPost, isPinned: e.target.checked })}
                      className="w-4 h-4 text-[#174A87] rounded border-[#DCE7F2]"
                    />
                    <span className="text-xs font-bold text-[#173F72]">Ghim nổi bật lên đầu trang tin tức</span>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow cursor-pointer transition-all"
                  >
                    {saving ? 'Đang lưu...' : 'Lưu Bài Viết'}
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
