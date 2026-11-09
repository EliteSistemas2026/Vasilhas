import React, { useState } from 'react';
import { Plus, Tag, Trash2, X, Check, AlertCircle } from 'lucide-react';
import { Coupon } from '../../types';
import { formatCurrency } from '../../services/cep';

interface Props {
  coupons: Coupon[];
  onSaveCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (id: string) => void;
}

export const AdminCoupons: React.FC<Props> = ({
  coupons,
  onSaveCoupon,
  onDeleteCoupon
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState('10');
  const [minOrderValue, setMinOrderValue] = useState('50.00');
  const [usageLimit, setUsageLimit] = useState('100');
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);

  const openNewModal = () => {
    setCode('');
    setType('percent');
    setValue('10');
    setMinOrderValue('50.00');
    setUsageLimit('200');
    setExpiresAt('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const coupon: Coupon = {
      id: 'coup-' + Date.now(),
      code: code.trim().toUpperCase(),
      type,
      value: parseFloat(value) || 0,
      minOrderValue: parseFloat(minOrderValue) || 0,
      usageLimit: parseInt(usageLimit, 10) || 100,
      timesUsed: 0,
      expiresAt: expiresAt || undefined,
      isActive
    };

    onSaveCoupon(coupon);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-stone-900 text-base">Cupons de Desconto & Campanhas</h3>
          <p className="text-xs text-stone-500">Crie códigos promocionais para impulsionar suas vendas</p>
        </div>

        <button
          onClick={openNewModal}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Cupom</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between transition ${
              coupon.isActive ? 'border-stone-200' : 'border-stone-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-sm bg-stone-100 text-emerald-900 px-2.5 py-1 rounded-lg">
                  {coupon.code}
                </span>
                <span className={`text-[10px] font-bold ${coupon.isActive ? 'text-emerald-700' : 'text-stone-400'}`}>
                  {coupon.isActive ? '● Ativo' : '○ Inativo'}
                </span>
              </div>

              <div className="mt-3">
                <div className="text-lg font-black text-stone-900">
                  {coupon.type === 'percent' ? `${coupon.value}% OFF` : `${formatCurrency(coupon.value)} OFF`}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Mínimo do pedido: <strong>{formatCurrency(coupon.minOrderValue)}</strong>
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  Utilizado {coupon.timesUsed} de {coupon.usageLimit} vezes
                </p>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-stone-400">
                {coupon.expiresAt
                  ? `Validade: ${new Date(coupon.expiresAt).toLocaleDateString('pt-BR')}`
                  : 'Sem expiração'}
              </span>

              <button
                onClick={() => {
                  if (window.confirm(`Excluir cupom ${coupon.code}?`)) {
                    onDeleteCoupon(coupon.id);
                  }
                }}
                className="text-stone-400 hover:text-rose-600 p-1"
                title="Excluir cupom"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-stone-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm">Novo Cupom de Desconto</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Código do Cupom *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ex: MAIO10"
                  className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs uppercase font-mono font-bold focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Tipo de Desconto</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'percent' | 'fixed')}
                    className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  >
                    <option value="percent">Percentual (%)</option>
                    <option value="fixed">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Valor do Desconto *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Valor Mínimo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Limite de Usos</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Data de Expiração (opcional)</label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-emerald-700"
                  />
                  <span>Cupom Ativo Imediatamente</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  Salvar Cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
