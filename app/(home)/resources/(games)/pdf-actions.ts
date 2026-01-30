"use server";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Color, PDFFont, PDFPage } from "pdf-lib";

type WordScramblePayload = {
  title: string;
  words: string[];
};

type LinearEquationItem = {
  text: string;
  solution: number;
};

type LinearEquationsPayload = {
  title: string;
  withAnswers: boolean;
  equations: LinearEquationItem[];
};

type FractionExercise = {
  a: number;
  b: number;
  c: number;
  d: number;
};

type FractionAddPayload = {
  title: string;
  withAnswers: boolean;
  exercises: FractionExercise[];
};

type Math23Exercise = { a: number; b: number };

type Math23Payload = {
  title: string;
  withAnswers: boolean;
  operation: "+" | "-" | "*";
  exercises: Math23Exercise[];
};

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN = 40;

const sanitizeText = (value: string) =>
  value
    .replace(/[\u02BB\u02BC]/g, "'")
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u00A0/g, " ")
    .trim();

const safeFilename = (value: string, fallback: string) => {
  const cleaned = sanitizeText(value)
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  return cleaned || fallback;
};

const wrapText = (
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
) => {
  const sanitized = sanitizeText(text);
  if (!sanitized) return [""];

  const words = sanitized.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  const pushCurrent = () => {
    if (current) lines.push(current);
    current = "";
  };

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      current = test;
      continue;
    }

    if (!current) {
      let chunk = "";
      for (const char of word) {
        const testChunk = chunk + char;
        if (font.widthOfTextAtSize(testChunk, size) > maxWidth) {
          if (chunk) lines.push(chunk);
          chunk = char;
        } else {
          chunk = testChunk;
        }
      }
      if (chunk) lines.push(chunk);
    } else {
      pushCurrent();
      current = word;
    }
  }

  pushCurrent();
  return lines.length ? lines : [""];
};

const formatNumber = (value: number) => {
  const formatted = new Intl.NumberFormat("ru-RU").format(Math.trunc(value));
  return sanitizeText(formatted);
};

const drawTitle = (page: PDFPage, font: PDFFont, title: string) => {
  const text = sanitizeText(title);
  const size = 20;
  const width = font.widthOfTextAtSize(text, size);
  const x = Math.max(MARGIN, (page.getWidth() - width) / 2);
  const y = page.getHeight() - MARGIN - size;
  page.drawText(text, { x, y, size, font });
  return y - 26;
};

const drawFraction = (
  page: PDFPage,
  font: PDFFont,
  x: number,
  y: number,
  numerator: number,
  denominator: number,
  size: number,
  color?: Color,
) => {
  const numText = String(numerator);
  const denText = String(denominator);
  const numWidth = font.widthOfTextAtSize(numText, size);
  const denWidth = font.widthOfTextAtSize(denText, size);
  const width = Math.max(numWidth, denWidth) + 8;
  const numX = x + (width - numWidth) / 2;
  const denX = x + (width - denWidth) / 2;

  page.drawText(numText, { x: numX, y, size, font, color });
  page.drawLine({
    start: { x, y: y - 3 },
    end: { x: x + width, y: y - 3 },
    thickness: 1,
  });
  page.drawText(denText, {
    x: denX,
    y: y - size - 8,
    size,
    font,
    color,
  });

  return width;
};

const computeFractionAnswer = (ex: FractionExercise) => {
  const numerator = ex.a * ex.d + ex.c * ex.b;
  const denominator = ex.b * ex.d;
  let a = Math.abs(numerator);
  let b = Math.abs(denominator);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  const divisor = a || 1;
  return {
    n: Math.floor(numerator / divisor),
    d: Math.floor(denominator / divisor),
  };
};

