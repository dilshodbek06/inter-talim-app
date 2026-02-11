import { Button } from "@/components/ui/button";
import { eduGames } from "@/mock/mock-data";
import { featuredGameIds } from "@/mock/featured-games";
import { ArrowRight } from "lucide-react";
import GameItem from "../(home)/resources/_components/game-item";
import Link from "next/link";

const TopGames = () => {
  const featuredIdSet = new Set<string>(featuredGameIds);
  const filtered = eduGames.filter((g) => featuredIdSet.has(g.id));

  return (
    <section
      className="relative py-20 overflow-hidden"
      data-aos="fade-up"
      data-aos-offset="180"
    >
      {/* Soft overall gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-edu-light/80 via-background to-edu-light/80 dark:from-background dark:via-background dark:to-background" />

      {/* Subtle glow blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-edu-blue/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-edu-yellow/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-edu-coral/14 blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-2 bg-secondary/20 dark:bg-secondary/10 rounded-full backdrop-blur-sm">
            <span className="text-sm font-semibold text-foreground">
              ⭐ O‘qituvchilarning tanlovlari
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">Sevimli O‘yinlar</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            O‘qituvchilar eng ko‘p tanlayotgan o‘yinlar va metodlar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filtered.map((game, index) => (
            <div
              key={game.id}
              data-aos="fade-up"
              data-aos-delay={80 + index * 60}
              data-aos-duration="750"
            >
              <GameItem game={game} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href={`/resources`}>
            <Button variant="outline" size="lg" className="group">
              Barchasini ko‘rish
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopGames;
