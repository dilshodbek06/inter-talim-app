/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle2, ChevronRight, Play, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BackPrev from "@/components/back-prev";
import { DEMO_WORDS } from "@/mock/english";

type LetterTile = {
  id: string;
  char: string;
};

const shuffleArray = <T,>(items: T[]) => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const buildTiles = (word: string) => {
  const letters = word.toUpperCase().split("");
  let tiles = letters.map((char, index) => ({
    id: `${word}-${index}-${char}`,
    char,
  }));

  if (letters.length > 1) {
    let guard = 0;
    while (
      guard < 10 &&
      tiles.map((tile) => tile.char).join("") === letters.join("")
    ) {
      tiles = shuffleArray(tiles);
      guard += 1;
    }
  }

  return tiles;
};

const tileBase =
  "flex h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 items-center justify-center rounded-2xl border-2 bg-white/95 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-700 shadow-[0_6px_0_rgba(234,179,8,0.45)] transition-transform";

const TileBody = ({
  char,
  isDragging,
  solved,
  hinted,
  hintPulse,
}: {
  char: string;
  isDragging?: boolean;
  solved?: boolean;
  hinted?: boolean;
  hintPulse?: number;
}) => (
  <div
    className={`${tileBase} ${
      solved
        ? "border-emerald-300 shadow-[0_6px_0_rgba(16,185,129,0.35)]"
        : "border-amber-200"
    } ${isDragging ? "scale-[1.06] shadow-2xl" : ""} ${
      hinted ? "border-sky-300 shadow-[0_8px_0_rgba(56,189,248,0.35)]" : ""
    }`}
  >
    <span
      key={hinted ? `hint-${hintPulse ?? 0}` : "char"}
      className={hinted ? "inline-block animate-hint-pop" : ""}
    >
      {char}
    </span>
  </div>
);

const SortableTile = ({
  tile,
  disabled,
  solved,
  hinted,
  hintPulse,
}: {
  tile: LetterTile;
  disabled?: boolean;
  solved?: boolean;
  hinted?: boolean;
  hintPulse?: number;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tile.id, disabled });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none select-none cursor-grab active:cursor-grabbing"
    >
      <TileBody
        char={tile.char}
        isDragging={isDragging}
        solved={solved}
        hinted={hinted}
        hintPulse={hintPulse}
      />
    </div>
  );
};

