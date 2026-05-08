import { reverseRiskRules } from './riskRules.js';

const MAX_EVIDENCE_SENTENCES = 3;

export function normalizeContractText(text = '') {
  return String(text || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

export function splitContractSentences(text = '') {
  const normalized = normalizeContractText(text);

  if (!normalized) return [];

  return normalized
    .split(/(?<=[.!?。！？다)])\s+|\n+|(?=제\s*\d+\s*조)|(?=\d+\.)/g)
    .map((sentence) => sentence.replace(/^\s*[-•]\s*/, '').trim())
    .filter((sentence) => sentence.length >= 6);
}

function includesAny(normalizedText, terms = []) {
  return terms.some((term) => normalizedText.includes(normalizeContractText(term).toLowerCase()));
}

function findKeywordMatches(sentences, keywords) {
  const matches = [];
  const matchedKeywords = new Set();

  sentences.forEach((sentence) => {
    const normalizedSentence = sentence.toLowerCase();
    const sentenceKeywords = keywords.filter((keyword) =>
      normalizedSentence.includes(normalizeContractText(keyword).toLowerCase())
    );

    if (sentenceKeywords.length > 0) {
      sentenceKeywords.forEach((keyword) => matchedKeywords.add(keyword));
      matches.push({ sentence, keywords: sentenceKeywords });
    }
  });

  return {
    evidenceSentences: matches.slice(0, MAX_EVIDENCE_SENTENCES).map((match) => match.sentence),
    matchedKeywords: Array.from(matchedKeywords),
  };
}

function getMissingItems(rule, normalizedText) {
  return rule.missingChecks
    .filter((check) => !includesAny(normalizedText, check.requiredAny))
    .map((check) => ({
      label: check.label,
      score: check.score,
      requiredAny: check.requiredAny,
    }));
}

export function getRiskLevel(score) {
  if (score >= 75) return '위험';
  if (score >= 45) return '주의';
  return '낮음';
}

function getConfidenceStatus(rule, apiAnalysisResult, score) {
  const analysisText = normalizeContractText(JSON.stringify(apiAnalysisResult || {})).toLowerCase();

  if (!analysisText) {
    return {
      status: 'not_compared',
      label: '규칙 엔진 단독 점검',
      description: 'AI 분석 결과가 없거나 비교 가능한 텍스트가 없어 규칙 엔진 결과만 표시합니다.',
    };
  }

  const mentionedByApi = [rule.title, rule.scenario, ...rule.keywords]
    .filter(Boolean)
    .some((term) => analysisText.includes(normalizeContractText(term).toLowerCase()));

  if (mentionedByApi && score >= 45) {
    return {
      status: 'high_confidence',
      label: '신뢰도 높음',
      description: 'AI 분석과 역방향 규칙 엔진이 모두 유사한 위험을 포착했습니다.',
    };
  }

  if (!mentionedByApi && score >= 45) {
    return {
      status: 'needs_review',
      label: '추가 확인 필요',
      description: 'AI 분석에는 직접 언급되지 않았지만 규칙 엔진에서 피해 시나리오가 탐지되었습니다.',
    };
  }

  if (mentionedByApi && score < 45) {
    return {
      status: 'context_review',
      label: '문맥 확인 필요',
      description: 'AI 분석에는 언급되었지만 규칙 점수는 낮습니다. 실제 문맥상 위험인지 확인하세요.',
    };
  }

  return {
    status: 'low_signal',
    label: '낮은 신호',
    description: 'AI 분석과 규칙 엔진 모두 강한 위험 신호를 찾지 못했습니다.',
  };
}

export function analyzeReverseRisk(contractText, apiAnalysisResult = null) {
  const normalizedText = normalizeContractText(contractText);
  const normalizedTextLower = normalizedText.toLowerCase();
  const sentences = splitContractSentences(normalizedText);

  const results = reverseRiskRules.map((rule) => {
    const { evidenceSentences, matchedKeywords } = findKeywordMatches(sentences, rule.keywords);
    const missingItems = getMissingItems(rule, normalizedTextLower);
    const hasKeywordEvidence = matchedKeywords.length > 0;
    const keywordScore = Math.min(30, matchedKeywords.length * 8);
    const missingScore = missingItems.reduce((sum, item) => sum + item.score, 0);
    const baseScore = hasKeywordEvidence ? rule.baseScore : 10;
    const missingContribution = hasKeywordEvidence
      ? missingScore
      : Math.min(35, Math.round(missingScore * 0.35));
    const score = Math.min(100, Math.max(0, baseScore + keywordScore + missingContribution));
    const level = getRiskLevel(score);

    return {
      id: rule.id,
      title: rule.title,
      scenario: rule.scenario,
      description: rule.description,
      score,
      level,
      evidenceSentences,
      matchedKeywords,
      missingItems,
      suggestion: rule.suggestion,
      confidence: getConfidenceStatus(rule, apiAnalysisResult, score),
    };
  });

  const averageScore = results.length
    ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
    : 0;

  return {
    engine: 'reverseRisk',
    version: '1.0.0',
    analyzedAt: new Date().toISOString(),
    source: 'client-rule-engine',
    summary: {
      averageScore,
      level: getRiskLevel(averageScore),
      totalRules: results.length,
      highRiskCount: results.filter((result) => result.level === '위험').length,
      cautionCount: results.filter((result) => result.level === '주의').length,
    },
    results,
  };
}
