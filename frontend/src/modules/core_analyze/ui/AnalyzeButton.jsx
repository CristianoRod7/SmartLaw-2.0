import React from "react";
import { Loader2, ShieldCheck } from "lucide-react";

export default function AnalyzeButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-slate-900 px-6 py-4 text-lg font-black text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          분석 중...
        </>
      ) : (
        <>
          <ShieldCheck size={20} />
          분석 시작하기
        </>
      )}
    </button>
  );
}