/* eslint-disable react-hooks/refs */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import confetti, { type Options as ConfettiOptions } from "canvas-confetti";
import Image from "next/image";
import { Home, Maximize2, Play, Plus, Trash2 } from "lucide-react";
import { WinModal } from "@/components/win-modal";
import { Button } from "@/components/ui/button";

type TeamKey = "left" | "right";

type Question = {
  id: number;
  question: string;
  answer: string;
};

const DEFAULT_QUESTIONS: Question[] = [
  { id: 1, question: "1 + 1 = ?", answer: "2" },
  { id: 2, question: "6 - 2 = ?", answer: "4" },
  { id: 3, question: "3 + 5 = ?", answer: "8" },
  { id: 4, question: "8 + 4 = ?", answer: "12" },
  { id: 5, question: "10 - 3 = ?", answer: "7" },
  { id: 6, question: "7 + 6 = ?", answer: "13" },
  { id: 7, question: "14 - 5 = ?", answer: "9" },
  { id: 8, question: "9 + 8 = ?", answer: "17" },
  { id: 9, question: "12 - 4 = ?", answer: "8" },
  { id: 10, question: "5 + 9 = ?", answer: "14" },
  { id: 11, question: "16 - 7 = ?", answer: "9" },
  { id: 12, question: "11 + 3 = ?", answer: "14" },
  { id: 13, question: "18 - 9 = ?", answer: "9" },
  { id: 14, question: "4 + 7 = ?", answer: "11" },
  { id: 15, question: "20 - 8 = ?", answer: "12" },
  { id: 16, question: "13 + 6 = ?", answer: "19" },
  { id: 17, question: "15 - 6 = ?", answer: "9" },
  { id: 18, question: "2 + 9 = ?", answer: "11" },
  { id: 19, question: "17 - 5 = ?", answer: "12" },
  { id: 20, question: "6 + 8 = ?", answer: "14" },
  { id: 21, question: "22 - 10 = ?", answer: "12" },
  { id: 22, question: "9 + 4 = ?", answer: "13" },
  { id: 23, question: "24 - 6 = ?", answer: "18" },
  { id: 24, question: "7 + 5 = ?", answer: "12" },
  { id: 25, question: "19 - 11 = ?", answer: "8" },
  { id: 26, question: "8 + 7 = ?", answer: "15" },
  { id: 27, question: "30 - 12 = ?", answer: "18" },
  { id: 28, question: "21 + 3 = ?", answer: "24" },
  { id: 29, question: "25 - 7 = ?", answer: "18" },
  { id: 30, question: "14 + 5 = ?", answer: "19" },
  { id: 31, question: "27 - 9 = ?", answer: "18" },
  { id: 32, question: "16 + 4 = ?", answer: "20" },
  { id: 33, question: "28 - 13 = ?", answer: "15" },
  { id: 34, question: "18 + 2 = ?", answer: "20" },
  { id: 35, question: "32 - 14 = ?", answer: "18" },
  { id: 36, question: "12 + 9 = ?", answer: "21" },
  { id: 37, question: "26 - 8 = ?", answer: "18" },
  { id: 38, question: "23 + 5 = ?", answer: "28" },
  { id: 39, question: "29 - 11 = ?", answer: "18" },
  { id: 40, question: "17 + 7 = ?", answer: "24" },
  { id: 41, question: "34 - 16 = ?", answer: "18" },
  { id: 42, question: "15 + 8 = ?", answer: "23" },
  { id: 43, question: "36 - 15 = ?", answer: "21" },
  { id: 44, question: "22 + 6 = ?", answer: "28" },
  { id: 45, question: "40 - 19 = ?", answer: "21" },
  { id: 46, question: "24 + 7 = ?", answer: "31" },
  { id: 47, question: "42 - 18 = ?", answer: "24" },
  { id: 48, question: "27 + 9 = ?", answer: "36" },
  { id: 49, question: "45 - 20 = ?", answer: "25" },
  { id: 50, question: "30 + 8 = ?", answer: "38" },
];

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

