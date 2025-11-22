import { eduGames } from "@/mock/mock-data";
import { motion, Variants } from "framer-motion";
import { Trophy, Users } from "lucide-react";

const HeroSection = () => {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: custom,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10 pb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <motion.div
          className="space-y-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-linear-to-r from-sky-400 to-indigo-500 animate-pulse" />
            Bizning interaktiv metodlar
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              <span className="bg-linear-to-r from-sky-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                Qiziqarli metodlar
              </span>{" "}
              bilan dars sifatini oshiring.
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
              O‘quvchilar uchun mo‘ljallangan interaktiv metodlarni sinab
              ko‘ring va o‘quv jarayoniga qo‘llash orqali dars sifatini
              o‘zgarishini kuzating.
            </p>
          </div>
        </motion.div>

        {/* Hero stats */}
        <motion.div
          className="grid grid-cols-2 gap-3 md:gap-4 min-w-[260px]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.08,
                delayChildren: 0.15,
              },
            },
          }}
        >
          <motion.div
            className="rounded-2xl bg-white/80 px-4 py-3 shadow-md backdrop-blur border border-white/60"
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-tr from-amber-400 to-rose-400 text-white">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Metodlar
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {eduGames.length}+
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="rounded-2xl bg-white/80 px-4 py-3 shadow-md backdrop-blur border border-white/60"
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-tr from-sky-400 to-indigo-500 text-white">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Ustozlar
                </p>
                <p className="text-sm font-semibold text-slate-900">500+</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
