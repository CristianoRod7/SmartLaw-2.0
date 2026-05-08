import React from 'react';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code,
  FileCode2,
  GitBranch,
  HandCoins,
  Laptop,
  LockKeyhole,
  Milestone,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  TimerReset,
} from 'lucide-react';

const quickActions = [
  {
    title: 'IT 외주 계약서 스캔',
    desc: 'SOW, 검수, 대금, 지체상금, IP 이전 조건을 한 번에 점검합니다.',
    icon: <ShieldCheck size={20} />,
    actionType: 'IT 외주 계약서',
    primary: true,
  },
  {
    title: '용역/프리랜서 계약 검토',
    desc: '프리랜서에게 불리한 무제한 수정·포괄 양도 조항을 찾습니다.',
    icon: <FileCode2 size={20} />,
    actionType: '용역/프리랜서 계약서',
  },
  {
    title: 'NDA 비밀유지 점검',
    desc: '영업비밀 범위, 예외 사유, 존속기간, 위약벌 과다 여부를 확인합니다.',
    icon: <LockKeyhole size={20} />,
    actionType: '비밀유지 계약서(NDA)',
  },
];

const riskCards = [
  {
    title: '미수금 위험',
    desc: '검수 지연이나 주관적 만족 조건으로 잔금 지급이 무기한 밀릴 수 있습니다.',
    clause: '대금 지급 / 검수 완료 / 미통지 승인 간주',
    level: '위험',
    icon: <HandCoins size={18} />,
  },
  {
    title: '무한 수정 위험',
    desc: 'SOW 밖의 추가 요청과 수정 횟수가 제한되지 않으면 일정과 비용이 폭증합니다.',
    clause: '업무범위 / 변경 요청 / 추가 견적',
    level: '위험',
    icon: <GitBranch size={18} />,
  },
  {
    title: 'IP 이전 위험',
    desc: '잔금 전 소스코드와 산출물 저작권을 넘기면 대금 회수력이 약해집니다.',
    clause: '저작권 / 소스코드 / 원본 파일 이전',
    level: '주의',
    icon: <Code size={18} />,
  },
  {
    title: '유지보수 폭탄 위험',
    desc: '버그 수정과 신규 기능 개발이 구분되지 않으면 무상 노동이 발생합니다.',
    clause: '하자보수 / 유지보수 / 추가 개발',
    level: '주의',
    icon: <TimerReset size={18} />,
  },
  {
    title: '일정 배상 위험',
    desc: '발주처 자료 제공 지연까지 개발자 지체상금으로 잡히면 손해가 커집니다.',
    clause: '지체상금 / 일정 연장 / 발주처 협조 의무',
    level: '주의',
    icon: <AlertCircle size={18} />,
  },
];

const milestoneItems = [
  { label: '계약금', value: '30%', desc: '착수 전 지급' },
  { label: '중도금', value: '40%', desc: '1차 산출물 검수' },
  { label: '잔금', value: '30%', desc: '최종 검수·배포 전' },
];

const checklist = [
  '과업명세서(SOW)에 화면·기능·API·관리자 범위가 적혀 있는가?',
  '수정 요청 횟수와 추가 개발 단가가 분리되어 있는가?',
  '저작권/IP 이전 시점이 잔금 완납 이후로 되어 있는가?',
  '검수 기간, 검수 거절 사유, 미응답 시 승인 간주가 있는가?',
  '무상 하자보수 범위가 버그 수정으로 제한되어 있는가?',
];

