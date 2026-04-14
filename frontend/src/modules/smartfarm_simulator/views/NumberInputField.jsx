import React from "react";

function formatNumber(value) {
  if (value === null || value === undefined || value === "") return "";
  const num = String(value).replace(/[^0-9]/g, "");
  if (!num) return "";
  return Number(num).toLocaleString();
}

export default function NumberInputField({
  label,
  value,
  onChange,
  unit,
  placeholder = "0",
  helperText,
}) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    onChange(raw === "" ? 0 : Number(raw));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-black tracking-tight text-slate-700">
          {label}
        </label>
        {unit ? (
          <span className="text-xs font-black text-slate-400">{unit}</span>
        ) : null}
      </div>

      <input
        type="text"
        inputMode="numeric"
        value={formatNumber(value)}
        onChange={handleChange}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />

      {helperText ? (
        <p className="mt-1 text-xs font-medium text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}