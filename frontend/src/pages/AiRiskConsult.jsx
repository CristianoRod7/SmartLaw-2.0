import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Leaf,
  LibraryBig,
  Loader2,
  Newspaper,
  SendHorizontal,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { aiRiskConsultApi } from '../api/aiRiskConsult';

const MotionDiv = motion.div;

const suggestedTopics = [
  { category: '보조금/환수', question: '보조금을 받았는데 나중에 환수될까 걱정돼요' },
  { category: '농지/설치', question: '농지를 빌렸는데 스마트팜 설치가 가능한지 모르겠어요' },
  { category: '시공/A/S', question: '시공사가 하자보수 책임을 명확히 적지 않았어요' },
  { category: '해지 조건', question: '상대방이 일방적으로 계약을 해지할 수 있게 되어 있어요' },
  { category: '손해배상', question: '지체상금이나 손해배상 기준이 너무 불리해 보여요' },
  { category: 'IT/소스코드', question: '개발된 소스코드 권리가 누구에게 있는지 애매해요' },
  { category: '보조금/목적 외 사용', question: '지원금을 받은 시설을 다른 용도로 써도 되는지 모르겠어요' },
  { category: '운영 변경', question: '사업 계획과 실제 운영 방식이 달라질 것 같아요' },
  { category: '농지/규제', question: '농업 목적 외 사용으로 문제가 생길까 걱정돼요' },
  { category: '설비/비용', question: '설비가 고장났을 때 누가 비용을 부담하는지 애매해요' },
  { category: '공사 지연', question: '공사가 늦어졌을 때 책임 조항이 부족한 것 같아요' },
  { category: '유지보수', question: '유지보수 기간과 무상 수리 범위가 불분명해요' },
  { category: '원상복구', question: '계약 해지 후 원상복구 책임이 어디까지인지 모르겠어요' },
  { category: '검수/대금', question: '검수 기준이 불명확해서 대금 지급이 늦어질까 걱정돼요' },
  { category: 'IT/변경 요청', question: '추가 수정 요청을 계속 받아야 하는지 모르겠어요' },
  { category: 'IT/저작권', question: '산출물 저작권을 전부 넘겨야 한다고 적혀 있어요' },
];

const INITIAL_SUGGESTED_TOPIC_COUNT = 6;

const fallbackFollowUpQuestions = [
  '문제가 된 조항 문구를 그대로 입력해 주실 수 있나요?',
  '계약 유형이 시공, 임대차, 외주 중 어디에 가까운가요?',
  '상대방이 부담해야 하는 책임은 무엇이라고 생각하시나요?',
];

const keywordGroups = [
  {
    keywords: ['하자보수', '시공', '유지보수'],
    title: '시공·유지보수 리스크 상담 결과',
    risks: [
      '시공 하자보수 조항 미흡 가능성이 있습니다.',
      '유지보수 책임이 발주자에게 전가될 가능성을 확인해야 합니다.',
      '검수 완료 기준과 지연 책임 범위를 계약서에 명확히 둘 필요가 있습니다.',
    ],
    nextSteps: [
      '하자보수 기간, 무상 유지보수 범위, 지체상금 조항을 우선 확인하세요.',
      '시공 완료 확인서와 검수 기준표를 별도 첨부하는 구성이 안전합니다.',
    ],
    recommendations: [
      { label: '스마트팜 계약 스캔', route: '/smartfarm', icon: Leaf },
      { label: '계약 체크리스트', route: '/analysis', icon: ClipboardCheck, analysisType: '스마트팜 구축 계약' },
      { label: '정책·이슈 확인', route: '/policy', icon: Newspaper },
    ],
  },
  {
    keywords: ['보조금', '환수', '지원금'],
    title: '보조금·지원금 리스크 상담 결과',
    risks: [
      '보조금 환수 조건과 사후관리 의무 검토가 필요합니다.',
      '목적 외 사용 또는 설치 기준 미준수로 인한 환수 위험 가능성이 있습니다.',
      '계약 해지 시 보조금 반환 책임이 어느 당사자에게 있는지 확인해야 합니다.',
    ],
    nextSteps: [
      '사업 공고문, 보조금 교부 조건, 계약서의 비용 부담 조항을 함께 비교하세요.',
      '정책·뉴스 화면에서 최신 지원사업 공고와 변경사항을 확인하는 것을 권장합니다.',
    ],
    recommendations: [
      { label: '스마트팜 허브', route: '/smartfarm', icon: Leaf },
      { label: '정책·이슈 확인', route: '/policy', icon: Newspaper },
    ],
  },
  {
    keywords: ['농지', '임대차', '농업 목적'],
    title: '농지·임대차 리스크 상담 결과',
    risks: [
      '농지 목적 외 사용 위험을 검토해야 합니다.',
      '농지 임대차 조건과 계약 해지 사유가 충분히 구체적인지 확인이 필요합니다.',
      '시설 설치 권한과 원상회복 범위가 불명확하면 분쟁 가능성이 있습니다.',
    ],
    nextSteps: [
      '임대 목적, 설치 가능한 시설 범위, 원상회복 책임을 계약서에 분리해 적으세요.',
      '농지 관련 문서와 표준 계약 양식을 함께 확인하는 흐름이 적합합니다.',
    ],
    recommendations: [
      { label: '스마트팜 허브', route: '/smartfarm', icon: Leaf },
      { label: '법률 라이브러리', route: '/legal', icon: LibraryBig },
    ],
  },
];

