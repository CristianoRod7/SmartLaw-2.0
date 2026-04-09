import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { 
  FileText, ArrowLeft, Download, Loader2, ShieldAlert, 
  MapPin, Scale, CheckCircle, AlertTriangle, Info, ShieldCheck
} from 'lucide-react';

const ReportView = ({ data, onReset }) => {
    const reportRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!data) return <div className="text-center py-40 font-black text-slate-400 italic">데이터를 불러오는 중입니다...</div>;

    // 🔥 [핵심 수정 1] 백엔드에서 에러가 날아왔을 때 안전하게 에러 화면 표시
    if (data.error) {
      return (
        <div className="text-center py-40 bg-white rounded-[3rem] border border-red-200 w-full mt-10">
            <h3 className="text-2xl font-black text-red-500 mb-2">분석 중 오류가 발생했습니다.</h3>
            <p className="text-slate-500 mb-6">{data.error}</p>
            <button onClick={onReset} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">다시 시도하기</button>
        </div>
      );
    }

    // 🔥 [핵심 수정 2] score 값이 없어도 에러가 나지 않도록 기본값(0) 처리
    const safeScore = Number(data.score) || 0;

    // 점수에 따른 스타일 결정
    const getScoreColor = (score) => {
      if (score >= 80) return 'text-emerald-500';
      if (score >= 50) return 'text-amber-500';
      return 'text-red-500';
    };

    const getStatusIcon = (status) => {
      if (status === 'Danger') return <ShieldAlert size={36} className="text-red-500" />;
      if (status === 'Warning') return <AlertTriangle size={36} className="text-amber-500" />;
      return <CheckCircle size={36} className="text-emerald-500" />;
    };

    const handleDownloadPdf = async () => {
  if (!reportRef.current) return;

  try {
    setIsGenerating(true);

    const dataUrl = await toPng(reportRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#f8fafc',
    });

    const img = new Image();
    img.src = dataUrl;

    img.onload = () => {
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = 210;
      const pageHeight = 297;

      const imgWidth = pageWidth - 20;
      const imgHeight = (img.height * imgWidth) / img.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(dataUrl, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 20);

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - 20);
      }

      pdf.save('NextLaw_Report.pdf');
      setIsGenerating(false);
    };
  } catch (error) {
    console.error('PDF 생성 오류:', error);
    alert('PDF 생성 중 오류가 발생했습니다.');
    setIsGenerating(false);
  }
};

    return (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="w-full pb-20 font-sans"
        >
            {/* 상단 헤더 컨트롤 바 */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4 px-2">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-900 p-3 rounded-xl text-white shadow-sm"><FileText size={26} /></div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">NextLaw AI 분석 리포트</h2>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-1">실시간 계약 리스크 진단 결과</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={onReset} className="text-slate-500 font-bold text-sm flex items-center gap-2 hover:text-slate-900 transition-all">
                        <ArrowLeft size={16} /> 다른 문서 검토
                    </button>
                    <button onClick={handleDownloadPdf} disabled={isGenerating} className="bg-slate-950 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-md disabled:opacity-50">
                        {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
                        PDF 다운로드
                    </button>
                </div>
            </div>

            {/* 리포트 본문 카드 */}
            <div ref={reportRef} className="space-y-12 p-2 sm:p-6 bg-slate-50 rounded-[3rem]">
                
                {/* 1. 요약 스코어 카드 */}
                <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                    <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-100" />
                            <circle 
                              cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="16" fill="transparent" 
                              strokeDasharray={534} 
                              strokeDashoffset={534 - (534 * safeScore) / 100} 
                              className={`${getScoreColor(safeScore)} transition-all duration-1000`} 
                            />
                        </svg>
                        <div className="absolute text-center">
                            <span className="text-5xl font-black italic text-slate-900">{safeScore}</span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Risk Score</p>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-black italic">AI 변호사 실전 리스크 진단</div>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">
                          종합 위험도: <span className={getScoreColor(safeScore)}>{safeScore < 50 ? '매우 높음' : '주의'}</span>
                        </h3>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-2xl break-keep">
                            {data.summary || "분석 요약을 불러올 수 없습니다."}
                        </p>
                    </div>
                </div>
                   {data.future_risk && (
  <div className="bg-white p-8 rounded-[2.3rem] border border-slate-200 shadow-sm">
    <h3 className="text-2xl font-black text-slate-900 mb-6">
      미래 리스크 시뮬레이션
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6">
        <h4 className="text-lg font-black text-amber-700 mb-4">6개월 후</h4>
        <div className="space-y-4">
          {(data.future_risk["6_months"] || []).map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-amber-100">
              <p className="font-black text-slate-900">{item.issue}</p>
              <p className="text-sm text-slate-600 mt-1">발생 확률: {item.probability}</p>
              <p className="text-sm text-slate-600">예상 피해: {item.impact}</p>
              <p className="text-sm text-slate-500 mt-2">원인: {item.reason}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-red-50 border border-red-100 p-6">
        <h4 className="text-lg font-black text-red-700 mb-4">1년 후</h4>
        <div className="space-y-4">
          {(data.future_risk["1_year"] || []).map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-red-100">
              <p className="font-black text-slate-900">{item.issue}</p>
              <p className="text-sm text-slate-600 mt-1">발생 확률: {item.probability}</p>
              <p className="text-sm text-slate-600">예상 피해: {item.impact}</p>
              <p className="text-sm text-slate-500 mt-2">원인: {item.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {data.actions && (
      <div className="mt-8 rounded-2xl bg-blue-50 border border-blue-100 p-6">
        <h4 className="text-lg font-black text-blue-800 mb-4">우선 조치 사항</h4>
        <ul className="space-y-2 text-sm font-bold text-slate-700">
          {data.actions.map((action, i) => (
            <li key={i}>• {action}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}
                {/* 2. 섹션별 상세 분석 내역 */}
                <div className="space-y-12">
                    {data.sections && data.sections.map((section, idx) => (
                        <div key={`sec-${idx}`} className="space-y-6">
                            <div className="flex items-center gap-3 ml-2">
                                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-blue-600">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800">{section.category}</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-5">
                                {section.items.map((item, i) => (
                                    <div key={`item-${i}`} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-start gap-8 group hover:border-blue-500 transition-all">
                                        <div className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-50 group-hover:bg-white transition-colors">
                                            {getStatusIcon(item.status)}
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center flex-wrap gap-x-3 gap-y-2">
                                                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600">
                                                    <MapPin size={12} /> {item.page}페이지 | {item.line}
                                                </div>
                                                <span className="text-xs font-black bg-slate-800 text-white px-3 py-1.5 rounded-full uppercase truncate max-w-[200px]">
                                                  {item.clause}
                                                </span>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${item.status === 'Danger' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                                                  {item.status}
                                                </span>
                                            </div>
                                            <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                                            <p className="text-slate-600 text-base leading-relaxed break-keep">{item.desc}</p>
                                            
                                            <div className="flex items-center gap-2 text-xs font-bold bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 inline-flex">
                                                <Scale size={14} className="text-slate-400" />
                                                <span className="text-slate-500">근거 법령: <span className="text-slate-700">{item.law}</span></span>
                                            </div>
                                            
                                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 mt-2">
                                                <p className="text-blue-800 text-sm font-bold leading-relaxed flex gap-2">
                                                  <Info size={16} className="shrink-0 mt-0.5" /> 
                                                  <span>수정 가이드: {item.tip}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ReportView;