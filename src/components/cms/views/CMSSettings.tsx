import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  LogOut 
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';

export default function CMSSettings() {
  const { currentUser, enableTwoFactor, revokeSession } = useCMS();

  const [is2FA, setIs2FA] = useState(currentUser?.twoFactorEnabled || false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleToggle2FA = async () => {
    try {
      const nextState = !is2FA;
      await enableTwoFactor(nextState);
      setIs2FA(nextState);
      setNotice({ 
        type: 'success', 
        msg: nextState 
          ? 'Đã bật xác minh 2 bước 2FA thành công cho tài khoản.' 
          : 'Đã tắt xác minh 2 bước 2FA.' 
      });
    } catch (err: any) {
      setNotice({ type: 'error', msg: 'Lỗi khi cập nhật cấu hình 2FA.' });
    }
  };

  const handleRevokeSession = async () => {
    try {
      await revokeSession('current');
      setNotice({ type: 'success', msg: 'Đã thu hồi phiên làm việc từ các thiết bị khác.' });
    } catch (err: any) {
      setNotice({ type: 'error', msg: 'Lỗi khi thu hồi phiên.' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Cài Đặt An Ninh & Phiên Đăng Nhập
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý xác thực 2 lớp OTP (2FA), mật khẩu, thu hồi phiên làm việc từ xa và nhật ký bảo mật.
          </p>
        </div>
      </div>

      {notice && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-3 font-medium ${
          notice.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{notice.msg}</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 2FA Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Smartphone className="w-5 h-5 text-[#174A87]" />
            <h2 className="text-sm font-black text-[#173F72] font-display uppercase tracking-wider">
              Xác Thực 2 Lớp (2FA OTP)
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Yêu cầu nhập mã OTP 6 chữ số từ ứng dụng Google Authenticator / Microsoft Authenticator khi đăng nhập vào hệ thống CMS.
          </p>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Trạng Thái 2FA</span>
              <span className="text-[11px] text-slate-500">
                {is2FA ? 'Đang được bảo vệ bởi 2FA' : 'Chưa bật 2FA'}
              </span>
            </div>

            <button
              onClick={handleToggle2FA}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                is2FA ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-[#174A87] text-white hover:bg-[#123C70]'
              }`}
            >
              {is2FA ? 'Tắt 2FA' : 'Kích Hoạt 2FA'}
            </button>
          </div>
        </div>

        {/* Sessions Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Lock className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-black text-[#173F72] font-display uppercase tracking-wider">
              Quản Lý Phiên Làm Việc
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Thu hồi toàn bộ cookie đăng nhập và phiên làm việc từ xa trên các trình duyệt hoặc thiết bị khác.
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Thiết Bị Hiện Tại</span>
              <span className="text-[11px] text-emerald-700 font-bold">Trình duyệt Web Cloud Run Container • Đang hoạt động</span>
            </div>

            <button
              onClick={handleRevokeSession}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Đăng Xuất Khỏi Thiết Bị Khác
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
