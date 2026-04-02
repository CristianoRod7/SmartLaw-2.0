import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Zap, 
  TrendingUp, 
  ExternalLink, 
  RefreshCcw, 
  ShieldCheck, 
  Clock,
  ChevronRight,
  Newspaper,
  Search,
  Filter,
  Plus, // 🚀 추가된 아이콘
  X     // 🚀 추가된 아이콘
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 백엔드 카테고리가 없어도 텍스트 내용으로 분류해주는 스마트 키워드 사전
const categoryKeywords = {
    "부동산": ["부동산", "전세", "월세", "임대", "임차", "보증금", "주택", "아파트", "건물", "상가", "분양", "청약", "경매", "건축"],
    "노동/임금": ["노동", "임금", "근로", "퇴직금", "해고", "직장", "최저임금", "수당", "노조", "파업", "산재", "채용", "취업", "고용"],
    "사기/피해": ["사기", "피해", "피싱", "스미싱", "구속", "송치", "범죄", "경찰", "검찰", "소송", "기소", "횡령", "배임", "고소", "고발", "전세사기"],
    "일반": ["법률", "개정", "판결", "법원", "헌법", "국회", "법안", "변호사", "재판"]
};

const Recommend = () => {
  const [legalUpdates, setLegalUpdates] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // 🚀 기존 필터 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");
  const categories = ["전체", "부동산", "노동/임금", "사기/피해", "일반"];

  // 🚀 [신규 기능] 사용자 커스텀 맞춤 키워드 필터 상태
  const [customFilters, setCustomFilters] = useState([]);
  const [isAddingFilter, setIsAddingFilter] = useState(false);
  const [newFilterKeyword, setNewFilterKeyword] = useState("");

  // 컴포넌트 마운트 시 로컬스토리지에서 커스텀 필터 불러오기
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem('nextlaw_custom_filters') || '[]');
    setCustomFilters(savedFilters);
  }, []);

  // API 크롤링 데이터 호출
  const fetchLegalUpdates = async () => {
    setUpdating(true);
    try {
      const res = await axios.get('http://localhost:8000/api/v1/legal-updates/');
      
      let newsArray = [];
      if (res.data && typeof res.data === 'object') {
        if (Array.isArray(res.data.data)) newsArray = res.data.data;
        else if (Array.isArray(res.data.news)) newsArray = res.data.news;
        else {
          const found = Object.values(res.data).find(val => Array.isArray(val));
          if (found) newsArray = found;
        }
      } else if (Array.isArray(res.data)) {
        newsArray = res.data;
      }
      setLegalUpdates(newsArray);
    } catch (err) {
      console.error("크롤링 에러:", err);
      // 서버 에러 시 화면이 비지 않도록 고품질 Mock 데이터 제공
      setLegalUpdates([
          { id: 1, title: "[속보] 2024 전세사기 특별법 개정안 통과", summary: "전세사기 피해자 지원을 위한 특별법 개정안이 국회 본회의를 통과했습니다. 피해자 인정 요건 완화 및 금융 지원 확대가 주요 내용입니다.", category: "부동산", link: "#" },
          { id: 2, title: "최저임금 인상에 따른 주휴수당 계산법", summary: "올해 최저임금이 인상됨에 따라 아르바이트생 및 근로자의 주휴수당 계산법에 대한 문의가 급증하고 있습니다. 정확한 수당 계산 방법을 안내합니다.", category: "노동/임금", link: "#" },
          { id: 3, title: "중고거래 사기 피해, 이렇게 대처하세요", summary: "최근 중고거래 플랫폼을 통한 사기 피해가 증가하고 있습니다. 사기 피해 발생 시 즉각적인 경찰 신고 및 계좌 지급정지 요청 방법을 알아봅니다.", category: "사기/피해", link: "#" },
          { id: 4, title: "상가임대차보호법 권리금 회수 기회 보호 판례", summary: "상가 세입자의 권리금 회수 기회를 보호하는 대법원 판례가 나왔습니다. 임대인의 정당한 사유 없는 방해 행위 인정 기준이 명확해졌습니다.", category: "부동산", link: "#" },
          { id: 5, title: "부당해고 구제신청 절차 및 주의사항", summary: "갑작스러운 해고 통보를 받았을 때, 노동위원회에 부당해고 구제신청을 하는 절차와 승소를 위한 필수 입증 자료 준비 방법을 안내해 드립니다.", category: "노동/임금", link: "#" }
      ]);
    } finally {
      setTimeout(() => setUpdating(false), 500);
    }
  };

  useEffect(() => {
    fetchLegalUpdates();
  }, []);

  // 🚀 커스텀 필터 추가 로직
  const handleAddCustomFilter = () => {
    const keyword = newFilterKeyword.trim();
    if (!keyword) {
        setIsAddingFilter(false);
        return;
    }
    if (categories.includes(keyword) || customFilters.includes(keyword)) {
        alert("이미 존재하는 카테고리 또는 키워드입니다.");
        return;
    }
    
    const updatedFilters = [...customFilters, keyword];
    setCustomFilters(updatedFilters);
    localStorage.setItem('nextlaw_custom_filters', JSON.stringify(updatedFilters));
    
    setNewFilterKeyword("");
    setIsAddingFilter(false);
    setActiveCategory(keyword); // 방금 추가한 탭으로 자동 이동
    setShowAll(true);
  };

  // 🚀 커스텀 필터 삭제 로직
  const handleRemoveCustomFilter = (filterToRemove) => {
    const updatedFilters = customFilters.filter(f => f !== filterToRemove);
    setCustomFilters(updatedFilters);
    localStorage.setItem('nextlaw_custom_filters', JSON.stringify(updatedFilters));
    
    if (activeCategory === filterToRemove) {
        setActiveCategory("전체"); // 삭제한 탭이 활성화되어 있었다면 전체로 이동
    }
  };

  // 🚀 이중 필터링 로직 (검색어 + 스마트 카테고리 + 커스텀 키워드)
  const filteredNews = legalUpdates.filter(item => {
    const titleText = item.title || "";
    const summaryText = item.summary || "";
    const fullText = (titleText + " " + summaryText).toLowerCase();

    // 1. 검색어 필터링
    const matchesSearch = searchTerm === "" || fullText.includes(searchTerm.toLowerCase());
    
    // 2. 카테고리 & 커스텀 필터링
    let matchesCategory = false;
    
    if (activeCategory === "전체") {
        matchesCategory = true;
    } else if (customFilters.includes(activeCategory)) {
        // 🔥 사용자가 추가한 커스텀 키워드인 경우: 본문에 해당 키워드가 포함되어 있는지 검사
        matchesCategory = fullText.includes(activeCategory.toLowerCase());
    } else {
        // 기존 기본 카테고리 로직
        const hasExactCategory = (item.category && item.category.includes(activeCategory)) || 
                                 (item.tag && item.tag.includes(activeCategory));
        const keywords = categoryKeywords[activeCategory] || [];
        const hasKeywordMatch = keywords.some(kw => fullText.includes(kw));

        if (activeCategory === "일반") {
            const isRealEstate = categoryKeywords["부동산"].some(kw => fullText.includes(kw));
            const isLabor = categoryKeywords["노동/임금"].some(kw => fullText.includes(kw));
            const isFraud = categoryKeywords["사기/피해"].some(kw => fullText.includes(kw));
            matchesCategory = hasExactCategory || hasKeywordMatch || (!isRealEstate && !isLabor && !isFraud);
        } else {
            matchesCategory = hasExactCategory || hasKeywordMatch;
        }
    }

    return matchesSearch && matchesCategory;
  });

  const displayedNews = showAll ? filteredNews : filteredNews.slice(0, 3);

  return (
    <div className="w-full space-y-8 font-sans pb-20">
      <section className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-bold tracking-tight">
            <ShieldCheck size={16} /> NEXTLAW INTELLIGENCE
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
            Knowledge is <span className="text-blue-500">Safety.</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed break-keep">
            매일 수집되는 방대한 법률/판례 데이터를 AI가 파싱하여 청년들에게 꼭 필요한 정보만 필터링하여 제공합니다.
          </p>
          <button 
            onClick={fetchLegalUpdates}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group"
          >
            <RefreshCcw size={18} className={`${updating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span className="font-bold">크롤링 데이터 새로고침</span>
          </button>
        </div>
        <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 opacity-10 rotate-12 select-none pointer-events-none hidden lg:block">
          <Zap size={400} strokeWidth={1} />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-100">
              <Filter size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight italic">Crawling Filter</h3>
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
            <div className="flex items-center pl-3 pr-2 text-slate-400">
                <Search size={18} />
            </div>
            <input 
                type="text" 
                placeholder="키워드로 파싱 데이터 검색..." 
                className="outline-none bg-transparent w-full md:w-48 text-sm font-medium text-slate-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 🚀 필터 탭 영역 (기본 탭 + 커스텀 탭 + 추가 버튼) */}
        <div className="flex gap-2 overflow-x-auto pb-3 px-2 snap-x items-center custom-scrollbar">
            
            {/* 기본 제공 카테고리 */}
            {categories.map(cat => (
                <button 
                    key={cat}
                    onClick={() => {
                        setActiveCategory(cat);
                        setShowAll(true);
                    }}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all snap-center ${
                        activeCategory === cat 
                        ? 'bg-slate-800 text-white shadow-md border border-slate-800' 
                        : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    {cat}
                </button>
            ))}

            {/* 🚀 사용자 맞춤 커스텀 필터 */}
            {customFilters.map(filter => (
                <div 
                    key={filter}
                    className={`shrink-0 flex items-center gap-1.5 pl-4 pr-1 py-1 rounded-full text-sm font-bold transition-all snap-center ${
                        activeCategory === filter 
                        ? 'bg-blue-600 text-white shadow-md border border-blue-600' 
                        : 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100'
                    }`}
                >
                    <button onClick={() => { setActiveCategory(filter); setShowAll(true); }} className="pb-0.5">
                        # {filter}
                    </button>
                    <button 
                        onClick={() => handleRemoveCustomFilter(filter)} 
                        className={`p-1 rounded-full hover:bg-black/10 transition-colors ${activeCategory === filter ? 'text-white' : 'text-blue-400 hover:text-blue-700'}`}
                        title="필터 삭제"
                    >
                        <X size={14} strokeWidth={3} />
                    </button>
                </div>
            ))}

            {/* 🚀 맞춤 필터 추가 버튼 & 입력창 */}
            {isAddingFilter ? (
                <div className="shrink-0 flex items-center bg-white border-2 border-blue-500 rounded-full px-3 py-1 shadow-sm snap-center">
                    <span className="text-blue-500 font-bold mr-1 text-sm">#</span>
                    <input 
                        type="text"
                        autoFocus
                        placeholder="키워드 입력"
                        className="outline-none bg-transparent w-24 text-sm font-bold text-slate-800 placeholder-slate-300"
                        value={newFilterKeyword}
                        onChange={(e) => setNewFilterKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddCustomFilter();
                            if (e.key === 'Escape') setIsAddingFilter(false);
                        }}
                        onBlur={() => setTimeout(() => setIsAddingFilter(false), 200)}
                    />
                    <button onClick={handleAddCustomFilter} className="bg-blue-600 text-white rounded-full p-1 ml-1 hover:bg-blue-700 transition-colors">
                        <Plus size={14} strokeWidth={3} />
                    </button>
                </div>
            ) : (
                <button 
                    onClick={() => setIsAddingFilter(true)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-slate-300 text-slate-400 text-sm font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all snap-center"
                >
                    <Plus size={16} /> 맞춤 키워드
                </button>
            )}
        </div>

        {/* 기사 렌더링 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {updating ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold animate-pulse">법률 데이터를 크롤링 및 파싱하고 있습니다...</p>
              </div>
            ) : displayedNews.length > 0 ? (
              displayedNews.map((item, idx) => {
                let itemDisplayCategory = "법률 뉴스";
                
                // 표시할 카테고리 로직
                if (customFilters.includes(activeCategory)) {
                    itemDisplayCategory = `# ${activeCategory}`; // 커스텀 키워드로 필터링 된 경우
                } else if (item.category) {
                    itemDisplayCategory = item.category;
                } else if (activeCategory !== '전체') {
                    itemDisplayCategory = activeCategory;
                } else {
                    const fullText = (item.title + " " + item.summary).toLowerCase();
                    if (categoryKeywords["부동산"].some(kw => fullText.includes(kw))) itemDisplayCategory = "부동산";
                    else if (categoryKeywords["노동/임금"].some(kw => fullText.includes(kw))) itemDisplayCategory = "노동/임금";
                    else if (categoryKeywords["사기/피해"].some(kw => fullText.includes(kw))) itemDisplayCategory = "사기/피해";
                    else itemDisplayCategory = "일반";
                }

                return (
                  <motion.div
                    key={item.id || idx}
                    onClick={() => window.open(item.link, '_blank')}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wider ${customFilters.includes(activeCategory) ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600 uppercase'}`}>
                          {itemDisplayCategory}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-3 leading-snug break-keep group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 break-keep">
                        {item.summary}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
                <p className="text-slate-400 font-bold mb-2">조건에 맞는 파싱 데이터가 없습니다.</p>
                {customFilters.includes(activeCategory) && (
                    <p className="text-sm text-slate-400">현재 <span className="font-bold text-blue-500">'{activeCategory}'</span> 키워드로 수집된 최신 뉴스가 없습니다.</p>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {filteredNews.length > 3 && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 bg-slate-800 text-white font-bold rounded-full hover:bg-blue-600 transition-colors shadow-md"
            >
              {showAll ? '결과 간략히 보기 ⬆️' : `필터링된 ${filteredNews.length}개 전체 보기 ⬇️`}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Recommend;