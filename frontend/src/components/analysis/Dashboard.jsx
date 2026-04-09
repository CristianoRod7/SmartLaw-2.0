import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, Leaf, Scale, BarChart3, ArrowUpRight, TrendingUp, ChevronRight } from 'lucide-react';

const Dashboard = ({ onNavigate }) => {
  const menuItems = [
    { id: 'it', title: "IT 외주 가디언", desc: "SOW 확정 및 IP 분쟁 방지", icon: <Cpu />, color: "bg-purple-50 text-purple-600", active: true },
    { id: 'farm', title: "스마트팜 허브", desc: "농지법 및 보조금 서류 검토", icon: <Leaf />, color: "bg-emerald-50 text-emerald-600", active: true },
    { id: 'legal', title: "법률 라이브러리", desc: "내용증명 등 양식 무상 제공", icon: <Scale />, color: "bg-blue-50 text-blue-600", active: true },
    { id: 'biz', title: "비즈니스 지표", desc: "계약 리스크 통합 관리", icon: <BarChart3 />, color: "bg-slate-50 text-slate-600", active: false }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
      <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest border border-blue-100">
              <Zap size={14} /> Welcome Back, NextLaw Hub
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[1.1]">
              Manage Your Business <br/><span className="text-slate-400">Without Any Legal Risks.</span>
          </h2>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
              <motion.div 
                  key={item.id} 
                  whileHover={{ y: -8 }} 
                  onClick={() => item.active && onNavigate(item.id)} 
                  className={`group p-8 rounded-[3rem] border border-slate-200 bg-white cursor-pointer relative transition-all ${!item.active && 'opacity-60 cursor-not-allowed'}`}
              >
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-sm`}>{React.cloneElement(item.icon, { size: 32 })}</div>
                  <div className="space-y-3">
                      <div className="flex justify-between items-center"><h3 className="text-xl font-black text-slate-900">{item.title}</h3><ArrowUpRight size={20} className="text-slate-300 group-hover:text-blue-600" /></div>
                      <p className="text-slate-500 font-bold text-sm leading-relaxed">{item.desc}</p>
                  </div>
              </motion.div>
          ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                  <span className="text-blue-500 font-black tracking-widest text-xs uppercase">Market Intelligence</span>
                  <h3 className="text-4xl font-black leading-tight tracking-tighter italic">"IT 외주 계약 시 <span className="text-blue-500">SOW 구체화</span>가 <br/>분쟁 예방의 92%를 차지합니다."</h3>
                  <button onClick={() => onNavigate('recommend')} className="px-8 py-3.5 bg-blue-600 rounded-2xl font-black text-sm hover:bg-white hover:text-slate-900 transition-all">최신 트렌드 리포트 읽기</button>
              </div>
          </div>
          <div className="bg-white rounded-[3.5rem] p-10 border border-slate-200 flex flex-col justify-between">
              <div className="space-y-6">
                  <h4 className="text-lg font-black text-slate-800">Quick Connect</h4>
                  <div className="space-y-4">
                      {['스마트팜 농지법 상담', 'IT 저작권 전문 변호사', '임금체불 전문 노무사'].map((expert, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all font-bold text-slate-700">
                              {expert} <ChevronRight size={16} />
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>
    </motion.div>
  );
};

export default Dashboard;