import React from "react";
import { UploadCloud, CheckCircle2, FileBadge2 } from "lucide-react";

export default function UploadBox({ file, setFile }) {
  const handleClick = () => {
    document.getElementById("contract-upload")?.click();
  };

  return (
    <div className="space-y-3">
      <label className="ml-1 flex items-center gap-2 text-sm font-extrabold text-slate-700">
        <FileBadge2 size={16} className="text-emerald-600" />
        문서 업로드
      </label>

      <div
        onClick={handleClick}
        className={`group flex h-60 cursor-pointer flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed px-6 text-center transition-all ${
          file
            ? "border-emerald-400 bg-emerald-50"
            : "border-slate-300 bg-slate-50 hover:border-emerald-300 hover:bg-slate-100"
        }`}
      >
        <input
          id="contract-upload"
          type="file"
          className="hidden"
          accept=".pdf,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <div
          className={`rounded-2xl p-4 shadow-sm transition ${
            file
              ? "bg-white text-emerald-600"
              : "bg-white text-slate-400 group-hover:text-emerald-600"
          }`}
        >
          {file ? <CheckCircle2 size={36} /> : <UploadCloud size={36} />}
        </div>

        <div className="space-y-1">
          <p className="text-base font-black text-slate-800">
            {file ? file.name : "클릭해서 계약서를 업로드하세요"}
          </p>
          <p className="text-sm font-medium text-slate-500">
            PDF 또는 TXT 파일 업로드 가능
          </p>
        </div>
      </div>
    </div>
  );
}