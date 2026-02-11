import Script from "next/script";
import { mainGames, buildGamesItemListJsonLd } from "@/lib/game-seo";

type GamesStructuredDataProps = {
  id: string;
};

export const GamesStructuredData = ({ id }: GamesStructuredDataProps) => {
  const jsonLd = buildGamesItemListJsonLd(
    mainGames,
    "Interaktiv-ta'lim qiziqarli o'yinlari",
  );

  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
