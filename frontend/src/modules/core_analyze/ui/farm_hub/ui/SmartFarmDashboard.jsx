import React from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  ShieldCheck,
  ArrowLeft,
  Sprout,
  ChevronRight,
  FileText,
  Landmark,
  ScanSearch,
  FileWarning,
  CheckCircle2,
} from 'lucide-react';

const MotionDiv = motion.div;

const getSafeBackHandler = (fallback) => () => {
  const canNavigateBack = typeof window !== 'undefined' && Number(window.history?.state?.idx || 0) > 0;

  if (canNavigateBack) {
    window.history.back();
    return;
  }

  fallback?.();
};

const SmartFarmDashboard = ({ onBack, onNavigateToAnalysis, onNavigateToSimulator }) => {
  const handleBack = getSafeBackHandler(onBack);
  const contracts = [
    {
      name: "비닐온실(스마트팜) 시공 계약",
      company: "(주)그린테크",
      status: "하자보수(A/S) 진행중",
      risk: "안전",
      date: "2024.10.15",
    },
    {
      name: "농지 임대차 계약 (5년)",
      company: "마을 이장님",
      status: "계약 검토 필요",
      risk: "위험",
      date: "2024.11.02",
    },
  ];

  const preContractChecklist = [
    "하자보수 기간이 명시되어 있나요?",
    "보조금 환수 조건이 포함되어 있나요?",
    "농지 사용 목적 제한이 적혀 있나요?",
    "계약 해지 조건이 일방적이지 않나요?",
    "지체상금 기준이 과도하지 않나요?",
  ];

  const primaryActions = [
    {
      icon: <ScanSearch size={18} />,
      title: "시설 계약서 스캔",
      desc: "시공 계약, 설비 납품 계약 위험 분석",
      action: () => onNavigateToAnalysis("스마트팜 구축 계약"),
    },
    {
      icon: <FileText size={18} />,
      title: "스마트팜 종합 리스크 진단",
      desc: "계약 + 농지 + 보조금 전체 통합 분석",
      action: () => onNavigateToAnalysis("스마트팜 종합 분석"),
    },
  ];

  const supportActions = [
    {
      icon: <FileWarning size={18} />,
      title: "농지 임대차 검토",
      desc: "농지법 위반 가능성 및 임대차 리스크 확인",
      action: () => onNavigateToAnalysis("농지 임대차 계약"),
    },
    {
      icon: <ShieldCheck size={18} />,
      title: "보조금 리스크 점검",
      desc: "지원금 환수 및 제출 요건 누락 여부 확인",
      action: () => onNavigateToAnalysis("보조금 관련 문서"),
    },
    {
      icon: <FileText size={18} />,
      title: "스마트팜 리스크 시뮬레이터",
      desc: "현장 조건 + 계약서를 함께 반영한 미래 리스크 예측",
      action: () => onNavigateToSimulator(),
    },
  ];

  const actionCardClass = "group flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-left transition hover:border-emerald-100 hover:bg-emerald-50";

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full pb-20 space-y-8 font-sans"
    >
      <header className="relative overflow-hidden rounded-[2.5rem] border border-emerald-200/40 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 md:p-10 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.20),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_25%)]" />
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <Leaf size={360} />
        </div>

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-5">
            <button
              onClick={handleBack}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black text-slate-200 transition hover:bg-white/15 hover:text-white"
            >
              <ArrowLeft size={15} />
              Hub 홈으로
            </button>

            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-500/90 p-3 shadow-lg shadow-emerald-500/20">
                <Sprout size={30} className="text-white" />
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                  Smart Agriculture Vertical
                </div>

                <h2 className="text-3xl font-black tracking-tight md:text-5xl">
                  Smart Farm Hub
                </h2>

                <p className="max-w-2xl break-keep text-base font-medium leading-7 text-slate-300 md:text-lg">
                  농지법 검토부터 보조금 환수 방어, 시공사 분쟁 예방까지.
                  청년 창업농을 위한 계약 리스크 관리 허브입니다.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:w-[420px]">
            <button
              onClick={() => onNavigateToAnalysis("스마트팜 구축 계약")}
              className="flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-emerald-600/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
            >
              <ShieldCheck size={20} />
              시설 계약서 스캔
            </button>

            <button
              onClick={() => onNavigateToAnalysis("농지 임대차 계약")}
              className="flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-base font-black text-white transition hover:bg-white/15"
            >
              <Landmark size={20} />
              농지 계약 검토
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2.3rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">빠른 실행</h3>
                <p className="text-sm font-medium text-slate-500">
                  자주 사용하는 스마트팜 전용 작업
                </p>
              </div>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500">
              분석 기능 · 보조 도구
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-emerald-600">주요 분석 기능</p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                {primaryActions.map((item) => (
                  <button
                    key={item.title}
                    onClick={item.action}
                    className={actionCardClass}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl bg-white p-2 text-emerald-600 shadow-sm">
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{item.title}</div>
                        <div className="mt-1 break-keep text-sm font-medium leading-5 text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="shrink-0 text-slate-400 transition group-hover:text-emerald-600" size={18} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">보조 도구</p>
              <div className="space-y-3">
                {supportActions.map((item) => (
                  <button
                    key={item.title}
                    onClick={item.action}
                    className={actionCardClass}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl bg-white p-2 text-emerald-600 shadow-sm">
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="mt-1 break-keep text-sm font-medium leading-5 text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="shrink-0 text-slate-400 transition group-hover:text-emerald-600" size={18} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2.3rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">계약 전 체크리스트</h3>
              <p className="text-sm font-medium text-slate-500">
                분석 전에 빠르게 확인할 핵심 조항
              </p>
            </div>
          </div>

          <ul className="space-y-3">
            {preContractChecklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <span className="mt-0.5 rounded-full bg-emerald-100 p-1 text-emerald-600">
                  <CheckCircle2 size={15} />
                </span>
                <span className="break-keep text-sm font-bold leading-6 text-slate-700">{item}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => onNavigateToAnalysis("스마트팜 종합 분석")}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            종합 진단 시작
            <ChevronRight size={17} />
          </button>
        </div>
      </section>

      <section className="rounded-[2.3rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              최근 시설/시공 계약 현황
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              최근 등록된 계약과 현재 리스크 상태를 빠르게 확인합니다.
            </p>
          </div>

          <button
            onClick={() => onNavigateToAnalysis("스마트팜 구축 계약")}
            className="flex items-center gap-1 text-sm font-bold text-emerald-600 transition hover:text-emerald-800"
          >
            새 계약서 등록
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {contracts.map((item, i) => (
            <div
              key={i}
              className="group flex cursor-pointer flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5 transition hover:border-emerald-100 hover:bg-white hover:shadow-md md:flex-nowrap"
            >
              <div className="flex items-center gap-5">
                <div
                  className={`h-14 w-2 rounded-full ${
                    item.risk === "위험" ? "bg-red-500" : "bg-emerald-500"
                  }`}
                />
                <div>
                  <h4 className="text-lg font-bold text-slate-900 transition group-hover:text-emerald-600">
                    {item.name}
                  </h4>
                  <p className="text-sm font-medium text-slate-500">
                    {item.company} | {item.date}
                  </p>
                </div>
              </div>

              <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end">
                <div className="text-right">
                  <p
                    className={`text-sm font-black ${
                      item.risk === "위험" ? "text-red-500" : "text-slate-800"
                    }`}
                  >
                    {item.status}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {item.risk === "위험" ? "법률 검토 우선" : "정상 관리 중"}
                  </p>
                </div>

                <div className="rounded-full bg-white p-2 text-slate-400 shadow-sm transition group-hover:text-emerald-600">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MotionDiv>
  );
};

export default SmartFarmDashboard;
