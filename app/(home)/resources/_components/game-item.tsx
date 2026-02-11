import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users, ChevronRight } from "lucide-react";
import { Game } from "@/types";
import ImageLoading from "./image-loading";

interface GameItemProps {
  game: Game;
}

const GAME_GRADIENT_CLASS_SET = new Set([
  "from-amber-500 to-yellow-500",
  "from-amber-700 to-orange-500",
  "from-blue-500 to-cyan-500",
  "from-cyan-600 to-gray-400",
  "from-emerald-500 to-cyan-500",
  "from-green-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-indigo-500 to-purple-500",
  "from-orange-500 to-red-500",
  "from-orange-500 to-yellow-600",
  "from-orange-600 to-red-500",
  "from-pink-500 to-rose-500",
  "from-purple-500 to-pink-500",
  "from-rose-600 to-purple-400",
  "from-sky-600 to-indigo-500",
  "from-stone-500 to-gray-500",
  "from-teal-500 to-cyan-500",
  "from-teal-500 to-emerald-500",
]);

const resolveGameGradientClass = (value: string) =>
  GAME_GRADIENT_CLASS_SET.has(value)
    ? value
    : "from-sky-500 to-indigo-500";

export default function GameItem({ game }: GameItemProps) {
  const gradientClass = resolveGameGradientClass(game.color);

  return (
    <Link href={game.webUrl} prefetch={false} className="block h-full">
      <Card className="group cursor-pointer border border-white/70 bg-white/80  shadow-lg hover:shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden relative">
        <div className={`h-1.5 bg-linear-to-r ${gradientClass}`} />

        <CardHeader className="pb-3">
          <div className="mb-3">
            <div className="relative h-24 w-full overflow-hidden rounded-xl bg-slate-100">
              <ImageLoading
                src={game.image}
                alt={game.title}
                colorClass={gradientClass}
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
            asChild
            className={`w-full bg-linear-to-r ${gradientClass} hover:brightness-105 hover:shadow-md transition-all duration-300 group rounded-xl cursor-pointer`}
          >
            <span>
              <span className="text-sm font-semibold">Foydalanish</span>
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
