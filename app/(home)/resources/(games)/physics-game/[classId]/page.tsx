/* eslint-disable react-hooks/purity */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Maximize2, Minimize2 } from "lucide-react";
import BackPrev from "@/components/back-prev";
import { useExitGuard } from "@/hooks/use-exit-guard";
import { useFeedbackSounds } from "@/hooks/use-feedback-sounds";

type Question = {
  quantity: string;
  correctUnit: string;
  correctFormula: string;
  options: string[];
};

type QuestionsByClass = Record<string, Question[]>;

const CLASS_INFO = [
  { id: "7", title: "7-sinf", subtitle: "Mexanika asoslari" },
  { id: "8", title: "8-sinf", subtitle: "Kuch va energiya" },
  { id: "9", title: "9-sinf", subtitle: "Elektr va magnit" },
  { id: "10", title: "10-sinf", subtitle: "Molekulyar fizika" },
  { id: "11", title: "11-sinf", subtitle: "Zamonaviy fizika" },
];

const backgroundStyle = {
  backgroundImage:
    "radial-gradient(1100px 600px at 8% -12%, rgba(56,189,248,0.35), transparent 60%), radial-gradient(900px 520px at 92% 6%, rgba(14,165,233,0.25), transparent 60%), radial-gradient(800px 450px at 50% 100%, rgba(236,72,153,0.25), transparent 60%), linear-gradient(180deg, #050512, #0b1124 55%, #05040d)",
};

