/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Trophy, Timer, RotateCcw } from "lucide-react";
import type { Country, Question } from "@/types";
import { generateQuestion } from "@/utils/flag-game-logic";
import { Intro } from "./intro";
import { Confetti } from "@/components/confetti";
import { WinModal } from "@/components/win-modal";
import Image from "next/image";
import { useExitGuard } from "@/hooks/use-exit-guard";

interface GameProps {
  playerName?: string;
}

const ROUND_SECONDS = 10;
const MAX_MISTAKES = 5; // UI: {mistakes}/5
const MAX_QUESTIONS = 20;

const FlagDisplay = ({ country }: { country: Country }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const countryCode = country.code.toLowerCase();
  const flagSrc = `/flags/${countryCode}.svg`;

  useEffect(() => {
    setImageFailed(false);
  }, [countryCode]);

  if (imageFailed) {
    return (
      <span
        className="text-7xl sm:text-8xl md:text-9xl drop-shadow-lg"
        aria-label={`${country.name} bayrog'i`}
      >
        {country.flag || "🏳️"}
      </span>
    );
  }

  return (
    <Image
      src={flagSrc}
      alt={`${country.name} bayrog'i`}
      className="h-20 sm:h-24 md:h-28 w-auto drop-shadow-lg"
      width={160}
      height={120}
      sizes="(min-width: 768px) 112px, 96px"
      priority
      unoptimized
      onError={() => setImageFailed(true)}
    />
  );
};

