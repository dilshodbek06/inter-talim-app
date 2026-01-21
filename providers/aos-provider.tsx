"use client";

import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function AosProvider() {
  const inited = useRef(false);

  useEffect(() => {
    if (!inited.current) {
      AOS.init({
        duration: 700,
        once: true,
        offset: 80,
        easing: "ease-out-cubic",
        mirror: false,
        // disableMutationObserver: false, // kerak bo‘lsa yoqing
      });
      inited.current = true;
    }

    // Light refresh once DOM settles (avoid heavy refreshHard)
    const raf = requestAnimationFrame(() => AOS.refresh());
    const onLoad = () => AOS.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return null;
}
