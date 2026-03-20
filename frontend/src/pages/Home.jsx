import React, { useState } from 'react';
import { ShieldAlert, FileText, CheckCircle, AlertTriangle, Download, ArrowLeft, Loader2, Info, BookOpenText, MapPin, AlignLeft, Scale, Gavel, Coins, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { domToCanvas } from 'modern-screenshot'; 
import jsPDF from 'jspdf';

const Home = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // 🚀 [최신 PDF 엔진] oklch 컬러 에러 완벽 해결
  const downloadPDF = async () => {
    const input = document.getElementById('report-content');
    if (!input) return;
    try {
      setAnalyzing(true);
      const canvas = await domToCanvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`NextLaw_Real_Report_${new Date().getTime()}.pdf`);
    } catch (err) {
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUpload = () => {
    if (!file) return alert("계약서 파일을 선택해주세요.");
    setAnalyzing(true);
    
    // 🏆 [실전 데이터 팩] 영웅이가 요청한 9가지 실용 항목 풀세팅
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        score: 45, // 리스크가 많으므로 점수 하락
        sections: [
          {
            category: "배상 책임 및 리스크 (Liability)",
            icon: <Coins className="text-red-500" />,
            items: [
              { id: 1, page: "4P", line: "제 12조", clause: "책임 제한", status: "Danger", title: "일방적 책임 제한", desc: "고의 또는 중과실의 경우에도 배상 한도를 '계약금'으로 제한하는 독소 조항입니다.", law: "민법 제390조 (채무불이행과 손해배상)", tip: "중과실 시에는 무한 책임을 지도록 예외 조항을 반드시 삽입하세요." },
              { id: 2, page: "4P", line: "제 13조", clause: "손해배상 범위", status: "Warning", title: "특별손해 포함 여부", desc: "통상손해를 넘어선 '특별손해'에 대한 배상 범위가 모호하게 설정되어 있습니다.", law: "민법 제393조 (손해배상의 범위)", tip: "상대방이 예견할 수 있는 손해에 한정한다는 문구를 명시하여 리스크를 줄이세요." },
              { id: 3, page: "5P", line: "제 15조", clause: "위약금 및 페널티", status: "Danger", title: "과도한 위약벌 설정", desc: "실제 손해액의 3배가 넘는 과도한 위약벌이 설정되어 있어 법원에서 무효가 될 가능성이 큽니다.", law: "민법 제398조 (배상액의 예정)", tip: "위약금을 '합리적인 손해액 예정' 수준으로 낮추는 협상이 필요합니다." }
            ]
          },
          {
            category: "계약 기간 및 해지 (Term & Termination)",
            icon: <RefreshCw className="text-blue-500" />,
            items: [
              { id: 4, page: "2P", line: "제 5조", clause: "계약 해지 조건", status: "Warning", title: "해지권의 불균형", desc: "상대방은 즉시 해지가 가능하나, 귀사는 3개월 전 통보해야 하는 불합리한 조건입니다.", law: "약관법 제9조 (계약의 해제·해지)", tip: "쌍방 모두 동일한 예고 기간(예: 30일)을 갖도록 대등하게 수정하세요." },
              { id: 5, page: "2P", line: "제 6조", clause: "자동 갱신 여부", status: "Safe", title: "갱신 거절 통지 확인", desc: "만료 1개월 전 서면 통지로 갱신을 거절할 수 있는 표준 조항이 포함되어 있습니다.", law: "민법 제639조 (묵시의 갱신)", tip: "캘린더에 만료 1개월 전 알림을 설정하여 갱신 여부를 미리 판단하세요." },
              { id: 6, page: "8P", line: "제 22조", clause: "일방적 변경", status: "Danger", title: "운영정책 임의 변경", desc: "회사가 운영 정책을 사전 동의 없이 일방적으로 변경하고 효력을 발생시키는 조항입니다.", law: "약관법 제12조 (의사표시의 의제)", tip: "중요한 약관 변경 시 최소 30일 전 고지 및 거부권 부여 프로세스를 추가하세요." }
            ]
          },
          {
            category: "지식재산 및 법적 분쟁 (IP & Legal)",
            icon: <Gavel className="text-purple-500" />,
            items: [
              { id: 7, page: "6P", line: "제 18조", clause: "데이터/저작권", status: "Danger", title: "저작권 포괄적 귀속", desc: "귀사가 생성한 모든 산출물의 지식재산권을 상대방에게 영구 이전하는 조항입니다.", law: "저작권법 제33조", tip: "소유권 대신 '사용권 부여(License)' 방식으로 계약 형식을 변경하는 것이 유리합니다." },
              { id: 8, page: "7P", line: "제 20조", clause: "독점 조항", status: "Warning", title: "타사 거래 금지", desc: "계약 기간 중 경쟁사와의 모든 거래를 금지하여 비즈니스 확장을 제한하고 있습니다.", law: "독점규제 및 공정거래에 관한 법률", tip: "독점 범위를 특정 서비스나 특정 타겟으로 좁게 한정해야 합니다." },
              { id: 9, page: "9P", line: "제 25조", clause: "관할 법원", status: "Safe", title: "준거법 및 관할권", desc: "대한민국 법을 준거법으로 하며 서울중앙지방법원을 관할로 설정한 표준형입니다.", law: "민사소송법 제2조", tip: "귀사의 소재지와 가까운 법원으로 합의가 가능하다면 더 효율적입니다." }
            ]
          }
        ]
      });
    }, 2500);
  };

  if (result) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-8 pb-24 px-4 md:px-0 font-sans tracking-tight text-slate-900">
        <div className="flex justify-between items-center">
          <button onClick={() => setResult(null)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-all">
            <ArrowLeft size={20} /> 다른 문서 검토
          </button>
          <button onClick={downloadPDF} className="flex items-center gap-2.5 bg-slate-950 text-white px-7 py-3 rounded-[1.25rem] font-black shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95 text-sm">
            <Download size={18} strokeWidth={2.5} /> AI 법률 리포트 PDF 저장
          </button>
        </div>

        {/* 🏆 [실전용 리포트 영역] */}
        <div id="report-content" className="space-y-8 bg-slate-50 p-4 md:p-8 rounded-[3rem]">
          {/* 종합 점수 카드 */}
          <div className="bg-white rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-60 h-60 text-blue-50/50"><ShieldAlert size={240} strokeWidth={0.5} /></div>
            <div className="relative w-40 h-40 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="72" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                <motion.circle 
                  initial={{ strokeDashoffset: 452 }} animate={{ strokeDashoffset: 452 - (452 * result.score) / 100 }}
                  cx="80" cy="80" r="72" stroke="#ef4444" strokeWidth="12" fill="transparent" strokeDasharray="452" strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-black">
                <span className="text-5xl text-slate-950">{result.score}</span>
                <span className="text-[10px] text-slate-400 uppercase mt-1 tracking-widest">Risk Score</span>
              </div>
            </div>
            <div className="space-y-3 flex-1 relative z-10">
              <div className="inline-flex gap-2 items-center bg-red-50 border border-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold"><BookOpenText size={14} /> AI 변호사 실전 리스크 진단</div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter">계약 위험도: <span className="text-red-500">매우 높음</span></h2>
              <p className="text-slate-500 font-medium leading-relaxed max-w-xl text-base md:text-lg">
                  배상 범위와 저작권 귀속 조항에서 <span className="text-red-600 font-bold underline">심각한 문제</span>가 발견되었습니다. 법적 분쟁 시 귀사에 매우 불리할 수 있으므로 아래 조항들을 확인하세요.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            {result.sections.map((section, idx) => (
              <div key={idx} className="space-y-6">
                <div className="flex items-center gap-3 ml-2">
                  <div className="p-2.5 bg-white rounded-xl shadow-inner border border-slate-100">{section.icon}</div>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tighter leading-tight italic uppercase">{section.category}</h3>
                </div>
                <div className="grid grid-cols-1 gap-5">
                  {section.items.map((item) => (
                    <div key={item.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-500 transition-all flex flex-col md:flex-row md:items-start gap-8 group">
                      <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${item.status === 'Safe' ? 'bg-emerald-50 text-emerald-500' : item.status === 'Danger' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                        {item.status === 'Safe' ? <CheckCircle size={36} /> : <ShieldAlert size={36} />}
                      </div>
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-2">
                            <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-xs font-bold leading-none tracking-tight">
                                <MapPin size={12} className="text-slate-400" /> {item.page}
                                <div className="w-px h-3 bg-slate-300 mx-0.5"></div>
                                <AlignLeft size={12} className="text-slate-400" /> <span className="text-slate-700">{item.line}</span>
                            </div>
                            <span className="text-xs font-black bg-slate-900 text-white px-3 py-1.5 rounded-full uppercase leading-none tracking-tight">{item.clause}</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${item.status === 'Danger' ? 'bg-red-500 text-white' : item.status === 'Warning' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>{item.status}</span>
                        </div>
                        <h4 className="text-xl md:text-2xl font-black text-slate-950 tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">{item.title}</h4>
                        <p className="text-slate-500 text-base font-medium leading-relaxed tracking-tight">{item.desc}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs font-bold bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 inline-flex">
                          <Scale size={14} className="text-slate-400" />
                          <span className="text-slate-500 font-bold tracking-tight text-sm">근거 법령: <span className="text-slate-700">{item.law}</span></span>
                        </div>
                        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 mt-2">
                            <span className="inline-block text-[10px] uppercase tracking-widest text-blue-500 font-black mb-1">Expert Solution</span>
                            <p className="text-blue-800 text-sm font-bold leading-relaxed tracking-tight">{item.tip}</p>
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
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-950 tracking-tighter italic">Law Protector 2.0</h2>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">준비한 계약서(이미지/PDF)를 업로드하세요. <br/> AI 변호사가 정밀 분석합니다.</p>
      </div>
      <div 
        className={`h-[400px] border-4 border-dashed rounded-[3.5rem] transition-all flex flex-col items-center justify-center gap-6 cursor-pointer
          ${file ? 'border-blue-500 bg-blue-50/30 shadow-2xl' : 'border-slate-100 bg-white hover:bg-slate-50'}`}
        onClick={() => !analyzing && document.getElementById('file-upload').click()}
      >
        <input id="file-upload" type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
        {analyzing ? (
          <div className="text-center space-y-6">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
            <p className="text-2xl font-black text-slate-950 animate-pulse tracking-tight">AI 법률 전문가 시스템 가동 중...</p>
          </div>
        ) : (
          <>
            <div className={`p-8 rounded-[2rem] shadow-xl ${file ? 'bg-blue-600 text-white' : 'bg-white text-slate-300'}`}>
              <FileText size={52} strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">{file ? file.name : "계약서를 여기에 드래그하세요"}</p>
              <p className="text-slate-400 font-medium text-sm mt-3 font-bold italic tracking-widest uppercase opacity-60">High Precision OCR Mode</p>
            </div>
          </>
        )}
      </div>
      <button onClick={handleUpload} disabled={!file || analyzing} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-3.5">
        {!analyzing && <ShieldAlert size={26} strokeWidth={2.5} />}
        {analyzing ? "분석 리포트 생성 중..." : "AI 계약서 분석 시작"}
      </button>
    </div>
  );
};

export default Home;