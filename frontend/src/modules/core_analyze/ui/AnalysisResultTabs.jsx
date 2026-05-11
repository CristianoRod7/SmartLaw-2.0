import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clipboard,
  FileWarning,
  Link2,
  Search,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  X,
} from "lucide-react";

import { analyzeContractRisk } from "../../../features/reverseRisk/riskAnalyzer";

const toxicRiskMap = [
  {
    riskId: "payment_delay",
    keywords: [
      "지급",
      "환수",
      "대금",
      "잔금",
      "검수",
      "지원금",
      "정산",
      "반환",
      "환급",
      "보조금",
      "상환",
      "보증금",
      "월세",
      "임대료",
    ],
  },
  {
    riskId: "unlimited_revision",
    keywords: [
      "수정",
      "보완",
      "변경",
      "요구",
      "의무",
      "기준",
      "일방적",
      "재작업",
      "추가",
      "시정",
      "개선",
      "조치",
    ],
  },
  {
    riskId: "ip_transfer",
    keywords: [
      "저작권",
      "소스코드",
      "지식재산권",
      "권리",
      "귀속",
      "소유권",
      "산출물",
      "결과물",
      "소유",
    ],
  },
  {
    riskId: "maintenance_bomb",
    keywords: [
      "유지보수",
      "하자",
      "오류",
      "버그",
      "운영",
      "지원",
      "사후",
      "안정화",
      "원상복구",
      "복구",
      "퇴거",
      "노후화",
      "수선",
    ],
  },
  {
    riskId: "delay_penalty",
    keywords: [
      "지연",
      "제재",
      "위반",
      "손해배상",
      "지체상금",
      "책임",
      "벌칙",
      "점검",
      "통보",
      "현장",
      "과태료",
      "전가",
      "해지",
      "계약 해지",
      "기간",
      "연장",
    ],
  },
  {
    riskId: "nda_limit",
    keywords: [
      "비밀",
      "공개",
      "포트폴리오",
      "제3자",
      "영업비밀",
      "기밀",
      "외부",
      "누설",
    ],
  },
];

const normalizeText = (value) => {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
};

const compact = (items = []) => {
  return items.filter(
    (item) => item !== undefined && item !== null && String(item).trim() !== ""
  );
};

const safeToText = (value) => {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    if (value.analysis) return String(value.analysis);
    if (value.result) return String(value.result);
    if (value.content) return String(value.content);
    if (value.message) return String(value.message);
    if (value.text) return String(value.text);

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  return String(value);
};

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

  if (
    value.includes("danger") ||
    value.includes("high") ||
    value.includes("위험") ||
    value.includes("높")
  ) {
    return "위험";
  }

  if (
    value.includes("warning") ||
    value.includes("medium") ||
    value.includes("주의") ||
    value.includes("중")
  ) {
    return "주의";
  }

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
      selected: "border-red-300 bg-red-50/30",
    };
  }

  if (value === "주의") {
    return {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
      accent: "bg-amber-500",
      text: "text-amber-700",
      soft: "border-amber-100 bg-amber-50 text-amber-800",
      selected: "border-amber-300 bg-amber-50/30",
    };
  }

  return {
    badge: "border-slate-200 bg-slate-50 text-slate-600",
    dot: "bg-slate-400",
    accent: "bg-emerald-500",
    text: "text-slate-600",
    soft: "border-slate-100 bg-slate-50 text-slate-700",
    selected: "border-emerald-300 bg-emerald-50/30",
  };
};

