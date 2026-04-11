import React from "react";
import { ChevronDown, FileText } from "lucide-react";

export default function CategorySelect({ value, setValue, options = [] }) {
  return (
    <div className="space-y-3">
      <label className="ml-1 flex items-center gap-2 text-sm font-extrabold text-slate-700">
        <FileText size={16} className="text-emerald-600" />
        계약서 종류
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full appearance-none rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 pr-12 text-base font-bold text-slate-800 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={20}
          className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      <p className="ml-1 text-xs font-medium text-slate-500">
        문서 유형에 따라 산업별 리스크 기준이 자동 적용됩니다.
      </p>
    </div>
  );
}