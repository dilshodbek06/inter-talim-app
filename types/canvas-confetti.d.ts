declare module "canvas-confetti" {
  export type Shape = "square" | "circle" | "star" | "triangle" | "line" | "text";

  export type Options = {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: { x?: number; y?: number };
    shapes?: Shape[];
    zIndex?: number;
    colors?: string[];
    disableForReducedMotion?: boolean;
    scalar?: number;
  };

  export type GlobalOptions = {
    resize?: boolean;
    useWorker?: boolean;
  };

  export type CreateConfettiInstance = {
    (options?: Options): Promise<null> | null;
    reset: () => void;
  };

  export type Confetti = {
    (options?: Options): Promise<null> | null;
    reset: () => void;
    create: (
      canvas?: HTMLCanvasElement,
      options?: GlobalOptions,
    ) => CreateConfettiInstance;
  };

  const confetti: Confetti;
  export default confetti;
}
