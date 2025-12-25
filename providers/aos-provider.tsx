"use client";

import { ReactNode, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

type AosProviderProps = {
  children: ReactNode;
};

export const AosProvider = ({ children }: AosProviderProps) => {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 80,
      easing: "ease-out-cubic",
    });
  }, []);

  return <>{children}</>;
};
