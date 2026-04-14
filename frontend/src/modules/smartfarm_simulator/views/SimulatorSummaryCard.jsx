import React from "react";

export default function SimulatorSummaryCard({ data }) {
  const safeScore = Number(data?.score) || 0;

  const getScoreColor = (score) => {
    if (score >= 70) return "text-red-500";
    if (score >= 40) return "text-amber-500";
    return "text-emerald-500";
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return "위험 높음";
    if (score >= 40) return "주의 필요";
    return "안정적";
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-10">
      <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="88"
            cy="88"
            r="76"
            stroke="currentColor"
            strokeWidth="14"
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="88"
            cy="88"
            r="76"
            stroke="currentColor"
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={477}
            strokeDashoffset={477 - (477 * safeScore) / 100}
            className={`${getScoreColor(safeScore)} transition-all duration-1000`}
          />
        </svg>

        <div className="absolute text-center">
          <span className="text-4xl font-black text-slate-900">{safeScore}</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Risk Score
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-black">
          SmartFarm Risk Simulation
        </div>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          종합 위험도: <span className={getScoreColor(safeScore)}>{getScoreLabel(safeScore)}</span>
        </h2>

        <p className="text-slate-600 leading-relaxed break-keep">
          {data?.summary || "시뮬레이션 요약 정보가 없습니다."}
        </p>
      </div>
    </div>
  );
}