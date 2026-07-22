import React, { useState } from 'react';
import { useCMS, HeroSlide } from '../context/CMSContext';
import { NewsPost } from '../utils/firebase';
import { ServiceItem, GalleryItem, JobVacancy } from '../types';
import { 
  LogIn, 
  LogOut, 
  Settings, 
  Layers, 
  Image as ImageIcon, 
  Briefcase, 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  CheckCircle, 
  X, 
  ArrowLeft,
  Upload,
  Globe,
  Database,
  Phone,
  Mail,
  Shield,
  Activity
} from 'lucide-react';

export default function AdminPanel({ onBackToHome }: { onBackToHome: () => void }) {
  const {
    companyInfo,
    statistics,
    slides,
    services,
    gallery,
    vacancies,
    news,
    loading,
    isAdmin,
    adminEmail,
    firebaseConnected,
    loginAdmin,
    logoutAdmin,
    saveCompanyInfo,
    saveStatistics,
    saveSlides,
    saveService,
    deleteService,
    saveGalleryItem,
    deleteGalleryItem,
    saveVacancy,
    deleteVacancy,
    saveNewsPost,
    deleteNewsPost
  } = useCMS();

  // Authentication screen states
  const [email, setEmail] = useState('xnitchcm@gmail.com');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'general' | 'slides' | 'services' | 'news' | 'recruitment' | 'gallery'>('general');

  // Multi-use feedback overlay
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Drag and drop hovering state
  const [isDragging, setIsDragging] = useState(false);

  // Active edit item states
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingVacancy, setEditingVacancy] = useState<JobVacancy | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [editingNews, setEditingNews] = useState<NewsPost | null>(null);

  // Create form modal toggles
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isVacancyModalOpen, setIsVacancyModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);

  // Local state modifiers for general settings
  const [localCompanyInfo, setLocalCompanyInfo] = useState({ ...companyInfo });
  const [localStatistics, setLocalStatistics] = useState([...statistics]);
  const [localSlides, setLocalSlides] = useState([...slides]);

  // Handle auto-dissolving notices
  const triggerNotification = (type: 'success' | 'error', message: string) => {
    setSaveStatus({ type, message });
    setTimeout(() => {
      setSaveStatus(null);
    }, 4000);
  };

  // Authentication executor
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      await loginAdmin(email, password);
      // Synchronize locals upon login
      setLocalCompanyInfo({ ...companyInfo });
      setLocalStatistics([...statistics]);
      setLocalSlides([...slides]);
    } catch (err: any) {
      setAuthError(err.message || 'Lỗi đăng nhập. Vui lòng xác thực lại mật khẩu.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất khỏi trang quản trị?')) {
      await logoutAdmin();
    }
  };

  const handleGeneralSave = async () => {
    try {
      await saveCompanyInfo(localCompanyInfo);
      triggerNotification('success', 'Đã lưu thông tin liên hệ và cài đặt doanh nghiệp thành công!');
    } catch (err) {
      triggerNotification('error', 'Lưu thất bại: ' + String(err));
    }
  };

  const handleStatsSave = async () => {
    try {
      await saveStatistics(localStatistics);
      triggerNotification('success', 'Đã cập nhật số liệu thống kê realtime!');
    } catch (err) {
      triggerNotification('error', 'Lưu thất bại: ' + String(err));
    }
  };

  const handleSlidesSave = async () => {
    try {
      await saveSlides(localSlides);
      triggerNotification('success', 'Đã đồng bộ các slide banner trang chủ!');
    } catch (err) {
      triggerNotification('error', 'Lưu thất bại: ' + String(err));
    }
  };

  // Drag and Drop Base64 converter
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, callback: (base64: string) => void) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      convertFileToBase64(file, callback);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      convertFileToBase64(file, callback);
    }
  };

  const convertFileToBase64 = (file: File, callback: (base64: string) => void) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chỉ tải lên tài liệu định dạng hình ảnh.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa là 2MB để đảm bảo hiệu suất cơ sở dữ liệu.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Drag-and-drop file upload container block
  const ImageUploaderArea = ({ value, onChange, label }: { value: string, onChange: (val: string) => void, label: string }) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">{label}</label>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => handleFileDrop(e, onChange)}
          className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all ${
            isDragging 
              ? 'border-brand-gold bg-amber-500/10' 
              : value 
                ? 'border-emerald-500/40 bg-[#0F3268]/60' 
                : 'border-[#123A78] bg-[#0F3268]/40 hover:border-brand-gold/40'
          }`}
        >
          {value ? (
            <div className="flex flex-col items-center gap-3">
              <img src={value} alt="Preview" className="h-28 w-auto rounded-lg object-contain shadow-md border border-slate-700" referrerPolicy="no-referrer" />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-extrabold bg-rose-600 hover:bg-rose-500 text-white rounded transition"
                >
                  Xóa ảnh
                </button>
                <span className="text-[10px] text-slate-400 font-mono">Đã load ảnh thành công (Base64)</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5">
              <Upload className="w-8 h-8 text-slate-400 animate-pulse" />
              <p className="text-xs text-slate-300 font-sans">
                Kéo & thả ảnh vào đây, hoặc <span className="text-brand-gold font-extrabold cursor-pointer underline hover:text-yellow-400">chọn file</span>
              </p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">Mức tối đa: 2MB | PNG, JPG, WEBP</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileInputChange(e, onChange)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#123A78] text-white flex flex-col items-center justify-center gap-4">
        <Activity className="w-10 h-10 text-brand-gold animate-spin" />
        <p className="text-sm font-display tracking-widest font-black text-amber-100 uppercase">Đang đồng bộ cơ sở dữ liệu CMS...</p>
      </div>
    );
  }

  // --- RENDER 1: AUTHENTICATION INTERFACE (Email/Password Login) ---
  if (!isAdmin) {
    return (
      <div className="min-h-screen w-full bg-[#123A78] flex items-center justify-center relative p-4 overflow-hidden">
        
        {/* Decorative Grid Overlays */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-scanline z-0 pointer-events-none"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-blue/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-md bg-[#0F3268]/90 border border-amber-500/20 rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
          
          <div className="flex flex-col items-center text-center gap-3.5 mb-8">
            <div className="w-14 h-14 rounded-full bg-brand-blue flex items-center justify-center border border-amber-300">
              <Shield className="w-7 h-7 text-brand-gold" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black tracking-widest text-white uppercase">
                HỆ THỐNG QUẢN TRỊ CMS
              </h1>
              <p className="text-[10px] text-brand-gold font-bold uppercase tracking-wider mt-1 select-none">
                XÍ NGHIỆP IN TÀI CHÍNH
              </p>
            </div>
            <div className="w-12 h-0.5 bg-brand-gold rounded-full"></div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {authError && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs rounded-lg font-sans">
                {authError}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-300 tracking-widest uppercase font-extrabold font-display">Tài khoản Admin (Email)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="xnitchcm@gmail.com"
                className="px-4 py-3 bg-[#123A78] border border-slate-700 focus:border-brand-gold text-white rounded-lg text-xs tracking-wider outline-none font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-300 tracking-widest uppercase font-extrabold font-display">Mật khẩu xác thực</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="px-4 py-3 bg-[#123A78] border border-slate-700 focus:border-brand-gold text-white rounded-lg text-xs tracking-wider outline-none font-mono"
              />
              <span className="text-[9px] text-slate-400">Tài khoản in nghiệp vụ bảo mật được tạo tức thì tại lượt đăng nhập đầu tiên.</span>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="mt-2 w-full py-3 bg-brand-gold hover:bg-yellow-400 text-brand-blue font-display font-extrabold text-xs tracking-widest uppercase transition-all rounded shadow-md hover:scale-[1.01] active:translate-y-px cursor-pointer flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <span>ĐANG XÁC THỰC...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-brand-blue-dark" />
                  <span>ĐĂNG NHẬP HỆ THỐNG</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={onBackToHome}
              className="mt-1 w-full py-2.5 bg-[#0B2755] text-slate-300 hover:bg-[#0F3268] text-xs tracking-widest font-display font-medium rounded transition ease-all"
            >
              QUAY VỀ TRANG CHỦ
            </button>
          </form>

          {/* Secure watermark indicators */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-500 font-mono font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <Database className="w-3 h-3 text-brand-gold/60" />
              DB: {firebaseConnected ? 'CLOUDFIRESTORE' : 'LOCAL CACHING'}
            </span>
            <span>VER: 2026.05</span>
          </div>

        </div>
      </div>
    );
  }

  // --- RENDER 2: MASTER ADMIN DASHBOARD MANAGER ---
  return (
    <div className="min-h-screen bg-[#123A78] text-slate-100 flex flex-col font-sans">
      
      {/* 1. ADMIN GLOBAL HEADER PANEL */}
      <header className="bg-[#0F3268] border-b border-amber-500/10 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 z-40 sticky top-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-lg text-brand-blue shrink-0">
            <Settings className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-display font-black tracking-wider text-white uppercase">DASHBOARD TRANG QUẢN TRỊ CMS</h1>
              <span className={`px-2 py-0.5 rounded text-[8px] font-mono leading-none font-bold uppercase ${
                firebaseConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-400/15 text-yellow-300 border border-amber-400/20'
              }`}>
                {firebaseConnected ? 'Live Firestore' : 'Offline Mode'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Xin chào: {adminEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="px-4 py-2 bg-[#0B2755] hover:bg-[#0F3268] text-slate-300 text-[10px] uppercase font-bold tracking-wider rounded font-display transition cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> XEM TRANG CHỦ
          </button>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-600/15 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-600/30 text-[10px] uppercase font-bold tracking-wider rounded font-display transition cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> ĐĂNG XUẤT
          </button>
        </div>
      </header>

      {/* Synchronized Action Alert Banner Toast */}
      {saveStatus && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 border transition-all animate-bounce max-w-sm ${
          saveStatus.type === 'success' 
            ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200' 
            : 'bg-rose-950/95 border-rose-500 text-rose-200'
        }`}>
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">{saveStatus.message}</p>
        </div>
      )}

      {/* 2. BODY LAYOUT PANELS WRAP */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-6 p-4 sm:p-6">
        
        {/* Navigation Sidebar Drawer */}
        <aside className="md:w-64 shrink-0 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">MỤC CHỈNH SỬA WEBSITE</span>
          
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-3 rounded-lg text-left text-xs uppercase tracking-widest font-extrabold font-display transition-all cursor-pointer flex items-center gap-3 ${
              activeTab === 'general' ? 'bg-brand-gold text-brand-blue shadow-md' : 'bg-[#0F3268]/60 hover:bg-[#0F3268] text-slate-300 hover:text-white border border-[#123A78]/60'
            }`}
          >
            <Globe className="w-4 h-4" /> 1. Thông tin chung
          </button>

          <button
            onClick={() => setActiveTab('slides')}
            className={`px-4 py-3 rounded-lg text-left text-xs uppercase tracking-widest font-extrabold font-display transition-all cursor-pointer flex items-center gap-3 ${
              activeTab === 'slides' ? 'bg-brand-gold text-brand-blue shadow-md' : 'bg-[#0F3268]/60 hover:bg-[#0F3268] text-slate-300 hover:text-white border border-[#123A78]/60'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> 2. Banner/Slideshow
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-3 rounded-lg text-left text-xs uppercase tracking-widest font-extrabold font-display transition-all cursor-pointer flex items-center gap-3 ${
              activeTab === 'services' ? 'bg-brand-gold text-brand-blue shadow-md' : 'bg-[#0F3268]/60 hover:bg-[#0F3268] text-slate-300 hover:text-white border border-[#123A78]/60'
            }`}
          >
            <Layers className="w-4 h-4" /> 3. Dịch Vụ In Ấn
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-3 rounded-lg text-left text-xs uppercase tracking-widest font-extrabold font-display transition-all cursor-pointer flex items-center gap-3 ${
              activeTab === 'news' ? 'bg-brand-gold text-brand-blue shadow-md' : 'bg-[#0F3268]/60 hover:bg-[#0F3268] text-slate-300 hover:text-white border border-[#123A78]/60'
            }`}
          >
            <FileText className="w-4 h-4" /> 4. Tin tức & Hoạt động
          </button>

          <button
            onClick={() => setActiveTab('recruitment')}
            className={`px-4 py-3 rounded-lg text-left text-xs uppercase tracking-widest font-extrabold font-display transition-all cursor-pointer flex items-center gap-3 ${
              activeTab === 'recruitment' ? 'bg-brand-gold text-brand-blue shadow-md' : 'bg-[#0F3268]/60 hover:bg-[#0F3268] text-slate-300 hover:text-white border border-[#123A78]/60'
            }`}
          >
            <Briefcase className="w-4 h-4" /> 5. Tuyển dụng
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-3 rounded-lg text-left text-xs uppercase tracking-widest font-extrabold font-display transition-all cursor-pointer flex items-center gap-3 ${
              activeTab === 'gallery' ? 'bg-brand-gold text-brand-blue shadow-md' : 'bg-[#0F3268]/60 hover:bg-[#0F3268] text-slate-300 hover:text-white border border-[#123A78]/60'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> 6. Thư Viện ảnh
          </button>
        </aside>

        {/* 3. CORE SUB-PANELS CONTENT FRAME */}
        <main className="flex-1 bg-[#0F3268]/50 border border-[#123A78]/80 rounded-2xl p-5 sm:p-7 backdrop-blur-md">
          
          {/* TAB 1: GENERAL INFO (Contact and General Slogans) */}
          {activeTab === 'general' && (
            <div className="flex flex-col gap-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-display font-black tracking-wider text-white uppercase">CÀI ĐẶT THÔNG TIN CHUNG</h2>
                  <p className="text-xs text-slate-400">Sửa đổi thông tin số liên hệ, email nhận form, địa chỉ nhà máy & slogan</p>
                </div>
                <button
                  onClick={handleGeneralSave}
                  className="px-4 py-2 bg-brand-gold hover:bg-yellow-400 text-brand-blue text-[11px] font-extrabold uppercase tracking-wider rounded font-display transition cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" /> LƯU THAY ĐỔI
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans">
                
                <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                  <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Tên xí nghiệp</span>
                  <input
                    type="text"
                    value={localCompanyInfo.name}
                    onChange={(e) => setLocalCompanyInfo({ ...localCompanyInfo, name: e.target.value })}
                    className="px-3.5 py-2.5 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none focus:border-brand-gold text-xs leading-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                  <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Công ty mẹ</span>
                  <input
                    type="text"
                    value={localCompanyInfo.parentCompany}
                    onChange={(e) => setLocalCompanyInfo({ ...localCompanyInfo, parentCompany: e.target.value })}
                    className="px-3.5 py-2.5 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none focus:border-brand-gold text-xs leading-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Slogan nổi bật</span>
                  <input
                    type="text"
                    value={localCompanyInfo.slogan}
                    onChange={(e) => setLocalCompanyInfo({ ...localCompanyInfo, slogan: e.target.value })}
                    className="px-3.5 py-2.5 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none focus:border-brand-gold text-xs leading-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Website liên kết</span>
                  <input
                    type="text"
                    value={localCompanyInfo.website}
                    onChange={(e) => setLocalCompanyInfo({ ...localCompanyInfo, website: e.target.value })}
                    className="px-3.5 py-2.5 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none focus:border-brand-gold text-xs leading-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Hotline liên hệ</span>
                  <input
                    type="text"
                    value={localCompanyInfo.phone}
                    onChange={(e) => setLocalCompanyInfo({ ...localCompanyInfo, phone: e.target.value, phoneDisplay: e.target.value })}
                    className="px-3.5 py-2.5 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none focus:border-brand-gold text-xs leading-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Email người quản trị</span>
                  <input
                    type="email"
                    disabled
                    value={localCompanyInfo.email}
                    className="px-3.5 py-2.5 bg-[#123A78]/60 border border-[#123A78]/80 text-slate-400 rounded outline-none text-xs leading-none"
                  />
                  <span className="text-[9px] text-slate-500">Mặc định form gửi trực tiếp về Gmail: <strong>{localCompanyInfo.email}</strong> theo yêu cầu.</span>
                </div>

                <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                  <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Địa chỉ nhà máy sản xuất</span>
                  <textarea
                    rows={2}
                    value={localCompanyInfo.address}
                    onChange={(e) => setLocalCompanyInfo({ ...localCompanyInfo, address: e.target.value })}
                    className="px-3.5 py-2.5 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none focus:border-brand-gold text-xs font-sans"
                  />
                </div>

              </div>

              {/* STATS EDIT MODULE IN TAB 1 */}
              <div className="flex items-center justify-between border-t border-[#123A78]/80 pt-6 mt-4 pb-3">
                <div>
                  <h3 className="text-xs font-display font-black tracking-wider text-white uppercase">SỐ LIỆU THỐNG KÊ (KPI HOẠT ĐỘNG)</h3>
                  <p className="text-[11px] text-slate-400">Các chỉ số hiển thị tại trang giới thiệu doanh nghiệp</p>
                </div>
                <button
                  onClick={handleStatsSave}
                  className="px-4 py-2 bg-brand-gold hover:bg-yellow-400 text-brand-blue text-[10px] font-extrabold uppercase tracking-wider rounded font-display transition cursor-pointer flex items-center gap-1 shadow-md"
                >
                  <Save className="w-3.5 h-3.5" /> LƯU THỐNG KÊ
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {localStatistics.map((stat, i) => (
                  <div key={i} className="p-4 bg-[#123A78] border border-[#123A78]/80 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-brand-gold">CHỈ SỐ {i + 1}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={stat.value}
                        placeholder="45+"
                        onChange={(e) => {
                          const updated = [...localStatistics];
                          updated[i].value = e.target.value;
                          setLocalStatistics(updated);
                        }}
                        className="px-3 py-2 bg-[#0F3268] border border-[#123A78]/80 text-center font-bold tracking-wider text-brand-gold rounded outline-none"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        placeholder="Năm Kinh Nghiệm"
                        onChange={(e) => {
                          const updated = [...localStatistics];
                          updated[i].label = e.target.value;
                          setLocalStatistics(updated);
                        }}
                        className="px-3 py-2 bg-[#0F3268] border border-[#123A78]/80 text-xs rounded outline-none"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={stat.desc}
                      placeholder="Mô tả chỉ số sản lượng"
                      onChange={(e) => {
                        const updated = [...localStatistics];
                        updated[i].desc = e.target.value;
                        setLocalStatistics(updated);
                      }}
                      className="px-3 py-2 bg-[#0F3268] border border-[#123A78]/80 text-[11px] rounded outline-none font-sans"
                    />
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: SLIDESHOW EDIT MODULE */}
          {activeTab === 'slides' && (
            <div className="flex flex-col gap-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-display font-black tracking-wider text-white uppercase">BANNER HERO & SLIDESHOW</h2>
                  <p className="text-xs text-slate-400">Tùy biến hoặc thay thế 3 slide hình ảnh, tiêu đề, và phụ đề trang chủ</p>
                </div>
                <button
                  onClick={handleSlidesSave}
                  className="px-4 py-2 bg-brand-gold hover:bg-yellow-400 text-brand-blue text-[11px] font-extrabold uppercase tracking-wider rounded font-display transition cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" /> LƯU TOÀN BỘ SLIDE
                </button>
              </div>

              <div className="flex flex-col gap-8">
                {localSlides.map((slide, i) => (
                  <div key={slide.id} className="p-5 bg-[#123A78] border border-[#123A78]/80 rounded-xl flex flex-col lg:flex-row gap-5">
                    
                    {/* Thumbnail preview / Drag upload column */}
                    <div className="lg:w-1/3 flex flex-col gap-3">
                      <span className="text-[10px] font-black text-brand-gold">SLIDE BANNER #{i+1}</span>
                      <ImageUploaderArea
                        value={slide.image}
                        label="Hình nền slide"
                        onChange={(val) => {
                          const updated = [...localSlides];
                          updated[i].image = val;
                          setLocalSlides(updated);
                        }}
                      />
                    </div>

                    {/* Inputs panel column */}
                    <div className="flex-1 flex flex-col gap-4 font-sans text-xs">
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Tag nhỏ phụ</span>
                          <input
                            type="text"
                            value={slide.badgeText}
                            onChange={(e) => {
                              const updated = [...localSlides];
                              updated[i].badgeText = e.target.value;
                              setLocalSlides(updated);
                            }}
                            className="px-3.5 py-2 bg-[#0F3268] border border-[#123A78]/80 text-white rounded outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Anchor ID đích</span>
                          <input
                            type="text"
                            value={slide.targetId}
                            onChange={(e) => {
                              const updated = [...localSlides];
                              updated[i].targetId = e.target.value;
                              setLocalSlides(updated);
                            }}
                            className="px-3.5 py-2 bg-[#0F3268] border border-[#123A78]/80 text-white rounded outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Tiêu đề lớn</span>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => {
                            const updated = [...localSlides];
                            updated[i].title = e.target.value;
                            setLocalSlides(updated);
                          }}
                          className="px-3.5 py-2 bg-[#0F3268] border border-[#123A78]/80 text-white rounded outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Mô tả hiển thị</span>
                        <textarea
                          rows={3}
                          value={slide.subtitle}
                          onChange={(e) => {
                            const updated = [...localSlides];
                            updated[i].subtitle = e.target.value;
                            setLocalSlides(updated);
                          }}
                          className="px-3.5 py-2 bg-[#0F3268] border border-[#123A78]/80 text-white rounded outline-none font-sans leading-relaxed"
                        />
                      </div>

                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: DỊCH VỤ IN ẤN EDIT MODULE */}
          {activeTab === 'services' && (
            <div className="flex flex-col gap-6 font-sans">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-display font-black tracking-wider text-white uppercase">QUẢN LÝ DỊCH VỤ IN ẤN</h2>
                  <p className="text-xs text-slate-400">Sửa đổi các mục in ấn: Vé số kiến thiết, Vé số cào, Chứng từ...</p>
                </div>
                <button
                  onClick={() => {
                    setEditingService({
                      id: `srv-${Date.now()}`,
                      title: '',
                      shortDesc: '',
                      longDesc: '',
                      image: '',
                      iconName: 'Ticket',
                      bullets: ['', '']
                    });
                    setIsServiceModalOpen(true);
                  }}
                  className="px-4 py-2 bg-brand-gold hover:bg-yellow-400 text-brand-blue text-[11px] font-extrabold uppercase tracking-wider rounded font-display transition cursor-pointer flex items-center gap-1 shadow-md"
                >
                  <Plus className="w-4 h-4 font-black" /> THÊM DỊCH VỤ MỚI
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {services.map((item) => (
                  <div key={item.id} className="p-4 bg-[#123A78] border border-[#123A78]/80 rounded-xl flex items-center justify-between gap-4 font-sans">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded border border-[#123A78]/80" referrerPolicy="no-referrer" />
                      )}
                      <div>
                        <h3 className="text-sm font-bold text-white">{item.title}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.shortDesc}</p>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-[#0F3268] border border-[#123A78]/80 text-slate-400 font-mono mt-1 inline-block">ID: {item.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingService(item);
                          setIsServiceModalOpen(true);
                        }}
                        className="p-2 bg-[#0F3268] border border-[#123A78]/80 hover:border-brand-gold/60 text-slate-300 hover:text-brand-gold rounded transition"
                        title="Chỉnh sửa dịch vụ"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn dịch vụ "${item.title}"?`)) {
                            try {
                              await deleteService(item.id);
                              triggerNotification('success', 'Xóa dịch vụ thành công!');
                            } catch (err) {
                              triggerNotification('error', 'Lỗi: ' + String(err));
                            }
                          }
                        }}
                        className="p-2 bg-rose-950/40 border border-rose-900/40 hover:border-rose-600 text-rose-400 hover:text-white rounded transition"
                        title="Xóa dịch vụ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SERVICE WORK MODAL MODIFIER */}
              {isServiceModalOpen && editingService && (
                <div className="fixed inset-0 bg-[#00004D]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                  <div className="bg-[#0F3268] border border-amber-500/10 rounded-2xl p-6 w-full max-w-2xl text-xs flex flex-col gap-4 max-h-[90vh] overflow-y-auto font-sans shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#123A78]/80 pb-3">
                      <h3 className="text-sm font-display font-black text-brand-gold uppercase">CHI TIẾT MỤC DỊCH VỤ</h3>
                      <button onClick={() => { setIsServiceModalOpen(false); setEditingService(null); }} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="flex flex-col gap-1">
                        <span>Tiêu đề dịch vụ</span>
                        <input
                          type="text"
                          value={editingService.title}
                          onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                          className="px-3 py-2 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span>Tên Icon (Lucide-React)</span>
                        <input
                          type="text"
                          value={editingService.iconName}
                          placeholder="Ticket / Cpu / FileSpreadsheet"
                          onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value })}
                          className="px-3 py-2 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                        <span>Mô tả ngắn trang chủ</span>
                        <input
                          type="text"
                          value={editingService.shortDesc}
                          onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                          className="px-3 py-2 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                        <span>Mô tả chi tiết giải pháp (Khi bấm xem chi tiết)</span>
                        <textarea
                          rows={3}
                          value={editingService.longDesc}
                          onChange={(e) => setEditingService({ ...editingService, longDesc: e.target.value })}
                          className="px-3 py-2 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none font-sans"
                        />
                      </div>

                      <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                        <ImageUploaderArea
                          value={editingService.image}
                          label="Hình đại diện giải pháp"
                          onChange={(val) => setEditingService({ ...editingService, image: val })}
                        />
                      </div>

                      {/* Bullets lists */}
                      <div className="flex flex-col gap-2 col-span-1 sm:col-span-2 border-t border-[#123A78]/80 pt-3">
                        <span className="font-bold tracking-wider text-slate-300">ĐẶC ĐIỂM CHUYÊN MÔN (BULLETS):</span>
                        {editingService.bullets.map((bullet, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={bullet}
                              placeholder={`Thông số/Chứng nhận ${idx + 1}`}
                              onChange={(e) => {
                                const b = [...editingService.bullets];
                                b[idx] = e.target.value;
                                setEditingService({ ...editingService, bullets: b });
                              }}
                              className="flex-1 px-3 py-1.5 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none text-[11px]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const b = editingService.bullets.filter((_, i) => i !== idx);
                                setEditingService({ ...editingService, bullets: b });
                              }}
                              className="p-1 px-2.5 bg-rose-950 text-rose-300 hover:bg-rose-900 rounded"
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditingService({ ...editingService, bullets: [...editingService.bullets, ''] })}
                          className="mt-1 py-1.5 border border-[#123A78]/80 text-slate-300 rounded font-bold hover:bg-[#123A78] transition"
                        >
                          + THÊM BULLET ĐẶC ĐIỂM
                        </button>
                      </div>

                    </div>

                    <div className="flex justify-end gap-3 border-t border-[#123A78]/80 pt-4 mt-2">
                      <button
                        type="button"
                        onClick={() => { setIsServiceModalOpen(false); setEditingService(null); }}
                        className="px-4 py-2 bg-[#0B2755] text-slate-300 rounded font-extrabold uppercase hover:bg-[#0F3268] font-display transition"
                      >
                        ĐÓNG
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!editingService.title) {
                            alert('Vui lòng nhập tên dịch vụ trước.');
                            return;
                          }
                          try {
                            await saveService(editingService);
                            setIsServiceModalOpen(false);
                            setEditingService(null);
                            triggerNotification('success', 'Đã lưu cấu trúc dịch vụ và đẩy lên đám mây.');
                          } catch (err) {
                            triggerNotification('error', 'Lưu thất bại: ' + String(err));
                          }
                        }}
                        className="px-5 py-2 bg-brand-gold hover:bg-yellow-400 text-brand-blue font-extrabold uppercase rounded font-display transition shadow-md"
                      >
                        LƯU NGAY
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: NEWS / TIN TỨC & HOẠT ĐỘNG CRUD */}
          {activeTab === 'news' && (
            <div className="flex flex-col gap-6 font-sans">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-display font-black tracking-wider text-white uppercase">QUẢN LÝ BÀI VIẾT TIN TỨC</h2>
                  <p className="text-xs text-slate-400">Đăng tin tức tuyển dụng, thi đua khen thưởng, máy móc mới hay sinh hoạt đoàn thể</p>
                </div>
                <button
                  onClick={() => {
                    setEditingNews({
                      id: `news-${Date.now()}`,
                      title: '',
                      subtitle: '',
                      content: '',
                      category: 'Hoạt động sản xuất',
                      imageUrl: '',
                      isPinned: false,
                      createdAt: new Date().toISOString(),
                      author: 'Ban Điều Hành Sản Xuất'
                    });
                    setIsNewsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-brand-gold hover:bg-yellow-400 text-brand-blue text-[11px] font-extrabold uppercase tracking-wider rounded font-display transition cursor-pointer flex items-center gap-1 shadow-md"
                >
                  <Plus className="w-4 h-4 font-black" /> VIẾT BÀI MỚI REALS
                </button>
              </div>

              {/* Search or Quick count */}
              <div className="p-3 bg-[#123A78] rounded-lg text-slate-400 text-[10px] flex justify-between tracking-widest font-mono">
                <span>TẬP HỢP: {news.length} BÀI ĐĂNG</span>
                <span>DANH MỤC BIẾN THIÊN REALTIME</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {news.map((item) => (
                  <div key={item.id} className="p-4 bg-[#123A78] border border-[#123A78]/80 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.title} className="w-16 h-12 object-cover rounded border border-[#123A78]/80 shrink-0" referrerPolicy="no-referrer" />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-brand-blue-dark border border-brand-blue text-[9px] text-amber-200 uppercase font-bold tracking-widest leading-none font-display shrink-0">
                            {item.category}
                          </span>
                          {item.isPinned && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-yellow-300 text-[9px] font-bold leading-none font-display uppercase border border-amber-500/20">PINNED</span>
                          )}
                        </div>
                        <h3 className="text-xs font-bold text-white mt-1.5 truncate leading-snug">{item.title}</h3>
                        <p className="text-[10px] text-slate-500 mt-1 font-mono">{new Date(item.createdAt).toLocaleDateString('vi-VN')} - Bởi: {item.author}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingNews(item);
                          setIsNewsModalOpen(true);
                        }}
                        className="p-2 bg-[#0F3268] border border-[#123A78]/80 hover:border-brand-gold/60 text-slate-300 hover:text-brand-gold rounded transition"
                        title="Sửa bài viết"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn bài đăng "${item.title}"?`)) {
                            try {
                              await deleteNewsPost(item.id);
                              triggerNotification('success', 'Xóa bài đăng thành công khỏi hệ thống!');
                            } catch (err) {
                              triggerNotification('error', 'Lỗi: ' + String(err));
                            }
                          }
                        }}
                        className="p-2 bg-rose-950/40 border border-rose-900/40 hover:border-rose-600 text-rose-400 hover:text-white rounded transition"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* NEWS ARTICLE WORK MODAL EDITOR */}
              {isNewsModalOpen && editingNews && (
                <div className="fixed inset-0 bg-[#00004D]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                  <div className="bg-[#0F3268] border border-amber-500/10 rounded-2xl p-6 w-full max-w-3xl text-xs flex flex-col gap-4 max-h-[92vh] overflow-y-auto font-sans shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#123A78]/80 pb-3">
                      <h3 className="text-sm font-display font-black text-brand-gold uppercase">BIÊN TẬP BÀI VIẾT</h3>
                      <button onClick={() => { setIsNewsModalOpen(false); setEditingNews(null); }} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                        <span>Tiêu đề bài đăng (Lớn)</span>
                        <input
                          type="text"
                          value={editingNews.title}
                          placeholder="Bổ sung dây chuyền in bảo mật thế hệ mới..."
                          required
                          onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                          className="px-3 py-2.5 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                        <span>Phụ đề / Đoạn tổng thuật ngắn</span>
                        <input
                          type="text"
                          value={editingNews.subtitle}
                          placeholder="Một đoạn mô tả ngắn hiển thị tại danh sách tin tức..."
                          onChange={(e) => setEditingNews({ ...editingNews, subtitle: e.target.value })}
                          className="px-3 py-2.5 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span>Danh mục bài viết</span>
                        <select
                          value={editingNews.category}
                          onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                          className="px-3 py-2 bg-[#123A78] border border-[#123A78]/80 text-slate-200 rounded outline-none"
                        >
                          <option value="Hoạt động sản xuất">Hoạt động sản xuất</option>
                          <option value="Hoạt động đoàn thể">Hoạt động đoàn thể</option>
                          <option value="Thi đua - Khen thưởng">Thi đua - Khen thưởng</option>
                          <option value="Công nghệ in mới">Công nghệ in mới</option>
                          <option value="Thông báo doanh nghiệp">Thông báo doanh nghiệp</option>
                          <option value="Văn hoá doanh nghiệp">Văn hoá doanh nghiệp</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span>Tác giả biên chép</span>
                        <input
                          type="text"
                          value={editingNews.author}
                          placeholder="Phòng Tổ chức - Hành chính"
                          onChange={(e) => setEditingNews({ ...editingNews, author: e.target.value })}
                          className="px-3 py-2 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                        <ImageUploaderArea
                          value={editingNews.imageUrl}
                          label="Hình thu nhỏ đại diện (Thumbnail)"
                          onChange={(val) => setEditingNews({ ...editingNews, imageUrl: val })}
                        />
                      </div>

                      <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                        <span>Nội dung bài viết chi tiết (Markdown / Văn bản thuần)</span>
                        <textarea
                          rows={8}
                          value={editingNews.content}
                          placeholder="Mô tả cụ thể diễn tiến sự kiện tài chính hay cơ học..."
                          required
                          onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                          className="px-3 py-2 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none font-sans leading-relaxed"
                        />
                      </div>

                      <div className="flex items-center gap-2 col-span-1 sm:col-span-2 mt-2 bg-[#123A78] p-3 rounded-lg border border-[#123A78]/80">
                        <input
                          type="checkbox"
                          id="isPinnedCheck"
                          checked={editingNews.isPinned}
                          onChange={(e) => setEditingNews({ ...editingNews, isPinned: e.target.checked })}
                          className="w-4 h-4 text-brand-gold accent-amber-500 rounded cursor-pointer"
                        />
                        <label htmlFor="isPinnedCheck" className="text-slate-300 font-bold select-none cursor-pointer">Ghim bài viết này lên vị trí đầu trang tin tức</label>
                      </div>

                    </div>

                    <div className="flex justify-end gap-3 border-t border-[#123A78]/80 pt-4 mt-2">
                      <button
                        type="button"
                        onClick={() => { setIsNewsModalOpen(false); setEditingNews(null); }}
                        className="px-4 py-2 bg-[#0B2755] text-slate-300 rounded font-extrabold uppercase hover:bg-[#0F3268] font-display transition"
                      >
                        HỦY BỎ
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!editingNews.title || !editingNews.content) {
                            alert('Vui lòng hoàn thiện trường Tiêu đề và Nội dung bài đăng.');
                            return;
                          }
                          try {
                            await saveNewsPost(editingNews);
                            setIsNewsModalOpen(false);
                            setEditingNews(null);
                            triggerNotification('success', 'Bài đăng đã đồng bộ đồng loạt trên website!');
                          } catch (err) {
                            triggerNotification('error', 'Không thể đồng bộ: ' + String(err));
                          }
                        }}
                        className="px-5 py-2 bg-brand-gold hover:bg-yellow-400 text-brand-blue font-extrabold uppercase rounded font-display transition shadow-md"
                      >
                        XUẤT BẢN NGAY
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: RECRUITMENT VACANCIES CRUD */}
          {activeTab === 'recruitment' && (
            <div className="flex flex-col gap-6 font-sans">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-display font-black tracking-wider text-white uppercase">HỆ THỐNG TIN TUYỂN DỤNG</h2>
                  <p className="text-xs text-slate-400">Các vị trí thợ vận hành máy offset Heidelberg hoặc kỹ sư KCS bảo mật xí nghiệp</p>
                </div>
                <button
                  onClick={() => {
                    setEditingVacancy({
                      id: `vca-${Date.now()}`,
                      title: '',
                      department: '',
                      type: 'Toàn thời gian (Cố định)',
                      salary: '',
                      deadline: '',
                      requirements: ['', ''],
                      benefits: ['', '']
                    });
                    setIsVacancyModalOpen(true);
                  }}
                  className="px-4 py-2 bg-brand-gold hover:bg-yellow-400 text-brand-blue text-[11px] font-extrabold uppercase tracking-wider rounded font-display transition cursor-pointer flex items-center gap-1 shadow-md"
                >
                  <Plus className="w-4 h-4 font-black" /> THÊM VỊ TRÍ HỒ SƠ
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {vacancies.map((item) => (
                  <div key={item.id} className="p-4 bg-[#123A78] border border-[#123A78]/80 rounded-xl flex items-center justify-between gap-4 font-sans">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase">{item.title}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Bộ phận: {item.department} | Lương: {item.salary}</p>
                      <span className="text-[9px] text-slate-500 font-mono">Hạn nộp: {item.deadline}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingVacancy(item);
                          setIsVacancyModalOpen(true);
                        }}
                        className="p-2 bg-[#0F3268] border border-[#123A78]/80 hover:border-brand-gold/60 text-slate-300 hover:text-brand-gold rounded transition"
                        title="Sửa tin tuyển dụng"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn mục tuyển dụng "${item.title}"?`)) {
                            try {
                              await deleteVacancy(item.id);
                              triggerNotification('success', 'Xóa mục tuyển dụng thành công!');
                            } catch (err) {
                              triggerNotification('error', 'Lỗi: ' + String(err));
                            }
                          }
                        }}
                        className="p-2 bg-rose-950/40 border border-rose-900/40 hover:border-rose-600 text-rose-400 hover:text-white rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* VACANCY TIMELINE MODIFIER COMPONENT */}
              {isVacancyModalOpen && editingVacancy && (
                <div className="fixed inset-0 bg-[#00004D]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                  <div className="bg-[#0F3268] border border-amber-500/10 rounded-2xl p-6 w-full max-w-2xl text-xs flex flex-col gap-4 max-h-[90vh] overflow-y-auto font-sans shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#123A78]/80 pb-3">
                      <h3 className="text-sm font-display font-black text-brand-gold uppercase">BIÊN SOẠN CHỈ TIÊU TUYỂN DỤNG</h3>
                      <button onClick={() => { setIsVacancyModalOpen(false); setEditingVacancy(null); }} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                        <span>Chức danh công việc</span>
                        <input
                          type="text"
                          value={editingVacancy.title}
                          required
                          onChange={(e) => setEditingVacancy({ ...editingVacancy, title: e.target.value })}
                          className="px-3 py-2 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span>Phòng ban ứng tuyển</span>
                        <input
                          type="text"
                          value={editingVacancy.department}
                          placeholder="Xưởng in ấn"
                          onChange={(e) => setEditingVacancy({ ...editingVacancy, department: e.target.value })}
                          className="px-3 py-2 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span>Hình thức làm việc</span>
                        <input
                          type="text"
                          value={editingVacancy.type}
                          placeholder="Toàn thời gian (Cố định)"
                          onChange={(e) => setEditingVacancy({ ...editingVacancy, type: e.target.value })}
                          className="px-3 py-2 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span>Mức lương chính thức</span>
                        <input
                          type="text"
                          value={editingVacancy.salary}
                          placeholder="12,000,000 - 15,000,000 VNĐ"
                          onChange={(e) => setEditingVacancy({ ...editingVacancy, salary: e.target.value })}
                          className="px-3 py-2 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span>Hạn ứng tuyển</span>
                        <input
                          type="text"
                          value={editingVacancy.deadline}
                          placeholder="30/06/2026"
                          onChange={(e) => setEditingVacancy({ ...editingVacancy, deadline: e.target.value })}
                          className="px-3 py-2 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none"
                        />
                      </div>

                      {/* Requirements bullets */}
                      <div className="flex flex-col gap-2 col-span-1 sm:col-span-2 border-t border-[#123A78]/80 pt-3">
                        <span className="font-bold tracking-wider text-slate-300">YÊU CẦU CÔNG VIỆC:</span>
                        {editingVacancy.requirements.map((req, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={req}
                              onChange={(e) => {
                                const r = [...editingVacancy.requirements];
                                r[idx] = e.target.value;
                                setEditingVacancy({ ...editingVacancy, requirements: r });
                              }}
                              className="flex-1 px-3 py-1.5 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none text-[11px]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const r = editingVacancy.requirements.filter((_, i) => i !== idx);
                                setEditingVacancy({ ...editingVacancy, requirements: r });
                              }}
                              className="p-1 px-2 bg-rose-950 text-rose-300 hover:bg-rose-900 rounded"
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditingVacancy({ ...editingVacancy, requirements: [...editingVacancy.requirements, ''] })}
                          className="mt-1 py-1.5 border border-[#123A78]/80 text-slate-300 rounded font-bold hover:bg-[#123A78] transition"
                        >
                          + THÊM YÊU CẦU TIÊU CHUẨN
                        </button>
                      </div>

                      {/* Benefits bullets */}
                      <div className="flex flex-col gap-2 col-span-1 sm:col-span-2 border-t border-[#123A78]/80 pt-3">
                        <span className="font-bold tracking-wider text-slate-300 font-display">CHẾ ĐỘ PHÚC LỢI HÈ:</span>
                        {editingVacancy.benefits.map((ben, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={ben}
                              onChange={(e) => {
                                const b = [...editingVacancy.benefits];
                                b[idx] = e.target.value;
                                setEditingVacancy({ ...editingVacancy, benefits: b });
                              }}
                              className="flex-1 px-3 py-1.5 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none text-[11px]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const b = editingVacancy.benefits.filter((_, i) => i !== idx);
                                setEditingVacancy({ ...editingVacancy, benefits: b });
                              }}
                              className="p-1 px-2 bg-rose-950 text-rose-300 hover:bg-rose-900 rounded"
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditingVacancy({ ...editingVacancy, benefits: [...editingVacancy.benefits, ''] })}
                          className="mt-1 py-1.5 border border-[#123A78]/80 text-slate-300 rounded font-bold hover:bg-[#0F3268] transition"
                        >
                          + THÊM PHÚC LỢI DOANH NGHIỆP
                        </button>
                      </div>

                    </div>

                    <div className="flex justify-end gap-3 border-t border-[#123A78]/80 pt-4 mt-2">
                      <button
                        type="button"
                        onClick={() => { setIsVacancyModalOpen(false); setEditingVacancy(null); }}
                        className="px-4 py-2 bg-[#0B2755] text-slate-300 rounded font-extrabold uppercase hover:bg-[#0F3268] font-display transition"
                      >
                        HỦY
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!editingVacancy.title) {
                            alert('Vui lòng hoàn tất mục chức danh tuyển dụng.');
                            return;
                          }
                          try {
                            await saveVacancy(editingVacancy);
                            setIsVacancyModalOpen(false);
                            setEditingVacancy(null);
                            triggerNotification('success', 'Đã xuất tuyển dụng rộng rãi trên website.');
                          } catch (err) {
                            triggerNotification('error', 'Lưu thất bại: ' + String(err));
                          }
                        }}
                        className="px-5 py-2 bg-brand-gold hover:bg-yellow-400 text-brand-blue font-extrabold uppercase rounded font-display transition shadow-md"
                      >
                        LƯU TIN
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 6: IMAGES GALLERY EDIT MODULE */}
          {activeTab === 'gallery' && (
            <div className="flex flex-col gap-6 font-sans">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-display font-black tracking-wider text-white uppercase">QUẢN LÝ THƯ VIỆN HÌNH ẢNH</h2>
                  <p className="text-xs text-slate-400">Điều phối ảnh thực tế nhà máy, xưởng in, dây chuyền KBA và văn hóa đoàn thể</p>
                </div>
                <button
                  onClick={() => {
                    setEditingGallery({
                      id: `g-${Date.now()}`,
                      title: '',
                      category: 'all',
                      image: ''
                    });
                    setIsGalleryModalOpen(true);
                  }}
                  className="px-4 py-2 bg-brand-gold hover:bg-yellow-400 text-brand-blue text-[11px] font-extrabold uppercase tracking-wider rounded font-display transition cursor-pointer flex items-center gap-1 shadow-md"
                >
                  <Plus className="w-4 h-4 font-black" /> THÊM ẢNH MỚI
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {gallery.map((item) => (
                  <div key={item.id} className="relative group rounded-xl border border-[#123A78]/80 bg-[#123A78] overflow-hidden shadow-md flex flex-col">
                    <img src={item.image} alt={item.title} className="w-full h-28 object-cover group-hover:scale-105 transition duration-300" referrerPolicy="no-referrer" />
                    <div className="p-2.5 flex-1 flex flex-col justify-between gap-1 bg-[#123A78] font-sans">
                      <p className="font-bold text-[11px] text-white truncate">{item.title}</p>
                      <span className="text-[8px] font-black tracking-widest text-brand-gold font-display uppercase">{item.category}</span>
                    </div>

                    <div className="absolute top-2 right-2 flex gap-1 bg-[#00004D]/80 p-1 rounded-lg border border-[#123A78]/80 opacity-90">
                      <button
                        onClick={() => {
                          setEditingGallery(item);
                          setIsGalleryModalOpen(true);
                        }}
                        className="p-1 bg-[#0F3268] border border-[#123A78]/80 hover:border-brand-gold text-slate-300 hover:text-brand-gold rounded transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Bạn có chắc muốn xóa ảnh "${item.title}"?`)) {
                            try {
                              await deleteGalleryItem(item.id);
                              triggerNotification('success', 'Xóa ảnh thành công!');
                            } catch (err) {
                              triggerNotification('error', 'Lỗi: ' + String(err));
                            }
                          }
                        }}
                        className="p-1 bg-rose-950 border border-rose-900 hover:border-rose-600 text-rose-300 hover:text-white rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* GALLERY MODIFY WINDOWS MODAL */}
              {isGalleryModalOpen && editingGallery && (
                <div className="fixed inset-0 bg-[#00004D]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <div className="bg-[#0F3268] border border-amber-500/10 rounded-2xl p-6 w-full max-w-lg text-xs flex flex-col gap-4 font-sans shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#123A78]/80 pb-3">
                      <h3 className="text-sm font-display font-black text-brand-gold uppercase">BIÊN SOẠN THƯ VIỆN HÌNH ẢNH</h3>
                      <button onClick={() => { setIsGalleryModalOpen(false); setEditingGallery(null); }} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>

                    <div className="flex flex-col gap-4">
                      
                      <div className="flex flex-col gap-1">
                        <span>Chú thích / Tên bức ảnh</span>
                        <input
                          type="text"
                          value={editingGallery.title}
                          placeholder="Màng co niêm phong đai kiện..."
                          onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                          className="px-3 py-2 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span>Danh mục lọc</span>
                        <select
                          value={editingGallery.category}
                          onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value as any })}
                          className="px-3 py-2 bg-[#123A78] border border-[#123A78]/80 text-white rounded outline-none"
                        >
                          <option value="all">Tất cả bài trí (all)</option>
                          <option value="machinery">Thiết bị máy móc (machinery)</option>
                          <option value="products">Ấn phẩm & Vé số (products)</option>
                          <option value="certificates">Chứng chỉ bảo mật (certificates)</option>
                          <option value="activities">Đoàn thể & Hoạt động (activities)</option>
                        </select>
                      </div>

                      <ImageUploaderArea
                        value={editingGallery.image}
                        label="Hình ảnh thật để trưng bày"
                        onChange={(val) => setEditingGallery({ ...editingGallery, image: val })}
                      />

                    </div>

                    <div className="flex justify-end gap-3 border-t border-[#123A78]/80 pt-4 mt-2">
                      <button
                        type="button"
                        onClick={() => { setIsGalleryModalOpen(false); setEditingGallery(null); }}
                        className="px-4 py-2 bg-[#0B2755] text-slate-300 rounded font-extrabold uppercase hover:bg-[#0F3268] font-display transition"
                      >
                        ĐÓNG
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!editingGallery.title || !editingGallery.image) {
                            alert('Vui lòng hoàn thành tiêu đề bức hình & upload ảnh.');
                            return;
                          }
                          try {
                            await saveGalleryItem(editingGallery);
                            setIsGalleryModalOpen(false);
                            setEditingGallery(null);
                            triggerNotification('success', 'Bức ảnh đã được liên thông vào Gallery!');
                          } catch (err) {
                            triggerNotification('error', 'Lưu thất bại: ' + String(err));
                          }
                        }}
                        className="px-5 py-2 bg-brand-gold hover:bg-yellow-400 text-brand-blue font-extrabold uppercase rounded font-display transition shadow-md"
                      >
                        LƯU NGAY
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </main>

      </div>

    </div>
  );
}
