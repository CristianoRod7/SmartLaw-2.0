import React from "react";

export default function FormSectionCard({
  icon,
  title,
  description,
  badge,
  children,
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            {icon}
          </div>

          <div>
            <h2 className="text-[1.35rem] font-bold tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="mt-1 text-[15px] font-medium leading-6 text-slate-500 break-keep">
              {description}
            </p>
          </div>
        </div>

        {badge ? (
          <span className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
            {badge}
          </span>
        ) : null}
      </div>

      {children}
    </section>
  );
}