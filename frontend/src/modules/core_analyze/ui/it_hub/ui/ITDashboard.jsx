import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, ShieldCheck, Zap, FileCode2, Clock, 
  ArrowLeft, ChevronRight, AlertCircle, Laptop
} from 'lucide-react';

const ITDashboard = ({ onBack, onNavigateToAnalysis }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 w-full pb-20 font-sans">
      
      {/* 🚀 헤더 영역 */}
      <header className="flex justify-between items-end gap-4 bg-slate-900 text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold bg-white/10 px-4 py-2 rounded-full w-fit">
            <ArrowLeft size={16} /> Hub 홈으로
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 p-3 rounded-xl"><Code size={28} className="text-white" /></div>
            <h2 className="text-4xl font-black tracking-tight">IT Outsourcing Guardian</h2>
          </div>
          <p className="text-slate-300 font-medium text-lg max-w-xl break-keep">
            SOW(업무명세서) 구체화부터 소스코드 IP 방어, 대금 체불 방지까지 IT 비즈니스를 완벽히 보호합니다.
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <button 
            onClick={() => onNavigateToAnalysis('IT 외주 계약서')}
            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-purple-600/30 flex items-center gap-3"
          >
            <ShieldCheck size={22} /> IT 외주 계약 스캔하기
          </button>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <Laptop size={400} />
        </div>
      </header>

      {/* 🚀 메인 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4 text-slate-500"><span className="font-bold">진행 중인 프로젝트</span><Clock size={20} /></div>
              <div className="text-4xl font-black text-slate-900">3<span className="text-xl text-slate-400 font-medium ml-1">건</span></div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4 text-amber-500"><span className="font-bold">미수금 / 리스크 경고</span><AlertCircle size={20} /></div>
              <div className="text-4xl font-black text-amber-500">1<span className="text-xl text-amber-300 font-medium ml-1">건</span></div>
              <p className="text-xs font-bold text-slate-400 mt-3">A물류 랜딩페이지 잔금 지연</p>
          </div>
          <div className="bg-purple-600 p-8 rounded-[2rem] shadow-lg text-white relative overflow-hidden">
              <div className="flex justify-between items-center mb-4 text-purple-200"><span className="font-bold">보호 중인 IP (소스코드)</span><ShieldCheck size={20} /></div>
              <div className="text-4xl font-black">2<span className="text-xl text-purple-200 font-medium ml-1">건</span></div>
              <div className="absolute right-[-10%] bottom-[-10%] opacity-20"><FileCode2 size={120} /></div>
          </div>
      </div>
    </motion.div>
  );
};

export default ITDashboard;