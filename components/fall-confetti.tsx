/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from "react";

type ConfettiPiece = {
  id: string;
  left: number; // percentage of viewport (vw)
  size: number; // px
  rotate: number; // deg (start)
  delay: number; // ms
  color: string;
  duration: number; // ms
};

export type ConfettiHandle = {
  start: (amount?: number, options?: { colors?: string[] }) => void;
};

const DEFAULT_COLORS = [
  "#F97316",
  "#06B6D4",
  "#6366F1",
  "#10B981",
  "#EF4444",
  "#F59E0B",
];

const FallConfetti = forwardRef<ConfettiHandle>((_props, ref) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const timersRef = useRef<number[]>([]);

  useImperativeHandle(
    ref,
    () => ({
      start(amount = 6200, options = {}) {
        const colors = options.colors ?? DEFAULT_COLORS;
        const timestamp = Date.now();
        const newPieces: ConfettiPiece[] = Array.from({ length: amount }).map(
          (_, i) => {
            const left = Math.random() * 100;
            const size = 6 + Math.round(Math.random() * 8); // px
            const rotate = Math.round(Math.random() * 360);
            const delay = Math.round(Math.random() * 400); // ms
            const color = colors[Math.floor(Math.random() * colors.length)];
            const duration = 1800 + Math.round(Math.random() * 4200); // ms
            return {
              id: `${timestamp}-${i}-${Math.random().toString(36).slice(2)}`,
              left,
              size,
              rotate,
              delay,
              color,
              duration,
            };
          }
        );

        // add pieces
        setPieces((prev) => [...prev, ...newPieces]);

        // schedule removal by id
        const maxDur = Math.max(...newPieces.map((p) => p.duration)) + 800;
        const idsToRemove = new Set(newPieces.map((p) => p.id));
        const t = window.setTimeout(() => {
          setPieces((prev) => prev.filter((p) => !idsToRemove.has(p.id)));
        }, maxDur);
        timersRef.current.push(t);
      },
    }),
    []
  );

  // cleanup timers when unmounting
  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  if (pieces.length === 0) return null;

  return (
    <>
      <div
        aria-hidden
        className="confetti-root"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100%",
          height: 0,
          pointerEvents: "none",
          zIndex: 9999,
          overflow: "visible",
        }}
      >
        {pieces.map((p) => (
          <span
            key={p.id}
            className="confetti-piece"
            style={
              {
                position: "fixed",
                top: "-10vh", // start slightly above viewport
                left: `${p.left}vw`,
                width: `${p.size}px`,
                height: `${p.size * 1.6}px`,
                background: p.color,
                opacity: 0.98,
                // use CSS var for starting rotation
                // keyframes will read var(--r)
                // no inline transform here to avoid conflict with keyframe transforms
                borderRadius: `${Math.max(1, p.size / 6)}px`,
                animationName: "confetti-fall",
                animationDuration: `${p.duration}ms`,
                animationTimingFunction: "cubic-bezier(.18,.84,.4,1)",
                animationDelay: `${p.delay}ms`,
                animationFillMode: "forwards",
                willChange: "transform, opacity",
                transformOrigin: "center",
                // set CSS custom property used by keyframes
                // TS needs index signature for custom property so cast to any
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ["--r" as any]: `${p.rotate}deg`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20vh) rotate(var(--r, 0deg));
            opacity: 1;
            filter: blur(0px);
          }
          30% {
            opacity: 1;
          }
          70% {
            opacity: 0.95;
          }
          100% {
            transform: translateY(110vh) rotate(calc(var(--r, 0deg) + 200deg));
            opacity: 0;
            filter: blur(0.6px);
          }
        }
      `}</style>
    </>
  );
});

FallConfetti.displayName = "FallConfetti";

export default FallConfetti;
