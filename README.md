# 🙏 Landing Page - 16º Culto de Ação de Graças

Landing Page de arrecadação em tempo real para o evento organizado pelas congregações Parque Savoy e Guarulhos.

Dias: 20, 21 e 22 de Novembro de 2026 | São Paulo - SP

## 🚀 Tecnologias

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Animações**: Framer Motion (estilo Magic UI)
- **Backend/DB**: Supabase (PostgreSQL + Realtime WebSocket)
- **Pagamentos**: Mercado Pago (Checkout Pro)
- **Integração**: MCP do Mercado Pago

## ✨ Funcionalidades

- ✅ Hero Section com fundo animado (Retro Grid)
- ✅ Contador de arrecadação em tempo real com WebSocket
- ✅ Lista de doadores com scroll animado (Marquee)
- ✅ Formulário de doação com validação completa
- ✅ Integração real com Mercado Pago (PIX, Cartão, Boleto)
- ✅ Webhook configurado para processar pagamentos
- ✅ Acumulação automática de doações por telefone
- ✅ Páginas de retorno personalizadas (sucesso, erro, pendente)
- ✅ Design moderno e totalmente responsivo
- ✅ Atualização em tempo real sem refresh da página

## ⚡ Início Rápido

O projeto está **100% configurado e pronto para uso**! ✅

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar servidor:**
   ```bash
   npm run dev
   ```
   Acesse: `http://localhost:5176`

### ✅ Status da Integração

- ✅ **Supabase**: Configurado e conectado
  - URL: `https://xplsdoztojxmxvarrori.supabase.co`
  - Tabelas: `transactions` e `donors` (criadas e com RLS)
  - Realtime: Habilitado

- ✅ **Edge Functions**: Deployadas
  - `criar-pagamento`: Cria preferências de pagamento
  - `webhook-pagamento`: Processa notificações do MP

- ✅ **Mercado Pago**: Configurado
  - Webhook ativo: `https://xplsdoztojxmxvarrori.supabase.co/functions/v1/webhook-pagamento`
  - Tópico: `payment`

- ✅ **Frontend**: Integração completa
  - Modal de doação funcional
  - Redirecionamento para Mercado Pago
  - Páginas de retorno (sucesso, erro, pendente)

## 🧪 Testar Doação

1. Acesse `http://localhost:5176`
2. Clique em "Quero Contribuir"
3. Preencha os dados e clique em "Continuar para Pagamento"
4. Use cartão de teste:
   - **Número**: `5031 4332 1540 6351`
   - **Validade**: Qualquer data futura
   - **CVV**: `123`
   - **Nome**: Qualquer nome
   - **CPF**: `12345678909`
5. Após aprovação, você será redirecionado e o contador atualizará automaticamente!

## 📋 Documentação Adicional

- 📘 [`CONFIGURACAO_COMPLETA.md`](./CONFIGURACAO_COMPLETA.md) - Guia detalhado de configuração
- 💳 [`INTEGRACAO_MERCADO_PAGO.md`](./INTEGRACAO_MERCADO_PAGO.md) - Detalhes da integração MP
- 🗄️ [`supabase-setup.sql`](./supabase-setup.sql) - Script SQL completo

## 🚀 Deploy em Produção

Para fazer deploy na Vercel ou Netlify:

1. Faça push do código para GitHub
2. Conecte o repositório na plataforma
3. As variáveis de ambiente já estão em `.env` (copie para a plataforma)
4. Deploy! O sistema funcionará automaticamente

**Webhook em produção:** Já está configurado e funcionará automaticamente

## 🔧 Requisitos Técnicos

### 1. Clone e instale as dependências

```bash
cd landing
npm install
```

### 2. Configure o Supabase

