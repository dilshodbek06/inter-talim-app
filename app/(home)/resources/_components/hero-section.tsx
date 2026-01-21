"use client";

import { eduGames } from "@/mock/mock-data";
import { Trophy, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10 pb-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div
          className="space-y-4 animate-fade-up"
          style={{ animationDelay: "40ms" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-linear-to-r from-sky-400 to-indigo-500" />
            Bizning interaktiv o‘yinlar
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
        </div>

        <div
          className="grid grid-cols-2 gap-3 md:gap-4 min-w-[260px] animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          {/* 1-Stat karta */}
          <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-md backdrop-blur border border-white/60">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-tr from-amber-400 to-rose-400 text-white">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Metodlar
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {eduGames.length - 1}+
                </p>
              </div>
            </div>
          </div>

          {/* 2-Stat karta */}
          <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-md backdrop-blur border border-white/60">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-tr from-sky-400 to-indigo-500 text-white">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Ustozlar
                </p>
                <p className="text-sm font-semibold text-slate-900">25+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
