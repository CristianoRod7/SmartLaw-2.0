import React from "react";
import {
  ShieldAlert,
  Sparkles,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";
import ChoiceChips from "../views/ChoiceChips";
import NumberInputField from "../views/NumberInputField";
import { helperClass, inputClass, labelClass } from "../views/formStyles";
import AnimatedStepShell from "../views/AnimatedStepShell";

function StepRow({ children }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>;
}

function FadeItem({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function Step1Operation({ form, onChange, step }) {
  return (
    <div className="space-y-4">
      <AnimatedStepShell
        step={step}
        title="기본 정보"
        description="작목, 시설 형태, 지역, 운영 방식을 입력합니다."
      >
        <StepRow>
          <FadeItem>
            <ChoiceChips
              label="작목"
              value={form.crop}
              options={["딸기", "토마토", "파프리카", "엽채류", "화훼", "버섯", "기타"]}
              onChange={(value) => onChange("crop", value)}
              helperText="작목별 운영비와 수익 구조가 다르게 반영됩니다."
            />
          </FadeItem>

          <FadeItem>
            <ChoiceChips
              label="시설 형태"
              value={form.facilityType}
              options={["비닐하우스", "유리온실", "수직농장", "기타"]}
              onChange={(value) => onChange("facilityType", value)}
              helperText="시설 형태에 따라 유지비와 장애 리스크가 달라집니다."
            />
          </FadeItem>

          <FadeItem>
            <div>
              <label className={labelClass}>지역</label>
              <input
                type="text"
                value={form.region}
                onChange={(e) => onChange("region", e.target.value)}
                placeholder="예: 충남 논산"
                className={inputClass}
              />
            </div>
          </FadeItem>

          <FadeItem>
            <ChoiceChips
              label="운영 방식"
              value={form.operationMode}
              options={["직영", "위탁", "공동 운영"]}
              onChange={(value) => onChange("operationMode", value)}
            />
          </FadeItem>

          <FadeItem>
            <NumberInputField
              label="재배 면적"
              value={form.area || 0}
              unit="평"
              onChange={(value) => onChange("area", value)}
            />
          </FadeItem>

          <FadeItem>
            <NumberInputField
              label="운영 경력"
              value={form.operationYears || 0}
              unit="년"
              onChange={(value) => onChange("operationYears", value)}
            />
          </FadeItem>
        </StepRow>
      </AnimatedStepShell>
    </div>
  );
}

function Step2Finance({ form, onChange, step }) {
  const financeFields = [
    ["initialCost", "초기 설치비", "원", ""],
    ["loanAmount", "대출 규모", "원", "대출 비중이 높을수록 중기 리스크가 올라갑니다."],
    ["interestRate", "금리", "%", ""],
    ["monthlyFixedCost", "월 고정비", "원", ""],
    ["monthlyVariableCost", "월 변동비", "원", ""],
    ["laborCost", "월 인건비", "원", ""],
    ["energyCost", "월 에너지비", "원", ""],
    ["monthlyRevenue", "예상 월매출", "원", ""],
  ];

  return (
    <div className="space-y-4">
      <AnimatedStepShell
        step={step}
        title="자금 구조"
        description="초기 투자, 대출, 월 비용과 매출 구조를 입력합니다."
      >
        <StepRow>
          {financeFields.map(([key, label, unit, helperText]) => (
            <FadeItem key={key}>
              <NumberInputField
                label={label}
                value={form[key] || 0}
                unit={unit}
                helperText={helperText}
                onChange={(value) => onChange(key, value)}
              />
            </FadeItem>
          ))}
        </StepRow>
      </AnimatedStepShell>
    </div>
  );
}

function Step3Policy({ form, onChange, step }) {
  const subsidyValue = form.hasSubsidy ? "예" : "아니오";
  const reportingValue = form.reportingDuty ? "있음" : "없음";

  return (
    <div className="space-y-4">
      <AnimatedStepShell
        step={step}
        title="보조금 및 의무사항"
        description="보조금 수령 여부와 의무 운영기간을 확인합니다."
      >
        <div className="space-y-5">
          <FadeItem>
            <ChoiceChips
              label="보조금 수령 여부"
              value={subsidyValue}
              options={["예", "아니오"]}
              onChange={(value) => onChange("hasSubsidy", value === "예")}
              helperText="지원금을 받은 경우 의무 운영기간과 보고 의무가 중요해집니다."
            />
          </FadeItem>

          {form.hasSubsidy ? (
            <StepRow>
              <FadeItem>
                <div>
                  <label className={labelClass}>지원사업명</label>
                  <input
                    type="text"
                    value={form.supportProgram || ""}
                    onChange={(e) => onChange("supportProgram", e.target.value)}
                    placeholder="예: 청년후계농 영농정착지원"
                    className={inputClass}
                  />
                  <p className={helperClass}>
                    정확한 사업명을 입력하면 의무사항 해석에 도움이 됩니다.
                  </p>
                </div>
              </FadeItem>

              <FadeItem>
                <NumberInputField
                  label="의무 운영기간"
                  value={form.mandatoryOperationPeriod || 0}
                  unit="개월"
                  onChange={(value) => onChange("mandatoryOperationPeriod", value)}
                  helperText="의무 운영기간이 길수록 중도 포기 시 리스크가 커질 수 있습니다."
                />
              </FadeItem>

              <FadeItem>
                <ChoiceChips
                  label="성과보고 의무"
                  value={reportingValue}
                  options={["있음", "없음"]}
                  onChange={(value) => onChange("reportingDuty", value === "있음")}
                  helperText="보고 누락 가능성은 환수 리스크 계산에 반영됩니다."
                />
              </FadeItem>

              <FadeItem>
                <div>
                  <label className={labelClass}>추가 메모</label>
                  <input
                    type="text"
                    value={form.subsidyMemo || ""}
                    onChange={(e) => onChange("subsidyMemo", e.target.value)}
                    placeholder="예: 정산서 제출, 실적 보고 필요"
                    className={inputClass}
                  />
                  <p className={helperClass}>
                    사업별 특이사항이나 담당기관 요구사항이 있으면 적어두세요.
                  </p>
                </div>
              </FadeItem>
            </StepRow>
          ) : (
            <FadeItem>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-medium text-slate-600 break-keep">
                  현재 보조금을 받지 않는다면, 이 단계에서는 추가 입력이 필요 없습니다.
                </p>
              </div>
            </FadeItem>
          )}
        </div>
      </AnimatedStepShell>
    </div>
  );
}

function Step4Contract({
  form,
  onChange,
  contractFile,
  setContractFile,
  contractAnalysis,
  onAnalyzeContract,
  loading,
  step,
}) {
  const contractTypeOptions = [
    "스마트팜 구축 계약",
    "농지 임대차 계약",
    "보조금 관련 문서",
    "스마트팜 종합 분석",
  ];

  const counterpartyOptions = [
    "시공업체",
    "농지 소유자",
    "지원기관",
    "유지보수 업체",
    "기타",
  ];

  return (
    <div className="space-y-4">
      <AnimatedStepShell
        step={step}
        title="계약 참고자료"
        description="계약서가 있으면 주요 조항을 자동 반영합니다."
      >
        <div className="space-y-6">
          <StepRow>
            <FadeItem>
              <ChoiceChips
                label="계약 유형"
                value={form.contractType}
                options={contractTypeOptions}
                onChange={(value) => onChange("contractType", value)}
                helperText="문서 성격에 따라 분석 기준이 달라집니다."
              />
            </FadeItem>

            <FadeItem>
              <ChoiceChips
                label="계약 상대방 유형"
                value={form.counterpartyType}
                options={counterpartyOptions}
                onChange={(value) => onChange("counterpartyType", value)}
                helperText="상대방 유형에 따라 책임 구조 해석이 달라질 수 있습니다."
              />
            </FadeItem>
          </StepRow>

          <FadeItem>
            <div>
              <label className={labelClass}>계약서 파일</label>

              <label className="mt-3 flex cursor-pointer items-center justify-between rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-5 transition hover:border-emerald-300 hover:bg-white">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600">
                    <Upload size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800 break-all">
                      {contractFile ? contractFile.name : "계약서 파일 업로드"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      PDF, DOCX, TXT, 이미지 파일을 올리면 주요 조항을 자동 추출합니다.
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp,.bmp"
                  className="hidden"
                  onChange={(e) => setContractFile(e.target.files?.[0] || null)}
                />
              </label>

              <p className={helperClass}>
                계약서가 없어도 시뮬레이션은 가능하지만, 업로드하면 계약 관련 위험을 더 정확히 반영할 수 있습니다.
              </p>
            </div>
          </FadeItem>

          <FadeItem>
            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onAnalyzeContract}
                disabled={!contractFile || loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles size={16} />
                {loading ? "계약서 분석 중..." : "계약서 반영하기"}
              </motion.button>

              {contractFile && !loading && (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
                  업로드 완료
                </span>
              )}
            </div>
          </FadeItem>

          {loading && (
            <FadeItem>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">
                      계약서 분석 중입니다...
                    </p>
                    <p className="mt-1 text-xs font-medium leading-5 text-emerald-700/80 break-keep">
                      문서 내 핵심 조항을 확인하고 시뮬레이션 항목에 반영하는 중입니다.
                    </p>
                  </div>
                </div>
              </div>
            </FadeItem>
          )}

          <FadeItem>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-5">
              <div className="mb-4 flex items-center gap-2">
                <ShieldAlert size={18} className="text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">자동 추출 결과</h3>
              </div>

              {contractAnalysis ? (
                <StepRow>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-semibold text-slate-400">계약 리스크</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{form.contractRiskLevel}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-semibold text-slate-400">유지보수 책임</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{form.maintenanceOwner}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-semibold text-slate-400">위약금 수준</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{form.terminationPenaltyLevel}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-semibold text-slate-400">책임 범위</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{form.liabilityLevel}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-semibold text-slate-400">보조금 환수 트리거</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {form.subsidyClawbackTrigger ? "있음" : "없음"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-semibold text-slate-400">데이터 소유권</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{form.dataOwnership}</p>
                  </div>
                </StepRow>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5">
                  <p className="text-sm font-medium text-slate-500 break-keep">
                    계약서를 업로드하고 분석하면 유지보수 책임, 위약금, 책임 범위, 환수 위험 같은 정보가 자동으로 채워집니다.
                  </p>
                </div>
              )}
            </div>
          </FadeItem>
        </div>
      </AnimatedStepShell>
    </div>
  );
}

function Step5Review({ form, analysisEvidence = [], step }) {
  const reviewItems = [
    ["작목", form.crop],
    ["시설 형태", form.facilityType],
    ["지역", form.region || "미입력"],
    ["운영 방식", form.operationMode],
    ["초기 설치비", `${Number(form.initialCost || 0).toLocaleString()}원`],
    ["대출 규모", `${Number(form.loanAmount || 0).toLocaleString()}원`],
    ["예상 월매출", `${Number(form.monthlyRevenue || 0).toLocaleString()}원`],
    ["보조금 수령", form.hasSubsidy ? "예" : "아니오"],
    ["의무 운영기간", form.mandatoryOperationPeriod ? `${form.mandatoryOperationPeriod}개월` : "미입력"],
    ["계약 유형", form.contractType],
    ["유지보수 책임", form.maintenanceOwner],
    ["위약금 수준", form.terminationPenaltyLevel],
  ];

  return (
    <div className="space-y-4">
      <AnimatedStepShell
        step={step}
        title="최종 확인"
        description="입력한 내용을 확인한 뒤 진단을 실행합니다."
      >
        <div className="space-y-6">
          <StepRow>
            {reviewItems.map(([label, value]) => (
              <FadeItem key={label}>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs font-semibold tracking-wide text-slate-400">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
                </div>
              </FadeItem>
            ))}
          </StepRow>

          {analysisEvidence?.length > 0 && (
            <FadeItem>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600" />
                  <p className="text-sm font-semibold text-emerald-700">계약서 자동 추출 근거</p>
                </div>

                <div className="space-y-3">
                  {analysisEvidence.map((item, idx) => (
                    <div
                      key={`${item.title}-${idx}`}
                      className="rounded-xl border border-emerald-100 bg-white px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm font-medium text-slate-600 break-keep">
                        {item.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeItem>
          )}
        </div>
      </AnimatedStepShell>
    </div>
  );
}

export default function SimulatorSteps({
  step,
  form,
  onChange,
  contractFile,
  setContractFile,
  contractAnalysis,
  onAnalyzeContract,
  analyzingContract,
  analysisEvidence,
}) {
  if (step === 1) {
    return <Step1Operation form={form} onChange={onChange} step={step} />;
  }

  if (step === 2) {
    return <Step2Finance form={form} onChange={onChange} step={step} />;
  }

  if (step === 3) {
    return <Step3Policy form={form} onChange={onChange} step={step} />;
  }

  if (step === 4) {
    return (
      <Step4Contract
        form={form}
        onChange={onChange}
        contractFile={contractFile}
        setContractFile={setContractFile}
        contractAnalysis={contractAnalysis}
        onAnalyzeContract={onAnalyzeContract}
        loading={analyzingContract}
        step={step}
      />
    );
  }

  return <Step5Review form={form} analysisEvidence={analysisEvidence} step={step} />;
}