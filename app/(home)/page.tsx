import Header from "@/components/Header";
import Hero from "../_components/hero";
import Features from "../_components/features";
import TopGames from "../_components/top-games";
import HowWorks from "../_components/how-works";
import Testimonials from "../_components/testimonials";
import Faq from "../_components/faq";
import Cta from "../_components/cta";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/seo";
import { AosProvider } from "@/providers/aos-provider";
import { GamesStructuredData } from "../_components/games-structured-data";

export const metadata = buildMetadata({
  title: "Interaktiv-ta'lim — qiziqarli darslar va o'quv o'yinlari",
  description:
    "O'qituvchilar uchun interaktiv o'yinlar, viktorinalar va kreativ metodlar. Ta'lim jarayonini qiziqarli va samarali qiling.",
  path: "/",
  keywords: [
    "ta'lim platformasi",
    "interaktiv o'yinlar",
    "o'qituvchilar uchun",
  ],
});

export default function Home() {
  return (
    <>
      <GamesStructuredData id="ld-json-featured-games" />
      <AosProvider />
      <div className="min-h-screen bg-background">
        {/* Top alert banner */}
        {/* <DemoModeBanner /> */}
        <div className="min-h-screen flex flex-col">
          {/* Navigation */}
          <Header />
          {/* Hero Section */}
          <Hero />
        </div>
        {/* Features Grid */}
        <Features />
        {/* Top Games */}
        <TopGames />
        {/* How It Works */}
        <HowWorks />
        {/* Testimonials */}
        <Testimonials />
        {/* FAQ */}
        <Faq />
        {/* Pricing Section */}
        {/* <Pricing /> */}
        {/* CTA Banner */}
        <Cta />
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
