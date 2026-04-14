import React from "react";

function RiskColumn({ title, tone, items = [] }) {
  const toneClasses =
    tone === "red"
      ? "bg-red-50 border-red-100 text-red-700"
      : "bg-amber-50 border-amber-100 text-amber-700";

  return (
    <div className={`rounded-2xl border p-6 ${toneClasses}`}>
      <h3 className="text-lg font-black mb-4">{title}</h3>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border border-white/70">
            <p className="font-black text-slate-900">{item.issue}</p>
            <p className="text-sm text-slate-600 mt-1">발생 확률: {item.probability}</p>
            <p className="text-sm text-slate-600">예상 피해: {item.impact}</p>
            <p className="text-sm text-slate-500 mt-2">원인: {item.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FutureRiskPanel({ data }) {
  const sixMonths = data?.future_risk?.["6_months"] || [];
  const oneYear = data?.future_risk?.["1_year"] || [];

  return (
    <div className="bg-white p-8 rounded-[2.3rem] border border-slate-200 shadow-sm space-y-6">
      <h2 className="text-2xl font-black text-slate-900">미래 리스크 시뮬레이션</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RiskColumn title="6개월 후" tone="amber" items={sixMonths} />
        <RiskColumn title="1년 후" tone="red" items={oneYear} />
      </div>
    </div>
  );
}