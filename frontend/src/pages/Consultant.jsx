import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, User, ShieldCheck, FileText, Download, ArrowLeft, Gavel, Scale, Sparkles, BookOpen, AlertCircle, Library, Printer, Copy, FileDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { domToCanvas } from 'modern-screenshot';
import jsPDF from 'jspdf';

const Consultant = () => {
  const [view, setView] = useState('menu'); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const scrollRef = useRef(null);

  // 📚 [영웅's Selection] 청년 필수 7대 법률 서류 데이터베이스
  const docLibrary = [
    { 
      id: 'contents', title: "내용증명", icon: <FileText className="text-blue-500" />, 
      law: "민법 제450조", desc: "전세사기, 계약불이행 등 공식 항의용", fileTypes: ["HWP", "DOCX"],
      guide: ["3부를 출력하여 우체국 방문", "배달증명 옵션 필수", "상대방 주소 오기입 주의"],
      templateStructure: { header: "내 용 증 명", fields: ["수신인 정보", "발신인 정보", "제목", "본문(사실관계/요구사항)"] }
    },
    { 
      id: 'debt', title: "채무 변제 요구서", icon: <Scale className="text-red-500" />, 
      law: "민법 제397조", desc: "빌려준 돈, 중고거래 미환불 대응용", fileTypes: ["DOCX", "PDF"],
      guide: ["대여금 원금 및 지연이자 명시", "입금 계좌번호 포함", "최종 변제기일 설정"],
      templateStructure: { header: "채무 변제 독촉장", fields: ["채무자 정보", "대여 내역", "변제 요구안", "미이행 시 경고"] }
    },
    { 
      id: 'termination', title: "계약 해지 통보서", icon: <AlertCircle className="text-amber-500" />, 
      law: "민법 제543조", desc: "임대차/서비스 계약의 공식 종료 통보", fileTypes: ["HWP", "DOCX"],
      guide: ["해지 사유(조항 위반 등) 적시", "해지 효력 발생일 명시", "보증금 반환 요청 포함"],
      templateStructure: { header: "계약 해지 통보서", fields: ["상대방 정보", "계약 정보", "해지 사유", "정산 요구사항"] }
    },
    { 
      id: 'settlement', title: "합의서", icon: <ShieldCheck className="text-emerald-500" />, 
      law: "민법 제731조", desc: "분쟁 종결 및 민·형사상 이의제기 금지", fileTypes: ["DOCX", "PDF"],
      guide: ["'부제소 합의' 문구 필수 포함", "합의금 액수와 지급일 명시", "비밀유지 조항 검토"],
      templateStructure: { header: "합 이 서", fields: ["사건 개요", "합의 조건", "이의제기 금지 확약", "서명 날인"] }
    },
    { 
      id: 'labor', title: "근로 관련 서류", icon: <Gavel className="text-purple-500" />, 
      law: "근로기준법 제36조", desc: "임금 체불, 부당해고 진정 및 대응", fileTypes: ["HWP", "PDF"],
      guide: ["미지급 수당 산출 내역서 준비", "근로계약서 유무 확인", "노동청 신고 전 최종 권고"],
      templateStructure: { header: "임금체불 해결 촉구서", fields: ["사업장 정보", "체불 내역", "지급 기한", "법적 조치 예고"] }
    },
    { 
      id: 'receipt', title: "영수증/확인서/각서", icon: <Sparkles className="text-indigo-500" />, 
      law: "민법 제474조", desc: "금전 수령 확인 및 약속 이행 증명", fileTypes: ["DOCX", "PDF"],
      guide: ["금액 한글/숫자 병기 필수", "불이행 시 페널티 조항", "인감 또는 지장 날인 권장"],
      templateStructure: { header: "각 서 (영수 확인)", fields: ["서약 내용", "금액 및 일자", "위반 시 책임", "신원 정보"] }
    },
    { 
      id: 'poa', title: "위임장", icon: <Library className="text-slate-500" />, 
      law: "민법 제114조", desc: "대리인에게 특정 권한 부여 및 제한", fileTypes: ["HWP", "DOCX"],
      guide: ["위임 범위의 구체적 한정", "유효 기간 설정 필수", "신분증 사본 첨부"],
      templateStructure: { header: "위 임 장", fields: ["위임인/수임인 정보", "위임 업무 범위", "위임 기간", "본인 확인"] }
    }
  ];

  const startChat = async (doc) => {
    setSelectedDoc(doc);
    setView('chat');
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1000));
    setMessages([{ role: 'assistant', content: `안녕하십니까. [${doc.title}] 작성을 도와드릴 AI 변호사입니다. \n\n상단의 '양식 다운로드' 버튼으로 원본 파일을 먼저 받으신 후, 저와 대화를 통해 내용을 채워보시면 됩니다. 어떤 상황인지 말씀해 주시겠습니까?` }]);
    setIsTyping(false);
  };

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: "분석을 마쳤습니다. 해당 양식에 바로 복사해서 쓸 수 있는 AI 초안이 생성되었습니다. [초안 확인] 버튼을 눌러주세요." }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto h-[86vh] flex flex-col font-sans">
      
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-3 rounded-2xl text-white shadow-xl"><Gavel size={24} /></div>
          <div>
            <h2 className="text-2xl font-black text-slate-950 tracking-tighter italic">NextLaw Legal Library</h2>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">7 Essential Documents for Youth</p>
          </div>
        </div>
        {view !== 'menu' && (
            <button onClick={() => { setView('menu'); setSelectedDoc(null); }} className="text-slate-400 font-bold flex items-center gap-2 hover:text-slate-950 transition-all"><ArrowLeft size={18}/> 서류 목록으로</button>
        )}
      </div>

      <div className="flex-1 bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col relative">
        
        {view === 'menu' && (
          <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
            <div className="mb-10 text-center space-y-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">청년에게 꼭 필요한 7대 서류 가이드</h3>
                <p className="text-slate-500 font-medium italic">원하는 서류를 선택하면 표준 양식과 AI 초안을 모두 제공합니다.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {docLibrary.map((doc) => (
                <div key={doc.id} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all group">
                  <div>
                    <div className="bg-white p-4 rounded-2xl w-fit mb-6 shadow-sm group-hover:scale-110 transition-transform">{doc.icon}</div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">{doc.title}</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">{doc.desc}</p>
                    <div className="flex gap-2 mb-6">
                        {doc.fileTypes.map(type => (
                            <span key={type} className="bg-white text-slate-400 text-[9px] font-black px-2 py-1 rounded border border-slate-200 uppercase">{type}</span>
                        ))}
                    </div>
                  </div>
                  <button onClick={() => startChat(doc)} className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">양식 받기 & 초안 작성</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'chat' && (
          <>
            <div className="bg-blue-600 p-4 px-8 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <FileDown size={20} />
                    <span className="font-bold text-sm">[{selectedDoc.title}] 실무 표준 양식을 먼저 다운로드하세요.</span>
                </div>
                <div className="flex gap-3">
                    {selectedDoc.fileTypes.map(type => (
                        <button key={type} className="bg-white/20 hover:bg-white text-blue-600 px-4 py-1.5 rounded-lg text-xs font-black transition-all">{type} 양식</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 flex flex-col scrollbar-hide">
              <div className="flex-1" />
              <div className="space-y-10">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-6 rounded-[2.5rem] max-w-[80%] font-semibold leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-slate-950 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && <div className="text-slate-400 font-black italic animate-pulse px-4">변호사가 양식에 맞게 초안을 구성 중입니다...</div>}
                <div ref={scrollRef} />
              </div>
            </div>
            <AnimatePresence>
              {messages.length >= 2 && !isTyping && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="px-8 pb-4">
                  <div className="bg-slate-950 p-6 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl ring-8 ring-slate-100">
                    <div className="flex items-center gap-4"><Copy className="text-blue-500" /> <h4 className="font-black text-lg">양식 복사용 AI 초안이 완성되었습니다.</h4></div>
                    <button onClick={() => setView('preview')} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-white hover:text-blue-600 transition-all">초안 확인</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="p-8 bg-slate-50 border-t">
              <div className="bg-white rounded-[2rem] flex items-center p-3 shadow-xl"><input className="flex-1 px-8 py-3 outline-none font-bold text-lg" value={input} onChange={(e)=>setInput(e.target.value)} onKeyPress={(e)=>e.key==='Enter'&&handleSend()} placeholder="사실관계를 말씀해 주십시오." /><button onClick={handleSend} className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-slate-950 transition-all"><Send size={24}/></button></div>
            </div>
          </>
        )}

        {view === 'preview' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                <div className="p-8 bg-white border-b flex justify-between items-center shadow-sm">
                    <div><h4 className="text-2xl font-black text-slate-950 tracking-tighter">[{selectedDoc.title}] 초안 데이터</h4><p className="text-slate-400 text-xs font-bold uppercase mt-1 italic">Copy text to your template</p></div>
                    <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-950 transition-all"><Copy size={20} /> 전체 초안 복사</button>
                </div>
                <div className="flex-1 overflow-y-auto p-12 space-y-8 scrollbar-hide">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {selectedDoc.templateStructure.fields.map((field, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
                                <div className="flex justify-between items-center"><span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-md">{field}</span><button className="text-slate-300 hover:text-blue-600 flex items-center gap-1 text-[10px] font-bold"><Copy size={12}/> 복사</button></div>
                                <p className="text-slate-900 font-serif text-lg leading-relaxed whitespace-pre-wrap">{idx === 2 ? `${selectedDoc.title} 통고` : idx === 3 ? messages[messages.length-2]?.content : "양식에 본인 정보를 기입하십시오."}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

      </div>
    </motion.div>
  );
};

export default Consultant;