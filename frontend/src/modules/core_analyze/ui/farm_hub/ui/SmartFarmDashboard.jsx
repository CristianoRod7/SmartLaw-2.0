import React from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Sprout,
  ChevronRight,
  FileText,
  BadgeAlert,
  Landmark,
  Wrench,
  ScanSearch,
  FileWarning,
  CheckCircle2,
} from 'lucide-react';

const SmartFarmDashboard = ({ onBack, onNavigateToAnalysis, onNavigateToSimulator }) => {
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

  const alerts = [
    {
      icon: <Landmark size={18} />,
      title: "농지 임대차 리스크",
      desc: "A지번 계약서에서 무단전대 해석 가능성이 있는 문구가 탐지되었습니다.",
      level: "위험",
    },
    {
      icon: <Wrench size={18} />,
      title: "시공 하자보수 조항 미흡",
      desc: "시설 유지보수 범위와 A/S 기간이 명확하지 않아 분쟁 위험이 있습니다.",
      level: "주의",
    },
    {
      icon: <BadgeAlert size={18} />,
      title: "보조금 환수 가능성 점검 필요",
      desc: "지원 조건과 실제 시설 사용 목적 간 일치 여부를 다시 확인해야 합니다.",
      level: "주의",
    },
  ];

  const quickActions = [
    {
      icon: <ScanSearch size={18} />,
      title: "시설 계약서 스캔",
      desc: "시공 계약, 설비 납품 계약 위험 분석",
      action: () => onNavigateToAnalysis("스마트팜 구축 계약"),
    },
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
      title: "스마트팜 종합 리스크 진단",
      desc: "계약 + 농지 + 보조금 전체 통합 분석",
      action: () => onNavigateToAnalysis("스마트팜 종합 분석"),
    },
    {
      
          icon: <FileText size={18} />,
          title: "스마트팜 리스크 시뮬레이터",
          desc: "현장 조건 + 계약서를 함께 반영한 미래 리스크 예측",
          action: () => onNavigateToSimulator(),

}
  ];

  return (
    <motion.div
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
              onClick={onBack}
              className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/15 hover:text-white"
            >
              <ArrowLeft size={16} />
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
          <div className="mb-6 flex items-center gap-3">
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

          <div className="space-y-3">
            {quickActions.map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="group flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-left transition hover:border-emerald-100 hover:bg-emerald-50"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-xl bg-white p-2 text-emerald-600 shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.desc}</div>
                  </div>
                </div>
                <ChevronRight className="text-slate-400 transition group-hover:text-emerald-600" size={18} />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2.3rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-2 text-red-500">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">주요 리스크 알림</h3>
              <p className="text-sm font-medium text-slate-500">
                지금 바로 확인해야 할 핵심 위험 요소
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span className="text-emerald-600">{alert.icon}</span>
                    {alert.title}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-black ${
                      alert.level === "위험"
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {alert.level}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-600">{alert.desc}</p>
              </div>
            ))}
          </div>
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
    </motion.div>
  );
};

export default SmartFarmDashboard;