import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  FileSearch,
  History,
  Search,
  ShieldAlert,
} from 'lucide-react';

const MotionDiv = motion.div;
const RECENT_ANALYSES_STORAGE_KEY = 'smartlaw_recent_analysis_results';

const MOCK_ANALYSES = [
  {
    id: 'mock-1',
    title: '스마트팜 시설 시공 계약서',
    contractType: '시설 계약',
    analyzedAt: '2026-05-11',
    riskScore: 90,
    dangerCount: 3,
    warningCount: 4,
    summary: '하자보수, 보조금 환수, 지연 책임 관련 리스크가 탐지되었습니다.',
    source: 'mock',
  },
  {
    id: 'mock-2',
    title: '농지 임대차 계약서',
    contractType: '농지 임대차',
    analyzedAt: '2026-05-10',
    riskScore: 72,
    dangerCount: 1,
    warningCount: 5,
    summary: '농지 목적 외 사용과 계약 해지 조건 관련 검토가 필요합니다.',
    source: 'mock',
  },
];

const getRiskLabel = (score) => {
  if (score >= 85) return '높음';
  if (score >= 65) return '주의';
  return '낮음';
};

const getRiskTone = (score) => {
  if (score >= 85) return 'border-red-100 bg-red-50 text-red-600';
  if (score >= 65) return 'border-amber-100 bg-amber-50 text-amber-700';
  return 'border-emerald-100 bg-emerald-50 text-emerald-700';
};

const normalizeHistoryItem = (item) => ({
  id: item.id,
  title: item.title || '계약서 분석 리포트',
  contractType: item.contractType || item.documentType || item.document_type || '계약서 분석',
  analyzedAt: item.analyzedAt || item.createdAt || new Date().toISOString().slice(0, 10),
  riskScore: Number.isFinite(Number(item.riskScore)) ? Number(item.riskScore) : 0,
  dangerCount: Number.isFinite(Number(item.dangerCount)) ? Number(item.dangerCount) : 0,
  warningCount: Number.isFinite(Number(item.warningCount)) ? Number(item.warningCount) : 0,
  summary: item.summary || '저장된 분석 리포트를 다시 확인할 수 있습니다.',
  reportData: item.reportData,
  source: item.source || 'localStorage',
});

const readLocalHistory = () => {
  try {
    const raw = window.localStorage.getItem(RECENT_ANALYSES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeHistoryItem) : [];
  } catch {
    return [];
  }
};

