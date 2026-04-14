import React from "react";
import { ArrowLeft } from "lucide-react";
import SimulatorSummaryCard from "./views/SimulatorSummaryCard";
import FutureRiskPanel from "./views/FutureRiskPanel";
import ActionGuidePanel from "./views/ActionGuidePanel";
import ScoreBreakdownPanel from "./views/ScoreBreakdownPanel";
import ContractEvidencePanel from "./views/ContractEvidencePanel";
export default function SimulatorResultView({ data, onReset }) {
  if (!data) {
    return (
      <div className="text-center py-40 font-black text-slate-400">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="text-center py-40 bg-white rounded-[3rem] border border-red-200 w-full mt-10">
        <h3 className="text-2xl font-black text-red-500 mb-2">
          시뮬레이션 중 오류가 발생했습니다.
        </h3>
        <p className="text-slate-500 mb-6">{data.error}</p>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 font-sans space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            스마트팜 시뮬레이션 결과
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            운영비, 대출, 보조금, 계약 조건을 기반으로 향후 리스크를 예측했습니다.
          </p>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          시뮬레이터로 돌아가기
        </button>
      </div>

        <SimulatorSummaryCard data={data} />
        <ScoreBreakdownPanel breakdown={data?.breakdown || []} />
        <ContractEvidencePanel evidence={data?.evidence || []} />
        <FutureRiskPanel data={data} />
        <ActionGuidePanel actions={data?.actions || []} />
    </div>
  );
}