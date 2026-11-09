import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  variant?: 'button' | 'banner';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'button' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (variant === 'banner') {
    return (
      <>
        <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-2.5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instale nosso aplicativo direto no seu celular para compras mais rápidas e ofertas exclusivas!</span>
          </div>
          <div>
            {isInstallable && (
              <button
                onClick={install}
                className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold px-3 py-1 rounded text-xs transition"
              >
                Instalar App
              </button>
            )}
            {isIOS && (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-medium px-3 py-1 rounded text-xs transition"
              >
                Como Instalar no iPhone
              </button>
            )}
          </div>
        </div>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-stone-800 relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-3">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Instalar Vasilha & Cia no iOS</h3>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                Para ter o aplicativo na tela inicial do seu iPhone ou iPad:
              </p>
              <div className="mt-4 space-y-3 text-sm bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                  <span>Toque no botão <strong>Compartilhar</strong> na barra do Safari.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                  <span>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-stone-900 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 transition"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Button variant (for header/footer)
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-700 hover:to-pink-700 transition shadow-sm shadow-rose-200"
        title="Instalar aplicativo Tupperware Vasilhas"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 hover:bg-rose-100 transition border border-rose-200"
          title="Instalar no iPhone"
        >
          <Smartphone className="w-3.5 h-3.5 text-rose-600" />
          <span>App no iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-stone-800 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-3 border border-rose-100">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Instalar Vasilhas no iPhone</h3>
              <p className="mt-2 text-sm text-stone-600">
                1. Toque no ícone de <strong>Compartilhar</strong> (quadrado com seta para cima) no Safari.<br />
                2. Selecione <strong>Adicionar à Tela de Início</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
