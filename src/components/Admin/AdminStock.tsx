import React, { useState } from 'react';
import {
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
  Plus,
  Minus,
  CheckCircle,
  Search
} from 'lucide-react';
import { Product, InventoryMovement } from '../../types';

interface Props {
  products: Product[];
  movements: InventoryMovement[];
  onAdjustStock: (
    productId: string,
    quantityDelta: number,
    type: 'in' | 'out' | 'adjustment',
    reason: string,
    variationId?: string
  ) => void;
}

export const AdminStock: React.FC<Props> = ({
  products,
  movements,
  onAdjustStock
}) => {
  const [search, setSearch] = useState('');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Modal for quick manual adjustment
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [adjustQuantity, setAdjustQuantity] = useState('5');
  const [adjustReason, setAdjustReason] = useState('Entrada de nova remessa de estoque');
  const [selectedVarId, setSelectedVarId] = useState<string>('');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const isLow = p.stock <= p.minStock;
    return matchesSearch && (!onlyLowStock || isLow);
  });

  const handleOpenAdjust = (p: Product) => {
    setSelectedProduct(p);
    setAdjustmentType('in');
    setAdjustQuantity('5');
    setAdjustReason('Entrada de novo lote');
    setSelectedVarId(p.variations?.[0]?.id || '');
  };

  const handleExecuteAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const qty = parseInt(adjustQuantity, 10) || 0;
    if (qty <= 0) return;

    const delta = adjustmentType === 'out' ? -qty : qty;
    onAdjustStock(
      selectedProduct.id,
      delta,
      adjustmentType,
      adjustReason.trim() || 'Ajuste manual de estoque',
      selectedVarId || undefined
    );

    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Low Stock Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por produto ou SKU..."
              className="w-full bg-white pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700">
            <input
              type="checkbox"
              checked={onlyLowStock}
              onChange={(e) => setOnlyLowStock(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-600"
            />
            <span className={onlyLowStock ? 'text-rose-600' : ''}>Apenas Estoque Baixo</span>
          </label>
        </div>
      </div>

      {/* Stock Inventory Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
          <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
            Posição Atual do Estoque
          </h4>
          <span className="text-[11px] text-stone-500">
            {filteredProducts.length} itens listados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Estoque Atual</th>
                <th className="py-3 px-3">Estoque Mínimo</th>
                <th className="py-3 px-3">Situação</th>
                <th className="py-3 px-4 text-right">Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const isCritical = p.stock <= p.minStock;
                return (
                  <tr key={p.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200"
                        />
                        <div>
                          <span className="font-bold text-stone-900 block line-clamp-1 max-w-xs">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-stone-500">{p.capacity}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-stone-700 font-semibold">
                      {p.sku}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-black text-sm text-stone-900">
                        {p.stock} unid.
                      </span>
                      {p.variations && p.variations.length > 0 && (
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          {p.variations.map((v) => `${v.name}: ${v.stock}`).join(' | ')}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-stone-500">
                      {p.minStock} unid.
                    </td>

                    <td className="py-3 px-3">
                      {p.stock <= 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          Esgotado
                        </span>
                      ) : isCritical ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3" /> Crítico
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Regular
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenAdjust(p)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-800 hover:text-white text-emerald-900 font-bold text-xs transition border border-emerald-200"
                      >
                        Ajustar Estoque
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movements Audit Log */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <h4 className="font-bold text-stone-900 text-sm mb-3">
          Histórico Recente de Movimentações (Auditoria)
        </h4>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 divide-y divide-stone-100 text-xs">
          {movements.slice(0, 15).map((mov) => (
            <div key={mov.id} className="pt-2 flex items-center justify-between text-stone-700">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    mov.quantity > 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {mov.quantity > 0 ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-stone-900 block">{mov.productName}</span>
                  <span className="text-[11px] text-stone-500">
                    {mov.reason} • {new Date(mov.date).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-mono font-bold ${
                    mov.quantity > 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                </span>
                <span className="text-[10px] text-stone-400 block">
                  {mov.previousStock} → {mov.newStock}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-stone-200">
            <h3 className="font-bold text-stone-900 text-sm mb-1">
              Ajustar Estoque de {selectedProduct.name}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Estoque atual: <strong>{selectedProduct.stock} unidades</strong>
            </p>

            <form onSubmit={handleExecuteAdjust} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Tipo de Movimentação</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('in')}
                    className={`py-2 rounded-xl font-bold transition ${
                      adjustmentType === 'in'
                        ? 'bg-emerald-800 text-white'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    + Entrada
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('out')}
                    className={`py-2 rounded-xl font-bold transition ${
                      adjustmentType === 'out'
                        ? 'bg-rose-700 text-white'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    - Saída
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('adjustment')}
                    className={`py-2 rounded-xl font-bold transition ${
                      adjustmentType === 'adjustment'
                        ? 'bg-stone-800 text-white'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    Correção
                  </button>
                </div>
              </div>

              {selectedProduct.variations && selectedProduct.variations.length > 0 && (
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Escolha a Variação</label>
                  <select
                    value={selectedVarId}
                    onChange={(e) => setSelectedVarId(e.target.value)}
                    className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  >
                    {selectedProduct.variations.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} (Atual: {v.stock})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-medium text-stone-700 mb-1">Quantidade</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(e.target.value)}
                  className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Motivo / Justificativa *</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Ex: Recebimento de pedido de compra do fornecedor"
                  className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  Confirmar Movimentação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
