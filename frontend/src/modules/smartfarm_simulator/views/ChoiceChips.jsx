import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function ChoiceChips({
  label,
  value,
  options = [],
  onChange,
  helperText,
}) {
  return (
    <div>
      <label className="text-[14px] font-semibold text-slate-700">
        {label}
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option;

          return (
            <motion.button
              key={option}
              type="button"
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
              onClick={() => onChange(option)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "border border-emerald-500 bg-emerald-500 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {active && <Check size={14} />}
              {option}
            </motion.button>
          );
        })}
      </div>

      {helperText ? (
        <p className="mt-2 text-xs font-medium text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}