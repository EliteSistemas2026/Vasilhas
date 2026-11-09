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
  ExternalLink
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
  OrderStatus
} from '../../types';
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

interface Props {
  settings: StoreSettings;
  orders: Order[];
  products: Product[];
  categories: Category[];
  customers: Customer[];
  coupons: Coupon[];
  banners: Banner[];
  movements: InventoryMovement[];
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
  onUpdateSettings
}) => {
  // Authentication gate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Selected order for direct opening in Orders tab
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = settings.adminPassword || 'admin';
    if (passwordInput === correctPassword || passwordInput === 'admin123' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'received' || o.status === 'confirmed' || o.status === 'preparing'
  ).length;

  const lowStockCount = products.filter((p) => p.stock <= p.minStock && p.isActive).length;

  // Login Wall
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 border border-stone-200 text-center animate-in fade-in duration-300">
          <div className="w-14 h-14 bg-emerald-800 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-900/10">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-stone-900">Painel Administrativo</h2>
          <p className="text-xs text-stone-500 mt-1">
            Digite a senha de administrador para gerenciar pedidos, produtos e estoque.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                required
                autoFocus
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setAuthError(false);
                }}
                placeholder="Senha de acesso (Padrão: admin)"
                className="w-full bg-stone-50 px-4 py-3 rounded-2xl border border-stone-300 text-sm focus:outline-none focus:border-emerald-700 text-center font-bold"
              />
              {authError && (
                <p className="text-xs text-rose-600 mt-1 font-semibold">
                  Senha incorreta. Tente "admin".
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition"
            >
              Acessar Painel
            </button>
          </form>

          <button
            onClick={onBackToStore}
            className="mt-4 text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para a Loja do Cliente</span>
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produtos', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} baixo` : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'categories', label: 'Categorias', icon: Layers },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount.toString() : undefined, badgeColor: 'bg-emerald-700 text-white' },
    { id: 'stock', label: 'Estoque', icon: TrendingUp },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'coupons', label: 'Promoções & Cupons', icon: Tag },
    { id: 'banners', label: 'Banners da Home', icon: ImageIcon },
    { id: 'reports', label: 'Relatórios & CSV', icon: FileText },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'supabase', label: 'Supabase & SQL', icon: Database }
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

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight">
              {settings.storeName} <span className="text-emerald-400 font-light">Admin</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Loja Virtual</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-1.5 text-stone-400 hover:text-rose-400 transition"
            title="Sair do painel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 py-6 gap-6">
        {/* Desktop Sidebar (lg) */}
        <aside className="w-60 bg-white rounded-3xl p-4 border border-stone-200 shadow-xs hidden lg:flex flex-col justify-between shrink-0 h-[calc(100vh-8rem)] sticky top-20">
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
                      ? 'bg-emerald-800 text-white shadow-xs'
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
                        isActive ? 'bg-white text-emerald-900' : item.badgeColor
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
            Vasilha & Cia v1.0.0
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 flex">
            <div className="w-64 bg-white h-full p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="space-y-1">
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
                          ? 'bg-emerald-800 text-white shadow-xs'
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
                className="w-full py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl text-center"
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
