import { useState } from "react";

// ✅ API
import { analyzeApi } from "./api/analyzeApi";

// ✅ utils
import { getIndustryFromCategory } from "./utils/getIndustryFromCategory";

// ✅ UI 컴포넌트
import UploadBox from "./ui/UploadBox";
import CategorySelect from "./ui/CategorySelect";
import AnalyzeButton from "./ui/AnalyzeButton";
const sampleFiles = {
  "스마트팜 구축 계약": "/samples/smartfarm_build.pdf",
  "농지 임대차 계약": "/samples/farmland_lease.pdf",
  "보조금 관련 문서": "/samples/subsidy.pdf",
  "스마트팜 종합 분석": "/samples/smartfarm_full.pdf",
};
export default function Analyze() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("부동산 임대차 계약서");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return alert("파일 선택");

    const industry = getIndustryFromCategory(category);

    setLoading(true);

    try {
  const res = await analyzeApi.uploadContract(
    file,
    industry,
    category
  );

  console.log("결과:", res.data);

} catch (err) {
  console.error(err);

  const detail = err.response?.data?.detail || "";

  if (String(detail).includes("quota") || String(detail).includes("429")) {
    alert("Gemini 무료 사용량을 초과했습니다. 잠시 후 다시 시도해주세요.");
  } else {
    alert("분석 실패: " + detail);
  }

} finally {
  setLoading(false);
}
  };

  const handleSample = () => {
    const sampleFile = sampleFiles[category];
    if (sampleFile) {
      alert(`샘플 파일 로드: ${sampleFile}`);
      // Implement sample file loading logic here
    } else {
      alert("해당 카테고리에 대한 샘플 파일이 없습니다.");
    }
  };

  return (
    <div>
      <h1>계약서 분석</h1>

      <CategorySelect
        value={category}
        setValue={setCategory}
        options={[
          "부동산 임대차 계약서",
          "근로 계약서",
          "금전 소비대차 계약서",
          "용역/프리랜서 계약서",
          "스마트팜 구축 계약",
        ]}
      />

      <UploadBox file={file} setFile={setFile} />
       
      <AnalyzeButton onClick={handleAnalyze} loading={loading} />
       <button onClick={handleSample}>
        샘플 문서로 테스트
      </button> 
    </div>
  );
};