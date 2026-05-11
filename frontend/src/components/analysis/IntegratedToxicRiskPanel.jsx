import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clipboard,
  FileWarning,
  Link2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { analyzeContractRisk } from "../../features/reverseRisk/riskAnalyzer";

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
      "상환",
      "반환",
      "환급",
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
      "과태료",
      "벌칙",
      "현장 점검",
      "점검",
      "통보",
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

const safeText = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const getValue = (item, keys = []) => {
  for (const key of keys) {
    if (item && item[key]) {
      return item[key];
    }
  }

  return "";
};

const splitApiTextToClauses = (text) => {
  const lines = String(text || "")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const result = [];
  let current = null;

  lines.forEach((line) => {
    const looksLikeTitle =
      line.includes("위험") ||
      line.includes("가능성") ||
      line.includes("제재") ||
      line.includes("전가") ||
      line.includes("점검") ||
      line.includes("조항") ||
      line.includes("독소");

    if (looksLikeTitle && line.length <= 80) {
      if (current) {
        result.push(current);
      }

      current = {
        title: line.replace(/^[-*#\d.\s]+/, "").trim(),
        description: "",
        reason: "",
        suggestion: "",
        severity: "주의",
      };

      return;
    }

    if (!current) {
      current = {
        title: "AI 탐지 독소조항",
        description: "",
        reason: "",
        suggestion: "",
        severity: "주의",
      };
    }

    if (
      line.includes("수정") ||
      line.includes("개선") ||
      line.includes("권장") ||
      line.includes("추천")
    ) {
      current.suggestion = current.suggestion
        ? `${current.suggestion}\n${line}`
        : line;
    } else if (
      line.includes("이유") ||
      line.includes("문제") ||
      line.includes("위험") ||
      line.includes("불리")
    ) {
      current.reason = current.reason ? `${current.reason}\n${line}` : line;
    } else {
      current.description = current.description
        ? `${current.description}\n${line}`
        : line;
    }
  });

  if (current) {
    result.push(current);
  }

  return result;
};

const extractToxicClauses = (apiAnalysisResult) => {
  if (!apiAnalysisResult) {
    return [];
  }

  if (Array.isArray(apiAnalysisResult)) {
    return apiAnalysisResult.map((item, index) => ({
      id: item.id || `toxic-${index}`,
      title:
        getValue(item, ["title", "name", "clauseTitle", "riskTitle"]) ||
        `독소조항 ${index + 1}`,
      description:
        getValue(item, ["description", "content", "text", "clause", "sentence"]) ||
        "",
      reason: getValue(item, ["reason", "issue", "risk", "problem"]) || "",
      suggestion:
        getValue(item, ["suggestion", "recommendation", "solution", "fix"]) || "",
      severity:
        getValue(item, ["severity", "level", "riskLevel", "grade"]) || "주의",
      category: getValue(item, ["category", "type", "section"]) || "",
      raw: item,
    }));
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
    ];

    for (const array of possibleArrays) {
      if (Array.isArray(array) && array.length > 0) {
        return array.map((item, index) => ({
          id: item.id || `toxic-${index}`,
          title:
            getValue(item, ["title", "name", "clauseTitle", "riskTitle"]) ||
            `독소조항 ${index + 1}`,
          description:
            getValue(item, [
              "description",
              "content",
              "text",
              "clause",
              "sentence",
            ]) || "",
          reason: getValue(item, ["reason", "issue", "risk", "problem"]) || "",
          suggestion:
            getValue(item, ["suggestion", "recommendation", "solution", "fix"]) ||
            "",
          severity:
            getValue(item, ["severity", "level", "riskLevel", "grade"]) || "주의",
          category: getValue(item, ["category", "type", "section"]) || "",
          raw: item,
        }));
      }
    }

    const text =
      apiAnalysisResult.analysis ||
      apiAnalysisResult.result ||
      apiAnalysisResult.message ||
      apiAnalysisResult.content ||
      apiAnalysisResult.text ||
      safeText(apiAnalysisResult);

    return splitApiTextToClauses(text).map((item, index) => ({
      id: `toxic-${index}`,
      ...item,
    }));
  }

  if (typeof apiAnalysisResult === "string") {
    return splitApiTextToClauses(apiAnalysisResult).map((item, index) => ({
      id: `toxic-${index}`,
      ...item,
    }));
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
      clause.category,
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

      if (!map) {
        return null;
      }

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

      if (!matched) {
        return null;
      }

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

const getLevelStyle = (level) => {
  const value = String(level || "");

  if (
    value.includes("위험") ||
    value.includes("높") ||
    value.toLowerCase().includes("danger")
  ) {
    return {
      badge: "border-red-200 bg-red-50 text-red-600",
      border: "border-red-200",
      dot: "bg-red-500",
      label: "위험",
    };
  }

  if (
    value.includes("주의") ||
    value.includes("중") ||
    value.toLowerCase().includes("warning")
  ) {
    return {
      badge: "border-amber-200 bg-amber-50 text-amber-600",
      border: "border-amber-200",
      dot: "bg-amber-500",
      label: "주의",
    };
  }

  return {
    badge: "border-slate-200 bg-slate-50 text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
    label: value || "검토",
  };
};

const getRiskLevelStyle = (level) => {
  if (level === "위험") {
    return "border-red-200 bg-red-50 text-red-600";
  }

  if (level === "주의") {
    return "border-amber-200 bg-amber-50 text-amber-600";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
};

const copyToClipboard = async (text, onSuccess) => {
  try {
    await navigator.clipboard.writeText(text || "");
    onSuccess?.();
  } catch {
    alert("복사에 실패했습니다. 직접 선택해서 복사해주세요.");
  }
};

const SummaryBox = ({ integratedItems }) => {
  const clauseCount = integratedItems.length;

  const matchedCount = integratedItems.filter(
    (item) => item.matchedRisks.length > 0
  ).length;

  const highRiskCount = integratedItems.filter((item) =>
    item.matchedRisks.some((risk) => risk.level === "위험")
  ).length;

  const totalMatchedRisks = integratedItems.reduce((sum, item) => {
    return sum + item.matchedRisks.length;
  }, 0);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="p-6 md:p-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-purple-600">
            <Sparkles size={13} />
            Toxic Clause + Reverse Risk
          </div>

          <h2 className="break-keep text-2xl font-black text-slate-950 md:text-3xl">
            독소조항 기반 역방향 리스크 분석
          </h2>

          <p className="mt-2 max-w-2xl break-keep text-sm font-medium leading-6 text-slate-500">
            AI가 탐지한 독소조항을 실무 피해 시나리오와 연결해, 누락된 보호 장치와 수정 문구까지 한 번에 확인합니다.
          </p>

          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="text-xs font-black text-slate-400">
              분석 구조
            </div>
            <div className="mt-1 break-keep text-sm font-bold leading-6 text-slate-700">
              독소조항 탐지 → 연결 리스크 매칭 → 누락 보호 장치 확인 → 수정 문구 제안
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50 lg:border-l lg:border-t-0">
          <div className="flex flex-col items-center justify-center p-5">
            <div className="text-xs font-black text-slate-400">독소조항</div>
            <div className="mt-1 text-3xl font-black text-slate-800">
              {clauseCount}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-l border-slate-200 p-5">
            <div className="text-xs font-black text-slate-400">연결됨</div>
            <div className="mt-1 text-3xl font-black text-purple-600">
              {matchedCount}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-t border-slate-200 p-5">
            <div className="text-xs font-black text-slate-400">고위험</div>
            <div className="mt-1 text-3xl font-black text-red-500">
              {highRiskCount}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-l border-t border-slate-200 p-5">
            <div className="text-xs font-black text-slate-400">연결 리스크</div>
            <div className="mt-1 text-3xl font-black text-amber-500">
              {totalMatchedRisks}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const RiskLinkCard = ({ risk }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(risk.suggestion, () => {
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1300);
    });
  };

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link2 size={15} className="shrink-0 text-purple-600" />
            <h4 className="break-keep text-sm font-black text-slate-950">
              {risk.title}
            </h4>
          </div>

          <p className="mt-1 break-keep text-xs font-medium leading-5 text-slate-500">
            {risk.scenario}
          </p>
        </div>

        <span
          className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-black ${getRiskLevelStyle(
            risk.level
          )}`}
        >
          {risk.score}점 · {risk.level}
        </span>
      </div>

      {risk.matchedKeywords?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {risk.matchedKeywords.slice(0, 6).map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700"
            >
              #{keyword}
            </span>
          ))}
        </div>
      )}

      {risk.missingItems?.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-black text-amber-700">
            <AlertCircle size={14} />
            누락된 보호 장치
          </div>

          <ul className="space-y-1">
            {risk.missingItems.map((item) => (
              <li
                key={item.label}
                className="break-keep text-xs font-bold leading-5 text-amber-800"
              >
                - {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {risk.suggestion && (
        <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50 p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-black text-purple-800">
              <CheckCircle2 size={14} />
              추천 수정 문구
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-black text-purple-700 shadow-sm transition hover:bg-purple-100"
            >
              <Clipboard size={12} />
              {copied ? "복사됨" : "복사"}
            </button>
          </div>

          <p className="break-keep text-xs font-bold leading-6 text-purple-900">
            {risk.suggestion}
          </p>
        </div>
      )}
    </div>
  );
};

const ToxicClauseCard = ({ item, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  const clause = item.clause;
  const matchedRisks = item.matchedRisks;
  const style = getLevelStyle(clause.severity);

  return (
    <article
      className={`rounded-[2rem] border bg-white shadow-sm transition ${
        matchedRisks.length > 0 ? style.border : "border-slate-200"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left md:p-6"
      >
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-black ${style.badge}`}
            >
              <FileWarning size={13} />
              {style.label}
            </span>

            {clause.category && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                {clause.category}
              </span>
            )}

            {matchedRisks.length > 0 && (
              <span className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-[11px] font-black text-purple-700">
                연결 리스크 {matchedRisks.length}개
              </span>
            )}
          </div>

          <h3 className="break-keep text-base font-black text-slate-950 md:text-lg">
            {clause.title}
          </h3>

          {clause.description && (
            <p className="mt-2 break-keep text-sm font-medium leading-6 text-slate-600">
              {clause.description}
            </p>
          )}

          {clause.reason && (
            <div className="mt-3 rounded-2xl bg-blue-50 px-4 py-3">
              <p className="break-keep text-xs font-bold leading-5 text-blue-700">
                {clause.reason}
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0 rounded-xl bg-slate-50 p-2 text-slate-500">
          {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 pb-5 md:px-6 md:pb-6">
          {matchedRisks.length > 0 ? (
            <div className="mt-5 rounded-[1.5rem] border border-purple-100 bg-purple-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-purple-900">
                <ShieldAlert size={17} />
                연결된 역방향 리스크
              </div>

              <div className="space-y-3">
                {matchedRisks.map((risk) => (
                  <RiskLinkCard key={risk.id} risk={risk} />
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="break-keep text-sm font-bold leading-6 text-slate-500">
                이 독소조항과 직접 연결되는 역방향 리스크를 찾지 못했습니다.
              </p>
            </div>
          )}

          {clause.suggestion && (
            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
              <div className="mb-2 text-xs font-black text-blue-700">
                AI 원문 수정 제안
              </div>
              <p className="break-keep text-xs font-bold leading-6 text-blue-800">
                {clause.suggestion}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

const EmptyState = () => {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <FileWarning size={26} />
      </div>

      <h3 className="text-lg font-black text-slate-900">
        결합할 독소조항 결과가 없습니다
      </h3>

      <p className="mt-2 break-keep text-sm font-medium leading-6 text-slate-500">
        AI 분석 결과 또는 독소조항 목록이 들어오면 역방향 리스크와 연결해 표시합니다.
      </p>
    </div>
  );
};

const IntegratedToxicRiskPanel = ({
  contractText = "",
  apiAnalysisResult = null,
}) => {
  const reverseRiskResults = useMemo(() => {
    if (!contractText || !contractText.trim()) {
      return [];
    }

    return analyzeContractRisk(contractText, [], apiAnalysisResult);
  }, [contractText, apiAnalysisResult]);

  const toxicClauses = useMemo(() => {
    return extractToxicClauses(apiAnalysisResult);
  }, [apiAnalysisResult]);

  const integratedItems = useMemo(() => {
    return toxicClauses.map((clause, index) => {
      const matchedRisks = matchRisksToToxicClause(clause, reverseRiskResults);

      return {
        id: clause.id || `integrated-${index}`,
        clause,
        matchedRisks,
      };
    });
  }, [toxicClauses, reverseRiskResults]);

  if (!apiAnalysisResult || integratedItems.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <SummaryBox integratedItems={integratedItems} />

      <section className="space-y-4">
        {integratedItems.map((item, index) => (
          <ToxicClauseCard
            key={item.id}
            item={item}
            defaultOpen={index === 0}
          />
        ))}
      </section>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="break-keep text-xs font-medium leading-5 text-slate-500">
          이 결과는 AI 독소조항 분석과 규칙 기반 역방향 리스크 체크를 결합한 참고 자료입니다. 실제 계약 체결 전에는 전문가 검토를 함께 진행하는 것이 안전합니다.
        </p>
      </div>
    </div>
  );
};

export default IntegratedToxicRiskPanel;