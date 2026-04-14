import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, ChevronRight, Calendar, Star, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const History = ({ setView, setResult }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('${API_BASE_URL}/api/v1/analyze/history');
                setHistory(res.data);
            } catch (err) { console.error("기록 로드 실패"); } 
            finally { setLoading(false); }
        };
        fetchHistory();
    }, []);

    const handleDetail = async (id) => {
        try {
            const res = await axios.get('${API_BASE_URL}/api/v1/analyze/history/${id}');
            // 🚀 1. 데이터를 부모의 result에 저장
            setResult(res.data.analysis_result); 
            
            // 🚀 2. [수정] 목적지를 'home'으로 보내면서 ID를 URL에 박음!
            // App.jsx의 navigateTo가 이 id를 받아 주소창을 #home?id=번호 로 바꿈
            setView('report', id); 
            
            window.scrollTo(0, 0);
        } catch (err) { alert("상세 리포트를 가져오지 못했습니다. 🕵️"); }
    };

    if (loading) return <div className="text-center py-40 font-black text-slate-400 animate-pulse text-xl italic uppercase">Fetching Data...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 font-sans">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">My History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <AnimatePresence>
                    {history.map((item, index) => (
                        <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -8 }} onClick={() => handleDetail(item.id)} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between h-full">
                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="p-5 bg-slate-50 rounded-[2rem] group-hover:bg-blue-50 transition-colors"><FileText className="text-slate-400 group-hover:text-blue-500" size={32} /></div>
                                    <div className="bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-xs font-black italic border border-blue-100 uppercase tracking-widest"><Star size={14} fill="currentColor" className="inline mb-1 mr-1" /> Score {item.score}</div>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-slate-900 truncate mb-3 group-hover:text-blue-600 transition-colors">{item.filename}</h4>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed line-clamp-2">{item.summary || "분석 요약 정보가 존재하지 않습니다."}</p>
                                </div>
                            </div>
                            <div className="mt-10 pt-8 border-t border-slate-50 flex justify-between items-center text-[11px] font-black text-slate-300 tracking-widest uppercase italic">
                                <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(item.created_at).toLocaleDateString()}</span>
                                <div className="bg-slate-50 p-3 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-all"><ChevronRight size={20} /></div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
export default History;