import { motion } from "framer-motion";

const Gradients = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-linear-to-br from-sky-400/40 via-indigo-400/40 to-transparent blur-3xl"
        animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
        transition={{
          duration: 9,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-linear-to-tr from-emerald-300/40 via-sky-300/30 to-transparent blur-3xl"
        animate={{ y: [0, 10, 0], x: [0, -10, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-t from-violet-300/30 via-sky-200/20 to-transparent blur-3xl opacity-70"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default Gradients;
