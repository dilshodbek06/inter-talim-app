"use client";

import Image from "next/image";
import { Star, Users, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Game } from "@/types";
import { useRouter } from "next/navigation";

interface GameItemProps {
  game: Game;
}

const GameItem = ({ game }: GameItemProps) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(game.webUrl)}
      key={game.id}
      suppressHydrationWarning={true}
    >
      <Card className="group cursor-pointer border border-white/70 bg-white/80 backdrop-blur-md shadow-lg hover:shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden relative">
        {/* Top accent bar */}
        <div className={`h-1.5 bg-linear-to-r ${game.color}`}></div>

        {/* Glow on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className={`absolute -top-10 right-0 h-24 w-24 rounded-full bg-linear-to-br ${game.color} blur-3xl opacity-50`}
          />
        </div>

        <CardHeader className="pb-3">
          {/* Kichik rasm (metod preview) */}
          <div className="mb-3">
            <div className="relative h-24 w-full overflow-hidden rounded-xl bg-slate-100">
              <Image
                src={game.image}
                alt={game.title}
                fill
                sizes="(min-width: 1280px) 260px, (min-width: 768px) 40vw, 100vw"
                className="object-contain scale-[1.2]"
              />
            </div>
          </div>

          <CardTitle className="text-lg group-hover:text-sky-600 transition-colors duration-300">
            {game.title}
          </CardTitle>
          <CardDescription className="text-sm text-slate-600">
            {game.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          {/* Vaqt yo'q – faqat players + level */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col items-center p-2 bg-slate-50/80 rounded-xl border border-slate-100">
              <Users className="w-4 h-4 text-slate-600 mb-1" />
              <span className="font-semibold text-slate-800">
                {game.players}
              </span>
              <span className="text-[10px] text-slate-500">foydalanish</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-slate-50/80 rounded-xl border border-slate-100">
              <Star className="w-4 h-4 text-amber-500 mb-1" />
              <span className="font-semibold text-slate-800">
                {game.difficulty}
              </span>
              <span className="text-[10px] text-slate-500">daraja</span>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className={`w-full bg-linear-to-r ${game.color} hover:brightness-105 hover:shadow-md transition-all duration-300 group rounded-xl cursor-pointer`}
          >
            <span className="text-sm font-semibold">Foydalanish</span>
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameItem;