const AnalysisHistory = ({ onBack, onOpenReport }) => {
  const [localHistory] = useState(() => readLocalHistory());
  const [query, setQuery] = useState('');
  const [contractType, setContractType] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedSample, setSelectedSample] = useState(null);


  const historyItems = useMemo(() => {
    const localIds = new Set(localHistory.map((item) => item.id));
    return [
      ...localHistory,
      ...MOCK_ANALYSES.filter((item) => !localIds.has(item.id)).map(normalizeHistoryItem),
    ];
  }, [localHistory]);

  const contractTypes = useMemo(() => ['all', ...new Set(historyItems.map((item) => item.contractType))], [historyItems]);

  const filteredItems = useMemo(() => historyItems.filter((item) => {
    const lowerQuery = query.trim().toLowerCase();
    const matchesQuery = !lowerQuery || [item.title, item.contractType, item.summary].some((value) => value.toLowerCase().includes(lowerQuery));
    const matchesType = contractType === 'all' || item.contractType === contractType;
    const riskLabel = getRiskLabel(item.riskScore);
    const matchesRisk = riskFilter === 'all' || riskFilter === riskLabel;

    return matchesQuery && matchesType && matchesRisk;
  }), [contractType, historyItems, query, riskFilter]);

  const handleReportClick = (item) => {
    if (item.reportData) {
      onOpenReport?.(item);
      return;
    }
    setSelectedSample(item);
  };

  return (
    <MotionDiv
      key="analysis-history"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-auto w-full max-w-[1400px] space-y-8"
    >
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700"
      >
        <ArrowLeft size={15} /> Back Home
      </button>

      <section className="rounded-[3.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white shadow-xl shadow-slate-900/10 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
              <History size={14} /> Analysis Archive
            </div>
            <h2 className="break-keep text-4xl font-black leading-tight tracking-tighter lg:text-5xl">분석 히스토리</h2>
            <p className="break-keep text-base font-semibold leading-8 text-slate-300">
              이전 계약 분석 기록과 리포트를 검색합니다. 현재는 localStorage와 mock 데이터로 구성되어 있으며, 이후 PostgreSQL API 연동을 고려한 카드 데이터 구조를 사용합니다.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">Total</p>
              <p className="mt-1 text-2xl font-black">{historyItems.length}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">High</p>
              <p className="mt-1 text-2xl font-black">{historyItems.filter((item) => item.riskScore >= 85).length}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">Saved</p>
              <p className="mt-1 text-2xl font-black">{localHistory.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[3rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 lg:p-6">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px]">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-emerald-200 focus-within:bg-white">
            <Search size={18} className="text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="계약서 제목, 유형, 요약 검색"
              className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>

          <select
            value={contractType}
            onChange={(event) => setContractType(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-600 outline-none transition focus:border-emerald-200 focus:bg-white"
          >
            {contractTypes.map((type) => (
              <option key={type} value={type}>{type === 'all' ? '전체 계약 유형' : type}</option>
            ))}
          </select>

          <select
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-600 outline-none transition focus:border-emerald-200 focus:bg-white"
          >
            <option value="all">전체 위험도</option>
            <option value="높음">높음</option>
            <option value="주의">주의</option>
            <option value="낮음">낮음</option>
          </select>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {filteredItems.length > 0 ? filteredItems.map((item) => (
            <article key={item.id} className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 transition hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-lg hover:shadow-slate-200/50">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">{item.contractType}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black text-slate-500">
                      <CalendarDays size={13} /> {item.analyzedAt}
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-black ${getRiskTone(item.riskScore)}`}>
                      위험도 {item.riskScore} · {getRiskLabel(item.riskScore)}
                    </span>
                  </div>
                  <h3 className="break-keep text-xl font-black text-slate-950">{item.title}</h3>
                  <p className="break-keep text-sm font-semibold leading-7 text-slate-500">{item.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-black text-red-600">
                      <ShieldAlert size={14} /> 위험 {item.dangerCount}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700">
                      <AlertTriangle size={14} /> 주의 {item.warningCount}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleReportClick(item)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"
                >
                  {item.reportData ? '리포트 보기' : '샘플 리포트 보기'}
                  <FileSearch size={16} />
                </button>
              </div>
            </article>
          )) : (
            <div className="rounded-[2.5rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm shadow-slate-200/50">
              <History size={34} className="mx-auto text-slate-400" />
              <h3 className="mt-4 break-keep text-lg font-black text-slate-950">검색 결과가 없습니다</h3>
              <p className="mt-2 break-keep text-sm font-semibold leading-7 text-slate-500">검색어 또는 필터를 조정하면 분석 기록을 다시 확인할 수 있습니다.</p>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          {selectedSample ? (
            <div className="space-y-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-600/70">Sample report</p>
                <h3 className="mt-1 break-keep text-xl font-black text-slate-950">{selectedSample.title}</h3>
              </div>
              <p className="break-keep text-sm font-semibold leading-7 text-slate-500">{selectedSample.summary}</p>
              <div className="space-y-3 rounded-[2rem] bg-slate-50 p-4">
                <p className="text-xs font-black text-slate-900">샘플 상세</p>
                <p className="break-keep text-sm font-semibold leading-6 text-slate-500">
                  실제 DB/API 연결 전까지는 mock 상세 리포트를 표시합니다. 추후 `id`, `contractType`, `analyzedAt`, `riskScore` 기반으로 서버 상세 조회에 연결할 수 있습니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSample(null)}
                className="w-full rounded-2xl border border-slate-200 py-3 text-xs font-black uppercase tracking-widest text-slate-500 transition hover:border-emerald-200 hover:text-emerald-700"
              >
                닫기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-600/70">Report preview</p>
              <h3 className="break-keep text-xl font-black text-slate-950">리포트 보기 안내</h3>
              <p className="break-keep text-sm font-semibold leading-7 text-slate-500">
                localStorage에 저장된 실제 분석 결과는 기존 리포트 화면으로 열고, mock 항목은 이 영역에서 샘플 상세를 확인합니다.
              </p>
            </div>
          )}
        </aside>
      </section>
    </MotionDiv>
  );
};

export default AnalysisHistory;
