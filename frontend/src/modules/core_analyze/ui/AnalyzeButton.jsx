export default function AnalyzeButton({ onClick, loading }) {
  return (
    <button onClick={onClick} disabled={loading}>
      {loading ? "분석 중..." : "분석 시작"}
    </button>
  );
}