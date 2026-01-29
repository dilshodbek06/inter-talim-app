/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  CheckCircle2,
  XCircle,
  Brain,
  Timer,
  Plus,
  Trash2,
  Sparkles,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackPrev from "@/components/back-prev";

type Question = {
  id: number;
  text: string;
  isTrue: boolean;
};

type ResultStatus = "idle" | "correct" | "wrong";

const ROUND_TIME = 10;

const DEFAULT_QUESTIONS: Question[] = [
  { id: 1, text: "7 × 8 = 54", isTrue: false },
  { id: 2, text: "Yer Quyosh atrofida aylanadi.", isTrue: true },
  { id: 3, text: "0 juft son emas.", isTrue: false },
];

export default function TrueFalsePreview() {
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [index, setIndex] = useState<number>(0);
  const [time, setTime] = useState<number>(ROUND_TIME);
  const [locked, setLocked] = useState<boolean>(false);
  const [status, setStatus] = useState<ResultStatus>("idle");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  // Teacher form state
  const [newText, setNewText] = useState<string>("");
  const [newIsTrue, setNewIsTrue] = useState<"true" | "false">("true");

  // Audio refs
  const tickRef = useRef<HTMLAudioElement | null>(null);
  const beepRef = useRef<HTMLAudioElement | null>(null);
  const successRef = useRef<HTMLAudioElement | null>(null);
  const errorRef = useRef<HTMLAudioElement | null>(null);

  // Timer uchun indexni refda ushlab turamiz (closure muammosiz bo‘lsin)
  const indexRef = useRef<number>(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const q = questions[index];

  /* ---------------- AUDIO INIT ---------------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    tickRef.current = new Audio(
      "https://actions.google.com/sounds/v1/ambiences/clock_ticking.ogg",
    );
    if (tickRef.current) {
      tickRef.current.volume = 0.4;
    }

    beepRef.current = new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
    );

    successRef.current = new Audio("/sounds/success.wav");
    errorRef.current = new Audio("/sounds/error.wav");
  }, []);

  /* ---------------- RESULT HANDLER ---------------- */

  const handleResult = useCallback(
    (correct: boolean, currentIndex: number) => {
      if (questions.length === 0) return;

      // ovozlar
      if (correct && successRef.current) {
        successRef.current.currentTime = 0;
        successRef.current.play().catch(() => {});
      }
      if (!correct && errorRef.current) {
        errorRef.current.currentTime = 0.5;
        errorRef.current.play().catch(() => {});
      }

      setLocked(true);
      setStatus(correct ? "correct" : "wrong");

      setTimeout(() => {
        const isLast = currentIndex >= questions.length - 1;

        if (isLast) {
          // 🔚 oxirgi savoldan keyin o‘yin tugaydi
          setGameFinished(true);
          setLocked(true);
          // statusni saqlab qo‘yamiz
        } else {
          setIndex((prev) => prev + 1);
          setTime(ROUND_TIME);
          setLocked(false);
          setStatus("idle");
        }
      }, 900);
    },
    [questions.length],
  );

  /* ---------------- TIMER EFFECT (faqat interval) ---------------- */

  useEffect(() => {
    if (!gameStarted) return;
    if (gameFinished) return;
    if (locked) return;
    if (time <= 0) return; // keyingi tickda handleResult chaqirilgan bo‘ladi

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          // shu tickda vaqt tugadi
          clearInterval(interval);
          // bu allaqachon "external event" callback – bu yerda setState chaqirish normal
          handleResult(false, indexRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, gameFinished, locked, handleResult, time]);

  /* ---------------- SOUND EFFECT (time ga qarab) ---------------- */

  useEffect(() => {
    if (!gameStarted) return;
    if (gameFinished) return;
    if (locked) return;
    if (time <= 0) return;

    // Oxirgi 5 soniyada beep
    if (time <= 5 && beepRef.current) {
      beepRef.current.currentTime = 0;
      beepRef.current.play().catch(() => {});
    }

    // Har soniyada "tick"
    if (tickRef.current) {
      tickRef.current.currentTime = 0;
      tickRef.current.play().catch(() => {});
    }
  }, [time, gameStarted, gameFinished, locked]);

  /* ---------------- ANSWER CLICK ---------------- */

  const handleAnswer = (userThinksTrue: boolean) => {
    if (!gameStarted || locked || !q || gameFinished) return;
    const correct = userThinksTrue === q.isTrue;
    handleResult(correct, index);
  };

  const total = questions.length || 1;
  const progress = gameStarted
    ? Math.round((Math.min(index + 1, total) / total) * 100)
    : 0;

  /* ---------------- TEACHER FORM LOGIC ---------------- */

  const addQuestion = () => {
    const text = newText.trim();
    if (text.length < 3) {
      alert("Savol matni juda qisqa. Kamida 3 ta belgidan iborat bo‘lsin.");
      return;
    }

    const newQuestion: Question = {
      id: Date.now(),
      text,
      isTrue: newIsTrue === "true",
    };

    setQuestions((prev) => [...prev, newQuestion]);
    setNewText("");
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addQuestion();
    }
  };

  const handleStartGame = () => {
    if (questions.length === 0) {
      alert("Avval kamida bitta savol yarating.");
      return;
    }
    setIndex(0);
    setTime(ROUND_TIME);
    setLocked(false);
    setStatus("idle");
    setGameFinished(false);
    setGameStarted(true);
  };

  const handleBackToSetup = () => {
    setGameStarted(false);
    setLocked(false);
    setStatus("idle");
    setTime(ROUND_TIME);
    setIndex(0);
    setGameFinished(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 py-8 px-4 sm:px-6">
      <div className="w-full max-w-5xl mx-auto">
        {/* Global header */}
        <BackPrev />
        <div className="text-center mb-8 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 px-4 py-1 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              True / False o‘yini
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
            True or False – Tezkor o‘yin
          </h1>
          <p className="text-slate-600 max-w-2xl">
            Ustoz savollarni tayyorlaydi, o‘quvchilar esa qisqa vaqt ichida
            "To‘g‘ri" yoki "Noto‘g‘ri" deb javob berishadi. Har raund uchun{" "}
            {ROUND_TIME} soniya vaqt beriladi.
          </p>
        </div>

        {!gameStarted ? (
          /* ---------- TEACHER SETUP MODE ---------- */
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Left: intro */}
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/50 p-6 sm:p-7 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
                  1
                </span>
                <span className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                  O‘yinga kirish
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Ustoz uchun qisqacha qo‘llanma
              </h2>

              <ul className="space-y-2 text-sm sm:text-base text-slate-700">
                <li>
                  • Savolni yozing (masalan: "Yer Quyosh atrofida aylanadi.")
                </li>
                <li>
                  • Pastdan "To‘g‘ri" yoki "Noto‘g‘ri" deb belgilab qo‘ying.
                </li>
                <li>• "Savol qo‘shish" tugmasi orqali ro‘yxatga qo‘shing.</li>
                <li>
                  • Kamida bitta savol tayyorlang va{" "}
                  <span className="font-semibold">"O‘yinni boshlash"</span>{" "}
                  tugmasini bosing.
                </li>
                <li>
                  • Har bir savol uchun {ROUND_TIME} soniya beriladi, oxirgi
                  soniyalarda signal va soat ovozi eshitiladi.
                </li>
              </ul>

              <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <p className="font-semibold mb-1">Misol o‘yin:</p>
                <p>
                  Ustoz savolni o‘qiydi, o‘quvchilar ovoz bilan javob berishadi.
                </p>
                <p className="mt-1">
                  Ustoz ekrandan to‘g‘ri tugmani bosganida o‘yin natijani
                  ko‘rsatadi va keyingi savolga o‘tadi.
                </p>
              </div>
            </div>

            {/* Right: question builder */}
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/50 p-6 sm:p-7 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
                  2
                </span>
                <span className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                  Savollarni yaratish
                </span>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Savol matni
                </label>
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={handleTextKeyDown}
                  placeholder="Masalan: 'Suv 0°C da muzlaydi.'"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-edu-blue focus:border-edu-blue bg-white/80"
                />

                <div className="flex flex-wrap gap-3 items-center">
                  <span className="text-sm font-medium text-slate-700">
                    Javob:
                  </span>
                  <div className="inline-flex rounded-full bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => setNewIsTrue("true")}
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 ${
                        newIsTrue === "true"
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "text-slate-700"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      To‘g‘ri
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewIsTrue("false")}
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 ${
                        newIsTrue === "false"
                          ? "bg-rose-500 text-white shadow-sm"
                          : "text-slate-700"
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      Noto‘g‘ri
                    </button>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addQuestion}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl  text-white text-sm sm:text-base font-semibold px-4 py-2.5 shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Savol qo‘shish
                </Button>
              </div>

              {questions.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span className="font-semibold">
                      Tayyor savollar: {questions.length}
                    </span>
                    <span className="text-xs">
                      Ustoz ekranda ishlatadigan ro‘yxat
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {questions.map((question) => (
                      <div
                        key={question.id}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                      >
                        <div className="flex-1 pr-2">
                          <p className="font-semibold text-slate-800 truncate">
                            {question.text}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            {question.isTrue ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                To‘g‘ri
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-rose-500" />
                                Noto‘g‘ri
                              </>
                            )}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(question.id)}
                          className="p-1.5 rounded-full text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleStartGame}
                disabled={questions.length === 0}
                className={`mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl text-base sm:text-lg font-semibold px-4 py-6 shadow-md transition-all ${
                  questions.length === 0
                    ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                    : " text-white"
                }`}
              >
                <Play className="w-5 h-5" />
                O‘yinni boshlash
              </Button>
            </div>
          </div>
        ) : (
          /* ---------- GAME MODE ---------- */
          <div className="w-full max-w-xl mx-auto bg-white/85 backdrop-blur rounded-3xl shadow-xl p-6 sm:p-7 space-y-6 border border-white/50">
            {/* Header chip + timer + progress */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 border border-indigo-100">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                    True / False Blitz
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-slate-700 text-sm">
                  <Timer className="w-4 h-4" />
                  <span className="font-semibold">
                    {gameFinished ? "0s" : `${time}s`}
                  </span>
                </div>

                <div className="w-28 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      time <= 5 && !gameFinished
                        ? "bg-rose-500"
                        : "bg-emerald-500"
                    }`}
                    style={{
                      width: gameFinished
                        ? "100%"
                        : `${(time / ROUND_TIME) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Question progress pill */}
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span className="font-medium">
                Savol: {Math.min(index + 1, questions.length)} /{" "}
                {questions.length}
              </span>
              <span>{progress}% yakunlandi</span>
            </div>

            {/* Question card */}
            <div
              className={`
                rounded-2xl px-4 py-10 sm:px-6 sm:py-10 text-center border
                ${
                  status === "correct"
                    ? "bg-emerald-50 border-emerald-200"
                    : status === "wrong"
                      ? "bg-rose-50 border-rose-200"
                      : "bg-slate-50 border-slate-200"
                }
              `}
            >
              <p
                className={`text-2xl sm:text-3xl font-bold leading-relaxed ${
                  status === "correct"
                    ? "text-emerald-700"
                    : status === "wrong"
                      ? "text-rose-700"
                      : "text-slate-900"
                }`}
              >
                {q?.text}
              </p>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleAnswer(true)}
                className={`
                  h-14 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2
                  shadow-md transition-all focus:outline-none
                  ${
                    gameFinished || locked
                      ? q?.isTrue
                        ? "bg-emerald-500"
                        : "bg-emerald-300"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  }
                `}
                disabled={locked || gameFinished}
              >
                <CheckCircle2 className="w-5 h-5" />
                To‘g‘ri
              </button>

              <button
                type="button"
                onClick={() => handleAnswer(false)}
                className={`
                  h-14 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2
                  shadow-md transition-all focus:outline-none
                  ${
                    gameFinished || locked
                      ? q && !q.isTrue
                        ? "bg-rose-500"
                        : "bg-rose-300"
                      : "bg-rose-500 hover:bg-rose-600"
                  }
                `}
                disabled={locked || gameFinished}
              >
                <XCircle className="w-5 h-5" />
                Noto‘g‘ri
              </button>
            </div>

            <div className="flex flex-col gap-1 pt-2 text-xs sm:text-sm text-slate-500">
              {gameFinished ? (
                <p className="text-emerald-700 font-semibold text-center">
                  🎉 Barcha savollar tugadi. Yangi savollar qo‘shib, yana o‘yin
                  boshlashingiz mumkin.
                </p>
              ) : (
                <p>
                  💡 Har bir savol uchun {ROUND_TIME} soniya beriladi. Oxirgi
                  soniyalarda signal va soat ovozi eshitiladi.
                </p>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleBackToSetup}
                  className="underline-offset-2 hover:underline text-indigo-600 font-medium"
                >
                  Savollarni o‘zgartirish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
