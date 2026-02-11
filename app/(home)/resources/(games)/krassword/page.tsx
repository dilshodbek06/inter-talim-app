"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  Info,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import BackPrev from "@/components/back-prev";
import { useExitGuard } from "@/hooks/use-exit-guard";
import { useFeedbackSounds } from "@/hooks/use-feedback-sounds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Direction = "across" | "down";

type WordInput = {
  id: string;
  clue: string;
  answer: string;
};

type PlacedWord = WordInput & {
  row: number;
  col: number;
  direction: Direction;
  number: number;
};

type CrosswordBuild = {
  grid: (string | null)[][];
  words: PlacedWord[];
  numberMap: Record<string, number>;
  unplaced: WordInput[];
  size: number;
  bounds: {
    minRow: number;
    maxRow: number;
    minCol: number;
    maxCol: number;
  };
};

const DEFAULT_WORDS: WordInput[] = [
  { id: "1", clue: "Yozishda ishlatiladigan asbob", answer: "qalam" },
  {
    id: "2",
    clue: "Kechasi osmonda ko'rinadigan yorqin nuqta",
    answer: "yulduz",
  },
  { id: "3", clue: "Qishda sovuqda yog'adigan oq narsa", answer: "qor" },
  { id: "4", clue: "Yomg'irdan saqlaydigan buyum", answer: "soyabon" },
  { id: "5", clue: "Maktabda dars beradigan odam", answer: "ustoz" },
  { id: "6", clue: "Uyda ovqat pishiriladigan joy", answer: "oshxona" },
  {
    id: "7",
    clue: "Kompyuterda matn yozish uchun tugmalar to'plami",
    answer: "klaviatura",
  },
  {
    id: "8",
    clue: "Telefon bilan eshitish uchun ishlatiladigan tana a'zosi",
    answer: "quloq",
  },
  {
    id: "9",
    clue: "Tana uchun oziq bo'ladigan shirin meva (qizil yoki yashil)",
    answer: "olma",
  },
  {
    id: "10",
    clue: "Issiq ichimlik, ko'pincha ertalab ichiladi",
    answer: "choy",
  },
];

const DEFAULT_GRID_SIZE = 13;

const normalizeAnswer = (value: string) => {
  return value
    .toUpperCase()
    .normalize("NFD")
    .replace(/[^A-Z]/g, "")
    .trim();
};

const createGrid = (size: number) =>
  Array.from(
    { length: size },
    () => Array(size).fill(null) as (string | null)[],
  );

const canPlaceWord = (
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  direction: Direction,
): boolean => {
  const size = grid.length;
  const len = word.length;

  if (direction === "across") {
    if (row < 0 || row >= size) return false;
    if (col < 0 || col + len > size) return false;
  } else {
    if (col < 0 || col >= size) return false;
    if (row < 0 || row + len > size) return false;
  }

  for (let i = 0; i < len; i += 1) {
    const r = row + (direction === "down" ? i : 0);
    const c = col + (direction === "across" ? i : 0);
    const cell = grid[r][c];

    // overlap is allowed only if same letter
    if (cell && cell !== word[i]) return false;

    // if we're placing into an empty cell, enforce "no side-touching"
    if (!cell) {
      if (direction === "across") {
        if (r > 0 && grid[r - 1][c]) return false;
        if (r < size - 1 && grid[r + 1][c]) return false;
      } else {
        if (c > 0 && grid[r][c - 1]) return false;
        if (c < size - 1 && grid[r][c + 1]) return false;
      }
    }
  }

  // prevent touching at word ends
  if (direction === "across") {
    if (col > 0 && grid[row][col - 1]) return false;
    if (col + len < size && grid[row][col + len]) return false;
  } else {
    if (row > 0 && grid[row - 1][col]) return false;
    if (row + len < size && grid[row + len][col]) return false;
  }

  return true;
};

const placeWord = (
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  direction: Direction,
) => {
  for (let i = 0; i < word.length; i += 1) {
    const r = row + (direction === "down" ? i : 0);
    const c = col + (direction === "across" ? i : 0);
    grid[r][c] = word[i];
  }
};

