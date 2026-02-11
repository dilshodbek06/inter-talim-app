import { useCallback, useEffect, useRef } from "react";

type FeedbackSoundOptions = {
  enabled?: boolean;
  successSrc?: string;
  errorSrc?: string;
  successVolume?: number;
  errorVolume?: number;
};

const DEFAULT_SUCCESS_SRC = "/sounds/success.wav";
const DEFAULT_ERROR_SRC = "/sounds/error.mp3";

export function useFeedbackSounds({
  enabled = true,
  successSrc = DEFAULT_SUCCESS_SRC,
  errorSrc = DEFAULT_ERROR_SRC,
  successVolume = 0.8,
  errorVolume = 0.8,
}: FeedbackSoundOptions = {}) {
  const successRef = useRef<HTMLAudioElement | null>(null);
  const errorRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const success = new Audio(successSrc);
    success.preload = "auto";
    success.volume = successVolume;

    const error = new Audio(errorSrc);
    error.preload = "auto";
    error.volume = errorVolume;

    success.load();
    error.load();

    successRef.current = success;
    errorRef.current = error;

    return () => {
      const refs = [successRef, errorRef];
      refs.forEach((ref) => {
        if (!ref.current) return;
        ref.current.pause();
        ref.current.currentTime = 0;
        ref.current = null;
      });
    };
  }, [errorSrc, errorVolume, successSrc, successVolume]);

  const playAudio = useCallback(
    (type: "success" | "error") => {
      if (!enabled) return;
      const ref = type === "success" ? successRef : errorRef;
      if (!ref.current) return;
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    },
    [enabled],
  );

  const playSuccess = useCallback(() => {
    playAudio("success");
  }, [playAudio]);

  const playError = useCallback(() => {
    playAudio("error");
  }, [playAudio]);

  return { playSuccess, playError };
}
