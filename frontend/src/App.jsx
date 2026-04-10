import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  ShieldCheck, Coins, Settings, ArrowUpRight, Cpu, Leaf, Scale,
  BarChart3, TrendingUp, ChevronRight, ArrowLeft, CheckCircle2,
  UploadCloud, Loader2, ChevronDown, ShieldAlert, AlertTriangle,
  Download, FileText, Sparkles, BookOpen
} from 'lucide-react';

import LegalDashboard from './modules/core_analyze/ui/legal_hub/ui/LegalDashboard';
import SmartFarmDashboard from './modules/core_analyze/ui/farm_hub/ui/SmartFarmDashboard';
import ITDashboard from './modules/core_analyze/ui/it_hub/ui/ITDashboard';
import Recommend from './pages/Recommend';
import ReportView from "./modules/core_analyze/ui/ReportView.jsx";
import Simulator from './modules/smartfarm_simulator/pages/Simulator.jsx';
// =========================================================================
// 🧱 [Constants & Shared Logic]
// =========================================================================
const MAX_FREE_TOKENS = 100000;

const ICON_MAP = {
  ShieldAlert: <ShieldAlert size={24} className="text-red-500" />,
  ShieldCheck: <ShieldCheck size={24} className="text-emerald-500" />,
  AlertTriangle: <AlertTriangle size={24} className="text-amber-500" />
};

