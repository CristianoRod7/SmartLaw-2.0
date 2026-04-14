import React from "react";
import { Sparkles } from "lucide-react";

const STEP_CONTENT = {
  1: {
    title: "운영 조건",
    description: "작목, 시설 형태, 지역, 운영 방식을 입력합니다.",
    tone: "from-slate-50 to-emerald-50/40",
  },
  2: {
    title: "자금 구조",
    description: "초기 투자, 대출, 월 비용과 매출 구조를 입력합니다.",
    tone: "from-slate-50 to-emerald-50/40",
  },
  3: {
    title: "보조금 및 의무사항",
    description: "보조금 수령 여부와 의무 운영기간을 확인합니다.",
    tone: "from-slate-50 to-emerald-50/40",
  },
  4: {
    title: "계약 참고자료",
    description: "계약서가 있으면 주요 조항을 자동 반영합니다.",
    tone: "from-slate-50 to-emerald-50/40",
  },
  5: {
    title: "최종 확인",
    description: "입력한 내용을 확인한 뒤 진단을 실행합니다.",
    tone: "from-slate-50 to-emerald-50/40",
  },
};

export default function InterviewHero({ step = 1 }) {
  const content = STEP_CONTENT[step] || STEP_CONTENT[1];

  return (
    <section
      className={`overflow-hidden rounded-[2.2rem] border border-slate-200 bg-gradient-to-br ${content.tone} p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]`}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur">
        <Sparkles size={13} />
        INTERVIEW STEP
      </div>

      <div className="mt-3">
        <h2 className="text-[1.45rem] font-bold tracking-tight text-slate-900 md:text-[1.7rem]">
          {content.title}
        </h2>
        <p className="mt-2 max-w-3xl text-[14px] font-medium leading-6 text-slate-500 break-keep md:text-[15px]">
          {content.description}
        </p>
      </div>
    </section>
  );
}