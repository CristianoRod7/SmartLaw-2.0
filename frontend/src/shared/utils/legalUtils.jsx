import React from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle, Coins, 
  RefreshCw, Gavel, Lock, CloudRain, ShieldCheck, Info 
} from 'lucide-react';

// =========================================================================
// 💰 [Credits & Tokens] 전역 서비스 설정
// =========================================================================
export const MAX_FREE_TOKENS = 100000; 
export const AVG_CHAT_TOKEN = 400;   
export const AVG_DOC_TOKEN = 2500;   

// =========================================================================
// 🎨 [Visuals] 공통 아이콘 및 스타일 맵
// =========================================================================
export const ICON_MAP = {
  Coins: <Coins size={24} className="text-red-500" />,
  RefreshCw: <RefreshCw size={24} className="text-blue-500" />,
  Gavel: <Gavel size={24} className="text-purple-500" />,
  AlertTriangle: <AlertTriangle size={24} className="text-amber-500" />,
  ShieldAlert: <ShieldAlert size={24} className="text-red-500" />,
  Lock: <Lock size={24} className="text-slate-500" />,
  CloudRain: <CloudRain size={24} className="text-blue-400" />,
  ShieldCheck: <ShieldCheck size={24} className="text-emerald-500" />
};

export const getStatusStyles = (status) => {
  if (status === 'Danger') return { bg: 'bg-red-50 text-red-500', label: 'bg-red-500 text-white', icon: <ShieldAlert size={36} /> };
  if (status === 'Warning') return { bg: 'bg-amber-50 text-amber-500', label: 'bg-amber-500 text-white', icon: <AlertTriangle size={36} /> };
  return { bg: 'bg-emerald-50 text-emerald-500', label: 'bg-emerald-500 text-white', icon: <CheckCircle size={36} /> };
};

// =========================================================================
// 🛠️ [Formatters] 텍스트 및 데이터 가공 유틸
// =========================================================================
export const formatLocation = (page, line) => {
    const pStr = page ? String(page) : "";
    const pNum = pStr.replace(/[^0-9]/g, ''); 
    const pText = pNum ? `${pNum}페이지` : "전체";
    
    const lStr = line ? String(line) : "";
    let lText = "";
    if (lStr.length > 0 && lStr.length < 15) {
        const lNum = lStr.replace(/[^0-9~-]/g, '');
        if (lNum) lText = ` | ${lNum}번째 줄`;
    }
    return `${pText}${lText}`;
};

// =========================================================================
// 🧠 [Intelligence] 스마트 법률 사전 및 툴팁 파서
// =========================================================================
export const LEGAL_DICTIONARY = {
  "대항력": "집주인이 바뀌어도 내 보증금과 기간을 지킬 수 있는 권리입니다. 전입신고+확정일자가 필수!",
  "우선변제권": "집이 경매에 넘어갔을 때 다른 채권자보다 먼저 보증금을 돌려받을 수 있는 권리입니다.",
  "임차권등기명령": "보증금을 못 받은 채 이사 가야 할 때, 내 권리를 등기부에 박아두는 방패입니다.",
  "원상복구": "퇴거 시 원래 상태로 돌려놓는 의무입니다. (자연 마모는 제외)",
  "SOW": "Statement of Work. 업무 범위를 상세히 정의한 명세서입니다.",
  "IP 귀속": "지식재산권의 소유권이 누구에게 있는지에 대한 문제입니다.",
  "농지법 제23조": "농지는 임대차가 원칙적 금지나, 스마트팜 등 특정 요건 하에 허용됩니다.",
  "지체상금": "공사가 지연되었을 때 시공사가 발주자에게 지불하는 배상금입니다."
};

const TooltipText = ({ text, explanation }) => (
  <span className="relative inline-block group cursor-help text-blue-700 font-extrabold border-b-[2px] border-dashed border-blue-400 px-0.5 mx-0.5 bg-blue-50/50 rounded-sm transition-colors hover:bg-blue-100">
    {text}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-slate-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-2xl pointer-events-none">
      <span className="block font-black text-blue-400 mb-1.5 text-base border-b border-slate-700 pb-1.5 flex items-center gap-1.5"><Info size={14}/> {text}</span>
      <span className="leading-relaxed text-slate-200 break-keep font-medium">{explanation}</span>
      <svg className="absolute text-slate-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
    </span>
  </span>
);

export const parseSmartTooltips = (text) => {
  if (!text || typeof text !== 'string') return text;
  const terms = Object.keys(LEGAL_DICTIONARY);
  const regex = new RegExp(`(${terms.join('|')})`, 'g');
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (LEGAL_DICTIONARY[part]) return <TooltipText key={i} text={part} explanation={LEGAL_DICTIONARY[part]} />;
    return part;
  });
};