// =========================================================================
// 1. Home / Dashboard Component
// =========================================================================
const Home = ({ onNavigate }) => {
  const menuItems = [
    { id: 'farm', title: '스마트팜 허브', desc: '농지법 검토 및 보조금 리스크 스캔', icon: <Leaf size={32} />, color: 'bg-emerald-50 text-emerald-600', active: true },
    { id: 'it', title: 'IT 외주 가디언', desc: 'SOW 확정 및 IP 분쟁 방지', icon: <Cpu size={32} />, color: 'bg-purple-50 text-purple-600', active: true },
    { id: 'legal', title: '법률 라이브러리', desc: '7대 필수 서류 양식 무상 제공', icon: <Scale size={32} />, color: 'bg-blue-50 text-blue-600', active: true },
    { id: 'biz', title: '비즈니스 지표', desc: '계약 리스크 통합 관리 대시보드', icon: <BarChart3 size={32} />, color: 'bg-slate-50 text-slate-600', active: false }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-12 w-full"
    >
      <section className="space-y-4 px-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest border border-emerald-100">
          <Sparkles size={14} /> Smart Farm Priority Mode
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[1.1]">
          NextLaw Hub <br />
          <span className="text-slate-400">Safe Business Infrastructure.</span>
        </h2>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-2">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -8 }}
            onClick={() => item.active && onNavigate(item.id)}
            className={`group p-8 rounded-[3rem] border border-slate-200 bg-white cursor-pointer relative transition-all ${!item.active ? 'opacity-60 cursor-not-allowed' : ''}`}
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
              <span className="absolute top-6 right-8 bg-amber-100 text-amber-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Wait
              </span>
            )}
          </motion.div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
        <div className="lg:col-span-2 bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden group">
          <div className="relative z-10 space-y-6">
            <span className="text-emerald-400 font-black tracking-widest text-xs uppercase italic">Smart Farm Intelligence</span>
            <h3 className="text-4xl font-black leading-tight tracking-tighter italic">
              "청년 창업농 보조금 환수의 <br />
              <span className="text-emerald-400 underline decoration-emerald-400/30 underline-offset-8">80%</span>는 부적절한 임대차 계약 때문입니다."
            </h3>
            <button
              onClick={() => onNavigate('recommend')}
              className="px-8 py-4 bg-emerald-600 rounded-2xl font-black text-sm hover:bg-white hover:text-slate-900 transition-all shadow-lg shadow-emerald-900/20"
            >
              최신 트렌드 리포트 읽기
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-200 flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-black text-slate-800 italic">Quick Connect</h4>
              <TrendingUp size={20} className="text-emerald-500" />
            </div>
            <div className="space-y-5">
              {['스마트팜 시공 분쟁 전문', 'IT 저작권 전문 변호사', '임금체불 전문 노무사'].map((expert, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer group hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-100"
                >
                  <span className="font-bold text-slate-700 group-hover:text-emerald-700">{expert}</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};


// =========================================================================
// 2. Analyze Component
// =========================================================================
const getIndustryFromCategory = (category) => {
  if (!category) return "general";
  
  if (
    category.includes("스마트팜") ||
    category.includes("농지") ||
    category.includes("보조금")
  ) return "smartfarm";

  if (category.includes("IT") || category.includes("외주") || category.includes("개발")) return "it";
  if (category.includes("부동산")) return "real_estate";

  return "general";
};

const sampleFiles = {
  "스마트팜 구축 계약": "/samples/smartfarm_build.pdf",
  "농지 임대차 계약": "/samples/farmland_lease.pdf",
  "보조금 관련 문서": "/samples/subsidy.pdf",
  "스마트팜 종합 분석": "/samples/smartfarm_full.pdf",
};

const Analyze = ({ onBack, onComplete, initialCategory }) => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "스마트팜 구축 계약");

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleUpload = async (targetFile = file) => {
    if (!targetFile) return alert("파일을 선택해주세요.");
    setAnalyzing(true);

    const industry = getIndustryFromCategory(selectedCategory);

    const formData = new FormData();
    formData.append("file", targetFile);
    formData.append("industry", industry);
    formData.append("document_type", selectedCategory);

    try {
      const res = await axios.post("http://localhost:8000/api/v1/analyze/contract", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      console.log("백엔드 원본 응답:", res.data);

      const finalData = res.data?.data || res.data;
      console.log("최종 렌더링 데이터:", finalData);

      onComplete(finalData);
    } catch (err) {
      console.error(err);

      const status = err.response?.status;
      const detail = err.response?.data?.detail || "";

      if (status === 503 && (String(detail).includes("quota") || String(detail).includes("429"))) {
        alert("Gemini 무료 사용량을 초과했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert("분석 실패: " + (detail || "백엔드 서버를 확인해주세요."));
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSampleAnalyze = async () => {
    const url = sampleFiles[selectedCategory];

    if (!url) {
      alert("이 문서 유형에 연결된 샘플 파일이 없습니다.");
      return;
    }

    try {
      setAnalyzing(true);

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("샘플 파일을 불러오지 못했습니다.");
      }

      const blob = await res.blob();
      const sampleFile = new File([blob], url.split("/").pop(), {
        type: "application/pdf",
      });

      setFile(sampleFile);
      await handleUpload(sampleFile);
    } catch (err) {
      console.error(err);
      alert("샘플 분석 실패: 샘플 파일 로드 중 문제가 발생했습니다.");
      setAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          AI 계약서 자동 검토
        </h2>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-xl relative overflow-hidden">
        {analyzing && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-10 text-center">
            <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mb-6" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">분석 중...</h3>
            <p className="text-slate-500 font-bold animate-pulse">
              독소조항을 정밀 스캔하고 있습니다.
            </p>
          </div>
        )}

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-extrabold text-slate-700 ml-1">
              계약서 종류
            </label>
            <div className="relative">
              <select
                className="w-full font-bold bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="스마트팜 구축 계약">🌱 스마트팜 구축 계약</option>
                <option value="농지 임대차 계약">🚜 농지 임대차 계약</option>
                <option value="보조금 관련 문서">📑 보조금 관련 문서</option>
                <option value="스마트팜 종합 분석">🧠 스마트팜 종합 분석</option>
                <option value="IT 외주 계약서">💻 IT 외주 / 개발 계약서</option>
                <option value="부동산 임대차 계약서">🏠 부동산 임대차 계약서</option>
              </select>
              <ChevronDown
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-extrabold text-slate-700 ml-1">
              문서 업로드
            </label>
            <div
              className={`h-56 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                file
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-300 bg-slate-50 hover:bg-slate-100"
              }`}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.txt"
              />
              {file ? (
                <CheckCircle2 size={40} className="text-emerald-600" />
              ) : (
                <UploadCloud size={40} className="text-slate-400" />
              )}
              <p className="font-bold text-slate-600">
                {file ? file.name : "클릭하여 파일을 선택하세요"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleUpload}
              disabled={!file || analyzing}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-md disabled:opacity-50"
            >
              업로드 파일 분석
            </button>

            <button
              onClick={handleSampleAnalyze}
              disabled={analyzing}
              className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all shadow-md disabled:opacity-50"
            >
              샘플로 바로 분석
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
// =========================================================================
// 3. ReportView Component
// =========================================================================


// =========================================================================
// 4. Fallback Consultant Component
// =========================================================================
const Consultant = ({ onBack }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">법률 라이브러리</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['표준 임대차 계약서', 'IT 개발 용역 계약서', '비밀유지계약서(NDA)', '개인정보처리방침'].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-blue-500 cursor-pointer transition-all flex justify-between items-center group">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><BookOpen /></div>
              <span className="font-black text-lg">{item}</span>
            </div>
            <Download size={20} className="text-slate-300 group-hover:text-blue-500" />
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================================
// 5. Recommend Component
// =========================================================================


// =========================================================================
// 🚀 [Main App Controller]
// =========================================================================
const App = () => {
  const [simData, setSimData] = useState(null);
  const [view, setView] = useState('home');
  const [reportData, setReportData] = useState(null);
  const [usedTokens, setUsedTokens] = useState(0);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('스마트팜 구축 계약');

  useEffect(() => {
    const syncTokens = () => setUsedTokens(parseInt(localStorage.getItem('nextlaw_used_tokens') || '1200', 10));
    syncTokens();
    window.addEventListener('tokensUpdated', syncTokens);
    return () => window.removeEventListener('tokensUpdated', syncTokens);
  }, []);

  const handleAnalysisComplete = (data) => {
    setReportData(data);
    setView('report');
  };

  const remainingTokens = Math.max(0, MAX_FREE_TOKENS - usedTokens);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-10">

        <nav className="flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-6 z-40 p-4 px-8 rounded-[2.5rem] border border-white/20 shadow-sm">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              setView('home');
              setReportData(null);
            }}
          >
            <div className="bg-slate-900 p-2 rounded-xl text-white shadow-lg"><ShieldCheck size={24} /></div>
            <h1 className="text-2xl font-black tracking-tighter italic text-slate-900">
              NextLaw <span className="text-blue-600 italic">Hub</span>
            </h1>
          </div>

          <div className="flex items-center gap-8 font-black text-[13px] uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
              <Coins size={14} className="text-amber-500" />
              <span className="text-slate-900">{remainingTokens.toLocaleString()} Credits</span>
            </div>
            <button className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-blue-600 transition-all">
              <Settings size={18} />
            </button>
          </div>
        </nav>

        <AnimatePresence mode="wait">
          {view === 'home' && <Home key="home" onNavigate={setView} />}

          {view === 'farm' && (
            <SmartFarmDashboard
                key="farm"
                onBack={() => setView('home')}
                onNavigateToAnalysis={(type) => {
                  setSelectedAnalysisType(type);
                  setView('analysis');
                }}
                onNavigateToSimulator={() => {
                  setView('simulator');
                }}
              />
          )}

          {view === 'it' && (
            <ITDashboard
              key="it"
              onBack={() => setView('home')}
              onNavigateToAnalysis={(type) => {
                setSelectedAnalysisType(type);
                setView('analysis');
              }}
            />
          )}

          {view === 'legal' && (
            <LegalDashboard
              key="legal"
              onBack={() => setView('home')}
              onAnalyze={(type = '부동산 임대차 계약서') => {
                setSelectedAnalysisType(type);
                setView('analysis');
              }}
            />
          )}

          {view === 'analysis' && (
            <Analyze
              key="analysis"
              onBack={() => setView('home')}
              onComplete={handleAnalysisComplete}
              initialCategory={selectedAnalysisType}
            />
          )}

          {view === 'recommend' && (
            <Recommend
              key="recommend"
              onBack={() => setView('home')}
            />
          )}

          {view === 'report' && reportData && (
            <ReportView
              key="report"
              data={reportData}
              onReset={() => {
                setView('home');
                setReportData(null);
              }}
            />
          )}

          {view === 'simulator' && (
          <Simulator
            onBack={() => setView('farm')}
            onComplete={(data) => {
              setSimData(data);
              setView('sim-result');
            }}
          />
        )}

        {view === 'sim-result' && simData && (
          <ReportView
            data={simData}
            onReset={() => {
              setView('farm');
              setSimData(null);
            }}
          />
        )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;