import React, { useRef, useState, useEffect } from 'react';
import { 
    ShieldAlert, AlertTriangle, ArrowLeft, Download, CheckCircle, 
    MapPin, Scale, Gavel, Coins, RefreshCw, Lock, CloudRain, 
    ShieldCheck, Loader2, FileText 
} from 'lucide-react';
import { motion } from 'framer-motion';

// 공통 아이콘 맵
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

// 상태별 스타일 헬퍼
const getStatusStyles = (status) => {
  if (status === 'Danger') return { bg: 'bg-red-50 text-red-500', label: 'bg-red-500 text-white', icon: <ShieldAlert size={36} /> };
  if (status === 'Warning') return { bg: 'bg-amber-50 text-amber-500', label: 'bg-amber-500 text-white', icon: <ShieldAlert size={36} /> };
  return { bg: 'bg-emerald-50 text-emerald-500', label: 'bg-emerald-500 text-white', icon: <CheckCircle size={36} /> };
};

// 위치(페이지/줄) 포맷 헬퍼
const formatLocation = (page, line) => {
    const pStr = page ? String(page) : "";
    const pNum = pStr.replace(/[^0-9]/g, ''); 
    const pText = pNum ? `${pNum}페이지` : "전체";

    const lStr = line ? String(line) : "";
    let lText = "";
    if (lStr.length > 0 && lStr.length < 15) {
        const lNum = lStr.replace(/[^0-9~-]/g, '');
        if (lNum) lText = ` | ${lNum}번째 줄`;
    }
    return `${pText}${lText}`;
};

// 사용자 직관성을 위한 변수 세팅
const MAX_FREE_TOKENS = 100000; 
const AVG_CHAT_TOKEN = 400;   
const AVG_DOC_TOKEN = 2500;   

