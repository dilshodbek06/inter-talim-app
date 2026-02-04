/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackPrev from "@/components/back-prev";
import { generateFractionAddPdf } from "../pdf-actions";
import { downloadBase64File } from "@/utils/download-base64";
import { useExitGuard } from "@/hooks/use-exit-guard";

type FractionExercise = {
  a: number;
  b: number;
  c: number;
  d: number;
};

const generateDenominator = (digits: 1 | 2 | 3) => {
  const min = digits === 1 ? 2 : digits === 2 ? 10 : 100;
  const max = digits === 1 ? 9 : digits === 2 ? 99 : 999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function FractionWorksheet() {
  const [denominatorDigits, setDenominatorDigits] = useState<1 | 2 | 3>(1);
  const [sameDenominator, setSameDenominator] = useState(false);
  const [exercises, setExercises] = useState<FractionExercise[]>([]);
  const [titleName, setTitleName] = useState("");
  const [downloadMode, setDownloadMode] = useState<
    "no-answers" | "answers" | null
  >(null);

  const hasWork = exercises.length > 0 || titleName.trim().length > 0;
  const { back: handleBack } = useExitGuard({ enabled: hasWork });

  const getTitle = () =>
    titleName.trim() || "Kasrlarni qo'shish bo'yicha 50 ta misol";

  const generateExercise = (
    digits: 1 | 2 | 3,
    unified: boolean,
  ): FractionExercise => {
    const baseDen = generateDenominator(digits);
    const b = unified ? baseDen : generateDenominator(digits);
    const d = unified ? baseDen : generateDenominator(digits);
    const a = Math.floor(Math.random() * (b - 1)) + 1;
    const c = Math.floor(Math.random() * (d - 1)) + 1;
    return { a, b, c, d };
  };

  const generateWorksheet = () => {
    const arr = Array.from({ length: 50 }, () =>
      generateExercise(denominatorDigits, sameDenominator),
    );
    setExercises(arr);
  };

  const downloadPdf = async (withAnswers: boolean = false) => {
    if (exercises.length === 0 || downloadMode) return;
    setDownloadMode(withAnswers ? "answers" : "no-answers");
    try {
      const result = await generateFractionAddPdf({
        title: getTitle(),
        withAnswers,
        exercises,
      });
      downloadBase64File({
        base64: result.base64,
        filename: result.filename,
      });
    } finally {
      setDownloadMode(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 py-3 px-2">
      <div className="max-w-6xl mx-auto">
        <BackPrev onBack={handleBack} />
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          <Card className="p-6 shadow-xl rounded-3xl bg-white/90 border border-white">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-2xl font-bold text-slate-800">
                ➕ Kasrli misollar generatori
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-sm">
                    Sarlavha / Ism
                  </label>
                  <input
                    type="text"
                    value={titleName}
                    onChange={(e) => setTitleName(e.target.value)}
                    placeholder="Masalan: 5-sinf kasrlar"
                    className="w-full mt-1 border rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="font-semibold text-sm">
                    Maxraj necha xonali bo'lsin?
                  </label>
                  <select
                    value={denominatorDigits}
                    onChange={(e) =>
                      setDenominatorDigits(Number(e.target.value) as 1 | 2 | 3)
                    }
                    className="w-full mt-1 border rounded-xl px-3 py-2 text-sm"
                  >
                    <option value={1}>1 xonali maxraj (2-9)</option>
                    <option value={2}>2 xonali maxraj (10-99)</option>
                    <option value={3}>3 xonali maxraj (100-999)</option>
                  </select>
                  <label className="flex items-center gap-2 mt-3 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={sameDenominator}
                      onChange={(e) => setSameDenominator(e.target.checked)}
                      className="h-4 w-4 accent-sky-600"
                    />
                    Maxraji bir xil bo'lsin
                  </label>
                </div>
              </div>

              <Button
                onClick={generateWorksheet}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-3 font-semibold mt-3"
              >
                🌀 50 ta kasrli misollarni generatsiya qilish
              </Button>

              {exercises.length > 0 && (
                <div className="space-y-2">
                  <Button
                    onClick={() => downloadPdf(false)}
                    disabled={downloadMode !== null}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold"
                  >
                    {downloadMode === "no-answers"
                      ? "⏳ Tayyorlanmoqda..."
                      : "📄 PDF yuklab olish (javobsiz)"}
                  </Button>
                  <Button
                    onClick={() => downloadPdf(true)}
                    disabled={downloadMode !== null}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-3 font-semibold"
                  >
                    {downloadMode === "answers"
                      ? "⏳ Tayyorlanmoqda..."
                      : "📄 Javoblari bilan yuklab olish"}
                  </Button>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 sm:hidden">
                    Mobil brauzerda PDF yuklab olish cheklangan bo‘lishi mumkin.
                    Iltimos, saytni tashqi brauzerda oching: yuqori o‘ng
                    burchakdagi (⋮) menyuni bosing.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="w-full">
            {exercises.length === 0 ? (
              <div className="h-full flex items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-500 text-center">
                Sozlamalardan maxraj uzunligini tanlang va generatsiya qilish
                tugmasini bosing.
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
                <h1 className="text-center text-3xl font-bold mb-6 text-slate-800">
                  {getTitle()}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-lg">
                  {exercises.map((ex, i) => {
                    return (
                      <div
                        key={`${ex.a}-${ex.b}-${ex.c}-${ex.d}-${i}`}
                        className="font-mono bg-slate-50 border border-slate-200 rounded-2xl p-4"
                      >
                        <p className="text-xs text-slate-500 mb-2">
                          {i + 1}-misol
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center min-w-12">
                            <span>{ex.a}</span>
                            <span className="w-full border-b border-slate-800" />
                            <span>{ex.b}</span>
                          </div>
                          <span className="font-bold text-slate-700">+</span>
                          <div className="flex flex-col items-center min-w-12">
                            <span>{ex.c}</span>
                            <span className="w-full border-b border-slate-800" />
                            <span>{ex.d}</span>
                          </div>
                          <span className="font-bold text-slate-700">=</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
