import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, FileText, ChevronRight, Calendar, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const History = ({ setView, setResult }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/v1/analyze/history');
                setHistory(res.data);
            } catch (err) { console.error("기록 로드 실패"); } 
            finally { setLoading(false); }
        };
        fetchHistory();
    }, []);

    const handleDetail = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/analyze/history/${id}`);
            setResult(res.data.analysis_result); // 상세 분석 데이터 세팅
            setView('home'); // 분석 화면으로 이동
        } catch (err) { alert("상세 리포트를 가져오지 못했습니다."); }
    };

    if (loading) return <div className="text-center py-20 font-bold text-slate-400 animate-pulse text-xl">히스토리를 긁어오는 중...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">My History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.map((item) => (
                    <motion.div key={item.id} whileHover={{ y: -5 }} onClick={() => handleDetail(item.id)} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors"><FileText className="text-slate-400 group-hover:text-blue-500" size={28} /></div>
                            <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-black tracking-widest uppercase"><Star size={12} fill="currentColor" className="inline mb-1" /> Score {item.score}</div>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 truncate mb-1">{item.filename}</h4>
                        <p className="text-slate-400 text-sm font-medium line-clamp-1">{item.summary}</p>
                        <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(item.created_at).toLocaleDateString()}</span>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-all" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
export default History;