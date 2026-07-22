import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  KeyRound, 
  Mail, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export default function CMSForgotPassword() {
  const { requestPasswordReset, confirmPasswordResetWithOTP, companyInfo } = useCMS();
  const navigate = useNavigate();

  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('xnitchcm@gmail.com');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccessMsg(`Mã OTP đặt lại mật khẩu đã được gửi thành công đến email: ${email}`);
      setStep('reset');
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể gửi yêu cầu khôi phục. Vui lòng kiểm tra địa chỉ email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Xác nhận mật khẩu mới không trùng khớp.');
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordResetWithOTP(email, otpCode, newPassword);
      setSuccessMsg('Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.');
      setTimeout(() => {
        navigate('/quan-tri/dang-nhap');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Mã OTP không đúng hoặc đã hết hạn.');
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
              Khôi Phục Mật Khẩu CMS
            </h1>
          </div>
        </div>

        <Link
          to="/quan-tri/dang-nhap"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#174A87] hover:text-[#123C70] bg-white px-4 py-2 rounded-lg border border-[#DCE7F2] shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại đăng nhập</span>
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
              {step === 'request' ? 'Quên Mật Khẩu Truy Cập' : 'Đặt Lai Mật Khẩu Mới'}
            </h2>
            <p className="text-xs text-slate-500 mt-2 font-normal leading-relaxed">
              {step === 'request'
                ? 'Nhập địa chỉ email quản trị đã đăng ký để nhận mã OTP xác minh qua hệ thống.'
                : 'Nhập mã OTP 6 chữ số vừa nhận được cùng mật khẩu mới của bạn.'}
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

          {step === 'request' ? (
            <form onSubmit={handleRequestSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-2">
                  Email quản trị đã cấp
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="xnitchcm@gmail.com"
                    className="w-full pl-11 pr-4 py-3 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87] focus:bg-white text-slate-800 font-medium"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#174A87] hover:bg-[#123C70] text-white font-bold text-xs uppercase tracking-wider font-display shadow-lg shadow-[#174A87]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {loading ? 'Đang gửi mã OTP...' : 'Gửi Mã Xác Thực OTP'}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                  Mã OTP 6 Chữ Số
                </label>
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Nhập 123456"
                  className="w-full px-4 py-3 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-mono text-center tracking-widest text-slate-800 font-bold focus:outline-none focus:border-[#174A87]"
                />
                <p className="text-[10px] text-slate-400 mt-1">Gợi ý thử nghiệm: Nhập <code className="font-mono text-slate-700 font-bold">123456</code> hoặc <code className="font-mono text-slate-700 font-bold">888888</code></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mật khẩu mới tối thiểu 6 ký tự"
                    className="w-full pl-11 pr-11 py-3 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87]"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-4 py-3 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87]"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#174A87] hover:bg-[#123C70] text-white font-bold text-xs uppercase tracking-wider font-display shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
              >
                {loading ? 'Đang cập nhật...' : 'Xác Nhận Đặt Lai Mật Khẩu'}
              </motion.button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-[#DCE7F2] text-center">
            <Link
              to="/quan-tri/dang-nhap"
              className="text-xs font-bold text-[#174A87] hover:underline inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Nhớ mật khẩu? Đăng nhập ngay</span>
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
