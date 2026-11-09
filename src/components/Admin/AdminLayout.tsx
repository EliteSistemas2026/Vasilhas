import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  TrendingUp,
  Users,
  Tag,
  Image as ImageIcon,
  FileText,
  Settings,
  Database,
  LogOut,
  ArrowLeft,
  Lock,
  Menu,
  X,
  CreditCard,
  UserCheck,
  ShieldCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import {
  StoreSettings,
  Order,
  Product,
  Category,
  Customer,
  Coupon,
  Banner,
  InventoryMovement,
  OrderStatus,
  AdminUser,
  AccountReceivable,
  AccountPayable
} from '../../types';
import { db } from '../../services/db';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminStock } from './AdminStock';
import { AdminCustomers } from './AdminCustomers';
import { AdminCoupons } from './AdminCoupons';
import { AdminBanners } from './AdminBanners';
import { AdminReports } from './AdminReports';
import { AdminSettings } from './AdminSettings';
import { AdminSupabase } from './AdminSupabase';
import { AdminUsers } from './AdminUsers';
import { AdminAccountsReceivable } from './AdminAccountsReceivable';
import { AdminAccountsPayable } from './AdminAccountsPayable';

interface Props {
  settings: StoreSettings;
  orders: Order[];
  products: Product[];
  categories: Category[];
  customers: Customer[];
  coupons: Coupon[];
  banners: Banner[];
  movements: InventoryMovement[];
  users: AdminUser[];
  receivables: AccountReceivable[];
  payables: AccountPayable[];
  onBackToStore: () => void;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onSaveCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  onAdjustStock: (
    productId: string,
    quantityDelta: number,
    type: 'in' | 'out' | 'adjustment',
    reason: string,
    variationId?: string
  ) => void;
  onSaveCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (id: string) => void;
  onSaveBanner: (banner: Banner) => void;
  onDeleteBanner: (id: string) => void;
  onUpdateSettings: (partial: Partial<StoreSettings>) => void;
  onSaveUser: (user: Partial<AdminUser>) => Promise<AdminUser>;
  onDeleteUser: (id: string) => Promise<boolean>;
  onSaveReceivable: (item: Partial<AccountReceivable>) => Promise<AccountReceivable>;
  onMarkAsReceived: (id: string) => Promise<boolean>;
  onDeleteReceivable: (id: string) => Promise<boolean>;
  onSavePayable: (item: Partial<AccountPayable>) => Promise<AccountPayable>;
  onMarkAsPaid: (id: string) => Promise<boolean>;
  onDeletePayable: (id: string) => Promise<boolean>;
}

