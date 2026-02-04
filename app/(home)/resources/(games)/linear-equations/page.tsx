"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackPrev from "@/components/back-prev";
import { generateLinearEquationsPdf } from "../pdf-actions";
import { downloadBase64File } from "@/utils/download-base64";
import { useExitGuard } from "@/hooks/use-exit-guard";

type Magnitude = "small" | "medium" | "large";

type EquationItem = {
  text: string;
  solution: number;
};

const formatNumber = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(Math.trunc(n));

const randBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRange = (magnitude: Magnitude) => {
  if (magnitude === "small")
    return { coeff: [5, 90], constant: [10, 500], tail: [50, 1_000] };
  if (magnitude === "medium")
    return { coeff: [80, 900], constant: [500, 20_000], tail: [5_000, 60_000] };
  return {
    coeff: [1_000, 9_000],
    constant: [50_000, 400_000],
    tail: [80_000, 600_000],
  };
};

const buildEquation = (magnitude: Magnitude): EquationItem => {
  const ranges = getRange(magnitude);
  const solution = randBetween(2, 120);
  const m1 = randBetween(2, 6);
  const m2 = randBetween(2, 6);

  const c1 = randBetween(ranges.coeff[0], ranges.coeff[1]);
  const k1 = randBetween(ranges.constant[0], ranges.constant[1]);
  const c2 = randBetween(ranges.coeff[0], ranges.coeff[1]);
  const k2 = randBetween(ranges.constant[0], ranges.constant[1]);
  const tailConst = randBetween(ranges.tail[0], ranges.tail[1]);

  const sign1 = Math.random() > 0.5 ? 1 : -1;
  const sign2 = Math.random() > 0.5 ? 1 : -1;
  const between = Math.random() > 0.5 ? 1 : -1;
  const tailSign = Math.random() > 0.5 ? 1 : -1;

  const group1 = m1 * (c1 * solution + sign1 * k1);
  const group2 = m2 * (c2 * solution + sign2 * k2);
  const rhs = group1 + between * group2 + tailSign * tailConst;

  const signToStr = (v: number) => (v === 1 ? "+" : "−");

  const text = `${m1}(${formatNumber(c1)}x ${signToStr(sign1)} ${formatNumber(
    k1,
  )}) ${signToStr(between)} ${m2}(${formatNumber(c2)}x ${signToStr(
    sign2,
  )} ${formatNumber(k2)}) ${signToStr(tailSign)} ${formatNumber(
    tailConst,
  )} = ${formatNumber(rhs)}`;

  return { text, solution };
};

export default function LinearEquationGenerator() {
  const [magnitude, setMagnitude] = useState<Magnitude>("medium");
  const [count, setCount] = useState(30);
  const [equations, setEquations] = useState<EquationItem[]>([]);
  const [downloadMode, setDownloadMode] = useState<
    "no-answers" | "answers" | null
  >(null);

  const hasWork = equations.length > 0;
  const { back: handleBack } = useExitGuard({ enabled: hasWork });

  const generate = () => {
    const items = Array.from({ length: count }, () => buildEquation(magnitude));
    setEquations(items);
  };

  const downloadPdf = async (withAnswers: boolean) => {
    if (equations.length === 0 || downloadMode) return;
    setDownloadMode(withAnswers ? "answers" : "no-answers");
    try {
      const result = await generateLinearEquationsPdf({
        title: "Chiziqli tenglamalar (x toping)",
        withAnswers,
        equations,
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
            <CardHeader className="px-0 pt-5 sm:pt-1 pb-4">
              <CardTitle className="text-2xl font-bold text-slate-800">
                ✖️ Chiziqli tenglama generatori
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <div>
                <label className="font-semibold text-sm">
                  Misollar darajasini tanlang
                </label>
                <select
                  value={magnitude}
                  onChange={(e) => setMagnitude(e.target.value as Magnitude)}
                  className="w-full mt-1 border rounded-xl px-3 py-2 text-sm"
                >
                  <option value="small">oddiy</option>
                  <option value="medium">O‘rta</option>
                  <option value="large">Murakkab</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-sm">
                  Tenglamalar sonini tanlang
                </label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full mt-1 border rounded-xl px-3 py-2 text-sm"
                >
                  <option value={20}>20 ta</option>
                  <option value={30}>30 ta</option>
                  <option value={50}>50 ta</option>
                </select>
              </div>

              <Button
                onClick={generate}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-3 font-semibold mt-1"
              >
                🌀 Tenglamalarni generatsiya qilish
              </Button>

              {equations.length > 0 && (
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
            {equations.length === 0 ? (
              <div className="h-full flex items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-500 text-center">
                Misollar darajasini va sonini tanlang va generatsiya qilish
                tugmasini bosing.
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl px-4 py-5  md:p-10">
                <h1 className="text-center text-3xl font-bold mb-6 text-slate-800">
                  Chiziqli tenglamalar (x ni toping)
                </h1>

                <div className="space-y-4">
                  {equations.map((eq, i) => (
                    <div
                      key={`${eq.text}-${i}`}
                      className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-3"
                    >
                      <span className="text-xs text-slate-500 md:w-12">
                        {i + 1}){" "}
                      </span>
                      <span className="font-sans text-base text-slate-800 flex-1">
                        {eq.text}
                      </span>
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
