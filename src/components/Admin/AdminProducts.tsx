import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Image as ImageIcon,
  Sparkles,
  Layers,
  AlertCircle
} from 'lucide-react';
import { Product, Category, ProductVariation } from '../../types';
import { formatCurrency } from '../../services/cep';

interface Props {
  products: Product[];
  categories: Category[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const AdminProducts: React.FC<Props> = ({
  products,
  categories,
  onSaveProduct,
  onDeleteProduct
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [capacity, setCapacity] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [costPrice, setCostPrice] = useState('0');
  const [price, setPrice] = useState('0');
  const [promotionalPrice, setPromotionalPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [minStock, setMinStock] = useState('5');
  const [imageUrl, setImageUrl] = useState('');
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [variations, setVariations] = useState<ProductVariation[]>([]);

  // Variation builder state
  const [varName, setVarName] = useState('');
  const [varSku, setVarSku] = useState('');
  const [varPrice, setVarPrice] = useState('');
  const [varStock, setVarStock] = useState('10');

  const openNewModal = () => {
    setEditingProduct(null);
    setName('');
    setSku(`POT-${Math.floor(1000 + Math.random() * 9000)}`);
    setBarcode('');
    setCategoryId(categories[0]?.id || '');
    setDescription('');
    setMaterial('Vidro Borossilicato e Tampa de Bambu');
    setCapacity('1.000 ml');
    setDimensions('15 x 10 x 10 cm');
    setCostPrice('25.00');
    setPrice('59.90');
    setPromotionalPrice('');
    setStock('20');
    setMinStock('5');
    setImageUrl('');
    setImagesList([
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'
    ]);
    setIsActive(true);
    setIsFeatured(false);
    setIsBestSeller(false);
    setVariations([]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setBarcode(p.barcode || '');
    setCategoryId(p.categoryId);
    setDescription(p.description);
    setMaterial(p.material);
    setCapacity(p.capacity);
    setDimensions(p.dimensions);
    setCostPrice(p.costPrice.toString());
    setPrice(p.price.toString());
    setPromotionalPrice(p.promotionalPrice ? p.promotionalPrice.toString() : '');
    setStock(p.stock.toString());
    setMinStock(p.minStock.toString());
    setImagesList(p.images || []);
    setIsActive(p.isActive);
    setIsFeatured(p.isFeatured);
    setIsBestSeller(!!p.isBestSeller);
    setVariations(p.variations || []);
    setIsModalOpen(true);
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImagesList([...imagesList, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagesList((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (idx: number) => {
    setImagesList(imagesList.filter((_, i) => i !== idx));
  };

  const handleAddVariation = () => {
    if (!varName.trim() || !varPrice) return;
    const newVar: ProductVariation = {
      id: 'var-' + Date.now(),
      sku: varSku.trim() || `${sku}-${variations.length + 1}`,
      name: varName.trim(),
      sizeOrCapacity: varName.trim(),
      price: parseFloat(varPrice),
      stock: parseInt(varStock, 10) || 0
    };
    setVariations([...variations, newVar]);
    setVarName('');
    setVarSku('');
    setVarPrice('');
    setVarStock('10');
  };

  const handleRemoveVariation = (id: string) => {
    setVariations(variations.filter((v) => v.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const baseStock = parseInt(stock, 10) || 0;
    // If variations exist, compute total stock from variations
    const computedStock =
      variations.length > 0 ? variations.reduce((sum, v) => sum + v.stock, 0) : baseStock;

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : 'prod-' + Date.now(),
      name: name.trim(),
      slug: (editingProduct ? editingProduct.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
      sku: sku.trim(),
      barcode: barcode.trim() || undefined,
      categoryId,
      description: description.trim(),
      material: material.trim(),
      capacity: capacity.trim(),
      dimensions: dimensions.trim(),
      costPrice: parseFloat(costPrice) || 0,
      price: parseFloat(price) || 0,
      promotionalPrice: promotionalPrice ? parseFloat(promotionalPrice) : undefined,
      stock: computedStock,
      minStock: parseInt(minStock, 10) || 5,
      images: imagesList.length > 0 ? imagesList : ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'],
      variations,
      isActive,
      isFeatured,
      isBestSeller,
      tags: ['Hermético', 'Livre de BPA'],
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveProduct(productPayload);
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.material.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, SKU, material..."
              className="w-full bg-white pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={openNewModal}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-3">SKU / Categoria</th>
                <th className="py-3 px-3">Preço Venda</th>
                <th className="py-3 px-3">Estoque</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const cat = categories.find((c) => c.id === p.categoryId);
                const isLowStock = p.stock <= p.minStock;

                return (
                  <tr key={p.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-stone-900 block line-clamp-1 max-w-xs">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {p.capacity} • {p.material.split('+')[0]}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono text-stone-700 font-semibold block">{p.sku}</span>
                      <span className="text-[11px] text-stone-500">{cat?.name || 'Sem categoria'}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-stone-900 block">
                        {formatCurrency(p.promotionalPrice || p.price)}
                      </span>
                      {p.promotionalPrice && (
                        <span className="text-[10px] text-stone-400 line-through">
                          {formatCurrency(p.price)}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full inline-block text-[11px] ${
                          p.stock <= 0
                            ? 'bg-rose-100 text-rose-700'
                            : isLowStock
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock} unid.
                      </span>
                      {p.variations && p.variations.length > 0 && (
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          {p.variations.length} variações
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-semibold ${
                          p.isActive ? 'text-emerald-700' : 'text-stone-400'
                        }`}
                      >
                        {p.isActive ? '● Ativo' : '○ Inativo'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg transition"
                          title="Editar produto"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Deseja realmente excluir "${p.name}"?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Excluir produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-stone-200 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
              <h3 className="font-bold text-stone-900 text-base">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 text-stone-600 flex items-center justify-center transition border border-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
              {/* Basic Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200">
                  Informações Básicas
                </h4>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Nome do Produto *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Pote Hermético de Vidro Borossilicato 1.000ml"
                    className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Código SKU *</label>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Código de Barras (EAN)</label>
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="789..."
                      className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Categoria *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Descrição Completa *</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalhes sobre o fechamento hermético, resistência térmica, livre de bpa..."
                    className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200">
                  Especificações Técnicas
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Material *</label>
                    <input
                      type="text"
                      required
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      placeholder="Ex: Vidro Borossilicato e Bambu"
                      className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Capacidade (ml/L) *</label>
                    <input
                      type="text"
                      required
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="Ex: 1.000 ml"
                      className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Dimensões *</label>
                    <input
                      type="text"
                      required
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="Ex: 15 x 10 x 8 cm"
                      className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200">
                  Preços e Estoque
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Preço de Custo (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Preço de Venda (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Preço Promocional (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={promotionalPrice}
                      onChange={(e) => setPromotionalPrice(e.target.value)}
                      placeholder="Opcional"
                      className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700 text-rose-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Estoque Inicial *</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Images Gallery */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200">
                  Fotos do Produto (Upload do Dispositivo / Storage ou URL)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Cole a URL da foto"
                      className="flex-1 bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="bg-stone-800 hover:bg-stone-900 text-white px-3 py-2 rounded-xl font-semibold transition shrink-0"
                    >
                      Adicionar URL
                    </button>
                  </div>

                  <div>
                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold cursor-pointer hover:bg-emerald-100 transition text-xs">
                      <span>📁 Fazer Upload de Imagem do Aparelho</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {imagesList.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-200 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variations */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200">
                  Variações de Tamanho / Cor (Opcional)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={varName}
                    onChange={(e) => setVarName(e.target.value)}
                    placeholder="Nome (ex: 1.500ml Tampa Bambu)"
                    className="bg-white px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                  />
                  <input
                    type="text"
                    value={varSku}
                    onChange={(e) => setVarSku(e.target.value)}
                    placeholder="SKU variação"
                    className="bg-white px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-mono"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={varPrice}
                    onChange={(e) => setVarPrice(e.target.value)}
                    placeholder="Preço R$"
                    className="bg-white px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariation}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg py-1.5 text-xs transition"
                  >
                    + Adicionar
                  </button>
                </div>

                {variations.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {variations.map((v) => (
                      <div key={v.id} className="flex justify-between items-center bg-stone-50 p-2 rounded-lg border border-stone-200">
                        <span>
                          <strong>{v.name}</strong> ({v.sku}) - {formatCurrency(v.price)} • {v.stock} em estoque
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariation(v.id)}
                          className="text-stone-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status checkboxes */}
              <div className="pt-2 border-t border-stone-200 flex flex-wrap gap-4 text-xs font-medium text-stone-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-700"
                  />
                  <span>Produto Ativo na Vitrine</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-700"
                  />
                  <span>Destaque na Página Inicial</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-700"
                  />
                  <span>Selo Mais Vendido</span>
                </label>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition shadow-sm"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
