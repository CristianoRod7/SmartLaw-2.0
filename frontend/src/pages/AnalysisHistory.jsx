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
  Trash2,
} from 'lucide-react';
import {
  deleteAnalysisHistoryRecord,
  getAnalysisHistory,
} from '../utils/analysisHistory';

const MotionDiv = motion.div;

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

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toISOString().slice(0, 10);
};

const AnalysisHistory = ({ onBack, onOpenReport }) => {
  const [historyItems, setHistoryItems] = useState(() => getAnalysisHistory());
  const [query, setQuery] = useState('');
  const [contractType, setContractType] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  const contractTypes = useMemo(() => ['all', ...new Set(historyItems.map((item) => item.contractType))], [historyItems]);

  const filteredItems = useMemo(() => historyItems.filter((item) => {
    const lowerQuery = query.trim().toLowerCase();
    const matchesQuery = !lowerQuery || [item.title, item.contractType, item.summary].some((value) => String(value || '').toLowerCase().includes(lowerQuery));
    const matchesType = contractType === 'all' || item.contractType === contractType;
    const riskLabel = getRiskLabel(item.riskScore);
    const matchesRisk = riskFilter === 'all' || riskFilter === riskLabel;

    return matchesQuery && matchesType && matchesRisk;
  }), [contractType, historyItems, query, riskFilter]);

  const handleDelete = (event, id) => {
    event.stopPropagation();
    setHistoryItems(deleteAnalysisHistoryRecord(id));
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
              <History size={14} /> Local Analysis Archive
            </div>
            <h2 className="break-keep text-4xl font-black leading-tight tracking-tighter lg:text-5xl">분석 히스토리</h2>
            <p className="break-keep text-base font-semibold leading-8 text-slate-300">
              이전 계약 분석 기록과 리포트를 검색합니다. 현재는 localStorage에 저장된 실제 분석 결과만 표시하며, 이후 PostgreSQL API로 교체하기 쉬운 데이터 구조를 사용합니다.
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
              <p className="mt-1 text-2xl font-black">{historyItems.length}</p>
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

      <section className="space-y-4">
        {filteredItems.length > 0 ? filteredItems.map((item) => (
          <article
            key={item.id}
            onClick={() => onOpenReport?.(item.id)}
            className="cursor-pointer rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 transition hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-lg hover:shadow-slate-200/50"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">{item.contractType}</span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black text-slate-500">
                    <CalendarDays size={13} /> {formatDate(item.analyzedAt)}
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

              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenReport?.(item.id);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"
                >
                  리포트 보기
                  <FileSearch size={16} />
                </button>
                <button
                  type="button"
                  onClick={(event) => handleDelete(event, item.id)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                  aria-label="분석 기록 삭제"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </article>
        )) : (
          <div className="rounded-[2.5rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm shadow-slate-200/50">
            <History size={34} className="mx-auto text-slate-400" />
            <h3 className="mt-4 break-keep text-lg font-black text-slate-950">저장된 분석 기록이 없습니다</h3>
            <p className="mt-2 break-keep text-sm font-semibold leading-7 text-slate-500">
              계약서 분석을 완료하면 localStorage에 저장된 리포트가 이곳에 표시됩니다.
            </p>
          </div>
        )}
      </section>
    </MotionDiv>
  );
};

export default AnalysisHistory;
