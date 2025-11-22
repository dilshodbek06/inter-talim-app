"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const BackPrev = () => {
  const router = useRouter();

  return (
    <Button
      aria-label="back to prev"
      variant="outline"
      size="icon"
      className="rounded-full sm:hidden absolute top-4 right-5 shadow-sm bg-white/80 "
      onClick={() => router.back()}
    >
      <ArrowLeft className="w-4 h-4" />
    </Button>
  );
};

export default BackPrev;
