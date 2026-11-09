import React from 'react';
import { Plus, Check, Eye } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../services/cep';

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isAddedToCart?: boolean;
}

export const ProductCard: React.FC<Props> = ({
  product,
  onAddToCart,
  onViewDetails,
  isAddedToCart
}) => {
  const currentPrice =
    product.promotionalPrice && product.promotionalPrice > 0
      ? product.promotionalPrice
      : product.price;

  const hasDiscount =
    product.promotionalPrice &&
    product.promotionalPrice > 0 &&
    product.promotionalPrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.promotionalPrice!) / product.price) * 100)
    : 0;

  const isLowStock = product.stock > 0 && product.stock <= product.minStock;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Image container & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {hasDiscount && (
            <span className="bg-rose-600 text-white font-black text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-amber-500 text-stone-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full shadow-sm">
              Destaque
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-emerald-700 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full shadow-sm">
              Mais Vendido
            </span>
          )}
        </div>

        {/* Capacity / Material pill tag */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="bg-stone-900/80 backdrop-blur-md text-white font-medium text-[10px] px-2.5 py-1 rounded-full truncate max-w-[150px]">
            {product.capacity}
          </span>
          {isLowStock && (
            <span className="bg-amber-600/90 backdrop-blur-md text-white font-bold text-[10px] px-2 py-1 rounded-full animate-pulse">
              Restam {product.stock}!
            </span>
          )}
        </div>

        {/* Quick View Button overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none sm:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="bg-white/95 hover:bg-white text-stone-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Detalhes</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Material & Tags */}
          <p className="text-[11px] font-semibold text-emerald-800 tracking-wide uppercase line-clamp-1 mb-1">
            {product.material.split('+')[0].split('e')[0]}
          </p>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(product)}
            className="text-sm font-semibold text-stone-900 hover:text-emerald-800 transition line-clamp-2 cursor-pointer leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            {hasDiscount && (
              <span className="text-xs text-stone-400 line-through block">
                {formatCurrency(product.price)}
              </span>
            )}
            <div className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
              {formatCurrency(currentPrice)}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block">
              ou {formatCurrency(currentPrice * 0.95)} no Pix
            </span>
          </div>

          <div>
            {isOutOfStock ? (
              <span className="text-[11px] font-bold text-stone-400 bg-stone-100 px-3 py-1.5 rounded-full">
                Esgotado
              </span>
            ) : product.variations && product.variations.length > 0 ? (
              <button
                onClick={() => onViewDetails(product)}
                className="bg-stone-100 hover:bg-emerald-800 hover:text-white text-stone-800 font-semibold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1 shadow-sm"
              >
                <span>Opções</span>
              </button>
            ) : (
              <button
                onClick={() => onAddToCart(product)}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl font-semibold text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
                  isAddedToCart
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                }`}
                title="Adicionar ao Carrinho"
              >
                {isAddedToCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Adicionado</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Adicionar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
