import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle,
  X,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Filter
} from 'lucide-react';
import { db } from './services/db';
import {
  Product,
  Category,
  Banner,
  CartItem,
  Order,
  StoreSettings,
  ProductVariation,
  OrderStatus,
  AdminUser,
  AccountReceivable,
  AccountPayable
} from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Footer } from './components/Footer';
import { AdminLayout } from './components/Admin/AdminLayout';
import { formatCurrency } from './services/cep';

export default function App() {
  // Service Worker Registration for PWA & Cloud SQL Initial Sync
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('SW registration failed:', err);
        });
      });
    }
    // Pull fresh data from Cloud SQL database
    db.syncWithDatabase().catch((err) => {
      console.warn('Initial Cloud SQL sync notice:', err);
    });
  }, []);

  // Main Reactive Store State
  const [settings, setSettings] = useState<StoreSettings>(db.getSettings());
  const [products, setProducts] = useState<Product[]>(db.getProducts());
  const [categories, setCategories] = useState<Category[]>(db.getCategories());
  const [banners, setBanners] = useState<Banner[]>(db.getBanners());
  const [orders, setOrders] = useState<Order[]>(db.getOrders());
  const [coupons, setCoupons] = useState(db.getCoupons());
  const [customers, setCustomers] = useState(db.getCustomers());
  const [movements, setMovements] = useState(db.getMovements());
  const [cart, setCart] = useState<CartItem[]>(db.getCart());
  const [users, setUsers] = useState<AdminUser[]>(db.getUsers());
  const [receivables, setReceivables] = useState<AccountReceivable[]>(db.getReceivables());
  const [payables, setPayables] = useState<AccountPayable[]>(db.getPayables());

  // Subscribe to reactive database changes
  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setSettings(db.getSettings());
      setProducts(db.getProducts());
      setCategories(db.getCategories());
      setBanners(db.getBanners());
      setOrders(db.getOrders());
      setCoupons(db.getCoupons());
      setCustomers(db.getCustomers());
      setMovements(db.getMovements());
      setCart(db.getCart());
      setUsers(db.getUsers());
      setReceivables(db.getReceivables());
      setPayables(db.getPayables());
    });
    return unsubscribe;
  }, []);

  // Navigation & View Mode
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'featured' | 'bestsellers' | 'promotions' | 'new'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'name_asc'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState(false);

  // Modals & Drawers
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutCouponCode, setCheckoutCouponCode] = useState<string | undefined>(undefined);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [activePolicyModal, setActivePolicyModal] = useState<'return' | 'privacy' | null>(null);

  // Filtered & Sorted Products computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Active check
        if (!p.isActive) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchMaterial = p.material.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchMaterial && !matchSku) return false;
        }

        // Category filter
        if (selectedCategory && p.categoryId !== selectedCategory) {
          return false;
        }

        // Quick Tabs
        if (filterTab === 'featured' && !p.isFeatured) return false;
        if (filterTab === 'bestsellers' && !p.isBestSeller) return false;
        if (filterTab === 'promotions' && (!p.promotionalPrice || p.promotionalPrice >= p.price)) return false;
        if (filterTab === 'new' && !p.isNew) return false;

        // In Stock filter
        if (onlyInStock && p.stock <= 0) return false;

        // Material filter
        if (selectedMaterial && !p.material.toLowerCase().includes(selectedMaterial.toLowerCase())) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.promotionalPrice || a.price;
        const priceB = b.promotionalPrice || b.price;

        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        return 0; // default order
      });
  }, [products, searchQuery, selectedCategory, filterTab, sortBy, onlyInStock, selectedMaterial]);

  // Handle Add to Cart from Catalog
  const handleAddToCart = (product: Product, variation?: ProductVariation, quantity: number = 1) => {
    const unitPrice = variation
      ? variation.promotionalPrice || variation.price
      : product.promotionalPrice || product.price;

    const maxStock = variation ? variation.stock : product.stock;

    const cartItem: CartItem = {
      productId: product.id,
      variationId: variation?.id,
      name: product.name,
      image: product.images[0] || '/icon.svg',
      price: product.price,
      promotionalPrice: product.promotionalPrice,
      quantity,
      capacity: product.capacity,
      material: product.material,
      variationName: variation?.name,
      maxStock
    };

    db.addToCart(cartItem);
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, variation?: ProductVariation, quantity: number = 1) => {
    handleAddToCart(product, variation, quantity);
    setSelectedProductForDetail(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (order: Order) => {
    setIsCheckoutOpen(false);
    setLastPlacedOrder(order);
  };

  // If in Admin Mode, render complete Admin Suite
  if (currentView === 'admin') {
    return (
      <AdminLayout
        settings={settings}
        orders={orders}
        products={products}
        categories={categories}
        customers={customers}
        coupons={coupons}
        banners={banners}
        movements={movements}
        users={users}
        receivables={receivables}
        payables={payables}
        onBackToStore={() => setCurrentView('store')}
        onSaveProduct={(p) => db.saveProduct(p)}
        onDeleteProduct={(id) => db.deleteProduct(id)}
        onSaveCategory={(c) => db.saveCategory(c)}
        onDeleteCategory={(id) => db.deleteCategory(id)}
        onUpdateOrderStatus={(id, st, note) => db.updateOrderStatus(id, st, note)}
        onAdjustStock={(pId, delta, type, reason, varId) =>
          db.adjustStock(pId, delta, type, reason, varId)
        }
        onSaveCoupon={(coup) => db.saveCoupon(coup)}
        onDeleteCoupon={(id) => db.deleteCoupon(id)}
        onSaveBanner={(b) => db.saveBanner(b)}
        onDeleteBanner={(id) => db.deleteBanner(id)}
        onUpdateSettings={(partial) => db.updateSettings(partial)}
        onSaveUser={(u) => db.saveUser(u)}
        onDeleteUser={(id) => db.deleteUser(id)}
        onSaveReceivable={(r) => db.saveReceivable(r)}
        onMarkAsReceived={(id) => db.markReceivableAsReceived(id)}
        onDeleteReceivable={(id) => db.deleteReceivable(id)}
        onSavePayable={(p) => db.savePayable(p)}
        onMarkAsPaid={(id) => db.markPayableAsPaid(id)}
        onDeletePayable={(id) => db.deletePayable(id)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header Navigation */}
      <Navbar
        settings={settings}
        categories={categories}
        cart={cart}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setCurrentView('admin')}
        filterTab={filterTab}
        onSelectFilterTab={setFilterTab}
      />

      {/* 2. Hero Banner (Carousel) */}
      {!searchQuery && !selectedCategory && filterTab === 'all' && (
        <HeroBanner
          banners={banners}
          onSelectCategorySlug={(slug) => {
            if (!slug) return;
            const found = categories.find((c) => c.slug === slug);
            if (found) setSelectedCategory(found.id);
          }}
        />
      )}

      {/* 3. Category Bar Showcase */}
      {!searchQuery && (
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {/* 4. Product Catalog Main Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex-1 w-full">
        {/* Section Heading & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {searchQuery
                  ? `Resultados para "${searchQuery}"`
                  : selectedCategory
                  ? categories.find((c) => c.id === selectedCategory)?.name || 'Catálogo de Produtos'
                  : filterTab === 'promotions'
                  ? 'Ofertas & Vasilhas em Promoção'
                  : filterTab === 'featured'
                  ? 'Produtos em Destaque'
                  : filterTab === 'bestsellers'
                  ? 'Os Mais Vendidos da Semana'
                  : 'Catálogo Completo de Vasilhas e Potes'}
              </h2>
              <span className="text-xs font-bold text-stone-500 bg-stone-200 px-2.5 py-0.5 rounded-full">
                {filteredProducts.length}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Todos os modelos possuem vedação de alta qualidade e são 100% atóxicos
            </p>
          </div>

          {/* Filtering and Sorting Controls */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-xl px-3 py-2 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-stone-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="featured">Ordem: Destaques</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="name_asc">Nome A-Z</option>
              </select>
            </div>

            {/* Quick Material Filter Pills */}
            <div className="hidden sm:flex items-center gap-1.5">
              {['Vidro', 'Acrílico', 'Bambu', 'Inox'].map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(selectedMaterial === mat ? null : mat)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                    selectedMaterial === mat
                      ? 'bg-emerald-800 border-emerald-800 text-white font-semibold'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>

            {/* In stock only toggle */}
            <label className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-xl px-3 py-2 cursor-pointer text-stone-700 font-medium">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-emerald-700"
              />
              <span>Apenas em estoque</span>
            </label>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 mt-6 p-8">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-stone-800 text-base">Nenhum produto encontrado</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Tente buscar por termos mais genéricos como "vidro", "bambu", "hermético" ou limpe os filtros ativos.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setFilterTab('all');
                setSelectedMaterial(null);
                setOnlyInStock(false);
              }}
              className="mt-5 px-5 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition"
            >
              Ver Todos os Produtos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mt-6">
            {filteredProducts.map((product) => {
              const isAdded = cart.some((c) => c.productId === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onViewDetails={(p) => setSelectedProductForDetail(p)}
                  isAddedToCart={isAdded}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* 5. Modals and Drawers */}

      {/* Product Detail Modal */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          onClose={() => setSelectedProductForDetail(null)}
          onAddToCart={(p, v, q) => handleAddToCart(p, v, q)}
          onBuyNow={(p, v, q) => handleBuyNow(p, v, q)}
          relatedProducts={products.filter(
            (p) => p.categoryId === selectedProductForDetail.categoryId && p.id !== selectedProductForDetail.id
          )}
          onSelectProduct={(p) => setSelectedProductForDetail(p)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        settings={settings}
        onProceedToCheckout={(appliedCoupon) => {
          setCheckoutCouponCode(appliedCoupon);
          setIsCheckoutOpen(true);
        }}
        onUpdateQuantity={(pId, vId, qty) => db.updateCartQuantity(pId, vId, qty)}
        onRemoveItem={(pId, vId) => db.removeFromCart(pId, vId)}
      />

      {/* Simplified Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        settings={settings}
        initialCouponCode={checkoutCouponCode}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Order Success / Celebration Modal */}
      {lastPlacedOrder && (
        <OrderSuccessModal
          order={lastPlacedOrder}
          settings={settings}
          onClose={() => setLastPlacedOrder(null)}
        />
      )}

      {/* Policy View Modal */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full text-stone-800 relative">
            <button
              onClick={() => setActivePolicyModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-stone-900 text-base mb-3">
              {activePolicyModal === 'return'
                ? 'Política de Trocas e Devoluções'
                : 'Política de Privacidade e Proteção de Dados'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {activePolicyModal === 'return'
                ? settings.returnPolicy
                : settings.privacyPolicy}
            </p>
            <button
              onClick={() => setActivePolicyModal(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* 6. Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenPolicy={(type) => setActivePolicyModal(type)}
      />
    </div>
  );
}
