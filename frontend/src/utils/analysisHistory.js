export const ANALYSIS_HISTORY_STORAGE_KEY = 'nextlaw_analysis_history';
export const ANALYSIS_HISTORY_LIMIT = 20;

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getContractText = (data = {}) => (
  data.contractText ||
  data.contract_text ||
  data.extractedText ||
  data.extracted_text ||
  data.rawText ||
  data.raw_text ||
  data.text ||
  data.content ||
  data.documentText ||
  data.document_text ||
  data.originalText ||
  data.original_text ||
  data.fullText ||
  data.full_text ||
  ''
);

const getTitle = (data = {}, fallbackType = '') => (
  data.title ||
  data.fileName ||
  data.filename ||
  data.documentName ||
  data.document_name ||
  data.document_type ||
  data.documentType ||
  fallbackType ||
  '스마트팜 계약 분석 리포트'
);

const getContractType = (data = {}, fallbackType = '') => (
  data.contractType ||
  data.documentType ||
  data.document_type ||
  data.category ||
  fallbackType ||
  '계약서 분석'
);

const getSummary = (data = {}) => {
  const candidates = [data.summary, data.overview, data.description, data.resultSummary];
  const found = candidates.find((value) => typeof value === 'string' && value.trim());
  return found || '저장된 계약 분석 결과와 리스크 검토 내용을 다시 확인할 수 있습니다.';
};

const collectRiskItems = (data = {}) => [
  ...(Array.isArray(data.toxicClauses) ? data.toxicClauses : []),
  ...(Array.isArray(data.poisonClauses) ? data.poisonClauses : []),
  ...(Array.isArray(data.riskyClauses) ? data.riskyClauses : []),
  ...(Array.isArray(data.dangerClauses) ? data.dangerClauses : []),
  ...(Array.isArray(data.clauses) ? data.clauses : []),
  ...(Array.isArray(data.risks) ? data.risks : []),
  ...(Array.isArray(data.issues) ? data.issues : []),
  ...(Array.isArray(data.items) ? data.items : []),
  ...(Array.isArray(data.sections) ? data.sections.flatMap((section) => Array.isArray(section.items) ? section.items : []) : []),
];

const countByRiskLevel = (data, matcher) => collectRiskItems(data).filter((item) => {
  const level = String(item?.riskLevel || item?.status || item?.severity || item?.level || item?.grade || '').toLowerCase();
  return matcher(level);
}).length;

const calculateRiskScore = (data = {}) => {
  const explicitScore = data.riskScore ?? data.risk_score ?? data.score ?? data.summary?.averageScore ?? data.summaryScore;
  if (Number.isFinite(Number(explicitScore))) return Number(explicitScore);

  const dangerCount = countByRiskLevel(data, (level) => level.includes('danger') || level.includes('high') || level.includes('critical') || level.includes('위험'));
  const warningCount = countByRiskLevel(data, (level) => level.includes('warning') || level.includes('medium') || level.includes('주의'));
  return Math.min(100, dangerCount * 25 + warningCount * 10);
};

const normalizeRecord = (record = {}) => {
  const apiAnalysisResult = record.apiAnalysisResult || record.reportJson || record.reportData || record;
  const contractText = record.contractText || getContractText(apiAnalysisResult);

  return {
    id: String(record.id || apiAnalysisResult?.id || `analysis-${Date.now()}`),
    title: record.title || getTitle(apiAnalysisResult, record.contractType),
    contractType: record.contractType || getContractType(apiAnalysisResult),
    analyzedAt: record.analyzedAt || new Date().toISOString(),
    riskScore: safeNumber(record.riskScore, calculateRiskScore(apiAnalysisResult)),
    dangerCount: safeNumber(record.dangerCount, countByRiskLevel(apiAnalysisResult, (level) => level.includes('danger') || level.includes('high') || level.includes('critical') || level.includes('위험'))),
    warningCount: safeNumber(record.warningCount, countByRiskLevel(apiAnalysisResult, (level) => level.includes('warning') || level.includes('medium') || level.includes('주의'))),
    summary: record.summary || getSummary(apiAnalysisResult),
    contractText,
    apiAnalysisResult,
    reportJson: record.reportJson || apiAnalysisResult,
  };
};

export const getAnalysisHistory = () => {
  if (typeof window === 'undefined') return [];
  const parsed = safeParse(window.localStorage.getItem(ANALYSIS_HISTORY_STORAGE_KEY), []);
  return Array.isArray(parsed) ? parsed.map(normalizeRecord) : [];
};

export const saveAnalysisHistoryRecord = (record) => {
  if (typeof window === 'undefined') return null;

  const normalized = normalizeRecord(record);
  const current = getAnalysisHistory();
  const deduped = current.filter((item) => item.id !== normalized.id);
  const next = [normalized, ...deduped].slice(0, ANALYSIS_HISTORY_LIMIT);
  window.localStorage.setItem(ANALYSIS_HISTORY_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('analysisHistoryUpdated'));
  return normalized;
};

export const buildAnalysisHistoryRecord = (apiAnalysisResult, fallbackType = '') => normalizeRecord({
  id: apiAnalysisResult?.id || `analysis-${Date.now()}`,
  title: getTitle(apiAnalysisResult, fallbackType),
  contractType: getContractType(apiAnalysisResult, fallbackType),
  analyzedAt: new Date().toISOString(),
  contractText: getContractText(apiAnalysisResult),
  apiAnalysisResult,
  reportJson: apiAnalysisResult,
});

export const getAnalysisHistoryRecord = (id) => getAnalysisHistory().find((item) => item.id === String(id)) || null;

export const deleteAnalysisHistoryRecord = (id) => {
  if (typeof window === 'undefined') return [];
  const next = getAnalysisHistory().filter((item) => item.id !== String(id));
  window.localStorage.setItem(ANALYSIS_HISTORY_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('analysisHistoryUpdated'));
  return next;
};

export const clearAnalysisHistory = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ANALYSIS_HISTORY_STORAGE_KEY);
  window.dispatchEvent(new Event('analysisHistoryUpdated'));
};

export const toReportData = (record) => {
  if (!record) return null;
  return {
    ...record.apiAnalysisResult,
    title: record.title,
    document_type: record.contractType,
    contractText: record.contractText,
    contract_text: record.contractText,
    riskScore: record.riskScore,
    dangerCount: record.dangerCount,
    warningCount: record.warningCount,
    summary: record.summary,
  };
};