const ITDashboard = ({ onBack, onNavigateToAnalysis, onNavigateToSimulator }) => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10 pb-20 font-sans">
      <header className="relative overflow-hidden rounded-[2.5rem] border border-purple-200/40 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-6 text-white shadow-2xl sm:p-8 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.28),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_26%)]" />
        <div className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 opacity-10">
          <Laptop size={360} />
        </div>

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-5">
            <button
              onClick={onBack}
              className="flex w-fit items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/15 hover:text-white"
            >
              <ArrowLeft size={16} />
              Hub 홈으로
            </button>

            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
              <div className="rounded-2xl bg-purple-500/90 p-3 shadow-lg shadow-purple-500/20">
                <Code size={30} className="text-white" />
              </div>

              <div className="min-w-0 space-y-3">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
                  IT Outsourcing Vertical
                </div>
                <h2 className="break-keep text-3xl font-black leading-snug tracking-tight md:text-5xl">
                  IT Outsourcing Guardian
                </h2>
                <p className="max-w-2xl break-keep text-base font-medium leading-7 text-slate-300 md:text-lg">
                  과업 범위부터 검수, 대금 회수, 소스코드 IP 이전까지.
                  외주 개발·프리랜서 계약의 핵심 분쟁 포인트를 사전에 잠급니다.
                </p>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:w-[560px]">
            <button
              onClick={() => onNavigateToAnalysis('IT 외주 계약서')}
              className="flex min-w-0 items-center justify-center gap-3 whitespace-nowrap rounded-2xl bg-purple-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-purple-600/30 transition hover:-translate-y-0.5 hover:bg-purple-400"
            >
              <ShieldCheck size={20} className="shrink-0" />
              <span className="truncate">IT 계약 스캔하기</span>
            </button>

            <button
              onClick={onNavigateToSimulator}
              className="flex min-w-0 items-center justify-center gap-3 whitespace-nowrap rounded-2xl bg-white px-6 py-4 text-base font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-purple-100"
            >
              <SlidersHorizontal size={20} className="shrink-0" />
              <span className="truncate">IT 외주 리스크 시뮬레이터</span>
            </button>

            <button
              onClick={() => onNavigateToAnalysis('비밀유지 계약서(NDA)')}
              className="flex min-w-0 items-center justify-center gap-3 whitespace-nowrap rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-base font-black text-white transition hover:bg-white/15 sm:col-span-2"
            >
              <LockKeyhole size={20} className="shrink-0" />
              <span className="truncate">NDA 점검</span>
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between text-slate-500">
            <span className="font-bold">검토 가능한 문서</span>
            <FileCode2 size={20} />
          </div>
          <div className="text-4xl font-black text-slate-900">
            5<span className="ml-1 text-xl font-medium text-slate-400">종</span>
          </div>
          <p className="mt-3 text-xs font-bold text-slate-400">외주·프리랜서·NDA·유지보수</p>
        </div>

        <div className="min-w-0 rounded-2xl border border-amber-100 bg-amber-50 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between text-amber-600">
            <span className="font-bold">주요 분쟁 포인트</span>
            <AlertCircle size={20} />
          </div>
          <div className="text-4xl font-black text-amber-600">
            10<span className="ml-1 text-xl font-medium text-amber-400">개</span>
          </div>
          <p className="mt-3 text-xs font-bold text-amber-500/80">대금/SOW/IP/보안/오픈소스</p>
        </div>

        <div className="relative min-w-0 overflow-hidden rounded-2xl bg-purple-600 p-6 text-white shadow-lg md:col-span-2 xl:col-span-1">
          <div className="mb-4 flex items-center justify-between text-purple-200">
            <span className="font-bold">권장 대금 구조</span>
            <HandCoins size={20} />
          </div>
          <div className="text-4xl font-black">30/40/30</div>
          <p className="mt-3 text-xs font-bold text-purple-200">착수·중간검수·최종검수 분리</p>
          <div className="absolute -bottom-8 -right-8 opacity-20">
            <Milestone size={140} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6">
        <div className="min-w-0 rounded-[2.3rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="break-keep text-xl font-black leading-snug text-slate-900">빠른 실행</h3>
              <p className="break-keep text-sm font-medium leading-6 text-slate-500">IT 외주 전용 분석 시작</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((item) => (
              <button
                key={item.title}
                onClick={() => onNavigateToAnalysis(item.actionType)}
                className={`group flex w-full min-w-0 items-center justify-between gap-4 rounded-2xl border px-5 py-5 text-left transition ${
                  item.primary
                    ? 'border-purple-100 bg-purple-50 hover:bg-purple-100'
                    : 'border-slate-100 bg-slate-50 hover:border-purple-100 hover:bg-purple-50'
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 rounded-xl bg-white p-2 text-purple-600 shadow-sm">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="break-keep font-bold leading-snug text-slate-900">
                      {item.title}
                    </div>
                    <div className="mt-1 break-keep text-sm leading-6 text-slate-500">
                      {item.desc}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className="shrink-0 text-slate-400 transition group-hover:text-purple-600"
                  size={18}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-[2.3rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-2 text-red-500">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="break-keep text-xl font-black leading-snug text-slate-900">외주 분쟁 알림</h3>
              <p className="break-keep text-sm font-medium leading-6 text-slate-500">
                계약서에서 먼저 확인할 위험 조항
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {riskCards.map((risk) => (
              <div key={risk.title} className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-white p-2 text-purple-600 shadow-sm">
                    {risk.icon}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-black ${
                      risk.level === '위험'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {risk.level}
                  </span>
                </div>
                <h4 className="break-keep font-black leading-snug text-slate-900">{risk.title}</h4>
                <p className="mt-2 break-keep text-sm font-medium leading-6 text-slate-500">
                  {risk.desc}
                </p>
                <button
                  onClick={() => onNavigateToAnalysis('IT 외주 계약서')}
                  className="mt-5 w-full whitespace-nowrap rounded-2xl bg-white px-4 py-3 text-xs font-black text-purple-700 shadow-sm transition hover:bg-purple-50"
                >
                  관련 조항 확인하기
                </button>
                <p className="mt-3 break-keep text-[11px] font-bold leading-5 text-slate-400">
                  {risk.clause}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="min-w-0 rounded-[2.3rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 className="break-keep text-xl font-black leading-snug text-slate-900">계약 전 체크리스트</h3>
              <p className="break-keep text-sm font-medium leading-6 text-slate-500">서명 전 최소 확인 항목</p>
            </div>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={18} />
                <span className="break-keep text-sm font-bold leading-6 text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-[2.3rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-2 text-purple-300">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="break-keep text-xl font-black leading-snug">권장 마일스톤</h3>
              <p className="break-keep text-sm font-medium leading-6 text-slate-400">
                대금 회수와 검수 지연을 줄이는 구조
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {milestoneItems.map((item, index) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500 text-sm font-black">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="break-keep font-black leading-snug">{item.label}</span>
                    <span className="text-2xl font-black text-purple-300">{item.value}</span>
                  </div>
                  <p className="mt-1 break-keep text-sm font-medium leading-6 text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ITDashboard;