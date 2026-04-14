import React from "react";

function getTone(score) {
  if (score >= 20) return "bg-red-50 border-red-100 text-red-700";
  if (score >= 10) return "bg-amber-50 border-amber-100 text-amber-700";
  return "bg-emerald-50 border-emerald-100 text-emerald-700";
}

export default function ScoreBreakdownPanel({ breakdown = [] }) {
  return (
    <div className="bg-white p-8 rounded-[2.3rem] border border-slate-200 shadow-sm space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">점수 분해</h2>
        <p className="mt-2 text-sm font-medium text-slate-500 break-keep">
          어떤 항목이 종합 위험도를 끌어올렸는지 한눈에 보여줍니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {breakdown.map((item) => (
          <div
            key={item.key}
            className={`rounded-2xl border p-5 ${getTone(item.score)}`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-black">{item.label}</h3>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-900">
                +{item.score}
              </span>
            </div>

            <p className="mt-3 text-sm font-medium text-slate-600 break-keep">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}