import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  Brain,
  ChevronDown,
  Clipboard,
  FileWarning,
  Search,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  X,
} from "lucide-react";
import { analyzeContractRisk } from "../../../features/reverseRisk/riskAnalyzer";
import RiskScoreExplanation from "../../../components/analysis/RiskScoreExplanation";

const normalizeText = (value) => String(value || "").replace(/\s+/g, " ").trim();

const safeToText = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const compact = (items = []) => items.filter((item) => item !== undefined && item !== null && String(item).trim() !== "");

const copyToClipboard = async (text, onSuccess) => {
  try {
    await navigator.clipboard.writeText(text || "");
    onSuccess?.();
  } catch {
    alert("복사에 실패했습니다. 직접 선택해서 복사해주세요.");
  }
};

const getLevelText = (level) => {
  const value = String(level || "").toLowerCase();
  if (value.includes("danger") || value.includes("high") || value.includes("위험") || value.includes("높")) return "위험";
  if (value.includes("warning") || value.includes("medium") || value.includes("주의") || value.includes("중")) return "주의";
  return "검토";
};

const getRiskSummaryLevel = (score) => {
  if (score >= 75) return "위험";
  if (score >= 45) return "주의";
  return "낮음";
};

const getLevelStyle = (level) => {
  const value = getLevelText(level);
  if (value === "위험") {
    return {
      badge: "border-red-200 bg-red-50 text-red-600",
      dot: "bg-red-500",
      accent: "bg-red-500",
      text: "text-red-600",
      soft: "border-red-100 bg-red-50 text-red-700",
      selected: "border-emerald-300 bg-emerald-50/70 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.45)]",
    };
  }
  if (value === "주의") {
    return {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
      accent: "bg-amber-500",
      text: "text-amber-700",
      soft: "border-amber-100 bg-amber-50 text-amber-800",
      selected: "border-emerald-300 bg-emerald-50/70 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.45)]",
    };
  }
  return {
    badge: "border-slate-200 bg-slate-50 text-slate-600",
    dot: "bg-slate-400",
    accent: "bg-emerald-500",
    text: "text-slate-600",
    soft: "border-slate-100 bg-slate-50 text-slate-700",
    selected: "border-emerald-300 bg-emerald-50/70 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.45)]",
  };
};

const normalizeClauseObject = (item, index, category = "") => {
  const pageNumber = item.pageNumber || item.pageNo || item.page_number || item.page || "";
  const lineNumber = item.lineNumber || item.line_no || item.line_number || item.line || item.article || item.articleNo || item.clauseNo || "";
  const originalText = item.originalText || item.original_text || item.clauseText || item.sentence || item.text || item.content || "";
  const title = item.title || item.riskTitle || item.clauseTitle || item.name || item.clauseType || item.clause || `독소조항 ${index + 1}`;
  const description = item.summary || item.description || item.desc || originalText || item.clause || "";
  const reason = item.reason || item.issue || item.risk || item.problem || item.why || item.desc || "";
  const suggestion = item.recommendation || item.suggestion || item.tip || item.solution || item.fix || item.alternative || item.guide || item.revision || "";
  const legalBasis = item.law || item.legalBasis || item.legal_basis || item.basis || item.reference || item.relatedLaw || "";
  const severity = item.riskLevel || item.status || item.severity || item.level || item.grade || "주의";
  const keywords = Array.isArray(item.highlight_keywords)
    ? item.highlight_keywords
    : Array.isArray(item.keywords)
      ? item.keywords
      : [];

  return {
    id: item.id || `toxic-${index}`,
    title,
    description,
    originalText,
    reason,
    suggestion,
    legalBasis,
    severity,
    category: item.category || item.type || item.section || category || "",
    page: pageNumber,
    line: lineNumber,
    clauseType: item.clauseType || item.clause || category || "위험 조항",
    keywords,
    raw: item,
  };
};

