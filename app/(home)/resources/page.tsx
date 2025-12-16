import Header from "@/components/Header";
import HeroSection from "./_components/hero-section";
import CategoriesSection from "./_components/categories-section";
import Gradients from "./_components/gradients";
import GamesGrid from "./_components/games-grid";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "O'quv o'yinlari va metodlar | Interaktiv-ta'lim",
  description:
    "Matematika, til va ijodiy fikrlash uchun interaktiv o'yinlar to'plami. Filtrlang, tanlang va darslaringizda qo'llang.",
  path: "/resources",
  keywords: ["o'yin metodlari", "dars o'yini", "o'quv resurslari"],
});

export default function EduGamesPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50">
      {/* Soft gradient blobs background */}
      <Gradients />

      <div className="relative z-10">
        {/* Header Section */}
        <Header />

        {/* Hero Section */}
        <HeroSection />

        {/* Category Filter */}
        <CategoriesSection />

        {/* Methods Grid */}
        <GamesGrid />
      </div>
    </div>
  );
}
