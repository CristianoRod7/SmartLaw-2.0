import React from "react";

export default function ActionGuidePanel({ actions = [] }) {
  return (
    <div className="bg-white p-8 rounded-[2.3rem] border border-slate-200 shadow-sm">
      <h2 className="text-2xl font-black text-slate-900 mb-5">우선 조치 사항</h2>

      {actions.length > 0 ? (
        <ul className="space-y-3 text-sm font-bold text-slate-700">
          {actions.map((action, idx) => (
            <li
              key={idx}
              className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3"
            >
              {idx + 1}. {action}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500">추천 조치 사항이 없습니다.</p>
      )}
    </div>
  );
}