const defaultResult = {
  title: '계약 리스크 상담 결과',
  risks: [
    '입력한 상황과 관련된 핵심 의무, 책임 범위, 해지 조건을 우선 확인해야 합니다.',
    '계약서에 당사자별 역할과 비용 부담이 명확히 구분되어 있는지 점검이 필요합니다.',
    '리스크가 큰 조항은 계약 분석 화면에서 독소조항 탐지와 수정 가이드를 함께 확인하세요.',
  ],
  nextSteps: [
    '계약 유형을 선택해 전문 분석을 진행하고, 결과 리포트에서 위험/주의 조항을 확인하세요.',
    '정책이나 지원사업 조건과 연결된 계약이면 정책·이슈 확인도 함께 진행하는 것이 좋습니다.',
  ],
  recommendations: [
    { label: '스마트팜 허브', route: '/smartfarm', icon: Leaf },
    { label: '계약 분석 시작', route: '/analysis', icon: FileSearch, analysisType: '스마트팜 구축 계약' },
    { label: '정책·이슈 확인', route: '/policy', icon: Newspaper },
  ],
};

const routeToView = {
  '/smartfarm': 'farm',
  '/farm': 'farm',
  '/policy': 'recommend',
  '/recommend': 'recommend',
  '/legal': 'legal',
  '/it': 'it',
};

const iconByRoute = {
  '/smartfarm': Leaf,
  '/farm': Leaf,
  '/policy': Newspaper,
  '/recommend': Newspaper,
  '/legal': LibraryBig,
  '/it': ClipboardCheck,
  '/analysis': FileSearch,
};

const buildConsultResult = (prompt) => {
  const normalized = prompt.replace(/\s/g, '').toLowerCase();
  const matched = keywordGroups.find((group) => group.keywords.some((keyword) => normalized.includes(keyword.replace(/\s/g, '').toLowerCase())));
  return matched || defaultResult;
};

const toFallbackResult = (prompt, source = 'fallback') => {
  const fallback = buildConsultResult(prompt);
  return {
    answer: 'Gemini 상담 응답 생성 실패로 로컬 키워드 기반 fallback 상담 결과를 표시합니다.',
    detectedRisks: fallback.risks.map((risk) => ({ title: risk, level: '주의', reason: risk })),
    checkpoints: fallback.nextSteps,
    recommendedActions: fallback.recommendations.map((item) => ({
      label: item.label,
      description: item.label,
      route: item.route || '/analysis',
      analysisType: item.analysisType,
    })),
    followUpQuestions: fallbackFollowUpQuestions,
    source: 'fallback',
    fallbackReason: source === 'frontend_fallback' ? 'Frontend API request failed' : source,
  };
};

