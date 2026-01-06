/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackPrev from "@/components/back-prev";

export default function WorksheetGenerator() {
  const [digit, setDigit] = useState(2);
  const [operation, setOperation] = useState<"+" | "-" | "*">("-");
  const [exercises, setExercises] = useState<{ a: number; b: number }[]>([]);
  const [titleName, setTitleName] = useState(""); // ism / sarlavha
  const printRef = useRef<HTMLDivElement>(null);

  const generateNumber = (digits: number) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getTitle = () => {
    if (titleName.trim()) return titleName.trim();

    if (operation === "-") return "Ayirishga oid misollar";
    if (operation === "+") return "Qo'shishga oid misollar";
    return "Ko'paytirishga oid misollar";
  };

  const computeResult = (a: number, b: number, op: "+" | "-" | "*") => {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    return a * b;
  };

  const generateWorksheet = () => {
    const arr: { a: number; b: number }[] = [];
    for (let i = 0; i < 50; i++) {
      let a = generateNumber(digit);
      let b = generateNumber(digit);

      // Minusda manfiy bo'lmasin
      if (operation === "-" && b > a) {
        [a, b] = [b, a];
      }

      arr.push({ a, b });
    }
    setExercises(arr);
  };

  const downloadPdf = (withAnswers: boolean = false) => {
    if (!printRef.current || exercises.length === 0) return;

    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    const title = getTitle();

    const htmlExercises = exercises
      .map((ex, i) => {
        const result = computeResult(ex.a, ex.b, operation);
        return `
          <div class="exercise">
            <div class="exercise-number">${i + 1})</div>
            <div class="exercise-content">
              <div class="number">${ex.a}</div>
              <div class="number">${operation} ${ex.b}</div>
              <div class="line"></div>
              ${withAnswers ? `<div class="answer"> ${result}</div>` : ""}
            </div>
          </div>
        `;
      })
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @media print {
              @page { margin: 1cm; }
              body { margin: 0; }
            }
            body {
              font-family: 'Courier New', monospace;
              padding: 20px;
              background: white;
            }
            h1 {
              text-align: center;
              font-size: 24px;
              margin-bottom: 30px;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 40px 30px;
            }
            .exercise {
              page-break-inside: avoid;
            }
            .exercise-number {
              font-size: 12px;
              margin-bottom: 5px;
            }
            .exercise-content {
              padding-left: 20px;
            }
            .number {
              text-align: right;
              font-size: 16px;
            }
            .line {
              border-bottom: 2px solid black;
              margin-top: 5px;
              width: 60px;
              margin-left: auto;
            }
            .answer {
              margin-top: 4px;
              text-align: right;
              font-size: 14px;
              color: red;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="grid">
            ${htmlExercises}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 py-3 px-2">
      <div className="max-w-6xl mx-auto">
        <BackPrev />
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          {/* LEFT – SETTINGS CARD */}
          <Card className="p-6 shadow-xl rounded-3xl bg-white/90 border border-white">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-2xl font-bold text-slate-800">
                🧮 Matematik misol generator
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <div className="space-y-3">
                {/* Title / Name input */}
                <div>
                  <label className="font-semibold text-sm">
                    Sarlavha / Ism
                  </label>
                  <input
                    type="text"
                    value={titleName}
                    onChange={(e) => setTitleName(e.target.value)}
                    placeholder="Masalan: 4-sinf Ali"
                    className="w-full mt-1 border rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {/* Operation */}
                <div>
                  <label className="font-semibold text-sm">Amal turi</label>
                  <select
                    value={operation}
                    onChange={(e) =>
                      setOperation(e.target.value as "+" | "-" | "*")
                    }
                    className="w-full mt-1 border rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="+">Qo'shish (+)</option>
                    <option value="-">Ayirish (–)</option>
                    <option value="*">Ko'paytirish (×)</option>
                  </select>
                </div>

                {/* Digit */}
                <div>
                  <label className="font-semibold text-sm">
                    Necha xonali sonlar
                  </label>
                  <select
                    value={digit}
                    onChange={(e) => setDigit(Number(e.target.value))}
                    className="w-full mt-1 border rounded-xl px-3 py-2 text-sm"
                  >
                    <option value={1}>1 xonali</option>
                    <option value={2}>2 xonali</option>
                    <option value={3}>3 xonali</option>
                    <option value={4}>4 xonali</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={generateWorksheet}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-3 font-semibold mt-3"
              >
                🌀 50 ta misol generatsiya qilish
              </Button>

              {exercises.length > 0 && (
                <div className="space-y-2">
                  <Button
                    onClick={() => downloadPdf(false)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold"
                  >
                    📄 PDF yuklab olish (javobsiz)
                  </Button>
                  <Button
                    onClick={() => downloadPdf(true)}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-3 font-semibold"
                  >
                    📄 Javoblari bilan yuklab olish
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RIGHT – WORKSHEET / PREVIEW AREA */}
          <div className="w-full">
            {exercises.length === 0 ? (
              <div className="h-full flex items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-500 text-center">
                Chap tomondan parametrlarni tanlab, generatsiya qilish tugmasini
                bosing.
              </div>
            ) : (
              <div
                ref={printRef}
                className="bg-white rounded-3xl shadow-2xl p-10"
              >
                <h1 className="text-center text-3xl font-bold mb-8">
                  {getTitle()}
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-12 text-lg">
                  {exercises.map((ex, i) => (
                    <div key={i} className="font-mono">
                      <p className="text-sm mb-1">{i + 1})</p>
                      <div className="pl-6">
                        <div className="text-right">{ex.a}</div>
                        <div className="text-right">
                          {operation} {ex.b}
                        </div>
                        <div className="border-b-2 border-black mt-1 w-16 ml-auto" />
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
