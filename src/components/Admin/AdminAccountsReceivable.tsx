import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  Filter,
  Check,
  X,
  Trash2,
  FileText
} from 'lucide-react';
import { AccountReceivable } from '../../types';
import { formatCurrency } from '../../services/cep';

interface Props {
  receivables: AccountReceivable[];
  onSaveReceivable: (item: Partial<AccountReceivable>) => Promise<AccountReceivable>;
  onMarkAsReceived: (id: string) => Promise<boolean>;
  onDeleteReceivable: (id: string) => Promise<boolean>;
}

export const AdminAccountsReceivable: React.FC<Props> = ({
  receivables,
  onSaveReceivable,
  onMarkAsReceived,
  onDeleteReceivable
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'received' | 'overdue'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<AccountReceivable>>({
    description: '',
    customerName: '',
    customerPhone: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Venda da Loja',
    paymentMethod: 'Pix Instantâneo',
    notes: ''
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const processedList = receivables.map((r) => {
    let status = r.status;
    if (status === 'pending' && r.dueDate < todayStr) {
      status = 'overdue';
    }
    return { ...r, calculatedStatus: status };
  });

  const filtered = processedList.filter((r) => {
    if (statusFilter !== 'all' && r.calculatedStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.description.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        (r.orderCode && r.orderCode.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // KPI calculations
  const totalPending = processedList
    .filter((r) => r.calculatedStatus === 'pending')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const totalReceived = processedList
    .filter((r) => r.calculatedStatus === 'received')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const totalOverdue = processedList
    .filter((r) => r.calculatedStatus === 'overdue')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    await onSaveReceivable(formData);
    setIsModalOpen(false);
    setFormData({
      description: '',
      customerName: '',
      customerPhone: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      category: 'Venda da Loja',
      paymentMethod: 'Pix Instantâneo',
      notes: ''
    });
    setFeedbackMsg('Conta a receber cadastrada no banco de dados!');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleReceive = async (id: string) => {
    await onMarkAsReceived(id);
    setFeedbackMsg('Recebimento confirmado e baixado com sucesso!');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este registro de conta a receber?')) {
      await onDeleteReceivable(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Contas a Receber
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Módulo Financeiro
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Controle de recebimentos de pedidos de clientes, vendas no balcão e encomendas corporativas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Recebimento</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              A Receber (Pendentes)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">
            {formatCurrency(totalPending)}
          </p>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {processedList.filter((r) => r.calculatedStatus === 'pending').length} títulos em aberto
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Já Recebido
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">
            {formatCurrency(totalReceived)}
          </p>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {processedList.filter((r) => r.calculatedStatus === 'received').length} pagamentos confirmados
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Em Atraso / Vencidos
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-700 mt-2">
            {formatCurrency(totalOverdue)}
          </p>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {processedList.filter((r) => r.calculatedStatus === 'overdue').length} títulos vencidos
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descrição, cliente ou pedido..."
            className="w-full bg-stone-50 border border-stone-200 pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pending', label: 'Pendentes' },
            { id: 'received', label: 'Recebidos' },
            { id: 'overdue', label: 'Em Atraso' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Receivables Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-700 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Descrição / Título</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Vencimento</th>
                <th className="py-3.5 px-4">Forma</th>
                <th className="py-3.5 px-4">Valor</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    Nenhum recebimento encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-stone-900 block">{item.description}</span>
                        {item.orderCode && (
                          <span className="text-[10px] text-emerald-800 font-semibold font-mono">
                            Pedido #{item.orderCode}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-stone-800 block">{item.customerName}</span>
                        {item.customerPhone && (
                          <span className="text-[11px] text-stone-400">{item.customerPhone}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-stone-800 block">
                          {new Date(item.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                        {item.receivedDate && (
                          <span className="text-[10px] text-emerald-700 block">
                            Baixado em {new Date(item.receivedDate).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {item.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-black text-stone-900 text-sm">
                        {formatCurrency(Number(item.amount))}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.calculatedStatus === 'received'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.calculatedStatus === 'overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.calculatedStatus === 'received'
                          ? 'Recebido'
                          : item.calculatedStatus === 'overdue'
                          ? 'Vencido'
                          : 'Pendente'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.calculatedStatus !== 'received' && (
                          <button
                            onClick={() => handleReceive(item.id)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                            title="Confirmar Recebimento"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Baixar</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Novo Recebimento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Novo Título a Receber</h3>
                <p className="text-xs text-stone-500">
                  Lançamento financeiro com gravação direta no banco PostgreSQL.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Descrição do Título *
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Venda de Vasilhas Herméticas para Escola"
                  className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cliente / Comprador *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Nome do cliente"
                    className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.customerPhone || ''}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Valor a Receber (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0,00"
                    className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Data de Vencimento *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                  >
                    <option value="Pix Instantâneo">Pix Instantâneo</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Boleto Bancário">Boleto Bancário</option>
                    <option value="Transferência">Transferência Bancária</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                  >
                    <option value="Venda da Loja">Venda da Loja</option>
                    <option value="Venda Balcão">Venda Balcão</option>
                    <option value="Venda Corporativa / B2B">Venda Corporativa / B2B</option>
                    <option value="Outros Recebimentos">Outros Recebimentos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Observações (opcional)
                </label>
                <input
                  type="text"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Parcela 1 de 2"
                  className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-md"
                >
                  Cadastrar Título
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