const shuffleArray = <T,>(items: T[]) => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function PhysicsGameClassPage() {
  const fullscreenRef = useRef<HTMLDivElement | null>(null);
  const params = useParams<{ classId: string }>();
  const router = useRouter();
  const rawClassId = params?.classId;
  const classId = Array.isArray(rawClassId) ? rawClassId[0] : rawClassId;

  const [questionsByClass, setQuestionsByClass] =
    useState<QuestionsByClass | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [locked, setLocked] = useState({ unit: false, formula: false });
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const [shakeOption, setShakeOption] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { playSuccess, playError } = useFeedbackSounds({ enabled: soundOn });

  useEffect(() => {
    let active = true;
    fetch("/data/physics-questions.json")
      .then((res) => res.json())
      .then((data: QuestionsByClass) => {
        if (active) {
          setQuestionsByClass(data);
        }
      })
      .catch(() => {
        if (active) {
          setQuestionsByClass({});
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    setLocked({ unit: false, formula: false });
    setWrongOptions([]);
    setShakeOption(null);
  }, [classId]);

  const toggleFullscreen = async () => {
    if (typeof document === "undefined") return;
    try {
      if (!document.fullscreenElement) {
        await fullscreenRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen errors (browser restrictions).
    }
  };

  const classQuestions = classId ? (questionsByClass?.[classId] ?? []) : [];
  const totalQuestions = classQuestions.length;
  const currentQuestion = classQuestions[currentIndex];
  const classComplete =
    Boolean(classId) && totalQuestions > 0 && currentIndex >= totalQuestions;

  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return shuffleArray(currentQuestion.options);
  }, [currentQuestion]);

  const confettiPieces = useMemo(() => {
    if (!classComplete) return [];
    return Array.from({ length: 32 }).map((_, index) => ({
      id: `${classId}-${index}`,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2.8 + Math.random() * 1.5,
      color: ["#22d3ee", "#a855f7", "#f97316", "#22c55e", "#facc15"][index % 5],
    }));
  }, [classComplete, classId]);

  const resetQuestionState = () => {
    setLocked({ unit: false, formula: false });
    setWrongOptions([]);
    setShakeOption(null);
  };

  const handleOptionClick = (option: string) => {
    if (!currentQuestion || classComplete) return;
    const isCorrectUnit = option === currentQuestion.correctUnit;
    const isCorrectFormula = option === currentQuestion.correctFormula;
    const isLocked =
      (isCorrectUnit && locked.unit) || (isCorrectFormula && locked.formula);

    if (isLocked) return;

    if (isCorrectUnit) {
      setLocked((prev) => ({ ...prev, unit: true }));
      playSuccess();
      return;
    }

    if (isCorrectFormula) {
      setLocked((prev) => ({ ...prev, formula: true }));
      playSuccess();
      return;
    }

    setWrongOptions((prev) =>
      prev.includes(option) ? prev : [...prev, option],
    );
    setShakeOption(option);
    playError();
    window.setTimeout(() => setShakeOption(null), 450);
  };

  useEffect(() => {
    if (!locked.unit || !locked.formula) return;
    const timer = window.setTimeout(() => {
      if (currentIndex + 1 >= totalQuestions) {
        setCurrentIndex(totalQuestions);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
      resetQuestionState();
    }, 700);
    return () => window.clearTimeout(timer);
  }, [locked.unit, locked.formula, currentIndex, totalQuestions]);

  const progressLabel =
    classId && totalQuestions > 0
      ? `${classId}-sinf: ${Math.min(currentIndex, totalQuestions)} / ${totalQuestions}`
      : "";
  const segmentCount = totalQuestions > 0 ? totalQuestions : 10;
  const hasProgress =
    currentIndex > 0 ||
    locked.unit ||
    locked.formula ||
    wrongOptions.length > 0 ||
    classComplete;

  const nextClassId = classId ? String(Number(classId) + 1) : null;
  const hasNextClass = nextClassId && questionsByClass?.[nextClassId]?.length;

  const classInfo = CLASS_INFO.find((item) => item.id === classId);
  const safeClassId = classId ?? "";
  const { confirmExit } = useExitGuard({ enabled: hasProgress });

  const handleBackToSelection = () => {
    if (!confirmExit()) return;
    router.push("/resources/physics-game");
  };

  return (
    <div
      ref={fullscreenRef}
      className="relative min-h-screen overflow-hidden text-slate-100"
    >
      <div className="absolute inset-0 -z-10" style={backgroundStyle} />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_50%)]" />

      <main className="relative min-h-screen">
        <div className="px-6 pt-8">
          <BackPrev onBack={handleBackToSelection} />
        </div>
        <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-4">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-cyan-300/70">
              Kattalik • Birlik • Formula
            </div>
            <div className="text-sm text-slate-300">
              {classInfo
                ? `${classInfo.title} • ${classInfo.subtitle}`
                : "Sinf tanlanmagan"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSoundOn((prev) => !prev)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200"
            >
              {soundOn ? "Ovoz: ON" : "Ovoz: OFF"}
            </button>
            <button
              type="button"
              onClick={handleBackToSelection}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 transition hover:border-fuchsia-300/40 hover:text-fuchsia-200"
            >
              Sinf tanlash
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
          {!questionsByClass && (
            <div className="text-slate-300">Savollar yuklanmoqda...</div>
          )}

          {questionsByClass && !currentQuestion && !classComplete && (
            <div className="text-slate-300">
              Savollar topilmadi. Boshqa sinfni tanlang.
            </div>
          )}

          {currentQuestion && (
            <div className="w-full max-w-5xl">
              <div className="text-center">
                <div className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  Savol {Math.min(currentIndex + 1, totalQuestions)} /{" "}
                  {totalQuestions}
                </div>

                <h3 className="mt-3 text-lg text-slate-300">
                  To‘g‘ri birlik va formulani tanlang.
                </h3>
              </div>

              <div className="mt-10 flex justify-center">
                <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-white/5 px-10 py-8 text-center shadow-[0_0_40px_rgba(56,189,248,0.15)]">
                  <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-cyan-500/10 via-transparent to-fuchsia-500/10 blur-xl" />
                  <div className="relative">
                    <div className=" text-4xl md:text-5xl">
                      {currentQuestion.quantity}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shuffledOptions.map((option, index) => {
                  const isCorrectUnit = option === currentQuestion.correctUnit;
                  const isCorrectFormula =
                    option === currentQuestion.correctFormula;
                  const isLocked =
                    (isCorrectUnit && locked.unit) ||
                    (isCorrectFormula && locked.formula);
                  const isWrong = wrongOptions.includes(option) && !isLocked;
                  const isFormula =
                    option.includes("=") ||
                    option.includes("/") ||
                    option.includes("·") ||
                    option.includes("^");

                  return (
                    <button
                      key={`${option}-${index}`}
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      disabled={isLocked}
                      className={`group relative rounded-2xl p-px transition-all duration-300 ${
                        isLocked
                          ? "bg-emerald-400/40 shadow-[0_0_18px_rgba(16,185,129,0.3)]"
                          : isWrong
                            ? "bg-rose-400/40 shadow-[0_0_18px_rgba(244,63,94,0.3)]"
                            : "bg-linear-to-br from-white/15 via-white/5 to-white/15 shadow-[0_12px_24px_rgba(2,6,23,0.35)] hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(8,145,178,0.25)]"
                      } ${shakeOption === option ? "shake" : ""}`}
                    >
                      <span
                        className={`absolute -inset-2 rounded-2xl blur-xl opacity-0 transition-opacity duration-300 ${
                          isLocked
                            ? "bg-emerald-400/20 opacity-100"
                            : isWrong
                              ? "bg-rose-400/20 opacity-100"
                              : "bg-cyan-300/20 group-hover:opacity-100"
                        }`}
                      />
                      <span
                        className={`relative block rounded-[15px] border px-5 py-4 text-left transition-all ${
                          isLocked
                            ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-100"
                            : isWrong
                              ? "border-rose-300/40 bg-rose-500/10 text-rose-100"
                              : "border-white/10 bg-slate-900/60 text-slate-100 group-hover:border-cyan-200/40 group-hover:bg-slate-900/40"
                        }`}
                      >
                        <div
                          className={`text-lg font-semibold ${
                            isFormula ? "font-mono" : "tracking-wide"
                          }`}
                        >
                          {option}
                        </div>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {classComplete && (
            <div className="relative mt-10 flex w-full max-w-3xl flex-col items-center justify-center rounded-3xl border border-white/15 bg-white/5 px-8 py-10 text-center shadow-[0_0_50px_rgba(59,130,246,0.25)]">
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                {confettiPieces.map((piece) => (
                  <span
                    key={piece.id}
                    className="confetti-piece"
                    style={{
                      left: `${piece.left}%`,
                      animationDelay: `${piece.delay}s`,
                      animationDuration: `${piece.duration}s`,
                      backgroundColor: piece.color,
                    }}
                  />
                ))}
              </div>
              <div className="relative z-10 text-3xl md:text-4xl">
                A’lo! {safeClassId}-sinf yakunlandi 🎉
              </div>
              <p className="relative z-10 mt-4 text-slate-300">
                Progress 100%. Keyingi bosqichga tayyormisiz?
              </p>
              <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-4">
                {hasNextClass && (
                  <button
                    type="button"
                    onClick={() =>
                      nextClassId &&
                      router.push(`/resources/physics-game/${nextClassId}`)
                    }
                    className="rounded-full bg-linear-to-r from-emerald-400 via-cyan-400 to-blue-500 px-8 py-3 font-semibold text-slate-900 shadow-[0_0_25px_rgba(34,197,94,0.4)] transition hover:-translate-y-1"
                  >
                    Keyingi sinfga o‘tish
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleBackToSelection}
                  className="rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-slate-200 transition hover:border-fuchsia-300/50 hover:text-fuchsia-100"
                >
                  Sinf tanlashga qaytish
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-500">
              <span>Progress</span>
              <span>{progressLabel}</span>
            </div>
            <div className="mt-4 rounded-full border border-white/10 bg-white/5 px-3 py-2 shadow-[0_0_20px_rgba(15,23,42,0.45)]">
              <div className="flex items-center gap-2">
                {Array.from({ length: segmentCount }).map((_, index) => {
                  const filled = index < Math.min(currentIndex, segmentCount);
                  return (
                    <span
                      key={`seg-${index}`}
                      className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                        filled
                          ? "bg-linear-to-r from-amber-300 via-orange-400 to-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.7)]"
                          : "bg-slate-700/60"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Fullscreen chiqish" : "Fullscreen yoqish"}
        title={isFullscreen ? "Fullscreen chiqish" : "Fullscreen yoqish"}
        className="fixed bottom-6 right-6 z-20 rounded-full border border-white/10 bg-slate-900/60 p-3 text-slate-200 shadow-[0_0_20px_rgba(15,23,42,0.6)] backdrop-blur transition hover:border-amber-300/40 hover:text-amber-200"
      >
        {isFullscreen ? (
          <Minimize2 className="h-5 w-5" />
        ) : (
          <Maximize2 className="h-5 w-5" />
        )}
      </button>

      <style jsx>{`
        .shake {
          animation: shake 0.35s ease-in-out;
        }

        .confetti-piece {
          position: absolute;
          top: -10%;
          width: 10px;
          height: 18px;
          opacity: 0.9;
          animation-name: confetti-fall;
          animation-iteration-count: infinite;
          border-radius: 3px;
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-6px);
          }
          50% {
            transform: translateX(6px);
          }
          75% {
            transform: translateX(-3px);
          }
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-10%) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotate(360deg);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .confetti-piece {
            width: 8px;
            height: 14px;
          }
        }
      `}</style>
    </div>
  );
}
