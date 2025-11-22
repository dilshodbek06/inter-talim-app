"use client";

import { motion } from "framer-motion";
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
    <div className="max-w-7xl mt-7 mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <motion.div
        key={selectedCategoryId}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.07,
              delayChildren: 0.15,
            },
          },
        }}
      >
        {filteredGames.length <= 0 ? (
          <div className="w-100 text-center">
            <p>Ma&apos;lumot topilmadi.</p>
          </div>
        ) : (
          filteredGames.map((game) => <GameItem game={game} key={game.id} />)
        )}
      </motion.div>
    </div>
  );
};

export default GamesGrid;