const splitApiTextToClauses = (text) => {
  const lines = String(text || "").split(/\n/).map((line) => line.trim()).filter(Boolean);
  return lines
    .filter((line) => /독소|위험|주의|불리|조항|검수|지급|수정|저작권|유지보수|지체상금|비밀유지/.test(line))
    .map((line, index) => normalizeClauseObject({ title: line, description: line, severity: line.includes("위험") ? "위험" : "주의" }, index));
};

const extractToxicClauses = (apiAnalysisResult) => {
  if (!apiAnalysisResult) return [];

  if (Array.isArray(apiAnalysisResult?.sections)) {
    return apiAnalysisResult.sections.flatMap((section, sectionIndex) => {
      const category = section.category || section.title || `섹션 ${sectionIndex + 1}`;
      const items = Array.isArray(section.items) ? section.items : [];
      return items.map((item, itemIndex) => normalizeClauseObject(item, `${sectionIndex}-${itemIndex}`, category));
    });
  }

  if (typeof apiAnalysisResult === "object" && !Array.isArray(apiAnalysisResult)) {
    const possibleArrays = [
      apiAnalysisResult.toxicClauses,
      apiAnalysisResult.poisonClauses,
      apiAnalysisResult.riskyClauses,
      apiAnalysisResult.dangerClauses,
      apiAnalysisResult.clauses,
      apiAnalysisResult.risks,
      apiAnalysisResult.issues,
      apiAnalysisResult.problems,
      apiAnalysisResult.detectedClauses,
      apiAnalysisResult.items,
    ];

    for (const array of possibleArrays) {
      if (Array.isArray(array) && array.length > 0) {
        return array.map((item, index) => normalizeClauseObject(item, index));
      }
    }
  }

  if (Array.isArray(apiAnalysisResult)) return apiAnalysisResult.map((item, index) => normalizeClauseObject(item, index));
  if (typeof apiAnalysisResult === "string") return splitApiTextToClauses(apiAnalysisResult);
  return [];
};

const getClauseText = (clause) => normalizeText([
  clause.title,
  clause.description,
  clause.originalText,
  clause.reason,
  clause.suggestion,
  clause.legalBasis,
  clause.category,
  clause.page,
  clause.line,
  ...(clause.keywords || []),
].join(" "));

const matchRisksToToxicClause = (clause, reverseRiskResults) => {
  const text = getClauseText(clause);
  return reverseRiskResults
    .map((risk) => {
      const riskText = normalizeText([risk.title, risk.scenario, ...(risk.matchedKeywords || [])].join(" "));
      const evidenceHit = risk.evidenceItems?.some((evidence) => {
        const evidenceText = normalizeText(evidence.text);
        return evidenceText.length > 8 && (text.includes(evidenceText.slice(0, 12)) || evidenceText.includes(clause.title));
      }) || false;
      const keywordHits = (risk.matchedKeywords || []).filter((keyword) => text.includes(keyword));
      const titleHit = text.includes(risk.title) || text.includes(risk.scenario) || riskText.includes(clause.title);
      if (!evidenceHit && !keywordHits.length && !titleHit) return null;
      return {
        ...risk,
        matchScore: keywordHits.length * 10 + (evidenceHit ? 20 : 0) + (titleHit ? 15 : 0) + Number(risk.score || 0),
        matchedKeywords: keywordHits,
      };
    })
    .filter(Boolean)
    .sort((a, b) => Number(b.matchScore || 0) - Number(a.matchScore || 0));
};

const summarizeRiskResults = (reverseRiskResults) => {
  const validRisks = reverseRiskResults.filter((item) => item.evidenceFound);
  if (!validRisks.length) return { summaryScore: 0, summaryLevel: "낮음", dangerCount: 0, cautionCount: 0, topRisk: null };
  const total = validRisks.reduce((sum, item) => sum + Number(item.score || 0), 0);
  const summaryScore = Math.round(total / validRisks.length);
  return {
    summaryScore,
    summaryLevel: getRiskSummaryLevel(summaryScore),
    dangerCount: validRisks.filter((item) => item.level === "위험").length,
    cautionCount: validRisks.filter((item) => item.level === "주의").length,
    topRisk: validRisks[0] || null,
  };
};

