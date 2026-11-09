import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  Copy,
  Printer,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, StoreSettings } from '../types';
import { formatCurrency } from '../services/cep';

interface Props {
  order: Order | null;
  settings: StoreSettings;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<Props> = ({
  order,
  settings,
  onClose
}) => {
  if (!order) return null;

  const [copiedPix, setCopiedPix] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const pixCopyPasteCode = `00020126580014BR.GOV.BCB.PIX0114${settings.pixKey}5204000053039865406${order.total.toFixed(2)}5802BR5925${settings.pixReceiverName.slice(0, 25)}6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCopyPasteCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  // WhatsApp formatted message link
  const itemsText = order.items
    .map((i) => `• ${i.quantity}x ${i.name} (${formatCurrency(i.unitPrice)})`)
    .join('%0A');

  const deliveryText =
    order.deliveryMethod === 'pickup'
      ? 'Retirada na Loja'
      : `${order.address?.street}, ${order.address?.number} - ${order.address?.neighborhood}, ${order.address?.city}/${order.address?.state}`;

  const whatsappMessage = `*NOVO PEDIDO - ${order.code}*%0A%0A*Cliente:* ${order.customer.name}%0A*Telefone:* ${order.customer.phone}%0A%0A*Itens:*%0A${itemsText}%0A%0A*Entrega:* ${deliveryText}%0A*Total:* ${formatCurrency(order.total)}%0A*Forma de Pagamento:* ${order.paymentMethod.toUpperCase()}`;

  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-stone-200">
        {/* Celebration Header */}
        <div className="bg-emerald-800 text-white p-6 sm:p-8 text-center relative">
          <div className="w-16 h-16 rounded-full bg-white/10 text-emerald-300 flex items-center justify-center mx-auto mb-3 border border-white/20">
            <CheckCircle className="w-10 h-10 text-emerald-300" />
          </div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-200">
            Pedido Realizado com Sucesso!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Código: <span className="text-amber-300">{order.code}</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2 max-w-md mx-auto">
            Obrigado pela sua compra, <strong>{order.customer.name}</strong>! Já registramos seu pedido em nosso sistema.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Pix Payment box if chosen */}
          {order.paymentMethod === 'pix' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2 text-emerald-900 font-bold text-sm">
                <QrCode className="w-5 h-5 text-emerald-700" />
                <span>Pagamento via Pix ({formatCurrency(order.total)})</span>
              </div>
              <p className="text-xs text-emerald-800 mb-4 leading-relaxed">
                Escaneie o QR Code abaixo com o aplicativo do seu banco ou copie a chave Pix Copia e Cola para pagar imediatamente:
              </p>

              {/* Real QR Code Display */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-emerald-200">
                <div className="w-36 h-36 bg-white p-2 rounded-xl border border-stone-200 shrink-0 shadow-xs flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=2&data=${encodeURIComponent(
                      pixCopyPasteCode
                    )}`}
                    alt="QR Code Pix"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 w-full space-y-2">
                  <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                    Código Pix Copia e Cola
                  </span>
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-stone-600 font-mono text-[10px] break-all max-h-16 overflow-y-auto">
                    {pixCopyPasteCode}
                  </div>
                  <button
                    onClick={handleCopyPix}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    {copiedPix ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Código Pix Copiado com Sucesso!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Código Pix</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-2 text-center">
                Chave cadastrada: <strong>{settings.pixKey}</strong> ({settings.pixReceiverName})
              </p>
            </div>
          )}

          {/* Order Details Receipt Box (with print-area id) */}
          <div id="print-area" className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div>
                <span className="font-bold text-stone-900 text-sm">{settings.storeName}</span>
                <p className="text-stone-500">{new Date(order.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 uppercase text-[10px]">
                Status: {order.status.toUpperCase()}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="font-semibold text-stone-700 block">Itens Comprados:</span>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-stone-800">
                  <span>
                    {item.quantity}x {item.name} {item.variationName && `(${item.variationName})`}
                  </span>
                  <span className="font-semibold">{formatCurrency(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            {/* Delivery & Payment details */}
            <div className="pt-3 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-600">
              <div>
                <span className="font-semibold text-stone-900 block">Modalidade de Entrega:</span>
                <span>
                  {order.deliveryMethod === 'pickup' ? 'Retirada na Loja' : 'Entrega Local'}
                </span>
                {order.address && (
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {order.address.street}, {order.address.number} - {order.address.neighborhood}
                  </p>
                )}
              </div>
              <div>
                <span className="font-semibold text-stone-900 block">Forma de Pagamento:</span>
                <span>{order.paymentMethod.toUpperCase()}</span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Situação: {order.paymentStatus === 'paid' ? 'Pago' : 'Pendente / Pagamento na entrega'}
                </p>
              </div>
            </div>

            {/* Total balance */}
            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-sm">
              <span className="font-bold text-stone-900">Total do Pedido:</span>
              <span className="text-lg font-black text-emerald-800">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            {/* WhatsApp Send Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Enviar Resumo pelo WhatsApp da Loja</span>
            </a>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4 text-stone-600" />
                <span>Imprimir Recibo</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs text-center transition"
              >
                Voltar à Loja
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
