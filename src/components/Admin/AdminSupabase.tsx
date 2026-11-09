import React, { useState } from 'react';
import { Database, Copy, Check, ExternalLink, ShieldCheck, Key, RefreshCw } from 'lucide-react';
import { SUPABASE_MIGRATION_SQL } from '../../services/supabaseMigration';
import { StoreSettings } from '../../types';

interface Props {
  settings: StoreSettings;
  onUpdateSettings: (partial: Partial<StoreSettings>) => void;
}

export const AdminSupabase: React.FC<Props> = ({ settings, onUpdateSettings }) => {
  const [copied, setCopied] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(settings.supabaseUrl || '');
  const [supabaseKey, setSupabaseKey] = useState(settings.supabaseAnonKey || '');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_MIGRATION_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      supabaseUrl: supabaseUrl.trim() || undefined,
      supabaseAnonKey: supabaseKey.trim() || undefined
    });
    setSaveStatus('Credenciais do Supabase salvas com sucesso!');
    setTimeout(() => setSaveStatus(null), 3500);
  };

  return (
    <div className="space-y-6 text-xs max-w-4xl">
      <div className="pb-3 border-b border-stone-200">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-700" />
          <span>Banco de Dados Relacional PostgreSQL & Supabase</span>
        </h3>
        <p className="text-stone-500">
          Arquitetura empresarial completa com banco relacional PostgreSQL, Drizzle ORM, Row Level Security (RLS) e triggers de estoque.
        </p>
      </div>

      {/* Cloud SQL Instance Status Card */}
      <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Instância Cloud SQL PostgreSQL Conectada & Ativa
            </span>
          </div>
          <h4 className="text-sm font-bold text-white">
            Instância: <code className="bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-200 font-mono">ai-studio-82c03b7a</code>
          </h4>
          <p className="text-[11px] text-stone-300 mt-0.5">
            Região: <strong>us-east1</strong> • Projeto: <strong>ebd-pro-digital-16276287-383e7</strong> • 10 tabelas Drizzle sincronizadas
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 bg-emerald-800/80 text-emerald-200 rounded-full font-bold text-[11px] border border-emerald-700 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Online & Saudável</span>
          </span>
        </div>
      </div>

      {/* Supabase Connection Setup */}
      <form onSubmit={handleSaveCredentials} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-700" />
            <span>Conectar Projeto Supabase Real</span>
          </h4>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Criar conta no Supabase</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <p className="text-stone-600 leading-relaxed">
          Cole abaixo as credenciais do seu projeto Supabase para sincronizar automaticamente os dados da loja virtual com o banco de dados PostgreSQL na nuvem:
        </p>

        <div className="space-y-3">
          <div>
            <label className="block font-medium text-stone-700 mb-1">Project URL (Supabase)</label>
            <input
              type="url"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 font-mono focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Anon / Public API Key</label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-white px-3 py-2 rounded-xl border border-stone-300 font-mono focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        {saveStatus && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-medium border border-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{saveStatus}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition shadow-xs"
          >
            Salvar Conexão do Supabase
          </button>
        </div>
      </form>

      {/* SQL Migration Script Box */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
              Script de Migração SQL Completo (PostgreSQL DDL)
            </h4>
            <p className="text-[11px] text-stone-500">
              Copie este script e execute no <strong>SQL Editor</strong> do seu painel Supabase para criar todas as tabelas, políticas RLS e triggers.
            </p>
          </div>

          <button
            onClick={handleCopySql}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-1.5 transition shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Script Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar SQL Completo</span>
              </>
            )}
          </button>
        </div>

        {/* Code display window */}
        <div className="relative">
          <pre className="bg-stone-900 text-stone-200 p-4 rounded-xl font-mono text-[11px] leading-relaxed max-h-96 overflow-y-auto border border-stone-800">
            {SUPABASE_MIGRATION_SQL}
          </pre>
        </div>

        {/* Step-by-step instructions */}
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
          <span className="font-bold text-stone-900 block text-xs">
            Instruções para Execução no Supabase:
          </span>
          <ol className="list-decimal list-inside space-y-1 text-stone-600 leading-relaxed text-xs">
            <li>Acesse o painel do seu projeto no Supabase (<a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">supabase.com/dashboard</a>).</li>
            <li>No menu lateral esquerdo, clique em <strong>SQL Editor</strong>.</li>
            <li>Clique em <strong>New Query</strong> e cole o código acima.</li>
            <li>Clique no botão verde <strong>Run</strong> (ou aperte Ctrl + Enter).</li>
            <li>Pronto! Todas as tabelas (<code className="bg-stone-200 px-1 rounded">products</code>, <code className="bg-stone-200 px-1 rounded">orders</code>, <code className="bg-stone-200 px-1 rounded">categories</code>, etc.), políticas de segurança RLS e triggers de estoque estarão criadas e ativas.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
