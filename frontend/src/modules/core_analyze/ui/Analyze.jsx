import { useEffect, useState } from "react";

// API
import { analyzeApi } from "../api/analyzeApi";

// utils
import { getIndustryFromCategory } from "../utils/getIndustryFromCategory";

// UI 컴포넌트
import UploadBox from "./UploadBox";
import CategorySelect from "./CategorySelect";
import AnalyzeButton from "./AnalyzeButton";

const sampleFiles = {
  "부동산 임대차 계약서": "/samples/real_estate_lease.txt",
  "전세 계약서": "/samples/real_estate_lease.txt",
  "월세 계약서": "/samples/real_estate_lease.txt",
  "근로 계약서": "/samples/employment_contract.txt",
  "금전 소비대차 계약서": "/samples/loan_agreement.txt",
  "IT 외주 계약서": "/samples/freelance_contract.txt",
  "소프트웨어 개발 계약서": "/samples/freelance_contract.txt",
  "외주 개발 계약서": "/samples/freelance_contract.txt",
  "프리랜서 용역 계약서": "/samples/freelance_contract.txt",
  "용역/프리랜서 계약서": "/samples/freelance_contract.txt",
  "비밀유지 계약서(NDA)": "/samples/nda.txt",
  "NDA / 비밀유지계약서": "/samples/nda.txt",
  "IT 유지보수 계약서": "/samples/maintenance_contract.txt",
  "유지보수 계약서": "/samples/maintenance_contract.txt",
  "스마트팜 구축 계약": "/samples/smartfarm_build.pdf",
  "농지 임대차 계약": "/samples/farmland_lease.pdf",
  "보조금 관련 문서": "/samples/subsidy.pdf",
  "스마트팜 종합 분석": "/samples/smartfarm_full.pdf",
};

export default function Analyze({
  onBack,
  onComplete,
  initialCategory = "스마트팜 구축 계약",
}) {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleAnalyze = async (targetFile = file) => {
    if (!targetFile) {
      alert("파일을 선택해주세요.");
      return;
    }

    const industry = getIndustryFromCategory(category);
    setLoading(true);

    try {
      const res = await analyzeApi.uploadContract(
        targetFile,
        industry,
        category
      );

      console.log("백엔드 원본 응답:", res.data);

      const finalData = res.data?.data || res.data;
      console.log("최종 렌더링 데이터:", finalData);

      if (onComplete) {
        onComplete(finalData);
      } else {
        console.log("onComplete 없음:", finalData);
      }
    } catch (err) {
      console.error(err);

      const status = err.response?.status;
      const detail = err.response?.data?.detail || "";

      if (
        status === 503 &&
        (String(detail).includes("quota") || String(detail).includes("429"))
      ) {
        alert("Gemini 무료 사용량을 초과했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert("분석 실패: " + (detail || "백엔드 서버를 확인해주세요."));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSample = async () => {
    const url = sampleFiles[category];

    if (!url) {
      alert("해당 카테고리에 대한 샘플 파일이 없습니다.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("샘플 파일을 불러오지 못했습니다.");
      }

      const blob = await res.blob();
      const fileName = url.split("/").pop();
      const sampleFile = new File([blob], fileName, {
        type: fileName.endsWith(".pdf") ? "application/pdf" : "text/plain",
      });

      setFile(sampleFile);
      await handleAnalyze(sampleFile);
    } catch (err) {
      console.error(err);
      alert("샘플 분석 실패: 샘플 파일 로드 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            AI 계약서 분석
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            문서 유형에 맞는 리스크 기준을 적용해 독소조항과 수정 포인트를 분석합니다.
          </p>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            뒤로가기
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-900 px-8 py-8 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
            NextLaw Contract Intelligence
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight">
            계약서 리스크 스캐너
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-300">
            스마트팜, 부동산, 외주 계약 문서를 업로드하면 산업별 기준에 따라 위험 조항과 개선 포인트를 빠르게 점검합니다.
          </p>
        </div>

        <div className="space-y-8 px-8 py-8 md:px-10 md:py-10">
          <CategorySelect
            value={category}
            setValue={setCategory}
            options={[
              "부동산 임대차 계약서",
              "근로 계약서",
              "금전 소비대차 계약서",
              "IT 외주 계약서",
              "소프트웨어 개발 계약서",
              "유지보수 계약서",
              "NDA / 비밀유지계약서",
              "프리랜서 용역 계약서",
              "용역/프리랜서 계약서",
              "비밀유지 계약서(NDA)",
              "IT 유지보수 계약서",
              "스마트팜 구축 계약",
              "농지 임대차 계약",
              "보조금 관련 문서",
              "스마트팜 종합 분석",
            ]}
          />

          <UploadBox file={file} setFile={setFile} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AnalyzeButton onClick={() => handleAnalyze()} loading={loading} />

            <button
              onClick={handleSample}
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-6 py-4 text-lg font-black text-emerald-700 transition-all hover:-translate-y-0.5 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              샘플 문서로 테스트
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}