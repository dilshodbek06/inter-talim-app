/* eslint-disable react/no-unescaped-entities */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Options as ConfettiOptions } from "canvas-confetti";
import Image from "next/image";
import {
  Atom,
  BookOpen,
  BookText,
  Cpu,
  Feather,
  FlaskConical,
  Globe2,
  Home,
  Landmark,
  Languages,
  Leaf,
  Maximize2,
  Play,
} from "lucide-react";

import { WinModal } from "@/components/win-modal";
import { Button } from "@/components/ui/button";
import { useExitGuard } from "@/hooks/use-exit-guard";
import {
  SUBJECTS,
  loadSubjectQuestions,
  type SubjectKey,
  type SubjectQuestion,
} from "@/mock/subject-rope";

type TeamKey = "left" | "right";

type FeedbackState = "correct" | "wrong" | null;

type TeamState<T> = { left: T; right: T };

const PANEL_THEME = {
  left: {
    header: "from-[#1a2f8f] via-[#142262] to-[#0d1343]",
    score: "bg-[#1a2f8f] text-white",
  },
  right: {
    header: "from-[#c11d1d] via-[#a01414] to-[#7b0c0c]",
    score: "bg-[#c11d1d] text-white",
  },
};

const SUBJECT_ICONS: Record<SubjectKey, typeof Cpu> = {
  informatika: Cpu,
  "rus-tili": BookOpen,
  "ona-tili": BookText,
  adabiyot: Feather,
  "ingliz-tili": Languages,
  fizika: Atom,
  kimyo: FlaskConical,
  biologiya: Leaf,
  tarix: Landmark,
  geografiya: Globe2,
};

const SHIFT_STEP = 14;
const MIN_SHIFT_STEPS = 8;
const GAME_DURATION_SECONDS = 5 * 60;

