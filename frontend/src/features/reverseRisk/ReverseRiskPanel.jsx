import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clipboard,
  FileSearch,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { analyzeContractRisk } from "./riskAnalyzer";

const levelConfig = {
  위험: {
    badge: "border-red-200 bg-red-50 text-red-600",
    dot: "bg-red-500",
    border: "border-red-200",
    bar: "bg-red-500",
  },
  주의: {
    badge: "border-amber-200 bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
    border: "border-amber-200",
    bar: "bg-amber-500",
  },
  낮음: {
    badge: "border-slate-200 bg-slate-50 text-slate-600",
    dot: "bg-slate-400",
    border: "border-slate-200",
    bar: "bg-slate-400",
  },
};

const getLevelConfig = (level) => levelConfig[level] || levelConfig["낮음"];

const getSummaryScore = (results) => {
  const detectedResults = results.filter((item) => item.evidenceFound);

  if (!detectedResults.length) return 0;

  const total = detectedResults.reduce((sum, item) => sum + Number(item.score || 0), 0);
  return Math.round(total / detectedResults.length);
};

const getSummaryLevel = (score) => {
  if (score >= 75) return "위험";
  if (score >= 45) return "주의";
  return "낮음";
};

const normalizeApiText = (apiAnalysisResult) => {
  if (!apiAnalysisResult) return "";

  if (typeof apiAnalysisResult === "string") {
    return apiAnalysisResult;
  }

  try {
    return JSON.stringify(apiAnalysisResult);
  } catch {
    return "";
  }
};

