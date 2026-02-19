# ⚙️ Configuração Completa do Projeto

## 1️⃣ Configurar Supabase

### Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha:
   - Nome: `culto-acao-gracas`
   - Database Password: (crie uma senha forte)
   - Region: South America (São Paulo)

### Executar SQL

1. Vá em **SQL Editor** no menu lateral
2. Copie todo o conteúdo do arquivo `supabase-setup.sql`
3. Cole e clique em **RUN**
4. Aguarde a execução (deve aparecer "Success")

### Habilitar Realtime

1. Vá em **Database** → **Replication**
2. Ative as tabelas:
   - ✅ `transactions`
   - ✅ `donors`

### Obter Credenciais

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://abc123.supabase.co`)
   - **anon public** key (ex: `eyJ...`)

---

## 2️⃣ Configurar Mercado Pago

### Criar Conta de Desenvolvedor

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Faça login ou crie uma conta
3. Vá em **Suas integrações**
4. Clique em **Criar aplicação**
5. Preencha:
   - Nome: `Culto Ação de Graças`
   - Produto: Pagamentos online

### Obter Credenciais de Teste

1. Vá em **Credenciais**
2. Em **Credenciais de teste**, copie:
   - **Public Key** (ex: `TEST-...`)
   - **Access Token** (ex: `TEST-...`)

---

## 3️⃣ Configurar Variáveis de Ambiente

### No Projeto Local

1. Copie `.env.example` para `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edite o arquivo `.env`:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
   VITE_MERCADO_PAGO_PUBLIC_KEY=TEST-sua-public-key
   ```

---

## 4️⃣ Instalar Supabase CLI

### Windows

```powershell
scoop install supabase
```

Ou baixe em: https://github.com/supabase/cli/releases

### Verificar Instalação

```bash
supabase --version
```

---

## 5️⃣ Deploy das Edge Functions

### Login no Supabase

```bash
supabase login
```

### Link com o Projeto

```bash
supabase link --project-ref seu-project-ref
```

**Como obter project-ref:**
- No Supabase Dashboard, vá em Settings → General
- Copie o "Reference ID"

### Configurar Secrets

```bash
supabase secrets set MERCADO_PAGO_ACCESS_TOKEN=TEST-seu-access-token
```

### Deploy das Functions

```bash
# Deploy da função de criar pagamento
supabase functions deploy criar-pagamento --no-verify-jwt

# Deploy da função de webhook
supabase functions deploy webhook-pagamento --no-verify-jwt
```

### Verificar Deploy

```bash
supabase functions list
```

Deve mostrar:
- ✅ `criar-pagamento`
- ✅ `webhook-pagamento`

---

## 6️⃣ Configurar Webhook no Mercado Pago

### Opção A: Usando o Dashboard do MP

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers/panel)
2. Vá em **Webhooks**
3. Clique em **Configurar webhook**
4. Preencha:
   - **URL de produção**: `https://seu-projeto.supabase.co/functions/v1/webhook-pagamento`
   - **Eventos**: Selecione `payment`
5. Salve

### Opção B: Usando MCP (mais fácil!)

Se você tem acesso ao MCP do Mercado Pago:

```bash
# Configurar webhook automaticamente
# (será feito via ferramentas MCP disponíveis)
```

---

## 7️⃣ Testar a Integração

### Criar Usuário de Teste

Use as ferramentas MCP ou crie manualmente:

```bash
# Via MCP - será criado automaticamente quando necessário
```

### Fazer Doação de Teste

1. Acesse `http://localhost:5176`
2. Clique em "Quero Contribuir"
3. Preencha:
   - Nome: `Teste`
   - Telefone: `11999999999`
   - Valor: `10,00`
4. Clique em "Continuar para Pagamento"
5. Você será redirecionado ao Mercado Pago
6. Use um cartão de teste:
   - Número: `5031 4332 1540 6351`
   - Nome: Qualquer
   - Validade: Qualquer data futura
   - CVV: `123`
   - CPF: `12345678909`

### Verificar Aprovação

1. Complete o pagamento
2. Você será redirecionado para `/sucesso`
3. Volte para a home
4. O contador deve ter atualizado automaticamente!
5. Seu nome deve aparecer na lista de doadores

---

## 8️⃣ Deploy do Frontend

### Vercel (Recomendado)

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em **Import Project**
4. Selecione o repositório
5. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_MERCADO_PAGO_PUBLIC_KEY`
6. Clique em **Deploy**

### Atualizar URLs no Mercado Pago

Após o deploy, atualize o webhook para a URL de produção:
- `https://seu-site.vercel.app`

