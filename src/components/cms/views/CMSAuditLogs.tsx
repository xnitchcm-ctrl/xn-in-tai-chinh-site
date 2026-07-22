import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Clock, 
  User, 
  Filter, 
  FileText 
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';

export default function CMSAuditLogs() {
  const { auditLogs } = useCMS();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Nhật Ký Tác Vụ An Ninh & Giám Sát (Audit Log)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ghi vết tự động 100% các hoạt động đăng nhập, chỉnh sửa nội dung, xóa tài khoản và thay đổi bảo mật ({auditLogs.length} ghi chép)
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-[#DCE7F2] shadow-sm flex items-center gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Tìm theo email, hành động hoặc chi tiết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#174A87]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-[#DCE7F2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#F7FAFF] text-[#173F72] uppercase font-bold text-[10px] tracking-wider border-b border-[#DCE7F2]">
              <tr>
                <th className="p-4">Thời gian</th>
                <th className="p-4">Tài khoản thực hiện</th>
                <th className="p-4">Loại hành động</th>
                <th className="p-4">Chi tiết tác vụ</th>
                <th className="p-4">Địa chỉ IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Chưa có nhật ký nào trùng khớp.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-4 font-bold text-[#174A87] whitespace-nowrap">{log.userEmail}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 font-bold text-[10px] rounded border border-blue-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-800 font-medium">{log.details}</td>
                    <td className="p-4 font-mono text-slate-400 text-[11px]">{log.ipAddress || '127.0.0.1'}</td>
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
