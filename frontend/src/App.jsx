import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ShieldCheck, Coins, Settings } from 'lucide-react';

import Home from './pages/Home';
import Analyze from './modules/core_analyze/ui/Analyze';
import ReportView from './modules/core_analyze/ui/ReportView.jsx';
import Simulator from './modules/smartfarm_simulator/Simulator';
import LegalDashboard from './modules/core_analyze/ui/legal_hub/ui/LegalDashboard';
import SmartFarmDashboard from './modules/core_analyze/ui/farm_hub/ui/SmartFarmDashboard';
import ITDashboard from './modules/core_analyze/ui/it_hub/ui/ITDashboard';
import Recommend from './pages/Recommend';
import AiRiskConsult from './pages/AiRiskConsult';
import AnalysisHistory from './pages/AnalysisHistory';
import SimulatorResultView from "./modules/smartfarm_simulator/SimulatorResultView";
import ITOutsourcingSimulator from "./modules/it_outsourcing_simulator/Simulator";
import ITSimulatorResultView from "./modules/it_outsourcing_simulator/SimulatorResultView";
const MAX_FREE_TOKENS = 100000;

const RECENT_ANALYSES_STORAGE_KEY = 'smartlaw_recent_analysis_results';

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const getReportTitle = (data) => (
  data?.title ||
  data?.fileName ||
  data?.filename ||
  data?.documentName ||
  data?.document_name ||
  data?.document_type ||
  '계약서 분석 리포트'
);

const getReportSummary = (data) => {
  const candidates = [
    data?.summary,
    data?.overview,
    data?.description,
  ];

  return candidates.find((value) => typeof value === 'string' && value.trim()) ||
    'AI 분석 결과와 역방향 리스크 체크 결과를 다시 확인할 수 있습니다.';
};

const getReportScore = (data) => safeNumber(
  data?.riskScore ?? data?.risk_score ?? data?.score ?? data?.summary?.averageScore ?? data?.summaryScore,
  0,
);

const countByRiskLevel = (data, matcher) => {
  const items = [
    ...(Array.isArray(data?.toxicClauses) ? data.toxicClauses : []),
    ...(Array.isArray(data?.sections) ? data.sections.flatMap((section) => Array.isArray(section.items) ? section.items : []) : []),
  ];

  return items.filter((item) => matcher(String(item?.riskLevel || item?.status || item?.severity || item?.level || '').toLowerCase())).length;
};

const buildRecentAnalysisItem = (data, fallbackType) => ({
  id: data?.id || `recent-${Date.now()}`,
  title: getReportTitle(data),
  contractType: data?.document_type || data?.documentType || fallbackType || '계약서 분석',
  analyzedAt: new Date().toISOString().slice(0, 10),
  riskScore: getReportScore(data),
  dangerCount: safeNumber(data?.dangerCount, countByRiskLevel(data, (level) => level.includes('danger') || level.includes('high') || level.includes('위험'))),
  warningCount: safeNumber(data?.warningCount, countByRiskLevel(data, (level) => level.includes('warning') || level.includes('medium') || level.includes('주의'))),
  summary: getReportSummary(data),
  reportData: data,
});

const saveRecentAnalysis = (data, fallbackType) => {
  try {
    const nextItem = buildRecentAnalysisItem(data, fallbackType);
    const current = JSON.parse(localStorage.getItem(RECENT_ANALYSES_STORAGE_KEY) || '[]');
    const list = Array.isArray(current) ? current : [];
    const deduped = list.filter((item) => item.id !== nextItem.id && item.title !== nextItem.title);
    localStorage.setItem(RECENT_ANALYSES_STORAGE_KEY, JSON.stringify([nextItem, ...deduped].slice(0, 3)));
    window.dispatchEvent(new Event('recentAnalysesUpdated'));
  } catch (error) {
    console.warn('최근 분석 결과 저장 실패:', error);
  }
};

