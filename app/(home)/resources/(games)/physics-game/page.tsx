"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackPrev from "@/components/back-prev";
import { Play } from "lucide-react";

const CLASS_INFO = [
  { id: "7", title: "7-sinf", subtitle: "Mexanika asoslari" },
  { id: "8", title: "8-sinf", subtitle: "Kuch va energiya" },
  { id: "9", title: "9-sinf", subtitle: "Elektr va magnit" },
  { id: "10", title: "10-sinf", subtitle: "Molekulyar fizika" },
  { id: "11", title: "11-sinf", subtitle: "Zamonaviy fizika" },
];

export default function PhysicsGameIntroPage() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const handleStart = () => {
    if (!selectedClass) return;
    router.push(`/resources/physics-game/${selectedClass}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900">
      <main className="min-h-screen px-3 sm:px-6 py-10 lg:py-24">
        <div className="mx-auto max-w-6xl space-y-8">
          <BackPrev />

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <section className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
                Kattalik • Birlik • Formula
              </div>
              <div className="space-y-4">
                <p className="text-lg text-slate-600 md:text-xl">
                  Ekranda ko‘rsatilgan kattalikka mos formulani toping va uning
                  o‘lchov birligini aniqlang.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Tezkor tekshiruv",
                    desc: "Har savolda 1 birlik + 1 formula topiladi.",
                    icon: "⚡",
                  },
                  {
                    title: "Bosqichma-bosqich",
                    desc: "7–11 sinf darajasi bo‘yicha o‘sib boradi.",
                    icon: "📈",
                  },
                  {
                    title: "Yorqin vizual",
                    desc: "Glow kartalar va kosmik fon bilan ishlang.",
                    icon: "✨",
                  },
                  {
                    title: "Natija va progress",
                    desc: "Natijalar progressini kuzatib boring.",
                    icon: "🏆",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-[0_8px_25px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </div>
                        <p className="text-xs text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_55%)]" />
              <div className="relative">
                <div className="uppercase tracking-widest text-slate-500">
                  Sinfni tanlang
                </div>

                <div className="mt-6 space-y-3">
                  {CLASS_INFO.map((item) => {
                    const selected = item.id === selectedClass;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedClass(item.id)}
                        className={`group relative flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                          selected
                            ? "border-sky-300 bg-sky-50 shadow-[0_10px_25px_rgba(14,165,233,0.2)]"
                            : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)]"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleStart}
                  disabled={!selectedClass}
                  className={`mt-4 w-full rounded-xl py-3 px-6 font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                    selectedClass
                      ? "bg-edu-blue text-white hover:shadow-lg hover:scale-105"
                      : "cursor-not-allowed bg-slate-200 text-slate-400"
                  }`}
                >
                  <Play className="w-5 h-5" /> O‘yinni boshlash
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
