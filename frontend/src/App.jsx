import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './pages/Home';
import History from './pages/History';
import ReportView from './pages/ReportView'; // 🚀 신설된 리포트 페이지
import Recommend from './pages/Recommend';
import Consultant from './pages/Consultant';
import { Shield, History as HistoryIcon, FileSearch, Gavel, Zap } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

function App() {
    const [view, setView] = useState('home');
    const [result, setResult] = useState(null);

    // 🚀 URL의 ID를 보고 DB에서 데이터를 복구함
    const fetchResultById = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/analyze/history/${id}`);
            setResult(res.data.analysis_result);
        } catch (err) { console.error("데이터 복구 실패", err); }
    };

    useEffect(() => {
        const handleUrlState = () => {
            const hash = window.location.hash;
            const viewPart = hash.split('?')[0].replace('#', '') || 'home';
            const params = new URLSearchParams(hash.split('?')[1]);
            const id = params.get('id');

            setView(viewPart);
            if (id) fetchResultById(id); // URL에 ID가 있으면 즉시 데이터 복구
        };
        handleUrlState();
        window.addEventListener('popstate', handleUrlState);
        return () => window.removeEventListener('popstate', handleUrlState);
    }, []);

    const navigateTo = (targetView, id = null) => {
        const url = id ? `#${targetView}?id=${id}` : `#${targetView}`;
        setView(targetView);
        window.history.pushState({ view: targetView }, '', url);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center py-4">
                    <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigateTo('home')}>
                        <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-100"><Shield className="text-white w-6 h-6" /></div>
                        <div className="flex flex-col"><span className="text-xl font-black text-slate-800 leading-none">NextLaw</span></div>
                    </div>
                    <div className="flex bg-slate-100/80 p-1.5 rounded-[1.25rem] border border-slate-200/50">
                        <button onClick={() => navigateTo('home')} className={`px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 transition-all ${view === 'home' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}><FileSearch size={18}/> 계약 분석</button>
                        <button onClick={() => navigateTo('consult')} className={`px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 transition-all ${view === 'consult' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}><Gavel size={18}/> 상담/서류 작성</button>
                        <button onClick={() => navigateTo('history')} className={`px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 transition-all ${view === 'history' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}><HistoryIcon size={18}/> 분석 기록</button>
                    </div>
                </div>
            </nav>
            
            <main className="max-w-6xl mx-auto px-6 py-12">
                <AnimatePresence mode="wait">
                    {/* 🚀 홈은 이제 결과값 없이 무조건 업로드 화면만 띄움 */}
                    {view === 'home' && <Home key="home" result={null} setResult={(data, id) => { setResult(data); navigateTo('report', id); }} />}
                    
                    {/* 🚀 결과 전용 페이지 (Photo 1 UI) */}
                    {view === 'report' && <ReportView key="report" data={result} setView={navigateTo} />}
                    
                    {view === 'consult' && <Consultant key="consult" />}
                    {view === 'history' && <History key="history" setView={navigateTo} setResult={setResult} />}
                </AnimatePresence>
            </main>
        </div>
    );
}
export default App;