export default function Game({ playerName: initialPlayerName }: GameProps) {
  const [gameStarted, setGameStarted] = useState(() => !!initialPlayerName);
  const [playerName, setPlayerName] = useState(() => initialPlayerName || "");

  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);

  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [buttonRect, setButtonRect] = useState<DOMRect | undefined>();

  const [questionCount, setQuestionCount] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);

  useExitGuard({ enabled: gameStarted });

  // Keep latest values for async callbacks (timeouts)
  const mistakesRef = useRef(mistakes);
  const questionCountRef = useRef(questionCount);
  const showWinModalRef = useRef(showWinModal);
  const selectedAnswerRef = useRef<string | null>(selectedAnswer);

  useEffect(() => {
    mistakesRef.current = mistakes;
  }, [mistakes]);

  useEffect(() => {
    questionCountRef.current = questionCount;
  }, [questionCount]);

  useEffect(() => {
    showWinModalRef.current = showWinModal;
  }, [showWinModal]);

  useEffect(() => {
    selectedAnswerRef.current = selectedAnswer;
  }, [selectedAnswer]);

  // Timeouts cleanup (avoid "ghost" updates after restart/unmount)
  const nextTimeoutRef = useRef<number | null>(null);

  const clearNextTimeout = useCallback(() => {
    if (nextTimeoutRef.current !== null) {
      window.clearTimeout(nextTimeoutRef.current);
      nextTimeoutRef.current = null;
    }
  }, []);

  // Ensure we have a question whenever game is started (fixes initialPlayerName auto-start crash/blank)
  useEffect(() => {
    if (gameStarted && !question) {
      setQuestion(generateQuestion());
      setTimeLeft(ROUND_SECONDS);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowConfetti(false);
    }
  }, [gameStarted, question]);

  const stopIfFinishedOrContinue = useCallback((wasCorrect: boolean) => {
    const nextMistakes = wasCorrect
      ? mistakesRef.current
      : mistakesRef.current + 1;
    const nextCount = questionCountRef.current + 1;

    setMistakes(nextMistakes);
    setQuestionCount(nextCount);

    const finished = nextMistakes >= MAX_MISTAKES || nextCount >= MAX_QUESTIONS;
    if (finished) {
      setShowWinModal(true);
      // Stop timer by making selectedAnswer non-null (optional, but helps prevent edge-cases)
      setSelectedAnswer((prev) => prev ?? "finished");
      return;
    }

    setQuestion(generateQuestion());
    setTimeLeft(ROUND_SECONDS);
    setShowConfetti(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  const scheduleNext = useCallback(
    (wasCorrect: boolean, delayMs: number) => {
      clearNextTimeout();
      nextTimeoutRef.current = window.setTimeout(() => {
        // If modal already open or game not active, ignore
        if (showWinModalRef.current) return;
        stopIfFinishedOrContinue(wasCorrect);
      }, delayMs);
    },
    [clearNextTimeout, stopIfFinishedOrContinue],
  );

  // Timer interval (stops when answered or modal open)
  useEffect(() => {
    if (!gameStarted) return;
    if (!question) return;
    if (showWinModal) return;
    if (selectedAnswer !== null) return;

    const intervalId = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [gameStarted, question, showWinModal, selectedAnswer]);

  // When time hits 0, treat as timeout (only once)
  useEffect(() => {
    if (!gameStarted) return;
    if (!question) return;
    if (showWinModal) return;
    if (timeLeft !== 0) return;
    if (selectedAnswerRef.current !== null) return; // already answered

    setSelectedAnswer("timeout");
    setIsCorrect(false);
    scheduleNext(false, 50);
  }, [timeLeft, gameStarted, question, showWinModal, scheduleNext]);

  const handleAnswer = useCallback(
    (countryName: string, event: MouseEvent<HTMLButtonElement>) => {
      if (!question) return;
      if (selectedAnswerRef.current !== null) return; // already answered/timeout/finished
      if (showWinModalRef.current) return;

      setSelectedAnswer(countryName);

      const correct = countryName === question.correctCountry.name;
      setIsCorrect(correct);

      if (correct) {
        setScore((prev) => prev + 1);
        setButtonRect(event.currentTarget.getBoundingClientRect());
        setShowConfetti(true);
        scheduleNext(true, 2000);
      } else {
        scheduleNext(false, 1500);
      }
    },
    [question, scheduleNext],
  );

  const handleStartGame = useCallback(
    (name: string) => {
      clearNextTimeout();

      setPlayerName(name);
      setScore(0);
      setMistakes(0);
      setQuestionCount(0);

      setQuestion(generateQuestion());
      setTimeLeft(ROUND_SECONDS);

      setShowConfetti(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setButtonRect(undefined);

      setShowWinModal(false);
      setGameStarted(true);
    },
    [clearNextTimeout],
  );

  const handleRestart = useCallback(() => {
    clearNextTimeout();

    setGameStarted(false);
    setPlayerName("");
    setScore(0);
    setMistakes(0);
    setQuestionCount(0);

    setQuestion(null);
    setTimeLeft(ROUND_SECONDS);

    setShowConfetti(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setButtonRect(undefined);

    setShowWinModal(false);
  }, [clearNextTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearNextTimeout();
    };
  }, [clearNextTimeout]);

  if (!gameStarted) {
    return <Intro onStart={handleStartGame} />;
  }

  const getButtonStyle = (countryName: string) => {
    if (!question) {
      return "bg-white border-2 border-gray-200";
    }

    if (selectedAnswer === null) {
      return "bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400";
    }

    if (countryName === question.correctCountry.name) {
      return "bg-green-500 text-white border-2 border-green-600";
    }

    if (countryName === selectedAnswer && isCorrect === false) {
      return "bg-red-500 text-white border-2 border-red-600";
    }

    return "bg-gray-100 text-gray-400 border-2 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-6">
      {showConfetti && buttonRect && <Confetti buttonRect={buttonRect} />}

      <WinModal
        isOpen={showWinModal}
        onClose={handleRestart}
        score={score}
        message={playerName}
      />

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-5 sm:p-8">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ishtirokchi</p>
              <p className="font-bold text-gray-800 text-lg sm:text-xl">
                {playerName}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
              <div className="flex items-center justify-center gap-2 bg-yellow-100 px-3 sm:px-4 py-2 rounded-full">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-yellow-700 text-sm sm:text-base">
                  Ball: {score}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 bg-red-100 px-3 sm:px-4 py-2 rounded-full">
                <span className="font-bold text-red-700 text-sm sm:text-base">
                  Xatolar: {mistakes}/{MAX_MISTAKES}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 bg-blue-100 px-3 sm:px-4 py-2 rounded-full">
                <Timer className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-700 text-sm sm:text-base">
                  {timeLeft}s
                </span>
              </div>

              <button
                onClick={handleRestart}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                title="Restart game"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">Qayta</span>
              </button>
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          Bu qaysi davlat bayrog&apos;i?
        </h1>

        <div className="flex justify-center mb-10 sm:mb-12">
          <div className="flex items-center justify-center scale-110 sm:scale-125">
            {question ? (
              <FlagDisplay country={question.correctCountry} />
            ) : (
              <span className="text-7xl sm:text-8xl md:text-9xl drop-shadow-lg">
                {"🏳️"}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {question?.options.map((country) => (
            <button
              key={country.code}
              onClick={(e) => handleAnswer(country.name, e)}
              disabled={selectedAnswer !== null || !question || showWinModal}
              className={`${getButtonStyle(country.name)}
                py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg
                transition-all duration-300 transform hover:scale-105
                disabled:hover:scale-100 disabled:cursor-not-allowed`}
            >
              {country.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
