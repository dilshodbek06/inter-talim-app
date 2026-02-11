"use client";

import React, { useState, useEffect, useRef, useMemo, JSX } from "react";
import {
  HelpCircle,
  Users,
  Zap,
  ChevronRight,
  Timer,
  Plus,
  Play,
  Trophy,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackPrev from "@/components/back-prev";
import toast from "react-hot-toast";
import { useExitGuard } from "@/hooks/use-exit-guard";
import { useFeedbackSounds } from "@/hooks/use-feedback-sounds";

const motion = {
  div: ({
    children,
    ...rest
  }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) => {
    const clean = { ...rest };
    [
      "initial",
      "animate",
      "exit",
      "transition",
      "variants",
      "whileHover",
      "whileTap",
      "layout",
    ].forEach((key) => delete (clean as Record<string, unknown>)[key]);
    return <div {...clean}>{children}</div>;
  },
  button: ({
    children,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement> &
    Record<string, unknown>) => {
    const clean = { ...rest };
    [
      "whileHover",
      "whileTap",
      "initial",
      "animate",
      "transition",
      "exit",
    ].forEach((key) => delete (clean as Record<string, unknown>)[key]);
    return <button {...clean}>{children}</button>;
  },
  span: ({
    children,
    ...rest
  }: React.HTMLAttributes<HTMLSpanElement> & Record<string, unknown>) => {
    const clean = { ...rest };
    [
      "whileHover",
      "whileTap",
      "initial",
      "animate",
      "transition",
      "exit",
    ].forEach((key) => delete (clean as Record<string, unknown>)[key]);
    return <span {...clean}>{children}</span>;
  },
  p: ({
    children,
    ...rest
  }: React.HTMLAttributes<HTMLParagraphElement> & Record<string, unknown>) => {
    const clean = { ...rest };
    [
      "whileHover",
      "whileTap",
      "initial",
      "animate",
      "transition",
      "exit",
    ].forEach((key) => delete (clean as Record<string, unknown>)[key]);
    return <p {...clean}>{children}</p>;
  },
};

const AnimatePresence = ({
  children,
}: { children: React.ReactNode } & Record<string, unknown>) => <>{children}</>;

type Question = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
};

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Dunyoning eng katta okeani qaysi?",
    options: ["Atlantika", "Hind", "Tinch", "Shimoliy Muz"],
    correctIndex: 2,
  },
  {
    id: 2,
    text: "O'zbekiston davlat bayrog'ida nechta rang bor?",
    options: ["2", "3", "4", "5"],
    correctIndex: 2,
  },
  {
    id: 3,
    text: "O'zbekiston qaysi qit'ada joylashgan?",
    options: ["Yevropa", "Osiyo", "Afrika", "Avstraliya"],
    correctIndex: 1,
  },
  {
    id: 4,
    text: "Quyidagilardan qaysi biri meva?",
    options: ["Sabzi", "Olma", "Kartoshka", "Piyoz"],
    correctIndex: 1,
  },
  {
    id: 5,
    text: "Yer yuzidagi eng baland tog‘ cho‘qqisi qaysi?",
    options: ["Everest", "Kilimanjaro", "Elbrus", "Monblan"],
    correctIndex: 0,
  },
  {
    id: 6,
    text: "Nil daryosi asosan qaysi qit'ada oqadi?",
    options: ["Janubiy Amerika", "Afrika", "Yevropa", "Osiyo"],
    correctIndex: 1,
  },
  {
    id: 7,
    text: "Quyidagi gaplarda qaysi birida ot bor?",
    options: ["U yugurdi", "Men kitob o‘qidim", "U tez keldi", "Biz sevinamiz"],
    correctIndex: 1,
  },
  {
    id: 8,
    text: "Ekvator chizig‘i qaysi mamlakat hududidan o‘tadi?",
    options: ["Kanada", "Keniya", "Italiya", "Marokash"],
    correctIndex: 1,
  },
  {
    id: 9,
    text: "Quyidagi elementlardan qaysi biri metall hisoblanadi?",
    options: ["Kislorod", "Temir", "Uglerod", "Azot"],
    correctIndex: 1,
  },
  {
    id: 10,
    text: "Qaysi dengiz Yevropa va Afrika qit'alari orasida joylashgan?",
    options: [
      "Qora dengiz",
      "Qizil dengiz",
      "O‘rta yer dengizi",
      "Kaspiy dengizi",
    ],
    correctIndex: 2,
  },
];