const buildCrossword = (entries: WordInput[], size: number): CrosswordBuild => {
  const grid = createGrid(size);
  const placed: PlacedWord[] = [];
  const unplaced: WordInput[] = [];

  const words = entries
    .map((entry) => ({
      ...entry,
      answer: normalizeAnswer(entry.answer),
      clue: entry.clue.trim(),
    }))
    .filter((entry) => entry.answer.length >= 2 && entry.clue.length > 0);

  const sorted = [...words].sort(
    (a, b) => b.answer.length - a.answer.length || Math.random() - 0.5,
  );

  const tryPlaceAtCenter = (word: WordInput) => {
    const row = Math.floor(size / 2);
    const col = Math.floor((size - word.answer.length) / 2);
    if (!canPlaceWord(grid, word.answer, row, col, "across")) return false;
    placeWord(grid, word.answer, row, col, "across");
    placed.push({ ...word, row, col, direction: "across", number: 0 });
    return true;
  };

  for (let index = 0; index < sorted.length; index += 1) {
    const word = sorted[index];

    if (index === 0) {
      if (!tryPlaceAtCenter(word)) unplaced.push(word);
      continue;
    }

    let best: {
      row: number;
      col: number;
      direction: Direction;
      intersections: number;
    } | null = null;

    for (const placedWord of placed) {
      for (let j = 0; j < placedWord.answer.length; j += 1) {
        const placedRow =
          placedWord.row + (placedWord.direction === "down" ? j : 0);
        const placedCol =
          placedWord.col + (placedWord.direction === "across" ? j : 0);
        const placedLetter = placedWord.answer[j];

        for (let i = 0; i < word.answer.length; i += 1) {
          if (word.answer[i] !== placedLetter) continue;

          const direction: Direction =
            placedWord.direction === "across" ? "down" : "across";

          const row = direction === "across" ? placedRow : placedRow - i;
          const col = direction === "across" ? placedCol - i : placedCol;

          if (!canPlaceWord(grid, word.answer, row, col, direction)) continue;

          let intersections = 0;
          for (let k = 0; k < word.answer.length; k += 1) {
            const r = row + (direction === "down" ? k : 0);
            const c = col + (direction === "across" ? k : 0);
            if (grid[r][c] === word.answer[k]) intersections += 1;
          }

          if (!best || intersections > best.intersections) {
            best = { row, col, direction, intersections };
          }
        }
      }
    }

    if (best && best.intersections > 0) {
      placeWord(grid, word.answer, best.row, best.col, best.direction);
      placed.push({
        ...word,
        row: best.row,
        col: best.col,
        direction: best.direction,
        number: 0,
      });
    } else {
      unplaced.push(word);
    }
  }

  // numbering
  const numberMap: Record<string, number> = {};
  let currentNumber = 1;

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (!grid[row][col]) continue;

      const startsAcross =
        (col === 0 || !grid[row][col - 1]) &&
        col + 1 < size &&
        !!grid[row][col + 1];

      const startsDown =
        (row === 0 || !grid[row - 1][col]) &&
        row + 1 < size &&
        !!grid[row + 1][col];

      if (startsAcross || startsDown) {
        const key = `${row}-${col}`;
        numberMap[key] = currentNumber;
        currentNumber += 1;
      }
    }
  }

  const numberedWords = placed.map((word) => {
    const key = `${word.row}-${word.col}`;
    return { ...word, number: numberMap[key] ?? 0 };
  });

  // bounds
  let minRow = size;
  let maxRow = 0;
  let minCol = size;
  let maxCol = 0;
  let hasCells = false;

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (!grid[row][col]) continue;
      hasCells = true;
      minRow = Math.min(minRow, row);
      maxRow = Math.max(maxRow, row);
      minCol = Math.min(minCol, col);
      maxCol = Math.max(maxCol, col);
    }
  }

  const bounds = hasCells
    ? { minRow, maxRow, minCol, maxCol }
    : { minRow: 0, maxRow: size - 1, minCol: 0, maxCol: size - 1 };

  return {
    grid,
    words: numberedWords,
    numberMap,
    unplaced,
    size,
    bounds,
  };
};

const getWordCells = (word: PlacedWord) => {
  return Array.from({ length: word.answer.length }, (_, index) => ({
    row: word.row + (word.direction === "down" ? index : 0),
    col: word.col + (word.direction === "across" ? index : 0),
  }));
};

