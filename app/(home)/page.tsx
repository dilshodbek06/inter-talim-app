import Header from "@/components/Header";
import Hero from "../_components/hero";
import Features from "../_components/features";
import TopGames from "../_components/top-games";
import HowWorks from "../_components/how-works";
import Testimonials from "../_components/testimonials";
import Cta from "../_components/cta";
import Footer from "@/components/Footer";
import DemoModeBanner from "@/components/demo-mode-banner";

export default function Home() {
  return (
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
  );
}