const buildFallbackSuggestion = (clause) => {
  const legalBasis = clause.legalBasis ? ` 관련 근거는 ${clause.legalBasis}입니다.` : "";
  return `${clause.title || "해당 조항"}은 분쟁 가능성이 있으므로, 적용 조건, 책임 범위, 예외 사유, 사전 통지 절차를 계약서에 명확히 기재하는 방향으로 수정하는 것이 좋습니다.${legalBasis}`;
};

const StatusBadge = ({ level }) => {
  const style = getLevelStyle(level);
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-black shadow-sm shadow-slate-200/40 ${style.badge}`}><span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />{getLevelText(level)}</span>;
};

const Chip = ({ children }) => {
  if (!children) return null;
  return <span className="rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[11px] font-bold text-slate-500 shadow-sm shadow-slate-200/30">{children}</span>;
};

const MetricBlock = ({ label, value, caption, helper }) => (
  <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.075] px-3.5 py-3 text-white shadow-sm shadow-black/10 backdrop-blur">
    <div className="flex items-center justify-between gap-2">
      <p className="break-keep text-[10px] font-black uppercase tracking-[0.12em] text-emerald-100/70">{label}</p>
      {helper}
    </div>
    <div className="mt-1.5 flex items-end gap-1.5">
      <p className="text-2xl font-black leading-none tracking-tight text-white">{value}</p>
      {caption && <p className="min-w-0 truncate pb-0.5 text-[11px] font-bold text-slate-300/80">{caption}</p>}
    </div>
  </div>
);

const HeroHeader = ({ reverseRiskResults, integratedItems }) => {
  const summary = summarizeRiskResults(reverseRiskResults);
  const matchedClauseCount = integratedItems.filter((item) => item.matchedRisks.length > 0).length;

  return (
    <section className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-5 py-5 text-white shadow-[0_18px_52px_-34px_rgba(15,23,42,0.82)] md:px-6 md:py-5">
      <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-[55%_45%_42%_58%_/_58%_37%_63%_42%] bg-emerald-400/14 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-40 w-40 rounded-[42%_58%_65%_35%_/_45%_54%_46%_55%] bg-cyan-300/10 blur-3xl" />
      <div className="relative grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-center">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200/90">Contract Risk Report</p>
          <h3 className="mt-2 max-w-4xl break-keep text-2xl font-black leading-tight tracking-tight md:text-3xl">계약서 위험 조항 리포트</h3>
          <p className="mt-2 max-w-3xl break-keep text-sm font-semibold leading-6 text-slate-300">
            AI 독소조항 분석과 역방향 리스크 체크를 한 화면에서 비교해, 우선 검토할 조항과 수정 방향을 빠르게 파악합니다.
          </p>
          {summary.topRisk && (
            <p className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-black text-emerald-100">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
              <span className="truncate">우선 검토: {summary.topRisk.title}</span>
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-[22px] border border-white/10 bg-white/[0.055] p-2.5 backdrop-blur sm:grid-cols-4">
          <MetricBlock label="종합 점수" value={summary.summaryScore} caption={summary.summaryLevel} helper={<RiskScoreExplanation buttonClassName="h-6 w-6 border-white/15 bg-white/10 text-emerald-100 hover:bg-white/20" />} />
          <MetricBlock label="위험" value={summary.dangerCount} />
          <MetricBlock label="주의" value={summary.cautionCount} />
          <MetricBlock label="연결 조항" value={matchedClauseCount} caption={`${integratedItems.length}개 중`} />
        </div>
      </div>
    </section>
  );
};

const ControlBar = ({ query, setQuery, filter, setFilter }) => {
  const filters = [
    { id: "all", label: "전체" },
    { id: "danger", label: "위험" },
    { id: "warning", label: "주의" },
    { id: "linked", label: "연결 있음" },
  ];

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white/95 p-3 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.45)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-4 py-2.5 transition focus-within:border-emerald-300 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]">
          <Search size={16} className="text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="독소조항, 법령, 키워드 검색" className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400" />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={`rounded-full px-3.5 py-2 text-xs font-black transition duration-200 ${filter === item.id ? "bg-emerald-600 text-white shadow-[0_10px_26px_-18px_rgba(16,185,129,0.8)]" : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"}`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ClauseCard = ({ item, selected, onClick }) => {
  const clause = item.clause;
  const style = getLevelStyle(clause.severity);
  const matchedCount = item.matchedRisks.length;

  return (
    <button type="button" onClick={onClick} className={`group w-full rounded-[20px] border bg-white px-3.5 py-3 text-left shadow-sm shadow-slate-200/40 transition duration-200 hover:-translate-y-[1px] hover:border-emerald-200 hover:shadow-[0_14px_34px_-28px_rgba(15,23,42,0.58)] ${selected ? style.selected : "border-slate-200"}`}>
      <div className="flex gap-3">
        <span className={`mt-1 h-10 w-1.5 shrink-0 rounded-full ${style.accent}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-600/70">검토 조항</p>
              <h4 className="mt-0.5 line-clamp-1 break-keep text-sm font-black text-slate-950 md:text-[15px]">{clause.title}</h4>
            </div>
            <StatusBadge level={clause.severity} />
          </div>
          <p className="mt-1.5 line-clamp-2 break-keep text-xs font-semibold leading-5 text-slate-500">{clause.originalText || clause.description || clause.reason || "상세 내용을 확인하세요."}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-bold text-slate-500">
            <Chip>{clause.category || "분류 없음"}</Chip>
            {clause.page && <Chip>{clause.page}페이지</Chip>}
            {clause.line && <Chip>{clause.line}번째 줄</Chip>}
            <Chip>연결 {matchedCount}개</Chip>
          </div>
        </div>
      </div>
    </button>
  );
};

const Section = ({ number, title, icon, children }) => (
  <section className="border-t border-slate-200/80 py-4 first:border-t-0 first:pt-0 last:pb-0">
    <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-[10px] text-white shadow-sm">{number}</span>
      {icon}
      <span className="break-keep">{title}</span>
    </div>
    {children}
  </section>
);

const CopyButton = ({ onClick, copied }) => (
  <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-emerald-700 shadow-sm transition hover:bg-emerald-50 active:scale-95">
    <Clipboard size={13} />
    {copied ? "복사됨" : "복사"}
  </button>
);

const RiskScenarioCard = ({ risk }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(risk.suggestion, () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1300);
    });
  };

  return (
    <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-slate-50/70">
      <button type="button" onClick={() => setOpen((prev) => !prev)} className="flex w-full items-start justify-between gap-4 px-3.5 py-3 text-left transition hover:bg-emerald-50/70">
        <div className="min-w-0">
          <h5 className="break-keep text-sm font-black text-slate-900">{risk.title}</h5>
          <p className="mt-1 line-clamp-1 break-keep text-xs font-semibold leading-5 text-slate-500">{risk.scenario}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs font-black text-slate-500">
          {risk.score}점
          <ChevronDown size={15} className={`transition ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="space-y-3 border-t border-slate-200 bg-white px-3.5 py-3 text-xs font-semibold leading-6 text-slate-600">
          {risk.evidenceItems?.length > 0 && (
            <div>
              <p className="mb-1 font-black text-slate-900">연결 근거 문장</p>
              <ul className="space-y-1.5">
                {risk.evidenceItems.slice(0, 4).map((evidence, index) => <li key={`${risk.id}-evidence-${index}`} className="break-keep border-l-2 border-emerald-200 pl-2">{evidence.source || "근거"}: “{evidence.text}”</li>)}
              </ul>
            </div>
          )}
          {risk.missingItems?.length > 0 && (
            <div>
              <p className="mb-1 font-black text-slate-900">누락된 보호 장치</p>
              <ul className="space-y-1">{risk.missingItems.map((item) => <li key={item.label} className="break-keep">• {item.label}</li>)}</ul>
            </div>
          )}
          {risk.suggestion && (
            <div className="rounded-[18px] border border-emerald-100 bg-emerald-50/70 p-3 text-emerald-900">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-black">리스크 기준 수정 문구</p>
                <CopyButton onClick={handleCopy} copied={copied} />
              </div>
              <p className="break-keep">{risk.suggestion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DetailPanel = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!item) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm shadow-slate-200/40">
        <FileWarning className="mx-auto mb-3 text-slate-300" size={36} />
        <h3 className="text-lg font-black text-slate-900">카드를 선택하세요</h3>
        <p className="mt-2 text-sm font-semibold text-slate-500">독소조항 카드를 클릭하면 자세한 분석이 표시됩니다.</p>
      </div>
    );
  }

  const clause = item.clause;
  const matchedRisks = item.matchedRisks;
  const mainSuggestion = clause.suggestion || buildFallbackSuggestion(clause);

  const copyMainSuggestion = () => {
    copyToClipboard(mainSuggestion, () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1300);
    });
  };

  return (
    <article className="sticky top-28 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_52px_-36px_rgba(15,23,42,0.68)]">
      <header className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-2">
              <StatusBadge level={clause.severity} />
              {clause.category && <Chip>{clause.category}</Chip>}
              {matchedRisks.length > 0 && <Chip>연결 리스크 {matchedRisks.length}개</Chip>}
            </div>
            <h3 className="break-keep text-xl font-black leading-snug text-slate-950">{clause.title}</h3>
            <p className="mt-2 break-keep text-sm font-semibold leading-7 text-slate-600">{clause.originalText || clause.description || "AI가 탐지한 독소조항입니다."}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"><X size={18} /></button>
        </div>
      </header>

      <div className="px-5 py-1">
        <Section number="01" title="왜 위험한가" icon={<AlertCircle size={16} className="text-red-500" />}>
          <p className="break-keep text-sm font-semibold leading-7 text-slate-600">{clause.reason || clause.description || "해당 조항은 계약 당사자에게 불리하게 작용할 가능성이 있습니다."}</p>
          {(clause.page || clause.line || clause.legalBasis) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {(clause.page || clause.line) && <Chip>위치: {compact([clause.page && `${clause.page}페이지`, clause.line && `${clause.line}번째 줄`]).join(" · ")}</Chip>}
              {clause.legalBasis && <Chip>근거 법령: {clause.legalBasis}</Chip>}
            </div>
          )}
        </Section>

        <Section number="02" title="연결된 피해 시나리오" icon={<ShieldAlert size={16} className="text-amber-500" />}>
          {matchedRisks.length > 0 ? <div className="space-y-3">{matchedRisks.map((risk) => <RiskScenarioCard key={risk.id} risk={risk} />)}</div> : <p className="break-keep text-sm font-semibold leading-7 text-slate-500">이 독소조항과 직접 연결되는 역방향 리스크를 찾지 못했습니다.</p>}
        </Section>

        <Section number="03" title="추천 수정 가이드" icon={<Wrench size={16} className="text-emerald-500" />}>
          <div className="rounded-[20px] border border-emerald-100 bg-emerald-50/70 p-4 text-sm font-bold leading-7 text-emerald-900">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-black">수정 문구</p>
              <CopyButton onClick={copyMainSuggestion} copied={copied} />
            </div>
            <p className="break-keep">{mainSuggestion}</p>
          </div>
        </Section>
      </div>
    </article>
  );
};

