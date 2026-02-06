/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import BackPrev from "@/components/back-prev";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExitGuard } from "@/hooks/use-exit-guard";
import { generateLinearMathPdf } from "../pdf-actions";
import { downloadBase64File } from "@/utils/download-base64";

type Operation = "+" | "-";
type OperationMode = "mix" | "plus" | "minus";

type Exercise = {
  terms: number[];
  ops: Operation[];
  result: number;
};

type BuildConfig = {
  termsCount: 2 | 3;
  minValue: number;
  maxValue: number;
  operationMode: OperationMode;
};

const randBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickOperation = (mode: OperationMode): Operation => {
  if (mode === "plus") return "+";
  if (mode === "minus") return "-";
  return Math.random() > 0.5 ? "+" : "-";
};

const buildExercise = ({
  termsCount,
  minValue,
  maxValue,
  operationMode,
}: BuildConfig): Exercise => {
  const steps = termsCount - 1;
  const attempts = 120;

  const pickStart = () => {
    if (operationMode === "plus") {
      const maxStart = maxValue - steps * minValue;
      return randBetween(minValue, Math.max(minValue, maxStart));
    }
    if (operationMode === "minus") {
      const minStart = minValue + steps * minValue;
      return randBetween(Math.min(minStart, maxValue), maxValue);
    }
    return randBetween(minValue, maxValue);
  };

  const getRange = (
    current: number,
    op: Operation,
    remainingSteps: number,
    strictFuture: boolean,
  ) => {
    const minOp = minValue;
    let maxOp = op === "+" ? maxValue - current : current - minValue;

    if (strictFuture) {
      if (op === "+") {
        const cap = maxValue - current - remainingSteps * minValue;
        maxOp = Math.min(maxOp, cap);
      } else {
        const cap = current - (minValue + remainingSteps * minValue);
        maxOp = Math.min(maxOp, cap);
      }
    }

    if (maxOp < minOp) return null;
    return { minOp, maxOp };
  };

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const terms: number[] = [];
    const ops: Operation[] = [];
    let current = pickStart();
    terms.push(current);

    let ok = true;

    for (let step = 0; step < steps; step += 1) {
      const remaining = steps - step - 1;
      const strictFuture = operationMode !== "mix";

      let op: Operation | null = null;
      let range: { minOp: number; maxOp: number } | null = null;

      if (operationMode === "mix") {
        const plusRange = getRange(current, "+", remaining, false);
        const minusRange = getRange(current, "-", remaining, false);

        if (plusRange && minusRange) {
          op = Math.random() > 0.5 ? "+" : "-";
          range = op === "+" ? plusRange : minusRange;
        } else if (plusRange) {
          op = "+";
          range = plusRange;
        } else if (minusRange) {
          op = "-";
          range = minusRange;
        } else {
          ok = false;
          break;
        }
      } else {
        op = pickOperation(operationMode);
        range = getRange(current, op, remaining, strictFuture);
        if (!range) {
          ok = false;
          break;
        }
      }

      const value = randBetween(range.minOp, range.maxOp);
      terms.push(value);
      ops.push(op);
      current = op === "+" ? current + value : current - value;
    }

    if (!ok) continue;

    return {
      terms,
      ops,
      result: current,
    };
  }

  const fallbackTerms = Array.from({ length: termsCount }, () => minValue);
  const fallbackOps: Operation[] = Array.from({ length: termsCount - 1 }, () =>
    operationMode === "minus" ? "-" : "+",
  );
  const fallbackResult = fallbackTerms.reduce((acc, value, index) => {
    if (index === 0) return value;
    const op = fallbackOps[index - 1];
    return op === "+" ? acc + value : acc - value;
  }, 0);

  return {
    terms: fallbackTerms,
    ops: fallbackOps,
    result: fallbackResult,
  };
};

const formatExpression = (exercise: Exercise) =>
  exercise.terms
    .map((value, index) => {
      if (index === 0) return `${value}`;
      const op = exercise.ops[index - 1] === "-" ? "−" : "+";
      return `${op} ${value}`;
    })
    .join(" ");

