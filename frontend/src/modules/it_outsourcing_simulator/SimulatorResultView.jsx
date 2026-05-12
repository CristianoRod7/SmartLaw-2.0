import React from 'react';
import { ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

const statusClass = {
  Safe: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Warning: 'bg-amber-50 text-amber-700 border-amber-100',
  Danger: 'bg-red-50 text-red-700 border-red-100',
};

export default function ITSimulatorResultView({ data, onReset }) {
  if (!data) return null;

  if (data.error) {
    return (
      <div className="rounded-[3rem] border border-red-200 bg-white py-32 text-center">
        <h2 className="text-2xl font-black text-red-500">IT 시뮬레이션 실패</h2>
        <p className="mt-3 text-slate-500">{data.error}</p>
        <button onClick={onReset} className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 font-black text-white">다시 시도</button>
      </div>
    );
  }

  const riskCards = data.risk_cards || [];
  const actions = data.actions || [];
  const sixMonths = data.future_risk?.['6_months'] || [];
  const oneYear = data.future_risk?.['1_year'] || [];

  return (
    <div className="w-full space-y-8 pb-20 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">IT 외주 시뮬레이션 결과</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">대금, 검수, IP, 유지보수 조건 기반의 사전 리스크입니다.</p>
        </div>
        <button onClick={onReset} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
          <ArrowLeft size={16} /> 시뮬레이터로 돌아가기
        </button>
      </div>

      <section className="rounded-[2.5rem] bg-gradient-to-br from-slate-950 to-purple-950 p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-purple-300">Risk Score</div>
            <div className="text-6xl font-black">{data.score ?? 0}</div>
          </div>
          <p className="max-w-3xl break-keep text-base font-medium leading-7 text-slate-300">{data.summary}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {riskCards.map((card, index) => (
          <div key={`${card.category}-${index}`} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-black text-slate-900"><ShieldAlert size={18} />{card.category}</div>
              <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass[card.status] || statusClass.Warning}`}>{card.status}</span>
            </div>
            <h3 className="font-black text-slate-900">{card.title}</h3>
            <p className="mt-2 break-keep text-sm font-medium leading-6 text-slate-500">{card.desc}</p>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">확인 조항: {card.clause_hint}</div>
            <div className="mt-3 rounded-2xl bg-purple-50 p-4 text-sm font-bold text-purple-700">수정 제안: {card.fix}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[['6개월 리스크', sixMonths], ['1년 리스크', oneYear]].map(([title, items]) => (
          <div key={title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-black text-slate-900">{title}</h2>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-black text-slate-900">{item.issue}</div>
                  <p className="mt-1 text-sm font-medium text-slate-500">{item.reason}</p>
                  <p className="mt-2 text-xs font-black text-purple-600">가능성 {item.probability} · {item.impact}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-black text-slate-900">우선 조치</h2>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <div key={index} className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-800">
              <CheckCircle2 className="mt-0.5 shrink-0" size={18} /> {action}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
