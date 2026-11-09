import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  Check,
  X,
  Trash2,
  Receipt,
  Building2
} from 'lucide-react';
import { AccountPayable } from '../../types';
import { formatCurrency } from '../../services/cep';

interface Props {
  payables: AccountPayable[];
  onSavePayable: (item: Partial<AccountPayable>) => Promise<AccountPayable>;
  onMarkAsPaid: (id: string) => Promise<boolean>;
  onDeletePayable: (id: string) => Promise<boolean>;
}

export const AdminAccountsPayable: React.FC<Props> = ({
  payables,
  onSavePayable,
  onMarkAsPaid,
  onDeletePayable
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<AccountPayable>>({
    description: '',
    supplier: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Fornecedores de Vasilhas',
    paymentMethod: 'Boleto',
    barcodeOrPix: '',
    notes: ''
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const processedList = payables.map((p) => {
    let status = p.status;
    if (status === 'pending' && p.dueDate < todayStr) {
      status = 'overdue';
    }
    return { ...p, calculatedStatus: status };
  });

  const filtered = processedList.filter((p) => {
    if (statusFilter !== 'all' && p.calculatedStatus !== statusFilter) return false;
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.description.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPending = processedList
    .filter((p) => p.calculatedStatus === 'pending')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalPaid = processedList
    .filter((p) => p.calculatedStatus === 'paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalOverdue = processedList
    .filter((p) => p.calculatedStatus === 'overdue')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.supplier || !formData.amount) return;

    await onSavePayable(formData);
    setIsModalOpen(false);
    setFormData({
      description: '',
      supplier: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      category: 'Fornecedores de Vasilhas',
      paymentMethod: 'Boleto',
      barcodeOrPix: '',
      notes: ''
    });
    setFeedbackMsg('Conta a pagar cadastrada no banco de dados!');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handlePay = async (id: string) => {
    await onMarkAsPaid(id);
    setFeedbackMsg('Pagamento registrado e baixado com sucesso!');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este registro de conta a pagar?')) {
      await onDeletePayable(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Contas a Pagar
            </h1>
            <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
              Módulo Financeiro
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Gestão de fornecedores de potes e vasilhas, embalagens, fretes, aluguel e custos operacionais.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Conta a Pagar</span>
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
              A Pagar (Pendentes)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">
            {formatCurrency(totalPending)}
          </p>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {processedList.filter((p) => p.calculatedStatus === 'pending').length} contas em aberto
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Pago (Mês)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">
            {formatCurrency(totalPaid)}
          </p>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {processedList.filter((p) => p.calculatedStatus === 'paid').length} despesas quitadas
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Vencidas em Atraso
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-700 mt-2">
            {formatCurrency(totalOverdue)}
          </p>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {processedList.filter((p) => p.calculatedStatus === 'overdue').length} contas vencidas
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
            placeholder="Buscar por descrição ou fornecedor..."
            className="w-full bg-stone-50 border border-stone-200 pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-rose-700"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'pending', label: 'A Pagar' },
            { id: 'paid', label: 'Pagas' },
            { id: 'overdue', label: 'Vencidas' }
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

      {/* Payables Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-700 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Descrição da Despesa</th>
                <th className="py-3.5 px-4">Fornecedor / Favorecido</th>
                <th className="py-3.5 px-4">Vencimento</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Valor</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    Nenhuma conta a pagar encontrada.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-stone-900 block">{item.description}</span>
                        {item.barcodeOrPix && (
                          <span className="text-[10px] text-stone-400 font-mono truncate max-w-xs block">
                            Ref: {item.barcodeOrPix}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                        <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{item.supplier}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-stone-800 block">
                          {new Date(item.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                        {item.paidDate && (
                          <span className="text-[10px] text-emerald-700 block">
                            Pago em {new Date(item.paidDate).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-black text-rose-700 text-sm">
                        {formatCurrency(Number(item.amount))}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.calculatedStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.calculatedStatus === 'overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.calculatedStatus === 'paid'
                          ? 'Pago'
                          : item.calculatedStatus === 'overdue'
                          ? 'Vencida'
                          : 'A Pagar'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.calculatedStatus !== 'paid' && (
                          <button
                            onClick={() => handlePay(item.id)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                            title="Registrar Pagamento"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Pagar</span>
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

      {/* Modal: Nova Conta a Pagar */}
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
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Nova Despesa a Pagar</h3>
                <p className="text-xs text-stone-500">
                  Lançamento de conta a pagar persistido diretamente no PostgreSQL Cloud SQL.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Descrição da Despesa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Compra de 200 Tigelas Linha Criativa"
                  className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-rose-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Fornecedor / Favorecido *
                </label>
                <input
                  type="text"
                  required
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Ex: TupperTech Indústria Plástica Ltda"
                  className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-rose-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Valor a Pagar (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0,00"
                    className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-rose-700 font-bold"
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
                    className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-rose-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Categoria da Despesa
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-rose-700"
                  >
                    <option value="Fornecedores de Vasilhas">Fornecedores de Vasilhas</option>
                    <option value="Embalagens & Expedição">Embalagens & Expedição</option>
                    <option value="Logística & Frete Fornecedor">Logística & Frete Fornecedor</option>
                    <option value="Instalações & Aluguel">Instalações & Aluguel</option>
                    <option value="Energia & Telecomunicações">Energia & Telecomunicações</option>
                    <option value="Marketing & Publicidade">Marketing & Publicidade</option>
                    <option value="Outras Despesas">Outras Despesas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-rose-700"
                  >
                    <option value="Boleto">Boleto Bancário</option>
                    <option value="Pix">Chave Pix</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Transferência">Transferência Bancária</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Linha Digitável / Chave Pix (opcional)
                </label>
                <input
                  type="text"
                  value={formData.barcodeOrPix || ''}
                  onChange={(e) => setFormData({ ...formData, barcodeOrPix: e.target.value })}
                  placeholder="Código de barras do boleto ou chave Pix para pagamento"
                  className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-rose-700 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Observações (opcional)
                </label>
                <input
                  type="text"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Parcela 2/3 - NF 8412"
                  className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-rose-700"
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
                  className="flex-1 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition shadow-md"
                >
                  Cadastrar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
