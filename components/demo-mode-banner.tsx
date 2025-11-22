"use client";

import { Megaphone } from "lucide-react";
import { motion } from "framer-motion";

export default function DemoModeBanner() {
  return (
    <div className="w-full bg-yellow-400 text-black py-2 overflow-hidden shadow-md border-b border-yellow-500">
      <motion.div
        className="flex items-center gap-2 whitespace-nowrap text-sm font-medium"
        animate={{ x: ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
      >
        <Megaphone className="h-4 w-4" />
        Sayt hozirda test rejimida ishlayapdi.
      </motion.div>
    </div>
  );
}
