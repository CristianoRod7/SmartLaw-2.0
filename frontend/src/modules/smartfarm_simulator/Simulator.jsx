import React, { useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { runSmartfarmSimulation } from "./api/simulatorApi";
import { analyzeApi } from "../core_analyze/api/analyzeApi";
import { mapAnalysisToSimulation } from "./engine/mapAnalysisToSimulation";
import SimulatorSteps from "./inputs/SimulatorSteps";
import StepSidebar from "./views/StepSidebar";
import RiskRadarPanel from "./views/RiskRadarPanel";
import InterviewHero from "./views/InterviewHero";
import { motion } from "framer-motion";

const steps = [
  "운영 정보",
  "자금 구조",
  "정책 / 보조금",
  "계약 참고자료",
  "최종 확인",
];

const initialForm = {
  crop: "딸기",
  region: "",
  area: 0,
  facilityType: "비닐하우스",
  operationMode: "직영",
  operationYears: 0,

  initialCost: 0,
  loanAmount: 0,
  interestRate: 0,
  monthlyFixedCost: 0,
  monthlyVariableCost: 0,
  monthlyRevenue: 0,
  laborCost: 0,
  energyCost: 0,

  hasSubsidy: false,
  supportProgram: "",
  mandatoryOperationPeriod: 0,
  reportingDuty: false,
  subsidyMemo: "",

  contractType: "스마트팜 구축 계약",
  counterpartyType: "시공업체",

  contractRiskLevel: "low",
  maintenanceOwner: "shared",
  terminationPenaltyLevel: "none",
  liabilityLevel: "low",
  subsidyClawbackTrigger: false,
  dataOwnership: "shared",
};

export default function Simulator({ onBack, onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [contractFile, setContractFile] = useState(null);
  const [contractAnalysis, setContractAnalysis] = useState(null);
  const [analysisEvidence, setAnalysisEvidence] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzingContract, setAnalyzingContract] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAnalyzeContract = async () => {
    if (!contractFile) {
      alert("계약서 파일을 먼저 업로드하세요.");
      return;
    }

    try {
      setAnalyzingContract(true);

      const response = await analyzeApi.uploadContract(contractFile, form.contractType);
      const analysisData = response?.data?.data || response?.data || {};

      setContractAnalysis(analysisData);

      const mapped = mapAnalysisToSimulation(analysisData);
      setAnalysisEvidence(mapped.evidence || []);

      setForm((prev) => ({
        ...prev,
        ...mapped,
      }));

      alert("계약서 분석 결과를 반영했습니다.");
    } catch (error) {
      console.error("계약서 분석 실패:", error);
      alert(error?.response?.data?.detail || "계약서 분석 중 오류가 발생했습니다.");
    } finally {
      setAnalyzingContract(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const result = await runSmartfarmSimulation({
        ...form,
        contractAnalysis,
        analysisEvidence,
      });

      onComplete(result);
    } catch (error) {
      console.error("시뮬레이션 실패:", error);
      onComplete({ error: "시뮬레이션 중 오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  const stepProgress = Math.round((step / steps.length) * 100);
  const contractReady = !!contractAnalysis;
  const evidenceCount = analysisEvidence?.length || 0;

  const completionHints = useMemo(() => {
    const completed = [];

    const operationDone =
      !!form.region?.trim() &&
      Number(form.area || 0) > 0;

    const financeDone =
      Number(form.initialCost || 0) > 0 &&
      Number(form.monthlyRevenue || 0) > 0;

      const subsidyDone =
    form.hasSubsidy
      ? Number(form.mandatoryOperationPeriod || 0) > 0
      : false;

      if (operationDone) completed.push("운영 정보 입력됨");
      if (financeDone) completed.push("자금 구조 입력됨");
      if (subsidyDone) completed.push("보조금 정보 입력됨");
      if (contractReady) completed.push("계약서 분석 반영됨");

  return completed;
}, [form, contractReady]);

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 px-2 md:px-4">
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900 px-6 py-7 text-white shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="mt-1 h-10 w-10 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
              <div>
                <h3 className="text-xl font-black tracking-tight">분석 중입니다</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-300 break-keep">
                  입력한 운영 정보와 계약서 분석 결과를 종합해 6개월 / 1년 리스크를 계산하고 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-950 to-emerald-950 px-6 py-8 text-white shadow-[0_18px_40px_rgba(15,23,42,0.10)] md:px-8">
        <motion.div
  aria-hidden="true"
  className="pointer-events-none absolute right-[-30px] top-1/2 -translate-y-1/2 opacity-[0.12]"
  animate={{
    y: [0, -10, 0],
    rotate: [0, 2, 0],
    scale: [1, 1.02, 1],
  }}
  transition={{
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  <svg
    width="320"
    height="320"
    viewBox="0 0 320 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-emerald-200"
  >
    <path
      d="M255 42C220 48 164 70 122 112C84 150 70 195 75 231C80 266 100 289 100 289"
      stroke="currentColor"
      strokeWidth="18"
      strokeLinecap="round"
    />
    <path
      d="M263 56C278 111 271 172 238 216C198 269 128 285 81 255C39 228 36 169 69 129C99 92 151 78 198 69C224 64 247 60 263 56Z"
      stroke="currentColor"
      strokeWidth="18"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M104 210C136 199 173 186 203 159"
      stroke="currentColor"
      strokeWidth="18"
      strokeLinecap="round"
    />
  </svg>
</motion.div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-black tracking-wider text-emerald-200">
              <ShieldCheck size={14} />
              SMARTFARM PRE-CHECK
            </div>

            <div>
              <h1 className="whitespace-nowrap text-[2.25rem] font-extrabold tracking-tight md:text-[3rem]">
                스마트팜 리스크 사전진단
              </h1>
              <p className="mt-3 whitespace-nowrap text-[15px] font-medium leading-7 text-slate-300 md:text-[17px]">
                운영 구조, 자금 상태, 보조금 의무, 계약 조항을 함께 반영해 향후 6개월과 1년 리스크를 전망합니다.
              </p>
            </div>

            {completionHints.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {completionHints.map((hint) => (
                  <span
                    key={hint}
                    className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-100 backdrop-blur"
                  >
                    {hint}
                  </span>
                ))}
              </div>
            )}
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="shrink-0 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
            >
              뒤로가기
            </button>
          )}
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between text-xs font-black text-slate-300">
            <span>진행률</span>
            <span>{stepProgress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-500"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)_340px]">
        <StepSidebar
          steps={steps}
          currentStep={step}
          contractReady={contractReady}
          evidenceCount={evidenceCount}
        />

        <main className="space-y-6">
          <InterviewHero step={step} />

          <SimulatorSteps
            step={step}
            form={form}
            onChange={handleChange}
            contractFile={contractFile}
            setContractFile={setContractFile}
            contractAnalysis={contractAnalysis}
            onAnalyzeContract={handleAnalyzeContract}
            analyzingContract={analyzingContract}
            analysisEvidence={analysisEvidence}
          />

          <div className="sticky bottom-4 z-20">
            <div className="rounded-[2rem] border border-slate-200 bg-white/90 px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                  disabled={step === 1 || loading || analyzingContract}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  이전
                </button>

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => Math.min(5, prev + 1))}
                    disabled={loading || analyzingContract}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white"
                  >
                    다음
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || analyzingContract}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-black text-white transition hover:bg-emerald-400 disabled:opacity-50"
                  >
                    {loading ? "계산 중..." : "최종 실행"}
                    {!loading && <ArrowRight size={16} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>

        <RiskRadarPanel
          form={form}
          contractReady={contractReady}
          evidence={analysisEvidence}
        />
      </div>
    </div>
  );
}