import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Leaf,
  Scale,
  BarChart3,
  ArrowUpRight,
  TrendingUp,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const RECENT_ANALYSES_STORAGE_KEY = 'smartlaw_recent_analysis_results';
const MotionDiv = motion.div;

const getRiskTone = (score = 0) => {
  if (score >= 80) return 'border-red-100 bg-red-50 text-red-600';
  if (score >= 60) return 'border-amber-100 bg-amber-50 text-amber-700';
  return 'border-emerald-100 bg-emerald-50 text-emerald-700';
};

const readRecentAnalyses = () => {
  try {
    const raw = window.localStorage.getItem(RECENT_ANALYSES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
  } catch {
    return [];
  }
};

const RecentAnalysisCard = ({ item, onOpen }) => (
  <button
    type="button"
    onClick={() => onOpen?.(item)}
    className="group w-full rounded-[24px] border border-slate-200 bg-white px-4 py-4 text-left shadow-sm shadow-slate-200/50 transition-all duration-200 hover:-translate-y-[1px] hover:border-emerald-200 hover:shadow-[0_16px_38px_-30px_rgba(15,23,42,0.55)]"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-600/70">{item.contractType || '계약서 분석'}</p>
        <h5 className="mt-1 line-clamp-1 break-keep text-sm font-black text-slate-950">{item.title}</h5>
      </div>
      <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-black ${getRiskTone(item.riskScore)}`}>
        {item.riskScore}점
      </span>
    </div>

    <p className="mt-2 line-clamp-2 break-keep text-xs font-semibold leading-5 text-slate-500">{item.summary}</p>

    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-black text-slate-500">{item.analyzedAt}</span>
      <span className="rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-[10px] font-black text-red-600">위험 {item.dangerCount}</span>
      <span className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700">주의 {item.warningCount}</span>
    </div>

    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-black text-slate-500">
      <span>리포트 보기</span>
      <ChevronRight size={15} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" />
    </div>
  </button>
);

const RecentAnalysisPanel = ({ onOpenRecentReport }) => {
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  useEffect(() => {
    const syncRecentAnalyses = () => setRecentAnalyses(readRecentAnalyses());

    syncRecentAnalyses();
    window.addEventListener('storage', syncRecentAnalyses);
    window.addEventListener('recentAnalysesUpdated', syncRecentAnalyses);

    return () => {
      window.removeEventListener('storage', syncRecentAnalyses);
      window.removeEventListener('recentAnalysesUpdated', syncRecentAnalyses);
    };
  }, []);

  const hasRecentAnalyses = recentAnalyses.length > 0;

  return (
    <div className="flex min-h-[420px] flex-col justify-between rounded-[3.5rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-600/70">Recent Reports</p>
            <h4 className="mt-1 break-keep text-xl font-black text-slate-900">최근 분석 결과</h4>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <TrendingUp size={20} />
          </div>
        </div>

        {hasRecentAnalyses ? (
          <div className="space-y-3">
            {recentAnalyses.map((item) => (
              <RecentAnalysisCard key={item.id} item={item} onOpen={onOpenRecentReport} />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 px-5 py-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
              <BarChart3 size={22} />
            </div>
            <h5 className="break-keep text-base font-black text-slate-900">아직 분석 기록이 없습니다</h5>
            <p className="mt-2 break-keep text-sm font-semibold leading-6 text-slate-500">
              계약서를 분석하면 최근 리포트가 최대 3개까지 이곳에 표시됩니다.
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onOpenRecentReport?.(recentAnalyses[0])}
        disabled={!hasRecentAnalyses}
        className="mt-6 w-full rounded-2xl bg-slate-950 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      >
        {hasRecentAnalyses ? 'Open Latest Report' : 'No Reports Yet'}
      </button>
    </div>
  );
};

const Home = ({ onNavigate, onOpenRecentReport }) => {
  // 대시보드 메뉴 아이템 정의 (스마트팜을 가장 먼저 배치)
  const menuItems = useMemo(() => [
    {
      id: 'farm',
      title: '스마트팜 허브',
      desc: '농지법 검토 및 보조금 리스크 스캔',
      icon: <Leaf size={32} />,
      color: 'bg-emerald-50 text-emerald-600',
      active: true,
    },
    {
      id: 'it',
      title: 'IT 외주 가디언',
      desc: 'SOW 확정 및 IP 분쟁 방지',
      icon: <Cpu size={32} />,
      color: 'bg-purple-50 text-purple-600',
      active: true,
    },
    {
      id: 'legal',
      title: '법률 라이브러리',
      desc: '7대 필수 서류 양식 무상 제공',
      icon: <Scale size={32} />,
      color: 'bg-blue-50 text-blue-600',
      active: true,
    },
    {
      id: 'biz',
      title: '비즈니스 지표',
      desc: '계약 리스크 통합 관리 대시보드',
      icon: <BarChart3 size={32} />,
      color: 'bg-slate-50 text-slate-600',
      active: false,
    },
  ], []);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-auto w-full max-w-[1600px] space-y-12"
    >
      {/* 🚀 상단 환영 섹션 */}
      <section className="space-y-4 px-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-600">
          <Sparkles size={14} /> Smart Farm Priority Mode
        </div>
        <h2 className="text-5xl font-black leading-[1.1] tracking-tighter text-slate-900">
          NextLaw Hub <br />
          <span className="text-slate-400">Safe Business Infrastructure.</span>
        </h2>
      </section>

      {/* 🚀 버티컬 모듈 카드 그리드 */}
      <section className="grid grid-cols-1 gap-6 px-2 md:grid-cols-2 xl:grid-cols-4">
        {menuItems.map((item) => (
          <MotionDiv
            key={item.id}
            whileHover={{ y: -8, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
            onClick={() => item.active && onNavigate(item.id)}
            className={`group relative cursor-pointer rounded-[3rem] border border-slate-200 bg-white p-8 transition-all ${!item.active && 'cursor-not-allowed opacity-60'}`}
          >
            <div className={`mb-10 flex h-16 w-16 items-center justify-center rounded-2xl ${item.color} shadow-sm transition-transform group-hover:scale-110`}>
              {item.icon}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <ArrowUpRight size={20} className="text-slate-300 transition-colors group-hover:text-emerald-600" />
              </div>
              <p className="break-keep text-sm font-bold leading-relaxed text-slate-500">{item.desc}</p>
            </div>
            {!item.active && (
              <span className="absolute right-8 top-6 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase text-amber-600">Wait</span>
            )}
          </MotionDiv>
        ))}
      </section>

      {/* 🚀 하단 인사이트 섹션 (스마트팜 집중 노출) */}
      <section className="grid grid-cols-1 gap-8 px-2 lg:grid-cols-3">
        <div className="group relative overflow-hidden rounded-[3.5rem] bg-slate-900 p-12 text-white lg:col-span-2">
          <div className="relative z-10 space-y-6">
            <span className="text-xs font-black uppercase italic tracking-widest text-emerald-400">Smart Farm Intelligence</span>
            <h3 className="text-4xl font-black italic leading-tight tracking-tighter">
              "스마트팜 관련 <br />
              <span className="text-emerald-400 underline decoration-emerald-400/30 underline-offset-8">정책과 이슈</span>를 한눈에 확인하세요."
            </h3>
            <p className="max-w-xl break-keep text-lg font-medium text-slate-400">
              보조금, 농지 임대차, 스마트팜 구축과 관련된 주요 내용을 쉽고 빠르게 확인할 수 있습니다.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('recommend')}
              className="rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-black shadow-lg shadow-emerald-900/20 transition-all hover:bg-white hover:text-slate-900"
            >
              정책 확인하기
            </button>
          </div>
          <div className="pointer-events-none absolute right-[-5%] top-1/2 -translate-y-1/2 rotate-12 opacity-10 transition-transform duration-1000 group-hover:rotate-0">
            <Leaf size={400} />
          </div>
        </div>

        <RecentAnalysisPanel onOpenRecentReport={onOpenRecentReport} />
      </section>
    </MotionDiv>
  );
};

export default Home;