const RiskBoard = ({ integratedItems }) => {
  const [selectedId, setSelectedId] = useState(integratedItems[0]?.id || "");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredItems = useMemo(() => {
    const keyword = normalizeText(query);
    return integratedItems.filter((item) => {
      const clause = item.clause;
      const text = getClauseText(clause);
      const level = getLevelText(clause.severity);
      const queryMatched = keyword ? text.includes(keyword) : true;
      const filterMatched = filter === "all" || (filter === "danger" && level === "위험") || (filter === "warning" && level === "주의") || (filter === "linked" && item.matchedRisks.length > 0);
      return queryMatched && filterMatched;
    });
  }, [integratedItems, query, filter]);

  const selectedItem = useMemo(() => integratedItems.find((item) => item.id === selectedId) || filteredItems[0] || integratedItems[0] || null, [integratedItems, filteredItems, selectedId]);

  if (!integratedItems.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm shadow-slate-200/40">
        <h3 className="text-lg font-black text-slate-900">결합할 독소조항 결과가 없습니다</h3>
        <p className="mt-2 text-sm font-semibold text-slate-500">AI 분석 결과 또는 독소조항 목록이 들어오면 리포트 보드가 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(340px,0.82fr)_minmax(520px,1.18fr)]">
      <aside className="min-w-0 space-y-3 rounded-[26px] border border-slate-200 bg-white/70 p-3 shadow-[0_14px_40px_-32px_rgba(15,23,42,0.55)]">
        <ControlBar query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} />
        <div className="space-y-2.5">{filteredItems.map((item) => <ClauseCard key={item.id} item={item} selected={selectedItem?.id === item.id} onClick={() => setSelectedId(item.id)} />)}</div>
      </aside>
      <DetailPanel item={selectedItem} onClose={() => setSelectedId("")} />
    </div>
  );
};