const App = () => {
  const [view, setView] = useState('home');
  const [reportData, setReportData] = useState(null);
  const [simData, setSimData] = useState(null);
  const [itSimData, setItSimData] = useState(null);
  const [usedTokens, setUsedTokens] = useState(0);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('스마트팜 구축 계약');
  const [riskConsultPrompt, setRiskConsultPrompt] = useState('');

  useEffect(() => {
    const syncTokens = () => {
      setUsedTokens(parseInt(localStorage.getItem('nextlaw_used_tokens') || '1200', 10));
    };

    syncTokens();
    window.addEventListener('tokensUpdated', syncTokens);

    return () => window.removeEventListener('tokensUpdated', syncTokens);
  }, []);

  const handleAnalysisComplete = (data) => {
    saveRecentAnalysis(data, selectedAnalysisType);
    setReportData(data);
    setView('report');
  };

  const handleOpenRecentReport = (item) => {
    if (!item?.reportData) return;
    setReportData(item.reportData);
    setView('report');
  };

  const handleStartRiskConsult = (prompt = '') => {
    setRiskConsultPrompt(prompt);
    setView('risk-consult');
  };

  const handleNavigateToAnalysis = (type = '스마트팜 구축 계약') => {
    setSelectedAnalysisType(type);
    setView('analysis');
  };

  const handleSimulationComplete = (data) => {
    setSimData(data);
    setView('sim-result');
  };

  const handleGoHome = () => {
    setView('home');
    setReportData(null);
    setSimData(null);
    setItSimData(null);
    setRiskConsultPrompt('');
  };

  const remainingTokens = Math.max(0, MAX_FREE_TOKENS - usedTokens);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-10">
        <nav className="flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-6 z-40 p-4 px-8 rounded-[2.5rem] border border-white/20 shadow-sm">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleGoHome}
          >
            <div className="bg-slate-900 p-2 rounded-xl text-white shadow-lg">
              <ShieldCheck size={24} />
            </div>
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
          {view === 'home' && (
            <Home
              key="home"
              onNavigate={setView}
              onStartRiskConsult={handleStartRiskConsult}
              onOpenRecentReport={handleOpenRecentReport}
            />
          )}

          {view === 'farm' && (
            <SmartFarmDashboard
              key="farm"
              onBack={handleGoHome}
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
              onBack={handleGoHome}
              onNavigateToAnalysis={(type) => {
                setSelectedAnalysisType(type);
                setView('analysis');
              }}
              onNavigateToSimulator={() => {
                setView('it-simulator');
              }}
            />
          )}

          {view === 'legal' && (
            <LegalDashboard
              key="legal"
              onBack={handleGoHome}
              onAnalyze={(type = '부동산 임대차 계약서') => {
                setSelectedAnalysisType(type);
                setView('analysis');
              }}
            />
          )}

          {view === 'analysis' && (
            <Analyze
              key="analysis"
              onBack={handleGoHome}
              onComplete={handleAnalysisComplete}
              initialCategory={selectedAnalysisType}
            />
          )}

          {view === 'simulator' && (
            <Simulator
              key="simulator"
              onBack={() => setView('farm')}
              onComplete={handleSimulationComplete}
            />
          )}

          {view === 'it-simulator' && (
            <ITOutsourcingSimulator
              key="it-simulator"
              onBack={() => setView('it')}
              onComplete={(data) => {
                setItSimData(data);
                setView('it-sim-result');
              }}
            />
          )}

          {view === 'recommend' && (
            <Recommend
              key="recommend"
              onBack={handleGoHome}
            />
          )}

          {view === 'risk-consult' && (
            <AiRiskConsult
              key="risk-consult"
              initialPrompt={riskConsultPrompt}
              onBack={handleGoHome}
              onNavigate={setView}
              onAnalyze={handleNavigateToAnalysis}
            />
          )}

          {view === 'analysis-history' && (
            <AnalysisHistory
              key="analysis-history"
              onBack={handleGoHome}
              onOpenReport={handleOpenRecentReport}
            />
          )}

          {view === 'report' && reportData && (
            <ReportView
              key="report"
              data={reportData}
              onReset={handleGoHome}
            />
          )}

          {view === 'sim-result' && simData && (
              <SimulatorResultView
                key="sim-result"
                data={simData}
                onReset={() => {
                  setView('simulator');
                  setSimData(null);
                }}
              />
            )}

          {view === 'it-sim-result' && itSimData && (
            <ITSimulatorResultView
              key="it-sim-result"
              data={itSimData}
              onReset={() => {
                setView('it-simulator');
                setItSimData(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;