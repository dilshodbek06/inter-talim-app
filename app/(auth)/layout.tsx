import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Kirish va ro'yxatdan o'tish — Interaktiv-ta'lim",
  description:
    "Interaktiv-ta'limga kirish yoki yangi akkaunt yaratish: o'qituvchilar va o'quvchilar uchun o'yinlar, viktorinalar va metodlar.",
  path: "/sign-in",
  keywords: [
    "kirish",
    "ro'yxatdan o'tish",
    "akkaunt",
    "interaktiv ta'lim",
  ],
});

export default function AuthLayout({ children }: { children: ReactNode }) {
  return children;
}
