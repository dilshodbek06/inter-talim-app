"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

export function AosProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
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

    // DOM/rasm/font joylashgach qayta hisoblasin
    const raf = requestAnimationFrame(() => AOS.refreshHard());

    const onLoad = () => AOS.refreshHard();
    window.addEventListener("load", onLoad);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, [pathname]);

  return <>{children}</>;
}
