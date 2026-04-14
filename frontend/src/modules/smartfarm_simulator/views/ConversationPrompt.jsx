import React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const STEP_PROMPTS = {
  1: "먼저 운영 조건을 입력해주세요.",
  2: "이제 자금 구조를 확인합니다.",
  3: "다음은 보조금과 의무사항입니다.",
  4: "계약서가 있으면 분석 정확도가 높아집니다.",
  5: "마지막으로 입력 내용을 확인해주세요.",
};

export default function ConversationPrompt({ step = 1 }) {
  const text = STEP_PROMPTS[step] || STEP_PROMPTS[1];

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex items-start gap-3"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600">
        <Bot size={18} />
      </div>

      <div className="max-w-2xl rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
        <p className="text-[15px] font-medium leading-6 text-slate-700 break-keep">
          {text}
        </p>
      </div>
    </motion.div>
  );
}