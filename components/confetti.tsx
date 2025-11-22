/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  color: string;
  offsetX: number;
  offsetY: number;
}

interface ConfettiProps {
  buttonRect?: DOMRect;
}

export const Confetti = ({ buttonRect }: ConfettiProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#f9ca24",
      "#6c5ce7",
      "#00b894",
    ];
    const newPieces: ConfettiPiece[] = [];

    const startX = buttonRect?.left ?? window.innerWidth / 2;
    const startY = buttonRect?.top ?? window.innerHeight / 2;
    const buttonWidth = buttonRect?.width ?? 0;
    const buttonHeight = buttonRect?.height ?? 0;

    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 * i) / 60;
      const velocity = 4 + Math.random() * 6;
      const offsetX = Math.cos(angle) * velocity;
      const offsetY = Math.sin(angle) * velocity;

      newPieces.push({
        id: i,
        left: startX + buttonWidth / 2,
        top: startY + buttonHeight / 2,
        delay: Math.random() * 0.1,
        duration: 1.5 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        offsetX,
        offsetY,
      });
    }

    setPieces(newPieces);
  }, [buttonRect]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti-burst rounded-full"
          style={
            {
              left: `${piece.left}px`,
              top: `${piece.top}px`,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              "--offset-x": `${piece.offsetX * 80}px`,
              "--offset-y": `${piece.offsetY * 80}px`,
            } as React.CSSProperties & {
              "--offset-x": string;
              "--offset-y": string;
            }
          }
        />
      ))}
    </div>
  );
};
