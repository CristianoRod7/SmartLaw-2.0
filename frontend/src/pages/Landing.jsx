import React from 'react';
import { ShieldCheck, MapPin, History, Zap, ChevronRight, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

// 💡 4.33 학점 우진이를 위한 디자인 꿀팁:
// 타이포그래피는 두께(weight), 자간(tracking), 행간(leading), 색상(slate)의 조화야!

const Landing = ({ setView }) => {
  const menus = [
    {
      id: 'analysis',
      title: "Law Protector",
      desc: "AI 계약서 자동 분석 및 리포트 생성",
      icon: <ShieldCheck size={40} strokeWidth={1.5} />,
      color: "bg-blue-600",
      shadow: "shadow-blue-200"
    },
    {
      id: 'recommend',
      title: "Smart Matcher",
      desc: "직장 거리 및 예산 맞춤 주거지 추천",
      icon: <MapPin size={40} strokeWidth={1.5} />,
      color: "bg-emerald-500",
      shadow: "shadow-emerald-200"
    },
    {
      id: 'history',
      title: "My Reports",
      desc: "과거 분석 내역 및 보관된 리포트 확인",
      icon: <History size={40} strokeWidth={1.5} />,
      color: "bg-slate-800",
      shadow: "shadow-slate-200"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-10 px-4 md:px-0">
      {/* 🚀 히어로 섹션 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-5"
      >
        {/* 배지 타이포그래피: 좁은 자간, 진한 색, 아주 두꺼움 */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest border border-blue-100">
          <Zap size={14} fill="currentColor" /> Welcome to NextLaw 2.0
        </div>
        
        {/* 메인 제목 타이포그래피: tracking-tighter(자간 좁힘)로 임팩트 극대화, font-black(900) */}
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.15]">
          청년의 주거와 법률을 <br/> <span className="text-blue-600">하나의 플랫폼</span>에서.
        </h1>
        
        {/* 본문 타이포그래피: text-slate-500(조금 연하게), text-lg, font-medium, leading-relaxed(행간 넓힘) */}
        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed tracking-tight">
          대한민국 청년을 위한 올인원 솔루션, NextLaw. <br/>
          계약서 검토부터 최적의 매물 추천까지 AI가 함께합니다.
        </p>
      </motion.div>

      {/* 🚀 메뉴 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {menus.map((menu, i) => (
          <motion.div
            key={menu.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10 }}
            onClick={() => setView(menu.id)}
            className="group cursor-pointer"
          >
            <div className={`h-full bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl ${menu.shadow} transition-all group-hover:border-blue-500 relative overflow-hidden flex flex-col`}>
              {/* 배경 장식 아이콘 */}
              <div className="absolute -right-6 -bottom-6 text-slate-50 opacity-10 group-hover:text-blue-50 transition-colors">
                {menu.icon}
              </div>
              
              <div className={`w-20 h-20 ${menu.color} text-white rounded-[1.5rem] flex items-center justify-center mb-10 shadow-lg relative z-10`}>
                {menu.icon}
              </div>
              
              {/* 카드 제목: font-black, text-slate-900 */}
              <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center justify-between tracking-tight relative z-10">
                {menu.title}
                <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </h3>
              
              {/* 카드 본문: text-slate-500, font-medium, leading-relaxed */}
              <p className="text-slate-500 font-medium leading-relaxed tracking-tight flex-grow relative z-10 text-sm">
                {menu.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🚀 최근 활동 섹션 (화면을 꽉 채워줌) */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm"
      >
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
          <h4 className="text-xl font-black text-slate-800 flex items-center gap-2.5 tracking-tight">
            <Clock className="text-blue-600" size={22} /> 최근 나의 활동
          </h4>
          <button onClick={() => setView('history')} className="text-sm font-bold text-blue-600 hover:text-blue-700 active:scale-95 transition-all">전체보기</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ActivityCard icon={<ShieldCheck className="text-blue-600" size={20}/>} title="상도동 빌라 계약서 분석" date="2026.03.18" info="점수 92점" color="bg-blue-50/50" borderColor="hover:border-blue-100" />
          <ActivityCard icon={<MapPin className="text-emerald-500" size={20}/>} title="강남역 인근 추천 지역 검색" date="2026.03.19" info="매칭 3건" color="bg-emerald-50/50" borderColor="hover:border-emerald-100" />
        </div>
      </motion.div>
    </div>
  );
};

// 최근 활동 카드 컴포넌트 (타이포그래피 세팅)
const ActivityCard = ({ icon, title, date, info, color, borderColor }) => (
    <div className={`flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-transparent ${borderColor} transition-all cursor-pointer group`}>
        <div className="flex items-center gap-4">
            <div className={`p-3.5 bg-white rounded-xl shadow-sm border border-slate-100`}>{icon}</div>
            <div>
                {/* 제목: font-bold, text-slate-900 */}
                <p className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-blue-600 transition-colors">{title}</p>
                {/* 정보: font-medium, text-slate-400 */}
                <p className="text-xs text-slate-400 font-medium tracking-tight mt-0.5">{date} · <span className="text-blue-500 font-bold">{info}</span></p>
            </div>
        </div>
        <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
    </div>
);

export default Landing;