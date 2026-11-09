import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { Banner } from '../../types';

interface Props {
  banners: Banner[];
  onSaveBanner: (banner: Banner) => void;
  onDeleteBanner: (id: string) => void;
}

export const AdminBanners: React.FC<Props> = ({
  banners,
  onSaveBanner,
  onDeleteBanner
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [image, setImage] = useState('');
  const [linkCategory, setLinkCategory] = useState('');
  const [buttonText, setButtonText] = useState('Ver Ofertas');
  const [order, setOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);

  const openNewModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setBadgeText('OFERTA ESPECIAL');
    setImage('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1400&auto=format&fit=crop&q=80');
    setLinkCategory('');
    setButtonText('Aproveitar Agora');
    setOrder((banners.length + 1).toString());
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle);
    setBadgeText(b.badgeText || '');
    setImage(b.image);
    setLinkCategory(b.linkCategory || '');
    setButtonText(b.buttonText);
    setOrder(b.order.toString());
    setIsActive(b.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) return;

    const banner: Banner = {
      id: editingBanner ? editingBanner.id : 'ban-' + Date.now(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      badgeText: badgeText.trim() || undefined,
      image: image.trim(),
      linkCategory: linkCategory.trim() || undefined,
      buttonText: buttonText.trim() || 'Ver Mais',
      order: parseInt(order, 10) || 1,
      isActive
    };

    onSaveBanner(banner);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-stone-900 text-base">Banners Promocionais da Home</h3>
          <p className="text-xs text-stone-500">Configure os destaques visuais do carrossel principal</p>
        </div>

        <button
          onClick={openNewModal}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {banners.sort((a, b) => a.order - b.order).map((ban) => (
          <div
            key={ban.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full bg-stone-900 overflow-hidden">
              <img src={ban.image} alt={ban.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent p-4 flex flex-col justify-end text-white">
                {ban.badgeText && (
                  <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/60 w-max px-2 py-0.5 rounded">
                    {ban.badgeText}
                  </span>
                )}
                <h4 className="font-bold text-sm leading-snug mt-1">{ban.title}</h4>
                <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">{ban.subtitle}</p>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                  Ordem: {ban.order}
                </span>
                <span className={`font-semibold ${ban.isActive ? 'text-emerald-700' : 'text-stone-400'}`}>
                  {ban.isActive ? '● Ativo' : '○ Inativo'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(ban)}
                  className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Excluir este banner?')) {
                      onDeleteBanner(ban.id);
                    }
                  }}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
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
                {editingBanner ? 'Editar Banner' : 'Novo Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Título do Banner *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Potes de Vidro com Tampa Bambu"
                  className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Subtítulo / Descrição</label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Texto explicativo para convencer o cliente..."
                  className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Badge de Destaque</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="Ex: LANÇAMENTO, ATÉ 30% OFF"
                  className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs uppercase"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">URL da Imagem de Fundo *</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Texto do Botão</label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Ver Ofertas"
                    className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Ordem</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-emerald-700"
                  />
                  <span>Banner Ativo no Carrossel</span>
                </label>
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
                  Salvar Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
