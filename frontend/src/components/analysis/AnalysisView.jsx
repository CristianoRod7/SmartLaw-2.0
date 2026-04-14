import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Sparkles, ChevronDown, CheckCircle2, UploadCloud, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

const Analysis = ({ onBack, onComplete }) => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("스마트팜 구축 계약");
  const [statusMsg, setStatusMsg] = useState("AI 변호사가 분석을 준비 중입니다...");

  const handleUpload = async () => {
    if (!file) return alert("파일을 선택해주세요.");
    
    setAnalyzing(true);
    setStatusMsg("파일에서 텍스트를 추출하고 있습니다...");

    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', selectedCategory); 
    
    // 🚀 타임아웃 60초 설정
    const source = axios.CancelToken.source();
    const timeoutId = setTimeout(() => {
        source.cancel("시간 초과: AI 서버 응답이 너무 늦습니다.");
    }, 60000);

    try {
      setStatusMsg("AI 엔진이 독소조항을 정밀 스캔 중입니다. (약 10~20초 소요)");
      const res = await axios.post('${API_BASE_URL}/api/v1/analyze/contract', formData, {
          cancelToken: source.token
      });
      
      clearTimeout(timeoutId);
      
      const responseData = res.data?.data || res.data;
      if (responseData.error) {
          alert(responseData.error);
          setAnalyzing(false);
      } else {
          onComplete(responseData);
      }
    } catch (err) { 
      clearTimeout(timeoutId);
      console.error(err);
      alert(axios.isCancel(err) ? err.message : "분석 실패: 백엔드 서버 상태를 확인하세요."); 
      setAnalyzing(false); 
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-500 shadow-sm"><ArrowLeft size={20} /></button>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI 계약서 자동 검토</h2>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-200 p-12 shadow-xl relative overflow-hidden">
        {analyzing && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-10 text-center">
                <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">분석이 진행 중입니다</h3>
                <p className="text-slate-500 font-bold animate-pulse">{statusMsg}</p>
                <div className="mt-10 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 text-emerald-700 text-sm font-bold">
                    <AlertCircle size={18} /> 60초 이상 걸릴 경우 페이지를 새로고침 해주세요.
                </div>
            </div>
        )}

        <div className="max-w-2xl mx-auto space-y-8 relative z-10">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-extrabold text-slate-700 ml-1">
              <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px]">1</span> 계약서 종류
            </label>
            <div className="relative w-full">
              <select className="w-full font-bold text-[15px] bg-slate-50 border border-slate-200 text-slate-800 px-5 py-4 rounded-2xl outline-none focus:border-emerald-500 appearance-none cursor-pointer" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="스마트팜 구축 계약">🌱 스마트팜 시설/시공 계약서</option>
                <option value="농지 임대차 계약서">🌾 농지 임대차 계약서</option>
                <option value="IT 외주 계약서">💻 IT 외주 / 개발 계약서</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-extrabold text-slate-700 ml-1">
              <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px]">2</span> 문서 업로드
            </label>
            <div className={`h-56 border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${file ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`} onClick={() => document.getElementById('file-upload').click()}>
              <input id="file-upload" type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.doc,.docx" />
              {file ? <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm"><CheckCircle2 size={32} /></div> : <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-100"><UploadCloud size={32} /></div>}
              <div className="text-center px-4">
                  {file ? <p className="text-lg font-black text-emerald-900">{file.name}</p> : <p className="text-base font-bold text-slate-700">클릭하여 파일을 업로드하세요</p>}
              </div>
            </div>
          </div>

          <button onClick={handleUpload} disabled={!file || analyzing} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[17px] hover:bg-emerald-600 transition-all disabled:opacity-50 flex justify-center items-center gap-3">
            <ShieldCheck size={20} /> 분석 시작하기
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Analysis;