1. Acesse [Supabase](https://supabase.com) e crie um novo projeto
2. Vá em **SQL Editor** no menu lateral
3. Abra o arquivo `supabase-setup.sql` deste projeto
4. Copie todo o conteúdo e cole no SQL Editor
5. Clique em **RUN** para executar

### 3. Configure as variáveis de ambiente

1. Copie o arquivo `.env.example` para `.env`:

```bash
copy .env.example .env
```

2. Edite o arquivo `.env` com suas credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
VITE_MERCADO_PAGO_PUBLIC_KEY=sua-chave-publica-mp (opcional)
```

**Onde encontrar as credenciais do Supabase:**
- Vá em **Settings** → **API**
- Copie o **Project URL** e o **anon public** key

### 4. Habilite o Realtime no Supabase

1. No Supabase Dashboard, vá em **Database** → **Replication**
2. Ative a replicação para as tabelas:
   - `transactions`
   - `donors`

## 🎯 Executar o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`

### Preview da Build

```bash
npm run preview
```

## 📊 Estrutura do Banco de Dados

### Tabela: `transactions`
Armazena todas as transações de pagamento.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único da transação |
| `mercado_pago_id` | VARCHAR | ID do pagamento no Mercado Pago |
| `status` | VARCHAR | Status: pending, approved, rejected |
| `amount` | DECIMAL | Valor da doação |
| `donor_name` | VARCHAR | Nome do doador |
| `donor_phone` | VARCHAR | Telefone do doador |
| `created_at` | TIMESTAMP | Data de criação |

### Tabela: `donors`
Armazena o total acumulado por doador (chave: telefone).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `phone` | VARCHAR | Telefone (Primary Key) |
| `name` | VARCHAR | Nome do doador |
| `total_donated` | DECIMAL | Total acumulado |
| `donation_count` | INTEGER | Número de doações |
| `first_donation_at` | TIMESTAMP | Data da primeira doação |
| `last_donation_at` | TIMESTAMP | Data da última doação |

## 🔄 Lógica de Acumulação

A lógica de acumulação é baseada no **número de telefone**:

1. Usuário preenche o formulário (nome, telefone, valor)
2. Sistema cria uma transação com status `pending`
3. Após aprovação do pagamento:
   - Se o telefone **já existe**: atualiza `total_donated` += novo valor
   - Se o telefone **não existe**: cria novo doador com valor inicial

4. O Supabase Realtime notifica o frontend via WebSocket
5. O contador é atualizado automaticamente (sem refresh)

## 💳 Integração com Mercado Pago

### Status Atual
⚠️ O projeto está com **simulação de pagamento** para testes.
Todas as doações são aprovadas automaticamente.

### Para Produção

Você precisa implementar:

1. **Criar Preferência de Pagamento** (backend)
2. **Redirecionar para Checkout Pro** ou usar **Checkout Bricks**
3. **Configurar Webhook** para receber notificações de pagamento
4. **Processar aprovação** chamando a função `process_payment_approval`

**Arquivo de referência**: `MERCADO_PAGO_INTEGRATION.md` (criar)

## 🎨 Componentes Personalizados

### Magic UI Components

- **RetroGrid**: Fundo animado com grade em perspectiva
- **NumberTicker**: Contador animado com efeito de spring
- **ShimmerButton**: Botão com efeito de brilho deslizante
- **Marquee**: Scroll horizontal infinito

### Componentes da Aplicação

- **Hero**: Seção principal com CTA
- **DonationCounter**: Contador de arrecadação em tempo real
- **DonorsList**: Lista dos últimos doadores
- **DonationModal**: Modal de doação com formulário
- **Footer**: Rodapé com informações do evento

## 🔒 Segurança

- ✅ Row Level Security (RLS) habilitado no Supabase
- ✅ Políticas de acesso configuradas
- ✅ Validação de dados no frontend e backend
- ✅ Proteção contra SQL Injection (via Supabase)

## 📱 Responsividade

O projeto é totalmente responsivo e funciona em:
- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large Screens (1440px+)

## 🐛 Solução de Problemas

### Erro: "Invalid API Key"
- Verifique se as credenciais do Supabase estão corretas no `.env`
- Certifique-se de usar `VITE_` como prefixo nas variáveis

### Erro: "Could not query the database for the schema cache"
**Este é um problema temporário do Supabase!**

Soluções:
1. **Aguarde 2-3 minutos** - O projeto está acordando
2. **Recarregue** com Ctrl+Shift+R (limpa cache do navegador)
3. **Acesse o Dashboard**: https://supabase.com/dashboard/project/xplsdoztojxmxvarrori
   - Vá em **Settings** → **Database**
   - Verifique se está "Active" (não "Paused")
4. **Última alternativa**: Pause e retome o projeto no Dashboard

O projeto está 100% configurado, é apenas o cold start do Supabase.

### Contador não atualiza automaticamente
- Verifique se o Realtime está habilitado nas tabelas
- Confira o console do navegador por erros de conexão WebSocket

### Doações não aparecem na lista
- Verifique se o status da transação está como `approved`
- Confirme que as políticas RLS estão configuradas

## 📝 Scripts Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint
```

## 🤝 Contribuindo

Este projeto foi desenvolvido especificamente para o evento.
Para sugestões ou melhorias, entre em contato com a organização.

## 📄 Licença

Este projeto é de uso exclusivo do evento "16º Culto de Ação de Graças".

---

**Desenvolvido com ❤️ para a glória de Deus**

🙏 Parque Savoy & Guarulhos • 2026
