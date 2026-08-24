import React, { useState, useRef } from 'react';
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
  Filter,
  Upload,
  Send,
  Check,
  XCircle,
  EyeOff,
  Eye,
  Clock,
  MessageSquare,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { NewsPost } from '../../../utils/firebase';
import { ArticleWorkflowStatus } from '../../../types';

export default function CMSPosts() {
  const { 
    news, 
    saveNewsPost, 
    submitNewsForReview, 
    approveAndPublishNews, 
    rejectNewsPost, 
    hideNewsPost, 
    deleteNewsPost, 
    uploadMediaFile,
    categories, 
    currentUser, 
    isAdmin, 
    isApprover, 
    isEditor 
  } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<NewsPost>>({
    title: '',
    subtitle: '',
    content: '',
    category: 'Hoạt động sản xuất',
    imageUrl: '/src/assets/images/printing_hero_1779242674142.png',
    isPinned: false,
    status: isApprover ? 'published' : 'draft',
    author: currentUser?.fullName || 'Ban Biên Tập'
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);

  // Modal for rejection reason
  const [rejectModalPostId, setRejectModalPostId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredNews = news.filter((post) => {
    const matchesQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || (post.status || 'published') === statusFilter;
    return matchesQuery && matchesCat && matchesStatus;
  });

  const handleOpenCreate = () => {
    setEditingPost({
      title: '',
      subtitle: '',
      content: '',
      category: categories[0]?.name || 'Hoạt động sản xuất',
      imageUrl: '/src/assets/images/printing_hero_1779242674142.png',
      isPinned: false,
      status: isApprover ? 'published' : 'draft',
      author: currentUser?.fullName || 'Biên Tập Viên'
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (post: NewsPost) => {
    setEditingPost({ ...post });
    setIsEditing(true);
  };

  // Image upload via Supabase Storage
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadingImage(true);
    setNotice(null);

    try {
      const publicUrl = await uploadMediaFile(file, 'posts');
      setEditingPost(prev => ({ ...prev, imageUrl: publicUrl }));
      setNotice({ type: 'success', msg: 'Tải ảnh bài viết lên Supabase Storage thành công!' });
    } catch (err: any) {
      setNotice({ type: 'error', msg: 'Lỗi tải ảnh: ' + (err.message || 'Vui lòng thử lại.') });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSavePost = async (targetStatus?: ArticleWorkflowStatus) => {
    if (!editingPost.title || !editingPost.content) {
      setNotice({ type: 'error', msg: 'Vui lòng nhập đầy đủ Tiêu đề và Nội dung bài viết.' });
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      const statusToSave = targetStatus || editingPost.status || (isApprover ? 'published' : 'draft');
      
      await saveNewsPost({
        ...editingPost,
        status: statusToSave,
        author: editingPost.author || currentUser?.fullName || 'Biên Tập Viên',
        createdBy: editingPost.createdBy || currentUser?.uid
      });

      setNotice({ 
        type: 'success', 
        msg: statusToSave === 'pending_review' 
          ? 'Bài viết đã được gửi duyệt thành công!' 
          : statusToSave === 'published' 
            ? 'Đã đăng bài viết thành công lên trang Tin tức!' 
            : 'Đã lưu bản nháp bài viết!'
      });
      setIsEditing(false);
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi lưu bài viết.' });
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (id: string, title: string) => {
    try {
      await approveAndPublishNews(id);
      setNotice({ type: 'success', msg: `Đã duyệt và đăng bài viết "${title}"!` });
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi duyệt bài.' });
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectModalPostId) return;
    if (!rejectionReasonInput.trim()) {
      alert('Vui lòng nhập lý do từ chối để Biên tập viên chỉnh sửa lại.');
      return;
    }

    try {
      await rejectNewsPost(rejectModalPostId, rejectionReasonInput.trim());
      setNotice({ type: 'info', msg: 'Đã từ chối bài viết và gửi phản hồi đến Biên tập viên.' });
      setRejectModalPostId(null);
      setRejectionReasonInput('');
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi từ chối bài viết.' });
    }
  };

  const handleHide = async (id: string) => {
    try {
      await hideNewsPost(id);
      setNotice({ type: 'info', msg: 'Đã ẩn bài viết khỏi trang công chúng.' });
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi ẩn bài.' });
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

  const getStatusBadge = (status?: ArticleWorkflowStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Đã đăng
          </span>
        );
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" />
            Chờ duyệt
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            Từ chối duyệt
          </span>
        );
      case 'hidden':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <EyeOff className="w-3 h-3 text-slate-500" />
            Đã ẩn
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Edit3 className="w-3 h-3 text-blue-600" />
            Bản nháp
          </span>
        );
    }
  };

  // Status counts
  const countDraft = news.filter(n => (n.status || 'published') === 'draft').length;
  const countPending = news.filter(n => n.status === 'pending_review').length;
  const countPublished = news.filter(n => (n.status || 'published') === 'published').length;
  const countRejected = news.filter(n => n.status === 'rejected').length;

  return (
    <div className="space-y-6">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
              Quản Lý Bài Viết & Tin Tức
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#174A87] text-white">
              {news.length} bài
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình biên tập: <strong className="text-blue-700">Bản nháp</strong> &rarr; <strong className="text-amber-700">Chờ duyệt</strong> &rarr; <strong className="text-emerald-700">Đã đăng</strong>
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-[#174A87]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Bài Viết Mới</span>
        </button>
      </div>

      {/* Workflow Tabs Filter */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-[#174A87] text-white shadow-sm'
              : 'text-slate-600 hover:bg-[#F7FAFF] hover:text-[#174A87]'
          }`}
        >
          Tất cả ({news.length})
        </button>
        <button
          onClick={() => setStatusFilter('pending_review')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'pending_review'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Chờ duyệt ({countPending})</span>
        </button>
        <button
          onClick={() => setStatusFilter('draft')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'draft'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-blue-700 hover:bg-blue-50'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Bản nháp ({countDraft})</span>
        </button>
        <button
          onClick={() => setStatusFilter('published')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'published'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Đã đăng ({countPublished})</span>
        </button>
        <button
          onClick={() => setStatusFilter('rejected')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'rejected'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-rose-700 hover:bg-rose-50'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Bị từ chối ({countRejected})</span>
        </button>
      </div>

      {/* Notifications */}
      {notice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-xs flex items-start gap-3 border ${
            notice.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
            notice.type === 'info' ? 'bg-blue-50 text-blue-900 border-blue-200' :
            'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {notice.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
          <div className="flex-1 font-medium">{notice.msg}</div>
          <button onClick={() => setNotice(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DCE7F2] shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết theo tiêu đề hoặc nội dung..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87] font-medium text-slate-700"
          >
            <option value="all">Tất cả danh mục ({news.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* News Article Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((post) => {
          const isPostPending = post.status === 'pending_review';
          const isPostRejected = post.status === 'rejected';

          return (
            <motion.div
              key={post.id}
              layout
              className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative ${
                isPostPending ? 'border-amber-300 ring-2 ring-amber-200/50' :
                isPostRejected ? 'border-rose-200' : 'border-[#DCE7F2]'
              }`}
            >
              {/* Top thumbnail & Badges */}
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden group">
                  <img
                    src={post.imageUrl || '/src/assets/images/printing_hero_1779242674142.png'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute('src', '/src/assets/images/printing_hero_1779242674142.png');
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  {/* Top floating badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {getStatusBadge(post.status)}
                    {post.isPinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#F5C542] text-[#174A87] shadow">
                        <Pin className="w-2.5 h-2.5" />
                        Ghim
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-[11px] font-medium">
                    <span className="bg-[#174A87]/90 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                      {post.category}
                    </span>
                    <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <h3 className="font-bold text-[#173F72] text-sm line-clamp-2 leading-snug hover:text-[#174A87] transition-colors">
                    {post.title}
                  </h3>

                  {post.subtitle && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 font-normal">
                      {post.subtitle}
                    </p>
                  )}

                  {/* Rejection notice banner */}
                  {isPostRejected && post.rejectionReason && (
                    <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-900 flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Phản hồi từ Người duyệt:</strong>
                        <p className="mt-0.5">{post.rejectionReason}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-400 font-medium">
                    <User className="w-3 h-3" />
                    <span>Tác giả: {post.author || 'Ban Biên Tập'}</span>
                  </div>
                </div>
              </div>

              {/* Action Bar based on Role */}
              <div className="p-4 border-t border-[#DCE7F2] bg-[#F7FAFF] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="p-2 bg-white hover:bg-blue-50 text-[#174A87] rounded-xl border border-[#DCE7F2] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Chỉnh sửa nội dung"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>

                  {/* Approver / Admin Actions */}
                  {isApprover && isPostPending && (
                    <>
                      <button
                        onClick={() => handleApprove(post.id, post.title)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                        title="Duyệt & Đăng bài ngay"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Duyệt & Đăng</span>
                      </button>

                      <button
                        onClick={() => {
                          setRejectModalPostId(post.id);
                          setRejectionReasonInput('');
                        }}
                        className="p-2 bg-white hover:bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                        title="Từ chối duyệt bài viết"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  {/* Editor submit for review button */}
                  {isEditor && (post.status === 'draft' || post.status === 'rejected') && (
                    <button
                      onClick={async () => {
                        await submitNewsForReview(post.id);
                        setNotice({ type: 'success', msg: `Đã gửi bài "${post.title}" đến Người duyệt bài!` });
                      }}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                      title="Gửi duyệt bài viết"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi duyệt</span>
                    </button>
                  )}

                  {/* Hide or Unhide for Approver */}
                  {isApprover && post.status === 'published' && (
                    <button
                      onClick={() => handleHide(post.id)}
                      className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-[#DCE7F2] text-xs font-bold transition-colors cursor-pointer"
                      title="Ẩn bài viết khỏi trang chủ"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Delete button (Approver / Admin only) */}
                {isApprover && (
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="p-2 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                    title="Xóa bài viết vĩnh viễn"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredNews.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#DCE7F2]">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-black text-slate-600 uppercase font-display">Không tìm thấy bài viết nào</h3>
          <p className="text-xs text-slate-400 mt-1">Hãy thử thay đổi từ khóa tìm kiếm hoặc tạo bài viết mới.</p>
        </div>
      )}

      {/* Editor Modal Drawer */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col my-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#DCE7F2]">
                <div>
                  <h2 className="text-base font-black text-[#173F72] font-display uppercase">
                    {editingPost.id ? 'Chỉnh Sửa Bài Viết' : 'Tạo Bài Viết Mới'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hỗ trợ tải ảnh lên Supabase Storage và lưu vào Database thời gian thực
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
                {/* Title */}
                <div>
                  <label className="block font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                    Tiêu Đề Bài Viết *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    placeholder="Nhập tiêu đề tin tức, hoạt động..."
                    className="w-full p-3 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87] font-semibold text-slate-800"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                    Tóm Tắt Ngắn (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={editingPost.subtitle || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, subtitle: e.target.value })}
                    placeholder="Mô tả tóm tắt ngắn gọn hiển thị ngoài danh sách..."
                    className="w-full p-3 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87] text-slate-700"
                  />
                </div>

                {/* Category & Author & Pinned */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                      Chuyên Mục *
                    </label>
                    <select
                      value={editingPost.category || 'Hoạt động sản xuất'}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      className="w-full p-3 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87] font-semibold"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                      Tác Giả / Người Đăng
                    </label>
                    <input
                      type="text"
                      value={editingPost.author || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                      className="w-full p-3 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!editingPost.isPinned}
                        onChange={(e) => setEditingPost({ ...editingPost, isPinned: e.target.checked })}
                        className="w-4 h-4 text-[#174A87] rounded border-[#DCE7F2]"
                      />
                      <span className="font-bold text-[#173F72]">Ghim lên đầu trang</span>
                    </label>
                  </div>
                </div>

                {/* Image Upload & Preview */}
                <div>
                  <label className="block font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                    Hình Ảnh Đại Diện Bài Viết
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#F7FAFF] border border-[#DCE7F2] rounded-2xl">
                    <div className="w-32 h-20 bg-slate-200 rounded-xl overflow-hidden shrink-0 border border-[#DCE7F2]">
                      <img
                        src={editingPost.imageUrl || '/src/assets/images/printing_hero_1779242674142.png'}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', '/src/assets/images/printing_hero_1779242674142.png');
                        }}
                      />
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={uploadingImage}
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-[#174A87] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-[#123C70] transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingImage ? 'Đang tải lên Supabase...' : 'Tải Ảnh Mới Từ Máy'}</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={editingPost.imageUrl || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, imageUrl: e.target.value })}
                        placeholder="Hoặc dán URL ảnh trực tiếp..."
                        className="w-full p-2 bg-white border border-[#DCE7F2] rounded-lg text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                    Nội Dung Bài Viết Chi Tiết *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={editingPost.content || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    placeholder="Nhập nội dung đầy đủ bài viết..."
                    className="w-full p-3 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87] font-normal leading-relaxed text-slate-800"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#DCE7F2] flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#DCE7F2] text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Hủy Bỏ
                </button>

                {/* Editor can save draft or send for review */}
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSavePost('draft')}
                  className="px-4 py-2.5 rounded-xl bg-blue-50 text-[#174A87] font-bold hover:bg-blue-100 border border-blue-200 cursor-pointer"
                >
                  Lưu Bản Nháp
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSavePost('pending_review')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Duyệt Bài</span>
                </button>

                {/* Approver / Admin can Publish directly */}
                {isApprover && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSavePost('published')}
                    className="px-5 py-2.5 rounded-xl bg-[#174A87] hover:bg-[#123C70] text-white font-bold shadow-md shadow-[#174A87]/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Duyệt & Đăng Ngay</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Modal with Reason Input */}
      {rejectModalPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-black text-rose-700 uppercase font-display mb-2 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Từ Chối Duyệt Bài Viết
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Vui lòng nhập lý do hoặc yêu cầu chỉnh sửa để thông báo đến Biên tập viên:
            </p>
            <textarea
              rows={4}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="Ví dụ: Cần bổ sung thêm thông tin số liệu kiểm định chất lượng, thay ảnh đại diện độ phân giải cao hơn..."
              className="w-full p-3 bg-rose-50/50 border border-rose-200 rounded-xl text-xs focus:outline-none focus:border-rose-500 text-slate-800"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setRejectModalPostId(null)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow cursor-pointer"
              >
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
