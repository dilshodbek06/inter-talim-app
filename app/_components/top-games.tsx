"use client";

import { Button } from "@/components/ui/button";
import { eduGames } from "@/mock/mock-data";
import { ArrowRight } from "lucide-react";
import GameItem from "../(home)/resources/_components/game-item";
import Link from "next/link";

const TopGames = () => {
  const wantedIds = [
    "f0bd283c-3c53-4db0-bdb8-2364fefc1246", // So'z qidiruv
    "a3f91c78-4b2e-4d73-bc77-5b9a6e823f10", // Baraban
    "21d8ecac-2441-46d4-9a37-5bbc874e2d42", // Chempion o'quvchi
    "e3678b4d-89e3-4f88-b1d6-6e40753af48b", // Millioner
    "64a82a9c-7bc1-49f7-9a47-fcdfdf5b1af8", // So'z yasash
    "f3b891d3-a389-4963-b59a-c44c5ebdc917", // Matematik misol
  ];

  const filtered = eduGames.filter((g) => wantedIds.includes(g.id));

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Soft overall gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-edu-light/80 via-background to-edu-light/80 dark:from-background dark:via-background dark:to-background" />

      {/* Subtle glow blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-edu-blue/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-edu-yellow/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-edu-coral/14 blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
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
          {filtered.map((game) => (
            <GameItem game={game} key={game.id} />
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in">
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
