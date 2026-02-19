# 💳 Integração com Mercado Pago (Simplificada)

Este projeto tem acesso direto ao MCP do Mercado Pago, facilitando muito a integração.

## 🚀 Configuração Rápida

### 1. Obter suas Credenciais

Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers/panel) e obtenha:
- **Public Key** (começa com `APP_USR-` ou `TEST-`)
- **Access Token** (começa com `APP_USR-` ou `TEST-`)

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env`:

```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
VITE_MERCADO_PAGO_PUBLIC_KEY=sua_public_key
```

### 3. Criar Usuários de Teste

Para testar pagamentos, você precisa de usuários de teste. Use o MCP:

```bash
# O sistema criará automaticamente usuários de teste quando necessário
```

## 🔧 Fluxo de Integração Completo

### Opção 1: Usar Supabase Edge Function (Recomendado)

Vou criar uma Edge Function otimizada que usa o MCP do Mercado Pago.

### Opção 2: Backend Próprio

Se você tiver seu próprio backend, pode integrar diretamente.

## 📝 Próximos Passos

Vou criar os arquivos necessários para você:

1. Edge Function para criar preferências de pagamento
2. Edge Function para processar webhooks
3. Componente React atualizado
4. Instruções de deploy das functions

Quer que eu crie essa estrutura completa agora?
