import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  XCircle,
  ExternalLink,
  Phone,
  DollarSign
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatCurrency } from '../../services/cep';

interface Props {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  selectedOrder?: Order | null;
  onSelectOrder?: (order: Order | null) => void;
}

export const AdminOrders: React.FC<Props> = ({
  orders,
  onUpdateStatus,
  selectedOrder,
  onSelectOrder
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(selectedOrder || null);
  const [statusNote, setStatusNote] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    onUpdateStatus(orderId, newStatus, statusNote.trim() || undefined);
    setStatusNote('');
    // refresh modal order
    const updated = orders.find((o) => o.id === orderId);
    if (updated) {
      setActiveModalOrder({ ...updated, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código (VP-...), cliente ou WhatsApp..."
              className="w-full bg-white pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700 font-medium"
          >
            <option value="all">Todos os Status</option>
            <option value="received">Recebido</option>
            <option value="confirmed">Confirmado</option>
            <option value="preparing">Em Separação</option>
            <option value="ready_for_pickup">Pronto p/ Retirada</option>
            <option value="out_for_delivery">Saiu p/ Entrega</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <span className="text-xs text-stone-500 font-medium self-end sm:self-center">
          Total: {filteredOrders.length} pedidos
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Pedido / Data</th>
                <th className="py-3 px-3">Cliente</th>
                <th className="py-3 px-3">Entrega</th>
                <th className="py-3 px-3">Pagamento</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/80 transition">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-stone-900 block text-xs">
                      {order.code}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')} {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-semibold text-stone-800 block">{order.customer.name}</span>
                    <span className="text-[11px] text-stone-500">{order.customer.phone}</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-stone-700 font-medium block">
                      {order.deliveryMethod === 'pickup' ? '🏪 Retirada' : '🚚 Entrega Local'}
                    </span>
                    {order.address && (
                      <span className="text-[11px] text-stone-400 block truncate max-w-[150px]">
                        {order.address.neighborhood}, {order.address.city}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-semibold text-stone-700 block uppercase text-[11px]">
                      {order.paymentMethod}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {order.paymentStatus === 'paid' ? '● Pago' : '○ Pendente'}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-extrabold text-stone-900 block">
                      {formatCurrency(order.total)}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase inline-block ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : order.status === 'preparing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveModalOrder(order)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-800 hover:text-white font-semibold text-xs text-stone-700 transition"
                    >
                      Gerenciar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Status Manager Modal */}
      {activeModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 border border-stone-200 max-h-[90vh] overflow-y-auto space-y-5 text-xs">
            <div className="flex justify-between items-start pb-3 border-b border-stone-200">
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {activeModalOrder.code}
                </span>
                <h3 className="font-black text-stone-900 text-base mt-1">
                  Pedido de {activeModalOrder.customer.name}
                </h3>
                <p className="text-stone-400 text-[11px]">
                  Criado em {new Date(activeModalOrder.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-100 flex items-center gap-1 font-semibold text-stone-700 text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir</span>
                </button>
                <button
                  onClick={() => setActiveModalOrder(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Change Status Control Box */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
              <label className="block font-bold text-stone-800 uppercase text-[11px]">
                Alterar Situação do Pedido
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'] as OrderStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(activeModalOrder.id, st)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-semibold capitalize transition ${
                        activeModalOrder.status === st
                          ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-800/30'
                          : st === 'cancelled'
                          ? 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'
                          : 'bg-white border border-stone-200 text-stone-700 hover:border-emerald-600'
                      }`}
                    >
                      {st === 'ready_for_pickup'
                        ? 'P/ Retirada'
                        : st === 'out_for_delivery'
                        ? 'Saiu Entrega'
                        : st}
                    </button>
                  )
                )}
              </div>

              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Observação da alteração (opcional, ex: embalado por Maria)"
                className="w-full bg-white px-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
              />
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <h4 className="font-bold text-stone-800 uppercase text-[11px]">Itens do Pedido</h4>
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-2">
                {activeModalOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-stone-800">
                    <div className="flex items-center gap-2">
                      <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-white" />
                      <div>
                        <span className="font-semibold block">{item.name}</span>
                        <span className="text-[10px] text-stone-500">
                          {item.quantity}x {formatCurrency(item.unitPrice)} {item.variationName && `• ${item.variationName}`}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold">{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}

                <div className="pt-2 border-t border-stone-200 space-y-1 text-stone-600 text-[11px]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(activeModalOrder.subtotal)}</span>
                  </div>
                  {activeModalOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Desconto ({activeModalOrder.couponCode || 'Pix'}):</span>
                      <span>- {formatCurrency(activeModalOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span>{formatCurrency(activeModalOrder.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-black text-stone-900 pt-1 border-t border-stone-200">
                    <span>Total:</span>
                    <span className="text-emerald-800 text-sm">{formatCurrency(activeModalOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-600">
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-800 block text-[11px] uppercase">
                  Dados do Cliente
                </span>
                <p className="font-semibold text-stone-900">{activeModalOrder.customer.name}</p>
                <p>WhatsApp: {activeModalOrder.customer.phone}</p>
                {activeModalOrder.customer.email && <p>E-mail: {activeModalOrder.customer.email}</p>}
                <a
                  href={`https://wa.me/${activeModalOrder.customer.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-700 hover:underline pt-1 font-semibold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Conversar no WhatsApp</span>
                </a>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-800 block text-[11px] uppercase">
                  Entrega & Pagamento
                </span>
                <p className="font-semibold text-stone-900">
                  {activeModalOrder.deliveryMethod === 'pickup' ? 'Retirada na Loja' : 'Entrega em Endereço'}
                </p>
                {activeModalOrder.address && (
                  <p className="text-[11px] text-stone-500">
                    {activeModalOrder.address.street}, {activeModalOrder.address.number}
                    {activeModalOrder.address.complement && ` (${activeModalOrder.address.complement})`} - {activeModalOrder.address.neighborhood}, {activeModalOrder.address.city}/{activeModalOrder.address.state}
                  </p>
                )}
                <p className="pt-1">
                  Pagamento: <strong>{activeModalOrder.paymentMethod.toUpperCase()}</strong> ({activeModalOrder.paymentStatus})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
