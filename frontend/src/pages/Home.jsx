import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Cpu, Leaf, Scale, BarChart3, 
  ArrowUpRight, TrendingUp, ChevronRight, Sparkles 
} from 'lucide-react';

const Home = ({ onNavigate }) => {
  // 대시보드 메뉴 아이템 정의 (스마트팜을 가장 먼저 배치)
  const menuItems = [
    { 
      id: 'farm', 
      title: "스마트팜 허브", 
      desc: "농지법 검토 및 보조금 리스크 스캔", 
      icon: <Leaf size={32} />, 
      color: "bg-emerald-50 text-emerald-600", 
      active: true 
    },
    { 
      id: 'it', 
      title: "IT 외주 가디언", 
      desc: "SOW 확정 및 IP 분쟁 방지", 
      icon: <Cpu size={32} />, 
      color: "bg-purple-50 text-purple-600", 
      active: true 
    },
    { 
      id: 'legal', 
      title: "법률 라이브러리", 
      desc: "7대 필수 서류 양식 무상 제공", 
      icon: <Scale size={32} />, 
      color: "bg-blue-50 text-blue-600", 
      active: true 
    },
    { 
      id: 'biz', 
      title: "비즈니스 지표", 
      desc: "계약 리스크 통합 관리 대시보드", 
      icon: <BarChart3 size={32} />, 
      color: "bg-slate-50 text-slate-600", 
      active: false 
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }} 
      className="space-y-12 w-full max-w-[1600px] mx-auto"
    >
      {/* 🚀 상단 환영 섹션 */}
      <section className="space-y-4 px-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest border border-emerald-100">
              <Sparkles size={14} /> Smart Farm Priority Mode
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[1.1]">
              NextLaw Hub <br/>
              <span className="text-slate-400">Safe Business Infrastructure.</span>
          </h2>
      </section>

      {/* 🚀 버티컬 모듈 카드 그리드 */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-2">
          {menuItems.map((item) => (
              <motion.div 
                key={item.id} 
                whileHover={{ y: -8, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }} 
                onClick={() => item.active && onNavigate('analyze')} 
                className={`group p-8 rounded-[3rem] border border-slate-200 bg-white cursor-pointer relative transition-all ${!item.active && 'opacity-60 cursor-not-allowed'}`}
              >
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-sm`}>
                    {item.icon}
                  </div>
                  <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                        <ArrowUpRight size={20} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <p className="text-slate-500 font-bold text-sm leading-relaxed break-keep">{item.desc}</p>
                  </div>
                  {!item.active && (
                    <span className="absolute top-6 right-8 bg-amber-100 text-amber-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Wait</span>
                  )}
              </motion.div>
          ))}
      </section>

      {/* 🚀 하단 인사이트 섹션 (스마트팜 집중 노출) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
          <div className="lg:col-span-2 bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                  <span className="text-emerald-400 font-black tracking-widest text-xs uppercase italic">Smart Farm Intelligence</span>
                  <h3 className="text-4xl font-black leading-tight tracking-tighter italic">
                    "청년 창업농 보조금 환수의 <br/>
                    <span className="text-emerald-400 underline decoration-emerald-400/30 underline-offset-8">80%</span>는 부적절한 임대차 계약 때문입니다."
                  </h3>
                  <p className="text-slate-400 font-medium max-w-xl text-lg break-keep">
                    농지법 제23조 위반 여부를 NextLaw AI 엔진으로 지금 즉시 확인하고 정부 지원금을 안전하게 지키세요.
                  </p>
                  <button 
                    onClick={() => onNavigate('analyze')}
                    className="px-8 py-4 bg-emerald-600 rounded-2xl font-black text-sm hover:bg-white hover:text-slate-900 transition-all shadow-lg shadow-emerald-900/20"
                  >
                    스마트팜 계약서 정밀 분석하기
                  </button>
              </div>
              <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 opacity-10 rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000">
                <Leaf size={400} />
              </div>
          </div>

          <div className="bg-white rounded-[3.5rem] p-10 border border-slate-200 flex flex-col justify-between shadow-sm">
              <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-black text-slate-800 italic">Quick Connect</h4>
                    <TrendingUp size={20} className="text-emerald-500" />
                  </div>
                  <div className="space-y-5">
                      {[
                        { name: '스마트팜 시공 분쟁 전문', tag: '농지법' },
                        { name: 'IT 저작권 전문 변호사', tag: '하도급' },
                        { name: '임금체불 전문 노무사', tag: '근로기준' }
                      ].map((expert, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer group hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-100">
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-700 group-hover:text-emerald-700">{expert.name}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase">{expert.tag}</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-600" />
                          </div>
                      ))}
                  </div>
              </div>
              <button className="w-full py-4 bg-slate-100 rounded-2xl text-xs font-black text-slate-500 mt-8 hover:bg-slate-200 transition-colors tracking-widest uppercase">
                Find All Vertical Experts
              </button>
          </div>
      </section>
    </motion.div>
  );
};

export default Home;