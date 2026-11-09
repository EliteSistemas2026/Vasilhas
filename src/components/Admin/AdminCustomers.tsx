import React, { useState } from 'react';
import { Users, Search, Phone, Mail, ShoppingBag } from 'lucide-react';
import { Customer } from '../../types';
import { formatCurrency } from '../../services/cep';

interface Props {
  customers: Customer[];
}

export const AdminCustomers: React.FC<Props> = ({ customers }) => {
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, WhatsApp ou e-mail..."
            className="w-full bg-white pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <span className="text-xs text-stone-500 font-medium">
          {filtered.length} clientes cadastrados
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-3">Contato</th>
                <th className="py-3 px-3">Total Pedidos</th>
                <th className="py-3 px-3">Valor Total Comprado</th>
                <th className="py-3 px-4 text-right">Última Compra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-stone-50/80 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-stone-900 block">{cust.name}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <a
                        href={`https://wa.me/${cust.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{cust.phone}</span>
                      </a>
                      {cust.email && (
                        <span className="text-[11px] text-stone-400">{cust.email}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-full">
                      {cust.totalOrders} {cust.totalOrders === 1 ? 'pedido' : 'pedidos'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-black text-emerald-800 text-sm">
                      {formatCurrency(cust.totalSpent)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-stone-500 text-[11px]">
                    {new Date(cust.lastOrderDate).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
