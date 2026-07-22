import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Trash2, 
  Edit3, 
  Search, 
  X, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { CMSUser, UserRole } from '../../../types';

export default function CMSUsers() {
  const { users, saveUser, toggleLockUser, deleteUser, currentUser, hasPermission } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formUser, setFormUser] = useState<Partial<CMSUser>>({
    fullName: '',
    email: '',
    role: 'admin',
    status: 'active',
    twoFactorEnabled: false
  });

  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded-full font-bold text-[10px]">Super Admin</span>;
      case 'admin':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-full font-bold text-[10px]">Admin Nội Dung</span>;
      case 'editor':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-[10px]">Biên Tập Viên</span>;
      case 'author':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full font-bold text-[10px]">Người Viết</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-300 rounded-full font-bold text-[10px]">Người Xem</span>;
    }
  };

  const handleOpenCreate = () => {
    setFormUser({
      uid: `user-${Date.now()}`,
      fullName: '',
      email: '',
      role: 'admin',
      status: 'active',
      twoFactorEnabled: false,
      createdAt: new Date().toISOString()
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (u: CMSUser) => {
    setFormUser({ ...u });
    setIsEditing(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUser.email || !formUser.fullName) {
      setNotice({ type: 'error', msg: 'Vui lòng nhập đầy đủ Email và Họ tên người dùng.' });
      return;
    }

    try {
      await saveUser({
        uid: formUser.uid || `user-${Date.now()}`,
        email: formUser.email,
        fullName: formUser.fullName,
        role: formUser.role || 'admin',
        status: formUser.status || 'active',
        twoFactorEnabled: !!formUser.twoFactorEnabled,
        createdAt: formUser.createdAt || new Date().toISOString()
      });

      setNotice({ type: 'success', msg: 'Đã lưu tài khoản người dùng thành công!' });
      setIsEditing(false);
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi lưu tài khoản.' });
    }
  };

  const handleToggleLock = async (uid: string, email: string) => {
    if (uid === currentUser?.uid) {
      alert('Bạn không thể tự khóa tài khoản hiện đang đăng nhập của chính mình.');
      return;
    }
    await toggleLockUser(uid);
    setNotice({ type: 'success', msg: `Đã thay đổi trạng thái tài khoản ${email}.` });
  };

  const handleDelete = async (uid: string, email: string) => {
    if (uid === currentUser?.uid) {
      alert('Bạn không thể xóa tài khoản hiện đang đăng nhập.');
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${email}?`)) return;
    await deleteUser(uid);
    setNotice({ type: 'success', msg: `Đã xóa tài khoản ${email}.` });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Quản Lý Tài Khoản & Phân Quyền (RBAC)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cấp quyền truy cập 5 cấp bậc: Super Admin, Admin Nội dung, Biên tập viên, Người viết, Người xem ({users.length} tài khoản)
          </p>
        </div>

        {hasPermission('manage_users') && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Tài Khoản Mới</span>
          </button>
        )}
      </div>

      {notice && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between font-medium ${
          notice.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          <span>{notice.msg}</span>
          <button onClick={() => setNotice(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DCE7F2] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Tìm theo email hoặc họ tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Lọc Vai Trò:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-slate-700"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin Nội Dung</option>
            <option value="editor">Biên Tập Viên</option>
            <option value="author">Người Viết</option>
            <option value="viewer">Người Xem</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#DCE7F2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#F7FAFF] text-[#173F72] uppercase font-bold text-[10px] tracking-wider border-b border-[#DCE7F2]">
              <tr>
                <th className="p-4">Họ và tên</th>
                <th className="p-4">Email đăng nhập</th>
                <th className="p-4">Vai trò / Cấp bậc</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Bảo mật 2FA</th>
                <th className="p-4">Ngày tạo</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.uid} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{u.fullName}</td>
                  <td className="p-4 font-mono text-slate-600">{u.email}</td>
                  <td className="p-4">{getRoleBadge(u.role)}</td>
                  <td className="p-4">
                    {u.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full font-bold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Đã bị khóa
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {u.twoFactorEnabled ? (
                      <span className="text-emerald-600 font-bold">Bật</span>
                    ) : (
                      <span className="text-slate-400 font-medium">Tắt</span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-2 text-[#174A87] hover:bg-[#174A87]/10 rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa tài khoản"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleLock(u.uid, u.email)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title={u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {u.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      {u.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDelete(u.uid, u.email)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit / Create User */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#DCE7F2] shadow-2xl w-full max-w-lg overflow-hidden my-auto"
            >
              <div className="p-6 bg-[#174A87] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#F5C542]" />
                  <h3 className="font-black font-display text-sm uppercase tracking-wider">
                    {formUser.uid ? 'Chỉnh Sửa Tài Khoản' : 'Thêm Tài Khoản Mới'}
                  </h3>
                </div>
                <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-white/10 rounded-lg text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formUser.fullName || ''}
                    onChange={(e) => setFormUser({ ...formUser, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Email Đăng Nhập *
                  </label>
                  <input
                    type="email"
                    required
                    value={formUser.email || ''}
                    onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
                    placeholder="canbo@xskthcm.com"
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Vai Trò / Cấp Bậc Phân Quyền
                  </label>
                  <select
                    value={formUser.role || 'admin'}
                    onChange={(e) => setFormUser({ ...formUser, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold"
                  >
                    <option value="super_admin">Super Admin (Toàn quyền hệ thống & User)</option>
                    <option value="admin">Admin Nội Dung (Quản lý toàn bộ bài viết, dịch vụ, media)</option>
                    <option value="editor">Biên Tập Viên (Đăng bài, chỉnh sửa bài viết & media)</option>
                    <option value="author">Người Viết (Soạn bài viết, lưu nháp)</option>
                    <option value="viewer">Người Xem (Chỉ xem dữ liệu, không có quyền chỉnh sửa)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formUser.status === 'active'}
                      onChange={(e) => setFormUser({ ...formUser, status: e.target.checked ? 'active' : 'locked' })}
                      className="w-4 h-4 text-[#174A87] rounded border-[#DCE7F2]"
                    />
                    <span className="text-xs font-bold text-[#173F72]">Kích hoạt tài khoản</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!formUser.twoFactorEnabled}
                      onChange={(e) => setFormUser({ ...formUser, twoFactorEnabled: e.target.checked })}
                      className="w-4 h-4 text-[#174A87] rounded border-[#DCE7F2]"
                    />
                    <span className="text-xs font-bold text-[#173F72]">Yêu cầu 2FA OTP</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
                  >
                    Lưu Tài Khoản
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
