import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function AnimatedStepShell({ step, title, description, children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={step}
        initial={{ opacity: 0, x: 18, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: -18, y: -4 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
          className="space-y-5"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <h2 className="text-[1.9rem] font-bold tracking-tight text-slate-900 break-keep">
              {title}
            </h2>
            <p className="mt-2 text-[15px] font-medium leading-6 text-slate-500 break-keep">
              {description}
            </p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0 },
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
}