import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  KeyRound, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Eye, 
  EyeOff,
  Check
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { getSupabaseClient, isSupabaseConfigured } from '../../utils/supabase';

export default function CMSResetPassword() {
  const { companyInfo, updateUserPassword, addAuditLog } = useCMS();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const supabase = getSupabaseClient();

  // Detect Supabase recovery session on load
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      if (!supabase || !isSupabaseConfigured) {
        // If Supabase not configured, allow local testing
        if (isMounted) {
          setHasRecoverySession(true);
          setCheckingSession(false);
        }
        return;
      }

      try {
        // 1. Check current session
        const { data: { session } } = await supabase.auth.getSession();
        
        // 2. Check if recovery parameters or token in URL hash / query
        const hash = window.location.hash;
        const search = window.location.search;
        const isRecoveryUrl = hash.includes('type=recovery') || hash.includes('access_token') || search.includes('code=');

        if (session || isRecoveryUrl) {
          if (isMounted) setHasRecoverySession(true);
        } else {
          // Listen for PASSWORD_RECOVERY event
          const { data: authListener } = supabase.auth.onAuthStateChange((event, s) => {
            if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && s)) {
              if (isMounted) setHasRecoverySession(true);
            }
          });

          // Wait brief moment for URL hash parsing
          setTimeout(() => {
            if (isMounted) {
              setCheckingSession(false);
            }
          }, 800);

          return () => {
            authListener.subscription.unsubscribe();
          };
        }
      } catch (err) {
        console.warn('Lỗi kiểm tra phiên recovery:', err);
      } finally {
        if (isMounted) setCheckingSession(false);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Xác nhận mật khẩu mới không trùng khớp.');
      return;
    }

    setLoading(true);

    try {
      if (supabase && isSupabaseConfigured) {
        // Direct call to supabase.auth.updateUser({ password: newPassword })
        const { data, error } = await supabase.auth.updateUser({ 
          password: newPassword 
        });

        if (error) {
          throw new Error(error.message || 'Không thể cập nhật mật khẩu trên Supabase.');
        }

        try {
          await addAuditLog('Đặt lại mật khẩu', 'Authentication', `Đã cập nhật mật khẩu mới qua link khôi phục thành công.`);
        } catch (_) {
          // Ignore audit log error
        }
      } else if (updateUserPassword) {
        const res = await updateUserPassword(newPassword);
        if (!res.success) {
          throw new Error(res.error || 'Cập nhật mật khẩu thất bại.');
        }
      }

      setSuccessMsg('Mật khẩu của bạn đã được cập nhật thành công! Đang chuyển về trang đăng nhập...');
      
      // Auto redirect to /admin/login after 1.8 seconds
      setTimeout(() => {
        navigate('/admin/login');
      }, 1800);
    } catch (err: any) {
      console.error('Lỗi đổi mật khẩu:', err);
      setErrorMsg(err.message || 'Có lỗi xảy ra khi cập nhật mật khẩu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col justify-between relative overflow-hidden font-sans text-slate-800">
      
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#174A87]/10 via-[#174A87]/3 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-[#174A87] text-[#F5C542] rounded-xl font-black flex items-center justify-center font-display text-base shadow">
            ITC
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-display leading-none">
              {companyInfo.parentCompany}
            </p>
            <h1 className="text-sm font-black text-[#174A87] font-display uppercase tracking-tight leading-none mt-1">
              Đặt Lại Mật Khẩu Mới
            </h1>
          </div>
        </div>

        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#174A87] hover:text-[#123C70] bg-white px-4 py-2 rounded-lg border border-[#DCE7F2] shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về trang đăng nhập</span>
        </Link>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-md mx-auto px-4 py-8 relative z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-[#DCE7F2] shadow-xl p-8 sm:p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#174A87]" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#174A87]/10 text-[#174A87] rounded-2xl mb-4 border border-[#174A87]/15">
              <KeyRound className="w-7 h-7 text-[#174A87]" />
            </div>
            <h2 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
              Tạo Mật Khẩu Mới
            </h2>
            <p className="text-xs text-slate-500 mt-2 font-normal leading-relaxed">
              Nhập mật khẩu quản trị mới cho tài khoản của bạn để hoàn tất việc khôi phục.
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  disabled={loading}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  className="w-full pl-11 pr-11 py-3 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87] focus:bg-white text-slate-800"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full pl-11 pr-11 py-3 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87] focus:bg-white text-slate-800"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Validation Checklist */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-[11px] text-slate-600">
              <div className={`flex items-center gap-1.5 ${newPassword.length >= 6 ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                <Check className={`w-3.5 h-3.5 ${newPassword.length >= 6 ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Tối thiểu 6 ký tự</span>
              </div>
              <div className={`flex items-center gap-1.5 ${newPassword && newPassword === confirmPassword ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                <Check className={`w-3.5 h-3.5 ${newPassword && newPassword === confirmPassword ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Hai mật khẩu trùng khớp</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#174A87] hover:bg-[#123C70] text-white font-bold text-xs uppercase tracking-wider font-display shadow-lg shadow-[#174A87]/20 flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
            >
              {loading ? (
                <span>Đang lưu mật khẩu...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Lưu Mật Khẩu & Đăng Nhập</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#DCE7F2] flex flex-col gap-2 text-center text-xs font-bold text-[#174A87]">
            <Link
              to="/admin/login"
              className="hover:underline inline-flex items-center justify-center gap-1.5 text-slate-600 hover:text-[#174A87]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang Đăng Nhập</span>
            </Link>
            <Link
              to="/admin/forgot-password"
              className="hover:underline text-[11px] text-slate-400 hover:text-[#174A87]"
            >
              Cần gửi lại link khôi phục email khác?
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-4 py-6 text-center text-xs text-slate-500 relative z-10 border-t border-[#DCE7F2]/60">
        <p>&copy; {new Date().getFullYear()} {companyInfo.name} — CMS QUẢN TRỊ NỘI DUNG</p>
      </footer>
    </div>
  );
}
