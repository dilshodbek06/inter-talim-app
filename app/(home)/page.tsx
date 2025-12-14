import Header from "@/components/Header";
import Hero from "../_components/hero";
import Features from "../_components/features";
import TopGames from "../_components/top-games";
import HowWorks from "../_components/how-works";
import Testimonials from "../_components/testimonials";
import Cta from "../_components/cta";
import Footer from "@/components/Footer";
import DemoModeBanner from "@/components/demo-mode-banner";
import ClientSideOnly from "@/components/ClientSideOnly";

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
      <ClientSideOnly>
        <Features />
      </ClientSideOnly>
      {/* Statistics Section */}

      {/* Top Games */}
      <ClientSideOnly>
        <TopGames />
      </ClientSideOnly>
      {/* How It Works */}
      <ClientSideOnly>
        <HowWorks />
      </ClientSideOnly>
      {/* Testimonials */}
      <ClientSideOnly>
        <Testimonials />
      </ClientSideOnly>
      {/* Pricing Section */}
      {/* <Pricing /> */}
      {/* CTA Banner */}
      <ClientSideOnly>
        <Cta />
      </ClientSideOnly>
      {/* Footer */}
      <ClientSideOnly>
        <Footer />
      </ClientSideOnly>
    </div>
  );
}
