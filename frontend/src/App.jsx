import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import History from './pages/History';
import Recommend from './pages/Recommend';
import Consultant from './pages/Consultant';
import { Shield, History as HistoryIcon, FileSearch, Gavel, Zap } from 'lucide-react'; // 🚀 Zap 아이콘 추가

function App() {
    const [view, setView] = useState('home');
    const [result, setResult] = useState(null);

    // 🚀 [원본 유지] 브라우저 뒤로가기 버튼을 눌렀을 때 실행되는 로직
    useEffect(() => {
        const handlePopState = (event) => {
            if (event.state && event.state.view) {
                setView(event.state.view);
            } else {
                setView('home'); 
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // 🚀 [원본 유지] 이동할 때 브라우저에 기록을 남김
    const navigateTo = (targetView) => {
        setView(targetView);
        window.history.pushState({ view: targetView }, '', `#${targetView}`);
        
        if (targetView !== 'home' && targetView !== 'history') {
            setResult(null); 
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* 🛠️ 네비게이션 바 */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center py-4">
                    {/* 로고 영역 */}
                    <div 
                        className="flex items-center gap-2.5 cursor-pointer group" 
                        onClick={() => navigateTo('home')}
                    >
                        <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter text-slate-800 leading-none">
                                Next<span className="text-blue-600">Law</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Legal AI 2.0</span>
                        </div>
                    </div>

                    {/* 상단 탭 메뉴: 법률/추천 버튼 추가됨 */}
                    <div className="flex bg-slate-100/80 p-1.5 rounded-[1.25rem] border border-slate-200/50">
                        <button 
                            onClick={() => navigateTo('home')} 
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${view === 'home' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <FileSearch size={18} strokeWidth={2.5} /> 계약 분석
                        </button>
                        
                        <button 
                            onClick={() => navigateTo('consult')} 
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${view === 'consult' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <Gavel size={18} strokeWidth={2.5} /> 상담/서류 작성
                        </button>

                        <button 
                            onClick={() => navigateTo('recommend')} 
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${view === 'recommend' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <Zap size={18} strokeWidth={2.5} /> 법률/추천
                        </button>

                        <button 
                            onClick={() => navigateTo('history')} 
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${view === 'history' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <HistoryIcon size={18} strokeWidth={2.5} /> 분석 기록
                        </button>
                    </div>
                </div>
            </nav>
            
            {/* 🖥️ 메인 콘텐츠 영역 */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                <AnimatePresence mode="wait">
                    {view === 'home' && <Home key="home" result={result} setResult={setResult} />}
                    {view === 'consult' && <Consultant key="consult" />}
                    {view === 'history' && <History key="history" setView={navigateTo} setResult={setResult} />}
                    {view === 'recommend' && <Recommend key="recommend" />}
                </AnimatePresence>
            </main>

            {/* 底部 푸터 */}
            <footer className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-200 text-center">
                <p className="text-slate-400 text-sm font-medium">
                    © 2026 NextLaw AI. Powered by <span className="text-slate-600 font-bold">Yeongung (4.33 GPA Tech)</span>
                </p>
            </footer>
        </div>
    );
}

const AnimatePresence = ({ children }) => <>{children}</>;

export default App;