"use client";

import { motion } from "framer-motion";

export default function ClientMotionWrapper({ children, className }) {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={className}>
      {children}
    </motion.div>
  );
}
