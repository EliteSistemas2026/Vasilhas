import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Layers, Image as ImageIcon } from 'lucide-react';
import { Category } from '../../types';

interface Props {
  categories: Category[];
  onSaveCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

export const AdminCategories: React.FC<Props> = ({
  categories,
  onSaveCategory,
  onDeleteCategory
}) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);

  const openNewModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80');
    setOrder((categories.length + 1).toString());
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setDescription(c.description);
    setImage(c.image);
    setOrder(c.order.toString());
    setIsActive(c.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Category = {
      id: editingCategory ? editingCategory.id : 'cat-' + Date.now(),
      name: name.trim(),
      slug: editingCategory ? editingCategory.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      image: image.trim() || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      order: parseInt(order, 10) || 1,
      isActive
    };

    onSaveCategory(payload);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-stone-900 text-base">Categorias da Loja</h3>
          <p className="text-xs text-stone-500">Organização das seções de potes e organizadores</p>
        </div>

        <button
          onClick={openNewModal}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.sort((a, b) => a.order - b.order).map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition"
          >
            <div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-100 mb-3 border border-stone-100">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-stone-900 text-sm">{cat.name}</h4>
                <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono">
                  Ordem: {cat.order}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">{cat.description}</p>
            </div>

            <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className={`font-semibold text-[11px] ${cat.isActive ? 'text-emerald-700' : 'text-stone-400'}`}>
                {cat.isActive ? '● Ativa' : '○ Inativa'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg"
                  title="Editar"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Excluir a categoria "${cat.name}"?`)) {
                      onDeleteCategory(cat.id);
                    }
                  }}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-stone-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Nome da Categoria *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Potes de Vidro Herméticos"
                  className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descrição dos produtos..."
                  className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">URL da Imagem de Capa</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Ordem de Exibição</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded text-emerald-700"
                    />
                    <span>Ativa na Vitrine</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
