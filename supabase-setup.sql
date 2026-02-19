-- ================================================
-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS SUPABASE
-- 16º Culto de Ação de Graças - Landing Page
-- ================================================

-- 1. CRIAR TABELA DE TRANSAÇÕES
-- Armazena todas as transações de pagamento (pendentes e aprovadas)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mercado_pago_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'cancelled'
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  donor_name VARCHAR(255) NOT NULL,
  donor_phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_phone ON public.transactions(donor_phone);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- 2. CRIAR TABELA DE DOADORES
-- Armazena o total acumulado por doador (baseado no telefone)
CREATE TABLE IF NOT EXISTS public.donors (
  phone VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  total_donated DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (total_donated >= 0),
  donation_count INTEGER NOT NULL DEFAULT 0,
  first_donation_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_donation_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índice para ordenação por total doado
CREATE INDEX IF NOT EXISTS idx_donors_total_donated ON public.donors(total_donated DESC);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICAS DE ACESSO (POLICIES)
-- Permitir leitura pública das transações aprovadas
CREATE POLICY "Permitir leitura de transações aprovadas"
  ON public.transactions
  FOR SELECT
  USING (status = 'approved');

-- Permitir inserção de novas transações (para criar doações)
CREATE POLICY "Permitir inserção de transações"
  ON public.transactions
  FOR INSERT
  WITH CHECK (true);

-- Permitir leitura pública dos doadores
CREATE POLICY "Permitir leitura de doadores"
  ON public.donors
  FOR SELECT
  USING (true);

-- Permitir inserção e atualização de doadores (para acumular doações)
CREATE POLICY "Permitir inserção de doadores"
  ON public.donors
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de doadores"
  ON public.donors
  FOR UPDATE
  USING (true);

-- 5. CRIAR FUNÇÃO PARA ATUALIZAR O CAMPO updated_at AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. CRIAR TRIGGER PARA ATUALIZAR updated_at EM TRANSACTIONS
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. CRIAR FUNÇÃO PARA PROCESSAR APROVAÇÃO DE PAGAMENTO
-- Esta função deve ser chamada quando um pagamento for aprovado (via webhook)
CREATE OR REPLACE FUNCTION process_payment_approval(
  p_transaction_id UUID,
  p_mercado_pago_id VARCHAR
)
RETURNS VOID AS $$
DECLARE
  v_transaction RECORD;
  v_existing_donor RECORD;
BEGIN
  -- Buscar a transação
  SELECT * INTO v_transaction
  FROM public.transactions
  WHERE id = p_transaction_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transação não encontrada: %', p_transaction_id;
  END IF;

  -- Atualizar status da transação
  UPDATE public.transactions
  SET 
    status = 'approved',
    mercado_pago_id = p_mercado_pago_id,
    updated_at = TIMEZONE('utc'::text, NOW())
  WHERE id = p_transaction_id;

  -- Verificar se o doador já existe
  SELECT * INTO v_existing_donor
  FROM public.donors
  WHERE phone = v_transaction.donor_phone;

  IF FOUND THEN
    -- Atualizar doador existente (ACUMULAR)
    UPDATE public.donors
    SET 
      name = v_transaction.donor_name,
      total_donated = total_donated + v_transaction.amount,
      donation_count = donation_count + 1,
      last_donation_at = TIMEZONE('utc'::text, NOW())
    WHERE phone = v_transaction.donor_phone;
  ELSE
    -- Criar novo doador
    INSERT INTO public.donors (phone, name, total_donated, donation_count)
    VALUES (
      v_transaction.donor_phone,
      v_transaction.donor_name,
      v_transaction.amount,
      1
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 8. CRIAR FUNÇÃO PARA OBTER ESTATÍSTICAS
CREATE OR REPLACE FUNCTION get_donation_stats()
RETURNS JSON AS $$
DECLARE
  v_stats JSON;
BEGIN
  SELECT json_build_object(
    'total_amount', COALESCE(SUM(total_donated), 0),
    'donor_count', COUNT(*),
    'average_donation', COALESCE(AVG(total_donated), 0),
    'last_update', NOW()
  ) INTO v_stats
  FROM public.donors;
  
  RETURN v_stats;
END;
$$ LANGUAGE plpgsql;

-- 9. HABILITAR REALTIME PARA AS TABELAS
-- Execute este comando no Dashboard do Supabase > Database > Replication
-- ou use o código abaixo:

ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donors;

-- ================================================
-- DADOS DE TESTE (OPCIONAL - REMOVER EM PRODUÇÃO)
-- ================================================

-- Inserir transações de teste
INSERT INTO public.transactions (status, amount, donor_name, donor_phone, mercado_pago_id)
VALUES 
  ('approved', 100.00, 'João Silva', '11999999999', 'MP-TEST-001'),
  ('approved', 50.00, 'Maria Santos', '11988888888', 'MP-TEST-002'),
  ('approved', 200.00, 'Pedro Oliveira', '11977777777', 'MP-TEST-003'),
  ('approved', 75.00, 'Ana Costa', '11966666666', 'MP-TEST-004'),
  ('approved', 150.00, 'João Silva', '11999999999', 'MP-TEST-005'); -- Segunda doação do João

-- Processar doadores de teste
SELECT process_payment_approval(id, mercado_pago_id)
FROM public.transactions
WHERE mercado_pago_id LIKE 'MP-TEST-%';

-- ================================================
-- CONSULTAS ÚTEIS
-- ================================================

-- Ver total arrecadado
-- SELECT SUM(total_donated) as total_arrecadado FROM public.donors;

-- Ver ranking de doadores
-- SELECT name, total_donated, donation_count 
-- FROM public.donors 
-- ORDER BY total_donated DESC 
-- LIMIT 10;

-- Ver últimas transações aprovadas
-- SELECT donor_name, amount, created_at 
-- FROM public.transactions 
-- WHERE status = 'approved' 
-- ORDER BY created_at DESC 
-- LIMIT 20;

-- Ver estatísticas completas
-- SELECT * FROM get_donation_stats();

-- ================================================
-- INSTRUÇÕES DE USO
-- ================================================
-- 1. Copie todo este SQL
-- 2. Acesse seu projeto no Supabase Dashboard
-- 3. Vá em "SQL Editor" no menu lateral
-- 4. Cole o código e clique em "RUN"
-- 5. Configure as variáveis de ambiente no seu projeto React
-- 6. Para produção, remova os dados de teste
-- ================================================
