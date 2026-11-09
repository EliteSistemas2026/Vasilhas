import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Check,
  X,
  Edit2,
  Trash2,
  Lock,
  Search,
  Key,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { AdminUser, UserRole, UserPrivileges } from '../../types';

interface Props {
  users: AdminUser[];
  onSaveUser: (user: Partial<AdminUser>) => Promise<AdminUser>;
  onDeleteUser: (id: string) => Promise<boolean>;
}

export const AdminUsers: React.FC<Props> = ({ users, onSaveUser, onDeleteUser }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<Partial<AdminUser> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.roleLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenNew = () => {
    setEditingUser({
      name: '',
      email: '',
      password: '',
      role: 'operator',
      roleLabel: 'Operador de Loja',
      privileges: {
        dashboard: true,
        productsAndStock: true,
        orders: true,
        financial: false,
        couponsAndBanners: false,
        usersAndSettings: false
      },
      isActive: true
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser({ ...user });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleRoleChange = (role: UserRole) => {
    if (!editingUser) return;
    let label = 'Operador';
    let privs: UserPrivileges = {
      dashboard: true,
      productsAndStock: true,
      orders: true,
      financial: false,
      couponsAndBanners: false,
      usersAndSettings: false
    };

    if (role === 'super_admin') {
      label = 'Administrador Geral';
      privs = {
        dashboard: true,
        productsAndStock: true,
        orders: true,
        financial: true,
        couponsAndBanners: true,
        usersAndSettings: true
      };
    } else if (role === 'manager') {
      label = 'Gerente da Loja';
      privs = {
        dashboard: true,
        productsAndStock: true,
        orders: true,
        financial: false,
        couponsAndBanners: true,
        usersAndSettings: false
      };
    } else if (role === 'financial') {
      label = 'Analista Financeiro';
      privs = {
        dashboard: true,
        productsAndStock: false,
        orders: true,
        financial: true,
        couponsAndBanners: false,
        usersAndSettings: false
      };
    }

    setEditingUser({
      ...editingUser,
      role,
      roleLabel: label,
      privileges: privs
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.name || !editingUser.email) return;

    await onSaveUser(editingUser);
    setIsModalOpen(false);
    setEditingUser(null);
    setFeedbackMsg('Usuário salvo no banco de dados com sucesso!');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleDelete = async (user: AdminUser) => {
    if (user.email === 'edilson9155@gmail.com') {
      alert('O Super Administrador principal (Edilson) não pode ser excluído.');
      return;
    }
    if (confirm(`Deseja realmente excluir o acesso de "${user.name}"?`)) {
      await onDeleteUser(user.id);
      setFeedbackMsg('Usuário removido.');
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Usuários & Privilégios
            </h1>
            <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
              {users.length} usuários cadastrados
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Gerencie os operadores, gerentes e permissões de acesso ao sistema com banco de dados PostgreSQL.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Novo Usuário</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou cargo..."
            className="w-full bg-stone-50 border border-stone-200 pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-rose-600"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'super_admin', label: 'Super Admin' },
            { id: 'manager', label: 'Gerentes' },
            { id: 'operator', label: 'Operadores' },
            { id: 'financial', label: 'Financeiro' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                roleFilter === tab.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-700 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Usuário</th>
                <th className="py-3.5 px-4">Cargo / Função</th>
                <th className="py-3.5 px-4">Privilégios Habilitados</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400">
                    Nenhum usuário encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isEdilson = user.email === 'edilson9155@gmail.com';
                  return (
                    <tr key={user.id} className="hover:bg-stone-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0 ${
                              user.role === 'super_admin'
                                ? 'bg-gradient-to-tr from-rose-700 to-rose-500 text-white'
                                : user.role === 'manager'
                                ? 'bg-purple-100 text-purple-800'
                                : user.role === 'financial'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-stone-900">
                              <span>{user.name}</span>
                              {isEdilson && (
                                <span className="bg-rose-100 text-rose-800 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                                  Proprietário
                                </span>
                              )}
                            </div>
                            <span className="text-stone-400 font-mono text-[11px]">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-md text-[11px] ${
                            user.role === 'super_admin'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : user.role === 'manager'
                              ? 'bg-purple-50 text-purple-800 border border-purple-200'
                              : user.role === 'financial'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-800 border border-stone-200'
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{user.roleLabel}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {user.privileges?.dashboard && (
                            <span className="bg-stone-100 text-stone-700 text-[10px] px-1.5 py-0.5 rounded">
                              Dashboard
                            </span>
                          )}
                          {user.privileges?.productsAndStock && (
                            <span className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium">
                              Produtos & Estoque
                            </span>
                          )}
                          {user.privileges?.orders && (
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-medium">
                              Pedidos
                            </span>
                          )}
                          {user.privileges?.financial && (
                            <span className="bg-amber-50 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                              Financeiro (Pagar/Receber)
                            </span>
                          )}
                          {user.privileges?.usersAndSettings && (
                            <span className="bg-rose-50 text-rose-700 text-[10px] px-1.5 py-0.5 rounded font-medium">
                              Usuários & Configs
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.isActive ? 'bg-emerald-600' : 'bg-stone-400'
                            }`}
                          />
                          {user.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
                            title="Editar usuário"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!isEdilson && (
                            <button
                              onClick={() => handleDelete(user)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Excluir usuário"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add / Edit User */}
      {isModalOpen && editingUser && (
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
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  {editingUser.id ? 'Editar Usuário' : 'Novo Usuário do Sistema'}
                </h3>
                <p className="text-xs text-stone-500">
                  Defina os dados de login e privilégios de acesso.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  placeholder="Ex: João da Silva"
                  className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-rose-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    E-mail de Acesso *
                  </label>
                  <input
                    type="email"
                    required
                    disabled={editingUser.email === 'edilson9155@gmail.com'}
                    value={editingUser.email || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    className="w-full bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-rose-700 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {editingUser.id ? 'Nova Senha (opcional)' : 'Senha de Acesso *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required={!editingUser.id}
                      value={editingUser.password || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, password: e.target.value })
                      }
                      placeholder={editingUser.id ? 'Manter senha atual' : 'Defina a senha'}
                      className="w-full bg-stone-50 border border-stone-300 px-3 py-2 pr-9 rounded-xl text-xs focus:outline-none focus:border-rose-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Perfil de Acesso
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'operator', label: 'Operador' },
                    { id: 'manager', label: 'Gerente' },
                    { id: 'financial', label: 'Financeiro' },
                    { id: 'super_admin', label: 'Super Admin' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleChange(r.id as UserRole)}
                      className={`p-2 rounded-xl border text-xs font-semibold text-center transition ${
                        editingUser.role === r.id
                          ? 'border-rose-700 bg-rose-50 text-rose-900 ring-1 ring-rose-700'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privileges Checkboxes */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <span className="text-xs font-bold text-stone-900 block mb-2">
                  Privilégios e Módulos Liberados:
                </span>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingUser.privileges?.dashboard}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          privileges: {
                            ...editingUser.privileges!,
                            dashboard: e.target.checked
                          }
                        })
                      }
                      className="rounded text-rose-700 focus:ring-rose-700"
                    />
                    <span>Visualizar Dashboard e Estatísticas de Vendas</span>
                  </label>

                  <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingUser.privileges?.productsAndStock}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          privileges: {
                            ...editingUser.privileges!,
                            productsAndStock: e.target.checked
                          }
                        })
                      }
                      className="rounded text-rose-700 focus:ring-rose-700"
                    />
                    <span>Cadastrar e Editar Produtos / Controle de Estoque</span>
                  </label>

                  <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingUser.privileges?.orders}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          privileges: {
                            ...editingUser.privileges!,
                            orders: e.target.checked
                          }
                        })
                      }
                      className="rounded text-rose-700 focus:ring-rose-700"
                    />
                    <span>Gerenciar Pedidos e Alterar Status de Separação/Entrega</span>
                  </label>

                  <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingUser.privileges?.financial}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          privileges: {
                            ...editingUser.privileges!,
                            financial: e.target.checked
                          }
                        })
                      }
                      className="rounded text-rose-700 focus:ring-rose-700"
                    />
                    <span className="font-semibold text-stone-900">
                      Módulo Financeiro (Contas a Pagar e Contas a Receber)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingUser.privileges?.couponsAndBanners}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          privileges: {
                            ...editingUser.privileges!,
                            couponsAndBanners: e.target.checked
                          }
                        })
                      }
                      className="rounded text-rose-700 focus:ring-rose-700"
                    />
                    <span>Criar Cupons de Desconto e Banners da Loja</span>
                  </label>

                  <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingUser.privileges?.usersAndSettings}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          privileges: {
                            ...editingUser.privileges!,
                            usersAndSettings: e.target.checked
                          }
                        })
                      }
                      className="rounded text-rose-700 focus:ring-rose-700"
                    />
                    <span className="font-semibold text-rose-900">
                      Gerenciar Usuários e Configurações Gerais da Loja
                    </span>
                  </label>
                </div>
              </div>

              {/* Status active */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-stone-700">Status do Acesso</span>
                <button
                  type="button"
                  onClick={() =>
                    setEditingUser({ ...editingUser, isActive: !editingUser.isActive })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    editingUser.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {editingUser.isActive ? 'Acesso Ativo' : 'Acesso Bloqueado'}
                </button>
              </div>

              <div className="flex gap-3 pt-4 border-t border-stone-200">
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
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
