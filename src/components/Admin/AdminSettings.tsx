import React, { useState } from 'react';
import { Save, Store, Truck, DollarSign, Shield, Phone, Check } from 'lucide-react';
import { StoreSettings } from '../../types';

interface Props {
  settings: StoreSettings;
  onUpdateSettings: (partial: Partial<StoreSettings>) => void;
}

export const AdminSettings: React.FC<Props> = ({ settings, onUpdateSettings }) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs max-w-4xl">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div>
          <h3 className="font-bold text-stone-900 text-base">Configurações Gerais da Loja</h3>
          <p className="text-stone-500">Altere o nome, contatos, políticas de entrega e métodos de pagamento</p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-2 shadow-sm transition"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Salvo com Sucesso!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Salvar Configurações</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Identidade e Contato */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
        <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-stone-100">
          <Store className="w-4 h-4 text-emerald-700" />
          <span>Identidade e Atendimento</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-stone-700 mb-1">Nome da Loja *</label>
            <input
              type="text"
              required
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700 font-semibold"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Slogan / Frase Curta</label>
            <input
              type="text"
              value={formData.slogan}
              onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-medium text-stone-700 mb-1">WhatsApp Comercial *</label>
            <input
              type="text"
              required
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="5511999998888"
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Telefone Fixo</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">E-mail de Contato</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-stone-700 mb-1">Endereço da Loja Física / Balcão</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Horário de Funcionamento</label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>
      </div>

      {/* 2. Regras de Frete e Entrega */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
        <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-stone-100">
          <Truck className="w-4 h-4 text-emerald-700" />
          <span>Regras de Entrega e Frete</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-medium text-stone-700 mb-1">Valor Mínimo para Frete Grátis (R$)</label>
            <input
              type="number"
              step="0.01"
              value={formData.freeShippingMin}
              onChange={(e) => setFormData({ ...formData, freeShippingMin: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700 font-bold"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Taxa Entrega Local Padrão (R$)</label>
            <input
              type="number"
              step="0.01"
              value={formData.localDeliveryFee}
              onChange={(e) => setFormData({ ...formData, localDeliveryFee: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700 font-bold"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Valor Mínimo de Compra na Loja (R$)</label>
            <input
              type="number"
              step="0.01"
              value={formData.minOrderValue}
              onChange={(e) => setFormData({ ...formData, minOrderValue: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700 font-bold"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-4 text-stone-700">
          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={formData.deliveryRules.pickupEnabled}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deliveryRules: { ...formData.deliveryRules, pickupEnabled: e.target.checked }
                })
              }
              className="rounded text-emerald-700"
            />
            <span>Permitir Retirada no Balcão da Loja</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={formData.deliveryRules.localDeliveryEnabled}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deliveryRules: { ...formData.deliveryRules, localDeliveryEnabled: e.target.checked }
                })
              }
              className="rounded text-emerald-700"
            />
            <span>Permitir Entrega Local Expressa (Motoboy)</span>
          </label>
        </div>
      </div>

      {/* 3. Pagamento e Pix */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
        <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-stone-100">
          <DollarSign className="w-4 h-4 text-emerald-700" />
          <span>Configuração do Pix e Pagamentos</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-medium text-stone-700 mb-1">Desconto no Pix (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.pixDiscountPercent}
              onChange={(e) => setFormData({ ...formData, pixDiscountPercent: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700 font-bold text-emerald-800"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Chave Pix da Loja</label>
            <input
              type="text"
              value={formData.pixKey}
              onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
              placeholder="CNPJ, e-mail ou celular"
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Nome do Favorecido no Pix</label>
            <input
              type="text"
              value={formData.pixReceiverName}
              onChange={(e) => setFormData({ ...formData, pixReceiverName: e.target.value })}
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-4 text-stone-700">
          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={formData.paymentMethods.pix}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentMethods: { ...formData.paymentMethods, pix: e.target.checked }
                })
              }
              className="rounded text-emerald-700"
            />
            <span>Aceitar Pix</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={formData.paymentMethods.creditCard}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentMethods: { ...formData.paymentMethods, creditCard: e.target.checked }
                })
              }
              className="rounded text-emerald-700"
            />
            <span>Aceitar Cartão de Crédito</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={formData.paymentMethods.cashOnDelivery}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentMethods: { ...formData.paymentMethods, cashOnDelivery: e.target.checked }
                })
              }
              className="rounded text-emerald-700"
            />
            <span>Aceitar Dinheiro na Entrega</span>
          </label>
        </div>
      </div>

      {/* 4. Políticas */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
        <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-stone-100">
          <Shield className="w-4 h-4 text-emerald-700" />
          <span>Políticas da Loja</span>
        </h4>

        <div>
          <label className="block font-medium text-stone-700 mb-1">Política de Trocas e Devoluções</label>
          <textarea
            rows={2}
            value={formData.returnPolicy}
            onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
            className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700"
          />
        </div>

        <div>
          <label className="block font-medium text-stone-700 mb-1">Política de Privacidade</label>
          <textarea
            rows={2}
            value={formData.privacyPolicy}
            onChange={(e) => setFormData({ ...formData, privacyPolicy: e.target.value })}
            className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700"
          />
        </div>
      </div>
    </form>
  );
};