const getCrossCheckStatus = (result, apiAnalysisResult) => {
  if (!result.evidenceFound) return null;

  const apiText = normalizeApiText(apiAnalysisResult);

  if (!apiText) return null;

  const titleHit = apiText.includes(result.title);
  const scenarioHit = apiText.includes(result.scenario);
  const evidenceHit = result.evidenceSentences?.some((sentence) =>
    apiText.includes(sentence.slice(0, 15))
  );

  if ((titleHit || scenarioHit || evidenceHit) && result.score >= 45) {
    return {
      label: "AI 분석과 규칙 체크 모두 탐지",
      className: "border-purple-200 bg-purple-50 text-purple-700",
    };
  }

  if (result.score >= 75) {
    return {
      label: "규칙 체크에서 추가 확인 필요",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  return null;
};

const EmptyState = () => {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <FileSearch size={26} />
      </div>
      <h3 className="text-lg font-black text-slate-900">계약서 내용이 필요합니다</h3>
      <p className="mt-2 break-keep text-sm font-medium leading-6 text-slate-500">
        계약서 텍스트가 입력되면 피해 시나리오 기준으로 역방향 리스크를 점검합니다.
      </p>
    </div>
  );
};

const SummaryCard = ({ results }) => {
  const summaryScore = getSummaryScore(results);
  const summaryLevel = getSummaryLevel(summaryScore);
  const summaryConfig = getLevelConfig(summaryLevel);

  const detectedResults = results.filter((item) => item.evidenceFound);
  const dangerCount = detectedResults.filter((item) => item.level === "위험").length;
  const cautionCount = detectedResults.filter((item) => item.level === "주의").length;
  const lowCount = detectedResults.filter((item) => item.level === "낮음").length;
  const notDetectedCount = results.filter((item) => !item.evidenceFound).length;
  const topRisk = detectedResults[0];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-purple-100 bg-white shadow-sm">
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="p-6 md:p-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-purple-600">
            <Sparkles size={13} />
            Reverse Risk Engine
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="break-keep text-2xl font-black text-slate-950 md:text-3xl">
                역방향 리스크 체크
              </h2>
              <p className="mt-2 max-w-2xl break-keep text-sm font-medium leading-6 text-slate-500">
                근거 문장이 탐지된 항목만 위험 점수와 추천 수정 문구를 제공합니다.
              </p>
            </div>

            <div className={`w-fit rounded-2xl border px-4 py-3 ${summaryConfig.badge}`}>
              <div className="text-xs font-black">종합 위험도</div>
              <div className="mt-1 text-2xl font-black">
                {summaryScore}점 · {summaryLevel}
              </div>
            </div>
          </div>

          {topRisk ? (
            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-xs font-black text-slate-400">가장 먼저 확인할 항목</div>
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="break-keep text-base font-black text-slate-900">
                  {topRisk.title}
                </div>
                <div className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${getLevelConfig(topRisk.level).badge}`}>
                  {topRisk.score}점 · {topRisk.level}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="break-keep text-sm font-bold text-slate-600">
                직접 연결되는 근거 문장이 탐지되지 않았습니다.
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 border-t border-slate-100 bg-slate-50 lg:border-l lg:border-t-0">
          <div className="flex flex-col items-center justify-center p-5">
            <div className="text-xs font-black text-slate-400">위험</div>
            <div className="mt-1 text-3xl font-black text-red-500">{dangerCount}</div>
          </div>
          <div className="flex flex-col items-center justify-center border-l border-slate-200 p-5">
            <div className="text-xs font-black text-slate-400">주의</div>
            <div className="mt-1 text-3xl font-black text-amber-500">{cautionCount}</div>
          </div>
          <div className="flex flex-col items-center justify-center border-l border-slate-200 p-5">
            <div className="text-xs font-black text-slate-400">낮음</div>
            <div className="mt-1 text-3xl font-black text-slate-500">{lowCount}</div>
          </div>
          <div className="flex flex-col items-center justify-center border-l border-slate-200 p-5">
            <div className="text-xs font-black text-slate-400">미탐지</div>
            <div className="mt-1 text-3xl font-black text-slate-400">{notDetectedCount}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const RiskListItem = ({ result, selected, onClick }) => {
  const config = getLevelConfig(result.level);
  const evidenceCount = result.evidenceSentences?.length || 0;
  const missingCount = result.missingItems?.length || 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
        selected ? `${config.border} shadow-md` : "border-slate-200 shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${config.dot}`} />
            <h3 className="truncate text-sm font-black text-slate-900">{result.title}</h3>
          </div>

          <p className="mt-2 line-clamp-2 break-keep text-xs font-medium leading-5 text-slate-500">
            {result.scenario}
          </p>
        </div>

        <div className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-black ${config.badge}`}>
          {result.evidenceFound ? `${result.score}점` : "미탐지"}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-slate-50 px-2 py-2">
          <div className="text-[10px] font-black text-slate-400">등급</div>
          <div className="mt-0.5 text-xs font-black text-slate-700">
            {result.evidenceFound ? result.level : "미탐지"}
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 px-2 py-2">
          <div className="text-[10px] font-black text-slate-400">근거</div>
          <div className="mt-0.5 text-xs font-black text-slate-700">{evidenceCount}개</div>
        </div>
        <div className="rounded-xl bg-slate-50 px-2 py-2">
          <div className="text-[10px] font-black text-slate-400">누락</div>
          <div className="mt-0.5 text-xs font-black text-slate-700">{missingCount}개</div>
        </div>
      </div>
    </button>
  );
};

const DetailSection = ({ title, children, icon }) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
};

const SelectedRiskDetail = ({ result, apiAnalysisResult }) => {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <div className="flex h-full min-h-[420px] items-center justify-center rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div>
          <ShieldAlert className="mx-auto text-slate-300" size={54} />
          <h3 className="mt-4 text-lg font-black text-slate-900">리스크를 선택하세요</h3>
          <p className="mt-2 break-keep text-sm font-medium leading-6 text-slate-500">
            왼쪽 목록에서 항목을 선택하면 상세 분석이 표시됩니다.
          </p>
        </div>
      </div>
    );
  }

  const config = getLevelConfig(result.level);
  const crossCheck = getCrossCheckStatus(result, apiAnalysisResult);

  const handleCopySuggestion = async () => {
    try {
      await navigator.clipboard.writeText(result.suggestion || "");
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1400);
    } catch {
      alert("복사에 실패했습니다. 직접 선택해서 복사해주세요.");
    }
  };

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 shrink-0 rounded-full ${config.dot}`} />
            <h3 className="break-keep text-xl font-black text-slate-950">
              {result.title}
            </h3>
          </div>

          <p className="mt-2 break-keep text-sm font-medium leading-6 text-slate-500">
            {result.description || result.scenario}
          </p>
        </div>

        <div className={`w-fit shrink-0 rounded-2xl border px-4 py-3 text-right ${config.badge}`}>
          <div className="text-xs font-black">위험도</div>
          <div className="mt-1 text-2xl font-black">
            {result.evidenceFound ? `${result.score}점` : "미탐지"}
          </div>
          <div className="text-xs font-black">
            {result.evidenceFound ? result.level : "근거 없음"}
          </div>
        </div>
      </div>

      {result.evidenceFound && (
        <div className="mb-5">
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${config.bar}`}
              style={{ width: `${Math.min(Number(result.score || 0), 100)}%` }}
            />
          </div>
        </div>
      )}

      {crossCheck && (
        <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-black ${crossCheck.className}`}>
          {crossCheck.label}
        </div>
      )}

      {!result.evidenceFound && (
        <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="break-keep text-sm font-bold leading-6 text-slate-600">
            이 항목과 직접 연결되는 근거 문장을 찾지 못했습니다. 따라서 위험 점수, 누락 조항, 추천 수정 문구를 제공하지 않습니다.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <DetailSection
          title="탐지된 근거 문장"
          icon={<FileSearch size={17} className="text-purple-600" />}
        >
          {result.evidenceSentences?.length > 0 ? (
            <ul className="space-y-2">
              {result.evidenceSentences.slice(0, 5).map((sentence, index) => (
                <li
                  key={`${result.id}-evidence-${index}`}
                  className="rounded-xl bg-white px-4 py-3 break-keep text-sm font-medium leading-6 text-slate-600"
                >
                  “{sentence}”
                </li>
              ))}
            </ul>
          ) : (
            <p className="break-keep rounded-xl bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-500">
              직접 연결되는 근거 문장이 탐지되지 않았습니다.
            </p>
          )}
        </DetailSection>

        {result.evidenceFound && (
          <DetailSection
            title="누락된 보호 장치"
            icon={<AlertCircle size={17} className="text-amber-600" />}
          >
            {result.missingItems?.length > 0 ? (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {result.missingItems.map((item) => (
                  <li
                    key={item.label}
                    className="rounded-xl border border-amber-100 bg-white px-4 py-3 break-keep text-sm font-bold leading-6 text-amber-700"
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-500">
                주요 보호 장치가 일부 포함되어 있습니다.
              </p>
            )}
          </DetailSection>
        )}

        {result.evidenceFound && result.suggestion && (
          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm font-black text-purple-800">
                <CheckCircle2 size={17} />
                추천 수정 문구
              </div>

              <button
                type="button"
                onClick={handleCopySuggestion}
                className="flex w-fit items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-purple-700 shadow-sm transition hover:bg-purple-100"
              >
                <Clipboard size={14} />
                {copied ? "복사됨" : "수정문구 복사"}
              </button>
            </div>

            <p className="break-keep rounded-xl bg-white px-4 py-3 text-sm font-bold leading-7 text-purple-800">
              {result.suggestion}
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

const MobileRiskCard = ({ result, apiAnalysisResult }) => {
  const [open, setOpen] = useState(false);
  const config = getLevelConfig(result.level);

  return (
    <div className={`rounded-2xl border bg-white shadow-sm ${open ? config.border : "border-slate-200"}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-start justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${config.dot}`} />
            <h3 className="break-keep text-sm font-black text-slate-900">
              {result.title}
            </h3>
          </div>
          <p className="mt-1 break-keep text-xs font-medium leading-5 text-slate-500">
            {result.scenario}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${config.badge}`}>
            {result.evidenceFound ? `${result.score}점` : "미탐지"}
          </span>
          {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 p-4">
          <SelectedRiskDetail result={result} apiAnalysisResult={apiAnalysisResult} />
        </div>
      )}
    </div>
  );
};

const ReverseRiskPanel = ({ contractText = "", apiAnalysisResult = null }) => {
  const results = useMemo(() => {
    if (!contractText || !contractText.trim()) {
      return [];
    }

    return analyzeContractRisk(contractText, [], apiAnalysisResult).sort((a, b) => {
      if (a.evidenceFound !== b.evidenceFound) {
        return a.evidenceFound ? -1 : 1;
      }

      return Number(b.score || 0) - Number(a.score || 0);
    });
  }, [contractText, apiAnalysisResult]);

  const [selectedId, setSelectedId] = useState(null);

  const selectedResult = useMemo(() => {
    if (!results.length) return null;

    if (selectedId) {
      return results.find((item) => item.id === selectedId) || results[0];
    }

    return results[0];
  }, [results, selectedId]);

  if (!contractText || !contractText.trim()) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <SummaryCard results={results} />

      <section className="hidden grid-cols-[360px_1fr] gap-6 xl:grid">
        <div className="space-y-3">
          {results.map((result) => (
            <RiskListItem
              key={result.id}
              result={result}
              selected={selectedResult?.id === result.id}
              onClick={() => setSelectedId(result.id)}
            />
          ))}
        </div>

        <SelectedRiskDetail result={selectedResult} apiAnalysisResult={apiAnalysisResult} />
      </section>

      <section className="space-y-3 xl:hidden">
        {results.map((result) => (
          <MobileRiskCard
            key={result.id}
            result={result}
            apiAnalysisResult={apiAnalysisResult}
          />
        ))}
      </section>
    </div>
  );
};

export default ReverseRiskPanel;