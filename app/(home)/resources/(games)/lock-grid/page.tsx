"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LockOpen, Sparkles, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FallConfetti, { ConfettiHandle } from "@/components/fall-confetti";
import BackPrev from "@/components/back-prev";

type Question = {
  id: number;
  text: string;
  // teacher-as-adjudicator model: stored answer optional (we won't auto-check)
  providedAnswer?: boolean | null;
};

const DEFAULT_QUESTIONS: Question[] = [
  { id: 1, text: "O'zbekistonda nechta viloyat bor?" },
  { id: 2, text: "Futbolning vatani qayer?" },
  { id: 3, text: "Uchburchakning nechta tomoni bor?" },
  { id: 4, text: "Bayroq qachon qabul qilingan?" },
  { id: 5, text: "Fizika fanining otasi kim?" },
];

export default function UnlockLocksGame() {
  // app state
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [openedLocks, setOpenedLocks] = useState<Record<number, boolean>>({});
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [answerError, setAnswerError] = useState<string | null>(null);

  // UI / form
  const [newQuestionText, setNewQuestionText] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  // sounds
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const errorSoundRef = useRef<HTMLAudioElement | null>(null);

  const confettiRef = useRef<ConfettiHandle | null>(null);

  // add victory sound
  const victorySoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      successSoundRef.current = new Audio("/sounds/unlock.wav");
      errorSoundRef.current = new Audio("/sounds/error.wav");
      victorySoundRef.current = new Audio("/sounds/victory.wav");
      // preload if possible
      successSoundRef.current.load();
      errorSoundRef.current.load();
      victorySoundRef.current.load();
    }
  }, []);

  const playSuccessSound = () => {
    if (successSoundRef.current) {
      successSoundRef.current.currentTime = 0;
      successSoundRef.current.play().catch(() => {});
    }
  };

  const playErrorSound = () => {
    if (errorSoundRef.current) {
      errorSoundRef.current.currentTime = 0.5;
      errorSoundRef.current.play().catch(() => {});
    }
  };

  const playVictorySound = () => {
    if (victorySoundRef.current) {
      victorySoundRef.current.currentTime = 0;
      victorySoundRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    const ids = questions.map((q) => q.id);
    if (ids.length === 0) return;

    // are all present question ids set to true in openedLocks?
    const allOpened = ids.every((id) => openedLocks[id] === true);

    if (allOpened) {
      // trigger confetti & victory sound
      confettiRef.current?.start(150, {
        // optional colors suited for edu — you can tweak
        colors: ["#10B981", "#6366F1", "#F97316", "#06B6D4", "#F59E0B"],
      });
      playVictorySound();
    }
  }, [openedLocks, questions]);

  // Play success sound when a lock actually transitions to opened.
  // This keeps playback tied to the visual opening (and avoids duplicate plays).
  const prevOpenedRef = useRef<Record<number, boolean>>({});

  useEffect(() => {
    const prev = prevOpenedRef.current || {};
    const curr = openedLocks || {};
    // detect any id that transitioned from falsy -> true
    for (const key of Object.keys(curr)) {
      const id = Number(key);
      if (!prev[id] && curr[id]) {
        playSuccessSound();
      }
    }
    prevOpenedRef.current = { ...curr };
  }, [openedLocks]);

  const currentQuestion =
    questions.find((q) => q.id === activeQuestionId) || null;

  // O'qituvchi form funksiyalari
  const addQuestion = () => {
    const text = newQuestionText.trim();
    if (!text) return;
    const newQ: Question = {
      id: Date.now(),
      text,
      providedAnswer: null,
    };
    setQuestions((s) => [...s, newQ]);
    setNewQuestionText("");
  };

  const removeQuestion = (id: number) => {
    setQuestions((s) => s.filter((q) => q.id !== id));
    setOpenedLocks((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleLockClick = (id: number) => {
    // if game not started, do nothing
    if (!gameStarted) return;
    if (openedLocks[id]) return;
    setActiveQuestionId(id);
    setAnswerError(null);
    setIsDialogOpen(true);
  };

  // Teacher adjudicates: if teacher clicks "To'g'ri" -> open lock
  const handleTeacherMark = (markedCorrect: boolean) => {
    if (!currentQuestion) return;

    if (markedCorrect) {
      // mark providedAnswer and open lock
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === currentQuestion.id ? { ...q, providedAnswer: true } : q
        )
      );
      setOpenedLocks((prev) => ({ ...prev, [currentQuestion.id]: true }));
      // sound is handled in the openedLocks effect (to tie sound to the visual opening)
      setIsDialogOpen(false);
      setActiveQuestionId(null);
      setAnswerError(null);
    } else {
      // teacher marked incorrect -> show error prompt
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === currentQuestion.id ? { ...q, providedAnswer: false } : q
        )
      );
      setAnswerError(
        "Noto‘g‘ri deb belgilandi. O‘quvchi qayta urinishi mumkin."
      );
      playErrorSound();
    }
  };

  const resetGame = () => {
    setOpenedLocks({});
    setGameStarted(false);
    setActiveQuestionId(null);
    setIsDialogOpen(false);
    setAnswerError(null);
    prevOpenedRef.current = {};
  };

  return (
    <motion.div
      className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 py-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <FallConfetti ref={confettiRef} />
        {/* Header */}
        <BackPrev />
        <div className="mb-6 text-center">
          <div className="inline-flex w-fit mx-auto items-center gap-2 rounded-full bg-white/80 border border-slate-200 px-4 py-1 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              Quflarni oching o‘yini
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">
            Qulflarni oching! 🔐
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto mt-2">
            O‘qituvchi savollar qo‘shadi (javobsiz). O‘yin boshlangach, o‘quvchi
            javob beradi — o‘qituvchi dialogdan{" "}
            <span className="font-semibold text-emerald-700">To‘g‘ri</span> yoki{" "}
            <span className="font-semibold text-rose-600">Noto‘g‘ri</span> deb
            belgilaydi.
          </p>
        </div>

        {/* Two column: left intro / right form (or game view when started) */}
        {!gameStarted ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-start">
            {/* Left: Introduction */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100"
            >
              <h2 className="text-xl font-bold mb-3">O‘yin haqida (Intro)</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Bu o‘yin o‘quvchilar uchun mo‘ljallangan: har bir qulf ortida
                bitta savol yashiringan. O‘qituvchi savollarning matnini shu
                yerga qo‘shadi (javobsiz). O‘yin boshlangach, o‘quvchi javob
                beradi va o‘qituvchi javobni tekshiradi.
              </p>

              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Savollarni o‘ngdagi formga qo‘shing.</li>
                <li>
                  • Kerak bo‘lsa, mavjud savollarni o‘chirib yoki tahrirlab
                  qo‘ying.
                </li>
                <li>
                  • “Play game” tugmasini bosganingizdan so‘ng o‘yin boshlanadi.
                </li>
              </ul>

              <div className="mt-6 flex items-center gap-3">
                <Button onClick={() => setGameStarted(true)}>
                  O‘yinni boshlash ▶
                </Button>
              </div>
            </motion.div>

            {/* Right: Teacher form */}
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100"
            >
              <h3 className="text-lg font-semibold mb-3">
                O‘qituvchi — Savol qo‘shish
              </h3>

              <label className="block text-sm text-slate-600 mb-2">
                Savol matni
              </label>
              <textarea
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-md border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Masalan: O‘zbekiston poytaxti qaysi shahar?"
              />

              <div className="mt-3 flex gap-2">
                <Button onClick={addQuestion}>Qo‘shish</Button>
                <Button
                  variant="outline"
                  onClick={() => setNewQuestionText("")}
                >
                  Tozalash
                </Button>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">
                  Mavjud savollar ({questions.length})
                </h4>
                <div className="space-y-2 max-h-64 overflow-auto pr-2">
                  {questions.map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-slate-100 bg-slate-50"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-slate-800">{q.text}</p>
                      </div>

                      <div className="flex flex-col gap-2 items-end">
                        <button
                          title="O‘chir"
                          onClick={() => removeQuestion(q.id)}
                          className="p-2 rounded-md hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Eslatma: o‘yin boshlangach, siz (o‘qituvchi) har bir savol uchun
                To‘g‘ri/Noto‘g‘ri ni belgilaysiz.
              </p>
            </motion.div>
          </div>
        ) : (
          /* Game view (locks grid) */
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">O‘yin — Savollar</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setGameStarted(false)}>
                  O‘yinni to‘xtatish
                </Button>
                <Button onClick={resetGame}>Boshidan boshlash</Button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
                layout
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.06 },
                  },
                }}
              >
                {questions.map((q) => {
                  const isOpened = openedLocks[q.id] === true;
                  return (
                    <motion.div
                      key={q.id}
                      layout
                      variants={{
                        hidden: { opacity: 0, scale: 0.8, y: 12 },
                        visible: {
                          opacity: 1,
                          scale: 1,
                          y: 0,
                          transition: {
                            type: "spring",
                            stiffness: 220,
                            damping: 20,
                          },
                        },
                      }}
                      className="relative aspect-square flex items-center justify-center"
                    >
                      <motion.button
                        type="button"
                        onClick={() => handleLockClick(q.id)}
                        disabled={isOpened}
                        whileHover={!isOpened ? { scale: 1.06, y: -2 } : {}}
                        whileTap={{ scale: 0.97 }}
                        className="group relative flex flex-col items-center justify-center focus:outline-none"
                      >
                        <motion.div
                          animate={
                            isOpened
                              ? {
                                  scale: [1, 1.12, 1],
                                  rotate: [0, -6, 0],
                                  y: [0, -4, 0],
                                }
                              : { scale: 1, rotate: 0, y: 0 }
                          }
                          transition={
                            isOpened
                              ? { duration: 0.45, ease: "easeOut" }
                              : { type: "spring", stiffness: 260, damping: 18 }
                          }
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="relative">
                            {isOpened && (
                              <motion.div
                                className="absolute inset-0 rounded-3xl bg-emerald-300/60 blur-xl"
                                initial={{ opacity: 0, scale: 0.2 }}
                                animate={{ opacity: 1, scale: 1.4 }}
                                transition={{ duration: 0.4 }}
                              />
                            )}

                            <div
                              className={`relative flex items-center justify-center w-32 h-32 md:w-44 md:h-44 rounded-3xl border-2 shadow-md ${
                                isOpened
                                  ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                                  : "bg-indigo-50 border-edu-blue text-edu-blue group-hover:border-edu-blue"
                              }`}
                            >
                              {isOpened ? (
                                <LockOpen className="size-24 sm:size-32" />
                              ) : (
                                <Lock className="size-24 sm:size-32" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </motion.button>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Dialog (Teacher adjudicates when a lock clicked) */}
        <Dialog
          open={isDialogOpen && !!currentQuestion}
          onOpenChange={(open) => {
            if (!open) {
              setIsDialogOpen(false);
              setAnswerError(null);
              setActiveQuestionId(null);
            }
          }}
        >
          <DialogContent className="max-w-md">
            <AnimatePresence mode="wait">
              {isDialogOpen && currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, scale: 0.6, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6, y: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="space-y-4"
                >
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                      <motion.span
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-base font-bold"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        {currentQuestion
                          ? questions.findIndex(
                              (q) => q.id === currentQuestion.id
                            ) + 1
                          : "?"}
                      </motion.span>
                      Qulf savoli
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-slate-700" />
                  </DialogHeader>

                  <motion.div
                    className="text-2xl p-3 rounded-xl bg-slate-50 border border-slate-100"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-slate-900 font-semibold leading-relaxed">
                      {currentQuestion?.text}
                    </p>
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {answerError && (
                      <motion.div
                        key={answerError}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0, x: [0, -4, 4, -4, 4, 0] }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.4 }}
                        className="mt-1 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm"
                      >
                        {answerError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <DialogFooter className="mt-2 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <motion.div whileTap={{ scale: 0.97 }}>
                        <Button
                          variant="outline"
                          className="w-full border-emerald-500 text-emerald-700 hover:bg-emerald-500 hover:text-white"
                          onClick={() => handleTeacherMark(true)}
                        >
                          ✅ To‘g‘ri
                        </Button>
                      </motion.div>
                      <motion.div whileTap={{ scale: 0.97 }}>
                        <Button
                          variant="outline"
                          className="w-full border-rose-500 text-rose-700 hover:bg-rose-500 hover:text-white"
                          onClick={() => handleTeacherMark(false)}
                        >
                          ❌ Noto‘g‘ri
                        </Button>
                      </motion.div>
                    </div>

                    <Button
                      variant="ghost"
                      className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setAnswerError(null);
                        setActiveQuestionId(null);
                      }}
                    >
                      Bekor qilish
                    </Button>
                  </DialogFooter>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
