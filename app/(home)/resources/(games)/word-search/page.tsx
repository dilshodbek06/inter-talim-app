"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RefreshCw, Trophy, Plus, Trash2, Play, Sparkles } from "lucide-react";
import BackPrev from "@/components/back-prev";

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
};

const AnimatePresence = ({
  children,
}: { children: React.ReactNode } & Record<string, unknown>) => <>{children}</>;

type CellCoord = {
  row: number;
  col: number;
};

const GRID_SIZE = 12;

const WordSearchGame: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundWordCells, setFoundWordCells] = useState<CellCoord[]>([]);
  const [selectedCells, setSelectedCells] = useState<CellCoord[]>([]);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [newWord, setNewWord] = useState<string>("");

  // Yengil UX uchun: gameStarted bo'lsa sahifa yuqorisiga scroll
  useEffect(() => {
    if (gameStarted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [gameStarted]);

  const canPlaceWord = (
    grid: string[][],
    word: string,
    row: number,
    col: number,
    direction: number,
  ): boolean => {
    const len = word.length;

    switch (direction) {
      case 0: // gorizontal
        if (col + len > GRID_SIZE) return false;
        for (let i = 0; i < len; i++) {
          if (grid[row][col + i] !== "" && grid[row][col + i] !== word[i]) {
            return false;
          }
        }
        return true;
      case 1: // vertikal
        if (row + len > GRID_SIZE) return false;
        for (let i = 0; i < len; i++) {
          if (grid[row + i][col] !== "" && grid[row + i][col] !== word[i]) {
            return false;
          }
        }
        return true;
      case 2: // diagonal o‘ng
        if (row + len > GRID_SIZE || col + len > GRID_SIZE) return false;
        for (let i = 0; i < len; i++) {
          if (
            grid[row + i][col + i] !== "" &&
            grid[row + i][col + i] !== word[i]
          ) {
            return false;
          }
        }
        return true;
      case 3: // diagonal chap
        if (row + len > GRID_SIZE || col - len + 1 < 0) return false;
        for (let i = 0; i < len; i++) {
          if (
            grid[row + i][col - i] !== "" &&
            grid[row + i][col - i] !== word[i]
          ) {
            return false;
          }
        }
        return true;
      default:
        return false;
    }
  };

  const placeWord = (
    grid: string[][],
    word: string,
    row: number,
    col: number,
    direction: number,
  ): void => {
    const len = word.length;

    switch (direction) {
      case 0:
        for (let i = 0; i < len; i++) grid[row][col + i] = word[i];
        break;
      case 1:
        for (let i = 0; i < len; i++) grid[row + i][col] = word[i];
        break;
      case 2:
        for (let i = 0; i < len; i++) grid[row + i][col + i] = word[i];
        break;
      case 3:
        for (let i = 0; i < len; i++) grid[row + i][col - i] = word[i];
        break;
    }
  };

  const initializeGrid = () => {
    if (words.length === 0) {
      alert("Iltimos, kamida bitta so'z qo'shing!");
      return;
    }

    const newGrid: string[][] = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(""));

    // So‘zlarni joylash
    words.forEach((word) => {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 150) {
        const direction = Math.floor(Math.random() * 4);
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);

        if (canPlaceWord(newGrid, word, row, col, direction)) {
          placeWord(newGrid, word, row, col, direction);
          placed = true;
        }
        attempts++;
      }
    });

    // Bo'sh joylarni random harflar bilan to‘ldirish
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (newGrid[i][j] === "") {
          newGrid[i][j] = String.fromCharCode(
            65 + Math.floor(Math.random() * 26),
          );
        }
      }
    }

    setGrid(newGrid);
    setFoundWords([]);
    setFoundWordCells([]);
    setSelectedCells([]);
    setGameStarted(true);
  };

  const addWord = () => {
    const cleanWord = newWord
      .trim()
      .toUpperCase()
      .replace(/[^A-Z]/g, "");

    if (cleanWord.length < 3) {
      alert("So'z kamida 3 harfdan iborat bo'lishi kerak!");
      return;
    }

    if (cleanWord.length > GRID_SIZE) {
      alert(`So'z ${GRID_SIZE} harfdan oshmasligi kerak!`);
      return;
    }

    if (words.includes(cleanWord)) {
      alert("Bu so'z allaqachon qo'shilgan!");
      return;
    }

    setWords((prev) => [...prev, cleanWord]);
    setNewWord("");
  };

  const removeWord = (wordToRemove: string) => {
    setWords((prev) => prev.filter((word) => word !== wordToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addWord();
    }
  };

  const resetGame = () => {
    setWords([]);
    setGrid([]);
    setFoundWords([]);
    setFoundWordCells([]);
    setSelectedCells([]);
    setGameStarted(false);
    setNewWord("");
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || selectedCells.length === 0) return;

    setSelectedCells((prev) => {
      if (prev.length === 0) return [{ row, col }];

      const firstCell = prev[0];
      const rowDiff = row - firstCell.row;
      const colDiff = col - firstCell.col;

      // Faqat to‘g‘ri chiziqlar (gorizontal, vertikal, diagonal)
      if (
        !(
          row === firstCell.row ||
          col === firstCell.col ||
          Math.abs(rowDiff) === Math.abs(colDiff)
        )
      ) {
        return prev;
      }

      const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
      const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
      const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

      const newCells: CellCoord[] = [];
      for (let i = 0; i <= steps; i++) {
        newCells.push({
          row: firstCell.row + i * rowStep,
          col: firstCell.col + i * colStep,
        });
      }
      return newCells;
    });
  };

  const checkSelectedWord = () => {
    if (selectedCells.length < 2 || grid.length === 0) {
      setSelectedCells([]);
      return;
    }

    const selectedWord = selectedCells
      .map((cell) => grid[cell.row][cell.col])
      .join("");
    const reversedWord = selectedWord.split("").reverse().join("");

    if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      setFoundWords((prev) => [...prev, selectedWord]);
      setFoundWordCells((prev) => [...prev, ...selectedCells]);
    } else if (
      words.includes(reversedWord) &&
      !foundWords.includes(reversedWord)
    ) {
      setFoundWords((prev) => [...prev, reversedWord]);
      setFoundWordCells((prev) => [...prev, ...selectedCells]);
    }

    setSelectedCells([]);
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    checkSelectedWord();
  };

  const getCellFromPoint = (
    clientX: number,
    clientY: number,
  ): CellCoord | null => {
    const el = document.elementFromPoint(
      clientX,
      clientY,
    ) as HTMLElement | null;
    if (!el) return null;

    const row = el.getAttribute("data-row");
    const col = el.getAttribute("data-col");
    if (row === null || col === null) return null;

    return { row: Number(row), col: Number(col) };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;

    const cell = getCellFromPoint(touch.clientX, touch.clientY);
    if (!cell) return;

    e.preventDefault();
    handleMouseDown(cell.row, cell.col);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSelecting) return;
    const touch = e.touches[0];
    if (!touch) return;

    const cell = getCellFromPoint(touch.clientX, touch.clientY);
    if (!cell) return;

    e.preventDefault();
    handleMouseEnter(cell.row, cell.col);
  };

  const handleTouchEnd = () => {
    if (!isSelecting) return;
    handleMouseUp();
  };

  const isCellSelected = (row: number, col: number): boolean => {
    return selectedCells.some((cell) => cell.row === row && cell.col === col);
  };

  const isCellInFoundWord = (row: number, col: number): boolean => {
    return foundWordCells.some((cell) => cell.row === row && cell.col === col);
  };

  const progress = words.length
    ? Math.round((foundWords.length / words.length) * 100)
    : 0;

  return (
    <motion.div
      className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 py-8 px-0 sm:px-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <BackPrev />
        <motion.div
          className="text-center mb-8 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 px-4 py-1 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              So‘z qidirish o‘yini
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
            Word Search Generator
          </h1>
          <p className="text-slate-600 max-w-2xl">
            {gameStarted
              ? "Sichqoncha bilan harflarni tortib, yashirilgan so‘zlarni toping."
              : "So‘zlarni qo‘shing va o‘quvchilar uchun interaktiv word-search o‘yini yarating."}
          </p>
        </motion.div>

        {!gameStarted ? (
          // So'z qo'shish sahifasi
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-slate-200/80 shadow-sm bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
                    1
                  </span>
                  So‘zlarni qo‘shish
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="So'z kiriting (masalan: SALOM)"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 placeholder:text-[13px] md:placeholder:text-base"
                    />
                    <Button onClick={addWord}>
                      <Plus className="w-4 h-4" />
                      Qo&apos;shish
                    </Button>
                  </div>

                  <div className="text-sm text-slate-600 space-y-1">
                    <p>📝 So‘z uzunligi: 3–{GRID_SIZE} harf oralig‘ida</p>
                    <p>💡 Faqat ingliz (A–Z) harflari qabul qilinadi</p>
                  </div>

                  {words.length > 0 && (
                    <motion.div
                      className="mt-6"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3 className="font-semibold mb-3 text-slate-700">
                        Qo‘shilgan so‘zlar ({words.length})
                      </h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {words.map((word) => (
                          <motion.div
                            key={word}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <span className="font-semibold text-slate-800 tracking-wide">
                              {word}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeWord(word)}
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {words.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Button
                        onClick={initializeGrid}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        O‘yinni boshlash
                      </Button>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          // O'yin sahifasi
          <motion.div
            className="grid lg:grid-cols-3 gap-6 items-start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Left panel: words & stats */}
            <Card className="lg:col-span-1 border-slate-200/80 shadow-sm bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Topish kerak bo‘lgan so‘zlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {words.map((word) => {
                    const found = foundWords.includes(word);
                    return (
                      <motion.div
                        key={word}
                        className={`p-3 rounded-lg border text-sm sm:text-base flex items-center justify-between ${
                          found
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <span
                          className={`font-semibold tracking-wide ${found ? "line-through" : ""}`}
                        >
                          {word}
                        </span>
                        {found && (
                          <Badge className="bg-emerald-500 hover:bg-emerald-500">
                            ✓
                          </Badge>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-linear-to-r from-indigo-50 via-sky-50 to-emerald-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase text-slate-500">
                      Topilgan so‘zlar
                    </span>
                    <span className="text-xs text-slate-500">
                      {foundWords.length} / {words.length}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 18,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-emerald-700">
                    {progress}% bajarildi
                  </p>
                </div>

                <div className="space-y-2 mt-4">
                  <Button onClick={initializeGrid} className="w-full ">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Yangilash
                  </Button>
                  <Button
                    onClick={resetGame}
                    variant="outline"
                    className="w-full"
                  >
                    Boshidan boshlash
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right panel: grid */}
            <Card className="lg:col-span-2 border-slate-200/80 shadow-sm bg-white/90 backdrop-blur">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-sm font-bold">
                    2
                  </span>
                  Harflar maydoni
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1.5 sm:p-6">
                <motion.div
                  className="inline-block rounded-2xl bg-slate-50 p-3 sm:p-4 border border-slate-200 shadow-inner touch-none"
                  onMouseLeave={() => {
                    if (isSelecting) {
                      handleMouseUp();
                    }
                  }}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                >
                  <div
                    className="grid gap-1 sm:gap-1.5"
                    style={{
                      gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                    }}
                  >
                    {grid.map((row, rowIdx) =>
                      row.map((cell, colIdx) => {
                        const selected = isCellSelected(rowIdx, colIdx);
                        const inFound = isCellInFoundWord(rowIdx, colIdx);

                        return (
                          <motion.button
                            key={`${rowIdx}-${colIdx}`}
                            type="button"
                            data-row={rowIdx}
                            data-col={colIdx}
                            className={`
                              w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center
                              text-xs sm:text-sm md:text-base font-bold rounded-md
                              select-none border transition-all
                              ${
                                selected
                                  ? "bg-sky-500 text-white border-sky-600 shadow-lg scale-110 z-10"
                                  : inFound
                                    ? "bg-emerald-400 text-white border-emerald-500"
                                    : "bg-white text-slate-800 border-slate-200 hover:bg-sky-50"
                              }
                            `}
                            whileHover={
                              !selected && !inFound ? { scale: 1.06 } : {}
                            }
                            whileTap={{ scale: 0.96 }}
                            onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                            onMouseEnter={() =>
                              handleMouseEnter(rowIdx, colIdx)
                            }
                          >
                            {cell}
                          </motion.button>
                        );
                      }),
                    )}
                  </div>
                </motion.div>

                <AnimatePresence>
                  {foundWords.length === words.length && words.length > 0 && (
                    <motion.div
                      className="mt-6 p-6 bg-linear-to-r from-amber-50 via-emerald-50 to-sky-50 rounded-2xl text-center border border-emerald-200"
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 20,
                      }}
                    >
                      <h3 className="text-2xl font-extrabold text-emerald-700 mb-2">
                        🎉 Tabriklaymiz! 🎉
                      </h3>
                      <p className="text-slate-700">
                        Siz barcha so‘zlarni muvaffaqiyatli topdingiz. Yangi
                        yaratib ko‘ring!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="mt-6 text-center text-xs sm:text-sm text-slate-600">
          💡{" "}
          {gameStarted
            ? "Maslahat: Faqat to‘g‘ri chiziq bo‘ylab (gorizontal, vertikal, diagonal) belgilang."
            : "Kamida bir nechta so‘z qo‘shing va o‘yinni boshlang."}
        </div>
      </div>
    </motion.div>
  );
};

export default WordSearchGame;
