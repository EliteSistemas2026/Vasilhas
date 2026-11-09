import React from 'react';
import { Category } from '../types';

interface Props {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export const CategoryBar: React.FC<Props> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  const activeCategories = categories.filter((c) => c.isActive).sort((a, b) => a.order - b.order);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Categorias em Destaque
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Encontre a vasilha ou pote ideal para cada cantinho da sua casa
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
          >
            Limpar filtro
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {activeCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer border transition-all text-center p-3 flex flex-col items-center justify-between ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 shadow-md'
                  : 'bg-white border-stone-200 hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 mb-2 relative group-hover:scale-105 transition-transform duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <span
                className={`text-xs font-semibold leading-tight line-clamp-2 ${
                  isSelected ? 'text-emerald-900' : 'text-stone-800 group-hover:text-emerald-800'
                }`}
              >
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
