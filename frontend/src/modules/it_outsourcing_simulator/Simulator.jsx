import React, { useState } from 'react';
import axios from 'axios';
import {
  ArrowLeft,
  FileText,
  Loader2,
  PlayCircle,
  ShieldCheck,
  SlidersHorizontal,
  UploadCloud,
} from 'lucide-react';
import { apiUrl } from '../../config/api';

const initialForm = {
  project_type: '웹/앱 개발',
  contract_amount: '10000000',
  paid_amount: '3000000',
  milestone_structure: '계약금 30% / 중도금 40% / 잔금 30%',
  requirement_change_level: 'medium',
  ip_transfer_timing: 'after_final_payment',
  maintenance_scope: 'bugfix_only',
  delay_penalty: 'standard',
  termination_settlement: 'has_settlement',
  server_cost_owner: 'client',
  handles_personal_data: 'yes',
  open_source_policy: 'allowed_with_notice',
};

const selectOptions = {
  requirement_change_level: [
    ['low', '요구사항 변경 적음'],
    ['medium', '요구사항 변경 보통'],
    ['high', '요구사항 변경 많음'],
  ],
  ip_transfer_timing: [
    ['before_payment', '계약/중도금 시 이전'],
    ['after_final_payment', '잔금 완납 후 이전'],
    ['unclear', '명확하지 않음'],
  ],
  maintenance_scope: [
    ['bugfix_only', '버그 수정 한정'],
    ['broad', '기능 추가까지 포함'],
    ['unclear', '명확하지 않음'],
  ],
  delay_penalty: [
    ['none', '지체상금 없음'],
    ['standard', '표준 수준'],
    ['excessive', '과도함'],
  ],
  termination_settlement: [
    ['has_settlement', '기성고 정산 있음'],
    ['unclear', '명확하지 않음'],
    ['no_settlement', '정산 조항 없음'],
  ],
  server_cost_owner: [
    ['client', '발주자 부담'],
    ['developer', '개발자 부담'],
    ['unclear', '명확하지 않음'],
  ],
  handles_personal_data: [
    ['yes', '개인정보 처리함'],
    ['no', '개인정보 처리 없음'],
  ],
  open_source_policy: [
    ['allowed_with_notice', '고지 후 사용 가능'],
    ['forbidden', '전면 금지'],
    ['unclear', '명확하지 않음'],
  ],
};

const fieldLabels = {
  requirement_change_level: '요구사항 변경 위험도',
  ip_transfer_timing: 'IP/소스코드 이전 시점',
  maintenance_scope: '유지보수 범위',
  delay_penalty: '지체상금 수준',
  termination_settlement: '해지 시 기성고 정산',
  server_cost_owner: '서버/외부 API 비용 부담',
  handles_personal_data: '개인정보 처리 여부',
  open_source_policy: '오픈소스 정책',
};

export default function ITOutsourcingSimulator({ onBack, onComplete }) {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (file) {
        formData.append('file', file);
      }

      const response = await axios.post(apiUrl('/api/v1/analyze/simulate-it'), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onComplete(response?.data?.data || response?.data);
    } catch (error) {
      console.error('IT 외주 시뮬레이션 실패:', error);
      onComplete({
        error: error?.response?.data?.detail || 'IT 외주 시뮬레이션 중 오류가 발생했습니다.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-20 font-sans">
      <header className="rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-8 text-white shadow-2xl">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/15"
        >
          <ArrowLeft size={16} /> IT 대시보드로
        </button>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-purple-200">
              <ShieldCheck size={14} /> IT PRE-RISK SIMULATOR
            </div>
            <h1 className="text-4xl font-black tracking-tight">IT 외주 리스크 시뮬레이터</h1>
            <p className="mt-3 max-w-2xl break-keep text-sm font-medium leading-6 text-slate-300">
              계약 금액, 검수 구조, IP 이전, 유지보수 범위, 개인정보·오픈소스 요소를 종합해 향후 분쟁 가능성을 예측합니다.
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-purple-500 px-7 py-4 text-base font-black text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-400 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <PlayCircle size={20} />}
            시뮬레이션 실행
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2.3rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600"><SlidersHorizontal size={20} /></div>
            <div>
              <h2 className="text-xl font-black text-slate-900">프로젝트 기본 정보</h2>
              <p className="text-sm font-medium text-slate-500">금액과 산출물 구조를 입력하세요.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">프로젝트 유형</span>
              <input
                value={form.project_type}
                onChange={(e) => handleChange('project_type', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold outline-none focus:border-purple-300 focus:bg-white"
              />
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">계약 금액</span>
                <input
                  type="number"
                  value={form.contract_amount}
                  onChange={(e) => handleChange('contract_amount', e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold outline-none focus:border-purple-300 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">이미 지급된 금액</span>
                <input
                  type="number"
                  value={form.paid_amount}
                  onChange={(e) => handleChange('paid_amount', e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold outline-none focus:border-purple-300 focus:bg-white"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">마일스톤 구조</span>
              <input
                value={form.milestone_structure}
                onChange={(e) => handleChange('milestone_structure', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold outline-none focus:border-purple-300 focus:bg-white"
              />
            </label>

            <label className="block rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 p-5">
              <span className="mb-2 flex items-center gap-2 text-sm font-black text-purple-700"><UploadCloud size={16} /> 계약서 파일 선택</span>
              <input
                type="file"
                accept=".pdf,.txt,.docx,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-sm font-bold text-slate-600"
              />
              {file && <p className="mt-3 text-xs font-bold text-slate-500"><FileText size={14} className="mr-1 inline" />{file.name}</p>}
            </label>
          </div>
        </div>

        <div className="rounded-[2.3rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-black text-slate-900">리스크 조건</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.entries(selectOptions).map(([key, options]) => (
              <label key={key} className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">{fieldLabels[key]}</span>
                <select
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-purple-300 focus:bg-white"
                >
                  {options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
