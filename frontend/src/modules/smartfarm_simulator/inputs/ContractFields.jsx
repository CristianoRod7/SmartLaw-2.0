import React from "react";

const cardClass =
  "rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/50";
const labelClass =
  "text-sm font-black text-slate-700 tracking-tight";
const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100";

export default function ContractFields({ form, onChange }) {
  return (
    <div className={cardClass}>
      <div className="mb-5">
        <h2 className="text-xl font-black text-slate-900">계약 / 유지보수</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          분쟁 가능성과 장애 발생 시 책임 집중 여부를 점검합니다.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>계약 리스크 수준</label>
          <select
            value={form.contractRiskLevel}
            onChange={(e) => onChange("contractRiskLevel", e.target.value)}
            className={inputClass}
          >
            <option value="none">없음</option>
            <option value="low">낮음</option>
            <option value="medium">중간</option>
            <option value="high">높음</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>유지보수 책임 주체</label>
          <select
            value={form.maintenanceOwner}
            onChange={(e) => onChange("maintenanceOwner", e.target.value)}
            className={inputClass}
          >
            <option value="company">업체</option>
            <option value="shared">공동</option>
            <option value="user">사용자</option>
          </select>
        </div>
      </div>
    </div>
  );
}