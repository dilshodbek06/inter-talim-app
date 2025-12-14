"use client";
import { useState, useEffect, Children, useRef } from "react";

type TextLoopProps = {
  children: React.ReactNode[];
  className?: string;
  interval?: number;
  onIndexChange?: (index: number) => void;
};

export function TextLoop({
  children,
  className = "",
  interval = 2,
  onIndexChange,
}: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [height, setHeight] = useState<number | "auto">("auto");
  const containerRef = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);

  useEffect(() => {
    const intervalMs = interval * 1000;

    const timer = setInterval(() => {
      setCurrentIndex((current) => {
        const next = (current + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [items.length, interval, onIndexChange]);

  useEffect(() => {
    if (containerRef.current) {
      const newHeight = containerRef.current.scrollHeight;
      setHeight(newHeight);
    }
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block overflow-hidden ${className}`}
      style={{ minHeight: height }}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(1.25rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeOutUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-1.25rem);
          }
        }
        .text-loop-item {
          animation: fadeInUp 0.3s ease-in-out;
          white-space: nowrap;
        }
      `}</style>
      <div key={currentIndex} className="text-loop-item">
        {items[currentIndex]}
      </div>
    </div>
  );
}
