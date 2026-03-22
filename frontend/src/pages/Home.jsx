import React, { useState } from 'react';
import axios from 'axios';
import { ShieldAlert, FileText, CheckCircle, AlertTriangle, Download, ArrowLeft, Loader2, BookOpenText, MapPin, AlignLeft, Scale, Gavel, Coins, RefreshCw, Lock, CloudRain, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

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

const getStatusStyles = (status) => {
  if (status === 'Danger') return { bg: 'bg-red-50 text-red-500', label: 'bg-red-500 text-white', icon: <ShieldAlert size={36} /> };
  if (status === 'Warning') return { bg: 'bg-amber-50 text-amber-500', label: 'bg-amber-500 text-white', icon: <ShieldAlert size={36} /> };
  return { bg: 'bg-emerald-50 text-emerald-500', label: 'bg-emerald-500 text-white', icon: <CheckCircle size={36} /> };
};

const Home = ({ result, setResult }) => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("파일을 선택해주세요.");
    setAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/analyze/contract', formData);
      let finalData = res.data?.data || res.data;
      if (typeof finalData === 'string') finalData = JSON.parse(finalData);
      if (finalData?.analysis_result) finalData = finalData.analysis_result; 

      console.log("🚀 리액트에 들어온 최종 데이터:", finalData);
      setResult(finalData);
    } catch (err) {
      console.error(err);
      alert("분석 실패: 백엔드 서버를 확인해주세요.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (result) {
    let safeSections = [];
    if (Array.isArray(result.sections)) {
      safeSections = result.sections;
    } else if (result.sections && typeof result.sections === 'object') {
      safeSections = Object.values(result.sections);
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-8 pb-24 px-4 font-sans text-slate-950">
        <button onClick={() => setResult(null)} className="flex items-center gap-2 text-slate-400 font-bold">
          <ArrowLeft size={20} /> 뒤로가기
        </button>

        <div id="report-content" className="space-y-8 bg-slate-50 p-8 rounded-[3rem]">
          {/* 상단 스코어 카드 */}
          <div className="bg-white rounded-[3rem] p-10 flex items-center gap-10 shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="relative w-40 h-40 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="72" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                <motion.circle 
                  initial={{ strokeDashoffset: 452 }} animate={{ strokeDashoffset: 452 - (452 * (result.score || 0)) / 100 }}
                  cx="80" cy="80" r="72" stroke="#ef4444" strokeWidth="12" fill="transparent" strokeDasharray="452" strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-black">
                <span className="text-5xl">{result.score || 0}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Risk Score</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              <h2 className="text-3xl font-black">계약 위험도: <span className="text-red-500">{(result.score || 0) <= 50 ? '매우 높음' : '보통'}</span></h2>
              <p className="text-slate-500 font-medium">{result.summary || "분석 결과를 불러왔습니다."}</p>
            </div>
          </div>

          {/* 🚀 [최종 진화] 블록 개별 방어막 탑재 */}
          <div className="space-y-12">
            {safeSections.length > 0 ? (
              safeSections.map((section, idx) => {
                try {
                  // 🛡️ 에러가 나더라도 여기서 잡히고, 다음 블록은 정상 렌더링 됨
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
                            <div key={`item-${i}`} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-start gap-8 group">
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
                                <h4 className="text-xl font-black group-hover:text-blue-600 transition-colors">{item?.title || "제목 없음"}</h4>
                                <p className="text-slate-500 text-base leading-relaxed">{item?.desc || "내용이 없습니다."}</p>
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
                  // 특정 블록에서 렌더링이 터져도 앱이 죽지 않게 방어
                  return (
                    <div key={`error-${idx}`} className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-bold">
                      🚨 {idx + 1}번째 블록 렌더링 중 오류 발생: {renderError.message}
                    </div>
                  );
                }
              })
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-red-200">
                <p className="text-red-500 font-bold text-xl">데이터는 받았으나 배열 형태가 아닙니다. F12 콘솔을 확인하세요.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-20 text-center space-y-12">
      <h2 className="text-6xl font-black italic">NextLaw 2.0</h2>
      <div 
        className={`h-80 border-4 border-dashed rounded-[3.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${file ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white hover:bg-slate-50'}`}
        onClick={() => !analyzing && document.getElementById('file-upload').click()}
      >
        <input id="file-upload" type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
        {analyzing ? <Loader2 className="w-12 h-12 text-blue-600 animate-spin" /> : <FileText size={48} className="text-slate-300" />}
        <p className="text-xl font-black">{file ? file.name : "계약서를 업로드하세요"}</p>
      </div>
      <button onClick={handleUpload} disabled={!file || analyzing} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl hover:bg-blue-600 shadow-2xl transition-all">
        {analyzing ? "AI 분석 중..." : "분석 시작"}
      </button>
    </div>
  );
};

export default Home;