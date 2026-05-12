import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

const scoreFactors = [
  '위험 조항의 심각도',
  '계약서에서 탐지된 근거 문장 수',
  '누락된 보호 장치 개수',
  '관련 법령 및 규정과의 충돌 가능성',
  '역방향 리스크 매칭 결과',
  '수정 필요성이 높은 조항 여부',
];

const RiskScoreExplanation = ({ buttonClassName = '', panelLabel = '위험도 산정 기준 보기' }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        aria-label={panelLabel}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200/70 bg-white text-emerald-600 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 ${buttonClassName}`}
      >
        <Info size={15} />
      </button>

      {open && (
        <div className="fixed inset-x-4 top-24 z-50 mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-4 text-left text-slate-700 shadow-2xl shadow-slate-900/18">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="break-keep text-sm font-black text-slate-950">위험도 산정 기준</h4>
              <p className="mt-2 break-keep text-xs font-bold leading-5 text-slate-500">
                위험도는 다음 항목을 종합해 계산됩니다.
              </p>
            </div>
            <button
              type="button"
              aria-label="위험도 산정 기준 닫기"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={15} />
            </button>
          </div>

          <ul className="mt-3 space-y-2">
            {scoreFactors.map((factor) => (
              <li key={factor} className="flex gap-2 break-keep text-xs font-semibold leading-5 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {factor}
              </li>
            ))}
          </ul>

          <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 break-keep text-[11px] font-bold leading-5 text-emerald-800">
            이 점수는 법률 자문이 아니라 계약 검토 우선순위를 정하기 위한 참고 지표입니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default RiskScoreExplanation;