const normalizeClauseObject = (item, index, category = "") => {
  const title =
    item.title ||
    item.riskTitle ||
    item.clauseTitle ||
    item.name ||
    item.clause ||
    `독소조항 ${index + 1}`;

  const description =
    item.summary ||
    item.description ||
    item.content ||
    item.text ||
    item.sentence ||
    item.body ||
    item.clauseText ||
    item.clause ||
    "";

  const reason =
    item.reason ||
    item.issue ||
    item.risk ||
    item.problem ||
    item.why ||
    "";

  const suggestion =
    item.recommendation ||
    item.suggestion ||
    item.solution ||
    item.fix ||
    item.alternative ||
    item.guide ||
    item.revision ||
    item.modifyGuide ||
    "";

  const legalBasis =
    item.law ||
    item.legalBasis ||
    item.legal_basis ||
    item.basis ||
    item.reference ||
    item.relatedLaw ||
    "";

  const severity =
    item.status ||
    item.severity ||
    item.level ||
    item.riskLevel ||
    item.grade ||
    item.danger_level ||
    "주의";

  const keywords = Array.isArray(item.highlight_keywords)
    ? item.highlight_keywords
    : Array.isArray(item.keywords)
      ? item.keywords
      : [];

  return {
    id: item.id || `toxic-${index}`,
    title,
    description,
    reason,
    suggestion,
    legalBasis,
    severity,
    category: item.category || item.type || item.section || category || "",
    page: item.page || item.pageNo || item.page_number || "",
    article: item.line || item.article || item.articleNo || item.clauseNo || "",
    keywords,
    raw: item,
  };
};