export default function FindEnglishWordPage() {
  const totalRounds = DEMO_WORDS.length;
  const [gameStarted, setGameStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [order, setOrder] = useState<number[]>(() =>
    shuffleArray(DEMO_WORDS.map((_, idx) => idx)),
  );
  const [tiles, setTiles] = useState<LetterTile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const statusTimeoutRef = useRef<number | null>(null);
  const [progress, setProgress] = useState<boolean[]>(() =>
    DEMO_WORDS.map(() => false),
  );
  const [score, setScore] = useState(0);
  const [hintUsedCount, setHintUsedCount] = useState(0);
  const [hintedTileId, setHintedTileId] = useState<string | null>(null);
  const [hintPulse, setHintPulse] = useState(0);
  const hintTimeoutRef = useRef<number | null>(null);
  const maxHints = 3;

  const currentIndex = order[index] ?? 0;
  const current = DEMO_WORDS[currentIndex] ?? DEMO_WORDS[0];
  const solved = progress[index];
  const remainingHints = Math.max(maxHints - hintUsedCount, 0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 6 },
    }),
  );

  useEffect(() => {
    if (!gameStarted) return;
    setTiles(buildTiles(current.word));
    setStatus("idle");
    setActiveId(null);
    setHintedTileId(null);
  }, [current.word, gameStarted, index]);

  useEffect(() => {
    if (status === "idle") return;
    if (statusTimeoutRef.current !== null) {
      window.clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = window.setTimeout(() => {
      setStatus("idle");
      statusTimeoutRef.current = null;
    }, 5000);

    return () => {
      if (statusTimeoutRef.current !== null) {
        window.clearTimeout(statusTimeoutRef.current);
        statusTimeoutRef.current = null;
      }
    };
  }, [status]);

  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current !== null) {
        window.clearTimeout(hintTimeoutRef.current);
        hintTimeoutRef.current = null;
      }
    };
  }, []);

  const resetGame = () => {
    const shuffled = shuffleArray(DEMO_WORDS.map((_, idx) => idx));
    setOrder(shuffled);
    setProgress(DEMO_WORDS.map(() => false));
    setScore(0);
    setIndex(0);
    setStatus("idle");
    setActiveId(null);
    setHintUsedCount(0);
    setHintedTileId(null);
    setHintPulse(0);
    if (hintTimeoutRef.current !== null) {
      window.clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
    setTiles(buildTiles(DEMO_WORDS[shuffled[0]].word));
  };

  const startGame = () => {
    setGameStarted(true);
    resetGame();
  };

  const onDragStart = (event: DragStartEvent) => {
    if (solved) return;
    setActiveId(String(event.active.id));
    setStatus("idle");
  };

  const onDragEnd = (event: DragEndEvent) => {
    if (solved) return;
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = tiles.findIndex((tile) => tile.id === active.id);
    const newIndex = tiles.findIndex((tile) => tile.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    setTiles((prev) => arrayMove(prev, oldIndex, newIndex));
    setStatus("idle");
  };

  const onDragCancel = () => setActiveId(null);

  const triggerHint = () => {
    if (remainingHints <= 0 || solved) return;
    const firstChar = current.word?.[0]?.toUpperCase();
    if (!firstChar) return;
    const preferredId = `${current.word}-0-${firstChar}`;
    const targetTile =
      tiles.find((tile) => tile.id === preferredId) ||
      tiles.find((tile) => tile.char === firstChar);
    if (!targetTile) return;
    setHintUsedCount((prev) => Math.min(prev + 1, maxHints));
    setHintPulse((prev) => prev + 1);
    setHintedTileId(targetTile.id);
    if (hintTimeoutRef.current !== null) {
      window.clearTimeout(hintTimeoutRef.current);
    }
    hintTimeoutRef.current = window.setTimeout(() => {
      setHintedTileId(null);
      hintTimeoutRef.current = null;
    }, 700);
  };

  const checkAnswer = () => {
    const guess = tiles.map((tile) => tile.char).join("");
    const target = current.word.toUpperCase();

    if (guess === target) {
      setStatus("correct");
      if (!progress[index]) {
        setScore((prev) => prev + 1);
        setProgress((prev) => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
      }
      return;
    }

    setStatus("wrong");
  };

  const nextWord = () => {
    if (!solved) return;
    const nextIndex = index + 1 >= totalRounds ? 0 : index + 1;
    setIndex(nextIndex);
  };

  const activeTile = activeId
    ? tiles.find((tile) => tile.id === activeId)
    : null;

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-sky-50 via-blue-50 to-emerald-50 px-4 py-6 text-slate-900">
        <div className="max-w-6xl mx-auto space-y-6">
          <BackPrev />
          <div className="rounded-3xl border border-white/80 bg-white/90 shadow-2xl p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-4">
                <Badge className="rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                  Ingliz tili so‘z o‘yini
                </Badge>
                <div className="rounded-2xl bg-linear-to-r from-sky-500 to-emerald-500 text-white p-5 shadow-lg">
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Ingliz tilidagi so‘zni top
                  </h1>
                  <p className="text-sm sm:text-base text-white/90 mt-2">
                    Harflar aralash holatda chiqadi. Harflar o‘rnini
                    almashtirish orqali to‘g‘ri so‘zni toping.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  {[
                    "Harflarni joyini almashtiring",
                    "Javobingizni tekshiring",
                    "Keyingi so'zga o‘ting",
                  ].map((step) => (
                    <div
                      key={step}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm text-slate-700"
                    >
                      {step}
                    </div>
                  ))}
                </div>

                <Button size="lg" onClick={startGame} className="rounded-xl">
                  <Play className="w-4 h-4 mr-2" />
                  O‘yinni boshlash
                </Button>
              </div>

              <div className="rounded-3xl border border-white/80 bg-linear-to-br from-sky-200 via-white to-emerald-100 p-5 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-full bg-yellow-200/80 shadow-inner" />
                  <div className="h-6 w-20 rounded-full bg-white/80" />
                </div>
                <div className="mt-8 flex justify-center gap-3">
                  {"G A M E".split(" ").map((char) => (
                    <div key={char} className={`${tileBase} border-amber-200`}>
                      {char}
                    </div>
                  ))}
                </div>
                <div className="mt-8 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs text-slate-600 text-center">
                  Drag letters to build the word
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-blue-50 to-emerald-50 px-0 sm:px-4 py-6 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6 w-full">
        <BackPrev />

        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 px-3 sm:px-0">
          <div className="space-y-2">
            <Badge className="rounded-full bg-sky-100 hover:bg-sky-100 text-sky-700 border border-sky-200">
              Round {index + 1} / {totalRounds}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Find English Word
            </h1>
            <p className="text-sm text-slate-600">
              Harflarni to‘g‘ri tartibda joylashtirib so‘zni toping.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Natija: {score}
            </div>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={resetGame}
            >
              <RotateCcw className="w-4 h-4" />
              Qayta boshlash
            </Button>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-none sm:rounded-4xl border border-white/80 bg-linear-to-b from-sky-200 via-sky-50 to-emerald-100 shadow-2xl p-4 sm:p-8 lg:p-14 lg:min-h-[480px]">
          <div className="absolute -top-6 -left-6 h-28 w-28 rounded-full bg-yellow-200/80 blur-[1px]" />
          <div className="absolute top-10 right-10 h-8 w-20 rounded-full bg-white/80 shadow-sm" />
          <div className="absolute top-14 right-28 h-6 w-16 rounded-full bg-white/70" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-r from-emerald-200 via-lime-200 to-emerald-200 opacity-90" />

          <div className="relative z-10 space-y-6">
            <div className="rounded-2xl bg-white/70 border border-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  Yordam: <span className="font-semibold">{current.hint}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={triggerHint}
                  disabled={remainingHints <= 0 || solved}
                  className="rounded-xl sm:rounded-full"
                >
                  Yordam olish ({remainingHints}/{maxHints})
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 sm:mt-10 pb-6 sm:pb-0">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragCancel={onDragCancel}
              >
                <SortableContext
                  items={tiles.map((tile) => tile.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {tiles.map((tile) => (
                    <SortableTile
                      key={tile.id}
                      tile={tile}
                      disabled={solved}
                      solved={solved}
                      hinted={tile.id === hintedTileId}
                      hintPulse={hintPulse}
                    />
                  ))}
                </SortableContext>
                <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
                  {activeTile ? (
                    <div className="cursor-grabbing">
                      <TileBody char={activeTile.char} isDragging />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>

            <div className="mt-8 mb-2 flex items-center justify-center gap-4">
              <Button
                onClick={checkAnswer}
                disabled={solved}
                className="h-12 px-7 rounded-full text-base font-semibold text-white bg-linear-to-r from-emerald-500 to-emerald-600 shadow-[0_1px_0_rgba(16,185,129,0.35)] hover:brightness-105 disabled:opacity-60"
              >
                <CheckCircle2 className="w-5 h-5" />
                Tekshirish
              </Button>

              <Button
                onClick={nextWord}
                disabled={!solved}
                className="h-12 px-7 rounded-full text-base font-semibold bg-white/90 border border-white/80 text-slate-700 shadow-[0_1px_0_rgba(148,163,184,0.35)] hover:bg-white"
              >
                Keyingi savol
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {status === "wrong" ? (
          <div className="flex justify-center">
            <div className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
              Noto‘g‘ri, qayta urinib ko‘ring
            </div>
          </div>
        ) : null}

        {status === "correct" ? (
          <div className="flex justify-center">
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-md">
              Ajoyib! To‘g‘ri javob!
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
