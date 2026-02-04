/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackPrev from "@/components/back-prev";
import { generateWordScramblePdf } from "../pdf-actions";
import { downloadBase64File } from "@/utils/download-base64";
import { useExitGuard } from "@/hooks/use-exit-guard";

const DEFAULT_RAW_WORDS = "davlat\nfutbol\nhayot\nbahor";

export default function WordScrambleGame() {
  const [rawWords, setRawWords] = useState(DEFAULT_RAW_WORDS);
  const [words, setWords] = useState<string[]>([]);
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [titleText, setTitleText] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const hasWork =
    words.length > 0 ||
    titleText.trim().length > 0 ||
    rawWords.trim() !== DEFAULT_RAW_WORDS.trim();
  const { back: handleBack } = useExitGuard({ enabled: hasWork });

  const effectiveTitle =
    titleText.trim().length > 0 ? titleText.trim() : "Aralash so'zlar";

  const scrambleWord = (word: string): string => {
    const chars = word.split("");
    for (let i = chars.length - 1; i > 0; i--) {
      // eslint-disable-next-line react-hooks/purity
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    const result = chars.join("");

    if (result.toLowerCase() === word.toLowerCase() && word.length > 1) {
      return scrambleWord(word);
    }
    return result;
  };

  const startGame = () => {
    const list = rawWords
      .split(/\r?\n/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    setWords(list);
    setScrambled(list.map((w) => scrambleWord(w)));
  };

  const downloadPdf = async () => {
    if (!words.length || isDownloading) return;
    setIsDownloading(true);
    try {
      const result = await generateWordScramblePdf({
        title: effectiveTitle,
        words: scrambled,
      });
      downloadBase64File({
        base64: result.base64,
        filename: result.filename,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 py-3 px-2">
      <div className="max-w-6xl mx-auto">
        <BackPrev onBack={handleBack} />
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          {/* LEFT – SETTINGS */}
          <Card className="p-6 pt-10 shadow-xl rounded-3xl bg-white/90 border border-white">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-2xl font-bold text-slate-800">
                🔤 Aralash Soʻzlar Generatori
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              {/* Title input */}
              <div>
                <label htmlFor="name" className="font-semibold text-sm">
                  Sarlavha (tepada chiqadi)
                </label>
                <input
                  id="name"
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  className="w-full mt-1 border rounded-xl px-3 py-2 text-sm"
                  placeholder="Masalan: 4-sinf Ali"
                />
              </div>

              {/* Words textarea */}
              <div>
                <label htmlFor="word" className="font-semibold text-sm">
                  So'zlar ro'yxati (har qatorda bitta so'z)
                </label>
                <textarea
                  id="word"
                  value={rawWords}
                  onChange={(e) => setRawWords(e.target.value)}
                  rows={8}
                  className="w-full mt-1 border rounded-xl px-3 py-2 text-sm resize-none"
                  placeholder={"hello\nworld\nsmile\nyoung"}
                />
              </div>

              <Button
                onClick={startGame}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-3 font-semibold"
              >
                ▶️ Generatsiya qilish
              </Button>

              {words.length > 0 && (
                <>
                  <Button
                    onClick={downloadPdf}
                    disabled={isDownloading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold"
                  >
                    {isDownloading
                      ? "⏳ Tayyorlanmoqda..."
                      : "📄 Yuklab olish (pdf)"}
                  </Button>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 sm:hidden">
                    Mobil brauzerda PDF yuklab olish cheklangan bo‘lishi mumkin.
                    Iltimos, saytni tashqi brauzerda oching: yuqori o‘ng
                    burchakdagi (⋮) menyuni bosing.
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* RIGHT – PREVIEW */}
          <div className="w-full">
            {words.length === 0 ? (
              <div className="h-full flex items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-500 text-center">
                So'zlarni har yangi qatorda kiriting va generatsiya qilish
                tugmasini bosing.
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl p-10">
                <h1 className="text-center text-3xl font-bold mb-10">
                  {effectiveTitle}
                </h1>

                <div className="space-y-6">
                  {scrambled.map((scr, i) => (
                    <div key={i} className="flex items-center gap-10 text-lg">
                      <span className="w-40 tracking-[0.2em] uppercase">
                        {scr}
                      </span>
                      {/* chiziq biroz kichikroq */}
                      <div className="border-b-2 border-black w-40 mt-2.5 sm:w-44" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
