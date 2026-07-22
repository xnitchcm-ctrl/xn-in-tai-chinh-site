import React, { useState } from 'react';
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
  Lock
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export default function CMSLayout() {
  const { currentUser, logoutAdmin, companyInfo, news, quotes, vacancies, brand } = useCMS();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigationItems = [
    { label: 'Tổng Quan', path: '/quan-tri/tong-quan', icon: LayoutDashboard, badge: null, roles: ['super_admin', 'admin', 'editor', 'author', 'viewer'] },
    { label: 'Trang Tĩnh & Nội Dung', path: '/quan-tri/trang', icon: FileCode, badge: null, roles: ['super_admin', 'admin', 'editor'] },
    { label: 'Bài Viết & Tin Tức', path: '/quan-tri/bai-viet', icon: FileText, badge: news.length, roles: ['super_admin', 'admin', 'editor', 'author'] },
    { label: 'Danh Mục', path: '/quan-tri/danh-muc', icon: Tag, badge: null, roles: ['super_admin', 'admin', 'editor'] },
    { label: 'Kho Media & Tệp Tin', path: '/quan-tri/hinh-anh', icon: FolderKanban, badge: null, roles: ['super_admin', 'admin', 'editor'] },
    { label: 'Banner Slide', path: '/quan-tri/banner', icon: Sliders, badge: null, roles: ['super_admin', 'admin', 'editor'] },
    { label: 'Dịch Vụ In', path: '/quan-tri/dich-vu', icon: Ticket, badge: null, roles: ['super_admin', 'admin', 'editor'] },
    { label: 'Máy Móc Công Nghệ', path: '/quan-tri/cong-nghe', icon: Cpu, badge: null, roles: ['super_admin', 'admin', 'editor'] },
    { label: 'Thư Viện Ảnh', path: '/quan-tri/thu-vien', icon: ImageIcon, badge: null, roles: ['super_admin', 'admin', 'editor'] },
    { label: 'Tuyển Dụng', path: '/quan-tri/tuyen-dung', icon: Briefcase, badge: vacancies.length, roles: ['super_admin', 'admin', 'editor'] },
    { label: 'Yêu Cầu Báo Giá', path: '/quan-tri/lien-he', icon: MessageSquareQuote, badge: quotes.length, roles: ['super_admin', 'admin', 'editor'] },
    { label: 'Cấu Hình Thương Hiệu', path: '/quan-tri/thuong-hieu', icon: Palette, badge: null, roles: ['super_admin', 'admin'] },
    { label: 'Cấu Hình SEO Meta', path: '/quan-tri/seo', icon: Search, badge: null, roles: ['super_admin', 'admin'] },
    { label: 'Quản Lý Người Dùng', path: '/quan-tri/nguoi-dung', icon: Users, badge: null, roles: ['super_admin'] },
    { label: 'Nhật Ký An Ninh', path: '/quan-tri/nhat-ky', icon: ShieldCheck, badge: null, roles: ['super_admin', 'admin'] },
    { label: 'Cài Đặt & Bảo Mật', path: '/quan-tri/cai-dat', icon: Settings, badge: null, roles: ['super_admin', 'admin', 'editor', 'author', 'viewer'] },
  ];

  const filteredNav = navigationItems.filter(item => {
    if (!currentUser) return false;
    return item.roles.includes(currentUser.role);
  });

  const handleLogout = () => {
    logoutAdmin();
    navigate('/quan-tri/dang-nhap');
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
          <div className="p-4 border-b border-[#DCE7F2] flex items-center justify-between h-16">
            <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate('/quan-tri/tong-quan')}>
              <div className="w-9 h-9 bg-[#174A87] text-[#F5C542] rounded-xl font-black flex items-center justify-center font-display text-xs border border-[#174A87]/20 shadow-sm shrink-0">
                ITC
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <h2 className="text-xs font-black text-[#173F72] font-display uppercase truncate">
                    CMS QUẢN TRỊ
                  </h2>
                  <p className="text-[9px] font-bold text-slate-400 truncate">
                    XN In Tài Chính
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

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

                  {!sidebarCollapsed && item.badge !== null && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#F5C542] text-[#174A87]' : 'bg-blue-50 text-[#174A87]'
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
                <div className="w-8 h-8 rounded-full bg-[#174A87] text-white font-bold flex items-center justify-center text-xs shrink-0">
                  {currentUser?.fullName?.charAt(0) || 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.fullName || currentUser?.email}</p>
                  <p className="text-[10px] uppercase font-black text-[#174A87] font-display">{currentUser?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full py-2 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. MAIN CONTENT VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Sticky Header */}
        <header className="bg-white border-b border-[#DCE7F2] h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          
          {/* Mobile menu toggle & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-[#174A87]">CMS Quản Trị</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-800 font-bold uppercase tracking-wider">
                {navigationItems.find(i => i.path === location.pathname)?.label || 'Bảng Điều Khiển'}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            
            {/* View Public Site Button */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-[#174A87] hover:text-[#123C70] bg-[#F7FAFF] px-3.5 py-2 rounded-xl border border-[#DCE7F2] shadow-xs hover:shadow transition-all"
            >
              <span>Xem Website Public</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Notification Badge */}
            <button
              onClick={() => navigate('/quan-tri/lien-he')}
              className="p-2 text-slate-500 hover:text-[#174A87] hover:bg-slate-50 rounded-xl relative transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {quotes.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#174A87] text-[#F5C542] font-black flex items-center justify-center text-xs font-display">
                  {currentUser?.fullName?.charAt(0) || 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-none">{currentUser?.fullName || currentUser?.email}</p>
                  <p className="text-[9px] uppercase font-black text-[#174A87] font-display mt-0.5">{currentUser?.role}</p>
                </div>
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#DCE7F2] shadow-xl p-2 z-50 space-y-1"
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser?.fullName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{currentUser?.email}</p>
                    </div>

                    <Link
                      to="/quan-tri/cai-dat"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#F7FAFF] hover:text-[#174A87]"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Đổi Mật Khẩu & 2FA</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng Xuất Quyền Quản Trị</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* View Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="px-8 py-4 bg-white border-t border-[#DCE7F2] text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>&copy; {new Date().getFullYear()} {companyInfo.name} — CMS SYSTEM v2.5</p>
          <p className="text-[10px]">Hệ thống quản trị an toàn • Mã hóa dữ liệu Firestore</p>
        </footer>

      </div>

    </div>
  );
}