const SHIFT_STEP = 14;
const MIN_SHIFT_STEPS = 8;
const GAME_DURATION_SECONDS = 5 * 60;

const keypadLayout = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["clear", "0", "submit"],
];

const isMathQuestion = (value: string) => {
  const normalized = value.trim();
  if (!normalized) return false;
  return /[0-9]/.test(normalized) && /^[0-9+\-*/().=?\s]+$/.test(normalized);
};

const isMathAnswer = (value: string) => {
  const normalized = value.trim();
  if (!normalized) return false;
  return /[0-9]/.test(normalized) && /^[0-9+\-*/().\s]+$/.test(normalized);
};

export default function RopeGamePage() {
  const [setupMode, setSetupMode] = useState(true);
  const [teamNames, setTeamNames] = useState({
    left: "1-Jamoa",
    right: "2-Jamoa",
  });
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [currentQuestionIds, setCurrentQuestionIds] = useState<{
    left: number | null;
    right: number | null;
  }>({
    left: null,
    right: null,
  });
  const [inputs, setInputs] = useState({ left: "", right: "" });
  const [scores, setScores] = useState({ left: 0, right: 0 });
  const [ropeShift, setRopeShift] = useState(0);
  const [winner, setWinner] = useState<TeamKey | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<{
    left: "correct" | "wrong" | null;
    right: "correct" | "wrong" | null;
  }>({
    left: null,
    right: null,
  });
  const [newQuestion, setNewQuestion] = useState({ question: "", answer: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [arenaSize, setArenaSize] = useState({ width: 0, height: 0 });
  const [imageAspect, setImageAspect] = useState<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
  const [gameOver, setGameOver] = useState(false);

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Locks/timers (fix: double scoring, pending timeouts, cleanup)
  const submitLockRef = useRef<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });
  const advanceLockRef = useRef<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });
  const feedbackTimersRef = useRef<{ left?: number; right?: number }>({});
  const advanceTimersRef = useRef<{ left?: number; right?: number }>({});
  const lockReleaseTimersRef = useRef<{ left?: number; right?: number }>({});
  const imageAspectSetRef = useRef(false);

  const isInteractionBlocked = !!winner || countdown !== null || gameOver;

  const fireWinConfetti = useCallback((options: ConfettiOptions) => {
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
  }, []);

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

  // Fix: if screen resizes and maxShiftSteps shrinks, clamp current ropeShift
  useEffect(() => {
    if (setupMode) return;
    setRopeShift((prev) =>
      Math.max(-maxShiftSteps, Math.min(maxShiftSteps, prev)),
    );
  }, [maxShiftSteps, setupMode]);

  // Fix: keep current ids valid and (when possible) distinct
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

      // If both exist but equal (possible if questions changed), try to separate
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

  // Countdown
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

  // Audio init + cleanup (single effect)
  useEffect(() => {
    if (typeof window === "undefined") return;
    audioRef.current = new Audio("/sounds/rope-sound.m4a");
    audioRef.current.load();
    return () => {
      stopAudio();
      audioRef.current = null;
    };
  }, [stopAudio]);

  // Resize observer
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

  // Win detection (fix: clear pending timeouts/locks when win happens)
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

  // Game timer
  useEffect(() => {
    if (setupMode || winner || gameOver || countdown !== null) return;
    if (timeLeft <= 0) return;

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [setupMode, winner, gameOver, countdown, timeLeft]);

  // Time over winner decision
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

  // Safety cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      stopAudio();
    };
  }, [clearAllTimeouts, stopAudio]);

  const resetRoundState = useCallback(() => {
    setInputs({ left: "", right: "" });
    setAnswerFeedback({ left: null, right: null });
  }, []);

  const startGame = useCallback(() => {
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
  }, [clearAllTimeouts, resetLocks, getRandomQuestionId, resetRoundState]);

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

      setInputs((prev) => ({ ...prev, [team]: "" }));
      setCurrentQuestionIds((prev) => ({
        ...prev,
        [team]: getRandomQuestionId(prev[team]),
      }));

      // release lock (store timer for cleanup)
      clearTeamTimeout(team);
      lockReleaseTimersRef.current[team] = window.setTimeout(() => {
        advanceLockRef.current[team] = false;
      }, 250);
    },
    [questions.length, getRandomQuestionId, clearTeamTimeout],
  );

  const triggerFeedback = useCallback(
    (team: TeamKey, type: "correct" | "wrong") => {
      setAnswerFeedback((prev) => ({ ...prev, [team]: type }));

      if (feedbackTimersRef.current[team]) {
        window.clearTimeout(feedbackTimersRef.current[team]);
      }

      feedbackTimersRef.current[team] = window.setTimeout(() => {
        setAnswerFeedback((prev) => ({ ...prev, [team]: null }));
      }, 650);
    },
    [],
  );

  const submitAnswer = useCallback(
    (team: TeamKey) => {
      if (isInteractionBlocked) return;
      if (submitLockRef.current[team]) return; // Fix: prevent double scoring

      const currentQuestion =
        team === "left" ? currentLeftQuestion : currentRightQuestion;
      if (!currentQuestion) return;

      const attempt = inputs[team].trim().toLowerCase();
      const answer = currentQuestion.answer.trim().toLowerCase();

      const isCorrect = attempt.length > 0 && attempt === answer;

      if (isCorrect) {
        submitLockRef.current[team] = true; // lock immediately
        triggerFeedback(team, "correct");
        setInputs((prev) => ({ ...prev, [team]: "" })); // clear immediately
        updateScore(team);

        // schedule advance (store timer for cleanup)
        if (advanceTimersRef.current[team])
          window.clearTimeout(advanceTimersRef.current[team]);
        advanceTimersRef.current[team] = window.setTimeout(() => {
          // If a win happened during the delay, don't advance
          if (!winner) advanceTeamRound(team);
          submitLockRef.current[team] = false;
        }, 420);

        return;
      }

      triggerFeedback(team, "wrong");
      setInputs((prev) => ({ ...prev, [team]: "" }));
    },
    [
      isInteractionBlocked,
      currentLeftQuestion,
      currentRightQuestion,
      inputs,
      triggerFeedback,
      updateScore,
      winner,
      advanceTeamRound,
    ],
  );

  const handleKeypadInput = useCallback(
    (team: TeamKey, value: string) => {
      if (isInteractionBlocked) return;
      if (submitLockRef.current[team]) return;

      if (value === "clear") {
        setInputs((prev) => ({ ...prev, [team]: "" }));
        return;
      }
      if (value === "submit") {
        submitAnswer(team);
        return;
      }
      setInputs((prev) => ({ ...prev, [team]: `${prev[team]}${value}` }));
    },
    [isInteractionBlocked, submitAnswer],
  );

  const handleInputChange = useCallback(
    (team: TeamKey, value: string) => {
      if (isInteractionBlocked) return;
      if (submitLockRef.current[team]) return;
      setInputs((prev) => ({ ...prev, [team]: value }));
    },
    [isInteractionBlocked],
  );

  const addQuestion = useCallback(() => {
    const question = newQuestion.question.trim();
    const answer = newQuestion.answer.trim();

    if (!question || !answer) {
      setFormError("Savol va javobni to'ldiring.");
      return;
    }

    if (!isMathQuestion(question) || !isMathAnswer(answer)) {
      setFormError("Faqat matematik belgilar va raqamlar kiritilishi kerak.");
      return;
    }

    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        question,
        answer,
      },
    ]);

    setNewQuestion({ question: "", answer: "" });
    setFormError(null);
  }, [newQuestion]);

  const removeQuestion = useCallback((id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

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

  const renderKeypadButton = (team: TeamKey, key: string) => {
    if (key === "clear") {
      return (
        <button
          key={`${team}-clear`}
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            handleKeypadInput(team, "clear");
          }}
          // onClick={() => handleKeypadInput(team, "clear")}
          disabled={isInteractionBlocked || submitLockRef.current[team]}
          className="rope-game-keypad-btn touch-none select-none rounded-2xl bg-[#ff5b57] py-3 text-lg font-semibold text-white shadow-[0_8px_16px_rgba(255,91,87,0.35)] transition hover:brightness-95 disabled:opacity-60"
        >
          C
        </button>
      );
    }
    if (key === "submit") {
      return (
        <button
          key={`${team}-submit`}
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            handleKeypadInput(team, "submit");
          }}
          // onClick={() => handleKeypadInput(team, "submit")}
          disabled={isInteractionBlocked || submitLockRef.current[team]}
          className="rope-game-keypad-btn touch-none select-none rounded-2xl bg-[#3b8cff] py-3 text-lg font-semibold text-white shadow-[0_8px_16px_rgba(59,140,255,0.35)] transition hover:brightness-95 disabled:opacity-60"
        >
          Go
        </button>
      );
    }
    return (
      <button
        key={`${team}-${key}`}
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          handleKeypadInput(team, key);
        }}
        // onClick={() => handleKeypadInput(team, key)}
        disabled={isInteractionBlocked || submitLockRef.current[team]}
        className="rope-game-keypad-btn touch-none select-none rounded-2xl bg-white py-3 text-lg font-semibold text-slate-600 shadow-[0_6px_12px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_16px_rgba(15,23,42,0.16)] disabled:opacity-60"
      >
        {key}
      </button>
    );
  };

  const winnerName = winner ? teamNames[winner] : "";
  const timeEnded = timeLeft === 0 && showWinModal;
  const winMessage = timeEnded
    ? winnerName
      ? `Vaqt tugadi! \n${winnerName} g'olib!`
      : "Vaqt tugadi! Durang!"
    : winnerName
      ? `${winnerName} g'olib!`
      : "G'olib aniqlandi!";

  // Warn before close during game
  useEffect(() => {
    if (setupMode) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [setupMode]);

  // Stop audio when page hidden
  useEffect(() => {
    const handler = () => stopAudio();
    window.addEventListener("pagehide", handler);
    return () => window.removeEventListener("pagehide", handler);
  }, [stopAudio]);

  // Disable system keyboard on touch devices (use custom keypad instead)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouchDevice(media.matches);
    update();
    if (media.addEventListener) {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return (
    <div className="rope-game-shell flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-slate-50 to-sky-100 text-slate-900">
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
          <div className="rope-game-countdown countdown-pop text-9xl font-black text-slate-700 sm:text-8xl">
            {countdown}
          </div>
        </div>
      )}

      <div className="rope-game-inner relative z-10 w-full max-w-[1440px] px-4 py-10">
        {setupMode ? (
          <div className="rope-game-setup-grid grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
            <section className="rope-game-panel rope-game-setup-panel rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <div
                className="animate-fade-up"
                style={{ animationDelay: "0.05s" }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-800">
                    O‘yin haqida
                  </h2>
                </div>

                <p className="mt-3 text-sm text-slate-600">
                  O'qituvchi umumiy savollarni kiritadi, o'yin paytida har bir
                  jamoaga savollar tasodifiy tarzda chiqadi. Har bir tog'ri
                  javob arqonni sizning tomonga siljitadi.
                </p>
                <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                  Telefonda o'ynash uchun ekraningizni gorizontal holatga
                  o'tkazing.
                </p>

                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>1. Jamoa nomlarini kiriting.</li>
                  <li>2. Umumiy savollar va javoblarni qo'shing.</li>
                  <li>3. "Boshlash" tugmasini bosing.</li>
                </ul>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-100 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Tayyor savollar
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-800">
                    {questions.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    O'yin uchun tayyor namuna savollar
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
                disabled={questions.length === 0}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Play className="h-4 w-4" />
                O‘yinni Boshlash
              </Button>
            </section>

            <section className="rope-game-panel rope-game-setup-panel rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                  Savol qo'shish
                </h2>
                <span className="text-xs font-semibold text-slate-400">
                  {questions.length} ta savol
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <input
                  value={newQuestion.question}
                  onChange={(event) => {
                    setFormError(null);
                    setNewQuestion((prev) => ({
                      ...prev,
                      question: event.target.value,
                    }));
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Savol (10-4=?)"
                />
                <input
                  value={newQuestion.answer}
                  onChange={(event) => {
                    setFormError(null);
                    setNewQuestion((prev) => ({
                      ...prev,
                      answer: event.target.value,
                    }));
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Javob (6)"
                />
                {formError && (
                  <p className="text-xs font-semibold text-rose-500">
                    {formError}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={addQuestion}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                <Plus className="h-4 w-4" />
                Savol qo'shish
              </button>

              <div className="mt-6 max-h-80 space-y-3 overflow-y-auto pr-2">
                {questions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
                    Savollar hali yo'q. Yuqorida savol qo'shing.
                  </div>
                ) : (
                  questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                        <span>Savol {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeQuestion(question.id)}
                          className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-600"
                        >
                          <Trash2 className="h-3 w-3" />
                          O'chirish
                        </button>
                      </div>
                      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                        <p className="text-slate-700">{question.question}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          Javob: {question.answer}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="rope-game-match-grid grid grid-cols-1 items-center gap-8 lg:grid-cols-[320px_1fr_320px]">
            <section className="rope-game-panel rope-game-side-panel relative z-10 rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.15)]">
              <div
                className={`rope-game-question rounded-3xl bg-linear-to-b px-4 py-4 text-center text-2xl font-bold text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)] ${PANEL_THEME.left.header}`}
              >
                {currentLeftQuestion?.question ?? "Savol"}
              </div>

              <input
                value={inputs.left}
                onChange={(event) =>
                  handleInputChange("left", event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") submitAnswer("left");
                }}
                inputMode={isTouchDevice ? "none" : "numeric"}
                pattern="[0-9]*"
                readOnly={isTouchDevice}
                onFocus={(event) => {
                  if (isTouchDevice) event.currentTarget.blur();
                }}
                disabled={
                  !currentLeftQuestion ||
                  isInteractionBlocked ||
                  submitLockRef.current.left
                }
                className={`rope-game-answer-input answer-flash mt-4 w-full rounded-[22px] bg-white px-4 py-3 text-center text-xl font-semibold text-slate-600 shadow-inner focus:outline-none ${
                  answerFeedback.left === "correct"
                    ? "answer-flash-good"
                    : answerFeedback.left === "wrong"
                      ? "answer-flash-bad"
                      : ""
                }`}
              />

              <div className="rope-game-keypad mt-4 grid grid-cols-3 gap-3 touch-none">
                {keypadLayout.flatMap((row) =>
                  row.map((key) => renderKeypadButton("left", key)),
                )}
              </div>
            </section>

            <section className="rope-game-center flex flex-col items-center gap-4 text-center">
              <div className="rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                ⏱ {formatTime(timeLeft)}
              </div>
              <h2 className="rope-game-title text-2xl font-bold text-slate-600 sm:text-3xl">
                Jamoaviy musobaqa
              </h2>

              <div className="rope-game-score flex items-center gap-3 text-sm font-semibold">
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

              <div className="rope-game-arena relative w-full max-w-[520px] overflow-hidden rounded-3xl bg-linear-to-br from-slate-50 via-white to-slate-100 p-4 shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
                <div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] w-px -translate-x-1/2 border-l-2 border-dashed border-slate-400/70" />

                <div
                  ref={arenaRef}
                  className="rope-game-arena-canvas relative h-[190px] sm:h-[230px]"
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
                        // Fix: avoid repeated sets in StrictMode
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
                Arqonni tortish uchun savollarga to‘g‘ri javob bering!
              </p>
            </section>

            <section className="rope-game-panel rope-game-side-panel relative z-10 rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.15)]">
              <div
                className={`rope-game-question rounded-3xl bg-linear-to-b px-4 py-4 text-center text-2xl font-bold text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)] ${PANEL_THEME.right.header}`}
              >
                {currentRightQuestion?.question ?? "Savol"}
              </div>

              <input
                value={inputs.right}
                onChange={(event) =>
                  handleInputChange("right", event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") submitAnswer("right");
                }}
                inputMode={isTouchDevice ? "none" : "numeric"}
                pattern="[0-9]*"
                readOnly={isTouchDevice}
                onFocus={(event) => {
                  if (isTouchDevice) event.currentTarget.blur();
                }}
                disabled={
                  !currentRightQuestion ||
                  isInteractionBlocked ||
                  submitLockRef.current.right
                }
                className={`rope-game-answer-input answer-flash mt-4 w-full rounded-[22px] bg-white px-4 py-3 text-center text-xl font-semibold text-slate-600 shadow-inner focus:outline-none ${
                  answerFeedback.right === "correct"
                    ? "answer-flash-good"
                    : answerFeedback.right === "wrong"
                      ? "answer-flash-bad"
                      : ""
                }`}
              />

              <div className="rope-game-keypad mt-4 grid grid-cols-3 gap-3 touch-none">
                {keypadLayout.flatMap((row) =>
                  row.map((key) => renderKeypadButton("right", key)),
                )}
              </div>
            </section>
          </div>
        )}

        {!setupMode && (
          <>
            <button
              type="button"
              onClick={handleExitGame}
              className="rope-game-fab rope-game-fab-left fixed bottom-6 left-6 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition hover:text-slate-700"
              aria-label="Chiqish"
            >
              <Home className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="rope-game-fab rope-game-fab-right fixed bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition hover:text-slate-700"
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

        @keyframes answer-flash-good {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.55); background: #ffffff; }
          40% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0.35); background: #ecfdf5; }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); background: #ffffff; }
        }
        @keyframes answer-flash-bad {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.45); background: #ffffff; }
          40% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0.3); background: #fef2f2; }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); background: #ffffff; }
        }
        .answer-flash-good { animation: answer-flash-good 0.6s ease-out; }
        .answer-flash-bad { animation: answer-flash-bad 0.6s ease-out; }

        @media (orientation: landscape) and (max-height: 560px) {
          .rope-game-shell {
            align-items: flex-start;
          }

          .rope-game-inner {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }

          .rope-game-setup-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: 1rem;
          }

          .rope-game-setup-panel {
            padding: 1rem;
          }

          .rope-game-match-grid {
            grid-template-columns: minmax(200px, 30vw) minmax(0, 1fr) minmax(200px, 30vw);
            gap: 1rem;
            align-items: stretch;
          }

          .rope-game-panel {
            padding: 0.75rem;
            border-radius: 1.2rem;
          }

          .rope-game-question {
            padding: 0.6rem 0.75rem;
            font-size: 1.1rem;
            border-radius: 1.1rem;
          }

          .rope-game-answer-input {
            margin-top: 0.6rem;
            padding: 0.5rem 0.75rem;
            font-size: 1rem;
            border-radius: 1rem;
          }

          .rope-game-keypad {
            margin-top: 0.5rem;
            gap: 0.5rem;
          }

          .rope-game-keypad-btn {
            padding: 0.45rem 0;
            font-size: 0.95rem;
            border-radius: 0.9rem;
          }

          .rope-game-center {
            gap: 0.75rem;
          }

          .rope-game-title {
            font-size: 1.35rem;
          }

          .rope-game-score {
            font-size: 0.75rem;
            gap: 0.5rem;
          }

          .rope-game-arena {
            padding: 0.75rem;
            max-width: 420px;
          }

          .rope-game-arena-canvas {
            height: 150px;
          }

          .rope-game-countdown {
            font-size: 3.5rem;
          }

          .rope-game-fab {
            bottom: 0.75rem;
            height: 2.5rem;
            width: 2.5rem;
            border-radius: 0.9rem;
          }

          .rope-game-fab-left {
            left: 0.75rem;
          }

          .rope-game-fab-right {
            right: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