---

## 9️⃣ Passar para Produção

### Quando estiver pronto:

1. **Mercado Pago:**
   - Solicite credenciais de produção
   - Atualize as variáveis de ambiente
   - Teste com pagamento real de R$ 1,00

2. **Supabase:**
   - Remova dados de teste:
     ```sql
     DELETE FROM transactions WHERE mercado_pago_id LIKE 'TEST-%';
     DELETE FROM donors;
     ```

3. **Edge Functions:**
   - Atualize os secrets com credenciais de produção:
     ```bash
     supabase secrets set MERCADO_PAGO_ACCESS_TOKEN=APP_USR-seu-token-producao
     ```

---

## 🆘 Problemas Comuns

### Edge Function não está funcionando

```bash
# Ver logs
supabase functions logs criar-pagamento
supabase functions logs webhook-pagamento
```

### Webhook não está recebendo notificações

1. Teste o webhook manualmente:
   ```bash
   curl -X POST https://seu-projeto.supabase.co/functions/v1/webhook-pagamento \
   -H "Content-Type: application/json" \
   -d '{"data":{"id":"123"}}'
   ```

2. Use as ferramentas MCP para simular webhook

### Pagamento aprovado mas não atualiza

1. Verifique logs do webhook
2. Confirme que a função SQL `process_payment_approval` existe
3. Teste manualmente no SQL Editor

---

## ✅ Checklist Final

- [ ] Supabase configurado
- [ ] SQL executado
- [ ] Realtime habilitado
- [ ] Mercado Pago configurado
- [ ] Edge Functions deployadas
- [ ] Webhook configurado
- [ ] Teste de doação realizado
- [ ] Aprovação funciona
- [ ] Contador atualiza
- [ ] Frontend deployado

---

## 🚀 Deploy em Produção

### 📦 Passo 1: Preparar o Projeto

Antes de fazer deploy, certifique-se de:

```bash
# 1. Testar build local
npm run build

# 2. Verificar se não há erros
npm run preview
```

### 🐙 Passo 2: Subir para o GitHub

#### 2.1. Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `landing-culto-acao-gracas` (ou nome de sua escolha)
3. **NÃO** marque "Initialize with README"
4. Clique em **"Create repository"**

#### 2.2. Inicializar Git e Fazer Push

```bash
# Inicializar repositório Git
git init

# Adicionar todos os arquivos (o .gitignore já está configurado)
git add .

# Criar primeiro commit
git commit -m "Initial commit: Landing Page Culto de Ação de Graças"

# Conectar com repositório remoto (substitua SEU-USUARIO)
git remote add origin https://github.com/fabiocastanhamelo/culto.git

# Fazer push para o GitHub
git branch -M main
git push -u origin main
```

**⚠️ IMPORTANTE:** O arquivo `.env` já está no `.gitignore` e **não será enviado** ao GitHub (correto para segurança).

### 🌐 Passo 3: Deploy na Vercel

#### 3.1. Criar Conta e Conectar

1. **Acesse:** https://vercel.com
2. Clique em **"Sign Up"**
3. **Continue with GitHub**
4. Autorize a Vercel a acessar seus repositórios

#### 3.2. Importar Projeto

1. No Dashboard da Vercel, clique em **"Add New Project"** ou **"Import Project"**
2. Selecione o repositório: `landing-culto-acao-gracas`
3. Clique em **"Import"**

#### 3.3. Configurar Variáveis de Ambiente

**Na tela de configuração do projeto:**

1. Expanda **"Environment Variables"**
2. Adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://xplsdoztojxmxvarrori.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
VITE_MERCADO_PAGO_PUBLIC_KEY=sua-public-key-aqui
```

**Como obter as chaves:**
- Supabase: Settings → API
- Mercado Pago: Developers → Credenciais

3. Certifique-se de que as variáveis estão marcadas para **Production**, **Preview** e **Development**

#### 3.4. Configurações do Build (Automático)

A Vercel detecta automaticamente:
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**Não precisa alterar nada!**

#### 3.5. Deploy

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos
3. ✅ **Pronto!** Seu site estará no ar

A Vercel fornecerá uma URL como:
```
https://landing-culto-acao-gracas.vercel.app
```

### 🔄 Passo 4: Atualizar URLs de Produção

#### 4.1. Atualizar Webhook do Mercado Pago

Como o webhook já está configurado para o Supabase, não precisa atualizar! ✅

O webhook continuará sendo:
```
https://xplsdoztojxmxvarrori.supabase.co/functions/v1/webhook-pagamento
```

#### 4.2. Testar em Produção

1. Acesse sua URL da Vercel
2. Faça uma doação de teste (R$ 1,00 com cartão real OU use credenciais de teste)
3. Verifique se:
   - ✅ Redirecionamento funciona
   - ✅ Contador atualiza em tempo real
   - ✅ Doação aparece no banco

### 🔁 Passo 5: Atualizações Futuras

Sempre que fizer alterações no código:

```bash
# 1. Fazer commit das mudanças
git add .
git commit -m "Descrição das mudanças"

