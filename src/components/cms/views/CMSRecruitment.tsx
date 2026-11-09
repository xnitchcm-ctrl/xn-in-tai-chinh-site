import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Users,
  MapPin,
  Clock,
  Check
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { JobVacancy } from '../../../types';

export default function CMSRecruitment() {
  const { vacancies, saveJobVacancy, deleteJobVacancy, hasPermission, isAdmin } = useCMS();

  const [isEditing, setIsEditing] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<JobVacancy>>({
    title: '',
    department: 'Phân Xưởng In Offset',
    location: 'TP. Hồ Chí Minh',
    type: 'Toàn thời gian',
    quantity: '01 người',
    deadline: '2026-12-31',
    salary: 'Mức lương thỏa thuận',
    requirements: [''],
    description: '',
    status: 'active'
  });

  const [requirementsText, setRequirementsText] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleOpenCreate = () => {
    setEditingJob({
      id: undefined,
      title: '',
      department: 'Phân Xưởng In Offset',
      location: 'TP. Hồ Chí Minh',
      type: 'Toàn thời gian',
      quantity: '01 người',
      deadline: '2026-12-31',
      salary: 'Mức lương thỏa thuận',
      requirements: [
        'Tốt nghiệp trung cấp/cao đẳng chuyên ngành In ấn / Cơ khí',
        'Có kinh nghiệm vận hành máy in Offset Komori / Heidelberg từ 1 năm'
      ],
      description: '',
      status: 'active'
    });
    setRequirementsText('Tốt nghiệp trung cấp/cao đẳng chuyên ngành In ấn / Cơ khí\nCó kinh nghiệm vận hành máy in Offset Komori / Heidelberg từ 1 năm');
    setIsEditing(true);
  };

  const handleOpenEdit = (job: JobVacancy) => {
    setEditingJob({ ...job });
    setRequirementsText((job.requirements || []).join('\n'));
    setIsEditing(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob.title || !editingJob.department) {
      setNotice({ type: 'error', msg: 'Vui lòng điền Chức danh tuyển dụng và Phòng ban.' });
      return;
    }

    const reqs = requirementsText
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean);

    try {
      await saveJobVacancy({
        id: editingJob.id,
        title: editingJob.title,
        department: editingJob.department,
        location: editingJob.location || 'TP. Hồ Chí Minh',
        type: editingJob.type || 'Toàn thời gian',
        quantity: editingJob.quantity || '01 người',
        deadline: editingJob.deadline || '',
        salary: editingJob.salary || 'Mức lương thỏa thuận',
        requirements: reqs,
        description: editingJob.description || '',
        status: editingJob.status || 'active',
        isClosed: editingJob.status === 'closed'
      });

      setNotice({ type: 'success', msg: 'Đã lưu vị trí tuyển dụng thành công!' });
      setIsEditing(false);
    } catch (err: any) {
      console.error('Lỗi khi lưu vị trí tuyển dụng:', err);
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi lưu vị trí tuyển dụng lên Supabase.' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Xóa vị trí tuyển dụng "${title}"?`)) return;

    try {
      const res = await deleteJobVacancy(id);
      if (res?.success) {
        setNotice({ type: 'success', msg: 'Đã xóa vị trí tuyển dụng thành công.' });
      }
    } catch (err: any) {
      console.error('Lỗi khi xóa vị trí tuyển dụng:', err);
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi xóa vị trí tuyển dụng trên Supabase.' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Quản Lý Tin Tuyển Dụng & Nhân Sự
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Đăng tin tuyển dụng kỹ sư vận hành máy in, thợ cơ khí, kiểm định KCS và nhân viên kế toán ({vacancies.length} vị trí)
          </p>
        </div>

        {(isAdmin || hasPermission('manage_content')) && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng Vị Trí Tuyển Dụng</span>
          </button>
        )}
      </div>

      {notice && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between font-medium ${
          notice.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notice.msg}</span>
          </div>
          <button onClick={() => setNotice(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid of Vacancies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vacancies.length === 0 ? (
          <div className="col-span-1 md:col-span-2 p-12 text-center bg-white rounded-2xl border border-[#DCE7F2] shadow-sm">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Chưa có vị trí tuyển dụng nào</h3>
            <p className="text-xs text-slate-400 mt-1">Dữ liệu được tải trực tiếp từ bảng recruitment_positions trên Supabase.</p>
            {isAdmin && (
              <button
                onClick={handleOpenCreate}
                className="mt-4 px-4 py-2 bg-[#174A87] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm vị trí đầu tiên
              </button>
            )}
          </div>
        ) : (
          vacancies.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl border border-[#DCE7F2] shadow-sm p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 font-bold text-[10px] rounded font-display uppercase">
                      {job.department}
                    </span>
                    {job.isClosed || job.status === 'closed' ? (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold text-[9px] rounded font-display uppercase border border-rose-200">
                        Đã đóng
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[9px] rounded font-display uppercase border border-emerald-200">
                        Đang tuyển
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {job.deadline ? `Hạn nộp: ${job.deadline}` : 'Tuyển liên tục'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{job.title}</h3>
                <p className="text-xs text-[#174A87] font-bold mt-1">Lương: {job.salary} • Số lượng: {job.quantity || '01 người'}</p>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <ul className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#174A87] shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{job.location || 'TP. Hồ Chí Minh'}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(job)}
                    title="Chỉnh sửa vị trí"
                    className="px-3 py-1.5 bg-[#174A87]/10 text-[#174A87] hover:bg-[#174A87]/20 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>
                  <button
                    onClick={() => handleDelete(job.id, job.title)}
                    title="Xóa vị trí tuyển dụng"
                    className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#DCE7F2] shadow-2xl w-full max-w-xl overflow-hidden my-auto"
            >
              <div className="p-6 bg-[#174A87] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#F5C542]" />
                  <h3 className="font-black font-display text-sm uppercase tracking-wider">
                    {editingJob.id ? 'Chỉnh Sửa Vị Trí Tuyển Dụng' : 'Tạo Tin Tuyển Dụng Mới'}
                  </h3>
                </div>
                <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-white/10 rounded-lg text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Chức Danh Tuyển Dụng *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Kỹ Sư Công Nghệ In"
                    value={editingJob.title || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                      Phòng Ban / Phân Xưởng *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Phân Xưởng In Offset"
                      value={editingJob.department || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                      Mức Lương
                    </label>
                    <input
                      type="text"
                      placeholder="Mức lương thỏa thuận"
                      value={editingJob.salary || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                      Số Lượng
                    </label>
                    <input
                      type="text"
                      placeholder="1 người"
                      value={editingJob.quantity || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, quantity: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                      Hạn Nộp Hồ Sơ
                    </label>
                    <input
                      type="date"
                      value={editingJob.deadline || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, deadline: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                      Trạng Thái
                    </label>
                    <select
                      value={editingJob.status || 'active'}
                      onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value, isClosed: e.target.value === 'closed' })}
                      className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold cursor-pointer"
                    >
                      <option value="active">Đang tuyển</option>
                      <option value="closed">Đã đóng</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Yêu Cầu Tuyển Dụng (Mỗi dòng một yêu cầu)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tốt nghiệp chuyên ngành Công nghệ In&#10;Có kinh nghiệm vận hành máy in Offset Komori&#10;Khả năng làm việc nhóm tốt"
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                    Mô Tả Công Việc (Tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Vận hành máy in; Kiểm tra chất lượng thành phẩm; Phối hợp ca kíp..."
                    value={editingJob.description || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Vào Supabase</span>
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
