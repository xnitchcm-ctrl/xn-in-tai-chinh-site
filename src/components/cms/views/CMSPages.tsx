import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileCode, 
  Save, 
  Building, 
  Target, 
  Ticket, 
  Cpu, 
  ImageIcon, 
  Users, 
  Mail, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';

export default function CMSPages() {
  const { companyInfo, saveCompanyInfo, statistics, saveStatistics, hasPermission } = useCMS();

  const [activeTab, setActiveTab] = useState<'info' | 'stats'>('info');
  const [formInfo, setFormInfo] = useState({ ...companyInfo });
  const [formStats, setFormStats] = useState([...statistics]);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      await saveCompanyInfo(formInfo);
      setNotice({ type: 'success', msg: 'Đã lưu thông tin doanh nghiệp và trang giới thiệu thành công!' });
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi lưu thông tin.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      await saveStatistics(formStats);
      setNotice({ type: 'success', msg: 'Đã lưu chỉ số thống kê thành công!' });
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi lưu thống kê.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Quản Lý Trang Tĩnh & Nội Dung Giới Thiệu
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Chỉnh sửa các văn bản tiêu đề, lịch sử xí nghiệp, số liệu thống kê KPI và địa chỉ hành chính.
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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DCE7F2] pb-2">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'info'
              ? 'bg-[#174A87] text-white shadow'
              : 'bg-white text-slate-600 border border-[#DCE7F2] hover:bg-slate-50'
          }`}
        >
          Thông Tin Xí Nghiệp & Slogan
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-[#174A87] text-white shadow'
              : 'bg-white text-slate-600 border border-[#DCE7F2] hover:bg-slate-50'
          }`}
        >
          Số Liệu Thống Kê KPI (Stat Counter)
        </button>
      </div>

      {activeTab === 'info' ? (
        <form onSubmit={handleSaveCompany} className="bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                Tên Đơn Vị Xí Nghiệp
              </label>
              <input
                type="text"
                required
                value={formInfo.name}
                onChange={(e) => setFormInfo({ ...formInfo, name: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                Đơn Vị Chủ Quản
              </label>
              <input
                type="text"
                required
                value={formInfo.parentCompany}
                onChange={(e) => setFormInfo({ ...formInfo, parentCompany: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                Khẩu Hiệu / Slogan Hành Động
              </label>
              <input
                type="text"
                required
                value={formInfo.slogan}
                onChange={(e) => setFormInfo({ ...formInfo, slogan: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold text-[#174A87]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                Năm Thành Lập
              </label>
              <input
                type="text"
                value={formInfo.establishedYear}
                onChange={(e) => setFormInfo({ ...formInfo, establishedYear: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                Địa Chỉ Nhà Máy / Văn Phòng Sản Xuất
              </label>
              <input
                type="text"
                required
                value={formInfo.address}
                onChange={(e) => setFormInfo({ ...formInfo, address: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                Số Điện Thoại / Hotline
              </label>
              <input
                type="text"
                value={formInfo.phone}
                onChange={(e) => setFormInfo({ ...formInfo, phone: e.target.value, phoneDisplay: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
                Email Hành Chính
              </label>
              <input
                type="email"
                value={formInfo.email}
                onChange={(e) => setFormInfo({ ...formInfo, email: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Đang lưu...' : 'Lưu Thông Tin Trang'}</span>
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSaveStats} className="bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm space-y-6">
          <div className="space-y-4">
            {formStats.map((stat, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Giá trị số ({idx + 1})</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const updated = [...formStats];
                      updated[idx].value = e.target.value;
                      setFormStats(updated);
                    }}
                    className="w-full px-3 py-2 text-xs font-black font-display text-[#174A87] bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tiêu đề nhãn</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const updated = [...formStats];
                      updated[idx].label = e.target.value;
                      setFormStats(updated);
                    }}
                    className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="md:col-span-5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mô tả ngắn</label>
                  <input
                    type="text"
                    value={stat.desc}
                    onChange={(e) => {
                      const updated = [...formStats];
                      updated[idx].desc = e.target.value;
                      setFormStats(updated);
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Đang lưu...' : 'Lưu Số Liệu Thống Kê'}</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
