"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RefreshCcw, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BackPrev from "@/components/back-prev";

type Item = {
  id: string;
  sentence: string;
  tokens: string[];
  hint?: string;
};

type Props = {
  title?: string;
  items?: Item[];
};

const DEFAULT_ITEMS: Item[] = [
  {
    id: "hello",
    sentence: "How old are you?",
    tokens: ["HOW", "OLD", "ARE", "YOU", "?"],
  },
  {
    id: "school",
    sentence: "I go to school every morning.",
    tokens: ["I", "GO", "TO", "SCHOOL", "EVERY", "MORNING", "."],
  },
];

const BRIGHT_COLORS = [
  "bg-sky-400",
  "bg-pink-500",
  "bg-yellow-400",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-indigo-500",
];

function colorFor(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++)
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  const idx = Math.abs(hash) % BRIGHT_COLORS.length;
  return BRIGHT_COLORS[idx];
}

type Token = { id: string; text: string };

// ---------- UI pieces ----------
function PuzzleChip({
  id,
  text,
  disabled,
  isResultArea,
  onQuickClick,
}: {
  id: string;
  text: string;
  disabled?: boolean;
  isResultArea?: boolean;
  onQuickClick?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 60 : 10,
  };

  const chipColor = colorFor(text);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!isDragging && onQuickClick) onQuickClick();
      }}
      className={`
        relative select-none cursor-grab active:cursor-grabbing group
        ${isDragging ? "opacity-70 scale-[1.03]" : "opacity-100"}
        transition-all duration-150
      `}
    >
      <div
        className={`
          ${chipColor} shadow-md
          px-6 py-4 min-w-[100px] flex items-center justify-center
          font-black text-white text-xl rounded-lg relative
        `}
      >
        {/* Plug */}
        <div
          className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${chipColor} z-20`}
        />
        {/* Socket */}
        <div
          className={`absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${
            isResultArea ? "bg-white" : "bg-slate-100"
          } z-10 shadow-inner`}
        />
        <span className="drop-shadow-sm pointer-events-none uppercase tracking-wider">
          {text}
        </span>
      </div>
    </div>
  );
}

function DroppableBank({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: "bank-area" });
  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3
        transition-all
        ${isOver ? "ring-2 ring-sky-300" : ""}
      `}
    >
      {children}
    </div>
  );
}

function Slot({
  id,
  filled,
  children,
}: {
  id: string;
  filled: boolean;
  children?: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="relative">
      <div
        ref={setNodeRef}
        className={`
          h-16 w-full min-w-[120px]
          rounded-2xl border-2 border-dashed
          ${
            filled
              ? "border-transparent bg-transparent"
              : "border-slate-200 bg-slate-50/50"
          }
          ${isOver ? "ring-2 ring-indigo-300 bg-white" : ""}
          transition-all
        `}
      />
      {children ? <div className="absolute inset-0 p-2">{children}</div> : null}
    </div>
  );
}

