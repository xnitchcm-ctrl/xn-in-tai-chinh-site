import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export default function CMSLogin() {
  const { loginAdmin, companyInfo, brand } = useCMS();
  const navigate = useNavigate();

  const [email, setEmail] = useState('xnitchcm@gmail.com');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await loginAdmin(email, password, requires2FA ? otpCode : undefined);
      
      if (res?.requires2FA) {
        setRequires2FA(true);
        setSuccessMsg('Tài khoản yêu cầu xác thực 2 lớp (2FA). Vui lòng nhập mã OTP.');
        setLoading(false);
        return;
      }

      setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng đến bảng điều khiển...');
      setTimeout(() => {
        navigate('/quan-tri/tong-quan');
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreset = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('123456');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col justify-between relative overflow-hidden font-sans text-slate-800 selection:bg-[#174A87] selection:text-white">
      
      {/* Structural subtle ambient background pattern */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-[#174A87]/8 via-[#174A87]/3 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#F5C542]/10 blur-3xl rounded-full pointer-events-none" />

      {/* 1. TOP UTILITY NAVIGATION HEADER */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-[#174A87] text-[#F5C542] rounded-xl font-black flex items-center justify-center font-display text-base border border-[#174A87]/20 shadow-md">
            ITC
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-display leading-none">
              {companyInfo.parentCompany}
            </p>
            <h1 className="text-sm font-black text-[#174A87] font-display uppercase tracking-tight leading-none mt-1">
              {companyInfo.name}
            </h1>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#174A87] hover:text-[#123C70] bg-white px-4 py-2 rounded-lg border border-[#DCE7F2] shadow-sm hover:shadow transition-all group"
        >
          <span>Xem Website Public</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </header>

      {/* 2. MAIN LOGIN CARD CONTAINER */}
      <main className="w-full max-w-md mx-auto px-4 py-8 relative z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl border border-[#DCE7F2] shadow-xl shadow-blue-900/5 p-8 sm:p-10 relative overflow-hidden"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#174A87] via-[#123C70] to-[#F5C542]" />

          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#174A87]/10 text-[#174A87] rounded-2xl mb-4 border border-[#174A87]/15 shadow-inner">
              <ShieldCheck className="w-7 h-7 text-[#174A87]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#173F72] font-display uppercase tracking-tight">
              Đăng Nhập CMS Quản Trị
            </h2>
            <p className="text-xs text-slate-500 mt-2 font-normal leading-relaxed">
              Hệ thống quản lý nội dung & phân quyền truy cập dành riêng cho cán bộ Xí nghiệp In Tài Chính TP.HCM.
            </p>
          </div>

          {/* Error & Success Messages */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMsg}</div>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{successMsg}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-2">
                Email / Tài khoản quản trị
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="xnitchcm@gmail.com"
                  className="w-full pl-11 pr-4 py-3 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87] focus:bg-white focus:ring-2 focus:ring-[#174A87]/15 transition-all text-slate-800 font-medium placeholder-slate-400"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider">
                  Mật khẩu
                </label>
                <Link
                  to="/quan-tri/quen-mat-khau"
                  className="text-xs font-semibold text-[#174A87] hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87] focus:bg-white focus:ring-2 focus:ring-[#174A87]/15 transition-all text-slate-800 font-medium placeholder-slate-400"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg hover:bg-slate-100"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 2FA OTP Field when required */}
            {requires2FA && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2"
              >
                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Mã OTP Xác Thực 2FA (Authenticator / SMS)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Nhập 6 chữ số OTP (ví dụ: 123456)"
                    className="w-full pl-11 pr-4 py-3 text-xs bg-white border border-amber-300 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-mono tracking-widest text-center"
                  />
                  <KeyRound className="w-4 h-4 text-amber-600 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-amber-800 font-medium">Gợi ý thử nghiệm: Nhập mã <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono font-bold">123456</code> để truy cập.</p>
              </motion.div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#174A87] rounded border-[#DCE7F2] focus:ring-[#174A87]"
                />
                <span className="text-xs text-slate-600 font-medium">Duy trì phiên đăng nhập an toàn</span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#174A87] hover:bg-[#123C70] text-white font-bold text-xs uppercase tracking-wider font-display shadow-lg shadow-[#174A87]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xác thực bảo mật...</span>
                </>
              ) : (
                <>
                  <span>{requires2FA ? 'Xác Nhận OTP & Truy Cập' : 'Đăng Nhập CMS'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Quick presets for testing */}
          <div className="mt-8 pt-6 border-t border-[#DCE7F2] text-center">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-display mb-3 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
              Gợi Ý Tài Khoản Thử Nghiệm Tốc Độ
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickPreset('xnitchcm@gmail.com')}
                className="px-2.5 py-1.5 bg-[#174A87]/10 hover:bg-[#174A87]/20 text-[#174A87] rounded-lg border border-[#174A87]/20 font-bold transition-all"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('admin@xskthcm.com')}
                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 font-bold transition-all"
              >
                Admin Nội Dung
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('bientap@xskthcm.com')}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 font-bold transition-all"
              >
                Biên Tập Viên
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Mật khẩu thử nghiệm chung: <code className="font-mono font-bold bg-slate-100 px-1 py-0.5 rounded text-slate-600">123456</code> (Hệ thống tự khởi tạo tài khoản nếu chưa có trong DB)</p>
          </div>
        </motion.div>
      </main>

      {/* 3. FOOTER */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-6 text-center text-xs text-slate-500 relative z-10 border-t border-[#DCE7F2]/60">
        <p className="font-semibold text-slate-600">
          &copy; {new Date().getFullYear()} {companyInfo.name} — HỆ THỐNG CMS QUẢN TRỊ NỘI DUNG VÀ AN NINH THÔNG TIN
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          Bảo mật đa tầng | Mã hóa dữ liệu Firestore | Chuẩn ISO 9001:2015
        </p>
      </footer>

    </div>
  );
}