export default function CrosswordGamePage() {
  const [phase, setPhase] = useState<"intro" | "game">("intro");
  const [questions, setQuestions] = useState<WordInput[]>(DEFAULT_WORDS);
  const [newClue, setNewClue] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [crossword, setCrossword] = useState<CrosswordBuild | null>(null);
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [hintedWords, setHintedWords] = useState<Record<string, boolean>>({});

  const inputRefs = useRef<Map<string, HTMLInputElement | null>>(new Map());
  const confettiFired = useRef(false);
  const solvedWordIdsRef = useRef<Set<string>>(new Set());
  const confettiRef = useRef<typeof import("canvas-confetti").default | null>(
    null,
  );

  const loadConfetti = useCallback(async () => {
    if (confettiRef.current) return confettiRef.current;
    const mod = await import("canvas-confetti");
    confettiRef.current = mod.default;
    return mod.default;
  }, []);

  const { back: handleBack } = useExitGuard({ enabled: phase === "game" });
  const { playSuccess, playError } = useFeedbackSounds();

  const activeWord = useMemo(() => {
    return crossword?.words.find((word) => word.id === activeWordId) ?? null;
  }, [crossword, activeWordId]);

  const activeWordCells = useMemo(() => {
    if (!activeWord) return new Set<string>();
    const cells = getWordCells(activeWord).map(
      (cell) => `${cell.row}-${cell.col}`,
    );
    return new Set(cells);
  }, [activeWord]);

  const cellToWords = useMemo(() => {
    const map = new Map<string, PlacedWord[]>();
    crossword?.words.forEach((word) => {
      getWordCells(word).forEach((cell) => {
        const key = `${cell.row}-${cell.col}`;
        const existing = map.get(key) ?? [];
        map.set(key, [...existing, word]);
      });
    });
    return map;
  }, [crossword]);

  const solvedCount = useMemo(() => {
    if (!crossword) return 0;
    return crossword.words.reduce((total, word) => {
      const isSolved = getWordCells(word).every((cell, index) => {
        const key = `${cell.row}-${cell.col}`;
        return entries[key] === word.answer[index];
      });
      return total + (isSolved ? 1 : 0);
    }, 0);
  }, [crossword, entries]);

  const totalWords = crossword?.words.length ?? 0;
  const hintsUsed = useMemo(
    () => Object.keys(hintedWords).length,
    [hintedWords],
  );

  useEffect(() => {
    if (!crossword || totalWords === 0) return;
    if (solvedCount === totalWords && !confettiFired.current) {
      confettiFired.current = true;
      void loadConfetti().then((confetti) => {
        confetti({
          particleCount: 140,
          spread: 80,
          startVelocity: 45,
          ticks: 200,
          origin: { x: 0.5, y: 0.3 },
          colors: ["#22c55e", "#38bdf8", "#f97316", "#facc15"],
          disableForReducedMotion: true,
        });
      });
    }
  }, [crossword, loadConfetti, solvedCount, totalWords]);

  useEffect(() => {
    if (!crossword) {
      solvedWordIdsRef.current = new Set();
      return;
    }

    const nextSolved = new Set<string>();
    crossword.words.forEach((word) => {
      const isSolved = getWordCells(word).every((cell, index) => {
        const key = `${cell.row}-${cell.col}`;
        return entries[key] === word.answer[index];
      });
      if (isSolved) nextSolved.add(word.id);
    });

    const hasNewSolvedWord = Array.from(nextSolved).some(
      (id) => !solvedWordIdsRef.current.has(id),
    );
    if (hasNewSolvedWord) playSuccess();

    solvedWordIdsRef.current = nextSolved;
  }, [crossword, entries, playSuccess]);

  const handleAddQuestion = () => {
    setFormError(null);
    const normalized = normalizeAnswer(newAnswer);

    if (!newClue.trim()) {
      setFormError("Savol matnini kiriting.");
      return;
    }
    if (normalized.length < 2) {
      setFormError("Javob kamida 2 harfdan iborat bo‘lishi kerak.");
      return;
    }

    const newItem: WordInput = {
      id: String(Date.now()),
      clue: newClue.trim(),
      answer: normalized,
    };

    setQuestions((prev) => [newItem, ...prev]);
    setNewClue("");
    setNewAnswer("");
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleStartGame = () => {
    setFormError(null);
    confettiFired.current = false;
    solvedWordIdsRef.current = new Set();
    setHintedWords({});

    const cleaned = questions
      .map((item) => ({
        ...item,
        answer: normalizeAnswer(item.answer),
        clue: item.clue.trim(),
      }))
      .filter((item) => item.answer.length >= 2 && item.clue.length > 0);

    if (cleaned.length === 0) {
      setFormError("Kamida bitta savol va javob kerak.");
      return;
    }

    const maxLen = Math.max(...cleaned.map((item) => item.answer.length));
    if (maxLen > DEFAULT_GRID_SIZE - 2) {
      setFormError(
        `Javob uzunligi (${maxLen}) grid (${DEFAULT_GRID_SIZE}x${DEFAULT_GRID_SIZE}) uchun juda katta.`,
      );
      return;
    }

    const built = buildCrossword(cleaned, DEFAULT_GRID_SIZE);

    // ✅ Guard: if nothing got placed, show a friendly error
    if (built.words.length === 0) {
      setFormError(
        "So‘zlar joylashmadi. Kesishadigan (umumiy harflari bor) so‘zlar kiriting yoki so‘zlarni qisqartiring.",
      );
      return;
    }

    const initialEntries: Record<string, string> = {};
    built.grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) initialEntries[`${rowIndex}-${colIndex}`] = "";
      });
    });

    setCrossword(built);
    setEntries(initialEntries);
    setPhase("game");

    const firstWord = built.words[0];
    setActiveWordId(firstWord?.id ?? null);
    setActiveCell(
      firstWord ? { row: firstWord.row, col: firstWord.col } : null,
    );
  };

  const handleResetGame = () => {
    if (!crossword) return;
    const resetEntries: Record<string, string> = {};
    crossword.grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) resetEntries[`${rowIndex}-${colIndex}`] = "";
      });
    });
    setEntries(resetEntries);
    setHintedWords({});
    confettiFired.current = false;
    solvedWordIdsRef.current = new Set();
  };

  // ✅ Hint now fixes the first EMPTY or WRONG cell (not only empty)
  const handleHint = () => {
    if (!activeWord || !crossword) return;
    if (hintedWords[activeWord.id]) return;

    for (let index = 0; index < activeWord.answer.length; index += 1) {
      const row =
        activeWord.row + (activeWord.direction === "down" ? index : 0);
      const col =
        activeWord.col + (activeWord.direction === "across" ? index : 0);
      const key = `${row}-${col}`;

      const current = entries[key] ?? "";
      const correct = activeWord.answer[index];

      if (current !== correct) {
        setEntries((prev) => ({ ...prev, [key]: correct }));
        setHintedWords((prev) => ({ ...prev, [activeWord.id]: true }));
        setActiveCell({ row, col });

        const input = inputRefs.current.get(key);
        if (input) {
          input.focus();
          input.select();
        }
        return;
      }
    }
  };

  // ✅ Better word selection on intersections: toggle across/down when multiple words share the cell
  const handleCellClick = (row: number, col: number) => {
    if (!crossword) return;
    setActiveCell({ row, col });

    const key = `${row}-${col}`;

    // If it's a numbered starter cell, prefer starter words first
    const starters = crossword.numberMap[key]
      ? crossword.words.filter((word) => word.row === row && word.col === col)
      : [];

    if (starters.length > 0) {
      if (starters.length === 1) {
        setActiveWordId(starters[0].id);
        return;
      }

      const idx = starters.findIndex((w) => w.id === activeWordId);
      const next =
        idx >= 0 ? starters[(idx + 1) % starters.length] : starters[0];
      setActiveWordId(next.id);
      return;
    }

    const containing = cellToWords.get(key);
    if (!containing || containing.length === 0) return;

    if (containing.length === 1) {
      setActiveWordId(containing[0].id);
      return;
    }

    const idx = containing.findIndex((w) => w.id === activeWordId);
    const next =
      idx >= 0 ? containing[(idx + 1) % containing.length] : containing[0];
    setActiveWordId(next.id);
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    if (!crossword) return;

    const letter = value
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(-1);

    const key = `${row}-${col}`;
    const expected = crossword.grid[row][col];
    if (letter && expected && letter !== expected) {
      playError();
    }
    setEntries((prev) => ({ ...prev, [key]: letter }));

    if (!activeWord || !letter) return;

    const wordCells = getWordCells(activeWord);
    const index = wordCells.findIndex(
      (cell) => cell.row === row && cell.col === col,
    );
    if (index === -1) return;

    const nextCell = wordCells[index + 1];
    if (!nextCell) return;

    const nextKey = `${nextCell.row}-${nextCell.col}`;
    const input = inputRefs.current.get(nextKey);
    if (input) {
      input.focus();
      input.select();
    }
  };

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number,
  ) => {
    if (!activeWord) return;
    if (event.key !== "Backspace") return;

    const key = `${row}-${col}`;
    if (entries[key]) return;

    const wordCells = getWordCells(activeWord);
    const index = wordCells.findIndex(
      (cell) => cell.row === row && cell.col === col,
    );

    const prevCell = wordCells[index - 1];
    if (!prevCell) return;

    const prevKey = `${prevCell.row}-${prevCell.col}`;
    const input = inputRefs.current.get(prevKey);
    if (input) {
      input.focus();
      input.select();
    }
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <BackPrev onBack={handleBack} />

          <header className="space-y-4">
            <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-4 h-4 mr-1" />
              Krassword o‘yini
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
              Krassword – bilimni qiziqarli shaklda tekshirish
            </h1>
            <p className="text-slate-600 max-w-2xl">
              Ustoz savollarni kiritadi, o‘quvchilar esa raqamlangan kataklarni
              tanlab, javoblarni to‘ldiradi. Har bir raqamli katak bosilganda
              shu savol avtomatik ko‘rinadi.
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <Card className="bg-white/90 border-white/60 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900">
                  O‘yinga kirish va yo‘riqnoma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    1
                  </div>
                  <p>
                    Har bir savolga mos javobni kiriting. Javoblar faqat lotin
                    harflari (A-Z) bilan yoziladi.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    2
                  </div>
                  <p>
                    So‘zlar bir-biriga kesishishi uchun umumiy harflar bo‘lsin –
                    tizim avtomatik joylashtiradi.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    3
                  </div>
                  <p>
                    O‘yin boshlangach, raqamli katakni bosing – savol yuqorida
                    ko‘rsatiladi. Harflarni kiritib krasswordni to‘ldiring.
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <div className="flex items-start gap-2 text-sm">
                    <Info className="w-4 h-4 mt-0.5 text-emerald-600" />
                    <p>
                      Tavsiya: qisqa va aniq savollar yozing, so‘zlar 4-8 harf
                      oralig‘ida bo‘lsa eng yaxshi ko‘rinadi.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-white/60 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900">
                  Savollarni yaratish
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Savol
                  </label>
                  <Textarea
                    value={newClue}
                    onChange={(event) => setNewClue(event.target.value)}
                    placeholder="Masalan: Quyosh atrofida aylanuvchi sayyora"
                    className="min-h-[90px] rounded-xl border-slate-200 bg-white/80"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Javob
                  </label>
                  <Input
                    value={newAnswer}
                    onChange={(event) => setNewAnswer(event.target.value)}
                    placeholder="MASALAN: YER"
                    className="rounded-xl border-slate-200 bg-white/80"
                  />
                </div>

                {formError && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {formError}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={handleAddQuestion}
                    className="rounded-xl px-4 py-2.5 text-white font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    Savol qo‘shish
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleStartGame}
                    className="rounded-xl px-4 py-2.5 font-semibold"
                  >
                    <Play className="w-4 h-4" />
                    O‘yinni boshlash
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span className="font-semibold">
                      Tayyor savollar: {questions.length}
                    </span>
                    <span className="text-xs">O‘zgartirish mumkin</span>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {questions.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {item.clue}
                            </p>
                            <p className="text-xs text-slate-500">
                              Javob: {normalizeAnswer(item.answer)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(item.id)}
                            className="text-rose-500 hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!crossword) return null;

  const padding = 1;
  const startRow = Math.max(0, crossword.bounds.minRow - padding);
  const endRow = Math.min(
    crossword.size - 1,
    crossword.bounds.maxRow + padding,
  );
  const startCol = Math.max(0, crossword.bounds.minCol - padding);
  const endCol = Math.min(
    crossword.size - 1,
    crossword.bounds.maxCol + padding,
  );

  const rows = Array.from(
    { length: endRow - startRow + 1 },
    (_, i) => startRow + i,
  );
  const cols = Array.from(
    { length: endCol - startCol + 1 },
    (_, i) => startCol + i,
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-linear-to-r from-emerald-600 via-emerald-500 to-lime-500 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_55%)]" />
        <div className="max-w-6xl mx-auto px-0 sm:px-6 lg:px-8 sm:py-2 relative z-10">
          <div className="rounded-none sm:rounded-3xl border border-white/30 bg-white/15 backdrop-blur px-3 py-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <div className="rounded-full bg-white/20 px-3 py-1.5 text-xs sm:text-sm font-semibold">
                  Topilgan so‘zlar: {solvedCount}/{totalWords}
                </div>
                <div className="rounded-full bg-white/20 px-3 py-1.5 text-xs sm:text-sm font-semibold">
                  Hintlar: {hintsUsed}/{totalWords}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
                <Button
                  type="button"
                  onClick={handleHint}
                  disabled={!activeWord || hintedWords[activeWord.id]}
                  className="h-9 w-full justify-center rounded-full bg-white text-emerald-700 hover:bg-white/90 disabled:opacity-60 disabled:hover:bg-white px-3 text-xs sm:text-sm sm:h-8 sm:w-auto"
                >
                  <Sparkles className="w-4 h-4" />1 harf hint berish
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetGame}
                  className="h-9 w-full justify-center rounded-full border-white/60 text-white hover:bg-white/20 px-3 text-xs sm:text-sm sm:h-8 sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  Qayta boshlash
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleStartGame}
                  className="col-span-2 h-9 w-full justify-center rounded-full bg-white text-emerald-700 hover:bg-white/90 px-3 text-xs sm:text-sm sm:col-auto sm:h-8 sm:w-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  Joylashuvni qayta yaratish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-0 sm:px-6 lg:px-8 py-5 space-y-4">
        <Card className="border-0 shadow-md rounded-none sm:rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-white/90 px-4 py-3 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  {activeWord ? activeWord.number : "?"}
                </div>
                <div>
                  <p className="text-sm text-slate-500">Savol</p>
                  <p className="text-sm sm:text-base font-semibold text-slate-900">
                    {activeWord ? activeWord.clue : "Raqamli katakni tanlang"}
                  </p>
                </div>
                {activeWord && (
                  <Badge className="hidden sm:block ml-auto bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs">
                    {activeWord.direction === "across"
                      ? "Gorizontal"
                      : "Vertikal"}
                  </Badge>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
              <div className="relative p-3 sm:p-4">
                <div className="mx-auto max-w-[700px]">
                  <div
                    className="grid gap-1"
                    style={{
                      gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {rows.map((row) =>
                      cols.map((col) => {
                        const cell = crossword.grid[row][col];
                        const key = `${row}-${col}`;

                        if (!cell)
                          return <div key={key} className="aspect-square" />;

                        const value = entries[key] ?? "";
                        const hasNumber = crossword.numberMap[key];
                        const isActive =
                          activeCell?.row === row && activeCell?.col === col;
                        const isActiveWordCell = activeWordCells.has(key);

                        return (
                          <div key={key} className="relative">
                            <input
                              ref={(el) => {
                                if (el) inputRefs.current.set(key, el);
                                else inputRefs.current.delete(key); // ✅ cleanup
                              }}
                              value={value}
                              maxLength={1}
                              autoComplete="off"
                              onChange={(event) =>
                                handleInputChange(row, col, event.target.value)
                              }
                              onKeyDown={(event) =>
                                handleInputKeyDown(event, row, col)
                              }
                              onFocus={() => handleCellClick(row, col)}
                              onClick={() => handleCellClick(row, col)}
                              aria-label={`Katak ${row + 1}-${col + 1}`}
                              className={`aspect-square w-full rounded-md border text-center text-sm sm:text-base font-bold uppercase transition shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                                isActiveWordCell
                                  ? "bg-emerald-50 border-emerald-400"
                                  : "bg-white/90 border-slate-300"
                              } ${isActive ? "ring-2 ring-emerald-500" : ""}`}
                            />
                            {hasNumber && (
                              <span className="absolute top-1 left-1 text-[9px] font-bold text-slate-500">
                                {crossword.numberMap[key]}
                              </span>
                            )}
                          </div>
                        );
                      }),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {crossword.unplaced.length > 0 && (
          <div className="rounded-none sm:rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Ba’zi so‘zlar joylashmadi. Ular boshqa so‘zlar bilan kesishmaydi
            yoki uzunligi mos kelmadi. So‘zlarni o‘zgartirib qayta urinib
            ko‘ring.
          </div>
        )}
      </div>
    </div>
  );
}
