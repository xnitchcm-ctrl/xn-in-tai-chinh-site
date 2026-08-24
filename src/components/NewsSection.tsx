import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Pin, 
  Image as ImageIcon, 
  Video, 
  Tag, 
  Calendar, 
  User, 
  Check, 
  Lock, 
  Unlock, 
  Settings, 
  Upload, 
  X, 
  FileText, 
  Grid,
  ChevronRight,
  Sparkles,
  Search,
  Eye,
  AlertCircle
} from 'lucide-react';
import { newsService, NewsPost, NEWS_CATEGORIES } from '../utils/firebase';
import { getSupabaseClient, isSupabaseConfigured } from '../utils/supabase';

interface NewsSectionProps {
  onBackToHome: () => void;
  preSelectedCategory?: string | null;
}

export default function NewsSection({ onBackToHome, preSelectedCategory = null }: NewsSectionProps) {
  const [newsList, setNewsList] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected article for full detail viewing modal
  const [selectedArticle, setSelectedArticle] = useState<NewsPost | null>(null);

  // ADMIN & CMS States
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');
  
  // Create / Edit Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  
  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState(NEWS_CATEGORIES[0]);
  const [formContent, setFormContent] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [formAuthor, setFormAuthor] = useState('Phòng Hành chính - Tổng hợp');
  
  // Local upload state references
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [videoUploadLoading, setVideoUploadLoading] = useState(false);

  // Fetch only published news from Supabase news_articles
  const fetchPublishedNews = async () => {
    setLoading(true);
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('news_articles')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Lỗi khi đọc tin tức published từ Supabase:', error);
        } else if (data) {
          const mapped: NewsPost[] = data.map((item: any) => ({
            id: item.id,
            title: item.title || '',
            subtitle: item.summary || '',
            content: item.content || '',
            category: item.category || 'Hoạt động sản xuất',
            imageUrl: item.image || '/src/assets/images/printing_hero_1779242674142.png',
            videoUrl: item.video_url || undefined,
            isPinned: Boolean(item.featured),
            author: item.author || 'Ban Biên Tập',
            status: item.status || 'published',
            rejectionReason: item.reject_reason || '',
            createdBy: item.author_id,
            reviewedBy: item.reviewed_by,
            publishedAt: item.published_at,
            viewsCount: item.views || 0,
            createdAt: item.created_at || new Date().toISOString()
          }));
          setNewsList(mapped);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Lỗi kết nối Supabase news:', e);
      }
    }

    setNewsList([]);
    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    fetchPublishedNews();
  }, []);

  // Sync passed category filter on navigation triggers
  useEffect(() => {
    if (preSelectedCategory && NEWS_CATEGORIES.includes(preSelectedCategory)) {
      setFilterCategory(preSelectedCategory);
      // Smooth scroll layout view
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } else if (preSelectedCategory === 'All') {
      setFilterCategory('All');
    }
  }, [preSelectedCategory]);

  const refreshNewsList = async () => {
    const docs = await newsService.getAllNews();
    setNewsList(docs);
  };

  // Safe passcode verification (e.g. standard passcode 79) to preview secure CMS area
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === '79' || adminPasscode.toLowerCase() === 'admin' || adminPasscode === '12345') {
      setIsAdminMode(true);
      setShowAdminLoginModal(false);
      setAdminPasscode('');
      setAdminError('');
    } else {
      setAdminError('Mật mã kích hoạt quản trị viên không chính xác. Thử lại: 79 hoặc 12345');
    }
  };

  // Open creation modal
  const handleOpenCreateForm = () => {
    setEditingPost(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormCategory(NEWS_CATEGORIES[0]);
    setFormContent('');
    setFormImageUrl('https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80');
    setFormVideoUrl('');
    setFormIsPinned(false);
    setFormAuthor('Phòng Kinh doanh - Nghiệp vụ');
    setIsFormModalOpen(true);
  };

  // Open edit modal prefilled
  const handleOpenEditForm = (post: NewsPost) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormSubtitle(post.subtitle);
    setFormCategory(post.category);
    setFormContent(post.content);
    setFormImageUrl(post.imageUrl);
    setFormVideoUrl(post.videoUrl || '');
    setFormIsPinned(post.isPinned);
    setFormAuthor(post.author || 'Ban Điều hành Sản xuất');
    setIsFormModalOpen(true);
  };

  // Handle Form Submission
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim() || !formCategory) {
      alert('Vui lòng điền đầy đủ các thông tin tiêu đề, thể loại và nội dung bài viết!');
      return;
    }

    setLoading(true);
    const postData = {
      title: formTitle,
      subtitle: formSubtitle,
      content: formContent,
      category: formCategory,
      imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      videoUrl: formVideoUrl || undefined,
      isPinned: formIsPinned,
      author: formAuthor,
      createdAt: editingPost ? editingPost.createdAt : new Date().toISOString()
    };

    try {
      if (editingPost) {
        await newsService.updateNews(editingPost.id, postData);
      } else {
        await newsService.addNews(postData);
      }
      setIsFormModalOpen(false);
      await refreshNewsList();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu bài viết của bạn.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Deletion
  const handleDeletePost = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết: "${name}" không?`)) {
      setLoading(true);
      try {
        await newsService.deleteNews(id);
        await refreshNewsList();
      } catch (err) {
        console.error(err);
        alert('Lỗi khi thực hiện xóa bải viết.');
      } finally {
        setLoading(false);
      }
    }
  };

  // File Upload emulation via base64 for absolute reliability in container context
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormImageUrl(reader.result as string);
      setImageUploadLoading(false);
    };
    reader.onerror = () => {
      setImageUploadLoading(false);
      alert('Lỗi đọc ảnh.');
    };
    reader.readAsDataURL(file);
  };

  // Video Upload emulation converting to embed simulation or small file base64 data stream
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoUploadLoading(true);
    // Simulate uploading a larger file safely
    setTimeout(() => {
      // Give a dummy secure template video link representation
      setFormVideoUrl('https://www.w3schools.com/html/mov_bbb.mp4');
      setVideoUploadLoading(false);
    }, 1200);
  };

  // Categorize list items
  const filteredPosts = newsList.filter(post => {
    const matchesCategory = filterCategory === 'All' || post.category === filterCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pinnedPosts = filteredPosts.filter(p => p.isPinned);
  const regularPosts = filteredPosts.filter(p => !p.isPinned);

  // Sort: pins always flow on top inside columns
  const sortedDisplayPosts = [...pinnedPosts, ...regularPosts];

  return (
    <div id="dynamic-news-page" className="min-h-screen bg-[#F8FBFF] text-slate-800 pt-24 pb-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(#174A8715_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-60"></div>
      
      {/* Dynamic Glowing subtle background graphics */}
      <div className="absolute top-24 left-1/4 w-96 h-96 bg-[#174A87]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-10 w-[450px] h-[450px] bg-[#F5C542]/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb Line */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#4B637D] font-display tracking-widest uppercase mb-6 select-none bg-white py-2.5 px-4 rounded-xl border border-[#DCE7F2] w-fit shadow-sm">
          <button onClick={onBackToHome} className="hover:text-[#174A87] transition-colors flex items-center gap-1">
            TRANG CHỦ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#7B8FA4]" />
          <span className="text-[#174A87] font-bold">TIN TỨC & HOẠT ĐỘNG XÍ NGHIỆP</span>
        </div>

        {/* Hero Section Banner layout - Corporate Blue Gradient Banner */}
        <div 
          style={{ background: 'linear-gradient(135deg, #123F7A, #1C5CA8)' }}
          className="border border-[#1C5CA8]/30 rounded-2xl p-8 sm:p-12 mb-10 relative overflow-hidden shadow-xl text-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F5C542]/20 border border-[#F5C542]/40 rounded-full text-[10px] uppercase font-black tracking-widest text-[#F5C542] font-display mb-5">
              <Sparkles className="w-3.5 h-3.5 animate-bounce" /> Xổ số kiến thiết thành phố hồ chí minh
            </div>
            
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white mb-4 uppercase leading-tight">
              TIN TỨC & HOẠT ĐỘNG XÍ NGHIỆP
            </h1>
            
            <div className="w-20 h-1 bg-[#F5C542] rounded-full mb-5"></div>
            
            <p className="text-blue-100 font-sans text-sm sm:text-base leading-relaxed max-w-3xl">
              Cập nhật hoạt động sản xuất, công nghệ in bảo mật, công tác đoàn thể và các thông báo nổi bật.
            </p>
          </div>

          {/* Golden security accents */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-[#F5C542]/10 via-transparent to-transparent pointer-events-none hidden md:block"></div>
        </div>

        {/* Secondary Navigation Filter Column & Action controllers */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 mb-10 bg-white p-4 rounded-2xl border border-[#DCE7F2] shadow-[0_4px_20px_rgba(20,67,120,0.06)]">
          
          {/* Main categories scrollable list */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin scrollbar-thumb-amber-500 max-w-full">
            <button
              onClick={() => setFilterCategory('All')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase font-display whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === 'All'
                  ? 'bg-[#F5C542] text-[#173B63] font-extrabold shadow-sm'
                  : 'bg-[#EEF4FB] text-[#315B85] hover:bg-[#E2EDFA] hover:text-[#174A87]'
              }`}
            >
              TẤT CẢ ({newsList.length})
            </button>
            {NEWS_CATEGORIES.map((cat) => {
              const count = newsList.filter(p => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase font-display whitespace-nowrap transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-[#F5C542] text-[#173B63] font-extrabold shadow-sm'
                      : 'bg-[#EEF4FB] text-[#315B85] hover:bg-[#E2EDFA] hover:text-[#174A87]'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Search filter input + Admin switch */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0 justify-end">
            
            {/* Search Input Box */}
            <div className="relative w-full sm:w-60 leading-none">
              <input
                type="text"
                placeholder="Tìm từ khóa tin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-9 text-xs bg-[#F4F8FD] border border-[#D7E4F2] rounded-xl focus:outline-none focus:border-[#174A87] focus:bg-white text-[#294E73] placeholder-[#7B8FA4] transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#7B8FA4] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Admin CMS switch */}
            {isAdminMode ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleOpenCreateForm}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase font-display rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 font-bold" /> Đăng tin mới
                </button>
                <button
                  onClick={() => setIsAdminMode(false)}
                  className="p-2.5 bg-[#EEF5FC] hover:bg-amber-500/10 border border-[#DCE7F2] text-[#174A87] hover:text-amber-600 rounded-xl text-xs transition-colors cursor-pointer"
                  title="Thoát chế độ Quản trị CMS"
                >
                  <Unlock className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAdminLoginModal(true)}
                className="px-4 py-2.5 bg-[#EEF5FC] border border-[#DCE7F2] hover:bg-[#174A87] hover:text-white hover:border-[#174A87] text-[#174A87] text-xs font-black uppercase font-display rounded-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-[#F5C542]" /> CMS Quản trị
              </button>
            )}

          </div>
        </div>

        {/* Loading skeleton screen logic */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white border border-[#E3ECF7] rounded-2xl h-[420px] p-6 flex flex-col justify-between animate-pulse shadow-sm">
                <div className="space-y-4">
                  <div className="h-44 bg-[#EEF5FC] rounded-xl w-full"></div>
                  <div className="h-3 bg-[#EEF5FC] rounded w-1/4"></div>
                  <div className="h-5 bg-[#EEF5FC] rounded w-5/6"></div>
                  <div className="h-3 bg-[#EEF5FC] rounded w-full"></div>
                  <div className="h-3 bg-[#EEF5FC] rounded w-2/3"></div>
                </div>
                <div className="h-8 bg-[#EEF5FC] rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-24 bg-white border border-[#DCE7F2] rounded-2xl shadow-sm">
                <AlertCircle className="w-12 h-12 text-[#7B8FA4] mx-auto mb-4" />
                <h3 className="text-lg font-bold font-display uppercase tracking-wider text-[#173F72]">Không tìm thấy bài viết</h3>
                <p className="text-xs text-[#5B6F85] mt-2 max-w-md mx-auto">
                  Hãy điều chỉnh lại thông số chuyên mục lọc hoặc cụm từ tìm kiếm của bạn để hiển thị chuẩn xác.
                </p>
                <button 
                  onClick={() => { setFilterCategory('All'); setSearchQuery(''); }}
                  className="mt-6 px-5 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-black uppercase font-display transition-colors cursor-pointer shadow-sm"
                >
                  Xóa lọc dữ liệu
                </button>
              </div>
            ) : (
              /* PREMIUM MASONRY NEWS LAYOUT - LIGHT CLEAN CARDS */
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 [column-fill:balance]">
                {sortedDisplayPosts.map((post) => (
                  <motion.article
                    key={post.id}
                    layoutId={`post-${post.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="break-inside-avoid flex flex-col bg-white border border-[#E3ECF7] hover:border-[#174A87]/30 shadow-[0_8px_24px_rgba(20,67,120,0.08)] hover:shadow-[0_12px_32px_rgba(20,67,120,0.14)] rounded-2xl overflow-hidden transition-all duration-300 group relative"
                  >
                    {/* Header Image or Pinned visual */}
                    <div className="relative overflow-hidden h-48 sm:h-52 bg-[#EEF5FC] shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 pointer-events-none"></div>
                      
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        referrerPolicy="no-referrer"
                      />

                      {/* Floating Category Tag */}
                      <span className="absolute top-4 left-4 z-20 px-2.5 py-1 text-[10px] font-bold tracking-wider bg-[#174A87] text-white uppercase rounded shadow-sm border border-[#174A87]/20">
                        {post.category}
                      </span>

                      {/* Display Pin state banner */}
                      {post.isPinned && (
                        <div className="absolute top-4 right-4 z-25 flex items-center gap-1 bg-[#F5C542] text-[#173B63] px-2.5 py-1 text-[10px] font-black uppercase rounded shadow-md">
                          <Pin className="w-3 h-3 fill-[#173B63]" /> GHIM NỔI BẬT
                        </div>
                      )}

                      {/* Video Embed Symbol Marker */}
                      {post.videoUrl && (
                        <span className="absolute bottom-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/30 hover:scale-110 transition-transform cursor-pointer">
                          <Video className="w-4 h-4 text-[#F5C542]" />
                        </span>
                      )}
                    </div>

                    {/* Content Details Block */}
                    <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-3.5">
                        
                        {/* Meta lines */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-[#7B8FA4] font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#7B8FA4]" />
                            {new Date(post.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1 truncate max-w-[150px]">
                            <User className="w-3.5 h-3.5 text-[#7B8FA4]" />
                            {post.author || 'XN In Tài Chính'}
                          </span>
                        </div>

                        {/* Heading */}
                        <h3 className="text-base sm:text-lg font-bold font-display leading-snug text-[#173F72] tracking-tight group-hover:text-[#174A87] transition-colors duration-300">
                          {post.title}
                        </h3>

                        {/* Short Subtitle */}
                        {post.subtitle && (
                          <p className="text-xs text-[#5B6F85] mt-1 italic font-normal leading-relaxed">
                            {post.subtitle}
                          </p>
                        )}

                        <div className="w-full h-px bg-[#E3ECF7] my-2"></div>

                        {/* Description content */}
                        <p className="text-xs sm:text-xs text-[#5B6F85] leading-relaxed font-normal hover:text-[#294E73] transition-colors duration-200 line-clamp-6">
                          {post.content}
                        </p>
                      </div>

                      {/* Interaction footer actions of the post card */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E3ECF7]">
                        {/* Public Link button */}
                        <button 
                          onClick={() => setSelectedArticle(post)}
                          className="text-[11px] font-black uppercase text-[#174A87] hover:text-[#123C70] transition-colors tracking-widest flex items-center gap-1 cursor-pointer font-display"
                        >
                          Xem chi tiết <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Administrative trigger controls hover layer */}
                        {isAdminMode && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditForm(post)}
                              className="p-1.5 bg-[#EEF5FC] hover:bg-[#174A87] border border-[#DCE7F2] text-[#174A87] hover:text-white rounded-lg transition-all cursor-pointer text-xs"
                              title="Chỉnh sửa bài báo"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id, post.title)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-600 border border-rose-200 text-rose-600 hover:text-white rounded-lg transition-all cursor-pointer text-xs"
                              title="Xóa bài báo này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </>
        )}

      </div>

      {/* ADMIN CMS REGISTRATION LOCK CONTROL MODAL */}
      <AnimatePresence>
        {showAdminLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminLoginModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border border-[#DCE7F2] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-6 text-[#173F72] font-sans"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#EEF5FC] border border-[#DCE7F2] rounded-full flex items-center justify-center mx-auto text-[#174A87] mb-3">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display uppercase tracking-widest text-[#173F72]">XÁC THỰC QUẢN TRỊ CMS</h3>
                <p className="text-[11px] text-[#5B6F85] mt-1 max-w-[280px] mx-auto">
                  Nhập mật mã để kích hoạt quyền đăng tin, sửa bài và ghim văn kiện bảo mật.
                </p>
              </div>

              <form onSubmit={handleAdminAuth} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#4B637D] mb-2 font-display">Mật mã truy cập</label>
                  <input
                    type="password"
                    placeholder="Mật mã: 79 hoặc 12345"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F4F8FD] border border-[#D7E4F2] rounded-xl focus:outline-none focus:border-[#174A87] focus:bg-white text-[#294E73] text-sm"
                    autoFocus
                  />
                </div>

                {adminError && (
                  <p className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg text-center font-medium">
                    {adminError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminLoginModal(false)}
                    className="flex-1 py-2.5 bg-[#EEF5FC] border border-[#DCE7F2] hover:bg-[#E2EDFA] rounded-xl text-xs font-bold font-display uppercase transition-colors cursor-pointer text-[#315B85]"
                  >
                    HỦY
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#F5C542] text-[#173B63] hover:bg-[#174A87] hover:text-white rounded-xl text-xs font-black font-display uppercase transition-all cursor-pointer shadow-sm"
                  >
                    KÍCH HOẠT
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE & EDIT FORM MODAL CONTAINER */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              className="bg-white border border-[#DCE7F2] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh] text-[#173F72] font-sans"
            >
              {/* Form heading */}
              <div className="p-6 border-b border-[#E3ECF7] flex items-center justify-between shrink-0 bg-[#F8FBFF]">
                <div className="flex items-center gap-2.5">
                  <Settings className="w-5 h-5 text-[#174A87] animate-spin" />
                  <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-widest text-[#173F72]">
                    {editingPost ? 'CẬP NHẬT BÀI VIẾT DOANH NGHIỆP' : 'SOẠN THẢO BẢN TIN TRUYỀN THÔNG MỚI'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-1 hover:bg-[#EEF5FC] rounded-full transition-colors cursor-pointer text-[#7B8FA4] hover:text-[#173F72]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Scroll Content */}
              <form onSubmit={handleSavePost} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                
                {/* Title and Category block row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  {/* Category dropdown Selection */}
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-[#4B637D] mb-2 font-display">CHUYÊN MỤC TIN</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F4F8FD] border border-[#D7E4F2] rounded-xl focus:outline-none focus:border-[#174A87] text-xs font-bold text-[#173F72] uppercase font-display"
                    >
                      {NEWS_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Title input */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-[#4B637D] mb-2 font-display">Tiêu đề bài viết (*)</label>
                    <input
                      type="text"
                      placeholder="Nhập tiêu đề chính hiển thị..."
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-[#F4F8FD] border border-[#D7E4F2] rounded-xl focus:outline-none focus:border-[#174A87] text-xs leading-relaxed text-[#173F72] font-semibold"
                    />
                  </div>

                </div>

                {/* Subtitle / Short description */}
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#4B637D] mb-2 font-display">Mô tả tóm tắt nội dung (Slogan, chú ý)</label>
                  <input
                    type="text"
                    placeholder="Nhập đoạn mô tả ngắn dẫn xuất (hiển thị nghiêng bên dưới tiêu đề)..."
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F4F8FD] border border-[#D7E4F2] rounded-xl focus:outline-none focus:border-[#174A87] text-xs text-[#294E73]"
                  />
                </div>

                {/* Form Image Cover Uploader / Field */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-[#F8FBFF] border border-[#DCE7F2]">
                  
                  {/* cover image input URL or Upload button */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-[#4B637D] mb-2 font-display">Ảnh bìa bài báo (URL hoặc Tải lên)</label>
                    
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      className="w-full px-4 py-2 text-xs bg-[#F4F8FD] border border-[#D7E4F2] rounded-xl focus:outline-none focus:border-[#174A87] text-[#294E73] mb-3"
                    />

                    {/* True Upload trigger input */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={imageFileInputRef}
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageFileInputRef.current?.click()}
                      className="w-full py-2 bg-[#EEF5FC] border border-[#DCE7F2] hover:bg-[#174A87] hover:text-white text-xs font-bold text-[#174A87] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {imageUploadLoading ? (
                        <div className="w-4 h-4 border-2 border-[#174A87] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      Tải lên tệp ảnh từ máy
                    </button>
                  </div>

                  {/* Attachment image preview frame */}
                  <div className="h-28 sm:h-full bg-[#EEF5FC] rounded-xl overflow-hidden border border-[#DCE7F2] flex items-center justify-center relative">
                    {formImageUrl ? (
                      <img src={formImageUrl} className="w-full h-full object-cover" alt="Preview ảnh" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-[10px] text-[#7B8FA4] font-mono">CHƯA BẢO ĐỊNH ẢNH</span>
                    )}
                  </div>

                </div>

                {/* Video & Author info row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Video embed URL */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-[#4B637D] mb-2 font-display">Video đính kèm (URL mp4 hoặc mẫu)</label>
                    <input
                      type="text"
                      placeholder="Chừa trống nếu không đính kèm..."
                      value={formVideoUrl}
                      onChange={(e) => setFormVideoUrl(e.target.value)}
                      className="w-full px-4 py-2 text-xs bg-[#F4F8FD] border border-[#D7E4F2] rounded-xl focus:outline-none focus:border-[#174A87] text-[#294E73] mb-2"
                    />
                    
                    {/* true video input file reference */}
                    <input
                      type="file"
                      accept="video/*"
                      ref={videoFileInputRef}
                      onChange={handleVideoFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="w-full py-1.5 bg-[#EEF5FC] border border-[#DCE7F2] hover:bg-[#174A87] hover:text-white text-[10px] font-bold text-[#174A87] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {videoUploadLoading ? (
                        <div className="w-3 h-3 border-2 border-[#174A87] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Video className="w-3 h-3" />
                      )}
                      Mã hóa Video đính kèm
                    </button>
                  </div>

                  {/* Author or agency */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-[#4B637D] mb-2 font-display">Tác giả biên soạn / Ban phòng ban</label>
                    <input
                      type="text"
                      placeholder="Phòng Kinh doanh / Công đoàn..."
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full px-4 py-2 text-xs bg-[#F4F8FD] border border-[#D7E4F2] rounded-xl focus:outline-none focus:border-[#174A87] text-[#294E73]"
                    />
                    
                    {/* Pin checkpoint switcher */}
                    <div className="mt-4 flex items-center gap-2 select-none cursor-pointer" onClick={() => setFormIsPinned(!formIsPinned)}>
                      <input
                        type="checkbox"
                        checked={formIsPinned}
                        onChange={(e) => setFormIsPinned(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#174A87] rounded"
                      />
                      <span className="text-[11px] font-bold text-[#173F72] font-display uppercase tracking-wider flex items-center gap-1">
                        <Pin className="w-3.5 h-3.5 text-[#F5C542] fill-[#F5C542]" /> Ghim bài báo này lên hàng nổi bật
                      </span>
                    </div>
                  </div>

                </div>

                {/* Content text area body details */}
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#4B637D] mb-2 font-display">Nội dung văn bản chi tiết (*)</label>
                  <textarea
                    placeholder="Viết nội dung bản tin, hoạt động sản xuất, kỹ thuật số, công nghệ mới tại đây..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    required
                    rows={8}
                    className="w-full px-4 py-3 bg-[#F4F8FD] border border-[#D7E4F2] rounded-xl focus:outline-none focus:border-[#174A87] text-xs leading-relaxed text-[#294E73] font-sans"
                  />
                </div>

                {/* Action buttons footer */}
                <div className="pt-4 border-t border-[#E3ECF7] flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-5 py-2.5 bg-[#EEF5FC] border border-[#DCE7F2] hover:bg-[#E2EDFA] text-xs font-bold font-display uppercase rounded-xl transition-colors cursor-pointer text-[#315B85]"
                  >
                    HỦY BỎ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#F5C542] text-[#173B63] hover:bg-[#174A87] hover:text-white text-xs font-black font-display uppercase rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    {editingPost ? 'CẬP NHẬT BÀI' : 'ĐĂNG BẢN TIN'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ARTICLE DETAIL FULL READER MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto"
            >
              {/* Modal Header Bar */}
              <div className="px-6 py-4 border-b border-[#E3ECF7] flex items-center justify-between bg-[#F8FBFF] shrink-0">
                <span className="px-3 py-1 bg-[#174A87] text-white text-[11px] font-bold rounded-lg uppercase tracking-wider">
                  {selectedArticle.category}
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-black text-[#173F72] font-display leading-tight">
                  {selectedArticle.title}
                </h1>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-[#174A87]" />
                    {new Date(selectedArticle.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4 text-[#174A87]" />
                    {selectedArticle.author || 'XN In Tài Chính'}
                  </span>
                </div>

                {/* Image */}
                {selectedArticle.imageUrl && (
                  <div className="rounded-2xl overflow-hidden bg-slate-100 border border-[#DCE7F2]">
                    <img 
                      src={selectedArticle.imageUrl} 
                      alt={selectedArticle.title} 
                      className="w-full max-h-96 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Subtitle */}
                {selectedArticle.subtitle && (
                  <p className="text-sm font-semibold text-slate-700 italic bg-blue-50/60 p-4 rounded-xl border border-blue-100/60">
                    {selectedArticle.subtitle}
                  </p>
                )}

                {/* Full Article Content */}
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
                  {selectedArticle.content}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[#E3ECF7] bg-[#F8FBFF] flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 bg-[#174A87] hover:bg-[#123C70] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Đóng bài viết
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
