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
  ShieldAlert,
  UserCheck,
  FileEdit,
  Mail,
  Shield
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { CMSUser, UserRole } from '../../../types';

export default function CMSUsers() {
  const { 
    users, 
    registerUser, 
    updateUserRole, 
    toggleUserStatus, 
    deleteUserAccount, 
    currentUser, 
    isAdmin 
  } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState<CMSUser | null>(null);

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('editor');

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#174A87] text-[#F5C542] rounded-full font-black text-[10px] border border-[#174A87] shadow-xs">
            <ShieldAlert className="w-3 h-3" />
            Quản Trị Viên (Admin)
          </span>
        );
      case 'approver':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-bold text-[10px]">
            <UserCheck className="w-3 h-3 text-amber-700" />
            Người Duyệt Bài (Approver)
          </span>
        );
      case 'editor':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full font-bold text-[10px]">
            <FileEdit className="w-3 h-3 text-emerald-700" />
            Biên Tập Viên (Editor)
          </span>
        );
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword || !newFullName) {
      setNotice({ type: 'error', msg: 'Vui lòng điền đầy đủ thông tin tài khoản.' });
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      const res = await registerUser(newEmail.trim(), newPassword, newFullName.trim(), newRole);
      if (!res.success) {
        setNotice({ type: 'error', msg: res.error || 'Lỗi khi tạo tài khoản.' });
        return;
      }

      setNotice({ type: 'success', msg: `Tạo tài khoản ${newEmail} (${newRole}) thành công!` });
      setIsCreating(false);
      setNewEmail('');
      setNewPassword('');
      setNewFullName('');
      setNewRole('editor');
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi tạo tài khoản.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRoleChange = async (uid: string, nextRole: UserRole) => {
    try {
      await updateUserRole(uid, nextRole);
      setNotice({ type: 'success', msg: 'Đã cập nhật phân quyền người dùng!' });
      setIsEditingRole(null);
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi đổi quyền.' });
    }
  };

  const handleToggleLock = async (user: CMSUser) => {
    if (user.uid === currentUser?.uid) {
      alert('Bạn không thể tự khóa tài khoản hiện đang đăng nhập của chính mình.');
      return;
    }
    try {
      await toggleUserStatus(user.uid, user.status || 'active');
      setNotice({ type: 'success', msg: `Đã thay đổi trạng thái tài khoản ${user.email}.` });
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi thay đổi trạng thái.' });
    }
  };

  const handleDelete = async (user: CMSUser) => {
    if (user.uid === currentUser?.uid) {
      alert('Bạn không thể xóa tài khoản hiện đang đăng nhập.');
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${user.email}?`)) return;
    try {
      await deleteUserAccount(user.uid);
      setNotice({ type: 'success', msg: `Đã xóa tài khoản ${user.email}.` });
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi xóa tài khoản.' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
              Quản Lý Tài Khoản & Phân Quyền
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#174A87] text-white">
              {users.length} tài khoản
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập 3 cấp độ phân quyền: <strong>Quản Trị Viên</strong>, <strong>Người Duyệt Bài</strong>, và <strong>Biên Tập Viên</strong>
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-5 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-[#174A87]/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Tài Khoản Mới</span>
          </button>
        )}
      </div>

      {/* Role explanation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#174A87]/20 shadow-xs">
          <div className="flex items-center gap-2 text-[#174A87] font-black text-xs uppercase font-display mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Quản Trị Viên (Admin)</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Toàn quyền hệ thống: Quản lý người dùng, phân quyền, duyệt bài, cấu hình thương hiệu, SEO, cài đặt Supabase.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
          <div className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase font-display mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Người Duyệt Bài (Approver)</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Duyệt bài viết, từ chối bài kèm lý do, xuất bản hoặc ẩn bài viết, sắp xếp và quản lý toàn bộ Thư viện ảnh.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase font-display mb-1">
            <FileEdit className="w-4 h-4" />
            <span>Biên Tập Viên (Editor)</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Tạo bài viết mới, tải ảnh lên Supabase Storage, lưu bản nháp và gửi duyệt bài viết đến Người duyệt bài.
          </p>
        </div>
      </div>

      {notice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-xs flex items-center justify-between font-medium border ${
            notice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{notice.msg}</span>
          </div>
          <button onClick={() => setNotice(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DCE7F2] shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tài khoản theo email hoặc họ tên..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87] focus:bg-white"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87] font-medium text-slate-700"
        >
          <option value="all">Tất cả phân quyền ({users.length})</option>
          <option value="admin">Quản Trị Viên (Admin)</option>
          <option value="approver">Người Duyệt Bài (Approver)</option>
          <option value="editor">Biên Tập Viên (Editor)</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#DCE7F2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7FAFF] border-b border-[#DCE7F2] text-slate-600 font-bold uppercase text-[10px] tracking-wider font-display">
              <tr>
                <th className="py-3.5 px-4">Thành Viên / Email</th>
                <th className="py-3.5 px-4">Vai Trò Phân Quyền</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4">Ngày Khởi Tạo</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isCurrent = user.uid === currentUser?.uid;

                return (
                  <tr key={user.uid} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#174A87] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#173F72] flex items-center gap-1.5">
                            <span>{user.fullName}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 bg-blue-100 text-[#174A87] rounded text-[9px] font-bold">
                                Chính bạn
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 font-mono text-[11px] mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getRoleBadge(user.role)}
                    </td>

                    <td className="py-3.5 px-4">
                      {user.status === 'locked' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-bold text-[10px]">
                          <Lock className="w-3 h-3 text-rose-500" />
                          Đã Khóa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Hoạt Động
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Role */}
                        {isAdmin && (
                          <button
                            onClick={() => setIsEditingRole(user)}
                            className="p-1.5 text-[#174A87] hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                            title="Đổi phân quyền vai trò"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        )}

                        {/* Lock / Unlock */}
                        {isAdmin && !isCurrent && (
                          <button
                            onClick={() => handleToggleLock(user)}
                            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                              user.status === 'locked' 
                                ? 'text-emerald-600 hover:bg-emerald-50' 
                                : 'text-amber-600 hover:bg-amber-50'
                            }`}
                            title={user.status === 'locked' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                          >
                            {user.status === 'locked' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>
                        )}

                        {/* Delete */}
                        {isAdmin && !isCurrent && (
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            title="Xóa tài khoản"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Account */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#DCE7F2]">
                <h3 className="text-sm font-black text-[#173F72] uppercase font-display">
                  Tạo Tài Khoản Quản Trị Mới
                </h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4 py-4 text-xs">
                <div>
                  <label className="block font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                    Họ và Tên Cán Bộ *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full p-3 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                    Email Đăng Nhập *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="canbo@intaichinh.vn"
                    className="w-full p-3 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                    Mật Khẩu Khởi Tạo *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự..."
                    className="w-full p-3 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#173F72] uppercase tracking-wider mb-1.5">
                    Phân Quyền Vai Trò *
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full p-3 bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#174A87] font-semibold text-slate-800"
                  >
                    <option value="editor">Biên Tập Viên (Editor) - Tạo & Gửi duyệt</option>
                    <option value="approver">Người Duyệt Bài (Approver) - Duyệt, xuất bản & ẩn bài</option>
                    <option value="admin">Quản Trị Viên (Admin) - Toàn quyền & Quản lý tài khoản</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-[#DCE7F2] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#DCE7F2] text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-[#174A87] hover:bg-[#123C70] text-white font-bold shadow-md shadow-[#174A87]/20 cursor-pointer"
                  >
                    {saving ? 'Đang tạo...' : 'Tạo Tài Khoản'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Edit Role */}
      {isEditingRole && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-sm font-black text-[#173F72] uppercase font-display mb-1">
              Đổi Phân Quyền Người Dùng
            </h3>
            <p className="text-slate-500 mb-4">
              Cập nhật vai trò phân quyền cho <strong>{isEditingRole.fullName}</strong> ({isEditingRole.email})
            </p>

            <div className="space-y-2 mb-5">
              {(['admin', 'approver', 'editor'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleSaveRoleChange(isEditingRole.uid, r)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between font-bold cursor-pointer transition-all ${
                    isEditingRole.role === r 
                      ? 'bg-blue-50 border-[#174A87] text-[#174A87]' 
                      : 'border-[#DCE7F2] hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {r === 'admin' ? <ShieldAlert className="w-4 h-4 text-[#174A87]" /> :
                     r === 'approver' ? <UserCheck className="w-4 h-4 text-amber-600" /> :
                     <FileEdit className="w-4 h-4 text-emerald-600" />}
                    <span>{r === 'admin' ? 'Quản Trị Viên (Admin)' : r === 'approver' ? 'Người Duyệt Bài (Approver)' : 'Biên Tập Viên (Editor)'}</span>
                  </div>
                  {isEditingRole.role === r && <CheckCircle2 className="w-4 h-4 text-[#174A87]" />}
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsEditingRole(null)}
                className="px-4 py-2 rounded-xl border border-[#DCE7F2] text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
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
