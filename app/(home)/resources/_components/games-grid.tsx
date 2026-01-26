"use client";

import { eduGames, categories } from "@/mock/mock-data";
import GameItem from "./game-item";
import { useCategoryStore } from "@/store/use-games-store";

const GamesGrid = () => {
  const selectedCategoryId = useCategoryStore((s) => s.selectedCategoryId);
  const allCategoryId = categories[0]?.id ?? "all";

  const filteredGames =
    selectedCategoryId === allCategoryId
      ? eduGames
      : eduGames.filter((g) => g.categoryId === selectedCategoryId);

  return (
    <div className="max-w-7xl mt-2 mx-auto px-4 sm:px-6 lg:px-8 pb-14">
      <div
        key={selectedCategoryId}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in"
      >
        {filteredGames.length <= 0 ? (
          <div className="w-full text-center py-10">
            <p className="text-gray-500 text-lg">Ma&apos;lumot topilmadi.</p>
          </div>
        ) : (
          filteredGames.map((game) => (
            <div key={game.id}>
              <GameItem game={game} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GamesGrid;
