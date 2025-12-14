"use client";

import { categories } from "@/mock/mock-data";
import { useCategoryStore } from "@/store/use-games-store";
import ClientSideOnly from "@/components/ClientSideOnly";

const CategoriesSection = () => {
  const selectedCategoryId = useCategoryStore((s) => s.selectedCategoryId);
  const setSelectedCategoryId = useCategoryStore(
    (s) => s.setSelectedCategoryId
  );

  return (
    <ClientSideOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="flex hide-scrollbar overflow-x-auto py-4 gap-3 animate-fade-up" style={{ animationDelay: "60ms" }}>
          {categories.map((category) => {
            const isActive = category.id === selectedCategoryId;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`
                  px-5 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 
                  ${
                    isActive
                      ? "bg-linear-to-r from-sky-500 via-indigo-500 to-violet-500 text-white shadow-md"
                      : "bg-white/80 text-slate-700 hover:bg-slate-50/90 shadow-md border border-slate-100 backdrop-blur"
                  }
                `}
              >
                {category.title}
              </button>
            );
          })}
        </div>
      </div>
    </ClientSideOnly>
  );
};

export default CategoriesSection;
