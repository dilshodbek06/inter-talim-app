// stores/useCategoryStore.ts
"use client";

import { create } from "zustand";
import { categories } from "@/mock/mock-data";

type CategoryState = {
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  reset: () => void;
};

const defaultCategoryId = categories[0]?.id ?? "all";

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategoryId: defaultCategoryId,
  setSelectedCategoryId: (id: string) => set({ selectedCategoryId: id }),
  reset: () => set({ selectedCategoryId: defaultCategoryId }),
}));

/*
  // Optional: add persistence with zustand/middleware
  import { persist } from "zustand/middleware";
  export const useCategoryStore = create(
    persist<CategoryState>(
      (set) => ({
        selectedCategoryId: defaultCategoryId,
        setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
        reset: () => set({ selectedCategoryId: defaultCategoryId }),
      }),
      { name: "category-storage" }
    )
  );
*/
