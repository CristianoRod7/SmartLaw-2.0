import React, { useMemo } from "react";
import { AlertTriangle, FileText, Radar, Wallet } from "lucide-react";

function Pill({ children, tone = "default" }) {
  const toneClass =
    tone === "red"
      ? "bg-red-50 text-red-700 border-red-100"
      : tone === "blue"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${toneClass}`}>
      {children}
    </span>
  );
}

function InfoCard({ title, value, icon, tone = "default" }) {
  const toneMap = {
    default: "border-slate-200 bg-white text-slate-700",
    blue: "border-emerald-100 bg-emerald-50 text-emerald-700",
    red: "border-red-100 bg-red-50 text-red-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
  };

  return (
    <div className={`rounded-2xl border px-4 py-4 ${toneMap[tone]}`}>
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-xs font-black tracking-wide opacity-70">{title}</p>
      </div>
      <p className="mt-3 text-sm font-black break-keep">{value}</p>
    </div>
  );
}

export default function RiskRadarPanel({ form, contractReady = false, evidence = [] }) {
  const debtRatio = useMemo(() => {
    if (!form?.initialCost) return 0;
    return Math.round((Number(form.loanAmount || 0) / Number(form.initialCost || 1)) * 100);
  }, [form?.loanAmount, form?.initialCost]);

  const monthlyCost = useMemo(() => {
    return (
      Number(form?.monthlyFixedCost || 0) +
      Number(form?.monthlyVariableCost || 0) +
      Number(form?.laborCost || 0) +
      Number(form?.energyCost || 0)
    );
  }, [form]);

  const monthlyGap = Number(form?.monthlyRevenue || 0) - monthlyCost;

  const signals = useMemo(() => {
    const result = [];

    if (debtRatio >= 60) result.push({ text: "대출 비중 높음", tone: "red" });
    else if (debtRatio >= 35) result.push({ text: "대출 비중 주의", tone: "amber" });

    if (monthlyGap < 0) result.push({ text: "월 손익 적자 가능", tone: "red" });
    else if (monthlyGap < monthlyCost * 0.1) result.push({ text: "수익성 민감 구간", tone: "amber" });

    if (form?.hasSubsidy) result.push({ text: "보조금 의무 존재", tone: "blue" });
    if (!contractReady) result.push({ text: "계약서 미반영", tone: "default" });
    if (evidence?.length > 0) result.push({ text: `근거 ${evidence.length}건 감지`, tone: "red" });

    return result;
  }, [debtRatio, monthlyGap, monthlyCost, form?.hasSubsidy, contractReady, evidence]);

  const sensitivityLabel =
    signals.some((s) => s.tone === "red")
      ? "높음"
      : signals.some((s) => s.tone === "amber")
      ? "주의"
      : "보통";

  const sensitivityTone =
    sensitivityLabel === "높음"
      ? "red"
      : sensitivityLabel === "주의"
      ? "amber"
      : "blue";

  return (
    <aside className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-400 uppercase">LIVE RADAR</p>
        <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900">
          현재 진단 상태
        </h3>
      </div>

      <InfoCard
        title="현재 민감도"
        value={sensitivityLabel}
        icon={<Radar size={16} />}
        tone={sensitivityTone}
      />

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black tracking-wide text-slate-400">감지된 신호</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {signals.length > 0 ? (
            signals.map((signal, idx) => (
              <Pill key={`${signal.text}-${idx}`} tone={signal.tone}>
                {signal.text}
              </Pill>
            ))
          ) : (
            <Pill>아직 없음</Pill>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <InfoCard
          title="운영 요약"
          value={`${form?.crop || "미입력"} · ${form?.facilityType || "미입력"} · ${form?.operationMode || "미입력"}`}
          icon={<FileText size={16} />}
          tone="default"
        />

        <InfoCard
          title="자금 요약"
          value={`대출 비중 ${debtRatio}% / 월 손익 ${monthlyGap.toLocaleString()}원`}
          icon={<Wallet size={16} />}
          tone={monthlyGap < 0 ? "red" : debtRatio >= 60 ? "amber" : "blue"}
        />

        <InfoCard
          title="계약 상태"
          value={contractReady ? "계약서 분석 반영 완료" : "계약서 없이 기본 진단 중"}
          icon={<AlertTriangle size={16} />}
          tone={contractReady ? "blue" : "default"}
        />
      </div>
    </aside>
  );
}