export async function generateWordScramblePdf(payload: WordScramblePayload) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  let page = doc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = drawTitle(page, font, payload.title || "Aralash sozlar");

  const rowHeight = 26;
  const wordSize = 14;

  for (const raw of payload.words) {
    if (y < MARGIN + rowHeight) {
      page = doc.addPage([A4_WIDTH, A4_HEIGHT]);
      y = drawTitle(page, font, payload.title || "Aralash sozlar");
    }

    const word = sanitizeText(raw).toUpperCase();
    page.drawText(word, { x: MARGIN, y, size: wordSize, font });
    const lineStart = MARGIN + 190;
    page.drawLine({
      start: { x: lineStart, y: y - 2 },
      end: { x: lineStart + 180, y: y - 2 },
      thickness: 1,
    });
    y -= rowHeight;
  }

  const pdfBytes = await doc.save();
  const base64 = Buffer.from(pdfBytes).toString("base64");
  return {
    base64,
    filename: `${safeFilename(payload.title, "word-scramble")}.pdf`,
  };
}

export async function generateLinearEquationsPdf(
  payload: LinearEquationsPayload,
) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.TimesRoman);
  let page = doc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = drawTitle(page, font, payload.title || "Chiziqli tenglamalar");

  const size = 12;
  const lineHeight = 16;
  const rowGap = 6;
  const contentWidth = page.getWidth() - MARGIN * 2;

  for (let i = 0; i < payload.equations.length; i += 1) {
    const eq = payload.equations[i];
    const eqText = `${i + 1}) ${sanitizeText(eq.text)}`;
    const lines = wrapText(eqText, font, size, contentWidth);
    const answerLineHeight = payload.withAnswers ? lineHeight : lineHeight + 4;
    const neededHeight = lines.length * lineHeight + answerLineHeight + rowGap;

    if (y - neededHeight < MARGIN) {
      page = doc.addPage([A4_WIDTH, A4_HEIGHT]);
      y = drawTitle(page, font, payload.title || "Chiziqli tenglamalar");
    }

    for (const line of lines) {
      page.drawText(line, { x: MARGIN, y, size, font });
      y -= lineHeight;
    }

    const answerX = MARGIN + 18;
    const answerY = y;
    page.drawText("x =", { x: answerX, y: answerY, size: 11, font });
    if (payload.withAnswers) {
      page.drawText(formatNumber(eq.solution), {
        x: answerX + 24,
        y: answerY,
        size: 11,
        font,
        color: rgb(0.1, 0.3, 0.8),
      });
    } else {
      page.drawLine({
        start: { x: answerX + 24, y: answerY - 1 },
        end: { x: answerX + 90, y: answerY - 1 },
        thickness: 0.6,
        color: rgb(0.5, 0.5, 0.5),
      });
    }
    y -= answerLineHeight + rowGap;
  }

  const pdfBytes = await doc.save();
  const base64 = Buffer.from(pdfBytes).toString("base64");
  const suffix = payload.withAnswers ? "-javoblar" : "-javobsiz";
  return {
    base64,
    filename: `${safeFilename(payload.title, "linear-equations")}${suffix}.pdf`,
  };
}

