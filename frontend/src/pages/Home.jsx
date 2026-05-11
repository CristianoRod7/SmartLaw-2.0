import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Leaf,
  Scale,
  ArrowUpRight,
  Sparkles,
  History,
  Bot,
  SendHorizontal,
  ShieldQuestion,
} from 'lucide-react';

const MotionDiv = motion.div;

const CONSULTATION_CHIPS = [
  '보조금 환수 위험',
  '농지 임대차 검토',
  '시공사 유지보수',
  '계약 해지 조건',
];

const AiRiskConsultCard = () => (
  <div className="flex min-h-[420px] flex-col justify-between rounded-[3.5rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50">
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-600/70">AI Risk Router</p>
          <h4 className="mt-1 break-keep text-2xl font-black tracking-tight text-slate-950">AI 리스크 상담</h4>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner shadow-emerald-100/60">
          <Bot size={22} />
        </div>
      </div>

      <p className="break-keep text-sm font-semibold leading-7 text-slate-500">
        계약 상황을 입력하면 필요한 분석 기능과 검토 방향을 추천합니다.
      </p>

      <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-3 transition-colors focus-within:border-emerald-200 focus-within:bg-white">
        <textarea
          rows={4}
          placeholder="예: 시공사가 하자보수 책임을 계약서에 명확히 적지 않았어요."
          className="min-h-[120px] w-full resize-none bg-transparent px-2 py-2 text-sm font-semibold leading-7 text-slate-800 outline-none placeholder:break-keep placeholder:text-slate-400"
        />
      </div>

      <div className="space-y-3">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">추천 질문</p>
        <div className="flex flex-wrap gap-2">
          {CONSULTATION_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className="rounded-full border border-emerald-100 bg-emerald-50/70 px-3.5 py-2 text-xs font-black text-emerald-700 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>

    <button
      type="button"
      className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-900/10"
    >
      상담 시작
      <SendHorizontal size={16} />
    </button>
  </div>
);

const Home = ({ onNavigate }) => {
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
      id: 'history',
      title: '분석 히스토리',
      desc: '이전 계약 분석 기록과 리포트 검색',
      icon: <History size={32} />,
      color: 'bg-slate-100 text-slate-700',
      active: false,
      badge: 'HISTORY',
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
            whileHover={{ y: -6, shadow: '0 18px 35px -28px rgb(15 23 42 / 0.45)' }}
            onClick={() => item.active && onNavigate(item.id)}
            className={`group relative rounded-[3rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/40 transition-all ${item.active ? 'cursor-pointer hover:border-emerald-100' : 'cursor-default'}`}
          >
            <div className={`mb-10 flex h-16 w-16 items-center justify-center rounded-2xl ${item.color} shadow-sm transition-transform group-hover:scale-105`}>
              {item.icon}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <h3 className="break-keep text-xl font-black text-slate-900">{item.title}</h3>
                <ArrowUpRight size={20} className={`shrink-0 transition-colors ${item.active ? 'text-slate-300 group-hover:text-emerald-600' : 'text-slate-300'}`} />
              </div>
              <p className="break-keep text-sm font-bold leading-relaxed text-slate-500">{item.desc}</p>
            </div>
            {item.badge && (
              <span className="absolute right-8 top-6 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                {item.badge}
              </span>
            )}
          </MotionDiv>
        ))}
      </section>

      {/* 🚀 하단 인사이트 섹션 (스마트팜 정책·뉴스 크롤링 진입점 유지) */}
      <section className="grid grid-cols-1 gap-8 px-2 lg:grid-cols-3">
        <div className="group relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-10 text-white shadow-xl shadow-slate-900/10 lg:col-span-2 lg:p-12">
          <div className="relative z-10 max-w-2xl space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
              <ShieldQuestion size={14} /> Crawling Intelligence
            </div>
            <div className="space-y-4">
              <h3 className="break-keep text-4xl font-black leading-tight tracking-tighter lg:text-5xl">
                스마트팜 정책과 이슈를 <span className="text-emerald-300">한눈에</span> 확인하세요
              </h3>
              <p className="max-w-xl break-keep text-base font-semibold leading-7 text-slate-300 lg:text-lg lg:leading-8">
                보조금, 농지 임대차, 스마트팜 구축과 관련된 정책·뉴스를 빠르게 확인할 수 있습니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => onNavigate('recommend')}
                className="rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/20 transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                정책·이슈 확인하기
              </button>
              <span className="break-keep text-xs font-bold leading-6 text-slate-400">
                최신 정책 흐름을 확인한 뒤 계약 분석과 리스크 상담으로 이어갈 수 있습니다.
              </span>
            </div>
          </div>
          <div className="pointer-events-none absolute right-[-4%] top-1/2 -translate-y-1/2 rotate-12 opacity-10 transition-transform duration-1000 group-hover:rotate-6">
            <Leaf size={390} />
          </div>
          <div className="pointer-events-none absolute bottom-8 right-10 hidden rounded-[2rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm xl:block">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">Next Step</p>
            <p className="mt-1 break-keep text-sm font-bold text-white/80">정책 확인 → 계약 분석 → 리스크 상담</p>
          </div>
        </div>

        <AiRiskConsultCard />
      </section>
    </MotionDiv>
  );
};

export default Home;
