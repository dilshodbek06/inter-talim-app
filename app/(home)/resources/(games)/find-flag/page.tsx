/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Trophy, Timer, RotateCcw } from "lucide-react";
import { Question } from "@/types";
import { generateQuestion } from "@/utils/flag-game-logic";
import { Intro } from "./intro";
import { Confetti } from "@/components/confetti";
import { WinModal } from "@/components/win-modal";

interface GameProps {
  playerName?: string;
}

export default function Game({ playerName: initialPlayerName }: GameProps) {
  const [gameStarted, setGameStarted] = useState(!!initialPlayerName);
  const [playerName, setPlayerName] = useState(initialPlayerName || "");
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [buttonRect, setButtonRect] = useState<DOMRect | undefined>();
  const [questionCount, setQuestionCount] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);

  useEffect(() => {
    if (!gameStarted || selectedAnswer !== null) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setSelectedAnswer("timeout");
          setTimeout(() => handleNextQuestion(false), 50);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, selectedAnswer]);

  const handleAnswer = (
    countryName: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(countryName);
    const correct = countryName === question!.correctCountry.name;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      const rect = event.currentTarget.getBoundingClientRect();
      setButtonRect(rect);
      setShowConfetti(true);

      setTimeout(() => handleNextQuestion(true), 2000);
    } else {
      setTimeout(() => handleNextQuestion(false), 1500);
    }
  };

  const handleNextQuestion = (wasCorrect: boolean) => {
    // Update mistakes count if answer was wrong
    const newMistakes = wasCorrect ? mistakes : mistakes + 1;
    const newCount = questionCount + 1;

    setMistakes(newMistakes);
    setQuestionCount(newCount);

    // Stop game if 6 mistakes or 20 questions reached
    if (newMistakes >= 6 || newCount >= 20) {
      setShowWinModal(true);
      return;
    }

    // Prepare next question
    setQuestion(generateQuestion());
    setTimeLeft(10);
    setShowConfetti(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleStartGame = (name: string) => {
    setPlayerName(name);
    setScore(0);
    setMistakes(0);
    setQuestionCount(0);
    setQuestion(generateQuestion());
    setTimeLeft(10);
    setShowConfetti(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowWinModal(false);
    setGameStarted(true);
  };

  const handleRestart = () => {
    setGameStarted(false);
    setPlayerName("");
    setScore(0);
    setMistakes(0);
    setTimeLeft(10);
    setShowConfetti(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuestionCount(0);
    setShowWinModal(false);
    setQuestion(generateQuestion());
  };

  if (!gameStarted) {
    return <Intro onStart={handleStartGame} />;
  }

  const getButtonStyle = (countryName: string) => {
    if (selectedAnswer === null) {
      return "bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400";
    }

    if (countryName === question!.correctCountry.name) {
      return "bg-green-500 text-white border-2 border-green-600";
    }

    if (countryName === selectedAnswer && !isCorrect) {
      return "bg-red-500 text-white border-2 border-red-600";
    }

    return "bg-gray-100 text-gray-400 border-2 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-6">
      {showConfetti && <Confetti buttonRect={buttonRect} />}

      <WinModal
        isOpen={showWinModal}
        onClose={handleRestart}
        score={score}
        message={playerName}
      />

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-5 sm:p-8">
        {/* Header and UI */}
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
                  Xatolar: {mistakes}/5
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
          <div className="text-7xl sm:text-8xl md:text-9xl drop-shadow-lg scale-110 sm:scale-125">
            {question?.correctCountry.flag}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {question?.options.map((country) => (
            <button
              key={country.code}
              onClick={(e) => handleAnswer(country.name, e)}
              disabled={selectedAnswer !== null}
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