const normalizeResult = (payload) => ({
  answer: payload?.answer || '상담 결과를 불러왔습니다.',
  detectedRisks: Array.isArray(payload?.detectedRisks) ? payload.detectedRisks : [],
  checkpoints: Array.isArray(payload?.checkpoints) ? payload.checkpoints : [],
  recommendedActions: Array.isArray(payload?.recommendedActions) ? payload.recommendedActions : [],
  followUpQuestions: Array.isArray(payload?.followUpQuestions) ? payload.followUpQuestions : [],
  source: payload?.source || 'gemini',
  fallbackReason: payload?.fallbackReason || null,
});

const AiRiskConsult = ({ initialPrompt = '', onBack, onNavigate, onAnalyze }) => {
  const [input, setInput] = useState(initialPrompt);
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hasResult = Boolean(result);

  const requestConsult = async (prompt) => {
    const nextPrompt = prompt.trim();
    if (!nextPrompt) return;

    setSubmittedPrompt(nextPrompt);
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await aiRiskConsultApi.consult(nextPrompt, {
        service: 'smartfarm',
        source: initialPrompt ? 'main_or_consult_page' : 'consult_page',
      });
      const normalized = normalizeResult(response.data);
      console.log('AI consult source:', normalized.source, normalized.fallbackReason || '');
      setResult(normalized);
      if (normalized.source === 'fallback') {
        setErrorMessage(normalized.fallbackReason || 'Gemini 상담 응답 생성 실패로 fallback 응답을 표시합니다.');
      }
    } catch (error) {
      console.error('AI 리스크 상담 API 호출 실패:', error);
      const fallback = toFallbackResult(nextPrompt, 'frontend_fallback');
      console.log('AI consult source:', fallback.source, fallback.fallbackReason || '');
      setErrorMessage('Gemini 상담 응답 생성 실패로 로컬 fallback 결과를 표시합니다.');
      setResult(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => requestConsult(input);

  const handleSuggestedTopicClick = (question) => {
    setInput(question);
    requestConsult(question);
  };

  const handleRecommendationClick = (recommendation) => {
    if (recommendation.analysisType || recommendation.route === '/analysis') {
      onAnalyze?.(recommendation.analysisType || '스마트팜 구축 계약');
      return;
    }

    const view = routeToView[recommendation.route];
    if (view) onNavigate?.(view);
  };

  return (
    <MotionDiv
      key="risk-consult"
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

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white shadow-xl shadow-slate-900/10 lg:p-10">
          <div className="relative z-10 space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
              <Bot size={14} /> AI Risk Router
            </div>
            <div className="space-y-3">
              <h2 className="break-keep text-4xl font-black leading-tight tracking-tighter lg:text-5xl">AI 리스크 상담</h2>
              <p className="max-w-xl break-keep text-base font-semibold leading-8 text-slate-300">
                계약 상황을 입력하면 백엔드 AI 상담 API가 리스크 유형, 확인 포인트, 추천 기능을 정리합니다.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-200">상담 흐름</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {['상황 입력', 'AI 리스크 요약', '추천 기능 이동'].map((step) => (
                  <div key={step} className="rounded-2xl bg-white/[0.06] px-4 py-3 text-sm font-bold text-white/80">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute right-[-10%] top-1/2 -translate-y-1/2 rotate-12 opacity-10">
            <Bot size={420} />
          </div>
        </div>

        <div className="rounded-[3.5rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 lg:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-600/70">Consult input</p>
              <h3 className="mt-1 break-keep text-2xl font-black text-slate-950">상황을 입력해 주세요</h3>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <ShieldAlert size={22} />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4 transition-colors focus-within:border-emerald-200 focus-within:bg-white">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={7}
              placeholder="예: 시공사가 하자보수 책임을 계약서에 명확히 적지 않았어요."
              className="min-h-[210px] w-full resize-none bg-transparent px-2 py-2 text-base font-semibold leading-7 text-slate-800 outline-none placeholder:break-keep placeholder:text-slate-400"
            />
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">상담 주제 추천</p>
                <p className="mt-1 break-keep text-xs font-bold leading-5 text-slate-500">자주 묻는 실제 고민을 누르면 바로 상담을 시작합니다.</p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">6개 주제</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {suggestedTopics.slice(0, INITIAL_SUGGESTED_TOPIC_COUNT).map((topic) => (
                <button
                  key={topic.question}
                  type="button"
                  onClick={() => handleSuggestedTopicClick(topic.question)}
                  className="group min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-left shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-md hover:shadow-emerald-100/60"
                >
                  <span className="text-[11px] font-black uppercase tracking-[0.12em] text-emerald-600">{topic.category}</span>
                  <span className="mt-1.5 line-clamp-2 block break-keep text-sm font-black leading-6 text-slate-800 group-hover:text-emerald-800">{topic.question}</span>
                  <span className="mt-2 inline-flex text-[11px] font-black text-slate-400 group-hover:text-emerald-600">바로 상담하기 →</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-900/10 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <SendHorizontal size={16} />}
            {loading ? '검토 방향을 정리하는 중입니다' : '상담 결과 보기'}
          </button>
        </div>
      </section>

      <section className="rounded-[3.5rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 lg:p-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-600/70">
              {result?.source === 'fallback' ? 'Fallback consultation result' : result?.source === 'gemini' ? 'Gemini consultation result' : 'AI consultation result'}
            </p>
            <h3 className="mt-1 break-keep text-2xl font-black text-slate-950">상담 결과 영역</h3>
          </div>
          {submittedPrompt && <span className="break-keep text-xs font-bold text-slate-400">입력: {submittedPrompt}</span>}
        </div>

        {loading && (
          <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
            <div className="h-64 animate-pulse rounded-[2rem] bg-slate-100" />
            <div className="space-y-5">
              <div className="h-32 animate-pulse rounded-[2rem] bg-slate-100" />
              <div className="h-44 animate-pulse rounded-[2rem] bg-emerald-50" />
            </div>
          </div>
        )}

        {!loading && hasResult ? (
          <div className="space-y-5">
            {(errorMessage || result.fallbackReason) && (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                {errorMessage || result.fallbackReason}
              </div>
            )}
            <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50/80 p-5">
                <h4 className="break-keep text-lg font-black text-slate-950">AI 검토 요약</h4>
                <p className="mt-4 break-keep text-sm font-semibold leading-7 text-slate-600">{result.answer}</p>
                <div className="mt-5 space-y-3">
                  {result.detectedRisks.map((risk) => (
                    <div key={`${risk.title}-${risk.reason}`} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-slate-200/50">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="break-keep text-sm font-black text-slate-800">{risk.title} <span className="text-xs text-emerald-600">· {risk.level}</span></p>
                        <p className="mt-1 break-keep text-sm font-semibold leading-6 text-slate-500">{risk.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                  <h4 className="text-sm font-black text-slate-950">확인 포인트</h4>
                  <ul className="mt-4 space-y-3">
                    {result.checkpoints.map((step) => (
                      <li key={step} className="break-keep text-sm font-semibold leading-6 text-slate-500">• {step}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50/60 p-5">
                  <h4 className="text-sm font-black text-slate-950">추천 분석 기능</h4>
                  <div className="mt-4 space-y-2">
                    {result.recommendedActions.map((recommendation) => {
                      const Icon = iconByRoute[recommendation.route] || FileSearch;
                      return (
                        <button
                          key={`${recommendation.label}-${recommendation.route}`}
                          type="button"
                          onClick={() => handleRecommendationClick(recommendation)}
                          className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-left text-sm font-black text-slate-700 shadow-sm shadow-emerald-100/50 transition hover:-translate-y-0.5 hover:text-emerald-700"
                        >
                          <span className="flex items-center gap-3"><Icon size={17} /> {recommendation.label}</span>
                          <span className="text-emerald-600">→</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {result.followUpQuestions.length > 0 && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                <h4 className="text-sm font-black text-slate-950">추가로 확인할 질문</h4>
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.followUpQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => {
                        setInput(question);
                        requestConsult(question);
                      }}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-black text-slate-600 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {!loading && !hasResult && (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-12 text-center">
            <Sparkles size={28} className="mx-auto text-slate-400" />
            <p className="mt-4 break-keep text-sm font-bold leading-7 text-slate-500">
              상담할 계약 상황을 입력하거나 추천 질문을 선택하면 AI 리스크 상담 결과가 표시됩니다.
            </p>
          </div>
        )}
      </section>
    </MotionDiv>
  );
};

export default AiRiskConsult;
