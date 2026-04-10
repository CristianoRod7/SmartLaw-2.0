import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  UploadCloud,
  CheckCircle2,
  FileText,
  Sprout,
  Landmark,
  Coins,
  Wrench,
  Users,
} from 'lucide-react';
import { analyzeApi } from '../../core_analyze/api/analyzeApi';

const Simulator = ({ onBack, onComplete }) => {
  const [form, setForm] = useState({
    contractType: '스마트팜 구축 계약',
    landType: '임대차',
    subsidy: '있음',
    investment: '',
    outsourcing: '외주 있음',
    operator: '개인',
    file: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.file) {
      alert('계약서를 업로드해주세요.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', form.file);
      formData.append('contract_type', form.contractType);
      formData.append('land_type', form.landType);
      formData.append('subsidy', form.subsidy);
      formData.append('investment', form.investment || '0');
      formData.append('outsourcing', form.outsourcing);
      formData.append('operator', form.operator);

      const res = await analyzeApi.simulateSmartFarm(formData);
      const finalData = res.data?.data || res.data;

      onComplete(finalData);
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || '';

      if (String(detail).includes('quota') || String(detail).includes('429')) {
        alert('Gemini 무료 사용량을 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        alert('시뮬레이션 실패: ' + (detail || '백엔드 서버를 확인해주세요.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const SectionCard = ({ icon, title, desc, children }) => (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 shadow-sm">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900">{title}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, children }) => (
    <div className="space-y-2">
      <label className="text-sm font-extrabold text-slate-700">{label}</label>
      {children}
    </div>
  );

  const baseInputClass =
    'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto pb-20 space-y-8"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          스마트팜 허브로
        </button>

        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            스마트팜 리스크 시뮬레이터
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            계약서 내용과 현장 조건을 함께 반영해 미래 리스크를 예측합니다.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2.8rem] border border-emerald-200/40 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.20),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_25%)]" />
        <div className="relative z-10 grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Smart Farm Scenario Engine
            </div>
            <h3 className="text-3xl font-black leading-tight md:text-4xl">
              계약 조건만 보지 말고,
              <br />
              <span className="text-emerald-300">운영 조건까지 같이 보자.</span>
            </h3>
            <p className="max-w-2xl break-keep text-sm leading-7 text-slate-300 md:text-base">
              농지 사용 형태, 보조금 여부, 투자 규모, 외주 구조를 함께 반영해
              6개월 후와 1년 후 발생 가능한 스마트팜 리스크를 시뮬레이션합니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-300">
                예측 대상
              </p>
              <p className="mt-3 text-lg font-black">보조금 환수</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-300">
                예측 대상
              </p>
              <p className="mt-3 text-lg font-black">농지 임대차 분쟁</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-300">
                예측 대상
              </p>
              <p className="mt-3 text-lg font-black">시공 하자 책임</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-300">
                출력 결과
              </p>
              <p className="mt-3 text-lg font-black">우선 조치 3가지</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[2.5rem] bg-white/90 backdrop-blur-sm text-center">
            <Loader2 className="mb-5 h-16 w-16 animate-spin text-emerald-600" />
            <h3 className="text-2xl font-black text-slate-900">시뮬레이션 중...</h3>
            <p className="mt-2 font-bold text-slate-500">
              계약 조건과 현장 구조를 바탕으로 미래 리스크를 계산하고 있습니다.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
          <SectionCard
            icon={<FileText size={22} />}
            title="계약 및 농지 정보"
            desc="계약 유형과 농지 구조를 먼저 정의합니다."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="계약 유형">
                <select
                  className={baseInputClass}
                  value={form.contractType}
                  onChange={(e) => handleChange('contractType', e.target.value)}
                >
                  <option value="스마트팜 구축 계약">스마트팜 구축 계약</option>
                  <option value="농지 임대차 계약">농지 임대차 계약</option>
                  <option value="보조금 관련 문서">보조금 관련 문서</option>
                  <option value="스마트팜 종합 분석">스마트팜 종합 분석</option>
                </select>
              </Field>

              <Field label="농지 사용 형태">
                <select
                  className={baseInputClass}
                  value={form.landType}
                  onChange={(e) => handleChange('landType', e.target.value)}
                >
                  <option value="자가">자가</option>
                  <option value="임대차">임대차</option>
                  <option value="혼합">혼합</option>
                  <option value="미정">미정</option>
                </select>
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            icon={<Coins size={22} />}
            title="보조금 및 투자 조건"
            desc="재정 구조와 정책 연동 여부를 입력합니다."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="보조금 여부">
                <select
                  className={baseInputClass}
                  value={form.subsidy}
                  onChange={(e) => handleChange('subsidy', e.target.value)}
                >
                  <option value="있음">있음</option>
                  <option value="신청 예정">신청 예정</option>
                  <option value="없음">없음</option>
                </select>
              </Field>

              <Field label="총 투자 규모 (만원)">
                <input
                  type="number"
                  placeholder="예: 5000"
                  className={baseInputClass}
                  value={form.investment}
                  onChange={(e) => handleChange('investment', e.target.value)}
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            icon={<Wrench size={22} />}
            title="시공 및 외주 구조"
            desc="누가 시공하고 누가 책임지는지 반영합니다."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="시공 / 설비 외주 여부">
                <select
                  className={baseInputClass}
                  value={form.outsourcing}
                  onChange={(e) => handleChange('outsourcing', e.target.value)}
                >
                  <option value="외주 있음">외주 있음</option>
                  <option value="부분 외주">부분 외주</option>
                  <option value="직접 진행">직접 진행</option>
                </select>
              </Field>

              <Field label="운영 주체">
                <select
                  className={baseInputClass}
                  value={form.operator}
                  onChange={(e) => handleChange('operator', e.target.value)}
                >
                  <option value="개인">개인</option>
                  <option value="가족 공동 운영">가족 공동 운영</option>
                  <option value="법인">법인</option>
                  <option value="파트너 공동 운영">파트너 공동 운영</option>
                </select>
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            icon={<Users size={22} />}
            title="계약서 업로드"
            desc="실제 문서 내용을 함께 반영해야 시뮬레이션 정확도가 올라갑니다."
          >
            <div
              className={`flex h-[220px] cursor-pointer flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed transition-all ${
                form.file
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-300 bg-slate-50 hover:border-emerald-300 hover:bg-slate-100'
              }`}
              onClick={() => document.getElementById('sim-file-upload')?.click()}
            >
              <input
                id="sim-file-upload"
                type="file"
                className="hidden"
                onChange={(e) => handleChange('file', e.target.files?.[0] || null)}
                accept=".pdf,.txt"
              />

              {form.file ? (
                <CheckCircle2 size={42} className="text-emerald-600" />
              ) : (
                <UploadCloud size={42} className="text-slate-400" />
              )}

              <div className="text-center">
                <p className="font-black text-slate-800">
                  {form.file ? form.file.name : '클릭하여 계약서를 선택하세요'}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  PDF 또는 TXT 파일 업로드
                </p>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-10 py-4 text-lg font-black text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-400 disabled:opacity-50"
          >
            스마트팜 리스크 시뮬레이션 실행
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Simulator;