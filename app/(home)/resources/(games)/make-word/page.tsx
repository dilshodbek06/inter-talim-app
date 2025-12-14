/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackPrev from "@/components/back-prev";

export default function WordScrambleGame() {
  const [rawWords, setRawWords] = useState("davlat\nfutbol\nhayot\nbahor");
  const [words, setWords] = useState<string[]>([]);
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [titleText, setTitleText] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

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

  const downloadPdf = () => {
    if (!words.length) return;

    const win = window.open("", "", "width=800,height=600");
    if (!win) return;

    const rows = scrambled
      .map(
        (scr) => `
        <div class="row">
          <div class="scrambled">${scr.toUpperCase()}</div>
          <div class="line"></div>
        </div>
      `
      )
      .join("");

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${effectiveTitle}</title>
          <style>
            @media print {
              @page { margin: 1cm; }
              body { margin: 0; }
            }
            body {
              font-family: Arial, Helvetica, sans-serif;
              padding: 40px 60px;
              background: white;
            }
            h1 {
              text-align: center;
              font-size: 28px;
              margin-bottom: 40px;
            }
            .row {
              display: flex;
              align-items: center;
              margin-bottom: 24px;
            }
            .scrambled {
              width: 160px;
              font-size: 20px;
              letter-spacing: 0.18em;
            }
            .line {
              border-bottom: 2px solid black;
              margin-left: 40px;
              margin-top:11px;
              width: 180px; /* kichikroq chiziq */
            }
          </style>
        </head>
        <body>
          <h1>${effectiveTitle}</h1>
          ${rows}
        </body>
      </html>
    `);

    win.document.close();

    setTimeout(() => {
      win.print();
      win.onafterprint = () => win.close();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 py-3 px-2">
      <div className="max-w-6xl mx-auto">
        <BackPrev />
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
                <Button
                  onClick={downloadPdf}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold"
                >
                  📄 Yuklab olish (pdf)
                </Button>
              )}
            </CardContent>
          </Card>

          {/* RIGHT – PREVIEW */}
          <div className="w-full">
            {words.length === 0 ? (
              <div className="h-full flex items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-500 text-center">
                So'zlarni chap tomonga kiriting va{" "}
                <span className="font-semibold mx-1">"Generatsiya qilish"</span>{" "}
                tugmasini bosing.
              </div>
            ) : (
              <div
                ref={printRef}
                className="bg-white rounded-3xl shadow-2xl p-10"
              >
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
