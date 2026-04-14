import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

export default function StepSidebar({
  steps = [],
  currentStep = 1,
  contractReady = false,
  evidenceCount = 0,
}) {
  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="mb-5">
        <p className="text-xs font-black tracking-[0.2em] text-slate-400">FLOW</p>
        <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900">
          진단 단계
        </h3>
      </div>

      <div className="space-y-3">
        {steps.map((label, idx) => {
          const step = idx + 1;
          const active = currentStep === step;
          const done = currentStep > step;

          return (
            <div
              key={label}
              className={`rounded-2xl border px-4 py-4 transition ${
                active
                  ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                  : done
                  ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black tracking-wide opacity-70">
                    STEP {step}
                  </p>
                  <p className="mt-1 text-sm font-black break-keep">{label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black tracking-wide text-slate-400">STATUS</p>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-slate-600">계약서 반영</span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-black ${
                contractReady
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {contractReady ? "완료" : "대기"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-slate-600">감지된 근거</span>
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-black text-red-600">
              {evidenceCount}건
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}