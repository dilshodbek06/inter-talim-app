import { useCallback, useEffect, useRef } from "react";

type ExitGuardOptions = {
  enabled: boolean;
  message?: string;
  onConfirmExit?: () => void;
};

const DEFAULT_MESSAGE = "Haqiqatdan ham o'yindan chiqmoqchimisiz?";

export function useExitGuard({
  enabled,
  message = DEFAULT_MESSAGE,
  onConfirmExit,
}: ExitGuardOptions) {
  const enabledRef = useRef(enabled);
  const messageRef = useRef(message);
  const onConfirmExitRef = useRef(onConfirmExit);
  const guardActiveRef = useRef(false);
  const allowExitRef = useRef(false);
  const cleaningRef = useRef(false);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    messageRef.current = message;
  }, [message]);

  useEffect(() => {
    onConfirmExitRef.current = onConfirmExit;
  }, [onConfirmExit]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onPopState = () => {
      if (cleaningRef.current) {
        cleaningRef.current = false;
        return;
      }
      if (!enabledRef.current) return;
      if (allowExitRef.current) {
        allowExitRef.current = false;
        return;
      }

      const ok = window.confirm(messageRef.current);
      if (ok) {
        allowExitRef.current = true;
        onConfirmExitRef.current?.();
        window.history.go(-1);
        return;
      }

      window.history.pushState(
        { ...window.history.state, __exit_guard: true },
        "",
        window.location.href,
      );
    };

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!enabledRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (enabled && !guardActiveRef.current) {
      guardActiveRef.current = true;
      window.history.pushState(
        { ...window.history.state, __exit_guard: true },
        "",
        window.location.href,
      );
      return;
    }

    if (!enabled && guardActiveRef.current) {
      guardActiveRef.current = false;
      cleaningRef.current = true;
      window.history.back();
    }
  }, [enabled]);

  const confirmExit = useCallback(() => {
    if (typeof window === "undefined") return true;
    if (!enabledRef.current) return true;
    const ok = window.confirm(messageRef.current);
    if (ok) onConfirmExitRef.current?.();
    return ok;
  }, []);

  const back = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!confirmExit()) return;

    allowExitRef.current = true;
    const offset = guardActiveRef.current ? -2 : -1;
    window.history.go(offset);
  }, [confirmExit]);

  return { confirmExit, back };
}
