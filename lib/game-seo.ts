import type { Metadata } from "next";
import { buildMetadata, getAbsoluteUrl, siteConfig } from "@/lib/seo";
import { featuredGameIds } from "@/mock/featured-games";
import { eduGames } from "@/mock/mock-data";
import type { Game } from "@/types";

type GameSeoConfig = {
  title: string;
  description: string;
  path: string;
  image: string;
  keywords: string[];
};

const BASE_GAME_KEYWORDS = [
  "interaktiv o'yin",
  "o'quv o'yini",
  "dars uchun o'yin",
  "o'qituvchi metodlari",
  "interaktiv-ta'lim",
];

const buildGameKeywords = (game: Game) => {
  const normalizedTitle = game.title.toLowerCase();

  return Array.from(
    new Set([
      ...BASE_GAME_KEYWORDS,
      normalizedTitle,
      `${normalizedTitle} o'yini`,
      game.difficulty.toLowerCase(),
      game.players.toLowerCase(),
    ]),
  );
};

const buildGameSeoConfig = (game: Game): GameSeoConfig => ({
  title: game.title,
  description: `${game.description} Interaktiv-ta'lim platformasida ushbu o'yinni darsga moslab ishlating.`,
  path: game.webUrl,
  image: game.image,
  keywords: buildGameKeywords(game),
});

const featuredGameIdSet = new Set<string>(featuredGameIds);

export const mainGames = eduGames.filter((game) =>
  featuredGameIdSet.has(game.id),
);

const gameSeoByPath = new Map(
  mainGames.map((game) => [game.webUrl, buildGameSeoConfig(game)]),
);

export const buildGameMetadata = (path: string): Metadata => {
  const seo = gameSeoByPath.get(path);

  if (!seo) {
    return buildMetadata({
      title: "Interaktiv o'yin",
      description:
        "Interaktiv-ta'lim platformasidagi o'yin sahifasi. Darsni yanada qiziqarli olib boring.",
      path,
      keywords: BASE_GAME_KEYWORDS,
    });
  }

  return buildMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.path,
    image: seo.image,
    keywords: seo.keywords,
  });
};

export const buildGamesItemListJsonLd = (games: Game[], listName: string) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: listName,
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: games.length,
  itemListElement: games.map((game, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: getAbsoluteUrl(game.webUrl),
    item: {
      "@type": "WebPage",
      name: game.title,
      description: game.description,
      image: getAbsoluteUrl(game.image),
      inLanguage: siteConfig.locale.replace("_", "-"),
    },
  })),
});
