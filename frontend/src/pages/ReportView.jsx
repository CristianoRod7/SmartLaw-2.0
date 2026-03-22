import React from 'react';
// 🚀 9개 블록에 필요한 모든 아이콘 추가 완료
import { ShieldAlert, AlertTriangle, ArrowLeft, Download, CheckCircle, MapPin, AlignLeft, Scale, Gavel, Coins, RefreshCw, Lock, CloudRain, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

// 🚀 Home.jsx에서 가져온 아이콘 맵
const ICON_MAP = {
  Coins: <Coins size={24} className="text-red-500" />,
  RefreshCw: <RefreshCw size={24} className="text-blue-500" />,
  Gavel: <Gavel size={24} className="text-purple-500" />,
  AlertTriangle: <AlertTriangle size={24} className="text-amber-500" />,
  ShieldAlert: <ShieldAlert size={24} className="text-red-500" />,
  Lock: <Lock size={24} className="text-slate-500" />,
  CloudRain: <CloudRain size={24} className="text-blue-400" />,
  ShieldCheck: <ShieldCheck size={24} className="text-emerald-500" />
};

// 🚀 Home.jsx에서 가져온 상태별 스타일 헬퍼
const getStatusStyles = (status) => {
  if (status === 'Danger') return { bg: 'bg-red-50 text-red-500', label: 'bg-red-500 text-white', icon: <ShieldAlert size={36} /> };
  if (status === 'Warning') return { bg: 'bg-amber-50 text-amber-500', label: 'bg-amber-500 text-white', icon: <ShieldAlert size={36} /> };
  return { bg: 'bg-emerald-50 text-emerald-500', label: 'bg-emerald-500 text-white', icon: <CheckCircle size={36} /> };
};

const ReportView = ({ data, setView }) => {
    // 데이터가 없으면 홈으로 보냄
    if (!data) return <div className="text-center py-40 font-black text-slate-400 italic">데이터를 불러오는 중입니다...</div>;

    // 🚀 강제 배열 변환 방어막 (Home.jsx에서 이식)
    let safeSections = [];
    if (Array.isArray(data.sections)) {
        safeSections = data.sections;
    } else if (data.sections && typeof data.sections === 'object') {
        safeSections = Object.values(data.sections);
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20 font-sans">
            <div className="flex justify-between items-center">
                <button onClick={() => setView('home')} className="text-slate-400 font-bold flex items-center gap-2 hover:text-slate-900 transition-all">
                    <ArrowLeft size={18} /> 다른 문서 검토
                </button>
                <button className="bg-slate-950 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl">
                    <Download size={18} /> AI 법률 리포트 PDF 저장
                </button>
            </div>

            {/* 🚀 상단 스코어 카드 (기존 UI 완벽 유지) */}
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-50 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-100" />
                        <circle cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray={534} strokeDashoffset={534 - (534 * data.score) / 100} className={`${data.score < 50 ? 'text-red-500' : 'text-emerald-500'} transition-all duration-1000`} />
                    </svg>
                    <div className="absolute text-center">
                        <span className="text-5xl font-black italic text-slate-900">{data.score}</span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Risk Score</p>
                    </div>
                </div>
                <div className="flex-1 space-y-4">
                    <div className="inline-block bg-red-50 text-red-600 px-4 py-1 rounded-full text-xs font-black italic">AI 변호사 실전 리스크 진단</div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">계약 위험도: <span className="text-red-600">{data.score < 50 ? '매우 높음' : '보통'}</span></h3>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">{data.summary}</p>
                </div>
            </div>

            {/* 🚀 9개 블록 렌더링 섹션 (Home.jsx에서 이식된 무적 로직) */}
            <div className="space-y-12">
                {safeSections.length > 0 ? (
                    safeSections.map((section, idx) => {
                        try {
                            return (
                                <div key={`sec-${idx}`} className="space-y-6">
                                    <div className="flex items-center gap-3 ml-2">
                                        <div className="p-2.5 bg-white rounded-xl shadow-inner border border-slate-100">
                                            {ICON_MAP[section?.icon_type] || <ShieldAlert size={24} className="text-slate-300" />}
                                        </div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">{section?.category || `섹션 ${idx + 1}`}</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-5">
                                        {Array.isArray(section?.items) ? section.items.map((item, i) => {
                                            const styles = getStatusStyles(item?.status); 
                                            return (
                                                <div key={`item-${i}`} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-start gap-8 group hover:border-blue-500 transition-all">
                                                    <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${styles.bg}`}>
                                                        {styles.icon}
                                                    </div>
                                                    <div className="space-y-4 flex-1">
                                                        <div className="flex items-center flex-wrap gap-x-3 gap-y-2">
                                                            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-bold text-slate-500">
                                                                <MapPin size={12} /> {item?.page || "-"} | {item?.line || "-"}
                                                            </div>
                                                            <span className="text-xs font-black bg-slate-900 text-white px-3 py-1.5 rounded-full uppercase">{item?.clause || "-"}</span>
                                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${styles.label}`}>
                                                                {item?.status || "Unknown"}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-xl font-black group-hover:text-blue-600 transition-colors text-slate-900">{item?.title || "제목 없음"}</h4>
                                                        <p className="text-slate-500 text-base leading-relaxed">{item?.desc || "내용이 없습니다."}</p>
                                                        <div className="flex items-center gap-2 text-xs font-bold bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 inline-flex">
                                                            <Scale size={14} className="text-slate-400" />
                                                            <span className="text-slate-500">근거 법령: <span className="text-slate-700">{item?.law || "-"}</span></span>
                                                        </div>
                                                        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 mt-2">
                                                            <p className="text-blue-800 text-sm font-bold leading-relaxed">💡 {item?.tip || "전문가 팁이 제공되지 않았습니다."}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }) : (
                                            <div className="p-5 text-amber-600 font-bold bg-amber-50 rounded-2xl">
                                                ⚠️ 이 섹션의 상세 항목(items) 데이터가 없습니다.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        } catch (renderError) {
                            return (
                                <div key={`error-${idx}`} className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-bold">
                                    🚨 {idx + 1}번째 블록 렌더링 중 오류 발생: {renderError.message}
                                </div>
                            );
                        }
                    })
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-red-200">
                        <p className="text-red-500 font-bold text-xl">분석 데이터(sections)를 불러올 수 없습니다.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ReportView;