export async function generateFractionAddPdf(payload: FractionAddPayload) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  let page = doc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = drawTitle(page, font, payload.title || "Kasrlar");

  const colCount = 2;
  const gutter = 22;
  const contentWidth = page.getWidth() - MARGIN * 2;
  const colWidth = (contentWidth - gutter * (colCount - 1)) / colCount;
  const cellHeight = 64;
  const numberSize = 10;
  const fracSize = 12;
  const answerColor = rgb(0.8, 0.1, 0.1);

  for (let i = 0; i < payload.exercises.length; i += 1) {
    const col = i % colCount;
    if (col === 0 && y - cellHeight < MARGIN) {
      page = doc.addPage([A4_WIDTH, A4_HEIGHT]);
      y = drawTitle(page, font, payload.title || "Kasrlar");
    }

    const x = MARGIN + col * (colWidth + gutter);
    const top = y;
    const ex = payload.exercises[i];
    page.drawText(`${i + 1})`, { x, y: top, size: numberSize, font });

    const fractionY = top - 16;
    let cursorX = x + 10;
    const widthA = drawFraction(
      page,
      font,
      cursorX,
      fractionY,
      ex.a,
      ex.b,
      fracSize,
    );
    cursorX += widthA + 6;
    page.drawText("+", {
      x: cursorX,
      y: fractionY - fracSize / 2,
      size: 12,
      font,
    });
    cursorX += 10;
    const widthB = drawFraction(
      page,
      font,
      cursorX,
      fractionY,
      ex.c,
      ex.d,
      fracSize,
    );
    cursorX += widthB + 6;
    page.drawText("=", {
      x: cursorX,
      y: fractionY - fracSize / 2,
      size: 12,
      font,
    });
    cursorX += 12;

    if (payload.withAnswers) {
      const answer = computeFractionAnswer(ex);
      drawFraction(
        page,
        font,
        cursorX,
        fractionY,
        answer.n,
        answer.d,
        fracSize,
        answerColor,
      );
    } else {
      page.drawLine({
        start: { x: cursorX, y: fractionY - fracSize - 2 },
        end: { x: cursorX + 50, y: fractionY - fracSize - 2 },
        thickness: 1,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    if (col === colCount - 1) {
      y -= cellHeight;
    }
  }

  const pdfBytes = await doc.save();
  const base64 = Buffer.from(pdfBytes).toString("base64");
  const suffix = payload.withAnswers ? "-javoblar" : "-javobsiz";
  return {
    base64,
    filename: `${safeFilename(payload.title, "fraction-add")}${suffix}.pdf`,
  };
}

export async function generateMath23Pdf(payload: Math23Payload) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Courier);
  let page = doc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = drawTitle(page, font, payload.title || "Matematika");

  const colCount = 4;
  const gutter = 18;
  const contentWidth = page.getWidth() - MARGIN * 2;
  const colWidth = (contentWidth - gutter * (colCount - 1)) / colCount;
  const cellHeight = 72;
  const numberSize = 10;
  const textSize = 12;
  const answerColor = rgb(0.8, 0.1, 0.1);

  const opSymbol = payload.operation === "*" ? "x" : payload.operation;

  for (let i = 0; i < payload.exercises.length; i += 1) {
    const col = i % colCount;
    if (col === 0 && y - cellHeight < MARGIN) {
      page = doc.addPage([A4_WIDTH, A4_HEIGHT]);
      y = drawTitle(page, font, payload.title || "Matematika");
    }

    const x = MARGIN + col * (colWidth + gutter);
    const top = y;
    const ex = payload.exercises[i];
    page.drawText(`${i + 1})`, { x, y: top, size: numberSize, font });

    const rightEdge = x + colWidth - 4;
    const aText = String(ex.a);
    const bText = `${opSymbol} ${ex.b}`;
    const aWidth = font.widthOfTextAtSize(aText, textSize);
    const bWidth = font.widthOfTextAtSize(bText, textSize);
    const aX = rightEdge - aWidth;
    const bX = rightEdge - bWidth;

    page.drawText(aText, { x: aX, y: top - 16, size: textSize, font });
    page.drawText(bText, { x: bX, y: top - 32, size: textSize, font });
    page.drawLine({
      start: { x: rightEdge - 46, y: top - 36 },
      end: { x: rightEdge, y: top - 36 },
      thickness: 1,
    });

    if (payload.withAnswers) {
      const result =
        payload.operation === "+"
          ? ex.a + ex.b
          : payload.operation === "-"
            ? ex.a - ex.b
            : ex.a * ex.b;
      const resultText = String(result);
      const resultWidth = font.widthOfTextAtSize(resultText, textSize);
      page.drawText(resultText, {
        x: rightEdge - resultWidth,
        y: top - 54,
        size: textSize,
        font,
        color: answerColor,
      });
    }

    if (col === colCount - 1) {
      y -= cellHeight;
    }
  }

  const pdfBytes = await doc.save();
  const base64 = Buffer.from(pdfBytes).toString("base64");
  const suffix = payload.withAnswers ? "-javoblar" : "-javobsiz";
  return {
    base64,
    filename: `${safeFilename(payload.title, "math-worksheet")}${suffix}.pdf`,
  };
}
