import riskRules from "./riskRules";

const normalizeText = (text) => {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
};

const splitSentences = (text) => {
  return String(text || "")
    .split(/(?<=[.!?。！？])|\n|(?<=다\.)|(?<=니다\.)|(?<=음\.)/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
};

const includesAnyKeyword = (text, keywords = []) => {
  const normalized = normalizeText(text);

  return keywords.some((keyword) => {
    return normalized.includes(normalizeText(keyword));
  });
};

const countKeywordHits = (text, keywords = []) => {
  const normalized = normalizeText(text);

  return keywords.reduce((count, keyword) => {
    return normalized.includes(normalizeText(keyword)) ? count + 1 : count;
  }, 0);
};

const uniq = (items = []) => {
  return Array.from(new Set(items.filter(Boolean)));
};

const calculateRiskLevel = (score) => {
  if (score >= 75) return "위험";
  if (score >= 45) return "주의";
  return "낮음";
};

const safeJsonText = (value) => {
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

const collectPossibleToxicClauses = (apiAnalysisResult) => {
  if (!apiAnalysisResult) return [];

  const candidates = [];

  const pushText = (value, source = "AI 독소조항") => {
    if (!value) return;

    if (typeof value === "string") {
      const trimmed = value.trim();

      if (trimmed) {
        candidates.push({
          source,
          text: trimmed,
        });
      }

      return;
    }

    if (typeof value === "object") {
      const possibleText =
        value.clause ||
        value.sentence ||
        value.text ||
        value.content ||
        value.description ||
        value.reason ||
        value.issue ||
        value.risk ||
        value.title ||
        "";

      if (possibleText) {
        candidates.push({
          source,
          text: String(possibleText).trim(),
        });
      }
    }
  };

  if (Array.isArray(apiAnalysisResult)) {
    apiAnalysisResult.forEach((item) => pushText(item));
  }

  if (typeof apiAnalysisResult === "object" && !Array.isArray(apiAnalysisResult)) {
    const possibleArrays = [
      apiAnalysisResult.toxicClauses,
      apiAnalysisResult.poisonClauses,
      apiAnalysisResult.riskyClauses,
      apiAnalysisResult.risks,
      apiAnalysisResult.clauses,
      apiAnalysisResult.issues,
      apiAnalysisResult.problems,
      apiAnalysisResult.detectedClauses,
    ];

    possibleArrays.forEach((array) => {
      if (Array.isArray(array)) {
        array.forEach((item) => pushText(item));
      }
    });

    pushText(apiAnalysisResult.analysis, "AI 분석");
    pushText(apiAnalysisResult.result, "AI 분석");
    pushText(apiAnalysisResult.message, "AI 분석");
    pushText(apiAnalysisResult.content, "AI 분석");
    pushText(apiAnalysisResult.text, "AI 분석");
  }

  if (typeof apiAnalysisResult === "string") {
    const lines = apiAnalysisResult
      .split(/\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    lines.forEach((line) => {
      const isLikelyToxicClauseLine =
        line.includes("독소") ||
        line.includes("위험") ||
        line.includes("주의") ||
        line.includes("불리") ||
        line.includes("조항") ||
        line.includes("검수") ||
        line.includes("지급") ||
        line.includes("수정") ||
        line.includes("저작권") ||
        line.includes("유지보수") ||
        line.includes("지체상금") ||
        line.includes("비밀유지");

      if (isLikelyToxicClauseLine) {
        pushText(line, "AI 독소조항");
      }
    });
  }

  return candidates;
};

const findContractEvidenceSentences = (sentences, rule) => {
  const exactKeywords = rule.keywords || [];
  const relatedKeywords = rule.relatedKeywords || [];

  const scoredSentences = sentences
    .map((sentence) => {
      const exactHitCount = countKeywordHits(sentence, exactKeywords);
      const relatedHitCount = countKeywordHits(sentence, relatedKeywords);

      const score = exactHitCount * 3 + relatedHitCount;

      return {
        source: "계약서 원문",
        text: sentence,
        exactHitCount,
        relatedHitCount,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scoredSentences.slice(0, 5);
};

const findToxicClauseEvidence = (apiAnalysisResult, rule) => {
  const toxicClauses = collectPossibleToxicClauses(apiAnalysisResult);

  const exactKeywords = rule.keywords || [];
  const relatedKeywords = rule.relatedKeywords || [];

  const scoredClauses = toxicClauses
    .map((item) => {
      const exactHitCount = countKeywordHits(item.text, exactKeywords);
      const relatedHitCount = countKeywordHits(item.text, relatedKeywords);

      const score = exactHitCount * 3 + relatedHitCount;

      return {
        source: item.source || "AI 독소조항",
        text: item.text,
        exactHitCount,
        relatedHitCount,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scoredClauses.slice(0, 5);
};

const findEvidence = (sentences, rule, apiAnalysisResult) => {
  const contractEvidence = findContractEvidenceSentences(sentences, rule);
  const toxicEvidence = findToxicClauseEvidence(apiAnalysisResult, rule);

  const merged = [...contractEvidence, ...toxicEvidence];

  const uniqueMap = new Map();

  merged.forEach((item) => {
    const key = normalizeText(item.text);

    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  });

  return Array.from(uniqueMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
};

const findMissingItems = (normalizedText, rule) => {
  return (rule.missingChecks || []).filter((check) => {
    const exists = includesAnyKeyword(normalizedText, check.requiredKeywords || []);
    return !exists;
  });
};

const calculateScore = (rule, evidenceItems, missingItems) => {
  if (!evidenceItems.length) {
    return 0;
  }

  const missingScore = missingItems.reduce((sum, item) => {
    return sum + Number(item.score || 0);
  }, 0);

  const evidenceBonus = Math.min(evidenceItems.length * 5, 15);

  return Math.min(Number(rule.baseScore || 0) + missingScore + evidenceBonus, 100);
};

export const analyzeContractRisk = (
  contractText,
  selectedScenarioIds = [],
  apiAnalysisResult = null
) => {
  const normalizedText = normalizeText(contractText);
  const sentences = splitSentences(contractText);

  const targetRules =
    selectedScenarioIds.length > 0
      ? riskRules.filter((rule) => selectedScenarioIds.includes(rule.id))
      : riskRules;

  const results = targetRules.map((rule) => {
    const evidenceItems = findEvidence(sentences, rule, apiAnalysisResult);
    const evidenceFound = evidenceItems.length > 0;

    const evidenceSentences = evidenceItems.map((item) => item.text);

    const missingItems = evidenceFound ? findMissingItems(normalizedText, rule) : [];
    const score = calculateScore(rule, evidenceItems, missingItems);
    const level = calculateRiskLevel(score);

    const hasContractEvidence = evidenceItems.some(
      (item) => item.source === "계약서 원문"
    );

    const hasToxicClauseEvidence = evidenceItems.some(
      (item) => item.source !== "계약서 원문"
    );

    return {
      id: rule.id,
      title: rule.title,
      scenario: rule.scenario,
      description: rule.description,
      score,
      level,
      evidenceFound,
      evidenceItems,
      evidenceSentences,
      hasContractEvidence,
      hasToxicClauseEvidence,
      missingItems,
      suggestion: evidenceFound ? rule.suggestion : "",
      status: evidenceFound ? "detected" : "not_detected",
      message: evidenceFound
        ? "계약서 원문 또는 AI 독소조항을 근거로 위험 여부를 점검했습니다."
        : "계약서 원문과 AI 독소조항 모두에서 직접 연결되는 근거를 찾지 못했습니다.",
    };
  });

  return results.sort((a, b) => {
    if (a.evidenceFound !== b.evidenceFound) {
      return a.evidenceFound ? -1 : 1;
    }

    return Number(b.score || 0) - Number(a.score || 0);
  });
};

export default analyzeContractRisk;