// ---------- Game ----------
export default function WordOrderGame({ title = "Word Order", items }: Props) {
  const sourceItems = useMemo(
    () => (items?.length ? items : DEFAULT_ITEMS),
    [items]
  );
  const [gameItems, setGameItems] = useState<Item[]>(sourceItems);

  useEffect(() => {
    setGameItems(sourceItems);
  }, [sourceItems]);

  const [index, setIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const current = gameItems[index] ?? gameItems[0];

  useEffect(() => {
    if (index > gameItems.length - 1 && gameItems.length > 0) setIndex(0);
  }, [index, gameItems.length]);

  const initialTokens: Token[] = useMemo(() => {
    if (!current) return [];
    return current.tokens.map((t, i) => ({
      id: `${current.id}-t${i}-${t}`,
      text: t,
    }));
  }, [current]);

  // Bank: token ids that are not used
  const [bank, setBank] = useState<string[]>([]);
  // Answer: fixed slots, each slot holds token id or null
  const [answerSlots, setAnswerSlots] = useState<(string | null)[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [status, setStatus] = useState<"correct" | "wrong" | null>(null);

  const [sentenceInput, setSentenceInput] = useState("");
  const [tokensInput, setTokensInput] = useState("");
  const [hintInput, setHintInput] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 6 },
    })
  );

  function shuffle<T>(arr: T[]) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function resetRound() {
    const ids = initialTokens.map((t) => t.id);
    setBank(shuffle(ids));
    setAnswerSlots(Array(ids.length).fill(null));
    setStatus(null);
    setActiveId(null);
  }

  useEffect(() => {
    if (gameStarted) resetRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, gameStarted, initialTokens.length]);

  // Helpers
  const tokenTextById = (id: string) =>
    initialTokens.find((t) => t.id === id)?.text || "";

  const findSlotIndexOfToken = (tokenId: string) =>
    answerSlots.findIndex((x) => x === tokenId);

  const isSlotId = (id: string) => id.startsWith("slot-");
  const slotIndexFromId = (id: string) => Number(id.replace("slot-", ""));

  const removeFromBank = (id: string) =>
    setBank((prev) => prev.filter((x) => x !== id));
  const addToBank = (id: string) => setBank((prev) => [...prev, id]);

  const removeFromSlot = (slotIndex: number) =>
    setAnswerSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });

  const placeInSlot = (tokenId: string, slotIndex: number) =>
    setAnswerSlots((prev) => {
      const next = [...prev];

      // If token already in another slot, clear it first
      const fromIndex = next.findIndex((x) => x === tokenId);
      if (fromIndex !== -1) next[fromIndex] = null;

      next[slotIndex] = tokenId;
      return next;
    });

  const swapSlots = (a: number, b: number) =>
    setAnswerSlots((prev) => {
      const next = [...prev];
      const tmp = next[a];
      next[a] = next[b];
      next[b] = tmp;
      return next;
    });

  // Quick click (optional)
  const quickAdd = (tokenId: string) => {
    const firstEmpty = answerSlots.findIndex((x) => x === null);
    if (firstEmpty === -1) return;
    removeFromBank(tokenId);
    placeInSlot(tokenId, firstEmpty);
    setStatus(null);
  };

  const quickRemove = (tokenId: string) => {
    const slotIdx = findSlotIndexOfToken(tokenId);
    if (slotIdx === -1) return;
    removeFromSlot(slotIdx);
    addToBank(tokenId);
    setStatus(null);
  };

  // DnD
  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const activeTokenId = String(active.id);
    const overId = String(over.id);

    setStatus(null);

    const activeInBank = bank.includes(activeTokenId);
    const activeSlotIndex = findSlotIndexOfToken(activeTokenId);
    const activeInAnswer = activeSlotIndex !== -1;

    // 1) Dropped onto bank area => move to bank
    if (overId === "bank-area") {
      if (activeInAnswer) {
        removeFromSlot(activeSlotIndex);
        addToBank(activeTokenId);
      }
      return;
    }

    // 2) Dropped onto a slot (empty/filled)
    if (isSlotId(overId)) {
      const toIndex = slotIndexFromId(overId);
      const occupying = answerSlots[toIndex];

      if (activeInBank) {
        // from bank to slot
        removeFromBank(activeTokenId);

        if (occupying) {
          // kick occupying back to bank
          addToBank(occupying);
        }

        placeInSlot(activeTokenId, toIndex);
        return;
      }

      if (activeInAnswer) {
        // from slot to slot => swap/move
        if (activeSlotIndex === toIndex) return;

        if (occupying) {
          // swap
          swapSlots(activeSlotIndex, toIndex);
        } else {
          // move
          removeFromSlot(activeSlotIndex);
          placeInSlot(activeTokenId, toIndex);
        }
        return;
      }

      return;
    }

    // 3) Dropped onto another chip => treat as slot swap/move if target is in answer
    const overSlotIndex = findSlotIndexOfToken(overId);
    if (overSlotIndex !== -1) {
      if (activeInBank) {
        // bank chip dropped on answer chip => replace that slot
        removeFromBank(activeTokenId);
        const occupying = answerSlots[overSlotIndex];
        if (occupying) addToBank(occupying);
        placeInSlot(activeTokenId, overSlotIndex);
        return;
      }

      if (activeInAnswer) {
        // swap positions in answer
        if (activeSlotIndex === overSlotIndex) return;
        swapSlots(activeSlotIndex, overSlotIndex);
        return;
      }
    }
  }

  const check = () => {
    const userTokens = answerSlots
      .filter(Boolean)
      .map((id) => tokenTextById(id as string));

    const userSentence = userTokens.join(" ");
    const correctSentence = current?.tokens.join(" ") || "";

    setStatus(userSentence === correctSentence ? "correct" : "wrong");
  };

  const addSentence = () => {
    const sentence = sentenceInput.trim();
    if (!sentence) return;

    const manualTokens = tokensInput
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const tokens =
      manualTokens.length > 0
        ? manualTokens
        : sentence
            .replace(/\s+/g, " ")
            .trim()
            .replace(/([?!.,])/g, " $1 ")
            .split(" ")
            .filter(Boolean);

    const newItem: Item = {
      id: `custom-${Date.now()}`,
      sentence,
      tokens,
      hint: hintInput.trim() || undefined,
    };

    const updated = [...gameItems, newItem];
    setGameItems(updated);

    setSentenceInput("");
    setTokensInput("");
    setHintInput("");

    setIndex(updated.length - 1);
    setGameStarted(true);
  };

  const startGame = () => {
    if (!current || gameItems.length === 0) return;
    setGameStarted(true);
    setIndex(0);
    setStatus(null);
  };

  if (!gameStarted || !current) {
    return (
      <div className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 py-6 px-4">
        <div className="max-w-6xl mx-auto space-y-5">
          <BackPrev />
          <Card className="p-6 sm:p-8 rounded-3xl shadow-xl bg-white/90 border border-white/70">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-linear-to-r from-sky-200 to-emerald-200 text-sky-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  🚀 Boshlash
                </div>
                <div className="rounded-2xl bg-linear-to-r from-sky-500 to-emerald-500 text-white p-4 shadow-lg">
                  <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight drop-shadow">
                    {title}
                  </h1>
                  <p className="text-sm mt-2 text-white/90">
                    Tepada puzzle bo‘laklari, pastda maydon. Drag & drop bilan
                    joylashtiring, tartiblang, xohlasangiz bo‘lakka bosib ham
                    qo‘shib/olib tashlaysiz.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    "Drag → slotga tashlang",
                    "Joyini almashtiring",
                    "Check → Next",
                  ].map((step) => (
                    <div
                      key={step}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
                    >
                      {step}
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                  Hozirgi gaplar soni:{" "}
                  <span className="font-semibold">{gameItems.length}</span>
                </div>

                <Button
                  className="rounded-xl"
                  size="lg"
                  onClick={startGame}
                  disabled={!gameItems.length}
                >
                  ▶️ O&apos;yinni boshlash
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-lg font-bold">Teacher form</h3>
                  <Badge variant="secondary" className="rounded-full">
                    {gameItems.length} sentence
                  </Badge>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Sentence
                    </label>
                    <textarea
                      value={sentenceInput}
                      onChange={(e) => setSentenceInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm resize-none min-h-[90px]"
                      placeholder="Masalan: I am going to the park after school."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Tokens (optional)
                    </label>
                    <input
                      value={tokensInput}
                      onChange={(e) => setTokensInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm"
                      placeholder="I am going to the park after school ."
                    />
                    <p className="text-xs text-muted-foreground">
                      Bo&apos;sh qoldirsangiz, avtomatik parchalanadi.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Hint (optional)
                    </label>
                    <input
                      value={hintInput}
                      onChange={(e) => setHintInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm"
                      placeholder="Boshlanishini eslatib oling"
                    />
                  </div>

                  <Button
                    className="w-full rounded-xl"
                    variant="secondary"
                    onClick={addSentence}
                    disabled={!sentenceInput.trim()}
                  >
                    + Add sentence
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const bankSortableItems = bank; // ids
  const answerSortableItems = answerSlots.filter(Boolean) as string[]; // for drag handles in answer (chips)

  const overlayText = activeId ? tokenTextById(activeId) : "";

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <BackPrev />

        <Card className="p-5 sm:p-6 rounded-3xl shadow-xl bg-white/90 border border-white/70">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                🧩 Word order
              </div>
              <h1 className="text-2xl font-extrabold">{title}</h1>
              <p className="text-sm text-slate-600">
                Tepada bo‘laklar, pastda maydon. Drag & drop bilan qo‘ying,
                joyini almashtiring, bankga qaytarib tashlasangiz ham bo‘ladi.
              </p>
            </div>
          </div>
        </Card>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(e) => setActiveId(String(e.active.id))}
          onDragCancel={() => setActiveId(null)}
          onDragEnd={onDragEnd}
        >
          {/* TOP: Bank */}
          <Card className="p-4 sm:p-5 rounded-3xl shadow-lg bg-white/90 border border-white/60">
            <DroppableBank>
              <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
                <span className="font-semibold">
                  Puzzle bo&apos;laklari (tepada)
                </span>
                <Badge className="rounded-full" variant="secondary">
                  Drag / Tap
                </Badge>
              </div>

              <SortableContext items={bankSortableItems}>
                <div className="flex flex-wrap gap-3">
                  {bank.map((id) => (
                    <PuzzleChip
                      key={id}
                      id={id}
                      text={tokenTextById(id)}
                      onQuickClick={() => quickAdd(id)}
                    />
                  ))}
                </div>
              </SortableContext>

              <p className="mt-2 text-xs text-slate-500">
                Bankga tashlasangiz bo‘lak qaytadi (remove).
              </p>
            </DroppableBank>
          </Card>

          {/* BOTTOM: Build area */}
          <Card className="p-4 sm:p-5 rounded-3xl shadow-lg bg-white/90 border border-white/60">
            <div className="grid gap-4">
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-700">
                Hozirgi gap:{" "}
                <span className="font-semibold">{current.sentence}</span>
                <br />
                Yig&apos;ilgan:{" "}
                <span className="font-semibold">
                  {answerSlots
                    .filter(Boolean)
                    .map((id) => tokenTextById(id as string))
                    .join(" ") || "slotlar bo'sh"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={resetRound}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset / Shuffle
                </Button>

                <Button size="sm" onClick={check}>
                  Check
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    setIndex((prev) => (prev + 1) % gameItems.length)
                  }
                  disabled={status !== "correct"}
                >
                  Next →
                </Button>

                {status === "correct" && (
                  <Badge className="rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> To&apos;g&apos;ri
                  </Badge>
                )}
                {status === "wrong" && (
                  <Badge variant="destructive" className="rounded-full">
                    <XCircle className="h-4 w-4 mr-1" /> Qayta urinib
                    ko&apos;ring
                  </Badge>
                )}
              </div>

              {/* Slots */}
              <SortableContext items={answerSortableItems}>
                <div
                  className="grid gap-3"
                  style={{
                    alignTracks: "center",
                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  }}
                >
                  {current.tokens.map((_, i) => {
                    const slotId = `slot-${i}`;
                    const tokenId = answerSlots[i];
                    const filled = Boolean(tokenId);

                    return (
                      <Slot key={slotId} id={slotId} filled={filled}>
                        {tokenId ? (
                          <PuzzleChip
                            id={tokenId}
                            text={tokenTextById(tokenId)}
                            isResultArea
                            onQuickClick={() => quickRemove(tokenId)}
                          />
                        ) : null}
                      </Slot>
                    );
                  })}
                </div>
              </SortableContext>
            </div>
          </Card>

          <DragOverlay>
            {activeId ? (
              <div className="pointer-events-none">
                <div
                  className={`${colorFor(
                    overlayText
                  )} px-6 py-4 rounded-lg shadow-lg`}
                >
                  <span className="font-black text-white text-xl uppercase tracking-wider">
                    {overlayText}
                  </span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
