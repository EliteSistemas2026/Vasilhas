# Vasilha & Cia - Loja Virtual de Vasilhas e Utilidades Domésticas

Loja virtual moderna, rápida e responsiva para venda de vasilhas, potes herméticos, organizadores de geladeira, marmitas e utilidades para o lar.

---

## 🚀 Status da Aplicação no Ar

Sua aplicação já está compilada, integrada e **publicada no ar** nos seguintes endereços:

- 🔗 **Link de Compartilhamento / Produção**:
  [https://ais-pre-rylyjjgcgciue3svqfgopd-210813896235.us-east1.run.app](https://ais-pre-rylyjjgcgciue3svqfgopd-210813896235.us-east1.run.app)
- 🔗 **Link de Desenvolvimento**:
  [https://ais-dev-rylyjjgcgciue3svqfgopd-210813896235.us-east1.run.app](https://ais-dev-rylyjjgcgciue3svqfgopd-210813896235.us-east1.run.app)

---

## 🛠️ Tecnologias & Integrações

- **Frontend**: React 19 + TypeScript + Tailwind CSS (Mobile-First, PWA Instalável).
- **Backend**: Node.js + Express com API REST.
- **Banco de Dados**: Cloud SQL PostgreSQL provisionado na região `us-east1` com Drizzle ORM.
- **Supabase**: Arquitetura 100% compatível com script de migração SQL pronto (`supabase-migration.sql`) e campos de conexão direta.
- **Autenticação**: Firebase Auth & Google OAuth.
- **Pagamento**: Pix Instantâneo com QR Code visual gerado na hora e Copia e Cola.
- **Logística**: Integração em tempo real com ViaCEP para autopreenchimento de endereço.
- **Comunicação**: WhatsApp integrado para envio instantâneo do resumo de novos pedidos.

---

## 🔒 Acesso ao Painel Administrativo

Acesse a rota administrativa clicando no link **Admin** no cabeçalho ou rodapé da loja:
- **Senha Padrão**: `admin`
- Funcionalidades: Dashboard com faturamento real, cadastro e fotos de produtos, variações, controle de estoque com auditoria, cupons de desconto, relatórios com exportação CSV e gerenciador de banners.

---

## 🌐 Como Publicar na Vercel (Opcional)

Caso queira vincular ao seu domínio próprio na Vercel:

1. Faça o download ou envie os arquivos para um repositório no **GitHub**.
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**.
3. Importe o repositório do GitHub. O arquivo `vercel.json` já configurou o build automaticamente (`npm run build` e diretório `dist`).
4. Clique em **Deploy**!
