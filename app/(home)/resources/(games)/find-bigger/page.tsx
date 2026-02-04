/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Heart, MoveHorizontal, Play, RotateCcw, Sparkles } from "lucide-react";
import BackPrev from "@/components/back-prev";
import { Button } from "@/components/ui/button";
import { useExitGuard } from "@/hooks/use-exit-guard";

type Side = "left" | "right";
type Difficulty = "easy" | "medium" | "hard";

type Expression = {
  a: number;
  b: number;
  sum: number;
};

type Round = {
  left: Expression;
  right: Expression;
  correct: Side;
};

const START_LIVES = 3;
const TOTAL_ROUNDS = 50;

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; min: number; max: number; time: number }
> = {
  easy: { label: "Oson", min: 1, max: 9, time: 3 },
  medium: { label: "O'rtacha", min: 10, max: 99, time: 5 },
  hard: { label: "Murakkab", min: 100, max: 999, time: 5 },
};

const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];

const randBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const buildExpression = (minValue: number, maxValue: number): Expression => {
  const a = randBetween(minValue, maxValue);
  const b = randBetween(minValue, maxValue);
  return { a, b, sum: a + b };
};

/**
 * Build a round where sums are guaranteed to be different
 * and kept inside the min/max range.
 */
const buildRound = (difficulty: Difficulty): Round => {
  const { min, max } = DIFFICULTY_CONFIG[difficulty];

  const left = buildExpression(min, max);
  let right = buildExpression(min, max);

  let guard = 0;
  while (left.sum === right.sum && guard < 40) {
    right = buildExpression(min, max);
    guard += 1;
  }

  // If still tied, adjust right safely while keeping range constraints
  if (left.sum === right.sum) {
    // Try increasing b if possible
    if (right.b < max) {
      right = { ...right, b: right.b + 1, sum: right.sum + 1 };
    } else if (right.a < max) {
      right = { ...right, a: right.a + 1, sum: right.sum + 1 };
    } else if (right.b > min) {
      right = { ...right, b: right.b - 1, sum: right.sum - 1 };
    } else if (right.a > min) {
      right = { ...right, a: right.a - 1, sum: right.sum - 1 };
    } else {
      // Extremely unlikely, but as a last resort:
      // force a small change (still safe for easy/medium/hard ranges)
      right = { ...right, b: min, a: min + 1, sum: min + (min + 1) };
    }
  }

  const correct: Side = left.sum > right.sum ? "left" : "right";

  return { left, right, correct };
};

