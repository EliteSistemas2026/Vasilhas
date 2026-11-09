import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Package,
  Users
} from 'lucide-react';
import { Order, Product, Customer } from '../../types';
import { formatCurrency } from '../../services/cep';

interface Props {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  onNavigateTab: (tab: string) => void;
  onViewOrder: (order: Order) => void;
}

export const AdminDashboard: React.FC<Props> = ({
  orders,
  products,
  customers,
  onNavigateTab,
  onViewOrder
}) => {
  // Calculations
  const nonCancelledOrders = orders.filter((o) => o.status !== 'cancelled');
  const paidOrConfirmedOrders = orders.filter(
    (o) => o.status !== 'cancelled' && (o.paymentStatus === 'paid' || o.status === 'delivered')
  );

  const totalRevenue = paidOrConfirmedOrders.reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(
    (o) => o.status === 'received' || o.status === 'confirmed' || o.status === 'preparing'
  );

  const averageTicket =
    paidOrConfirmedOrders.length > 0
      ? totalRevenue / paidOrConfirmedOrders.length
      : 0;

  // Low stock products alert
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock && p.isActive);

  // Top selling products count from orders
  const productSalesMap: Record<string, { name: string; qty: number; revenue: number; image: string }> = {};
  nonCancelledOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          name: item.name,
          qty: 0,
          revenue: 0,
          image: item.image
        };
      }
      productSalesMap[item.productId].qty += item.quantity;
      productSalesMap[item.productId].revenue += item.totalPrice;
    });
  });

  const topSellingList = Object.values(productSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Faturamento Confirmado */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Faturamento Confirmado
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Exclui cancelamentos ({paidOrConfirmedOrders.length} pedidos faturados)
          </p>
        </div>

        {/* Ticket Médio */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Ticket Médio
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900">
            {formatCurrency(averageTicket)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Média por pedido aprovado
          </p>
        </div>

        {/* Pedidos Pendentes */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Pedidos Pendentes
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900">
            {pendingOrders.length}
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">
            Necessitam separação ou despacho
          </p>
        </div>

        {/* Alerta de Estoque Baixo */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Estoque Crítico
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900">
            {lowStockProducts.length}
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">
            Produtos abaixo do estoque mínimo
          </p>
        </div>
      </div>

      {/* Grid: Recent Orders & Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Últimos Pedidos</h3>
              <p className="text-xs text-stone-500">Fluxo em tempo real da loja</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <span>Ver Todos</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                onClick={() => onViewOrder(order)}
                className="py-3.5 flex items-center justify-between hover:bg-stone-50 px-2 rounded-xl cursor-pointer transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                      {order.code}
                    </span>
                    <span className="font-semibold text-xs text-stone-800">
                      {order.customer.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {order.items.length} itens • {new Date(order.createdAt).toLocaleDateString('pt-BR')} • {order.paymentMethod.toUpperCase()}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-xs text-stone-900 block">
                    {formatCurrency(order.total)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase inline-block mt-0.5 ${
                      order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Top Products & Low Stock Alerts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Selling Products */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 text-sm mb-3">
              Produtos Mais Vendidos
            </h3>
            <div className="space-y-3">
              {topSellingList.map((prod, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <img
                    src={prod.image}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 truncate">{prod.name}</p>
                    <span className="text-[11px] text-stone-500">
                      {prod.qty} unidades vendidas
                    </span>
                  </div>
                  <span className="font-bold text-emerald-800 shrink-0">
                    {formatCurrency(prod.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Warning Box */}
          {lowStockProducts.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Alerta de Reposição Imediata</span>
              </div>
              <div className="space-y-2 text-xs">
                {lowStockProducts.slice(0, 3).map((lp) => (
                  <div key={lp.id} className="flex justify-between items-center bg-white/80 p-2 rounded-lg">
                    <span className="font-medium text-stone-800 truncate max-w-[200px]">{lp.name}</span>
                    <span className="font-bold text-rose-700">{lp.stock} restantes</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigateTab('stock')}
                className="mt-3 text-xs font-semibold text-rose-800 hover:text-rose-950 underline"
              >
                Gerenciar movimentações de estoque →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
