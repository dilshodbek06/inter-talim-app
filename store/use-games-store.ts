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
