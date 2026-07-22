import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Search, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Eye 
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { CMSSEO as CMSSEOType } from '../../../types';

export default function CMSSEO() {
  const { seo, saveSEO, hasPermission } = useCMS();

  const [formSEO, setFormSEO] = useState<CMSSEOType>({ ...seo });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      await saveSEO(formSEO);
      setNotice({ type: 'success', msg: 'Đã lưu cấu hình SEO & Thẻ Meta thành công!' });
    } catch (err: any) {
      setNotice({ type: 'error', msg: err.message || 'Lỗi khi lưu cấu hình SEO.' });
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
            Quản Lý Cấu Hình SEO & Thẻ Meta
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tối ưu hóa tìm kiếm Google (SEO), tiêu đề trang, từ khóa ngành in bảo mật, OpenGraph cho Facebook & Zalo.
          </p>
        </div>

        {hasPermission('manage_settings') && (
          <button
            onClick={handleSaveSubmit}
            disabled={saving}
            className="px-6 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Đang lưu...' : 'Lưu Cấu Hình SEO'}</span>
          </button>
        )}
      </div>

      {notice && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-3 font-medium ${
          notice.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{notice.msg}</span>
        </div>
      )}

      {/* SEO Form & Preview */}
      <form onSubmit={handleSaveSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Settings Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Search className="w-5 h-5 text-[#174A87]" />
            <h2 className="text-sm font-black text-[#173F72] font-display uppercase tracking-wider">
              Thẻ Meta Tìm Kiếm Toàn Trang
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
              Tiêu Đề Trang Meta (Meta Title) *
            </label>
            <input
              type="text"
              required
              value={formSEO.metaTitle || ''}
              onChange={(e) => setFormSEO({ ...formSEO, metaTitle: e.target.value })}
              className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-bold text-slate-900"
            />
            <p className="text-[10px] text-slate-400 mt-1">Đề xuất: 50–60 ký tự ({formSEO.metaTitle?.length || 0} ký tự)</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
              Mô Tả Trang Meta (Meta Description) *
            </label>
            <textarea
              rows={3}
              required
              value={formSEO.metaDescription || ''}
              onChange={(e) => setFormSEO({ ...formSEO, metaDescription: e.target.value })}
              className="w-full p-3 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl leading-relaxed"
            />
            <p className="text-[10px] text-slate-400 mt-1">Đề xuất: 150–160 ký tự ({formSEO.metaDescription?.length || 0} ký tự)</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
              Từ Khóa SEO (Meta Keywords)
            </label>
            <input
              type="text"
              value={formSEO.metaKeywords || ''}
              onChange={(e) => setFormSEO({ ...formSEO, metaKeywords: e.target.value })}
              placeholder="xí nghiệp in tài chính, in vé số, in offset hcm, in chứng từ bảo mật"
              className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-mono text-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
              Đường Dẫn Chuẩn Canonical URL
            </label>
            <input
              type="url"
              value={formSEO.canonicalUrl || ''}
              onChange={(e) => setFormSEO({ ...formSEO, canonicalUrl: e.target.value })}
              placeholder="https://xinhiepintaichinh.com"
              className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-mono text-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#173F72] uppercase tracking-wider mb-1">
              Lệnh Chỉ Mục Robot (Robots Meta)
            </label>
            <input
              type="text"
              value={formSEO.robotsText || 'index, follow'}
              onChange={(e) => setFormSEO({ ...formSEO, robotsText: e.target.value })}
              className="w-full px-4 py-2.5 text-xs bg-[#F7FAFF] border border-[#DCE7F2] rounded-xl font-mono text-slate-700 font-bold"
            />
          </div>
        </div>

        {/* Live Search Result Snippet Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Eye className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-black text-[#173F72] font-display uppercase tracking-wider">
                Mẫu Hiển Thị Trên Google Search
              </h2>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-600 truncate">
                <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-mono text-[11px] text-slate-500">{formSEO.canonicalUrl || 'https://xinhiepintaichinh.com'}</span>
              </div>
              <h3 className="text-base font-bold text-blue-800 hover:underline cursor-pointer line-clamp-1">
                {formSEO.metaTitle || 'Xí Nghiệp In Tài Chính TP.HCM'}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {formSEO.metaDescription || 'Đơn vị in ấn chứng từ bảo mật, vé số kiến thiết, hóa đơn tài chính hàng đầu TP. Hồ Chí Minh.'}
              </p>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
