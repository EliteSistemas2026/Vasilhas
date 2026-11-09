import React, { useState } from 'react';
import {
  X,
  Check,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Layers,
  Info
} from 'lucide-react';
import { Product, ProductVariation } from '../types';
import { formatCurrency } from '../services/cep';

interface Props {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  onBuyNow: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  relatedProducts: Product[];
  onSelectProduct: (p: Product) => void;
}

export const ProductDetailModal: React.FC<Props> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  relatedProducts,
  onSelectProduct
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(
    product.variations && product.variations.length > 0 ? product.variations[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isSuccessAdded, setIsSuccessAdded] = useState(false);

  const selectedVariation = product.variations?.find((v) => v.id === selectedVariationId);

  const currentPrice = selectedVariation
    ? selectedVariation.promotionalPrice && selectedVariation.promotionalPrice > 0
      ? selectedVariation.promotionalPrice
      : selectedVariation.price
    : product.promotionalPrice && product.promotionalPrice > 0
    ? product.promotionalPrice
    : product.price;

  const originalPrice = selectedVariation ? selectedVariation.price : product.price;
  const hasDiscount = currentPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const currentStock = selectedVariation ? selectedVariation.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const handleAdd = () => {
    onAddToCart(product, selectedVariation, quantity);
    setIsSuccessAdded(true);
    setTimeout(() => setIsSuccessAdded(false), 2200);
  };

  const handleBuy = () => {
    onBuyNow(product, selectedVariation, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-stone-100 text-stone-600 hover:text-stone-900 flex items-center justify-center shadow-md transition"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="bg-stone-100 p-6 flex flex-col justify-between">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white font-extrabold text-xs uppercase px-2.5 py-1 rounded-full shadow-md">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail switcher */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-emerald-700 ring-2 ring-emerald-700/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Technical Highlights */}
            <div className="mt-6 pt-4 border-t border-stone-200 grid grid-cols-2 gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>100% Livre de BPA</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Vedação Hermética</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Garantia de 7 dias</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* SKU & Stock status */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span>SKU: {selectedVariation ? selectedVariation.sku : product.sku}</span>
                {isOutOfStock ? (
                  <span className="text-rose-600 font-bold">Produto Esgotado</span>
                ) : currentStock <= product.minStock ? (
                  <span className="text-amber-600 font-semibold">
                    Apenas {currentStock} em estoque!
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold">
                    Em estoque ({currentStock} unid.)
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                {product.name}
              </h2>

              {/* Price display */}
              <div className="mt-3 flex items-baseline gap-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {formatCurrency(currentPrice)}
                </div>
                {hasDiscount && (
                  <div className="text-sm text-stone-400 line-through">
                    {formatCurrency(originalPrice)}
                  </div>
                )}
              </div>
              <p className="text-xs text-emerald-800 font-semibold mt-1">
                {formatCurrency(currentPrice * 0.95)} com 5% de desconto no Pix
              </p>

              {/* Variations selector if applicable */}
              {product.variations && product.variations.length > 0 && (
                <div className="mt-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Escolha a Variação / Tamanho:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variations.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariationId(v.id)}
                        className={`px-3 py-2.5 rounded-xl border text-left text-xs transition flex flex-col justify-between ${
                          selectedVariationId === v.id
                            ? 'border-emerald-700 bg-emerald-50/50 text-emerald-950 font-semibold ring-1 ring-emerald-700'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <span className="truncate">{v.name}</span>
                        <span className="text-[11px] text-stone-500 mt-0.5">
                          {formatCurrency(v.promotionalPrice || v.price)} • {v.stock > 0 ? `${v.stock} disp.` : 'Esgotado'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications pills */}
              <div className="mt-5 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Material:</span>
                  <span className="font-semibold text-stone-900 text-right">{product.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Capacidade:</span>
                  <span className="font-semibold text-stone-900">{product.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Dimensões:</span>
                  <span className="font-semibold text-stone-900">{product.dimensions}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase text-stone-800 tracking-wider mb-1">
                  Descrição
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed max-h-32 overflow-y-auto pr-1">
                  {product.description}
                </p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-50 text-emerald-800 text-[10px] font-medium px-2 py-0.5 rounded-md border border-emerald-100"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="mt-6 pt-5 border-t border-stone-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 p-1">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-stone-700 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-stone-900">
                    {quantity}
                  </span>
                  <button
                    disabled={quantity >= currentStock}
                    onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-stone-700 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs text-stone-500">
                  Subtotal: <strong className="text-stone-900">{formatCurrency(currentPrice * quantity)}</strong>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  disabled={isOutOfStock}
                  onClick={handleAdd}
                  className={`py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-md ${
                    isSuccessAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white disabled:bg-stone-300'
                  }`}
                >
                  {isSuccessAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Adicionado!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}</span>
                    </>
                  )}
                </button>

                <button
                  disabled={isOutOfStock}
                  onClick={handleBuy}
                  className="py-3.5 px-4 rounded-2xl font-bold text-sm bg-stone-900 hover:bg-black text-white flex items-center justify-center gap-2 transition active:scale-95 shadow-md disabled:bg-stone-300"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Comprar Agora</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="p-6 bg-stone-50 border-t border-stone-200">
            <h4 className="text-sm font-bold text-stone-900 mb-3">
              Quem comprou este produto também levou:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedProducts.slice(0, 4).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    onSelectProduct(rel);
                    setActiveImageIndex(0);
                    setSelectedVariationId(rel.variations?.[0]?.id || null);
                    setQuantity(1);
                  }}
                  className="bg-white p-2.5 rounded-xl border border-stone-200 hover:border-emerald-400 cursor-pointer transition group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-stone-100 mb-2">
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <h5 className="text-xs font-medium text-stone-800 line-clamp-1">
                    {rel.name}
                  </h5>
                  <span className="text-xs font-bold text-emerald-800 mt-1 block">
                    {formatCurrency(rel.promotionalPrice || rel.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
