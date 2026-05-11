import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, RotateCcw } from "lucide-react";

import AnalysisResultTabs from "./AnalysisResultTabs";

const getContractText = (data) => {
  if (!data) return "";

  return (
    data.contractText ||
    data.contract_text ||
    data.extractedText ||
    data.extracted_text ||
    data.rawText ||
    data.raw_text ||
    data.text ||
    data.content ||
    data.documentText ||
    data.document_text ||
    data.originalText ||
    data.original_text ||
    data.fullText ||
    data.full_text ||
    JSON.stringify(data, null, 2)
  );
};

const getDocumentTitle = (data) => {
  if (!data) return "계약서 분석 리포트";

  return (
    data.title ||
    data.fileName ||
    data.filename ||
    data.documentName ||
    data.document_name ||
    "계약서 분석 리포트"
  );
};

const ReportView = ({ data, onReset }) => {
  const contractText = getContractText(data);
  const title = getDocumentTitle(data);

  return (
    <motion.div
      key="report-view"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="w-full space-y-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onReset}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              <FileText size={14} />
              Analysis Report
            </div>

            <h2 className="break-keep text-3xl font-black tracking-tight text-slate-950">
              {title}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex w-fit items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-600"
        >
          <RotateCcw size={16} />
          새 분석하기
        </button>
      </div>

      <AnalysisResultTabs
        contractText={contractText}
        apiAnalysisResult={data}
      />
    </motion.div>
  );
};

export default ReportView;