import React, { useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileSearch,
  Info,
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { analyzeReverseRisk } from './riskAnalyzer.js';
import RiskScoreExplanation from '../../components/analysis/RiskScoreExplanation';

const levelStyle = {
  위험: {
    badge: 'bg-red-100 text-red-700 border-red-200',
    bar: 'bg-red-500',
    icon: <ShieldAlert size={18} />,
  },
  주의: {
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    bar: 'bg-amber-500',
    icon: <AlertTriangle size={18} />,
  },
  낮음: {
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    bar: 'bg-emerald-500',
    icon: <CheckCircle2 size={18} />,
  },
};

const confidenceStyle = {
  high_confidence: 'bg-purple-50 text-purple-700 border-purple-100',
  needs_review: 'bg-blue-50 text-blue-700 border-blue-100',
  context_review: 'bg-slate-100 text-slate-700 border-slate-200',
  low_signal: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  not_compared: 'bg-slate-100 text-slate-600 border-slate-200',
};

const ReverseRiskPanel = ({ contractText, apiAnalysisResult }) => {
  const analysis = useMemo(
    () => analyzeReverseRisk(contractText, apiAnalysisResult),
    [contractText, apiAnalysisResult]
  );

  const hasContractText = Boolean(String(contractText || '').trim());

  if (!hasContractText) {
    return (
      <section className="rounded-[2.5rem] border border-dashed border-slate-300 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <FileSearch size={26} />
          </div>
          <div>
            <h3 className="break-keep text-2xl font-black text-slate-900">역방향 리스크 체크</h3>
            <p className="mt-2 break-keep text-sm font-bold leading-6 text-slate-500">
              계약서 원문이 결과 데이터에 포함되면 피해 시나리오 기준의 규칙 점검 결과가 이 영역에 표시됩니다.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-[2.5rem] border border-purple-100 bg-white p-5 shadow-xl shadow-purple-100/40 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-purple-600">
            <Sparkles size={14} /> Reverse Risk Engine
          </div>
          <h3 className="mt-4 break-keep text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
            역방향 리스크 체크
          </h3>
          <p className="mt-3 max-w-3xl break-keep text-sm font-medium leading-7 text-slate-600">
            AI 분석 결과를 보완하기 위해 실제 피해 시나리오를 먼저 정의하고, 그 피해를 유발할 수 있는 계약 조건과 누락된 보호 조항을 다시 점검합니다.
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-3 gap-3 rounded-3xl bg-slate-950 p-4 text-white shadow-lg lg:w-[420px]">
          <div className="min-w-0 rounded-2xl bg-white/10 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold text-slate-400">종합 점수</p>
              <RiskScoreExplanation buttonClassName="h-6 w-6 border-white/15 bg-white/10 text-purple-100 hover:bg-white/20" />
            </div>
            <p className="mt-1 text-3xl font-black text-purple-300">{analysis.summary.averageScore}</p>
          </div>
          <div className="min-w-0 rounded-2xl bg-white/10 p-4">
            <p className="text-[11px] font-bold text-slate-400">위험</p>
            <p className="mt-1 text-3xl font-black text-red-300">{analysis.summary.highRiskCount}</p>
          </div>
          <div className="min-w-0 rounded-2xl bg-white/10 p-4">
            <p className="text-[11px] font-bold text-slate-400">주의</p>
            <p className="mt-1 text-3xl font-black text-amber-300">{analysis.summary.cautionCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {analysis.results.map((risk) => {
          const style = levelStyle[risk.level] || levelStyle['낮음'];
          const confidenceClass = confidenceStyle[risk.confidence.status] || confidenceStyle.not_compared;

          return (
            <article key={risk.id} className="min-w-0 rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="break-keep text-xs font-black uppercase tracking-[0.16em] text-slate-400">{risk.scenario}</p>
                  <h4 className="mt-2 break-keep text-xl font-black leading-snug text-slate-950">{risk.title}</h4>
                  <p className="mt-2 break-keep text-sm font-medium leading-6 text-slate-600">{risk.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${style.badge}`}>
                    {style.icon}
                    {risk.level}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-900 shadow-sm">
                    {risk.score}점
                  </span>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white">
                <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${Math.min(100, risk.score)}%` }} />
              </div>

              <div className={`mt-4 rounded-2xl border px-4 py-3 text-xs font-bold leading-5 ${confidenceClass}`}>
                <div className="flex items-start gap-2">
                  <ShieldCheck size={15} className="mt-0.5 shrink-0" />
                  <div className="min-w-0 break-keep">
                    <p className="font-black">{risk.confidence.label}</p>
                    <p className="mt-1 opacity-80">{risk.confidence.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900">
                    <FileSearch size={16} className="text-purple-500" /> 탐지된 근거 문장
                  </div>
                  {risk.evidenceSentences.length > 0 ? (
                    <ul className="space-y-2">
                      {risk.evidenceSentences.map((sentence, index) => (
                        <li key={`${risk.id}-evidence-${index}`} className="break-keep rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold leading-5 text-slate-600">
                          “{sentence}”
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="break-keep text-xs font-semibold leading-5 text-slate-400">직접적인 위험 키워드는 발견되지 않았습니다.</p>
                  )}
                </div>

                <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900">
                    <AlertTriangle size={16} className="text-amber-500" /> 누락된 보호 장치
                  </div>
                  {risk.missingItems.length > 0 ? (
                    <ul className="space-y-2">
                      {risk.missingItems.map((item) => (
                        <li key={item.label} className="flex items-center justify-between gap-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
                          <span className="break-keep leading-5">{item.label}</span>
                          <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-amber-600">+{item.score}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="break-keep text-xs font-semibold leading-5 text-emerald-600">핵심 보호 장치가 비교적 잘 포함되어 있습니다.</p>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-purple-100 bg-purple-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-black text-purple-900">
                  <Lightbulb size={16} /> 추천 수정 문구
                </div>
                <p className="break-keep text-sm font-bold leading-6 text-purple-800">{risk.suggestion}</p>
              </div>

              {risk.matchedKeywords.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {risk.matchedKeywords.map((keyword) => (
                    <span key={keyword} className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-slate-500 shadow-sm">
                      #{keyword}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold leading-6 text-slate-500">
        <div className="flex items-start gap-2">
          <Info size={16} className="mt-0.5 shrink-0 text-slate-400" />
          <p className="break-keep">
            이 결과는 법률 자문이 아니라 AI 분석을 보완하는 규칙 기반 체크입니다. 향후 DB 저장, PDF 리포트, 사용자 입장별 규칙 분리, API 분석 결과와의 정밀 교차검증으로 확장할 수 있도록 구조화된 데이터로 계산됩니다.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReverseRiskPanel;
