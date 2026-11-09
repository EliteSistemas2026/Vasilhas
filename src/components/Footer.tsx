import React from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  QrCode,
  CreditCard,
  Lock,
  Heart
} from 'lucide-react';
import { StoreSettings } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  settings: StoreSettings;
  onOpenAdmin: () => void;
  onOpenPolicy: (type: 'return' | 'privacy') => void;
}

export const Footer: React.FC<Props> = ({
  settings,
  onOpenAdmin,
  onOpenPolicy
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-20 border-t border-stone-800">
      {/* 4 Feature Value Props */}
      <div className="border-b border-stone-800 bg-stone-950/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Pronta Entrega
              </h4>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Envio rápido e seguro para você
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Livre de BPA
              </h4>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Vidro borossilicato & atóxico
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Troca Fácil
              </h4>
              <p className="text-[11px] text-stone-400 mt-0.5">
                7 dias corridos de garantia
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Desconto no Pix
              </h4>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {settings.pixDiscountPercent}% de desconto imediato
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-black text-sm">
              V
            </div>
            <span className="text-lg font-extrabold text-white">
              {settings.storeName}
            </span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            {settings.slogan}
          </p>
          <div className="pt-2">
            <PWAInstallButton variant="banner" />
          </div>
        </div>

        {/* Contact Info Col */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Atendimento & Contato
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-400">
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{settings.phone} / WhatsApp {settings.whatsapp}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{settings.email}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{settings.address} - {settings.neighborhood}, {settings.city} - {settings.state}</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{settings.openingHours}</span>
            </li>
          </ul>
        </div>

        {/* Institutional & Policies Col */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Informações & Ajuda
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>
              <button
                onClick={() => onOpenPolicy('return')}
                className="hover:text-emerald-400 transition"
              >
                Política de Trocas e Devoluções
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenPolicy('privacy')}
                className="hover:text-emerald-400 transition"
              >
                Privacidade & Segurança de Dados
              </button>
            </li>
            <li>
              <button
                onClick={onOpenAdmin}
                className="text-stone-500 hover:text-emerald-400 transition flex items-center gap-1.5 mt-2"
              >
                <Lock className="w-3 h-3" />
                <span>Painel Administrativo da Loja</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Payment Methods & Socials */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Formas de Pagamento
          </h4>
          <div className="flex flex-wrap gap-2 text-xs text-stone-300">
            <span className="px-2.5 py-1 rounded bg-stone-800 border border-stone-700 font-semibold flex items-center gap-1">
              <QrCode className="w-3 h-3 text-emerald-400" /> Pix (-{settings.pixDiscountPercent}%)
            </span>
            <span className="px-2.5 py-1 rounded bg-stone-800 border border-stone-700 font-semibold flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-emerald-400" /> Cartão até 3x
            </span>
            <span className="px-2.5 py-1 rounded bg-stone-800 border border-stone-700 font-semibold">
              Dinheiro na Entrega
            </span>
          </div>

          <div className="mt-5">
            <span className="text-xs font-bold uppercase tracking-wider text-white block mb-2">
              Siga Nossas Redes
            </span>
            <div className="flex items-center gap-3">
              <a
                href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-emerald-800 text-stone-300 hover:text-white flex items-center justify-center transition"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              {settings.facebook && (
                <a
                  href={`https://${settings.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-emerald-800 text-stone-300 hover:text-white flex items-center justify-center transition"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Sub-bar */}
      <div className="border-t border-stone-800/80 py-4 text-center text-xs text-stone-500">
        <p>
          © {new Date().getFullYear()} {settings.storeName}. Todos os direitos reservados. CNPJ: 45.892.124/0001-90.
        </p>
      </div>
    </footer>
  );
};
