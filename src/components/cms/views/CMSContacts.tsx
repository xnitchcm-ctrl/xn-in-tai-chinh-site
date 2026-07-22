import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquareQuote, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  Building, 
  FileSpreadsheet,
  X,
  AlertCircle
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';

export default function CMSContacts() {
  const { quotes, updateQuoteStatus, deleteQuote } = useCMS();
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateQuoteStatus(id, newStatus);
      setNotice({ type: 'success', msg: `Đã cập nhật trạng thái đơn báo giá sang: ${newStatus}` });
    } catch (err: any) {
      setNotice({ type: 'error', msg: 'Lỗi khi cập nhật trạng thái đơn báo giá.' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Xóa yêu cầu báo giá từ "${name}"?`)) return;
    await deleteQuote(id);
    setNotice({ type: 'success', msg: 'Đã xóa yêu cầu báo giá.' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Quản Lý Yêu Cầu Báo Giá & Liên Hệ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Danh sách phiếu yêu cầu báo giá in ấn từ khách hàng gửi qua website public ({quotes.length} tin)
          </p>
        </div>
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

      {/* List of Quotes Table */}
      <div className="bg-white rounded-2xl border border-[#DCE7F2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#F7FAFF] text-[#173F72] uppercase font-bold text-[10px] tracking-wider border-b border-[#DCE7F2]">
              <tr>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Điện thoại / Email</th>
                <th className="p-4">Dịch vụ yêu cầu</th>
                <th className="p-4">Số lượng</th>
                <th className="p-4 max-w-xs">Ghi chú yêu cầu</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Chưa có phiếu yêu cầu báo giá nào gửi tới.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <h4 className="font-bold text-slate-900">{q.fullName}</h4>
                      <p className="text-[10px] text-slate-400">{q.companyName || 'Khách hàng cá nhân'}</p>
                    </td>
                    <td className="p-4 font-mono">
                      <p className="font-bold text-[#174A87]">{q.phone}</p>
                      <p className="text-[10px] text-slate-500">{q.email}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold text-[10px] rounded border border-amber-200">
                        {q.serviceType}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">{q.quantity}</td>
                    <td className="p-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-600 italic">"{q.note || 'Không có ghi chú thêm'}"</p>
                    </td>
                    <td className="p-4">
                      <select
                        value={q.status || 'Chưa xử lý'}
                        onChange={(e) => handleStatusChange(q.id, e.target.value)}
                        className="px-2.5 py-1 bg-[#F7FAFF] border border-[#DCE7F2] rounded-lg text-xs font-bold text-[#173F72]"
                      >
                        <option value="Mới nhận">Mới nhận</option>
                        <option value="Đang xử lý">Đang xử lý</option>
                        <option value="Đã gửi báo giá">Đã gửi báo giá</option>
                        <option value="Đã hoàn tất">Đã hoàn tất</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(q.id, q.fullName)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa phiếu báo giá"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
