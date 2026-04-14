import React from "react";
import { FileWarning } from "lucide-react";

export default function ContractEvidencePanel({ evidence = [] }) {
  return (
    <div className="bg-white p-8 rounded-[2.3rem] border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <FileWarning size={20} className="text-red-500" />
        <div>
          <h2 className="text-2xl font-black text-slate-900">계약서 근거 조항</h2>
          <p className="mt-1 text-sm font-medium text-slate-500 break-keep">
            업로드한 계약서에서 리스크로 반영된 핵심 근거입니다.
          </p>
        </div>
      </div>

      {evidence.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidence.map((item, idx) => (
            <div
              key={`${item.title}-${idx}`}
              className="rounded-2xl border border-red-100 bg-red-50 p-5"
            >
              <h3 className="text-base font-black text-red-700">{item.title}</h3>
              <p className="mt-2 text-sm font-medium text-slate-600 break-keep">
                {item.reason}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-bold text-slate-500">
            계약서에서 자동 추출된 근거 조항이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}