const ReportView = ({ data, setView }) => {
    const reportRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // 로컬 스토리지 연동하여 전역 토큰 공유
    const [usedTokens, setUsedTokens] = useState(0);

    useEffect(() => {
        setUsedTokens(parseInt(localStorage.getItem('nextlaw_used_tokens') || '0', 10));
    }, []);

    if (!data) return <div className="text-center py-40 font-black text-slate-400 italic">데이터를 불러오는 중입니다...</div>;

    let safeSections = [];
    if (Array.isArray(data.sections)) safeSections = data.sections;
    else if (data.sections && typeof data.sections === 'object') safeSections = Object.values(data.sections);

    const handleDownloadPdf = async () => {
        const element = reportRef.current;
        if (!element) return;

        setIsGenerating(true); 

        try {
            if (!window.htmlToImage) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
            }

            if (!window.jspdf) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
            }

            const dataUrl = await window.htmlToImage.toPng(element, {
                pixelRatio: 2, 
                backgroundColor: '#f8fafc',
                style: { margin: '0', padding: '20px' }
            });

            const pdfWidth = 210; 
            const tempPdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
            const imgProps = tempPdf.getImageProperties(dataUrl);
            const customPdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            const pdf = new window.jspdf.jsPDF('p', 'mm', [pdfWidth, customPdfHeight]);
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, customPdfHeight);

            pdf.save('NextLaw_AI_법률_리포트.pdf');
        } catch (error) {
            console.error('PDF 생성 중 오류 발생:', error);
            alert('PDF 생성 중 오류가 발생했습니다. 개발자 도구(F12)를 확인해주세요.');
        } finally {
            setIsGenerating(false); 
        }
    };

    const remainingTokens = Math.max(0, MAX_FREE_TOKENS - usedTokens);
    const remainingChats = Math.floor(remainingTokens / AVG_CHAT_TOKEN);
    const remainingDocs = Math.floor(remainingTokens / AVG_DOC_TOKEN);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[1600px] px-4 md:px-8 mx-auto pb-20 font-sans">
            
            {/* 🚀 상단 컨트롤 바: 강제 한 줄 고정(whitespace-nowrap) 및 압축 방어(shrink-0) 적용 완료! */}
            <div className="flex flex-wrap xl:flex-nowrap justify-between items-center mb-8 gap-4 px-2 shrink-0 print:hidden">
                <div className="flex items-center gap-4 min-w-0 shrink-0">
                    <div className="bg-blue-900 p-3 rounded-xl text-white shadow-sm shrink-0"><FileText size={26} /></div>
                    <div className="min-w-0">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight truncate">NextLaw AI 분석 리포트</h2>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-1 truncate">AI 변호사의 조항별 위험도 상세 진단 결과</p>
                    </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center gap-3 shrink-0">
                    {/* 🚀 글자 찌그러짐 원천 차단 (whitespace-nowrap shrink-0) */}
                    <div 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-full text-[11px] sm:text-xs font-bold cursor-help shadow-sm whitespace-nowrap shrink-0"
                        title="현재 제공된 10만 무료 토큰 기준, 향후 가능한 작업 예상 횟수입니다."
                    >
                        <Coins size={14} className="text-amber-500" />
                        <span>잔여 <span className="text-slate-900 font-black">{remainingTokens.toLocaleString()}</span></span>
                        <span className="opacity-30">|</span>
                        <span>💬 <span className="text-blue-600 font-black">{remainingChats}</span>번</span>
                        <span className="opacity-30">|</span>
                        <span>📄 <span className="text-emerald-600 font-black">{remainingDocs}</span>번</span>
                    </div>

                    <button onClick={() => setView(null)} className="text-slate-500 font-bold text-sm flex items-center gap-2 hover:text-slate-900 transition-all whitespace-nowrap shrink-0">
                        <ArrowLeft size={16} /> 다른 문서 검토
                    </button>
                    
                    <button 
                        onClick={handleDownloadPdf} 
                        disabled={isGenerating}
                        className="bg-slate-950 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                    >
                        {isGenerating ? (
                            <><Loader2 size={16} className="animate-spin" /> 리포트 캡처 중...</>
                        ) : (
                            <><Download size={16} /> PDF 다운로드</>
                        )}
                    </button>
                </div>
            </div>

            {/* 여기서부터 PDF로 저장될 "리포트 영역" */}
            <div ref={reportRef} className="space-y-12 p-2 sm:p-6 bg-slate-50 rounded-[3rem]">
                {/* 상단 스코어 카드 */}
                <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                    <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-100" />
                            <circle cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray={534} strokeDashoffset={534 - (534 * data.score) / 100} className={`${data.score < 50 ? 'text-red-500' : 'text-emerald-500'} transition-all duration-1000`} />
                        </svg>
                        <div className="absolute text-center">
                            <span className="text-5xl font-black italic text-slate-900">{data.score}</span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Risk Score</p>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4 min-w-0">
                        <div className="inline-block bg-red-50 text-red-600 px-4 py-1 rounded-full text-xs font-black italic">AI 변호사 실전 리스크 진단</div>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">계약 위험도: <span className="text-red-600">{data.score < 50 ? '매우 높음' : '보통'}</span></h3>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-2xl break-keep">{data.summary}</p>
                    </div>
                </div>

                {/* 9개 블록 렌더링 섹션 */}
                <div className="space-y-12">
                    {safeSections.length > 0 ? (
                        safeSections.map((section, idx) => {
                            try {
                                return (
                                    <div key={`sec-${idx}`} className="space-y-6">
                                        <div className="flex items-center gap-3 ml-2">
                                            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                                                {ICON_MAP[section?.icon_type] || <ShieldAlert size={24} className="text-slate-300" />}
                                            </div>
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800">{section?.category || `섹션 ${idx + 1}`}</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 gap-5">
                                            {Array.isArray(section?.items) ? section.items.map((item, i) => {
                                                const styles = getStatusStyles(item?.status); 
                                                return (
                                                    <div key={`item-${i}`} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-start gap-8 group hover:border-blue-500 transition-all">
                                                        <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${styles.bg}`}>
                                                            {styles.icon}
                                                        </div>
                                                        <div className="space-y-4 flex-1 min-w-0">
                                                            <div className="flex items-center flex-wrap gap-x-3 gap-y-2">
                                                                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 shrink-0 whitespace-nowrap">
                                                                    <MapPin size={12} /> 
                                                                    {formatLocation(item?.page, item?.line)}
                                                                </div>
                                                                
                                                                <span 
                                                                    className="text-xs font-black bg-slate-800 text-white px-3 py-1.5 rounded-full uppercase inline-block max-w-[150px] sm:max-w-[250px] md:max-w-[400px] truncate align-middle shrink-0"
                                                                    title={item?.clause} 
                                                                >
                                                                    {item?.clause || "-"}
                                                                </span>
                                                                
                                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded shrink-0 whitespace-nowrap ${styles.label}`}>
                                                                    {item?.status || "Unknown"}
                                                                </span>
                                                            </div>
                                                            <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors break-keep">{item?.title || "제목 없음"}</h4>
                                                            <p className="text-slate-600 text-base leading-relaxed break-keep">{item?.desc || "내용이 없습니다."}</p>
                                                            <div className="flex items-center gap-2 text-xs font-bold bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 inline-flex">
                                                                <Scale size={14} className="text-slate-400 shrink-0" />
                                                                <span className="text-slate-500 break-keep">근거 법령: <span className="text-slate-700">{item?.law || "-"}</span></span>
                                                            </div>
                                                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 mt-2">
                                                                <p className="text-blue-800 text-sm font-bold leading-relaxed break-keep">💡 {item?.tip || "전문가 팁이 제공되지 않았습니다."}</p>
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
            </div>
        </motion.div>
    );
};

export default ReportView;