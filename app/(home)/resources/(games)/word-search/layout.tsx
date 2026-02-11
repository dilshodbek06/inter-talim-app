import type { ReactNode } from "react";
import { buildGameMetadata } from "@/lib/game-seo";

export const metadata = buildGameMetadata("/resources/word-search");

export default function GameLayout({ children }: { children: ReactNode }) {
  return children;
}
