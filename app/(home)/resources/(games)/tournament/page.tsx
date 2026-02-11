/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { JSX, useCallback, useEffect, useRef, useState } from "react";
import { Trophy, Shuffle, RotateCcw, FolderTree, Sparkles } from "lucide-react";
import BackPrev from "@/components/back-prev";
import { useExitGuard } from "@/hooks/use-exit-guard";

type Match = {
  player1: string | null;
  player2: string | null;
  winner: string | null;
  round: number;
  matchIndex: number;
};

type Bracket = {
  rounds: number;
  matches: Record<string, Match>;
};

const TournamentBracket = () => {
  const [playerCount, setPlayerCount] = useState<number>(16);
  const [players, setPlayers] = useState<string[]>([]);
  const [inputName, setInputName] = useState<string>("");
  const [bracket, setBracket] = useState<Bracket | null>(null);
  const [started, setStarted] = useState<boolean>(false);

  const { back: handleBack } = useExitGuard({ enabled: started });

  const [championName, setChampionName] = useState<string | null>(null);
  const [showChampionBanner, setShowChampionBanner] = useState<boolean>(false);
  const confettiRef = useRef<typeof import("canvas-confetti").default | null>(
    null,
  );

  const loadConfetti = useCallback(async () => {
    if (confettiRef.current) return confettiRef.current;
    const mod = await import("canvas-confetti");
    confettiRef.current = mod.default;
    return mod.default;
  }, []);

  useEffect(() => {
    if (!showChampionBanner) return;
    const origin = { x: 0.5, y: 0.2 };
    const colors = ["#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ef4444"];

    void loadConfetti().then((confetti) => {
      confetti({
        particleCount: 200,
        spread: 80,
        startVelocity: 45,
        ticks: 240,
        origin,
        colors,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 120,
        spread: 120,
        startVelocity: 35,
        ticks: 260,
        origin,
        colors,
        disableForReducedMotion: true,
      });
    });
  }, [loadConfetti, showChampionBanner]);

  const shuffleArray = (array: string[]): string[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const addPlayer = () => {
    if (inputName.trim() && players.length < playerCount) {
      setPlayers((prev) => [...prev, inputName.trim()]);
      setInputName("");
    }
  };

  const removePlayer = (index: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  const startTournament = () => {
    if (players.length === playerCount) {
      const shuffled = shuffleArray(players);
      const rounds = Math.log2(playerCount);

      const initialBracket: Bracket = {
        rounds,
        matches: {},
      };

      for (let round = 0; round < rounds; round++) {
        const matchesInRound = playerCount / Math.pow(2, round + 1);
        for (let i = 0; i < matchesInRound; i++) {
          const key = `round-${round}-match-${i}`;
          initialBracket.matches[key] = {
            player1: round === 0 ? shuffled[i * 2] : null,
            player2: round === 0 ? shuffled[i * 2 + 1] : null,
            winner: null,
            round,
            matchIndex: i,
          };
        }
      }

      setBracket(initialBracket);
      setStarted(true);
      setChampionName(null);
      setShowChampionBanner(false);
    }
  };

  const selectWinner = (matchKey: string, winner: string) => {
    if (!bracket) return;
    const match = bracket.matches[matchKey];
    if (!match?.player1 || !match?.player2) return;
    if (winner !== match.player1 && winner !== match.player2) return;

    const newBracket: Bracket = {
      ...bracket,
      matches: { ...bracket.matches },
    };

    newBracket.matches[matchKey] = {
      ...match,
      winner,
    };

    const currentRound = match.round;
    const nextRound = currentRound + 1;
    const nextMatchIndex = Math.floor(match.matchIndex / 2);
    const nextMatchKey = `round-${nextRound}-match-${nextMatchIndex}`;

    if (nextRound < bracket.rounds) {
      const nextMatch = newBracket.matches[nextMatchKey] || {
        player1: null,
        player2: null,
        winner: null,
        round: nextRound,
        matchIndex: nextMatchIndex,
      };

      if (match.matchIndex % 2 === 0) {
        nextMatch.player1 = winner;
      } else {
        nextMatch.player2 = winner;
      }

      newBracket.matches[nextMatchKey] = nextMatch;
    } else {
      setChampionName(winner);
      setShowChampionBanner(true);
    }

    setBracket(newBracket);
  };

  const clearWinner = (matchKey: string) => {
    if (!bracket) return;
    const match = bracket.matches[matchKey];
    if (!match?.winner) return;

    const removedWinner = match.winner;
    const newBracket: Bracket = {
      ...bracket,
      matches: { ...bracket.matches },
    };

    newBracket.matches[matchKey] = {
      ...match,
      winner: null,
    };

    if (championName === removedWinner) {
      setChampionName(null);
      setShowChampionBanner(false);
    }

    let currentRound = match.round;
    let currentMatchIndex = match.matchIndex;
    let shouldContinue = true;

    while (shouldContinue && currentRound < bracket.rounds - 1) {
      const nextRound = currentRound + 1;
      const nextMatchIndex = Math.floor(currentMatchIndex / 2);
      const nextMatchKey = `round-${nextRound}-match-${nextMatchIndex}`;
      const nextMatch = newBracket.matches[nextMatchKey];
      if (!nextMatch) break;

      const updatedNextMatch = { ...nextMatch };
      const comesFromLeft = currentMatchIndex % 2 === 0;

      if (comesFromLeft && updatedNextMatch.player1 === removedWinner) {
        updatedNextMatch.player1 = null;
      } else if (!comesFromLeft && updatedNextMatch.player2 === removedWinner) {
        updatedNextMatch.player2 = null;
      }

      const removedWasWinner = updatedNextMatch.winner === removedWinner;
      if (removedWasWinner) {
        updatedNextMatch.winner = null;
      }

      newBracket.matches[nextMatchKey] = updatedNextMatch;

      if (removedWasWinner) {
        currentRound = nextRound;
        currentMatchIndex = nextMatchIndex;
      } else {
        shouldContinue = false;
      }
    }

    setBracket(newBracket);
  };

  const reset = () => {
    setPlayers([]);
    setBracket(null);
    setStarted(false);
    setInputName("");
    setChampionName(null);
    setShowChampionBanner(false);
  };

  const getMatchesForRound = (round: number) => {
    if (!bracket) return [] as (Match & { key: string })[];
    return Object.entries(bracket.matches)
      .filter(([_, match]) => match.round === round)
      .map(([key, match]) => ({ key, ...match }))
      .sort((a, b) => a.matchIndex - b.matchIndex);
  };

  const getRoundName = (round: number, totalRounds: number) => {
    if (round === totalRounds - 1) return "Final";
    if (round === totalRounds - 2) return "Yarim final";
    if (round === totalRounds - 3) return "Chorak final";
    return `${round + 1}-bosqich`;
  };

  // ---------- INTRO SCREEN ----------
  if (!started) {
    return (
      <div className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 py-1 px-2 sm:p-10 flex flex-col items-center justify-center">
        <div className="max-w-5xl w-full bg-white/90 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white flex flex-col sm:flex-row gap-6">
          <div className="">
            <BackPrev onBack={handleBack} />
          </div>
          {/* LEFT SIDE - INTRO */}
          <div className="sm:w-1/2 flex flex-col justify-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Turnir O'yini 🎮
            </h1>
            <p className="text-sm sm:text-base text-slate-700">
              Bu o'quvchilar uchun maxsus turnir o'yini. 8 yoki 16 nafar
              o'quvchilar ishtirok etadi va turnirda g'olib bolish uchun
              kurashishadi. Siz bracketni to'ldirib, g'olibni kuzatishingiz
              mumkin.
            </p>
            <ul className="text-slate-600 list-disc pl-5 mt-2 text-sm sm:text-base">
              <li>O'quvchilar sonini tanlang (8 yoki 16)</li>
              <li>O'quvchilarni qo'shing</li>
              <li>Turnirni boshlash tugmasini bosing</li>
              <li>
                Har bir juftlik ishtirokchisiga savol berish orqali juftlik
                g'olibini aniqlang. Ismi joylashgan qismga bosish orqali
                o‘quvchi keyingi bosqichga chiqadi.
              </li>
            </ul>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="sm:w-1/2 flex flex-col gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                O'quvchilar soni
              </label>
              <div className="flex gap-3">
                {[8, 16].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      setPlayerCount(count);
                      setPlayers([]);
                    }}
                    className={`flex-1 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold border transition-all ${
                      playerCount === count
                        ? "bg-sky-600 text-white border-sky-600 shadow-md scale-[1.02]"
                        : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {count} o'quvchi
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                O'quvchi ismi qo'shing ({players.length}/{playerCount})
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                  placeholder="Ism kiriting..."
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  disabled={players.length >= playerCount}
                />
                <button
                  onClick={addPlayer}
                  disabled={players.length >= playerCount || !inputName.trim()}
                  className="px-5 sm:px-6 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  Qo'shish
                </button>
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto border border-dashed border-slate-200 rounded-2xl p-3 bg-slate-50/60">
              {players.map((player, index) => (
                <div
                  key={player + index}
                  className="flex items-center justify-between bg-white rounded-xl px-3 py-2 mb-2 shadow-sm"
                >
                  <span className="text-sm text-slate-700">
                    {index + 1}. {player}
                  </span>
                  <button
                    onClick={() => removePlayer(index)}
                    className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
                  >
                    O'chirish
                  </button>
                </div>
              ))}
              {players.length === 0 && (
                <p className="text-xs text-slate-400 text-center mt-4">
                  Hozircha o'quvchi qo'shilmagan.
                </p>
              )}
            </div>

            <button
              onClick={startTournament}
              disabled={players.length !== playerCount}
              className="w-full py-3.5 bg-linear-to-r from-emerald-500 to-sky-600 text-white rounded-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed"
            >
              <Shuffle className="w-4 h-4" />
              Turnirni boshlash
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- BRACKET SCREEN ----------
  if (!bracket) return null;

  const finalMatches = getMatchesForRound(bracket.rounds - 1);
  const finalMatch = finalMatches[0];

  const getSideMatchesForRound = (
    round: number,
    side: "left" | "right",
  ): (Match & { key: string })[] => {
    if (round === bracket.rounds - 1) return [];
    const matches = getMatchesForRound(round);
    const half = Math.max(1, matches.length / 2);
    if (side === "left") return matches.slice(0, half);
    return matches.slice(half).reverse();
  };

  const PlayerButton = ({
    match,
    player,
    align,
  }: {
    match: Match & { key: string };
    player: string | null;
    align: "left" | "right";
  }) => {
    const isWinner = !!match.winner && match.winner === player;
    const canSelectWinner = !!player && !!match.player1 && !!match.player2 && !match.winner;
    const canClearWinner = isWinner;
    const isClickable = canSelectWinner || canClearWinner;

    return (
      <div className="relative inline-block">
        <button
          disabled={!isClickable}
          onClick={() =>
            player &&
            (canSelectWinner
              ? selectWinner(match.key, player)
              : canClearWinner && clearWinner(match.key))
          }
          className={`min-w-[140px] sm:min-w-40 text-xs sm:text-sm leading-tight px-2 py-1.5 rounded border-2 transition-all
            ${align === "right" ? "text-right" : "text-left"}
            ${
              !player
                ? "opacity-40 cursor-default border-slate-200 bg-slate-50"
                : ""
            }
            ${
              isWinner
                ? "bg-amber-100 border-amber-500 font-semibold shadow-md"
                : "border-slate-300 bg-white hover:bg-slate-50"
            }
            ${isClickable ? "cursor-pointer" : "cursor-default"}`}
        >
          {player || "Kutilmoqda..."}
        </button>
        {isWinner && (
          <button
            aria-label="Tanlovni bekor qilish"
            onClick={() => clearWinner(match.key)}
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-white border border-rose-300 text-[10px] font-black text-rose-600 shadow-sm hover:bg-rose-50 active:scale-95 transition-all"
          >
            ×
          </button>
        )}
      </div>
    );
  };

  const SideColumn = ({ side }: { side: "left" | "right" }): JSX.Element => {
    const roundsArray = [...Array(bracket.rounds - 1)].map((_, i) => i);

    const SPACING_16 = [
      { mt: 0, gap: 18 },
      { mt: 46, gap: 107 },
      { mt: 136, gap: 130 },
    ];
    const SPACING_8 = [
      { mt: 0, gap: 24 },
      { mt: 49, gap: 80 },
    ];

    const is16 = playerCount === 16;
    const spacingArr = is16 ? SPACING_16 : SPACING_8;

    return (
      <div
        className={`flex ${
          side === "left" ? "flex-row" : "flex-row-reverse"
        } gap-0`}
      >
        {roundsArray.map((roundIndex) => {
          const matches = getSideMatchesForRound(roundIndex, side);
          if (!matches.length) return null;

          const spacing = spacingArr[roundIndex] || {
            mt: 0,
            gap: 24 * (roundIndex + 1),
          };

          const lineWidth = 32; // Width of connecting lines between rounds

          return (
            <div key={`${side}-round-${roundIndex}`} className="flex">
              {/* Matches column */}
              <div
                className="flex flex-col relative"
                style={{
                  marginTop: spacing.mt,
                  rowGap: spacing.gap,
                }}
              >
                {matches.map((match, matchIdx) => {
                  const isPairStart = matchIdx % 2 === 0;
                  const matchHeight = 52; // Height of match box

                  return (
                    <div key={match.key} className="relative flex items-center">
                      <div
                        className={`flex items-center ${
                          side === "left" ? "flex-row" : "flex-row-reverse"
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <PlayerButton
                            match={match}
                            player={match.player1}
                            align={side === "left" ? "left" : "right"}
                          />
                          <PlayerButton
                            match={match}
                            player={match.player2}
                            align={side === "left" ? "left" : "right"}
                          />
                        </div>
                      </div>

                      {/* Vertical connector for pairs */}
                      {isPairStart && matchIdx < matches.length - 1 && (
                        <div
                          className={`absolute ${
                            side === "left" ? "-right-4" : "-left-4"
                          } top-1/2 mt-1 w-px bg-slate-400`}
                          style={{
                            height: spacing.gap + matchHeight + 10,
                          }}
                        />
                      )}

                      {/* Horizontal line from middle of pair to next round -
                       */}
                      {isPairStart && roundIndex < bracket.rounds - 2 && (
                        <div
                          className={`absolute ${
                            side === "left" ? "-right-8" : "-left-8"
                          } w-4 h-px bg-slate-400`}
                          style={{
                            top: `calc(50% + ${
                              (spacing.gap + matchHeight + 21) / 2
                            }px)`,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Spacing between rounds */}
              <div style={{ width: lineWidth }} />
            </div>
          );
        })}
      </div>
    );
  };

  const roundLabels = [...Array(bracket.rounds)].map((_, idx) =>
    getRoundName(idx, bracket.rounds),
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 overflow-x-auto relative">
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-slate-900 flex items-center justify-center bg-white">
            <Trophy className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
              Turnir jadvali
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                <FolderTree className="w-4 h-4" />
                Bracket
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Chorak final, yarim final va final bosqichlari
            </p>
          </div>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-900 bg-white text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Qayta boshlash
        </button>
      </div>

      <div className="max-w-7xl mx-auto mb-4 flex flex-wrap items-center justify-center gap-3 text-[10px] sm:text-xs text-slate-500">
        {roundLabels.map((label, i) => (
          <span
            key={label + i}
            className="px-2 py-1 rounded-full border border-slate-300 bg-white/80 font-medium"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Champion Banner */}
      {showChampionBanner && championName && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-linear-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
            <div className="flex items-center justify-center gap-4">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
                  🏆 G'olib: {championName}
                </h2>
                <p className="text-sm text-amber-900 font-semibold">
                  Tabriklaymiz! Turnir g'olibi!
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* BRACKET */}
      <div className="max-w-7xl mx-auto flex items-stretch justify-center gap-0 py-6">
        <SideColumn side="left" />

        {/* CENTER - Trophy & Final */}
        <div className="flex flex-col items-center justify-center gap-6 relative px-8">
          <div className="relative">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-amber-500 bg-linear-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-xl">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />
            </div>
            {championName && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                ✓
              </div>
            )}
          </div>

          {finalMatch && (
            <div className="flex flex-col gap-1">
              <PlayerButton
                match={finalMatch}
                player={finalMatch.player1}
                align="left"
              />
              <PlayerButton
                match={finalMatch}
                player={finalMatch.player2}
                align="left"
              />
            </div>
          )}

          <div className="text-center">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Final
            </p>
          </div>
        </div>

        <SideColumn side="right" />
      </div>
    </div>
  );
};

export default TournamentBracket;
