import os

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"✅ 생성 완료: {path}")

def setup():
    print("🚀 NextLaw 2.0 프론트엔드 풀 빌드 시작한다, 우진아!")

    # 1. API 통신 로직 (api/analyze.js)
    create_file("frontend/src/api/analyze.js", """
import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1/analyze`,
});

export const analyzeApi = {
    // 계약서 분석 요청
    uploadContract: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/contract', formData);
    },
    // 전체 히스토리 조회
    getHistory: () => api.get('/history'),
    // 상세 내역 조회
    getDetail: (id) => api.get(`/history/${id}`),
};
    """)

    # 2. 결과 카드 컴포넌트 (components/analysis/RiskCard.jsx)
    create_file("frontend/src/components/analysis/RiskCard.jsx", """
import React from 'react';

const RiskCard = ({ risk }) => (
    <div className="p-4 mb-4 border rounded-lg shadow-sm bg-white border-l-4 border-l-red-500">
        <h4 className="font-bold text-lg text-slate-800">{risk.clause}</h4>
        <div className="flex gap-2 my-2">
            <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded">
                {risk.danger_level}
            </span>
        </div>
        <p className="text-slate-600 mb-3">{risk.description}</p>
        <div className="flex flex-wrap gap-2">
            {risk.highlight_keywords.map((kw, i) => (
                <span key={i} className="px-2 py-1 bg-yellow-200 text-xs rounded-full font-medium">
                    #{kw}
                </span>
            ))}
        </div>
    </div>
);

export default RiskCard;
    """)

    # 3. 메인 화면 (pages/Home.jsx)
    create_file("frontend/src/pages/Home.jsx", """
import React, { useState } from 'react';
import { analyzeApi } from '../api/analyze';
import RiskCard from '../components/analysis/RiskCard';

const Home = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert("파일을 올려줘!");
        setLoading(true);
        try {
            const res = await analyzeApi.uploadContract(file);
            setResult(res.data.data);
        } catch (err) {
            alert("서버 연결 실패!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <header className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">⚖️ NextLaw 2.0</h1>
                <p className="text-slate-500">AI 전세 사기 예방 변호사</p>
            </header>

            <div className="bg-slate-50 p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-4 block mx-auto" />
                <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                    {loading ? "분석 중..." : "계약서 무료 분석하기"}
                </button>
            </div>

            {result && (
                <div className="mt-10">
                    <div className="bg-white p-6 rounded-xl shadow-lg border mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">분석 결과 요약</h2>
                            <span className="text-3xl font-black text-red-600">{result.score}점</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{result.summary}</p>
                    </div>

                    <h3 className="text-lg font-bold mb-4">🚩 핵심 위험 요소</h3>
                    {result.risk_factors.map((r, i) => <RiskCard key={i} risk={r} />)}
                </div>
            )}
        </div>
    );
};

export default Home;
    """)

    # 4. App.jsx (라우팅 설정)
    create_file("frontend/src/App.jsx", """
import React from 'react';
import Home from './pages/Home';

function App() {
    return (
        <div className="min-h-screen bg-slate-100 py-10">
            <Home />
        </div>
    );
}

export default App;
    """)

    print("\n🏗️ 모든 뼈대 파일 생성 완료! 이제 디자인만 입히면 돼.")

if __name__ == "__main__":
    setup()