export default function SubjectRopePage() {
  const [setupMode, setSetupMode] = useState(true);
  const [teamNames, setTeamNames] = useState({
    left: "1-Jamoa",
    right: "2-Jamoa",
  });
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey | null>(
    null,
  );
  const [questions, setQuestions] = useState<SubjectQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [currentQuestionIds, setCurrentQuestionIds] = useState<
    TeamState<number | null>
  >({ left: null, right: null });
  const [scores, setScores] = useState<TeamState<number>>({
    left: 0,
    right: 0,
  });
  const [ropeShift, setRopeShift] = useState(0);
  const [winner, setWinner] = useState<TeamKey | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<
    TeamState<FeedbackState>
  >({ left: null, right: null });
  const [selectedOptions, setSelectedOptions] = useState<
    TeamState<number | null>
  >({ left: null, right: null });
  const [arenaSize, setArenaSize] = useState({ width: 0, height: 0 });
  const [imageAspect, setImageAspect] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
  const [gameOver, setGameOver] = useState(false);

  useExitGuard({ enabled: !setupMode });

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const confettiRef = useRef<typeof import("canvas-confetti").default | null>(
    null,
  );

  const submitLockRef = useRef<TeamState<boolean>>({
    left: false,
    right: false,
  });
  const advanceLockRef = useRef<TeamState<boolean>>({
    left: false,
    right: false,
  });
  const feedbackTimersRef = useRef<{ left?: number; right?: number }>({});
  const advanceTimersRef = useRef<{ left?: number; right?: number }>({});
  const lockReleaseTimersRef = useRef<{ left?: number; right?: number }>({});
  const imageAspectSetRef = useRef(false);

  const isInteractionBlocked = !!winner || countdown !== null || gameOver;

  const subjectLabel =
    SUBJECTS.find((item) => item.key === selectedSubject)?.label ??
    "Fan tanlanmagan";

  useEffect(() => {
    let active = true;

    if (!selectedSubject) {
      setQuestions([]);
      setIsLoadingQuestions(false);
      return () => {};
    }

    setIsLoadingQuestions(true);
    loadSubjectQuestions(selectedSubject)
      .then((data) => {
        if (!active) return;
        setQuestions(data);
      })
      .finally(() => {
        if (!active) return;
        setIsLoadingQuestions(false);
      });

    return () => {
      active = false;
    };
  }, [selectedSubject]);

  const loadConfetti = useCallback(async () => {
    if (confettiRef.current) return confettiRef.current;
    const mod = await import("canvas-confetti");
    confettiRef.current = mod.default;
    return mod.default;
  }, []);

  const fireWinConfetti = useCallback(
    (options: ConfettiOptions) => {
      void loadConfetti().then((confetti) => {
        confetti({
          particleCount: 160,
          spread: 75,
          startVelocity: 45,
          ticks: 220,
          gravity: 1,
          scalar: 1,
          disableForReducedMotion: true,
          ...options,
        });
        confetti({
          particleCount: 90,
          spread: 120,
          startVelocity: 35,
          ticks: 250,
          gravity: 1.1,
          scalar: 0.9,
          disableForReducedMotion: true,
          ...options,
        });
      });
    },
    [loadConfetti],
  );

  const formatTime = useCallback((value: number) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const stopAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  const clearTeamTimeout = useCallback((team: TeamKey) => {
    if (feedbackTimersRef.current[team]) {
      window.clearTimeout(feedbackTimersRef.current[team]);
      feedbackTimersRef.current[team] = undefined;
    }
    if (advanceTimersRef.current[team]) {
      window.clearTimeout(advanceTimersRef.current[team]);
      advanceTimersRef.current[team] = undefined;
    }
    if (lockReleaseTimersRef.current[team]) {
      window.clearTimeout(lockReleaseTimersRef.current[team]);
      lockReleaseTimersRef.current[team] = undefined;
    }
  }, []);

  const clearAllTimeouts = useCallback(() => {
    clearTeamTimeout("left");
    clearTeamTimeout("right");
  }, [clearTeamTimeout]);

  const resetLocks = useCallback(() => {
    submitLockRef.current = { left: false, right: false };
    advanceLockRef.current = { left: false, right: false };
  }, []);

  const getRandomQuestionId = useCallback(
    (excludeId?: number | null) => {
      if (questions.length === 0) return null;
      if (questions.length === 1) return questions[0].id;

      let nextId = questions[Math.floor(Math.random() * questions.length)].id;

      if (excludeId !== undefined && excludeId !== null) {
        let guard = 0;
        while (nextId === excludeId && guard < 25) {
          nextId = questions[Math.floor(Math.random() * questions.length)].id;
          guard += 1;
        }
      }
      return nextId;
    },
    [questions],
  );

  const currentLeftQuestion = useMemo(
    () => questions.find((item) => item.id === currentQuestionIds.left),
    [questions, currentQuestionIds.left],
  );
  const currentRightQuestion = useMemo(
    () => questions.find((item) => item.id === currentQuestionIds.right),
    [questions, currentQuestionIds.right],
  );

  const ropeOffset = useMemo(() => ropeShift * SHIFT_STEP, [ropeShift]);

  const displayedWidth = useMemo(() => {
    if (!imageAspect || !arenaSize.width || !arenaSize.height) return 0;
    return arenaSize.width / arenaSize.height > imageAspect
      ? arenaSize.height * imageAspect
      : arenaSize.width;
  }, [imageAspect, arenaSize.height, arenaSize.width]);

  const effectiveWidth = displayedWidth || arenaSize.width;
  const winThreshold = effectiveWidth ? effectiveWidth / 2 : 0;

  const maxShiftSteps = useMemo(() => {
    if (!winThreshold) return MIN_SHIFT_STEPS;
    return Math.max(MIN_SHIFT_STEPS, Math.ceil(winThreshold / SHIFT_STEP));
  }, [winThreshold]);

  useEffect(() => {
    if (setupMode) return;
    setRopeShift((prev) =>
      Math.max(-maxShiftSteps, Math.min(maxShiftSteps, prev)),
    );
  }, [maxShiftSteps, setupMode]);

  useEffect(() => {
    if (questions.length === 0) {
      setCurrentQuestionIds({ left: null, right: null });
      return;
    }

    setCurrentQuestionIds((prev) => {
      const leftExists =
        prev.left !== null && questions.some((q) => q.id === prev.left);
      const rightExists =
        prev.right !== null && questions.some((q) => q.id === prev.right);

      const nextLeft = leftExists ? prev.left : getRandomQuestionId();
      const nextRight = rightExists
        ? prev.right
        : getRandomQuestionId(nextLeft);

      if (
        nextLeft !== null &&
        nextRight !== null &&
        nextLeft === nextRight &&
        questions.length > 1
      ) {
        return { left: nextLeft, right: getRandomQuestionId(nextLeft) };
      }

      return { left: nextLeft, right: nextRight };
    });
  }, [questions, getRandomQuestionId]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 1 && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    if (countdown <= 1) {
      const doneTimer = window.setTimeout(() => setCountdown(null), 800);
      return () => window.clearTimeout(doneTimer);
    }

    const timer = window.setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : prev));
    }, 900);

    return () => window.clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    audioRef.current = new Audio("/sounds/rope-sound.m4a");
    audioRef.current.load();
    return () => {
      stopAudio();
      audioRef.current = null;
    };
  }, [stopAudio]);

  useEffect(() => {
    if (setupMode) return;
    const node = arenaRef.current;
    if (!node) return;

    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      setArenaSize({ width: rect.width, height: rect.height });
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updateSize);
    observer.observe(node);

    return () => observer.disconnect();
  }, [setupMode]);

  useEffect(() => {
    if (setupMode || winner || winThreshold === 0) return;

    if (ropeOffset <= -winThreshold) {
      setWinner("left");
      setGameOver(true);
      setShowWinModal(true);
      stopAudio();
      clearAllTimeouts();
      resetLocks();
      fireWinConfetti({
        colors: ["#1a2f8f", "#3b8cff", "#facc15", "#22c55e", "#0f172a"],
        origin: { x: 0.2, y: 0.35 },
        angle: 60,
      });
      return;
    }

    if (ropeOffset >= winThreshold) {
      setWinner("right");
      setGameOver(true);
      setShowWinModal(true);
      stopAudio();
      clearAllTimeouts();
      resetLocks();
      fireWinConfetti({
        colors: ["#c11d1d", "#ef4444", "#f97316", "#facc15", "#7c2d12"],
        origin: { x: 0.8, y: 0.35 },
        angle: 120,
      });
    }
  }, [
    ropeOffset,
    setupMode,
    winThreshold,
    winner,
    fireWinConfetti,
    stopAudio,
    clearAllTimeouts,
    resetLocks,
  ]);

  useEffect(() => {
    if (setupMode || winner || gameOver || countdown !== null) return;
    if (timeLeft <= 0) return;

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [setupMode, winner, gameOver, countdown, timeLeft]);

  useEffect(() => {
    if (setupMode || winner || gameOver) return;
    if (timeLeft !== 0) return;

    let timeWinner: TeamKey | null = null;
    if (scores.left > scores.right) timeWinner = "left";
    if (scores.right > scores.left) timeWinner = "right";

    setWinner(timeWinner);
    setGameOver(true);
    setShowWinModal(true);
    stopAudio();
    clearAllTimeouts();
    resetLocks();

    if (timeWinner) {
      fireWinConfetti({
        colors:
          timeWinner === "left"
            ? ["#1a2f8f", "#3b8cff", "#facc15", "#22c55e", "#0f172a"]
            : ["#c11d1d", "#ef4444", "#f97316", "#facc15", "#7c2d12"],
        origin: { x: timeWinner === "left" ? 0.2 : 0.8, y: 0.35 },
        angle: timeWinner === "left" ? 60 : 120,
      });
    }
  }, [
    setupMode,
    winner,
    gameOver,
    timeLeft,
    scores.left,
    scores.right,
    fireWinConfetti,
    stopAudio,
    clearAllTimeouts,
    resetLocks,
  ]);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      stopAudio();
    };
  }, [clearAllTimeouts, stopAudio]);

  const resetRoundState = useCallback(() => {
    setSelectedOptions({ left: null, right: null });
    setAnswerFeedback({ left: null, right: null });
  }, []);

  const startGame = useCallback(() => {
    if (!selectedSubject) return;

    clearAllTimeouts();
    resetLocks();

    const leftId = getRandomQuestionId();
    const rightId = getRandomQuestionId(leftId);

    setSetupMode(false);
    setCurrentQuestionIds({ left: leftId, right: rightId });
    setScores({ left: 0, right: 0 });
    setRopeShift(0);
    setWinner(null);
    setGameOver(false);
    setShowWinModal(false);
    setCountdown(3);
    setTimeLeft(GAME_DURATION_SECONDS);
    resetRoundState();
  }, [
    selectedSubject,
    clearAllTimeouts,
    resetLocks,
    getRandomQuestionId,
    resetRoundState,
  ]);

  const resetToSetup = useCallback(() => {
    clearAllTimeouts();
    resetLocks();
    stopAudio();

    setSetupMode(true);
    setCurrentQuestionIds({ left: null, right: null });
    setScores({ left: 0, right: 0 });
    setRopeShift(0);
    setWinner(null);
    setGameOver(false);
    setShowWinModal(false);
    setCountdown(null);
    setTimeLeft(GAME_DURATION_SECONDS);
    resetRoundState();
  }, [clearAllTimeouts, resetLocks, stopAudio, resetRoundState]);

  const updateScore = useCallback(
    (team: TeamKey) => {
      setScores((prev) => ({ ...prev, [team]: prev[team] + 1 }));
      setRopeShift((prev) => {
        const delta = team === "left" ? -1 : 1;
        const next = prev + delta;
        return Math.max(-maxShiftSteps, Math.min(maxShiftSteps, next));
      });
    },
    [maxShiftSteps],
  );

  const advanceTeamRound = useCallback(
    (team: TeamKey) => {
      if (advanceLockRef.current[team] || questions.length === 0) return;
      advanceLockRef.current[team] = true;

      setSelectedOptions((prev) => ({ ...prev, [team]: null }));
      setAnswerFeedback((prev) => ({ ...prev, [team]: null }));
      setCurrentQuestionIds((prev) => ({
        ...prev,
        [team]: getRandomQuestionId(prev[team]),
      }));

      if (lockReleaseTimersRef.current[team]) {
        window.clearTimeout(lockReleaseTimersRef.current[team]);
      }

      lockReleaseTimersRef.current[team] = window.setTimeout(() => {
        advanceLockRef.current[team] = false;
      }, 250);
    },
    [questions.length, getRandomQuestionId],
  );

  const handleOptionSelect = useCallback(
    (team: TeamKey, optionIndex: number) => {
      if (isInteractionBlocked) return;
      if (submitLockRef.current[team]) return;

      const currentQuestion =
        team === "left" ? currentLeftQuestion : currentRightQuestion;
      if (!currentQuestion) return;

      submitLockRef.current[team] = true;
      setSelectedOptions((prev) => ({ ...prev, [team]: optionIndex }));

      const isCorrect = optionIndex === currentQuestion.answerIndex;
      setAnswerFeedback((prev) => ({
        ...prev,
        [team]: isCorrect ? "correct" : "wrong",
      }));

      if (isCorrect) updateScore(team);

      if (feedbackTimersRef.current[team]) {
        window.clearTimeout(feedbackTimersRef.current[team]);
      }

      feedbackTimersRef.current[team] = window.setTimeout(() => {
        setAnswerFeedback((prev) => ({ ...prev, [team]: null }));
      }, 650);

      if (advanceTimersRef.current[team]) {
        window.clearTimeout(advanceTimersRef.current[team]);
      }

      advanceTimersRef.current[team] = window.setTimeout(() => {
        if (!winner) advanceTeamRound(team);
        submitLockRef.current[team] = false;
      }, 700);
    },
    [
      isInteractionBlocked,
      currentLeftQuestion,
      currentRightQuestion,
      updateScore,
      winner,
      advanceTeamRound,
    ],
  );

  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      return;
    }
    document.exitFullscreen?.().catch(() => {});
  }, []);

  const handleExitGame = useCallback(() => {
    if (setupMode) {
      resetToSetup();
      return;
    }
    const ok = window.confirm("Haqiqatdan ham o'yindan chiqmoqchimisiz?");
    if (!ok) return;
    resetToSetup();
  }, [setupMode, resetToSetup]);

  const getOptionClass = useCallback(
    (team: TeamKey, optionIndex: number) => {
      const selected = selectedOptions[team] === optionIndex;
      const feedback = answerFeedback[team];

      if (selected && feedback === "correct") {
        return "bg-emerald-500 text-white option-flash-good";
      }
      if (selected && feedback === "wrong") {
        return "bg-rose-500 text-white option-flash-bad";
      }
      if (selected) {
        return "bg-slate-100 text-slate-700";
      }
      return "bg-white/95 text-slate-700 hover:-translate-y-0.5 hover:shadow-[0_10px_16px_rgba(15,23,42,0.16)]";
    },
    [answerFeedback, selectedOptions],
  );

  const winnerName = winner ? teamNames[winner] : "";
  const timeEnded = timeLeft === 0 && showWinModal;
  const winMessage = timeEnded
    ? winnerName
      ? `Vaqt tugadi! \n${winnerName} g'olib!`
      : "Vaqt tugadi! Durang!"
    : winnerName
      ? `${winnerName} g'olib!`
      : "G'olib aniqlandi!";

  useEffect(() => {
    const handler = () => stopAudio();
    window.addEventListener("pagehide", handler);
    return () => window.removeEventListener("pagehide", handler);
  }, [stopAudio]);

  return (
    <div className="subject-rope-shell relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-[#f8fafc] via-[#eef2ff] to-[#e0f2fe] text-slate-900">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-linear-to-br from-sky-300/40 to-blue-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-linear-to-br from-rose-300/30 to-amber-200/10 blur-3xl" />

      <WinModal
        isOpen={showWinModal}
        onClose={resetToSetup}
        score={winner ? scores[winner] : undefined}
        message={winMessage}
        results={[
          {
            label: teamNames.left,
            score: scores.left,
            className: "bg-linear-to-br from-[#1a2f8f] to-[#3b8cff]",
          },
          {
            label: teamNames.right,
            score: scores.right,
            className: "bg-linear-to-br from-[#c11d1d] to-[#ef4444]",
          },
        ]}
      />

      {countdown !== null && countdown > 0 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="subject-rope-countdown countdown-pop text-9xl font-black text-slate-700 sm:text-8xl">
            {countdown}
          </div>
        </div>
      )}

      <div className="subject-rope-inner relative z-10 w-full max-w-[1440px] px-4 py-2">
        {setupMode ? (
          <div className="subject-rope-setup-grid grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr]">
            <section className="subject-rope-panel rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm">
              <div
                className="animate-fade-up"
                style={{ animationDelay: "0.05s" }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-800">
                    O'yin haqida
                  </h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    Fanlar viktorinasi
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-600">
                  O'qituvchi fan tanlaydi. Har bir savolda 4 ta javob beriladi.
                  To'g'ri javoblar arqonni siz tomonga tortadi.
                </p>
                <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                  Telefoningizda qulay o'ynash uchun ekraningizni gorizontal
                  holatga o'tkazing.
                </p>

                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>1. Jamoa nomlarini kiriting.</li>
                  <li>2. Fanlardan birini tanlang.</li>
                  <li>3. "Boshlash" tugmasini bosing.</li>
                </ul>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-100 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Tanlangan fan
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-800">
                    {subjectLabel}
                  </p>
                  <p className="text-xs text-slate-500">
                    Savollar soni: {questions.length}
                  </p>
                </div>
              </div>

              <div
                className="mt-6 animate-fade-up rounded-2xl border border-slate-200 bg-slate-50 p-4"
                style={{ animationDelay: "0.1s" }}
              >
                <h3 className="text-sm font-semibold text-slate-700">
                  Jamoa nomlari
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={teamNames.left}
                    onChange={(event) =>
                      setTeamNames((prev) => ({
                        ...prev,
                        left: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="1-Jamoa"
                  />
                  <input
                    value={teamNames.right}
                    onChange={(event) =>
                      setTeamNames((prev) => ({
                        ...prev,
                        right: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="2-Jamoa"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={startGame}
                disabled={
                  !selectedSubject ||
                  questions.length === 0 ||
                  isLoadingQuestions
                }
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Play className="h-4 w-4" />
                O'yinni Boshlash
              </Button>
            </section>

            <section className="subject-rope-panel rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                  Fan tanlash
                </h2>
                <span className="text-xs font-semibold text-slate-400">
                  {SUBJECTS.length} ta fan
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SUBJECTS.map((subject) => {
                  const active = selectedSubject === subject.key;
                  const Icon = SUBJECT_ICONS[subject.key];
                  return (
                    <button
                      key={subject.key}
                      type="button"
                      onClick={() => setSelectedSubject(subject.key)}
                      className={`group relative overflow-hidden rounded-2xl border px-4 py-4 text-left transition ${
                        active
                          ? "border-sky-400 bg-sky-50 shadow-[0_12px_24px_rgba(14,165,233,0.15)]"
                          : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/60"
                      }`}
                    >
                      <div
                        className={`absolute -right-6 -top-6 h-16 w-16 rounded-full bg-linear-to-br ${subject.accent} opacity-15`}
                      />
                      <div className="relative z-10 flex items-start gap-4">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${
                            subject.accent
                          } text-white shadow-[0_8px_20px_rgba(15,23,42,0.2)]`}
                        >
                          <Icon className="h-6 w-6" />
                        </span>
                        <div>
                          <h3 className="text-base font-semibold text-slate-700">
                            {subject.label}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {subject.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Tanlov
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {selectedSubject ? subjectLabel : "Fan tanlanmagan"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Jamoalar: {teamNames.left} vs {teamNames.right}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Savollar
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-800">
                      {questions.length}
                    </p>
                  </div>
                </div>
                {!selectedSubject && (
                  <p className="mt-3 text-xs font-semibold text-rose-500">
                    Fanlardan birini tanlang.
                  </p>
                )}
                {selectedSubject && isLoadingQuestions && (
                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    Savollar yuklanmoqda...
                  </p>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="subject-rope-match-grid grid grid-cols-1 items-center gap-8 lg:grid-cols-[360px_1fr_360px]">
            <section className="subject-rope-panel subject-rope-side-panel relative z-10 rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.15)]">
              <div
                className={`subject-rope-question rounded-3xl bg-linear-to-b px-4 py-4 text-center text-2xl font-bold text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)] ${PANEL_THEME.left.header}`}
              >
                <span className="subject-rope-question-text">
                  {currentLeftQuestion?.question ?? "Savol"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                {(currentLeftQuestion?.options ?? []).map((option, index) => (
                  <button
                    key={`left-${index}`}
                    type="button"
                    onClick={() => handleOptionSelect("left", index)}
                    disabled={
                      !currentLeftQuestion ||
                      isInteractionBlocked ||
                      submitLockRef.current.left
                    }
                    className={`subject-rope-option rounded-2xl px-4 py-4 text-base font-semibold shadow-[0_6px_12px_rgba(15,23,42,0.12)] transition disabled:cursor-not-allowed disabled:opacity-60 ${getOptionClass(
                      "left",
                      index,
                    )}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>

            <section className="subject-rope-center flex flex-col items-center gap-4 text-center">
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                  ⏱ {formatTime(timeLeft)}
                </div>

                <div className="rounded-full bg-white/90 px-4 py-2 font-semibold text-slate-500 shadow-sm">
                  {subjectLabel}
                </div>
              </div>

              <div className="subject-rope-score flex items-center gap-3 text-sm font-semibold">
                <span
                  className={`rounded-full px-3 py-1 shadow-sm ${PANEL_THEME.left.score}`}
                >
                  {teamNames.left}: {scores.left} ball
                </span>
                <span className="text-slate-400">|</span>
                <span
                  className={`rounded-full px-3 py-1 shadow-sm ${PANEL_THEME.right.score}`}
                >
                  {teamNames.right}: {scores.right} ball
                </span>
              </div>

              <div className="subject-rope-arena relative w-full max-w-[520px] overflow-hidden rounded-3xl bg-linear-to-br from-slate-50 via-white to-slate-100 p-4 shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
                <div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] w-px -translate-x-1/2 border-l-2 border-dashed border-slate-400/70" />

                <div
                  ref={arenaRef}
                  className="subject-rope-arena-canvas relative h-[190px] sm:h-[230px]"
                >
                  <div
                    className="pointer-events-none absolute inset-0 z-20 transition-transform duration-300"
                    style={{ transform: `translateX(${ropeOffset}px)` }}
                  >
                    <Image
                      src="/images/characters.png"
                      alt="Arqon tortish jamoalari"
                      fill
                      onLoadingComplete={(img) => {
                        if (!imageAspectSetRef.current && img.naturalHeight) {
                          imageAspectSetRef.current = true;
                          setImageAspect(img.naturalWidth / img.naturalHeight);
                        }
                      }}
                      className="object-contain"
                      sizes="(min-width: 1024px) 520px, 90vw"
                      priority
                    />
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500">
                To'g'ri javob bilan arqonni torting va g'olib bo'ling!
              </p>
            </section>

            <section className="subject-rope-panel subject-rope-side-panel relative z-10 rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.15)]">
              <div
                className={`subject-rope-question rounded-3xl bg-linear-to-b px-4 py-4 text-center text-2xl font-bold text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)] ${PANEL_THEME.right.header}`}
              >
                <span className="subject-rope-question-text">
                  {currentRightQuestion?.question ?? "Savol"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                {(currentRightQuestion?.options ?? []).map((option, index) => (
                  <button
                    key={`right-${index}`}
                    type="button"
                    onClick={() => handleOptionSelect("right", index)}
                    disabled={
                      !currentRightQuestion ||
                      isInteractionBlocked ||
                      submitLockRef.current.right
                    }
                    className={`subject-rope-option rounded-2xl px-4 py-4 text-base font-semibold shadow-[0_6px_12px_rgba(15,23,42,0.12)] transition disabled:cursor-not-allowed disabled:opacity-60 ${getOptionClass(
                      "right",
                      index,
                    )}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {!setupMode && (
          <>
            <button
              type="button"
              onClick={handleExitGame}
              className="subject-rope-fab subject-rope-fab-left fixed bottom-6 left-6 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition hover:text-slate-700"
              aria-label="Chiqish"
            >
              <Home className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="subject-rope-fab subject-rope-fab-right fixed bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition hover:text-slate-700"
              aria-label="Fullscreen"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes countdown-pop {
          0% { transform: scale(0.5); opacity: 0; }
          30% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.75; }
        }
        .countdown-pop { animation: countdown-pop 0.9s ease-out; }

        @keyframes option-flash-good {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
          40% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0.3); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        @keyframes option-flash-bad {
          0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.45); }
          40% { box-shadow: 0 0 0 10px rgba(244, 63, 94, 0.3); }
          100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
        }
        .option-flash-good { animation: option-flash-good 0.6s ease-out; }
        .option-flash-bad { animation: option-flash-bad 0.6s ease-out; }

        .subject-rope-question {
          min-height: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .subject-rope-question-text {
          line-height: 1.3;
          text-wrap: balance;
          word-break: break-word;
        }

        @media (max-width: 640px) {
          .subject-rope-question {
            padding: 0.75rem 0.9rem;
            font-size: 1.1rem;
            min-height: 110px;
          }

          .subject-rope-option {
            padding: 0.7rem 0.85rem;
            font-size: 0.9rem;
          }
        }

        @media (orientation: landscape) and (max-height: 560px) {
          .subject-rope-shell {
            align-items: flex-start;
          }

          .subject-rope-inner {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }

          .subject-rope-setup-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: 1rem;
          }

          .subject-rope-panel {
            padding: 1rem;
          }

          .subject-rope-match-grid {
            grid-template-columns: minmax(220px, 32vw) minmax(0, 1fr) minmax(220px, 32vw);
            gap: 1rem;
            align-items: stretch;
          }

          .subject-rope-side-panel {
            padding: 0.75rem;
            border-radius: 1.2rem;
          }

          .subject-rope-question {
            padding: 0.6rem 0.8rem;
            font-size: 1.05rem;
            border-radius: 1.1rem;
            min-height: 96px;
          }

          .subject-rope-option {
            padding: 0.6rem 0.75rem;
            font-size: 0.9rem;
            border-radius: 0.95rem;
          }

          .subject-rope-center {
            gap: 0.75rem;
          }

          .subject-rope-title {
            font-size: 1.35rem;
          }

          .subject-rope-score {
            font-size: 0.75rem;
            gap: 0.5rem;
          }

          .subject-rope-arena {
            padding: 0.75rem;
            max-width: 420px;
          }

          .subject-rope-arena-canvas {
            height: 150px;
          }

          .subject-rope-countdown {
            font-size: 3.5rem;
          }

          .subject-rope-fab {
            bottom: 0.75rem;
            height: 2.5rem;
            width: 2.5rem;
            border-radius: 0.9rem;
          }

          .subject-rope-fab-left {
            left: 0.75rem;
          }

          .subject-rope-fab-right {
            right: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
