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
import SimulatorResultView from "./modules/smartfarm_simulator/SimulatorResultView";
import ITOutsourcingSimulator from "./modules/it_outsourcing_simulator/Simulator";
import ITSimulatorResultView from "./modules/it_outsourcing_simulator/SimulatorResultView";
const MAX_FREE_TOKENS = 100000;

const App = () => {
  const [view, setView] = useState('home');
  const [reportData, setReportData] = useState(null);
  const [simData, setSimData] = useState(null);
  const [itSimData, setItSimData] = useState(null);
  const [usedTokens, setUsedTokens] = useState(0);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('스마트팜 구축 계약');

  useEffect(() => {
    const syncTokens = () => {
      setUsedTokens(parseInt(localStorage.getItem('nextlaw_used_tokens') || '1200', 10));
    };

    syncTokens();
    window.addEventListener('tokensUpdated', syncTokens);

    return () => window.removeEventListener('tokensUpdated', syncTokens);
  }, []);

  const handleAnalysisComplete = (data) => {
    setReportData(data);
    setView('report');
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
            <Home key="home" onNavigate={setView} />
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