import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Folder, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Copy, 
  Check, 
  Search, 
  Trash2, 
  X,
  ExternalLink
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';

export default function CMSMedia() {
  const { news, gallery, services } = useCMS();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Consolidate images from posts, gallery and services as asset library
  const mediaAssets = [
    ...news.map(n => ({ id: n.id, name: n.title, url: n.imageUrl, source: 'Bài viết' })),
    ...gallery.map(g => ({ id: g.id, name: g.title, url: g.imageUrl, source: 'Thư viện ảnh' })),
    ...services.map(s => ({ id: s.id, name: s.title, url: s.image, source: 'Dịch vụ' })),
  ];

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DCE7F2] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-[#173F72] font-display uppercase tracking-tight">
            Thư Viện Media & Tệp Tin
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý tập trung toàn bộ kho ảnh, biểu trưng logo, banner và tài liệu tải về ({mediaAssets.length} tệp)
          </p>
        </div>

        <button
          onClick={() => alert('Vui lòng dán liên kết URL ảnh CDN trực tiếp hoặc đăng hình ảnh qua các ô soạn bài viết/banner/thư viện.')}
          className="px-4 py-2.5 bg-[#174A87] hover:bg-[#123C70] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Tải Ảnh Lên Kho Media</span>
        </button>
      </div>

      {/* Grid of Media Assets */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaAssets.map((asset, idx) => (
          <div key={`${asset.id}-${idx}`} className="bg-white rounded-2xl border border-[#DCE7F2] shadow-sm overflow-hidden flex flex-col justify-between p-2">
            <div className="relative h-28 bg-slate-100 rounded-xl overflow-hidden mb-2">
              <img
                src={asset.url}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-bold rounded">
                {asset.source}
              </span>
            </div>

            <p className="text-[11px] font-bold text-slate-800 truncate px-1">{asset.name}</p>

            <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleCopyUrl(asset.url, `${asset.id}-${idx}`)}
                className="w-full py-1.5 bg-[#F7FAFF] hover:bg-[#174A87] hover:text-white text-[#174A87] border border-[#DCE7F2] rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                {copiedId === `${asset.id}-${idx}` ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Sao chép Link URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
