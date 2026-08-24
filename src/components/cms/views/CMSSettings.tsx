import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  KeyRound, 
  Database, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  Server,
  Cloud,
  Check,
  Code
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { SUPABASE_URL, isSupabaseConfigured, SUPABASE_SQL_SETUP } from '../../../utils/supabase';

export default function CMSSettings() {
  const { currentUser, requestPasswordReset, supabaseConnected } = useCMS();

  const [resetEmail, setResetEmail] = useState(currentUser?.email || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [loadingReset, setLoadingReset] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    setLoadingReset(true);
    try {
      const res = await requestPasswordReset(resetEmail);
      if (res.success) {
        setNotice({ type: 'success', msg: `Đã gửi liên kết khôi phục mật khẩu tới email ${resetEmail}.` });
      } else {
        setNotice({ type: 'error', msg: res.error || 'Lỗi khi gửi yêu cầu.' });
      }
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi xử lý yêu cầu.' });
    } finally {
      setLoadingReset(false);
    }
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Cài Đặt Hệ Thống & Cấu Hình Supabase
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý kết nối cơ sở dữ liệu Supabase, phân quyền RLS, biến môi trường Vercel và bảo mật tài khoản
          </p>
        </div>
      </div>

      {notice && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-3 font-medium border ${
          notice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{notice.msg}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Supabase Status Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#174A87]" />
              <h2 className="text-sm font-black text-[#173F72] font-display uppercase tracking-wider">
                Kết Nối Supabase Database
              </h2>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
              supabaseConnected 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
            }`}>
              {supabaseConnected ? '● Đã Kết Nối' : '● Demo Local Mode'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Hệ thống CMS kết nối Supabase PostgreSQL với Row Level Security (RLS) để lưu trữ bài viết, thư viện ảnh và tài khoản.
          </p>

          <div className="space-y-2 p-4 bg-[#F7FAFF] rounded-xl border border-[#DCE7F2] text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Supabase Project URL:</span>
              <span className="text-[#174A87] font-semibold break-all">
                {SUPABASE_URL || 'Chưa cấu hình (đang dùng fallback an toàn)'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5 font-display">
              <Cloud className="w-4 h-4 text-[#174A87]" />
              Thiết Lập Biến Môi Trường Trên Vercel:
            </h3>
            <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono space-y-1">
              <p className="text-emerald-400">VITE_SUPABASE_URL=https://your-project.supabase.co</p>
              <p className="text-emerald-400">VITE_SUPABASE_ANON_KEY=eyJh......</p>
            </div>
          </div>
        </div>

        {/* Password Reset Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <KeyRound className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-black text-[#173F72] font-display uppercase tracking-wider">
              Khôi Phục Mật Khẩu
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Gửi email khôi phục mật khẩu thông qua hệ thống Supabase Auth để thiết lập lại mật khẩu an toàn.
          </p>

          <form onSubmit={handlePasswordReset} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email nhận liên kết đặt lại mật khẩu:
              </label>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="admin@intaichinh.vn"
                className="w-full p-3 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87]"
              />
            </div>

            <button
              type="submit"
              disabled={loadingReset}
              className="px-5 py-2.5 rounded-xl bg-[#174A87] hover:bg-[#123C70] text-white text-xs font-bold uppercase shadow cursor-pointer transition-all"
            >
              {loadingReset ? 'Đang gửi...' : 'Gửi Email Đặt Lại Mật Khẩu'}
            </button>
          </form>
        </div>

      </div>

      {/* SQL Script Viewer & Copier */}
      <div className="bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-[#174A87]" />
            <h2 className="text-sm font-black text-[#173F72] font-display uppercase tracking-wider">
              Mã SQL Tạo Bảng & Phân Quyền RLS Supabase
            </h2>
          </div>

          <button
            onClick={copySql}
            className="px-4 py-2 bg-[#F5C542] hover:bg-yellow-400 text-[#174A87] text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSql ? 'Đã sao chép SQL!' : 'Sao chép toàn bộ SQL'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Đoạn mã này tạo các bảng <code>profiles</code>, <code>news_articles</code>, <code>gallery_items</code>, <code>audit_logs</code>, kích hoạt bảo mật <strong>Row Level Security (RLS)</strong> và tạo bucket lưu trữ ảnh <code>media</code>. Dán vào <strong>Supabase Dashboard &rarr; SQL Editor &rarr; New Query &rarr; Run</strong>.
        </p>

        <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-72 scrollbar-thin">
          {SUPABASE_SQL_SETUP}
        </pre>
      </div>

    </div>
  );
}
