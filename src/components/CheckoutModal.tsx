import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Truck,
  CreditCard,
  QrCode,
  DollarSign,
  Store,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import {
  CartItem,
  StoreSettings,
  DeliveryMethod,
  PaymentMethod,
  Order
} from '../types';
import { db } from '../services/db';
import {
  formatCurrency,
  fetchAddressByCep,
  formatCep,
  formatPhone
} from '../services/cep';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: StoreSettings;
  initialCouponCode?: string;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  cart,
  settings,
  initialCouponCode,
  onOrderCompleted
}) => {
  if (!isOpen) return null;

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [notes, setNotes] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    settings.deliveryRules.localDeliveryEnabled ? 'local' : 'pickup'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [changeFor, setChangeFor] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>(initialCouponCode || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-fetch ViaCEP
  const handleCepBlur = async () => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length === 8) {
      setLoadingCep(true);
      const res = await fetchAddressByCep(clean);
      setLoadingCep(false);
      if (res) {
        setStreet(res.logradouro || '');
        setNeighborhood(res.bairro || '');
        setCity(res.localidade || '');
        setState(res.uf || '');
      }
    }
  };

  // Recalculate using database anti-tampering logic
  const itemsForCalc = cart.map((i) => ({
    productId: i.productId,
    variationId: i.variationId,
    quantity: i.quantity
  }));

  const calc = db.recalculateCart(itemsForCalc, couponCode, deliveryMethod, paymentMethod);

  // Validate form submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Por favor, informe um WhatsApp válido com DDD.');
      return;
    }

    if (deliveryMethod !== 'pickup') {
      if (!street.trim() || !number.trim() || !neighborhood.trim() || !city.trim()) {
        setErrorMessage('Por favor, preencha o endereço completo de entrega.');
        return;
      }
    }

    if (calc.total < settings.minOrderValue) {
      setErrorMessage(
        `O valor mínimo para pedidos nesta loja é de ${formatCurrency(settings.minOrderValue)}.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Build order items from verified server calculations
      const orderItems = calc.itemsValidated.map((item) => {
        const unitPrice =
          item.promotionalPrice && item.promotionalPrice > 0
            ? item.promotionalPrice
            : item.price;
        return {
          productId: item.productId,
          variationId: item.variationId,
          name: item.name,
          sku: item.variationId || item.productId,
          image: item.image,
          unitPrice,
          quantity: item.quantity,
          totalPrice: unitPrice * item.quantity,
          variationName: item.variationName
        };
      });

      const orderPayload: Parameters<typeof db.placeOrder>[0] = {
        customer: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim() || undefined
        },
        address:
          deliveryMethod === 'pickup'
            ? undefined
            : {
                cep: cep.trim(),
                street: street.trim(),
                number: number.trim(),
                complement: complement.trim() || undefined,
                neighborhood: neighborhood.trim(),
                city: city.trim(),
                state: state.trim(),
                notes: notes.trim() || undefined
              },
        deliveryMethod,
        deliveryFee: 0,
        items: orderItems,
        subtotal: calc.subtotal,
        discount: calc.discount,
        total: calc.total,
        couponCode: couponCode || undefined,
        paymentMethod,
        paymentStatus: paymentMethod === 'pix' ? 'pending' : 'pending',
        changeFor: paymentMethod === 'cash_on_delivery' && changeFor ? Number(changeFor) : undefined,
        status: 'received'
      };

      const result = db.placeOrder(orderPayload);
      setIsSubmitting(false);

      if (result.success && result.order) {
        onOrderCompleted(result.order);
      } else {
        setErrorMessage(result.error || 'Não foi possível finalizar o pedido.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('Ocorreu um erro ao processar seu pedido. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-stone-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 tracking-wider uppercase">
              Finalização Segura
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
              Checkout Simplificado (Sem Cadastro)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-stone-200 text-stone-600 flex items-center justify-center transition border border-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-4 sm:p-6">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Dados do Cliente */}
              <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-bold text-stone-900 text-sm">Seus Dados</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: João da Silva"
                      className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        WhatsApp (com DDD) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(formatPhone(e.target.value))}
                        placeholder="(11) 99999-8888"
                        className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        E-mail (opcional)
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Método de Entrega */}
              <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-bold text-stone-900 text-sm">Opção de Entrega</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {settings.deliveryRules.localDeliveryEnabled && (
                    <label
                      className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition ${
                        deliveryMethod === 'local'
                          ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'local'}
                        onChange={() => setDeliveryMethod('local')}
                        className="mt-1 text-emerald-700 focus:ring-emerald-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-stone-900">
                          <Truck className="w-4 h-4 text-emerald-700" />
                          <span>Entrega no Endereço</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Envio e entrega direta no seu endereço
                        </p>
                      </div>
                    </label>
                  )}

                  {settings.deliveryRules.pickupEnabled && (
                    <label
                      className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition ${
                        deliveryMethod === 'pickup'
                          ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'pickup'}
                        onChange={() => setDeliveryMethod('pickup')}
                        className="mt-1 text-emerald-700 focus:ring-emerald-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-stone-900">
                          <Store className="w-4 h-4 text-emerald-700" />
                          <span>Retirada no Balcão</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Retire diretamente em nossa loja
                        </p>
                      </div>
                    </label>
                  )}
                </div>

                {deliveryMethod === 'pickup' ? (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-600">
                    <p className="font-semibold text-stone-800">Endereço para retirada:</p>
                    <p>{settings.address} - {settings.neighborhood}, {settings.city} - {settings.state}</p>
                    <p className="text-[11px] text-stone-400 mt-1">Horário: {settings.openingHours}</p>
                  </div>
                ) : (
                  /* Address Fields */
                  <div className="mt-4 pt-4 border-t border-stone-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-medium text-stone-700 mb-1">
                          CEP (com busca auto) *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={cep}
                            onChange={(e) => setCep(formatCep(e.target.value))}
                            onBlur={handleCepBlur}
                            placeholder="00000-000"
                            maxLength={9}
                            className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                          />
                          {loadingCep && (
                            <Loader2 className="w-3.5 h-3.5 text-emerald-700 animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-stone-700 mb-1">
                          Rua / Avenida *
                        </label>
                        <input
                          type="text"
                          required
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="Ex: Rua das Flores"
                          className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-stone-700 mb-1">
                          Número *
                        </label>
                        <input
                          type="text"
                          required
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          placeholder="123"
                          className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-stone-700 mb-1">
                          Complemento
                        </label>
                        <input
                          type="text"
                          value={complement}
                          onChange={(e) => setComplement(e.target.value)}
                          placeholder="Apto 42"
                          className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-stone-700 mb-1">
                          Bairro *
                        </label>
                        <input
                          type="text"
                          required
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          placeholder="Centro"
                          className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-stone-700 mb-1">
                          Cidade/UF *
                        </label>
                        <input
                          type="text"
                          required
                          value={city ? `${city} - ${state}` : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCity(val);
                          }}
                          placeholder="São Paulo - SP"
                          className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Ponto de referência ou observações da entrega (opcional)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ex: Deixar na portaria, campainha azul"
                        className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Forma de Pagamento */}
              <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-bold text-stone-900 text-sm">Forma de Pagamento</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {settings.paymentMethods.pix && (
                    <label
                      className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition ${
                        paymentMethod === 'pix'
                          ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'pix'}
                        onChange={() => setPaymentMethod('pix')}
                        className="mt-1 text-emerald-700 focus:ring-emerald-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                          <QrCode className="w-4 h-4 text-emerald-700" />
                          <span>Pix Instantâneo</span>
                          <span className="bg-emerald-700 text-white text-[10px] px-1.5 py-0.2 rounded font-black">
                            -{settings.pixDiscountPercent}%
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          QR Code gerado na hora com desconto automático
                        </p>
                      </div>
                    </label>
                  )}

                  {settings.paymentMethods.creditCard && (
                    <label
                      className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition ${
                        paymentMethod === 'credit_card'
                          ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'credit_card'}
                        onChange={() => setPaymentMethod('credit_card')}
                        className="mt-1 text-emerald-700 focus:ring-emerald-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                          <CreditCard className="w-4 h-4 text-emerald-700" />
                          <span>Cartão de Crédito</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Parcele em até 3x sem juros (ou maquininha na entrega)
                        </p>
                      </div>
                    </label>
                  )}

                  {settings.paymentMethods.cashOnDelivery && deliveryMethod !== 'pickup' && (
                    <label
                      className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={() => setPaymentMethod('cash_on_delivery')}
                        className="mt-1 text-emerald-700 focus:ring-emerald-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                          <DollarSign className="w-4 h-4 text-emerald-700" />
                          <span>Dinheiro na Entrega</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Pague direto ao entregador no recebimento
                        </p>
                      </div>
                    </label>
                  )}

                  {settings.paymentMethods.payOnPickup && deliveryMethod === 'pickup' && (
                    <label
                      className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition ${
                        paymentMethod === 'pay_on_pickup'
                          ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'pay_on_pickup'}
                        onChange={() => setPaymentMethod('pay_on_pickup')}
                        className="mt-1 text-emerald-700 focus:ring-emerald-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                          <Store className="w-4 h-4 text-emerald-700" />
                          <span>Pagar no Balcão de Retirada</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Dinheiro, Pix, Débito ou Crédito na retirada
                        </p>
                      </div>
                    </label>
                  )}
                </div>

                {paymentMethod === 'cash_on_delivery' && (
                  <div className="mt-3 pt-3 border-t border-stone-200">
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      Precisa de troco para quanto? (opcional)
                    </label>
                    <input
                      type="number"
                      value={changeFor}
                      onChange={(e) => setChangeFor(e.target.value)}
                      placeholder="Ex: 100,00"
                      className="w-full sm:w-48 bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                <h3 className="font-bold text-stone-900 text-sm pb-2 border-b border-stone-200 flex items-center justify-between">
                  <span>Itens do Pedido</span>
                  <span className="text-xs text-stone-500 font-normal">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)} produtos
                  </span>
                </h3>

                {/* Items mini list */}
                <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 divide-y divide-stone-100">
                  {cart.map((item) => (
                    <div key={`${item.productId}-${item.variationId || ''}`} className="pt-2 flex items-center gap-2.5 text-xs">
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-white border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-stone-500">
                          {item.quantity}x {formatCurrency(item.promotionalPrice || item.price)}
                          {item.variationName && ` • ${item.variationName}`}
                        </p>
                      </div>
                      <span className="font-bold text-stone-900 shrink-0">
                        {formatCurrency((item.promotionalPrice || item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals Breakdown */}
                <div className="pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-stone-900">{formatCurrency(calc.subtotal)}</span>
                  </div>

                  {calc.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Descontos (Cupom/Pix):</span>
                      <span>- {formatCurrency(calc.discount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-stone-900">Total a Pagar:</span>
                    <span className="text-xl font-black text-emerald-800">
                      {formatCurrency(calc.total)}
                    </span>
                  </div>
                </div>

                {/* Trust Seal */}
                <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Compra 100% segura • Satisfação garantida</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/20 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Confirmando Pedido...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmar Pedido ({formatCurrency(calc.total)})</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