export default function LinearMathPage() {
  const [titleName, setTitleName] = useState("");
  const [count, setCount] = useState(45);
  const [digits, setDigits] = useState<1 | 2>(1);
  const [termsCount, setTermsCount] = useState<2 | 3>(3);
  const [operationMode, setOperationMode] = useState<OperationMode>("mix");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [downloadMode, setDownloadMode] = useState<
    "no-answers" | "answers" | null
  >(null);

  const hasWork = exercises.length > 0 || titleName.trim().length > 0;
  const { back: handleBack } = useExitGuard({ enabled: hasWork });

  const title = titleName.trim() || `Misollar`;
  const range =
    digits === 1
      ? { minValue: 1, maxValue: 9 }
      : { minValue: 10, maxValue: 99 };

  const generate = () => {
    const items = Array.from({ length: count }, () =>
      buildExercise({
        termsCount,
        minValue: range.minValue,
        maxValue: range.maxValue,
        operationMode,
      }),
    );

    setExercises(items);
  };

  const downloadPdf = async (withAnswers: boolean = false) => {
    if (exercises.length === 0 || downloadMode) return;
    setDownloadMode(withAnswers ? "answers" : "no-answers");
    try {
      const result = await generateLinearMathPdf({
        title,
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
      <div className="max-w-7xl mx-auto">
        <BackPrev onBack={handleBack} />
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          <Card className="p-6 shadow-xl rounded-3xl bg-white/90 border border-white">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-2xl font-bold text-slate-800">
                Chiziqli misollar
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
                    placeholder="Masalan: 1-sinf misollar"
                    className="w-full mt-1 border rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-sm">Misollar soni</label>
                  <select
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full mt-1 border rounded-xl px-3 py-2 text-sm"
                  >
                    <option value={20}>20 ta</option>
                    <option value={30}>30 ta</option>
                    <option value={45}>45 ta</option>
                    <option value={60}>60 ta</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-sm">Sonlar xonasi</label>
                  <select
                    value={digits}
                    onChange={(e) => setDigits(Number(e.target.value) as 1 | 2)}
                    className="w-full mt-1 border rounded-xl px-3 py-2 text-sm"
                  >
                    <option value={1}>1 xonali</option>
                    <option value={2}>2 xonali</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-sm">Amallar soni</label>
                  <select
                    value={termsCount}
                    onChange={(e) =>
                      setTermsCount(Number(e.target.value) as 2 | 3)
                    }
                    className="w-full mt-1 border rounded-xl px-3 py-2 text-sm"
                  >
                    <option value={2}>2 amal (a ± b)</option>
                    <option value={3}>3 amal (a ± b ± c)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-sm">Amal turi</label>
                  <select
                    value={operationMode}
                    onChange={(e) =>
                      setOperationMode(e.target.value as OperationMode)
                    }
                    className="w-full mt-1 border rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="mix">Aralash</option>
                    <option value="plus">Faqat qo'shish (+)</option>
                    <option value="minus">Faqat ayirish (−)</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={generate}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-3 font-semibold mt-2"
              >
                🌀 Misollarni generatsiya qilish
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
                Parametrlarni tanlang va "Misollarni generatsiya qilish"
                tugmasini bosing.
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
                <div className="mb-6">
                  <h1 className="text-2xl text-center sm:text-3xl font-bold text-slate-800">
                    {title}
                  </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-5 text-base">
                  {exercises.map((exercise, index) => (
                    <div
                      key={`${exercise.result}-${index}`}
                      className="flex items-center gap-3"
                    >
                      <span className="text-[11px] text-slate-400 w-6 text-right">
                        {index + 1})
                      </span>
                      <div className="flex items-center gap-3 w-full flex-wrap border-b border-dashed border-slate-200 pb-2">
                        <span className="font-mono text-base text-slate-900">
                          {formatExpression(exercise)}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-slate-500 font-semibold">
                            =
                          </span>
                          <span className="w-7 h-7 border border-slate-700 rounded-xs flex items-center justify-center text-sm font-semibold bg-white" />
                        </div>
                      </div>
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
