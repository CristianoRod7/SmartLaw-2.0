import React, { useState, useEffect } from 'react';
import { Newspaper, Zap, RefreshCcw, Loader2, BookOpen, Quote, ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Recommend = () => {
  const [legalUpdates, setLegalUpdates] = useState([]);
  const [updating, setUpdating] = useState(true);
  const [currentTerm, setCurrentTerm] = useState(null);

  // 📖 청년 필수 법률 용어 데이터셋
  const legalTermsDB = [
    { term: "부제소 합의", pronunciation: "[부:제소 하비]", definition: "나중에 어떠한 이유로든 민·형사상 소송을 제기하지 않기로 미리 약속하는 것.", caution: "합의서 쓸 때 이 문구 있으면 나중에 억울해도 고소 못 하니 신중해야 함!" },
    { term: "확정일자", pronunciation: "[확쩡 일짜]", definition: "법원이나 동사무소에서 계약서가 실존함을 증명한 날짜. 전세사기 방어의 핵심.", caution: "전입신고와 확정일자를 둘 다 해야 '우선변제권'이 생겨서 내 보증금을 지킴." },
    { term: "소멸시효", pronunciation: "[소멸 시효]", definition: "권리자가 권리를 행사할 수 있음에도 일정 기간 행사하지 않아 그 권리를 없애는 것.", caution: "빌려준 돈(채권)은 보통 10년, 알바비 같은 임금은 3년이 지나면 못 받음." },
    { term: "가압류", pronunciation: "[가:암뉴]", definition: "돈을 갚지 않을 것 같은 채무자의 재산을 임시로 묶어두어 마음대로 못 팔게 하는 것.", caution: "소송 이겨도 상대방이 재산 다 빼돌리면 꽝임. 소송 전 가압류는 필수 전략!" },
    { term: "미필적 고의", pronunciation: "[미필쩍 고이]", definition: "결과가 발생할 위험을 예견하고도 '일어나도 어쩔 수 없지'라고 받아들이는 심리 상태.", caution: "직접적인 의도가 없었더라도 미필적 고의가 인정되면 형사 처벌 대상이 됨." }
  ];

  // 🎲 랜덤 용어 추출
  const getRandomTerm = () => {
    const randomIndex = Math.floor(Math.random() * legalTermsDB.length);
    setCurrentTerm(legalTermsDB[randomIndex]);
  };

  // 🚀 실시간 법률 뉴스 업데이트 (API 연동)
  const fetchLegalUpdates = async () => {
    setUpdating(true);
    try {
      // 🔗 백엔드(FastAPI)에서 찐 데이터 가져오기
      const res = await axios.get('http://localhost:8000/api/v1/legal-updates/');
      if (res.data.status === "success") {
        setLegalUpdates(res.data.data);
      }
    } catch (err) {
      console.error("백엔드 연결 실패! 도커 확인해봐 영웅아!");
      setLegalUpdates([]); 
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchLegalUpdates();
    getRandomTerm();
  }, []);

  return (
    <div className="space-y-12 pb-20 overflow-y-auto h-[calc(100vh-120px)] pr-2 scrollbar-hide">
      
      {/* 🏛️ 1. 메인 배너 */}
      <section>
        <div className="bg-slate-950 p-12 md:p-16 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-10"><Zap size={300} strokeWidth={1} /></div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 bg-blue-600 w-fit px-5 py-2 rounded-full shadow-lg text-[11px] font-black uppercase tracking-[0.2em]">NextLaw Intelligence</div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight italic">Knowledge is <span className="text-blue-500">Safety.</span></h2>
            <div className="flex items-center gap-6 pt-4">
              <p className="text-slate-400 font-medium max-w-xl text-lg leading-relaxed">정보의 격차가 곧 권리의 격차입니다. AI가 매일 법률 정보를 정밀 분석합니다.</p>
              <button 
                onClick={() => { fetchLegalUpdates(); getRandomTerm(); }} 
                className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all border border-white/5 shadow-inner"
              >
                <RefreshCcw size={24} className={updating ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 📰 2. 실시간 법률 다이제스트 (격자 정렬 버전) */}
      <section className="space-y-8 px-4">
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3 italic">
          <Newspaper className="text-blue-600" /> Real-time Updates
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            <AnimatePresence mode='popLayout'>
                {legalUpdates.map((update) => (
                    <motion.div 
                        key={update.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -10 }}
                        onClick={() => update.link && window.open(update.link, '_blank')}
                        className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl flex flex-col cursor-pointer group hover:border-blue-300 transition-all duration-500 h-full"
                    >
                        <div className="flex-1 flex flex-col space-y-6">
                            <div className="flex justify-between items-start">
                                <span className="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">{update.category}</span>
                                <span className="text-blue-600 font-black text-[10px] italic">{update.tag}</span>
                            </div>
                            
                            <h4 className="text-2xl font-black text-slate-900 leading-[1.3] group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[4rem]">
                                {update.title}
                            </h4>
                            
                            <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 flex-1">
                                {update.summary}
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center">
                            <div className="flex-1">
                                <p className="text-[10px] text-slate-400 font-black uppercase mb-1 italic tracking-widest">Impact</p>
                                <p className="text-emerald-500 font-black text-sm italic break-keep">⚡ {update.impact}</p>
                            </div>
                            <div className="shrink-0 bg-slate-50 p-3 rounded-full text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                                <ArrowUpRight size={20} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </section>

      {/* 🚀 3. 오늘의 법률 용어 (숏폼) */}
      <section className="px-4">
        <AnimatePresence mode='wait'>
          {currentTerm && (
            <motion.div 
                key={currentTerm.term}
                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                className="bg-blue-600 rounded-[4rem] p-10 md:p-14 text-white flex flex-col md:flex-row gap-12 items-center shadow-2xl shadow-blue-100"
            >
                <div className="shrink-0 space-y-4 text-center md:text-left md:min-w-[250px]">
                    <div className="bg-white/20 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase mx-auto md:mx-0">Today's Term</div>
                    <h4 className="text-5xl lg:text-6xl font-black tracking-tighter italic">{currentTerm.term}</h4>
                    <p className="text-blue-200 font-mono text-xl">{currentTerm.pronunciation}</p>
                </div>
                
                <div className="flex-1 space-y-6">
                    <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/10 relative">
                        <Quote className="absolute -top-4 -left-4 text-white opacity-20" size={48} />
                        <p className="text-xl font-bold leading-relaxed">{currentTerm.definition}</p>
                    </div>
                    <div className="flex items-start gap-4 bg-slate-950/20 p-6 rounded-3xl">
                        <div className="p-2 bg-amber-400 text-slate-950 rounded-lg"><Zap size={18} fill="currentColor" /></div>
                        <p className="text-sm font-black text-blue-50 tracking-tight leading-relaxed"><span className="text-amber-400 font-black">핵심 주의:</span> {currentTerm.caution}</p>
                    </div>
                </div>

                <button onClick={getRandomTerm} className="shrink-0 bg-white text-blue-600 p-6 rounded-full shadow-xl hover:scale-110 transition-all active:scale-95">
                    <ChevronRight size={32} />
                </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center text-slate-400 font-black italic">
                    현재 실시간으로 긁어온 뉴스가 없습니다. <br/>
                    백엔드 크롤러가 네이버 뉴스를 잘 찾고 있는지 확인해보세요!
                </div>
      </section>

      {/* 🏛️ 하단 섹션 */}
      <section className="px-4 pb-12 text-center">
            <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-100">
                <h5 className="text-slate-900 font-black text-xl mb-4 italic flex items-center justify-center gap-2"><BookOpen size={24} className="text-blue-600" /> NextLaw Academy</h5>
                <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">어려운 법률 용어, 헷갈리는 정책들. NextLaw AI가 청년의 시각에서 가장 쉽게 풀어서 설명해 드립니다.</p>
            </div>
      </section>
    </div>
  );
};

export default Recommend;