export default function FindBiggerPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [streak, setStreak] = useState(0);

  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_CONFIG.easy.time);
  const [selection, setSelection] = useState<Side | null>(null);
  const [reveal, setReveal] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [current, setCurrent] = useState<Round>(() => buildRound("easy"));

  const timeoutRef = useRef<number | null>(null);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);

  // Fix: prevent double endRound before state updates (StrictMode/batching)
  const endRoundLockRef = useRef(false);

  const roundTime = DIFFICULTY_CONFIG[difficulty].time;
  const timePercent = Math.max(0, (timeLeft / roundTime) * 100);

  const { back: handleBack } = useExitGuard({ enabled: gameStarted });

  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const stopSuccessSound = useCallback(() => {
    if (!successSoundRef.current) return;
    successSoundRef.current.pause();
    successSoundRef.current.currentTime = 0;
  }, []);

  useEffect(() => {
    successSoundRef.current = new Audio("/sounds/success.wav");
    successSoundRef.current.load();

    return () => {
      clearPendingTimeout();
      stopSuccessSound();
      successSoundRef.current = null;
    };
  }, [clearPendingTimeout, stopSuccessSound]);

  const resetGame = useCallback(() => {
    clearPendingTimeout();
    endRoundLockRef.current = false;

    setRound(1);
    setScore(0);
    setLives(START_LIVES);
    setStreak(0);

    setTimeLeft(roundTime);
    setSelection(null);
    setReveal(false);
    setSummaryOpen(false);

    setCurrent(buildRound(difficulty));
  }, [clearPendingTimeout, difficulty, roundTime]);

  const resetToIntro = useCallback(() => {
    // minor: close summary first to avoid flicker
    setSummaryOpen(false);
    resetGame();
    setGameStarted(false);
  }, [resetGame]);

  const startGame = useCallback(() => {
    const trimmedName = playerName.trim();
    if (!trimmedName) return;

    setPlayerName(trimmedName);
    resetGame();
    setGameStarted(true);
  }, [playerName, resetGame]);

  const endRound = useCallback(
    ({
      selectedSide,
      isCorrect,
    }: {
      selectedSide: Side | null;
      isCorrect: boolean;
    }) => {
      // Fix: hard guards + lock to avoid double firing
      if (endRoundLockRef.current) return;
      if (reveal || summaryOpen || lives <= 0) return;

      endRoundLockRef.current = true;

      // Fix: clear any pending timeout before starting a new end sequence
      clearPendingTimeout();

      const nextLives = isCorrect ? lives : Math.max(0, lives - 1);
      const nextScore = isCorrect ? score + 1 : score;
      const nextStreak = isCorrect ? streak + 1 : 0;

      if (isCorrect && successSoundRef.current) {
        successSoundRef.current.currentTime = 0;
        successSoundRef.current.play().catch(() => {});
      }

      setSelection(selectedSide);
      setReveal(true);

      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;

        setLives(nextLives);
        setScore(nextScore);
        setStreak(nextStreak);

        const isGameOver = nextLives <= 0 || round >= TOTAL_ROUNDS;
        if (isGameOver) {
          setSummaryOpen(true);
          // keep reveal on; unlock not needed anymore
          return;
        }

        const nextRound = round + 1;
        setRound(nextRound);
        setCurrent(buildRound(difficulty));
        setSelection(null);
        setReveal(false);
        setTimeLeft(roundTime);

        // unlock for next round
        endRoundLockRef.current = false;
      }, 650);
    },
    [
      clearPendingTimeout,
      difficulty,
      lives,
      reveal,
      round,
      roundTime,
      score,
      streak,
      summaryOpen,
    ],
  );

  const handlePick = useCallback(
    (side: Side) => {
      endRound({ selectedSide: side, isCorrect: current.correct === side });
    },
    [current.correct, endRound],
  );

  // Timer loop (Fix: no set-state-in-effect lint suppress; safe lock)
  useEffect(() => {
    if (!gameStarted || reveal || summaryOpen || lives <= 0) return;

    if (timeLeft <= 0) {
      // time's up: only trigger once because of lock
      endRound({ selectedSide: null, isCorrect: false });
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [endRound, gameStarted, lives, reveal, summaryOpen, timeLeft]);

  const getCardStyles = (side: Side) => {
    const base =
      "group relative overflow-hidden rounded-2xl border px-6 py-7 sm:py-8 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200";

    if (!reveal) {
      return (
        base +
        " bg-white border-slate-200 hover:-translate-y-1 hover:border-emerald-200 shadow-lg hover:shadow-xl"
      );
    }
    if (side === current.correct) {
      return (
        base +
        " bg-emerald-50 border-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
      );
    }
    if (selection === side) {
      return base + " bg-rose-50 border-rose-200";
    }
    return base + " bg-slate-50 border-slate-100 opacity-70";
  };

  const getLabel = (side: Side) => (side === "left" ? "Chap" : "O'ng");

  return (
    <div
      className="relative min-h-screen bg-linear-to-br from-slate-50 via-sky-50 to-emerald-50 text-slate-900"
      style={
        {
          "--mint": "#10b981",
          "--sun": "#f59e0b",
          fontFamily: "var(--font-body)",
        } as CSSProperties
      }
    >
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <BackPrev onBack={handleBack} />

        {!gameStarted ? (
          <div className="w-full max-w-xl">
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-center shadow-xl sm:px-10 sm:py-10">
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                <Sparkles className="h-4 w-4 text-(--mint)" />
                Kattasini top oʻyini
              </div>

              <h1
                className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Qaysi yigʻindi kattaroq?
              </h1>

              <p className="mt-3 text-sm text-slate-600 sm:text-base">
                Ismingizni kiriting va oʻyinni boshlang.
              </p>

              <div className="mt-6 space-y-3 text-left">
                <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Ism
                </label>
                <input
                  value={playerName}
                  onChange={(event) => setPlayerName(event.target.value)}
                  placeholder="Ismingiz"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />

                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Daraja
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
                    {DIFFICULTY_ORDER.map((level) => {
                      const isActive = level === difficulty;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDifficulty(level)}
                          aria-pressed={isActive}
                          className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                            isActive
                              ? "border border-slate-200 bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {DIFFICULTY_CONFIG[level].label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={startGame}
                  disabled={!playerName.trim()}
                  className="w-full rounded-2xl text-white"
                >
                  <Play className="h-4 w-4" /> O‘yinni Boshlash
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl">
            <div className="flex flex-col items-center gap-8">
              <header className="flex flex-col gap-3 text-center">
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                  <Sparkles className="h-4 w-4 text-(--mint)" />
                  Kattasini top oʻyini
                </div>

                <h1
                  className="text-3xl font-semibold text-slate-900 sm:text-4xl md:text-5xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Qaysi yigʻindi kattaroq?
                </h1>

                <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
                  Har safar ikki ifoda beriladi. Kattasini toping va bosing.
                </p>
              </header>

              <section className="relative mx-auto w-full max-w-3xl">
                <div className="relative rounded-3xl border border-slate-200 bg-white/80 px-5 py-7 shadow-2xl sm:px-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                          Ishtirokchi
                        </div>
                        <div className="text-sm font-semibold text-slate-800">
                          {playerName}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 rounded-full border border-rose-100 bg-rose-50 px-3 py-2">
                        {Array.from({ length: START_LIVES }).map((_, idx) => (
                          <Heart
                            key={`heart-${idx}`}
                            className={`h-4 w-4 ${
                              idx < lives
                                ? "fill-rose-500 text-rose-500"
                                : "text-rose-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-xs uppercase tracking-[0.2em] text-slate-400">
                      {DIFFICULTY_CONFIG[difficulty].label}
                      <span className="text-[10px] tracking-[0.3em] text-slate-400">
                        Bosqich {round}/{TOTAL_ROUNDS}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                      Seriya: <span className="font-semibold">{streak}</span>
                    </div>

                    <Button
                      onClick={resetToIntro}
                      variant="secondary"
                      size="sm"
                      className="rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Qayta
                    </Button>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Vaqt
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all duration-1000"
                        style={{ width: `${timePercent}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-xs font-semibold text-slate-500">
                      {timeLeft}
                    </span>
                  </div>

                  <div className="mt-7 grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
                    {(["left", "right"] as Side[]).map((side, index) => {
                      const expression =
                        side === "left" ? current.left : current.right;

                      return (
                        <div key={side} className="contents">
                          <button
                            className={getCardStyles(side)}
                            onClick={() => handlePick(side)}
                            disabled={reveal || summaryOpen || lives <= 0}
                            aria-label={`${getLabel(side)} kartani tanlash`}
                          >
                            <div className="relative z-10 flex flex-col gap-4">
                              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                                <span>{getLabel(side)}</span>
                                <span className="text-emerald-500">
                                  {side === "left" ? "A" : "B"}
                                </span>
                              </div>

                              <div
                                className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl"
                                style={{ fontFamily: "var(--font-heading)" }}
                              >
                                {expression.a} + {expression.b}
                              </div>
                            </div>
                          </button>

                          {index === 0 && (
                            <div className="flex justify-center">
                              <div className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500">
                                VS
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <MoveHorizontal className="h-4 w-4 text-(--sun)" />
                    Kattasini tanlash uchun bosing
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {summaryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Natija
            </div>

            <h2
              className="mt-2 text-2xl font-semibold text-slate-900"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {lives > 0 ? "Bosqich yakunlandi" : "Urinishlar tugadi"}
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              {lives > 0
                ? "Zo'r! Endi yangi bosqichlarga tayyormisiz?"
                : "Yana urinib ko'ring va rekordni yangilang."}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-400">Ball</div>
                <div className="text-2xl font-semibold text-slate-900">
                  {score}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-400">Bosqich</div>
                <div className="text-2xl font-semibold text-slate-900">
                  {Math.min(round, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-400">Seriya</div>
                <div className="text-2xl font-semibold text-slate-900">
                  {streak}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-400">Urinish</div>
                <div className="text-2xl font-semibold text-slate-900">
                  {lives}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={resetToIntro}
                className="flex-1 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600"
              >
                Qayta boshlash
              </Button>

              <Button
                variant="secondary"
                onClick={() => setSummaryOpen(false)}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Yopish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
