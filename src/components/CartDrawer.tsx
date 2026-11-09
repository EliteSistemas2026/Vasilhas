import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  AlertCircle
} from 'lucide-react';
import { CartItem, StoreSettings } from '../types';
import { db } from '../services/db';
import { formatCurrency } from '../services/cep';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: StoreSettings;
  onProceedToCheckout: (couponCode?: string) => void;
  onUpdateQuantity: (productId: string, variationId: string | undefined, qty: number) => void;
  onRemoveItem: (productId: string, variationId?: string) => void;
}

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  cart,
  settings,
  onProceedToCheckout,
  onUpdateQuantity,
  onRemoveItem
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Recalculate using database anti-tampering logic
  const itemsForCalc = cart.map((i) => ({
    productId: i.productId,
    variationId: i.variationId,
    quantity: i.quantity
  }));

  const calc = db.recalculateCart(itemsForCalc, appliedCoupon || undefined, 'pickup', 'pix');
  const subtotal = calc.subtotal;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError(null);

    const result = db.validateCoupon(couponInput, subtotal);
    if (result.valid) {
      setAppliedCoupon(couponInput.trim().toUpperCase());
      setCouponInput('');
    } else {
      setCouponError(result.error || 'Cupom inválido.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Seu Carrinho</h3>
              <p className="text-xs text-stone-500">
                {cart.length} {cart.length === 1 ? 'item' : 'itens'} adicionados
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200/60 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-stone-300" />
              </div>
              <p className="text-base font-semibold text-stone-800">Seu carrinho está vazio</p>
              <p className="text-xs text-stone-400 mt-1 max-w-xs">
                Explore nossos potes herméticos, marmitas e organizadores para encher sua casa de praticidade.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 rounded-full bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition"
              >
                Começar a Comprar
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const unitPrice =
                item.promotionalPrice && item.promotionalPrice > 0
                  ? item.promotionalPrice
                  : item.price;
              const itemTotal = unitPrice * item.quantity;

              return (
                <div key={`${item.productId}-${item.variationId || 'default'}`} className="py-3.5 flex gap-3">
                  <div className="w-20 h-20 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-semibold text-stone-900 line-clamp-2 leading-tight">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.productId, item.variationId)}
                          className="text-stone-400 hover:text-rose-600 transition p-1"
                          title="Remover item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variationName && (
                        <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                          {item.variationName}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.variationId, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-white shadow-xs flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-stone-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          disabled={item.quantity >= item.maxStock}
                          onClick={() => onUpdateQuantity(item.productId, item.variationId, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-white shadow-xs flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-stone-100 disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-stone-900 block">
                          {formatCurrency(itemTotal)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-stone-400 block">
                            {formatCurrency(unitPrice)} un.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Coupon, Summary & Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/90 space-y-3.5">
            {/* Coupon Box */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-100 text-emerald-950 px-3 py-2 rounded-xl text-xs font-medium border border-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      Cupom <strong>{appliedCoupon}</strong> aplicado!
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-stone-500 hover:text-rose-700 text-xs font-bold"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Cupom de desconto (ex: BEMVINDO10)"
                    className="flex-1 bg-white border border-stone-300 px-3 py-2 rounded-xl text-xs uppercase focus:outline-none focus:border-emerald-700 font-medium"
                  />
                  <button
                    type="submit"
                    className="bg-stone-800 hover:bg-stone-900 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                  >
                    Aplicar
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {couponError}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200/60">
              <div className="flex justify-between">
                <span>Subtotal dos produtos:</span>
                <span className="font-semibold text-stone-900">{formatCurrency(subtotal)}</span>
              </div>
              {calc.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Desconto cupom:</span>
                  <span>- {formatCurrency(calc.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total:</span>
                <span className="text-base text-emerald-800">
                  {formatCurrency(Math.max(0, subtotal - calc.discount))}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout(appliedCoupon || undefined);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 text-center text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
