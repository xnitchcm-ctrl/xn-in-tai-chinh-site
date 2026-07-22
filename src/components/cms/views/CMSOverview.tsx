import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  Sliders, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  MessageSquareQuote, 
  ArrowRight, 
  ExternalLink,
  Cpu,
  Ticket,
  Plus
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';

export default function CMSOverview() {
  const { 
    news, 
    services, 
    technologies, 
    gallery, 
    vacancies, 
    quotes, 
    users, 
    auditLogs, 
    currentUser, 
    companyInfo 
  } = useCMS();
  const navigate = useNavigate();

  const stats = [
    { label: 'Bài Viết & Tin Tức', count: news.length, icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-200', path: '/quan-tri/bai-viet' },
    { label: 'Dịch Vụ In', count: services.length, icon: Ticket, color: 'text-amber-600 bg-amber-50 border-amber-200', path: '/quan-tri/dich-vu' },
    { label: 'Máy Móc Công Nghệ', count: technologies.length, icon: Cpu, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', path: '/quan-tri/cong-nghe' },
    { label: 'Thư Viện Hình Ảnh', count: gallery.length, icon: ImageIcon, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', path: '/quan-tri/thu-vien' },
    { label: 'Tin Tuyển Dụng', count: vacancies.length, icon: Briefcase, color: 'text-purple-600 bg-purple-50 border-purple-200', path: '/quan-tri/tuyen-dung' },
    { label: 'Yêu Cầu Báo Giá', count: quotes.length, icon: MessageSquareQuote, color: 'text-rose-600 bg-rose-50 border-rose-200', path: '/quan-tri/lien-he' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Hero Banner */}
      <div className="bg-white rounded-2xl border border-[#DCE7F2] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#174A87]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#174A87] uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Xác thực hệ thống an toàn • Vai trò: <strong className="uppercase bg-[#174A87]/10 text-[#174A87] px-2 py-0.5 rounded font-black">{currentUser?.role || 'Admin'}</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#173F72] font-display tracking-tight uppercase">
            Bảng Điều Khiển CMS Quản Trị
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal leading-relaxed">
            Chào mừng <strong className="text-slate-800">{currentUser?.fullName || currentUser?.email}</strong>. Quản lý toàn bộ thông tin, nội dung, banner, tuyển dụng và cấu hình thương hiệu cho {companyInfo.name}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => navigate('/quan-tri/bai-viet')}
            className="px-4 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Bài Viết Mới</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#174A87] border border-[#DCE7F2] rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all"
          >
            <span>Trang Public</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-2xl border border-[#DCE7F2] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl border ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-[#173F72] font-display">{item.count}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 leading-tight">{item.label}</p>
                <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                  <span>Quản lý</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Activity & Quick Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent News Posts & Quote Requests (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Recent Posts */}
          <div className="bg-white rounded-2xl border border-[#DCE7F2] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#174A87]" />
                <h2 className="text-sm font-black text-[#173F72] font-display uppercase tracking-wider">
                  Bài Viết Mới Xuất Bản
                </h2>
              </div>
              <button
                onClick={() => navigate('/quan-tri/bai-viet')}
                className="text-xs font-bold text-[#174A87] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Tất cả bài viết</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {news.slice(0, 4).map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate('/quan-tri/bai-viet')}
                  className="p-3 rounded-xl border border-slate-100 hover:border-[#DCE7F2] hover:bg-[#F7FAFF] transition-all cursor-pointer flex items-center gap-4"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-display">
                      {post.category}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 truncate mt-1">
                      {post.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Đăng bởi: {post.author} • {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Quote Submissions */}
          <div className="bg-white rounded-2xl border border-[#DCE7F2] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-rose-600" />
                <h2 className="text-sm font-black text-[#173F72] font-display uppercase tracking-wider">
                  Yêu Cầu Báo Giá In Ấn Mới Nhận
                </h2>
              </div>
              <button
                onClick={() => navigate('/quan-tri/lien-he')}
                className="text-xs font-bold text-[#174A87] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Xem danh sách ({quotes.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {quotes.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                Chưa có yêu cầu báo giá mới nào. Khách hàng gửi từ trang chủ sẽ xuất hiện tại đây.
              </div>
            ) : (
              <div className="space-y-3">
                {quotes.slice(0, 3).map((q, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{q.fullName} ({q.phone})</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Dịch vụ: <strong>{q.serviceType}</strong> • Số lượng: {q.quantity}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                      {q.status || 'Chưa xử lý'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Security Audit Logs & System Status (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Audit Activity Feed */}
          <div className="bg-white rounded-2xl border border-[#DCE7F2] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-black text-[#173F72] font-display uppercase tracking-wider">
                  Nhật Ký Tác Vụ An Ninh
                </h2>
              </div>
              <button
                onClick={() => navigate('/quan-tri/nhat-ky')}
                className="text-xs font-bold text-[#174A87] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Nhật ký đầy đủ</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-500 text-[10px] mb-1">
                    <span className="font-bold text-[#174A87]">{log.userEmail}</span>
                    <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString('vi-VN')}</span>
                  </div>
                  <p className="font-semibold text-slate-800">{log.action}: <span className="font-normal text-slate-600">{log.details}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-[#174A87] text-white rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider font-display text-[#F5C542]">
              Lối Tắt Thao Tác Nhanh
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => navigate('/quan-tri/banner')}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-left transition-all"
              >
                🎨 Đổi Slide Banner
              </button>
              <button
                onClick={() => navigate('/quan-tri/dich-vu')}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-left transition-all"
              >
                🛠️ Sửa Dịch Vụ In
              </button>
              <button
                onClick={() => navigate('/quan-tri/thuong-hieu')}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-left transition-all"
              >
                🎨 Cài Đặt Màu & Logo
              </button>
              <button
                onClick={() => navigate('/quan-tri/seo')}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-left transition-all"
              >
                🔍 Cấu Hình SEO Meta
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
