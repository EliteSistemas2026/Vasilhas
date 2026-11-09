import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  Lock,
  Layers,
  Sparkles,
  Tag
} from 'lucide-react';
import { StoreSettings, Category, CartItem } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  settings: StoreSettings;
  categories: Category[];
  cart: CartItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory: (categoryId: string | null) => void;
  selectedCategory: string | null;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  filterTab: 'all' | 'featured' | 'bestsellers' | 'promotions' | 'new';
  onSelectFilterTab: (tab: 'all' | 'featured' | 'bestsellers' | 'promotions' | 'new') => void;
}

export const Navbar: React.FC<Props> = ({
  settings,
  categories,
  cart,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  selectedCategory,
  onOpenCart,
  onOpenAdmin,
  filterTab,
  onSelectFilterTab
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs transition-all">
      {/* Main Header Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-emerald-800 focus:outline-none rounded-lg"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-stone-700" />}
          </button>

          {/* Logo */}
          <div
            onClick={() => {
              onSelectCategory(null);
              onSelectFilterTab('all');
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
              <Layers className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 group-hover:text-emerald-800 transition">
                {settings.storeName.split(' ')[0]}
                <span className="text-emerald-700 font-normal ml-1">
                  {settings.storeName.split(' ').slice(1).join(' ') || '& Cia'}
                </span>
              </span>
            </div>
          </div>

          {/* Search Bar - Desktop & Tablet */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar produtos, potes, organizadores..."
                className="w-full bg-stone-100 hover:bg-stone-50 focus:bg-white text-stone-900 placeholder:text-stone-400 pl-10 pr-9 py-2 rounded-full border border-stone-200 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 text-xs transition outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-stone-400 hover:text-stone-600 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons: WhatsApp + PWA + Admin + Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=Olá,%20gostaria%20de%20tirar%20uma%20dúvida.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:text-emerald-800 hover:bg-stone-100 transition"
              title="Atendimento WhatsApp"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition"
              title="Painel Administrativo"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            <div className="hidden sm:block">
              <PWAInstallButton variant="button" />
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white px-3.5 sm:px-4 py-2 rounded-full shadow-xs transition"
              aria-label="Abrir carrinho"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-emerald-100" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold hidden sm:inline">
                Carrinho
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar potes, organizadores..."
              className="w-full bg-stone-100 focus:bg-white text-stone-900 placeholder:text-stone-400 pl-9 pr-8 py-2 rounded-full border border-stone-200 focus:border-emerald-700 text-xs transition outline-none"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-stone-400 hover:text-stone-600 absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar: Clean Categories Bar */}
      <nav className="border-t border-stone-100 bg-stone-50/70 px-4 overflow-x-auto scrollbar-none">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 py-1.5 text-xs font-medium whitespace-nowrap">
          <button
            onClick={() => {
              onSelectCategory(null);
              onSelectFilterTab('all');
            }}
            className={`px-3 py-1 rounded-full transition ${
              selectedCategory === null && filterTab === 'all'
                ? 'bg-stone-900 text-white font-medium'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            Todos
          </button>

          <button
            onClick={() => {
              onSelectCategory(null);
              onSelectFilterTab('promotions');
            }}
            className={`px-3 py-1 rounded-full flex items-center gap-1 transition ${
              filterTab === 'promotions'
                ? 'bg-rose-700 text-white font-medium'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>Ofertas</span>
          </button>

          <div className="w-px h-3.5 bg-stone-300 mx-1 shrink-0" />

          {categories
            .filter((c) => c.isActive)
            .sort((a, b) => a.order - b.order)
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onSelectFilterTab('all');
                }}
                className={`px-3 py-1 rounded-full transition ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white font-medium'
                    : 'text-stone-600 hover:bg-stone-200/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="font-bold text-stone-900 text-sm">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1 text-sm">
            <button
              onClick={() => {
                onSelectCategory(null);
                onSelectFilterTab('all');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-stone-100 font-medium text-stone-800"
            >
              Todos os Produtos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2 text-xs">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-left text-emerald-800 font-medium py-1.5 flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Falar no WhatsApp</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-left text-stone-600 hover:text-emerald-700 font-medium py-1.5 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Painel do Administrador</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