# 2. Enviar para GitHub
git push origin main

# 3. A Vercel faz deploy automático! 🚀
```

### 🌍 Passo 6: Domínio Personalizado (Opcional)

#### Usar Domínio Próprio

1. Na Vercel, vá em **Settings** → **Domains**
2. Clique em **"Add Domain"**
3. Digite seu domínio: `doacoes.suaigreja.com.br`
4. Configure DNS conforme instruções da Vercel

**Configuração DNS típica:**
```
Tipo: CNAME
Nome: doacoes (ou @)
Valor: cname.vercel-dns.com
```

5. Aguarde propagação DNS (até 48h, geralmente 1-2h)
6. ✅ SSL automático via Let's Encrypt

### 📊 Passo 7: Monitoramento

#### Vercel Analytics (Grátis)

1. Na Vercel, vá em **Analytics**
2. Veja métricas de:
   - Visitantes
   - Performance
   - Países de acesso

#### Logs das Edge Functions

```bash
# Ver logs em tempo real
supabase functions logs criar-pagamento --tail
supabase functions logs webhook-pagamento --tail
```

Ou no Dashboard: https://supabase.com/dashboard/project/xplsdoztojxmxvarrori/logs/edge-functions

### 🔒 Passo 8: Segurança em Produção

#### 8.1. Credenciais de Produção do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **Credenciais** → **Credenciais de produção**
3. **Solicite ativação** se ainda não estiver aprovada
4. Copie as credenciais de **PRODUÇÃO** (começam com `APP_USR-`)
5. Atualize na Vercel:
   - Settings → Environment Variables
   - Edite `VITE_MERCADO_PAGO_PUBLIC_KEY`
   - Cole a Public Key de produção
6. Atualize no Supabase (Edge Functions):
   ```bash
   supabase secrets set MERCADO_PAGO_ACCESS_TOKEN="APP_USR-seu-token-producao"
   ```

#### 8.2. Limpar Dados de Teste (Opcional)

```sql
-- Execute no SQL Editor do Supabase
DELETE FROM transactions WHERE mercado_pago_id LIKE 'TEST-%';
DELETE FROM transactions WHERE mercado_pago_id LIKE 'PIX-TEST-%';
DELETE FROM transactions WHERE mercado_pago_id LIKE 'SIMULADO-%';
DELETE FROM donors WHERE phone = '11999999999';
```

### 🎯 Checklist de Deploy

- [ ] Build local funciona (`npm run build`)
- [ ] Código no GitHub
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy concluído com sucesso
- [ ] Site acessível via URL da Vercel
- [ ] Teste de doação em produção
- [ ] Redirecionamento funciona
- [ ] Contador atualiza em tempo real
- [ ] Webhook do MP funcionando
- [ ] Credenciais de produção configuradas (se aplicável)
- [ ] Domínio personalizado configurado (opcional)

### 💰 Custos

**ZERO para começar!** 🎉

- **Vercel Free:**
  - 100GB bandwidth/mês
  - Deploy ilimitado
  - SSL grátis
  - Analytics básico

- **Supabase Free:**
  - 500MB banco de dados
  - 2GB bandwidth/mês
  - Realtime incluído
  - Edge Functions incluídas

**Quando escalar:**
- Vercel Pro: $20/mês (1TB bandwidth)
- Supabase Pro: $25/mês (8GB DB)

### 🆘 Troubleshooting de Deploy

#### Deploy falha na Vercel

```bash
# Testar build localmente primeiro
npm run build

# Se houver erro, corrija e faça push
git add .
git commit -m "Fix build errors"
git push origin main
```

#### Variáveis de ambiente não funcionam

1. Verifique se começam com `VITE_`
2. Recrie o deploy: Vercel Dashboard → Deployments → ⋮ → Redeploy

#### Site carrega mas não conecta com Supabase

1. Verifique CORS no Supabase
2. Confirme que as variáveis estão corretas
3. Teste a conexão:
   ```javascript
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
   ```

---

**Pronto! Seu sistema está 100% funcional e pronto para produção! 🎉**
