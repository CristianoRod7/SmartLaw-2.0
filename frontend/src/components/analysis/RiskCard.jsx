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