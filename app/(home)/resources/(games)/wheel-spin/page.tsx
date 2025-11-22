"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import BackPrev from "@/components/back-prev";

type WinnerHistory = string[];

export default function RandomNamePicker() {
  const initialNames = [
    "Nozim",
    "Sardor",
    "Karim",
    "Alisher",
    "Rustam",
    "Botir",
    "Ikrom",
    "Shaxzod",
    "Farhod",
    "Javlon",
  ];

  const [names, setNames] = useState<string[]>(initialNames);
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedName, setSelectedName] = useState<string>("");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [newName, setNewName] = useState<string>("");
  const [history, setHistory] = useState<WinnerHistory>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Audio context init
  useEffect(() => {
    if (typeof window !== "undefined") {
      const AudioCtx =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Wheel draw
  useEffect(() => {
    drawWheel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names, rotation]);

  const colors = [
    "#70D6FF", // Light Neon Blue
    "#FF6B6B", // Bright Coral Red
    "#FF8E72", // Vivid Peach
    "#FFBE0B", // Vivid Yellow
    "#FFD93D", // Sunny Yellow
    "#F9C74F", // Warm Gold
    "#F9844A", // Bright Orange
    "#90BE6D", // Fresh Green
    "#43AA8B", // Mint Green
    "#4D96FF", // Bright Sky Blue
    "#00BBF9", // Neon Aqua
    "#48CAE4", // Light Cyan Blue
    "#5E60CE", // Vivid Indigo
    "#6930C3", // Purple Glow
    "#B5179E", // Bright Magenta
    "#FF5D8F", // Hot Pink
    "#FF97B7", // Pastel Hot Pink
    "#A9F1DF", // Aqua Mint
    "#C1FBA4", // Fresh Lime
    "#FFE66D", // Creamy Bright Yellow
  ];

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Empty state
    if (names.length === 0) {
      ctx.fillStyle = "#F3F4F6";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#9CA3AF";
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.fillStyle = "#6B7280";
      ctx.font =
        "bold 22px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Ismlar qo‘shing va", centerX, centerY - 14);
      ctx.fillText("barabanni aylantiring 🎯", centerX, centerY + 14);
      return;
    }

    const anglePerSegment = (2 * Math.PI) / names.length;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Segments
    names.forEach((name, index) => {
      const startAngle = index * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;

      // Segment fill
      ctx.fillStyle = colors[index % colors.length];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      // Segment border
      ctx.strokeStyle = "rgba(15,23,42,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(startAngle) * radius, Math.sin(startAngle) * radius);
      ctx.stroke();

      // Text
      ctx.save();
      const textAngle = startAngle + anglePerSegment / 2;
      ctx.rotate(textAngle);

      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#111827";
      ctx.font =
        "600 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.shadowColor = "rgba(255,255,255,0.7)";
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.fillText(name, radius * 0.8, 0);
      ctx.restore();
    });

    // Outer border
    ctx.strokeStyle = "#0F172A";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.restore();

    // Center button (black)
    ctx.fillStyle = "#0F172A";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#F9FAFB";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center text
    ctx.fillStyle = "#F9FAFB";
    ctx.font =
      "600 16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", centerX, centerY);

    // Pointer (top, pointing down)
    ctx.fillStyle = "#0F172A";
    ctx.beginPath();
    ctx.moveTo(centerX, 55);
    ctx.lineTo(centerX - 20, 15);
    ctx.lineTo(centerX + 20, 15);
    ctx.closePath();
    ctx.fill();
  };

  const playTickSound = () => {
    if (!soundEnabled || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = 1000;
    oscillator.type = "square";
    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.03);
  };

  const playWinSound = () => {
    if (!soundEnabled || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    [0, 0.15, 0.3].forEach((time, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = "sine";
      oscillator.frequency.value = [523.25, 659.25, 783.99][i];
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime + time);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + time + 0.4
      );
      oscillator.start(ctx.currentTime + time);
      oscillator.stop(ctx.currentTime + time + 0.4);
    });
  };

  const spinWheel = () => {
    if (isSpinning || names.length === 0) return;

    setIsSpinning(true);
    setSelectedName("");

    const spinDuration = 4000;
    const extraSpins = 5 + Math.random() * 3;
    const randomOffset = Math.random() * 360;
    const targetRotation = rotation + 360 * extraSpins + randomOffset;
    const startTime = Date.now();
    const startRotation = rotation;
    let lastSegment = -1;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation =
        startRotation + (targetRotation - startRotation) * easeOut;

      setRotation(currentRotation % 360);

      const anglePerSegment = 360 / names.length;
      const normalizedRotation = (360 - (currentRotation % 360)) % 360;
      const currentSegment = Math.floor(normalizedRotation / anglePerSegment);

      if (currentSegment !== lastSegment && progress < 0.95) {
        playTickSound();
        lastSegment = currentSegment;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        const finalRotation = targetRotation % 360;
        const anglePerSegmentDeg = 360 / names.length;
        const pointerAngle = 270; // top
        const segmentAtPointer = Math.floor(
          ((pointerAngle - finalRotation + 360) % 360) / anglePerSegmentDeg
        );
        const winner = names[segmentAtPointer % names.length];
        setSelectedName(winner);
        setIsSpinning(false);
        playWinSound();
        setHistory((prev) => [winner, ...prev].slice(0, 10));
      }
    };

    animate();
  };

  const addName = () => {
    const trimmed = newName.trim();
    if (trimmed && !names.includes(trimmed)) {
      setNames((prev) => [...prev, trimmed]);
      setNewName("");
    }
  };

  const removeName = (nameToRemove: string) => {
    setNames((prev) => prev.filter((n) => n !== nameToRemove));
  };

  const resetNames = () => {
    setNames(initialNames);
    setSelectedName("");
    setRotation(0);
    setHistory([]);
  };

  const onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addName();
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <BackPrev />
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-2 md:mb-0">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Baraban metodi
              </h1>
              <p className="mt-2 text-slate-600 max-w-xl text-sm md:text-base">
                Tasodifiy o‘quvchini tanlash yoki savol berish uchun interaktiv
                baraban o‘yini.{" "}
                <span className="font-semibold text-edu-blue">
                  “SPIN” tugmasini bosing!
                </span>
              </p>
            </div>
          </div>

          <motion.button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-full bg-white/80 border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
            whileTap={{ scale: 0.95 }}
          >
            {soundEnabled ? (
              <>
                <Volume2 size={18} />
                Ovoz yoqilgan
              </>
            ) : (
              <>
                <VolumeX size={18} />
                Ovoz o‘chirilgan
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Main layout: baraban LEFT, form RIGHT on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)] gap-8 items-start">
          {/* LEFT: Wheel */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-100 p-4 md:p-6 flex flex-col"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            whileHover={{ y: -1 }}
          >
            <div className="flex flex-col items-center mb-4">
              <canvas
                ref={canvasRef}
                width={520}
                height={520}
                className="max-w-full h-auto cursor-pointer drop-shadow-xl"
                onClick={spinWheel}
              />
            </div>

            {selectedName && !isSpinning && (
              <motion.div
                key={selectedName}
                className="mt-10 mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center"
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <p className="text-lg md:text-xl font-bold text-emerald-700">
                  🎉 Tanlangan o‘quvchi: {selectedName}! 🎉
                </p>
              </motion.div>
            )}

            <div className="mt-2 flex flex-wrap gap-3 justify-center">
              <motion.button
                onClick={resetNames}
                className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold shadow-md hover:bg-slate-800 transition-colors"
                whileTap={{ scale: 0.96 }}
              >
                Asl ro‘yxatni tiklash
              </motion.button>
            </div>

            {history.length > 0 && (
              <motion.div
                className="mt-6 bg-slate-50 border border-slate-100 rounded-2xl p-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Oxirgi tanlanganlar
                </h3>
                <div className="flex flex-wrap gap-2">
                  {history.map((name, idx) => (
                    <motion.span
                      key={`${name}-${idx}`}
                      className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium"
                      layout
                      whileHover={{ y: -2 }}
                    >
                      {idx + 1}. {name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* RIGHT: Manage names */}
          <motion.div
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-100 p-5 md:p-6"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  Ismlar ro‘yxati ({names.length})
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  O‘quvchilar ismlarini kiriting yoki o‘chiring. Qanchalik ko‘p
                  ism – shunchalik qiziqarli! 🙂
                </p>
              </div>
            </div>

            {/* Input */}
            <div className="flex flex-col sm:flex-row gap-2 mb-5">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Yangi o‘quvchi ismini yozing..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-edu-blue/30 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-edu-blue focus:border-edu-blue text-sm text-slate-800"
              />
              <Button
                onClick={addName}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
                asChild={false}
              >
                <motion.span whileTap={{ scale: 0.96 }}>
                  <span className="inline-flex items-center gap-2">
                    <Plus size={18} />
                    Qo‘shish
                  </span>
                </motion.span>
              </Button>
            </div>

            {/* Names list */}
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
              {names.map((name) => (
                <motion.div
                  key={name}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-linear-to-r from-indigo-50 via-sky-50 to-emerald-50 border border-slate-100 hover:shadow-sm transition-shadow"
                  layout
                  whileHover={{ y: -2 }}
                >
                  <span className="text-sm font-medium text-slate-800 truncate">
                    {name}
                  </span>
                  <button
                    onClick={() => removeName(name)}
                    className="p-1 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                    aria-label={`${name} ismini o‘chirish`}
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
              {names.length === 0 && (
                <div className="col-span-full text-sm text-slate-500 text-center py-6">
                  Hozircha ism yo‘q. Avval o‘quvchilar ismlarini qo‘shing.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
