import Header from "@/components/Header";
import Hero from "../_components/hero";
import Features from "../_components/features";
import TopGames from "../_components/top-games";
import HowWorks from "../_components/how-works";
import Testimonials from "../_components/testimonials";
import Cta from "../_components/cta";
import Footer from "@/components/Footer";
import DemoModeBanner from "@/components/demo-mode-banner";
import { buildMetadata } from "@/lib/seo";
import { AosProvider } from "@/providers/aos-provider";

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
    <AosProvider>
      <div className="min-h-screen bg-background">
        {/* Top alert banner */}
        <DemoModeBanner />
        {/* Navigation */}
        <Header />
        {/* Hero Section */}
        <Hero />
        {/* Features Grid */}
        <Features />
        {/* Statistics Section */}

        {/* Top Games */}
        <TopGames />
        {/* How It Works */}
        <HowWorks />
        {/* Testimonials */}
        <Testimonials />
        {/* Pricing Section */}
        {/* <Pricing /> */}
        {/* CTA Banner */}
        <Cta />
        {/* Footer */}
        <Footer />
      </div>
    </AosProvider>
  );
}
