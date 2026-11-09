import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  Package,
  Users
} from 'lucide-react';
import { Order, Product, Customer } from '../../types';
import { formatCurrency } from '../../services/cep';

interface Props {
  orders: Order[];
  products: Product[];
  customers: Customer[];
}

export const AdminReports: React.FC<Props> = ({ orders, products, customers }) => {
  const [reportType, setReportType] = useState<'sales' | 'products' | 'stock' | 'customers'>('sales');

  // CSV Generator Utility
  const downloadCSV = (filename: string, rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      rows.map((e) => e.map((x) => `"${x}"`).join(';')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSalesCSV = () => {
    const header = ['Codigo', 'Data', 'Cliente', 'WhatsApp', 'Metodo Entrega', 'Pagamento', 'Subtotal', 'Desconto', 'Frete', 'Total', 'Status'];
    const data = orders.map((o) => [
      o.code,
      new Date(o.createdAt).toLocaleDateString('pt-BR'),
      o.customer.name,
      o.customer.phone,
      o.deliveryMethod,
      o.paymentMethod,
      o.subtotal.toFixed(2),
      o.discount.toFixed(2),
      o.deliveryFee.toFixed(2),
      o.total.toFixed(2),
      o.status
    ]);
    downloadCSV('relatorio-vendas', [header, ...data]);
  };

  const exportProductsCSV = () => {
    const header = ['SKU', 'Nome', 'Capacidade', 'Material', 'Preco Venda', 'Preco Promocional', 'Estoque', 'Min Estoque', 'Status'];
    const data = products.map((p) => [
      p.sku,
      p.name,
      p.capacity,
      p.material,
      p.price.toFixed(2),
      p.promotionalPrice ? p.promotionalPrice.toFixed(2) : '',
      p.stock,
      p.minStock,
      p.isActive ? 'Ativo' : 'Inativo'
    ]);
    downloadCSV('relatorio-produtos-estoque', [header, ...data]);
  };

  const exportCustomersCSV = () => {
    const header = ['Nome', 'Telefone', 'Email', 'Total Pedidos', 'Valor Total Gasto', 'Ultima Compra'];
    const data = customers.map((c) => [
      c.name,
      c.phone,
      c.email || '',
      c.totalOrders,
      c.totalSpent.toFixed(2),
      new Date(c.lastOrderDate).toLocaleDateString('pt-BR')
    ]);
    downloadCSV('relatorio-clientes', [header, ...data]);
  };

  return (
    <div className="space-y-6">
      {/* Selector & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-stone-900 text-base">Relatórios Gerenciais</h3>
          <p className="text-xs text-stone-500">Visualize métricas e exporte em formato CSV ou para impressão</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (reportType === 'sales') exportSalesCSV();
              else if (reportType === 'products' || reportType === 'stock') exportProductsCSV();
              else exportCustomersCSV();
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* Report tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setReportType('sales')}
          className={`px-3 py-1.5 rounded-xl transition ${
            reportType === 'sales'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Relatório de Vendas
        </button>
        <button
          onClick={() => setReportType('products')}
          className={`px-3 py-1.5 rounded-xl transition ${
            reportType === 'products'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Desempenho de Produtos
        </button>
        <button
          onClick={() => setReportType('stock')}
          className={`px-3 py-1.5 rounded-xl transition ${
            reportType === 'stock'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Posição de Estoque
        </button>
        <button
          onClick={() => setReportType('customers')}
          className={`px-3 py-1.5 rounded-xl transition ${
            reportType === 'customers'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Base de Clientes
        </button>
      </div>

      {/* Report View Content (Printable) */}
      <div id="print-area" className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-stone-100">
          <div>
            <h4 className="font-extrabold text-stone-900 text-sm uppercase tracking-wider">
              {reportType === 'sales' && 'Relatório Completo de Vendas e Faturamento'}
              {reportType === 'products' && 'Relatório de Produtos e Preços'}
              {reportType === 'stock' && 'Relatório de Estoque e Reposição'}
              {reportType === 'customers' && 'Relatório de Clientes e Frequência de Compras'}
            </h4>
            <p className="text-[11px] text-stone-400">
              Gerado em {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {reportType === 'sales' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Pedido</th>
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">Pagamento</th>
                  <th className="py-2.5 px-3">Subtotal</th>
                  <th className="py-2.5 px-3">Desconto</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2.5 px-3 font-mono font-bold">{o.code}</td>
                    <td className="py-2.5 px-3 text-stone-500">{new Date(o.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="py-2.5 px-3 font-medium text-stone-800">{o.customer.name}</td>
                    <td className="py-2.5 px-3 uppercase text-[11px]">{o.paymentMethod}</td>
                    <td className="py-2.5 px-3">{formatCurrency(o.subtotal)}</td>
                    <td className="py-2.5 px-3 text-emerald-700">{formatCurrency(o.discount)}</td>
                    <td className="py-2.5 px-3 font-bold text-stone-900">{formatCurrency(o.total)}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'products' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Nome</th>
                  <th className="py-2.5 px-3">Capacidade</th>
                  <th className="py-2.5 px-3">Material</th>
                  <th className="py-2.5 px-3">Preço Regular</th>
                  <th className="py-2.5 px-3">Preço Promo</th>
                  <th className="py-2.5 px-3 text-right">Estoque</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 font-mono">{p.sku}</td>
                    <td className="py-2.5 px-3 font-medium">{p.name}</td>
                    <td className="py-2.5 px-3">{p.capacity}</td>
                    <td className="py-2.5 px-3">{p.material}</td>
                    <td className="py-2.5 px-3">{formatCurrency(p.price)}</td>
                    <td className="py-2.5 px-3 text-emerald-700">
                      {p.promotionalPrice ? formatCurrency(p.promotionalPrice) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold">{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'stock' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Produto</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Estoque Atual</th>
                  <th className="py-2.5 px-3">Estoque Mínimo</th>
                  <th className="py-2.5 px-3 text-right">Diagnóstico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 font-semibold">{p.name}</td>
                    <td className="py-2.5 px-3 font-mono">{p.sku}</td>
                    <td className="py-2.5 px-3 font-bold">{p.stock}</td>
                    <td className="py-2.5 px-3">{p.minStock}</td>
                    <td className="py-2.5 px-3 text-right">
                      {p.stock <= p.minStock ? (
                        <span className="text-rose-700 font-bold">Necessita Reposição</span>
                      ) : (
                        <span className="text-emerald-700">Normal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'customers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Nome</th>
                  <th className="py-2.5 px-3">WhatsApp</th>
                  <th className="py-2.5 px-3">E-mail</th>
                  <th className="py-2.5 px-3">Total Pedidos</th>
                  <th className="py-2.5 px-3 text-right">Total Comprado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 px-3 font-semibold">{c.name}</td>
                    <td className="py-2.5 px-3">{c.phone}</td>
                    <td className="py-2.5 px-3 text-stone-500">{c.email || '-'}</td>
                    <td className="py-2.5 px-3">{c.totalOrders}</td>
                    <td className="py-2.5 px-3 text-right font-black text-emerald-800">
                      {formatCurrency(c.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
