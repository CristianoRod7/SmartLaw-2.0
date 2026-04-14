import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Zap,
  RefreshCcw,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categoryKeywords = {
  "스마트팜": ["스마트팜", "시설원예", "온실"],
  "보조금": ["보조금", "지원금", "환수"],
  "농지/임대차": ["농지", "임대차", "전대", "임대", "임차"],
  "노동": ["노동", "임금", "근로", "퇴직금", "해고", "최저임금", "수당", "고용"],
  "주거": ["주거", "전세", "월세", "보증금", "주택", "아파트"],
  "일반": ["법률", "개정", "판결", "법원", "헌법", "국회", "법안", "변호사", "재판"]
};

const categories = ["전체", "스마트팜", "보조금", "농지/임대차", "노동", "주거", "일반"];
const dateOptions = [7, 30, 90, 180, 365, 9999];

const Recommend = () => {
  const [legalUpdates, setLegalUpdates] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");
  const [dateFilter, setDateFilter] = useState(180);

  const [customFilters, setCustomFilters] = useState([]);
  const [isAddingFilter, setIsAddingFilter] = useState(false);
  const [newFilterKeyword, setNewFilterKeyword] = useState("");

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem('nextlaw_custom_filters') || '[]');
    setCustomFilters(savedFilters);
  }, []);

  const fetchLegalUpdates = async () => {
    setUpdating(true);
    try {
      const res = await axios.get('`${API_BASE_URL}/api/v1/legal/news', {
        params: {
          query: searchTerm.trim() || undefined,
          days: dateFilter
        }
      });

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

      console.log("API 응답 원본:", res.data);
      console.log("뉴스 배열:", newsArray);

      setLegalUpdates(newsArray);
    } catch (err) {
      console.error("크롤링 에러:", err);
      console.error("응답 상태:", err?.response?.status);
      console.error("응답 데이터:", err?.response?.data);

      setLegalUpdates([
        {
          id: 1,
          title: "뉴스 데이터를 불러오지 못했습니다.",
          summary: "서버 상태나 API 키를 확인한 뒤 다시 시도해주세요.",
          category: "시스템",
          date: "Today",
          link: null
        }
      ]);
    } finally {
      setTimeout(() => setUpdating(false), 500);
    }
  };

  useEffect(() => {
    fetchLegalUpdates();
  }, [dateFilter]);

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
    setActiveCategory(keyword);
    setShowAll(true);
  };

  const handleRemoveCustomFilter = (filterToRemove) => {
    const updatedFilters = customFilters.filter(f => f !== filterToRemove);
    setCustomFilters(updatedFilters);
    localStorage.setItem('nextlaw_custom_filters', JSON.stringify(updatedFilters));

    if (activeCategory === filterToRemove) {
      setActiveCategory("전체");
    }
  };

  const filteredNews = legalUpdates.filter(item => {
    const titleText = item.title || "";
    const summaryText = item.summary || "";
    const fullText = (titleText + " " + summaryText).toLowerCase();

    const matchesSearch = searchTerm === "" || fullText.includes(searchTerm.toLowerCase());

    let matchesCategory = false;

    if (activeCategory === "전체") {
      matchesCategory = true;
    } else if (customFilters.includes(activeCategory)) {
      matchesCategory = fullText.includes(activeCategory.toLowerCase());
    } else {
      const hasExactCategory =
        (item.category && item.category.includes(activeCategory)) ||
        (item.tag && item.tag.includes(activeCategory));

      const keywords = categoryKeywords[activeCategory] || [];
      const hasKeywordMatch = keywords.some(kw => fullText.includes(kw));

      if (activeCategory === "일반") {
        const isSmartFarm = categoryKeywords["스마트팜"].some(kw => fullText.includes(kw));
        const isSubsidy = categoryKeywords["보조금"].some(kw => fullText.includes(kw));
        const isFarmland = categoryKeywords["농지/임대차"].some(kw => fullText.includes(kw));
        const isLabor = categoryKeywords["노동"].some(kw => fullText.includes(kw));
        const isHousing = categoryKeywords["주거"].some(kw => fullText.includes(kw));

        matchesCategory =
          hasExactCategory ||
          hasKeywordMatch ||
          (!isSmartFarm && !isSubsidy && !isFarmland && !isLabor && !isHousing);
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
            관련 정책과 최신 이슈를 빠르게 수집해 필요한 정보만 확인할 수 있습니다.
          </p>

          <button
            onClick={fetchLegalUpdates}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group"
          >
            <RefreshCcw size={18} className={`${updating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span className="font-bold">데이터 새로고침</span>
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
            <h3 className="text-2xl font-black text-slate-800 tracking-tight italic">Policy Filter</h3>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
            <div className="flex items-center pl-3 pr-2 text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="키워드로 정책 검색..."
              className="outline-none bg-transparent w-full md:w-56 text-sm font-medium text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchLegalUpdates();
                }
              }}
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto px-2 pb-2">
          {dateOptions.map((day) => (
            <button
              key={day}
              onClick={() => setDateFilter(day)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                dateFilter === day
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {day === 9999 ? "전체" : `최근 ${day}일`}
            </button>
          ))}
        </div>

        <p className="text-sm font-bold text-slate-400 px-2">
          현재 기간 필터: {dateFilter === 9999 ? "전체" : `최근 ${dateFilter}일`}
        </p>

        <div className="flex gap-2 overflow-x-auto pb-3 px-2 snap-x items-center custom-scrollbar">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {updating ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold animate-pulse">정책 데이터를 불러오는 중입니다...</p>
              </div>
            ) : displayedNews.length > 0 ? (
              displayedNews.map((item, idx) => {
                let itemDisplayCategory = "일반";

                if (customFilters.includes(activeCategory)) {
                  itemDisplayCategory = `# ${activeCategory}`;
                } else if (item.category) {
                  itemDisplayCategory = item.category;
                } else if (activeCategory !== '전체') {
                  itemDisplayCategory = activeCategory;
                } else {
                  const fullText = (item.title + " " + item.summary).toLowerCase();

                  if (categoryKeywords["스마트팜"].some(kw => fullText.includes(kw))) itemDisplayCategory = "스마트팜";
                  else if (categoryKeywords["보조금"].some(kw => fullText.includes(kw))) itemDisplayCategory = "보조금";
                  else if (categoryKeywords["농지/임대차"].some(kw => fullText.includes(kw))) itemDisplayCategory = "농지/임대차";
                  else if (categoryKeywords["노동"].some(kw => fullText.includes(kw))) itemDisplayCategory = "노동";
                  else if (categoryKeywords["주거"].some(kw => fullText.includes(kw))) itemDisplayCategory = "주거";
                  else itemDisplayCategory = "일반";
                }

                return (
                  <motion.div
                    key={item.id || idx}
                    onClick={() => {
                      const url = item.link || item.url;

                      if (url && typeof url === "string" && url.startsWith("http")) {
                        window.open(url, "_blank", "noopener,noreferrer");
                      } else {
                        console.log("유효하지 않은 링크:", item);
                        alert("이 기사에는 유효한 원문 링크가 없습니다.");
                      }
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4 gap-3">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wider ${customFilters.includes(activeCategory) ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600 uppercase'}`}>
                          {itemDisplayCategory}
                        </span>

                        <span className="text-xs font-bold text-slate-400 shrink-0">
                          {item.date || "Today"}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 mb-3 leading-snug break-keep group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>

                      <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3 break-keep">
                        {item.summary}
                      </p>

                      {item.impact && (
                        <p className="text-xs font-bold text-blue-600 break-keep">
                          {item.impact}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
                <p className="text-slate-400 font-bold mb-2">조건에 맞는 정책 데이터가 없습니다.</p>
                {customFilters.includes(activeCategory) && (
                  <p className="text-sm text-slate-400">
                    현재 <span className="font-bold text-blue-500">'{activeCategory}'</span> 키워드로 수집된 최신 데이터가 없습니다.
                  </p>
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