const AiRawView = ({ apiAnalysisResult }) => {
  const aiText = safeToText(apiAnalysisResult);
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_14px_42px_-32px_rgba(15,23,42,0.5)]">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-lg font-black text-slate-900">AI 원문 분석 노트</h3>
        <p className="mt-1 break-keep text-sm font-semibold leading-6 text-slate-500">API가 반환한 원문 분석 결과를 개발자 로그가 아닌 분석 노트 형태로 확인할 수 있습니다.</p>
      </div>
      {aiText ? <pre className="mt-4 max-h-[540px] overflow-auto rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 text-xs font-semibold leading-7 text-slate-700 shadow-inner shadow-slate-200/40">{aiText}</pre> : <p className="mt-4 text-sm font-semibold text-slate-500">아직 AI 분석 결과가 없습니다.</p>}
    </div>
  );
};

const SuggestionsView = ({ integratedItems }) => {
  const [copiedId, setCopiedId] = useState(null);
  const suggestions = useMemo(() => integratedItems.map((item) => {
    const clause = item.clause;
    const mainRisk = item.matchedRisks?.[0];
    const suggestion = clause.suggestion || mainRisk?.suggestion || buildFallbackSuggestion(clause);
    return { id: item.id, toxicTitle: clause.title, category: clause.category, level: clause.severity, page: clause.page, line: clause.line, riskTitle: mainRisk?.title || "계약 조항 수정 가이드", score: mainRisk?.score || "", suggestion, matchedRiskCount: item.matchedRisks?.length || 0 };
  }), [integratedItems]);

  const handleCopy = (item) => {
    copyToClipboard(item.suggestion, () => {
      setCopiedId(item.id);
      window.setTimeout(() => setCopiedId(null), 1300);
    });
  };

  if (!suggestions.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm shadow-slate-200/40">
        <h3 className="text-lg font-black text-slate-900">표시할 수정 가이드가 없습니다</h3>
        <p className="mt-2 text-sm font-semibold text-slate-500">독소조항이 탐지되면 조항별 수정 방향이 이곳에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_14px_42px_-32px_rgba(15,23,42,0.5)]">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-black text-slate-900">수정 가이드</h3>
        <p className="mt-1 break-keep text-sm font-semibold leading-6 text-slate-500">탐지된 조항별 수정 방향을 문서형 리스트로 정리했습니다.</p>
      </div>
      <div className="divide-y divide-slate-200">
        {suggestions.map((item, index) => (
          <div key={item.id} className="px-5 py-4 transition hover:bg-emerald-50/40">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Chip>{String(index + 1).padStart(2, "0")}</Chip>
              <StatusBadge level={item.level} />
              {item.category && <Chip>{item.category}</Chip>}
              {item.matchedRiskCount > 0 && <Chip>연결 리스크 {item.matchedRiskCount}개</Chip>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h4 className="break-keep text-base font-black text-slate-950">{item.toxicTitle}</h4>
                <p className="mt-1 break-keep text-xs font-bold leading-5 text-slate-500">{compact([item.page && `${item.page}페이지`, item.line && `${item.line}번째 줄`, item.riskTitle, item.score !== "" && `${item.score}점`]).join(" · ")}</p>
              </div>
              <CopyButton onClick={() => handleCopy(item)} copied={copiedId === item.id} />
            </div>
            <p className="mt-3 break-keep border-l-2 border-emerald-200 pl-3 text-sm font-bold leading-7 text-emerald-900">{item.suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalysisResultTabs = ({ contractText = "", apiAnalysisResult = null }) => {
  const [activeTab, setActiveTab] = useState("board");

  const reverseRiskResults = useMemo(() => {
    if (!contractText || !contractText.trim()) return [];
    return analyzeContractRisk(contractText, [], apiAnalysisResult).sort((a, b) => {
      if (a.evidenceFound !== b.evidenceFound) return a.evidenceFound ? -1 : 1;
      return Number(b.score || 0) - Number(a.score || 0);
    });
  }, [contractText, apiAnalysisResult]);

  const toxicClauses = useMemo(() => extractToxicClauses(apiAnalysisResult), [apiAnalysisResult]);
  const integratedItems = useMemo(() => toxicClauses.map((clause, index) => ({ id: clause.id || `integrated-${index}`, clause, matchedRisks: matchRisksToToxicClause(clause, reverseRiskResults) })), [toxicClauses, reverseRiskResults]);

  const tabs = [
    { id: "board", label: "Risk Board", icon: <ShieldAlert size={15} /> },
    { id: "suggestion", label: "Fix Guide", icon: <Wrench size={15} /> },
    { id: "ai", label: "AI Raw", icon: <Brain size={15} /> },
  ];

  return (
    <div className="space-y-4 rounded-[32px] bg-slate-50/70">
      <HeroHeader reverseRiskResults={reverseRiskResults} integratedItems={integratedItems} />
      <div className="rounded-[22px] border border-slate-200 bg-white/95 p-1.5 shadow-[0_10px_30px_-26px_rgba(15,23,42,0.45)]">
        <div className="grid grid-cols-3 gap-1.5">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex min-w-0 items-center justify-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-black transition duration-200 sm:text-sm ${activeTab === tab.id ? "bg-slate-950 text-white shadow-[0_12px_28px_-20px_rgba(15,23,42,0.8)]" : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"}`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {activeTab === "board" && <RiskBoard integratedItems={integratedItems} />}
      {activeTab === "suggestion" && <SuggestionsView integratedItems={integratedItems} />}
      {activeTab === "ai" && <AiRawView apiAnalysisResult={apiAnalysisResult} />}
      <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 text-xs font-semibold leading-6 text-slate-500 shadow-sm shadow-slate-200/40">
        <div className="flex items-start gap-2">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-slate-400" />
          <p className="break-keep">이 결과는 AI 독소조항 분석과 규칙 기반 역방향 리스크 체크를 결합한 참고 자료입니다. 실제 계약 체결 전에는 전문가 검토를 함께 진행하는 것이 안전합니다.</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultTabs;