export const AdminLayout: React.FC<Props> = ({
  settings,
  orders,
  products,
  categories,
  customers,
  coupons,
  banners,
  movements,
  users,
  receivables,
  payables,
  onBackToStore,
  onSaveProduct,
  onDeleteProduct,
  onSaveCategory,
  onDeleteCategory,
  onUpdateOrderStatus,
  onAdjustStock,
  onSaveCoupon,
  onDeleteCoupon,
  onSaveBanner,
  onDeleteBanner,
  onUpdateSettings,
  onSaveUser,
  onDeleteUser,
  onSaveReceivable,
  onMarkAsReceived,
  onDeleteReceivable,
  onSavePayable,
  onMarkAsPaid,
  onDeletePayable
}) => {
  // Authentication gate state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('edilson9155@gmail.com');
  const [passwordInput, setPasswordInput] = useState('91550748');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Selected order for direct opening in Orders tab
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);

    try {
      const result = await db.authenticateUser(emailInput, passwordInput);
      setIsLoggingIn(false);

      if (result.success && result.user) {
        setIsAuthenticated(true);
        setCurrentUser(result.user);
      } else {
        setAuthError(result.error || 'Credenciais inválidas. Verifique e-mail e senha.');
      }
    } catch (err) {
      setIsLoggingIn(false);
      setAuthError('Falha ao autenticar. Tente novamente.');
    }
  };

  const handleQuickFillAdmin = () => {
    setEmailInput('edilson9155@gmail.com');
    setPasswordInput('91550748');
    setAuthError(null);
  };

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'received' || o.status === 'confirmed' || o.status === 'preparing'
  ).length;

  const lowStockCount = products.filter((p) => p.stock <= p.minStock && p.isActive).length;

  const pendingReceivablesCount = receivables.filter((r) => r.status === 'pending').length;
  const pendingPayablesCount = payables.filter((p) => p.status === 'pending').length;

  // Modern High-End Login Wall (Tupperware Style)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-teal-600/20 blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-stone-200 text-center animate-in fade-in zoom-in-95 duration-300">
          {/* Logo & Brand Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-700 via-rose-600 to-rose-500 text-white p-2.5 shadow-xl shadow-rose-900/20 flex items-center justify-center mb-3 border border-white/20">
              <img src="/icon.svg" alt="Tupperware Logo" className="w-full h-full object-contain filter drop-shadow-sm" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-[11px] font-extrabold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              <span>Acesso Administrativo Seguro</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {settings.storeName || 'TupperVasilhas & Cia'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Gestão de Vendas, Usuários e Módulo Financeiro
            </p>
          </div>

          {/* Quick Credential Pre-fill Badge */}
          <div
            onClick={handleQuickFillAdmin}
            className="mb-5 p-2.5 bg-rose-50/80 hover:bg-rose-100 border border-rose-200 rounded-2xl text-left cursor-pointer transition flex items-center justify-between group"
            title="Clique para preencher os dados de administrador"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                E
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-900 block">
                  Admin Principal (Edilson)
                </span>
                <span className="text-[11px] font-mono text-rose-700 font-semibold block">
                  edilson9155@gmail.com
                </span>
              </div>
            </div>
            <span className="text-[10px] text-rose-800 font-bold bg-white px-2 py-0.5 rounded-lg border border-rose-200 shadow-2xs group-hover:bg-rose-700 group-hover:text-white transition">
              Preencher
            </span>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2 text-left animate-in shake">
              <X className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                E-mail de Acesso
              </label>
              <input
                type="email"
                required
                autoFocus
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setAuthError(null);
                }}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-stone-50 px-4 py-3 rounded-2xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-rose-700 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Ocultar' : 'Mostrar'}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="Sua senha de acesso"
                  className="w-full bg-stone-50 px-4 py-3 rounded-2xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-rose-700 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-2xl bg-rose-700 hover:bg-rose-800 active:scale-95 text-white font-bold text-sm shadow-xl shadow-rose-950/20 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoggingIn ? 'Verificando no Banco...' : 'Entrar no Painel'}</span>
            </button>
          </form>

          {/* Database & Return Footer */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col gap-2">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Banco de Dados: PostgreSQL Cloud SQL Conectado</span>
            </div>

            <button
              onClick={onBackToStore}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1 mx-auto mt-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para a Loja do Cliente</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Navigation Menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'products',
      label: 'Produtos',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} baixo` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { id: 'categories', label: 'Categorias', icon: Layers },
    {
      id: 'orders',
      label: 'Pedidos',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount.toString() : undefined,
      badgeColor: 'bg-emerald-700 text-white'
    },
    { id: 'stock', label: 'Estoque', icon: TrendingUp },
    {
      id: 'receivables',
      label: 'Contas a Receber',
      icon: ArrowDownLeft,
      badge: pendingReceivablesCount > 0 ? pendingReceivablesCount.toString() : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'payables',
      label: 'Contas a Pagar',
      icon: ArrowUpRight,
      badge: pendingPayablesCount > 0 ? pendingPayablesCount.toString() : undefined,
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'users', label: 'Usuários & Privilégios', icon: UserCheck },
    { id: 'coupons', label: 'Promoções & Cupons', icon: Tag },
    { id: 'banners', label: 'Banners da Home', icon: ImageIcon },
    { id: 'reports', label: 'Relatórios & CSV', icon: FileText },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'supabase', label: 'Cloud SQL & Dados', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-stone-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-stone-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center p-1">
              <img src="/icon.svg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-1.5">
              <span>{settings.storeName || 'TupperVasilhas & Cia'}</span>
              <span className="text-rose-400 font-light text-xs bg-rose-950 px-2 py-0.5 rounded-full border border-rose-800">
                Admin
              </span>
            </h1>
          </div>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-stone-800">
              <div className="w-7 h-7 rounded-full bg-rose-700 text-white flex items-center justify-center text-xs font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-stone-100 block leading-tight">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-stone-400 block leading-tight">
                  {currentUser.roleLabel}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Loja Virtual</span>
          </button>

          <button
            onClick={() => {
              setIsAuthenticated(false);
              setCurrentUser(null);
            }}
            className="p-1.5 text-stone-400 hover:text-rose-400 transition"
            title="Sair do painel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 py-6 gap-6">
        {/* Desktop Sidebar (lg) */}
        <aside className="w-64 bg-white rounded-3xl p-4 border border-stone-200 shadow-xs hidden lg:flex flex-col justify-between shrink-0 h-[calc(100vh-8rem)] sticky top-20">
          <div className="space-y-1 overflow-y-auto pr-1">
            <span className="text-[10px] font-bold uppercase text-stone-400 px-3 tracking-wider block mb-2">
              Menu Principal
            </span>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-rose-700 text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white text-rose-900' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-400 text-center">
            {settings.storeName} • Cloud SQL PostgreSQL
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 flex">
            <div className="w-64 bg-white h-full p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="space-y-1 overflow-y-auto">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
                  <span className="font-bold text-stone-900 text-sm">Navegação Admin</span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-5 h-5 text-stone-500" />
                  </button>
                </div>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-rose-700 text-white shadow-xs font-bold'
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={onBackToStore}
                className="w-full py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl text-center mt-4"
              >
                Voltar à Loja
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              orders={orders}
              products={products}
              customers={customers}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onViewOrder={(order) => {
                setSelectedOrderForDetail(order);
                setActiveTab('orders');
              }}
            />
          )}

          {activeTab === 'products' && (
            <AdminProducts
              products={products}
              categories={categories}
              onSaveProduct={onSaveProduct}
              onDeleteProduct={onDeleteProduct}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategories
              categories={categories}
              onSaveCategory={onSaveCategory}
              onDeleteCategory={onDeleteCategory}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrders
              orders={orders}
              onUpdateStatus={onUpdateOrderStatus}
              selectedOrder={selectedOrderForDetail}
              onSelectOrder={setSelectedOrderForDetail}
            />
          )}

          {activeTab === 'stock' && (
            <AdminStock
              products={products}
              movements={movements}
              onAdjustStock={onAdjustStock}
            />
          )}

          {activeTab === 'receivables' && (
            <AdminAccountsReceivable
              receivables={receivables}
              onSaveReceivable={onSaveReceivable}
              onMarkAsReceived={onMarkAsReceived}
              onDeleteReceivable={onDeleteReceivable}
            />
          )}

          {activeTab === 'payables' && (
            <AdminAccountsPayable
              payables={payables}
              onSavePayable={onSavePayable}
              onMarkAsPaid={onMarkAsPaid}
              onDeletePayable={onDeletePayable}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsers
              users={users}
              onSaveUser={onSaveUser}
              onDeleteUser={onDeleteUser}
            />
          )}

          {activeTab === 'customers' && (
            <AdminCustomers customers={customers} />
          )}

          {activeTab === 'coupons' && (
            <AdminCoupons
              coupons={coupons}
              onSaveCoupon={onSaveCoupon}
              onDeleteCoupon={onDeleteCoupon}
            />
          )}

          {activeTab === 'banners' && (
            <AdminBanners
              banners={banners}
              onSaveBanner={onSaveBanner}
              onDeleteBanner={onDeleteBanner}
            />
          )}

          {activeTab === 'reports' && (
            <AdminReports
              orders={orders}
              products={products}
              customers={customers}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettings
              settings={settings}
              onUpdateSettings={onUpdateSettings}
            />
          )}

          {activeTab === 'supabase' && (
            <AdminSupabase
              settings={settings}
              onUpdateSettings={onUpdateSettings}
            />
          )}
        </main>
      </div>
    </div>
  );
};