const splitApiTextToClauses = (text) => {
  const lines = String(text || "")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const result = [];
  let current = null;

  lines.forEach((line) => {
    const cleanedLine = line.replace(/^[-*#\d.\s]+/, "").trim();

    const looksLikeTitle =
      cleanedLine.includes("위험") ||
      cleanedLine.includes("가능성") ||
      cleanedLine.includes("제재") ||
      cleanedLine.includes("전가") ||
      cleanedLine.includes("점검") ||
      cleanedLine.includes("조항") ||
      cleanedLine.includes("독소") ||
      cleanedLine.includes("불리") ||
      cleanedLine.includes("책임") ||
      cleanedLine.includes("환수") ||
      cleanedLine.includes("위반") ||
      cleanedLine.includes("해지") ||
      cleanedLine.includes("원상복구");

    if (looksLikeTitle && cleanedLine.length <= 110) {
      if (current) result.push(current);

      current = {
        id: `toxic-${result.length}`,
        title: cleanedLine,
        description: "",
        reason: "",
        suggestion: "",
        legalBasis: "",
        page: "",
        article: "",
        severity:
          cleanedLine.includes("Danger") ||
          cleanedLine.includes("위험") ||
          cleanedLine.includes("환수") ||
          cleanedLine.includes("제재")
            ? "위험"
            : "주의",
        category: "",
        keywords: [],
      };

      return;
    }

    if (!current) {
      current = {
        id: "toxic-0",
        title: "AI 탐지 독소조항",
        description: "",
        reason: "",
        suggestion: "",
        legalBasis: "",
        page: "",
        article: "",
        severity: "주의",
        category: "",
        keywords: [],
      };
    }

    if (
      cleanedLine.includes("수정") ||
      cleanedLine.includes("개선") ||
      cleanedLine.includes("권장") ||
      cleanedLine.includes("추천") ||
      cleanedLine.includes("대체")
    ) {
      current.suggestion = current.suggestion
        ? `${current.suggestion}\n${cleanedLine}`
        : cleanedLine;
    } else if (
      cleanedLine.includes("근거") ||
      cleanedLine.includes("법령") ||
      cleanedLine.includes("법:")
    ) {
      current.legalBasis = current.legalBasis
        ? `${current.legalBasis}\n${cleanedLine}`
        : cleanedLine;
    } else if (
      cleanedLine.includes("이유") ||
      cleanedLine.includes("문제") ||
      cleanedLine.includes("위험") ||
      cleanedLine.includes("불리") ||
      cleanedLine.includes("가능")
    ) {
      current.reason = current.reason
        ? `${current.reason}\n${cleanedLine}`
        : cleanedLine;
    } else {
      current.description = current.description
        ? `${current.description}\n${cleanedLine}`
        : cleanedLine;
    }
  });

  if (current) result.push(current);

  return result;
};

const extractToxicClauses = (apiAnalysisResult) => {
  if (!apiAnalysisResult) return [];

  if (Array.isArray(apiAnalysisResult?.sections)) {
    return apiAnalysisResult.sections.flatMap((section, sectionIndex) => {
      const category =
        section.category || section.title || `섹션 ${sectionIndex + 1}`;
      const items = Array.isArray(section.items) ? section.items : [];

      return items.map((item, itemIndex) =>
        normalizeClauseObject(item, `${sectionIndex}-${itemIndex}`, category)
      );
    });
  }

  if (Array.isArray(apiAnalysisResult?.results)) {
    return apiAnalysisResult.results.flatMap((section, sectionIndex) => {
      if (Array.isArray(section.items)) {
        const category =
          section.category || section.title || `섹션 ${sectionIndex + 1}`;

        return section.items.map((item, itemIndex) =>
          normalizeClauseObject(item, `${sectionIndex}-${itemIndex}`, category)
        );
      }

      return [normalizeClauseObject(section, sectionIndex)];
    });
  }

  if (Array.isArray(apiAnalysisResult)) {
    return apiAnalysisResult.map((item, index) =>
      normalizeClauseObject(item, index)
    );
  }

  if (typeof apiAnalysisResult === "object") {
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

  if (typeof apiAnalysisResult === "string") {
    return splitApiTextToClauses(apiAnalysisResult);
  }

  return [];
};

const getClauseText = (clause) => {
  return normalizeText(
    [
      clause.title,
      clause.description,
      clause.reason,
      clause.suggestion,
      clause.legalBasis,
      clause.category,
      clause.page,
      clause.article,
      ...(clause.keywords || []),
    ]
      .filter(Boolean)
      .join(" ")
  );
};

const matchRisksToToxicClause = (clause, reverseRiskResults) => {
  const text = getClauseText(clause);

  return reverseRiskResults
    .map((risk) => {
      const map = toxicRiskMap.find((item) => item.riskId === risk.id);

      if (!map) return null;

      const keywordHits = map.keywords.filter((keyword) =>
        text.includes(keyword)
      );

      const evidenceHit =
        risk.evidenceItems?.some((evidence) => {
          const evidenceText = normalizeText(evidence.text);

          return (
            evidenceText.length > 8 &&
            (text.includes(evidenceText.slice(0, 12)) ||
              evidenceText.includes(clause.title))
          );
        }) || false;

      const titleHit =
        text.includes(risk.title) ||
        text.includes(risk.scenario) ||
        risk.title.includes(clause.title);

      const matched = keywordHits.length > 0 || evidenceHit || titleHit;

      if (!matched) return null;

      const matchScore =
        keywordHits.length * 10 +
        (evidenceHit ? 20 : 0) +
        (titleHit ? 15 : 0) +
        Number(risk.score || 0);

      return {
        ...risk,
        matchScore,
        matchedKeywords: keywordHits,
      };
    })
    .filter(Boolean)
    .sort((a, b) => Number(b.matchScore || 0) - Number(a.matchScore || 0));
};

const summarizeRiskResults = (reverseRiskResults) => {
  const validRisks = reverseRiskResults.filter((item) => item.evidenceFound);

  if (!validRisks.length) {
    return {
      summaryScore: 0,
      summaryLevel: "낮음",
      dangerCount: 0,
      cautionCount: 0,
      topRisk: null,
    };
  }

  const total = validRisks.reduce((sum, item) => {
    return sum + Number(item.score || 0);
  }, 0);

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
  const title = clause.title || "해당 조항";
  const category = clause.category || "계약 리스크";
  const legalBasis = clause.legalBasis
    ? ` 관련 근거는 ${clause.legalBasis}입니다.`
    : "";

  return `${title} 조항은 ${category}와 관련된 분쟁 가능성이 있으므로, 적용 조건, 책임 범위, 예외 사유, 사전 통지 절차를 계약서에 명확히 기재하는 방향으로 수정하는 것이 좋습니다.${legalBasis}`;
};

const StatusBadge = ({ level }) => {
  const style = getLevelStyle(level);

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {getLevelText(level)}
    </span>
  );
};

const Chip = ({ children }) => {
  if (!children) return null;

  return (
    <span className="inline-flex max-w-full shrink-0 items-center truncate rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
      {children}
    </span>
  );
};

const MetricBlock = ({ label, value, caption, emphasis = false }) => {
  return (
    <div
      className={`rounded-2xl border px-4 py-4 ${
        emphasis
          ? "border-emerald-200 bg-emerald-50/80"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="text-xs font-bold text-slate-500">{label}</div>
      <div
        className={`mt-2 text-[28px] font-black tracking-[-0.04em] ${
          emphasis ? "text-emerald-700" : "text-slate-950"
        }`}
      >
        {value}
      </div>
      {caption && (
        <div className="mt-1 truncate text-xs font-medium text-slate-400">
          {caption}
        </div>
      )}
    </div>
  );
};

const HeroHeader = ({ reverseRiskResults, integratedItems }) => {
  const summary = summarizeRiskResults(reverseRiskResults);

  const matchedClauseCount = integratedItems.filter(
    (item) => item.matchedRisks.length > 0
  ).length;

  const totalMatchedRiskCount = integratedItems.reduce((sum, item) => {
    return sum + item.matchedRisks.length;
  }, 0);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-[#071225] via-[#0A1E2E] to-[#063B31] shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
      <div className="absolute right-[-80px] top-[-120px] h-[360px] w-[360px] rounded-full border-[34px] border-white/10" />
      <div className="absolute right-[70px] top-[115px] h-[110px] w-[220px] rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-[-80px] left-[35%] h-[180px] w-[180px] rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:p-8">
        <div className="min-w-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-200">
            <ShieldCheck size={14} />
            Contract Risk Report
          </div>

          <h2 className="max-w-3xl break-keep text-[30px] font-black leading-[1.18] tracking-[-0.035em] text-white md:text-[40px]">
            계약서의 위험 조항과
            <br className="hidden md:block" />
            수정 방향을 정리했습니다
          </h2>

          <p className="mt-4 max-w-3xl break-keep text-[15px] font-medium leading-8 text-slate-200/90">
            탐지된 독소조항을 기준으로 법적 근거, 연결 리스크, 누락된 보호 장치,
            수정 가이드를 함께 검토할 수 있습니다.
          </p>

          {summary.topRisk && (
            <div className="mt-6 max-w-2xl rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-xs font-bold text-emerald-200">
                우선 검토 항목
              </div>
              <div className="mt-1 line-clamp-2 break-keep text-[14px] font-bold leading-6 text-white">
                {summary.topRisk.title}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetricBlock
            label="종합 위험도"
            value={summary.summaryScore}
            caption={`${summary.summaryLevel} 단계`}
            emphasis
          />
          <MetricBlock
            label="독소조항"
            value={integratedItems.length}
            caption="탐지 항목"
          />
          <MetricBlock
            label="연결됨"
            value={matchedClauseCount}
            caption="리스크 매칭"
          />
          <MetricBlock
            label="연결 리스크"
            value={totalMatchedRiskCount}
            caption="피해 시나리오"
          />
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
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 transition focus-within:border-emerald-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-50">
          <Search size={15} className="shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="독소조항, 법령, 키워드 검색"
            className="w-full bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                filter === item.id
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
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
  const matchedCount = item.matchedRisks.length;
  const style = getLevelStyle(clause.severity);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative min-h-[232px] overflow-hidden rounded-2xl border bg-white text-left transition hover:border-emerald-200 hover:bg-emerald-50/20 hover:shadow-[0_10px_30px_rgba(15,23,42,0.06)] ${
        selected
          ? "border-emerald-500 bg-emerald-50/30 shadow-sm"
          : "border-slate-200"
      }`}
    >
      <div className={`absolute left-0 top-0 h-full w-[3px] ${style.accent}`} />

      <div className="flex h-full flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400">
              검토 조항
            </div>
            <div className="mt-1 max-w-[240px] truncate text-xs font-medium text-slate-500">
              {clause.category || "분류 없음"}
            </div>
          </div>

          <StatusBadge level={clause.severity} />
        </div>

        <h3 className="line-clamp-2 break-keep text-[18px] font-black leading-[1.55] tracking-[-0.02em] text-slate-950">
          {clause.title}
        </h3>

        <p className="mt-3 line-clamp-3 break-keep text-[14px] font-medium leading-7 text-slate-600">
          {clause.description || clause.reason || "상세 내용을 확인하세요."}
        </p>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-1.5">
            <Chip>연결 {matchedCount}개</Chip>
            {clause.page && <Chip>{clause.page}페이지</Chip>}
            {clause.article && <Chip>{clause.article}</Chip>}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold text-slate-500">
            <span className="group-hover:text-slate-950">상세 보기</span>
            <ChevronRight
              size={15}
              className="transition group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </div>
    </button>
  );
};

const Section = ({ number, title, icon, children }) => {
  return (
    <section className="border-t border-slate-200 pt-5 first:border-t-0 first:pt-0">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400">{number}</span>
        <div className="flex min-w-0 items-center gap-2 text-sm font-black text-slate-950">
          {icon}
          <span className="truncate">{title}</span>
        </div>
      </div>
      {children}
    </section>
  );
};

const CopyButton = ({ onClick, copied }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
    >
      <Clipboard size={13} />
      {copied ? "복사됨" : "복사"}
    </button>
  );
};

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
    <div className="rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-start justify-between gap-4 px-4 py-3.5 text-left transition hover:bg-slate-50"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link2 size={14} className="shrink-0 text-emerald-500" />
            <h4 className="break-keep text-[14px] font-black leading-6 text-slate-950">
              {risk.title}
            </h4>
          </div>

          <p className="mt-1 line-clamp-2 break-keep text-[13px] font-medium leading-6 text-slate-600">
            {risk.scenario}
          </p>

          {risk.matchedKeywords?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {risk.matchedKeywords.slice(0, 5).map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full border px-2 py-1 text-[11px] font-bold ${
              getLevelStyle(risk.level).badge
            }`}
          >
            {risk.score}점
          </span>

          <span className="rounded-md p-1 text-slate-400">
            {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </span>
        </div>
      </button>

      {open && (
        <div className="space-y-3 border-t border-slate-200 px-4 py-3.5">
          {risk.evidenceItems?.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-bold text-slate-500">
                연결 근거 문장
              </div>

              <ul className="space-y-2">
                {risk.evidenceItems.slice(0, 4).map((evidence, index) => (
                  <li
                    key={`${risk.id}-evidence-${index}`}
                    className="break-keep rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium leading-6 text-slate-700"
                  >
                    <span className="mr-2 font-bold text-slate-950">
                      {evidence.source || "근거"}
                    </span>
                    “{evidence.text}”
                  </li>
                ))}
              </ul>
            </div>
          )}

          {risk.missingItems?.length > 0 && (
            <div className="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2">
              <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-amber-700">
                <AlertCircle size={13} />
                누락된 보호 장치
              </div>

              <ul className="space-y-1">
                {risk.missingItems.map((item) => (
                  <li
                    key={item.label}
                    className="break-keep text-xs font-medium leading-6 text-amber-800"
                  >
                    - {item.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {risk.suggestion && (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/70 px-3 py-2">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 size={13} />
                  리스크 기준 수정 문구
                </div>

                <CopyButton onClick={handleCopy} copied={copied} />
              </div>

              <p className="break-keep text-xs font-medium leading-6 text-emerald-950">
                {risk.suggestion}
              </p>
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
      <aside className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <ShieldAlert className="mx-auto text-slate-300" size={48} />
        <h3 className="mt-4 text-lg font-black text-slate-950">
          카드를 선택하세요
        </h3>
        <p className="mt-2 break-keep text-sm font-medium leading-6 text-slate-500">
          독소조항 카드를 클릭하면 자세한 분석이 표시됩니다.
        </p>
      </aside>
    );
  }

  const clause = item.clause;
  const matchedRisks = item.matchedRisks;
  const style = getLevelStyle(clause.severity);

  const keywords = Array.from(
    new Set(
      compact([
        ...(clause.keywords || []),
        ...matchedRisks.flatMap((risk) => risk.matchedKeywords || []),
      ])
    )
  );

  const mainSuggestion = clause.suggestion || buildFallbackSuggestion(clause);

  const copyMainSuggestion = () => {
    copyToClipboard(mainSuggestion, () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1300);
    });
  };

  return (
    <aside className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            <StatusBadge level={clause.severity} />

            {clause.category && <Chip>{clause.category}</Chip>}

            {matchedRisks.length > 0 && (
              <Chip>연결 리스크 {matchedRisks.length}개</Chip>
            )}
          </div>

          <h3 className="break-keep text-[22px] font-black leading-8 tracking-[-0.03em] text-slate-950">
            {clause.title}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={18} />
        </button>
      </div>

      <p className="mb-6 break-keep text-[15px] font-medium leading-8 text-slate-600">
        {clause.description || "AI가 탐지한 독소조항입니다."}
      </p>

      <div className="space-y-5">
        <Section
          number="01"
          title="왜 위험한가"
          icon={<FileWarning size={16} className={style.text} />}
        >
          <div className="space-y-3">
            <p className="break-keep text-[15px] font-medium leading-8 text-slate-700">
              {clause.reason ||
                clause.description ||
                "해당 조항은 계약 당사자에게 불리하게 작용할 가능성이 있습니다."}
            </p>

            {(clause.page || clause.article || clause.legalBasis) && (
              <div className="space-y-2">
                {(clause.page || clause.article) && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium leading-5 text-slate-600">
                    위치:{" "}
                    {compact([
                      clause.page && `${clause.page}페이지`,
                      clause.article,
                    ]).join(" · ")}
                  </div>
                )}

                {clause.legalBasis && (
                  <div className="break-keep rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium leading-5 text-slate-600">
                    근거 법령: {clause.legalBasis}
                  </div>
                )}
              </div>
            )}

            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {keywords.slice(0, 14).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Section>

        <Section
          number="02"
          title="연결된 피해 시나리오"
          icon={<ShieldAlert size={16} className="text-emerald-600" />}
        >
          {matchedRisks.length > 0 ? (
            <div className="space-y-2.5">
              {matchedRisks.map((risk) => (
                <RiskScenarioCard key={risk.id} risk={risk} />
              ))}
            </div>
          ) : (
            <p className="break-keep rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium leading-6 text-slate-500">
              이 독소조항과 직접 연결되는 역방향 리스크를 찾지 못했습니다.
            </p>
          )}
        </Section>

        <section className="border-t border-slate-200 pt-5">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">03</span>
              <div className="flex items-center gap-2 text-sm font-black text-slate-950">
                <Wrench size={16} className="text-emerald-600" />
                추천 수정 가이드
              </div>
            </div>

            <CopyButton onClick={copyMainSuggestion} copied={copied} />
          </div>

          <p className="break-keep rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-[15px] font-semibold leading-8 text-emerald-950">
            {mainSuggestion}
          </p>
        </section>
      </div>
    </aside>
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

      const filterMatched =
        filter === "all" ||
        (filter === "danger" && level === "위험") ||
        (filter === "warning" && level === "주의") ||
        (filter === "linked" && item.matchedRisks.length > 0);

      return queryMatched && filterMatched;
    });
  }, [integratedItems, query, filter]);

  const selectedItem = useMemo(() => {
    return (
      integratedItems.find((item) => item.id === selectedId) ||
      filteredItems[0] ||
      integratedItems[0] ||
      null
    );
  }, [integratedItems, filteredItems, selectedId]);

  if (!integratedItems.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <FileWarning size={28} />
        </div>

        <h3 className="text-lg font-black text-slate-950">
          결합할 독소조항 결과가 없습니다
        </h3>

        <p className="mt-2 break-keep text-sm font-medium leading-6 text-slate-500">
          AI 분석 결과 또는 독소조항 목록이 들어오면 리포트 보드가 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_480px]">
      <div className="space-y-4">
        <ControlBar
          query={query}
          setQuery={setQuery}
          filter={filter}
          setFilter={setFilter}
        />

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filteredItems.map((item) => (
            <ClauseCard
              key={item.id}
              item={item}
              selected={selectedItem?.id === item.id}
              onClick={() => setSelectedId(item.id)}
            />
          ))}
        </div>
      </div>

      <DetailPanel item={selectedItem} onClose={() => setSelectedId("")} />
    </section>
  );
};

const AiRawView = ({ apiAnalysisResult }) => {
  const aiText = safeToText(apiAnalysisResult);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500">
          <Brain size={18} />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-950">AI 원문 분석</h3>
          <p className="mt-1 break-keep text-sm font-medium leading-6 text-slate-500">
            API가 반환한 원문 분석 결과입니다.
          </p>
        </div>
      </div>

      {aiText ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <pre className="max-h-[680px] overflow-auto whitespace-pre-wrap break-keep font-sans text-sm font-medium leading-7 text-slate-700">
            {aiText}
          </pre>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-6 text-slate-500">
          아직 AI 분석 결과가 없습니다.
        </div>
      )}
    </section>
  );
};

const SuggestionsView = ({ integratedItems }) => {
  const suggestions = useMemo(() => {
    return integratedItems.map((item) => {
      const clause = item.clause;
      const mainRisk = item.matchedRisks?.[0];

      const directSuggestion =
        clause.suggestion ||
        clause.recommendation ||
        clause.solution ||
        clause.fix ||
        clause.alternative ||
        "";

      const riskSuggestion =
        mainRisk?.suggestion ||
        mainRisk?.recommendation ||
        mainRisk?.solution ||
        "";

      const suggestion =
        directSuggestion || riskSuggestion || buildFallbackSuggestion(clause);

      return {
        id: item.id,
        toxicTitle: clause.title,
        category: clause.category,
        level: clause.severity,
        page: clause.page,
        article: clause.article,
        riskTitle: mainRisk?.title || "계약 조항 수정 가이드",
        score: mainRisk?.score || "",
        suggestion,
        matchedRiskCount: item.matchedRisks?.length || 0,
      };
    });
  }, [integratedItems]);

  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (item) => {
    copyToClipboard(item.suggestion, () => {
      setCopiedId(item.id);
      window.setTimeout(() => setCopiedId(null), 1300);
    });
  };

  if (!suggestions.length) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <Wrench className="mx-auto text-slate-400" size={30} />
          <h3 className="mt-3 text-base font-black text-slate-950">
            표시할 수정 가이드가 없습니다
          </h3>
          <p className="mt-2 break-keep text-sm leading-6 text-slate-500">
            독소조항이 탐지되면 조항별 수정 방향이 이곳에 표시됩니다.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Wrench size={17} />
          </div>

          <div>
            <h3 className="text-lg font-black tracking-[-0.02em] text-slate-950">
              수정 가이드
            </h3>
            <p className="mt-1 break-keep text-sm font-medium text-slate-500">
              탐지된 조항별로 수정 방향과 보완 문구를 정리했습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {suggestions.map((item, index) => (
          <article key={item.id} className="py-5 first:pt-0 last:pb-0">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <StatusBadge level={item.level} />

                  {item.category && <Chip>{item.category}</Chip>}

                  {item.matchedRiskCount > 0 && (
                    <Chip>연결 리스크 {item.matchedRiskCount}개</Chip>
                  )}
                </div>

                <h4 className="break-keep text-base font-black leading-7 tracking-[-0.02em] text-slate-950">
                  {item.toxicTitle}
                </h4>

                <div className="mt-1 flex flex-wrap gap-1.5 text-xs font-medium text-slate-500">
                  {item.page && <span>{item.page}페이지</span>}
                  {item.article && <span>· {item.article}</span>}
                  {item.riskTitle && <span>· {item.riskTitle}</span>}
                  {item.score !== "" && <span>· {item.score}점</span>}
                </div>
              </div>

              <CopyButton
                onClick={() => handleCopy(item)}
                copied={copiedId === item.id}
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="break-keep text-[15px] font-medium leading-8 text-slate-700">
                {item.suggestion}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const AnalysisResultTabs = ({
  contractText = "",
  apiAnalysisResult = null,
}) => {
  const [activeTab, setActiveTab] = useState("board");

  const reverseRiskResults = useMemo(() => {
    if (!contractText || !contractText.trim()) return [];

    return analyzeContractRisk(contractText, [], apiAnalysisResult).sort(
      (a, b) => {
        if (a.evidenceFound !== b.evidenceFound) {
          return a.evidenceFound ? -1 : 1;
        }

        return Number(b.score || 0) - Number(a.score || 0);
      }
    );
  }, [contractText, apiAnalysisResult]);

  const toxicClauses = useMemo(() => {
    return extractToxicClauses(apiAnalysisResult);
  }, [apiAnalysisResult]);

  const integratedItems = useMemo(() => {
    return toxicClauses.map((clause, index) => {
      const matchedRisks = matchRisksToToxicClause(
        clause,
        reverseRiskResults
      );

      return {
        id: clause.id || `integrated-${index}`,
        clause,
        matchedRisks,
      };
    });
  }, [toxicClauses, reverseRiskResults]);

  const tabs = [
    {
      id: "board",
      label: "Risk Board",
      icon: <ShieldCheck size={14} />,
    },
    {
      id: "suggestion",
      label: "Fix Guide",
      icon: <Wrench size={14} />,
    },
    {
      id: "ai",
      label: "AI Raw",
      icon: <Brain size={14} />,
    },
  ];

  return (
    <div
      className="mx-auto w-full max-w-7xl space-y-5 bg-slate-50 px-4 py-5 md:px-5"
      style={{
        fontFamily:
          '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
        wordBreak: "keep-all",
      }}
    >
      <HeroHeader
        reverseRiskResults={reverseRiskResults}
        integratedItems={integratedItems}
      />

      <nav className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        <div className="grid grid-cols-3 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                activeTab === tab.id
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {activeTab === "board" && <RiskBoard integratedItems={integratedItems} />}

      {activeTab === "suggestion" && (
        <SuggestionsView integratedItems={integratedItems} />
      )}

      {activeTab === "ai" && <AiRawView apiAnalysisResult={apiAnalysisResult} />}

      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <p className="break-keep text-xs font-medium leading-5 text-slate-500">
          이 결과는 AI 독소조항 분석과 규칙 기반 역방향 리스크 체크를 결합한 참고 자료입니다. 실제 계약 체결 전에는 전문가 검토를 함께 진행하는 것이 안전합니다.
        </p>
      </div>
    </div>
  );
};

export default AnalysisResultTabs;