const PRIZE_START = 1000;
const PRIZE_STEP = 500;
const ROUND_TIME = 30;
type Phase = "intro" | "game" | "results";

const formatSom = (value: number): string =>
  `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} so‘m`;

export default function MillionerLivePreview(): JSX.Element {
  const [phase, setPhase] = useState<Phase>("intro");
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const questions =
    customQuestions.length > 0 ? customQuestions : DEFAULT_QUESTIONS;
  const prizeValues = useMemo(() => {
    const length = Math.max(1, questions.length);
    return Array.from({ length }, (_, i) => PRIZE_START + i * PRIZE_STEP);
  }, [questions.length]);
  const moneyLadder = useMemo(
    () => prizeValues.map((value) => formatSom(value)),
    [prizeValues]
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [locked, setLocked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [used5050, setUsed5050] = useState<boolean>(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [usedAudience, setUsedAudience] = useState<boolean>(false);
  const [audienceVotes, setAudienceVotes] = useState<number[]>([]);
  const [usedFriendCall, setUsedFriendCall] = useState<boolean>(false);
  const [showFriendModal, setShowFriendModal] = useState<boolean>(false);

  const [time, setTime] = useState<number>(ROUND_TIME);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [totalWinnings, setTotalWinnings] = useState<number>(0);
  const [playerName, setPlayerName] = useState<string>("");
  const [correctCount, setCorrectCount] = useState<number>(0);

  const [newQuestionText, setNewQuestionText] = useState<string>("");
  const [newOptions, setNewOptions] = useState<string[]>(["", "", "", ""]);
  const [newCorrectIndex, setNewCorrectIndex] = useState<number>(0);

  const { back: handleBack } = useExitGuard({ enabled: phase === "game" });
  const { playSuccess, playError } = useFeedbackSounds();

  const tickRef = useRef<HTMLAudioElement | null>(null);
  const timerIdRef = useRef<number | null>(null);

  const q = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const tick = new Audio(
      "https://actions.google.com/sounds/v1/ambiences/clock_ticking.ogg"
    );
    tick.volume = 0.4;
    tick.loop = true;
    tickRef.current = tick;

  }, []);

  // TIMER: runs only in game phase and when not locked
  useEffect(() => {
    // clear any previous timer
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }

    if (phase !== "game") return;
    if (locked) {
      // when locked (after answer) stop ticking sound
      if (tickRef.current) {
        try {
          tickRef.current.pause();
          tickRef.current.currentTime = 0;
        } catch {}
      }
      return;
    }

    // start interval when unlocked
    timerIdRef.current = window.setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          // Time expired -> lock, mark incorrect, play error sound, then show results
          if (timerIdRef.current) {
            clearInterval(timerIdRef.current);
            timerIdRef.current = null;
          }

          setLocked(true);
          setIsCorrect(false);

          if (tickRef.current) {
            try {
              tickRef.current.pause();
              tickRef.current.currentTime = 0;
            } catch {}
          }

          if (soundEnabled) playError();

          // small delay so user sees "vaqt tugadi" message briefly
          window.setTimeout(() => {
            setPhase("results");
          }, 600);

          return 0;
        }

        // play tick (optional) — only when soundEnabled and not already playing
        if (soundEnabled && tickRef.current) {
          try {
            // play once (tickRef is looped) — avoid resetting every second
            if (tickRef.current.paused) {
              tickRef.current.play().catch(() => {});
            }
          } catch {
            // ignore
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [locked, soundEnabled, phase, playError]);

  // Handle answer click
  const handleAnswer = (idx: number) => {
    if (locked || phase !== "game") return;

    if (!soundEnabled) setSoundEnabled(true);

    setSelectedIndex(idx);
    setLocked(true);

    const correct = idx === q.correctIndex;
    setIsCorrect(correct);

    // stop ticking sound immediately when answer chosen
    if (tickRef.current) {
      try {
        tickRef.current.pause();
        tickRef.current.currentTime = 0;
      } catch {}
    }

    if (correct) {
      const prizeIndex = Math.min(currentIndex, prizeValues.length - 1);
      setTotalWinnings(prizeValues[prizeIndex]);
      setCorrectCount((prev) => prev + 1);

      playSuccess();

      // IMPORTANT: do NOT auto-advance. Wait for user to press "Keyingi savol".
      // Keep locked = true and show success message; user clicks Next to continue.
    } else {
      // incorrect: play error, then go to results after short delay
      playError();

      window.setTimeout(() => {
        setPhase("results");
      }, 600);
    }
  };

  const handleNextQuestion = () => {
    // Backward compatibility: keep existing logic but it's now unused for wrong/time-out
    if (!locked || phase !== "game") return;
    if (isCorrect !== true) return;

    if (isLastQuestion) {
      setPhase("results");
      return;
    }

    setCurrentIndex((i) => i + 1);
    setSelectedIndex(null);
    setIsCorrect(null);
    setHiddenOptions([]);
    setAudienceVotes([]);
    setLocked(false);
    setTime(ROUND_TIME);
  };

  const handle5050 = () => {
    if (used5050 || locked || phase !== "game") return;
    setUsed5050(true);
    const wrongIndexes = q.options
      .map((_, i) => i)
      .filter((i) => i !== q.correctIndex);
    const shuffled = [...wrongIndexes].sort(() => Math.random() - 0.5);
    const toHide = shuffled.slice(0, 2);
    setHiddenOptions(toHide);
  };

  const handleAudience = () => {
    if (usedAudience || locked || phase !== "game") return;
    setUsedAudience(true);
    const votes = q.options.map((_, i) =>
      i === q.correctIndex
        ? 40 + Math.floor(Math.random() * 30)
        : 5 + Math.floor(Math.random() * 15)
    );
    const sum = votes.reduce((a, b) => a + b, 0);
    const normalized = votes.map((v) => Math.round((v / sum) * 100));
    const diff = 100 - normalized.reduce((a, b) => a + b, 0);
    if (diff !== 0) {
      const maxIdx = votes.indexOf(Math.max(...votes));
      normalized[maxIdx] = Math.max(0, normalized[maxIdx] + diff);
    }
    setAudienceVotes(normalized);
  };

  const handleFriendCall = () => {
    if (usedFriendCall || locked || phase !== "game") return;
    setUsedFriendCall(true);
    setShowFriendModal(true);
  };

  const getOptionClasses = (idx: number): string => {
    const base =
      "w-full text-left px-4 py-3 rounded-xl border transition-all text-sm sm:text-base flex items-center justify-between gap-4";

    if (hiddenOptions.includes(idx))
      return base + " opacity-0 pointer-events-none";

    if (selectedIndex === null) {
      return (
        base +
        " border-slate-200 bg-white/90 hover:bg-sky-50 hover:border-sky-400 text-slate-900 shadow-sm"
      );
    }

    const isThisCorrect = idx === q.correctIndex;
    const isThisSelected = idx === selectedIndex;

    if (isThisCorrect && isThisSelected)
      return (
        base +
        " border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md scale-[1.01]"
      );
    if (isThisCorrect)
      return (
        base + " border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm"
      );
    if (isThisSelected && !isCorrect)
      return base + " border-rose-500 bg-rose-50 text-rose-700 shadow-md";

    return base + " border-slate-200 bg-white/90 text-slate-900";
  };

  const currentPrizeIndex = Math.min(currentIndex, moneyLadder.length - 1);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    if (newOptions.some((opt) => !opt.trim())) return;
    const newQ: Question = {
      id: Date.now(),
      text: newQuestionText.trim(),
      options: [...newOptions],
      correctIndex: newCorrectIndex,
    };
    setCustomQuestions((prev) => [...prev, newQ]);
    setNewQuestionText("");
    setNewOptions(["", "", "", ""]);
    setNewCorrectIndex(0);
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      toast.error("Ishtirokchi ismini kiriting");
      return;
    }
    setPhase("game");
    setCurrentIndex(0);
    setSelectedIndex(null);
    setIsCorrect(null);
    setHiddenOptions([]);
    setAudienceVotes([]);
    setLocked(false);
    setTime(ROUND_TIME);
    setUsed5050(false);
    setUsedAudience(false);
    setUsedFriendCall(false);
    setShowFriendModal(false);
    setTotalWinnings(0);
    setCorrectCount(0);
  };

  const resetToIntro = () => {
    if (tickRef.current) {
      try {
        tickRef.current.pause();
        tickRef.current.currentTime = 0;
      } catch {}
    }
    setPhase("intro");
    setCurrentIndex(0);
    setSelectedIndex(null);
    setIsCorrect(null);
    setHiddenOptions([]);
    setAudienceVotes([]);
    setLocked(false);
    setTime(ROUND_TIME);
    setUsed5050(false);
    setUsedAudience(false);
    setUsedFriendCall(false);
    setShowFriendModal(false);
    setTotalWinnings(0);
    setCorrectCount(0);
    setSoundEnabled(false);
  };

  /* ------------ INTRO EKRAN ------------ */
  if (phase === "intro") {
    return (
      <motion.div className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50  px-4 py-8 text-slate-900">
        {/* Global header */}
        <BackPrev onBack={handleBack} />
        <motion.div
          className="text-center flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 px-4 py-1 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              Millioner o‘yini
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
            Millioner – Yutuqli o‘yin
          </h1>
          <p className="text-slate-600 max-w-2xl">
            Ustoz savollarni tayyorlaydi, o‘quvchi esa har bir savolga{" "}
            {ROUND_TIME} soniya ichida javob berib, mukofot zinapoyasida
            yuqoriga ko‘tarilib boradi.
          </p>
        </motion.div>
        <motion.div
          className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 flex items-center justify-center py-8 text-slate-900"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="w-full max-w-6xl space-y-6"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            {/* Yuqori qism: qoidalar + o‘qituvchi formasi */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Qoidalar */}
              <motion.div
                className="bg-white/90 border border-white/60 rounded-2xl p-5 shadow-xl"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-xl font-bold mb-3">
                  🎮 “Millioner” o‘yini – Qoidalar
                </h2>
                <ul className="space-y-2 text-sm sm:text-base text-slate-700">
                  <li>• Har bir savol uchun 30 soniya vaqt beriladi.</li>
                  <li>
                    • To‘g‘ri javob bersa – mukofot zinapoyasi bo‘yicha yutuq
                    oshadi.
                  </li>
                  <li>• Noto‘g‘ri javob yoki vaqt tugasa – savol yopiladi.</li>
                  <li>
                    • 50:50 va “Zal yordami” yordamlaridan bir marta foydalanish
                    mumkin.
                  </li>
                  <li>
                    • O‘qituvchi o‘z fanidan savollar qo‘shib, testni
                    moslashtirishi mumkin.
                  </li>
                </ul>
                <p className="mt-4 text-xs text-slate-500">
                  Tayyor savollar soni: {DEFAULT_QUESTIONS.length} ta. Agar
                  o‘qituvchi yangi savollar kiritsa, o‘yin ularga asoslanadi.
                </p>
              </motion.div>

              {/* O‘qituvchi uchun test formasi */}
              <motion.div
                className="bg-white/90 border border-white/60 rounded-2xl p-5 shadow-xl flex flex-col gap-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-xl font-bold mb-2">
                  👩‍🏫 O‘qituvchi uchun test
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mb-2">
                  O‘zingizning savollaringizni kiriting. To‘ldirilgan savollar
                  o‘yinda ishlatiladi.
                </p>
                <form onSubmit={handleAddQuestion} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500">
                      Savol matni
                    </label>
                    <textarea
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 resize-none"
                      rows={3}
                      placeholder="Masalan: 7 × 6 necha bo‘ladi?"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {newOptions.map((opt, idx) => (
                      <div key={idx}>
                        <label className="text-[11px] font-medium text-slate-500">
                          Variant {String.fromCharCode(65 + idx)}
                        </label>
                        <input
                          value={opt}
                          onChange={(e) =>
                            setNewOptions((prev) =>
                              prev.map((p, i) =>
                                i === idx ? e.target.value : p
                              )
                            )
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                          placeholder={`Variant ${String.fromCharCode(
                            65 + idx
                          )}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-slate-600">To‘g‘ri javob:</span>
                    <select
                      value={newCorrectIndex}
                      onChange={(e) =>
                        setNewCorrectIndex(Number(e.target.value))
                      }
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value={0}>A</option>
                      <option value={1}>B</option>
                      <option value={2}>C</option>
                      <option value={3}>D</option>
                    </select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full mt-1 rounded-xl text-white text-sm font-semibold py-2 transition-all shadow-md"
                  >
                    <Plus className="size-4 mr-1" /> Savolni qo‘shish
                  </Button>
                </form>
                <p className="text-xs text-slate-500 mt-1">
                  Hozircha qo‘shilgan savollar:{" "}
                  <span className="font-semibold">
                    {customQuestions.length}
                  </span>{" "}
                  ta
                </p>
              </motion.div>
            </div>

            {/* Pastki qism: qatnashuvchi ismi va start */}
            <motion.div
              className="bg-white/90 border border-white/60 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-sm sm:text-base text-slate-700">
                <p className="font-semibold mb-1">
                  🎓 Qatnashuvchi o‘quvchini tanlang
                </p>
                <p className="text-xs sm:text-sm text-slate-500">
                  O‘quvchi ismini kiriting va o‘yinni boshlang. Jami savollar:{" "}
                  <span className="font-semibold">{questions.length}</span> ta.
                </p>
              </div>
              <form
                onSubmit={handleStartGame}
                className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 sm:items-center"
              >
                <input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                  placeholder="O‘quvchi ismi (masalan: Zikrillo)"
                />
                <Button
                  type="submit"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-600/90 text-white text-sm font-semibold px-4 py-2.5 inline-flex items-center transition-all shadow-md"
                >
                  <Play className="size-4 mr-1" /> O‘yinni boshlash
                </Button>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  /* ------------ NATIJALAR EKRANI ------------ */
  if (phase === "results") {
    return (
      <motion.div
        className="md:mt-3 flex items-center justify-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-full max-w-xl bg-white/95 border border-white/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
              <Trophy className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tabriklaymiz{playerName ? `, ${playerName}` : ""}! 🎉
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            “Millioner” o‘yinini yakunladingiz. Quyida natijalaringiz:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm sm:text-base">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
              <p className="text-xs text-slate-500 mb-1">Jami savollar</p>
              <p className="text-xl font-bold text-slate-900">
                {questions.length}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
              <p className="text-xs text-emerald-600 mb-1">To‘g‘ri javoblar</p>
              <p className="text-xl font-bold text-emerald-700">
                {correctCount}
              </p>
            </div>
            <div className="rounded-2xl bg-indigo-50 border border-indigo-100 px-4 py-3">
              <p className="text-xs text-indigo-600 mb-1">Jami yutuq</p>
              <p className="text-xl font-bold text-indigo-700">
                {formatSom(totalWinnings)}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-500">
            O‘qituvchi o‘yin davomida savollarni tahlil qilib, keyingi darslar
            uchun xulosalar qilishi mumkin.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
            <Button
              variant="outline"
              onClick={resetToIntro}
              className="rounded-xl border-slate-200 text-slate-700 bg-white hover:bg-gray-50 hover:text-black"
            >
              🔁 Yangi o‘yin (yangi o‘quvchi)
            </Button>
            <Button
              onClick={() => {
                // faqat o‘yinni qayta boshlash, introga bormay
                setPhase("game");
                setCurrentIndex(0);
                setSelectedIndex(null);
                setIsCorrect(null);
                setHiddenOptions([]);
                setAudienceVotes([]);
                setLocked(false);
                setTime(ROUND_TIME);
                setUsed5050(false);
                setUsedAudience(false);
                setUsedFriendCall(false);
                setShowFriendModal(false);
                setTotalWinnings(0);
                setCorrectCount(0);
              }}
              className="rounded-xl bg-edu-blue hover:bg-edu-blue/80 text-white shadow-md"
            >
              ▶️ Yana o‘ynash (shu savollar bilan)
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  /* ------------ GAME EKRAN ------------ */
  return (
    <motion.div
      className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 flex items-center justify-center px-4 py-8 text-slate-900"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {showFriendModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowFriendModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-5 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xl">
              📞
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Do‘stga qo‘ng‘iroq
            </h3>
            <p className="text-sm text-slate-600">
              Darsda istalgan do‘stingizdan so‘rashingiz mumkin
            </p>
            <button
              type="button"
              onClick={() => setShowFriendModal(false)}
              className="w-full rounded-xl bg-amber-500 text-white text-sm font-semibold py-2 hover:bg-amber-500/90 transition-all"
            >
              Tushunarli, yopish
            </button>
          </div>
        </div>
      )}
      <motion.div
        className="w-full max-w-6xl flex flex-col lg:flex-row gap-6"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
      >
        {/* LEFT COLUMN: Yordamlar + Mukofot zinapoyasi */}
        <div className="w-full lg:w-72 space-y-4">
          {/* Yordamlar */}
          <motion.div
            className="bg-white/90 border border-white/60 rounded-2xl p-4 shadow-xl"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-900">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              Yordamlar
            </h2>
            <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
              <motion.button
                type="button"
                onClick={handle5050}
                disabled={used5050}
                whileTap={!used5050 ? { scale: 0.96 } : {}}
                className={`flex items-center justify-center rounded-xl px-3 py-2 border transition-all ${
                  used5050
                    ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "border-sky-400 bg-sky-50 text-sky-700 hover:bg-sky-100 shadow-sm"
                }`}
              >
                50:50
              </motion.button>
              <motion.button
                type="button"
                onClick={handleAudience}
                disabled={usedAudience}
                whileTap={!usedAudience ? { scale: 0.96 } : {}}
                className={`flex items-center justify-center gap-1 rounded-xl px-3 py-2 border transition-all ${
                  usedAudience
                    ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-sm"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Zal yordami</span>
              </motion.button>
              <motion.button
                type="button"
                onClick={handleFriendCall}
                disabled={usedFriendCall}
                whileTap={!usedFriendCall ? { scale: 0.96 } : {}}
                className={`flex items-center justify-center rounded-xl px-3 py-2 border transition-all text-[11px] ${
                  usedFriendCall
                    ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 shadow-sm"
                }`}
              >
                Do‘stga qo‘ng‘iroq
              </motion.button>
            </div>
          </motion.div>

          {/* Mukofot zinapoyasi */}
          <motion.div
            className="bg-white/90 border border-white/60 rounded-2xl p-4 shadow-xl flex flex-col max-h-[432px]"
            initial={{ opacity: 0, x: -10, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="flex items-center justify-between mb-3 text-xs sm:text-sm text-slate-500 ">
              <h2 className="font-semibold flex items-center gap-2 text-slate-900">
                <ChevronRight className="w-4 h-4 text-emerald-500" />
                Mukofot zinapoyasi
              </h2>
              <span>
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
            <div className="space-y-1  pr-1 text-xs sm:text-sm">
              {moneyLadder.map((amount, idx) => ({ amount, idx }))
                .reverse()
                .map(({ amount, idx }) => {
                  const originalIndex = idx;
                  const isActive = originalIndex === currentPrizeIndex;

                  return (
                    <motion.div
                      key={amount}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg border ${
                        isActive
                          ? "border-sky-400 bg-linear-to-r from-sky-400 to-indigo-500 text-white shadow-sm"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className="font-medium">{originalIndex + 1}</span>
                      <span className="font-semibold">{amount}</span>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: BARCHASI BITTA CARD ICHIDA */}
        <motion.div
          className="flex-1 bg-white/90 border border-white/60 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-linear-to-tr from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  Savol {currentIndex + 1}/{questions.length}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Mukofot: {moneyLadder[currentPrizeIndex]}
                </p>
                {playerName && (
                  <p className="text-xs text-slate-500 mt-1">
                    O‘yinchi:{" "}
                    <span className="font-semibold">{playerName}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end text-xs text-slate-500 gap-0.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 bg-slate-50">
                <Timer className="w-3 h-3" /> {time}s
              </span>
              <span>
                Jami:{" "}
                <span className="font-semibold">
                  {formatSom(totalWinnings)}
                </span>
              </span>
              <span>Sovg‘alar: 0</span>
            </div>
          </div>

          {/* Savol + Variantlar (animatsiya bilan) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="space-y-4"
            >
              {/* Savol matni */}
              <div className="rounded-xl bg-slate-50/80 border border-slate-100 px-4 py-3">
                <p className="text-xs sm:text-sm text-slate-400 mb-1">
                  Savol matni
                </p>
                <p className="text-lg sm:text-xl font-semibold text-slate-900">
                  {q.text}
                </p>
              </div>

              {/* Variantlar */}
              <div className="space-y-3">
                {q.options.map((opt, idx) => {
                  const letter = ["A", "B", "C", "D"][idx] ?? "?";
                  return (
                    <motion.button
                      key={idx}
                      type="button"
                      className={getOptionClasses(idx)}
                      onClick={() => handleAnswer(idx)}
                      disabled={locked}
                      whileTap={!locked ? { scale: 0.97 } : {}}
                      whileHover={
                        !locked && !hiddenOptions.includes(idx)
                          ? { y: -2 }
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-xs font-semibold bg-slate-50">
                          {letter}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {audienceVotes.length > 0 && (
                        <span className="text-xs text-slate-500">
                          {audienceVotes[idx] ?? 0}%
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Pastki qism: natija + Keyingi savol / Natijani ko‘rish tugmasi */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 text-sm mt-1">
            {/* <AnimatePresence>
              {isCorrect !== null && (
                <motion.div
                  className="text-sm"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  {isCorrect ? (
                    <p className="text-emerald-600 font-medium">
                      ✅ To‘g‘ri!{" "}
                      {isLastQuestion
                        ? "Natijalarni ko‘rish uchun tugmani bosing."
                        : "Keyingi savolga o‘tish uchun tugmani bosing."}
                    </p>
                  ) : time === 0 ? (
                    <p className="text-rose-600 font-medium">
                      ⏰ Vaqt tugadi.{" "}
                      {isLastQuestion
                        ? "Natijalarni ko‘rish uchun tugmani bosing."
                        : "Keyingi savolga o‘tish mumkin."}
                    </p>
                  ) : (
                    <p className="text-rose-600 font-medium">
                      ❌ Noto‘g‘ri javob.{" "}
                      {isLastQuestion
                        ? "Natijalarni ko‘rish uchun tugmani bosing."
                        : "Keyingi savolga o‘tish mumkin."}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence> */}

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={resetToIntro}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs sm:text-sm hover:bg-slate-50"
              >
                Tark etish
              </button>
              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={!locked || isCorrect !== true}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all ${
                  !locked || isCorrect !== true
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-edu-blue text-white hover:bg-edu-blue/80"
                }`}
              >
                {isLastQuestion ? "Natijani ko‘rish ▸" : "Keyingi savol ▸"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
