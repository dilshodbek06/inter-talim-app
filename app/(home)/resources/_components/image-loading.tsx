"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ImageLoading({
  src,
  alt,
  colorClass,
}: {
  src: string;
  alt: string;
  colorClass: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Skeleton */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          loaded ? "opacity-0" : "opacity-100",
        )}
      >
        <div className="h-full w-full bg-linear-to-r from-slate-100 via-slate-200 to-slate-100 bg-size-[200%_100%] animate-shimmer" />
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br opacity-20",
            colorClass,
          )}
        />
      </div>

      <Image
        src={src}
        alt={alt}
        fill
        quality={70}
        sizes="(min-width: 1280px) 260px, (min-width: 768px) 40vw, 100vw"
        className={cn(
          "object-contain scale-[1.2] transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </>
  );
}
