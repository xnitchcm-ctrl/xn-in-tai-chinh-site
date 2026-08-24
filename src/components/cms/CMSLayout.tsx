import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileCode, 
  FileText, 
  Tag, 
  FolderKanban, 
  Sliders, 
  Ticket, 
  Cpu, 
  Image as ImageIcon, 
  Briefcase, 
  MessageSquareQuote, 
  Palette, 
  Search, 
  Users, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  ExternalLink, 
  ChevronRight, 
  Menu, 
  X, 
  Bell, 
  UserCircle,
  Building2,
  Lock,
  Database,
  CheckCircle,
  Clock,
  Sparkles,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { SUPABASE_URL, isSupabaseConfigured, SUPABASE_SQL_SETUP } from '../../utils/supabase';

export default function CMSLayout() {
  const { 
    currentUser, 
    logoutAdmin, 
    companyInfo, 
    news, 
    quotes, 
    vacancies, 
    gallery, 
    supabaseConnected, 
    isAdmin, 
    isApprover, 
    isEditor, 
    userRole 
  } = useCMS();
  
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Editor allowed routes whitelist
  const EDITOR_ALLOWED_PATHS = [
    '/admin',
    '/admin/tong-quan',
    '/admin/bai-viet',
    '/admin/thu-vien',
    '/admin/hinh-anh'
  ];

  // Direct Route Protection: If editor visits an unauthorized route, redirect immediately to /admin/tong-quan
  useEffect(() => {
    if (currentUser?.role === 'editor') {
      const current = location.pathname.replace(/\/+$/, '');
      const isAllowed = EDITOR_ALLOWED_PATHS.some(p => p.replace(/\/+$/, '') === current);
      if (!isAllowed) {
        navigate('/admin/tong-quan', { replace: true });
      }
    }
  }, [location.pathname, currentUser?.role, navigate]);

  // Calculate pending review count (for approver/admin) or editor's own stats
  const pendingNewsCount = news.filter(n => n.status === 'pending_review').length;
  const editorNewsCount = currentUser?.role === 'editor' 
    ? news.filter(n => !n.createdBy || n.createdBy === currentUser.uid || n.author === currentUser.fullName).length
    : news.length;

  const navigationItems = [
    { 
      label: currentUser?.role === 'editor' ? 'Tổng Quan Cá Nhân' : 'Tổng Quan', 
      path: '/admin/tong-quan', 
      icon: LayoutDashboard, 
      badge: null, 
      roles: ['super_admin', 'admin', 'approver', 'editor'] 
    },
    { 
      label: 'Bài Viết & Tin Tức', 
      path: '/admin/bai-viet', 
      icon: FileText, 
      badge: currentUser?.role === 'editor' 
        ? (editorNewsCount > 0 ? editorNewsCount : null)
        : (pendingNewsCount > 0 ? `${pendingNewsCount} chờ duyệt` : news.length), 
      isWarningBadge: currentUser?.role !== 'editor' && pendingNewsCount > 0,
      roles: ['super_admin', 'admin', 'approver', 'editor'] 
    },
    { 
      label: 'Thư Viện Ảnh', 
      path: '/admin/thu-vien', 
      icon: ImageIcon, 
      badge: gallery.length > 0 ? gallery.length : null, 
      roles: ['super_admin', 'admin', 'approver', 'editor'] 
    },
    { 
      label: 'Kho Media & Tệp Tin', 
      path: '/admin/hinh-anh', 
      icon: FolderKanban, 
      badge: null, 
      roles: ['super_admin', 'admin', 'approver', 'editor'] 
    },
    { 
      label: 'Danh Mục', 
      path: '/admin/danh-muc', 
      icon: Tag, 
      badge: null, 
      roles: ['super_admin', 'admin', 'approver'] 
    },
    { 
      label: 'Trang Tĩnh & Nội Dung', 
      path: '/admin/trang', 
      icon: FileCode, 
      badge: null, 
      roles: ['super_admin', 'admin', 'approver'] 
    },
    { 
      label: 'Banner Slide', 
      path: '/admin/banner', 
      icon: Sliders, 
      badge: null, 
      roles: ['super_admin', 'admin', 'approver'] 
    },
    { 
      label: 'Dịch Vụ In', 
      path: '/admin/dich-vu', 
      icon: Ticket, 
      badge: null, 
      roles: ['super_admin', 'admin', 'approver'] 
    },
    { 
      label: 'Máy Móc Công Nghệ', 
      path: '/admin/cong-nghe', 
      icon: Cpu, 
      badge: null, 
      roles: ['super_admin', 'admin', 'approver'] 
    },
    { 
      label: 'Tuyển Dụng', 
      path: '/admin/tuyen-dung', 
      icon: Briefcase, 
      badge: vacancies.length, 
      roles: ['super_admin', 'admin', 'approver'] 
    },
    { 
      label: 'Yêu Cầu Báo Giá', 
      path: '/admin/lien-he', 
      icon: MessageSquareQuote, 
      badge: quotes.length, 
      roles: ['super_admin', 'admin', 'approver'] 
    },
    { 
      label: 'Cấu Hình Thương Hiệu', 
      path: '/admin/thuong-hieu', 
      icon: Palette, 
      badge: null, 
      roles: ['super_admin', 'admin'] 
    },
    { 
      label: 'Cấu Hình SEO Meta', 
      path: '/admin/seo', 
      icon: Search, 
      badge: null, 
      roles: ['super_admin', 'admin'] 
    },
    { 
      label: 'Quản Lý Người Dùng & Phân Quyền', 
      path: '/admin/nguoi-dung', 
      icon: Users, 
      badge: null, 
      roles: ['super_admin', 'admin'] 
    },
    { 
      label: 'Nhật Ký An Ninh', 
      path: '/admin/nhat-ky', 
      icon: ShieldCheck, 
      badge: null, 
      roles: ['super_admin', 'admin'] 
    },
    { 
      label: 'Cài Đặt & Cấu Hình Supabase', 
      path: '/admin/cai-dat', 
      icon: Settings, 
      badge: null, 
      roles: ['super_admin', 'admin'] 
    },
  ];

  const filteredNav = navigationItems.filter(item => {
    if (!currentUser) return false;
    return item.roles.includes(currentUser.role);
  });

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#174A87] text-[#F5C542] border border-[#174A87] shadow-sm">
            Quản Trị Viên
          </span>
        );
      case 'approver':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
            Người Duyệt Bài
          </span>
        );
      case 'editor':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
            Biên Tập Viên
          </span>
        );
    }
  };

  const copySqlCode = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex font-sans text-slate-800 selection:bg-[#174A87] selection:text-white">
      
      {/* 1. SIDEBAR (DESKTOP & MOBILE) */}
      <aside 
        className={`bg-white border-r border-[#DCE7F2] shadow-sm z-30 transition-all duration-300 flex flex-col justify-between fixed lg:sticky top-0 h-screen ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Header */}
        <div>
          <div className="p-4 border-b border-[#DCE7F2] flex items-center justify-between h-16 bg-white">
            <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate('/admin/tong-quan')}>
              <div className="w-9 h-9 bg-[#174A87] text-[#F5C542] rounded-xl font-black flex items-center justify-center font-display text-xs border border-[#174A87]/20 shadow-sm shrink-0">
                ITC
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <h2 className="text-xs font-black text-[#173F72] font-display uppercase truncate">
                    CMS QUẢN TRỊ
                  </h2>
                  <p className="text-[9px] font-bold text-slate-400 truncate">
                    XN In Tài Chính TP.HCM
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="Thu gọn menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/admin/tong-quan' && location.pathname === '/admin');

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                    isActive
                      ? 'bg-[#174A87] text-white shadow-md shadow-[#174A87]/20'
                      : 'text-slate-600 hover:bg-[#F7FAFF] hover:text-[#174A87]'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F5C542]' : 'text-slate-400 group-hover:text-[#174A87]'}`} />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!sidebarCollapsed && item.badge !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive 
                        ? 'bg-[#F5C542] text-[#174A87]' 
                        : (item as any).isWarningBadge 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : 'bg-blue-50 text-[#174A87]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-3 border-t border-[#DCE7F2] bg-[#F7FAFF]">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#174A87] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                  {currentUser?.fullName?.charAt(0) || 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-[#173F72] truncate">
                    {currentUser?.fullName}
                  </p>
                  <div className="mt-0.5">
                    {getRoleBadge(currentUser?.role || 'editor')}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#DCE7F2] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title display */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-[#174A87] uppercase tracking-wider hidden sm:inline">
                {companyInfo.name}
              </span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="text-slate-500 font-medium">Bảng Quản Trị CMS</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Supabase status indicator (Hidden for Editor) */}
            {currentUser?.role !== 'editor' && (
              <button
                onClick={() => setShowSqlModal(true)}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  supabaseConnected 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 animate-pulse'
                }`}
                title="Xem thông tin Supabase và SQL Setup"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{supabaseConnected ? 'Supabase: Đã kết nối' : 'Supabase: Thiết lập & SQL'}</span>
              </button>
            )}

            {/* View Public Website */}
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174A87] hover:text-[#123C70] bg-[#F7FAFF] hover:bg-blue-50 px-3 py-2 rounded-xl border border-[#DCE7F2] transition-colors"
            >
              <span>Xem Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-[#F7FAFF] rounded-xl border border-transparent hover:border-[#DCE7F2] transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#174A87] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {currentUser?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-[#173F72] leading-none">{currentUser?.fullName}</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">{currentUser?.email}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#DCE7F2] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-[#DCE7F2]">
                    <p className="text-xs font-black text-[#173F72]">{currentUser?.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                    <div className="mt-1.5">{getRoleBadge(currentUser?.role || 'editor')}</div>
                  </div>
                  
                  {currentUser?.role !== 'editor' && (
                    <>
                      <Link
                        to="/admin/cai-dat"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-[#F7FAFF] hover:text-[#174A87]"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Cài đặt hệ thống</span>
                      </Link>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setShowSqlModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-[#F7FAFF] hover:text-[#174A87] text-left cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span>Hướng dẫn Supabase & Vercel</span>
                      </button>
                      <div className="border-t border-[#DCE7F2] my-1" />
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left font-bold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Role permission indicator banner for Editor and Approver */}
        {userRole === 'editor' && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 sm:px-6 py-2 text-xs text-emerald-900 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              Bạn đang ở giao diện <strong>Biên Tập Viên</strong>: Bạn có thể tạo bài, tải ảnh, lưu bản nháp và gửi duyệt.
            </span>
            <Link to="/admin/bai-viet" className="font-bold text-emerald-700 hover:underline">Vào mục bài viết &rarr;</Link>
          </div>
        )}

        {userRole === 'approver' && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2 text-xs text-amber-900 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
              Bạn đang đăng nhập với quyền <strong>Người Duyệt Bài</strong>: Có quyền duyệt, từ chối, đăng hoặc ẩn bài viết và sắp xếp thư viện ảnh.
            </span>
            {pendingNewsCount > 0 && (
              <Link to="/admin/bai-viet" className="font-bold bg-amber-600 text-white px-2.5 py-0.5 rounded-full text-[11px] shadow-sm hover:bg-amber-700">
                Có {pendingNewsCount} bài chờ duyệt
              </Link>
            )}
          </div>
        )}

        {/* Dynamic CMS View Render */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* SQL Setup & Vercel Configuration Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#174A87]" />
                <h3 className="text-base font-black text-[#173F72] uppercase font-display">
                  Cấu Hình Supabase & Triển Khai Vercel
                </h3>
              </div>
              <button 
                onClick={() => setShowSqlModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="font-bold text-[#174A87] mb-1">Trạng thái kết nối Supabase:</p>
                <p className="text-slate-600 font-mono text-[11px]">
                  URL: {SUPABASE_URL || 'Chưa cấu hình VITE_SUPABASE_URL trong biến môi trường'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {supabaseConnected 
                    ? '✅ Đã kết nối Supabase Database và Storage thành công.' 
                    : '⚡ Đang chạy trên dữ liệu nội bộ. Hãy cấu hình biến môi trường trên Vercel để đồng bộ vào database Supabase.'}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-2">1. Khởi tạo Database Schema & RLS trong Supabase SQL Editor:</p>
                <p className="text-slate-600 mb-2 leading-relaxed">
                  Sao chép đoạn mã SQL dưới đây và dán vào mục <strong>SQL Editor</strong> trên Supabase Dashboard để tự động tạo các bảng <code>profiles</code>, <code>news_articles</code>, <code>gallery_items</code>, <code>audit_logs</code> và bucket <code>media</code>:
                </p>
                <div className="relative">
                  <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 scrollbar-thin">
                    {SUPABASE_SQL_SETUP}
                  </pre>
                  <button
                    onClick={copySqlCode}
                    className="absolute top-2 right-2 px-3 py-1.5 bg-[#F5C542] text-[#174A87] font-bold rounded-lg text-xs hover:bg-yellow-400 transition-colors shadow cursor-pointer"
                  >
                    {copiedSql ? '✓ Đã sao chép SQL!' : 'Sao chép toàn bộ SQL'}
                  </button>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-1">2. Biến môi trường trên Vercel:</p>
                <p className="text-slate-600 leading-relaxed">
                  Vào <strong>Vercel &rarr; Project Settings &rarr; Environment Variables</strong> và thêm 2 biến:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 font-mono text-[11px] text-slate-800">
                  <li><code>VITE_SUPABASE_URL</code>: URL Supabase của bạn</li>
                  <li><code>VITE_SUPABASE_ANON_KEY</code>: Anon public key từ Supabase</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-xl bg-[#174A87] text-white font-bold text-xs hover:bg-[#123C70] transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
