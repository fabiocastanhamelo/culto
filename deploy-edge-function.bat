@echo off
echo ========================================
echo  Deploy da Edge Function - Mercado Pago
echo ========================================
echo.
echo Fazendo deploy da funcao criar-pagamento...
echo.

cd /d "%~dp0"

REM Tentar com npx supabase
npx supabase functions deploy criar-pagamento --no-verify-jwt

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo  ERRO AO FAZER DEPLOY VIA CLI
    echo ========================================
    echo.
    echo Por favor, faca o deploy manualmente via Dashboard:
    echo 1. Acesse: https://supabase.com/dashboard/project/xplsdoztojxmxvarrori/functions
    echo 2. Clique em "criar-pagamento"
    echo 3. Clique nos 3 pontinhos e selecione "Redeploy"
    echo.
    pause
) else (
    echo.
    echo ========================================
    echo  DEPLOY CONCLUIDO COM SUCESSO!
    echo ========================================
    echo.
    echo Agora as proximas doacoes vao redirecionar corretamente!
    echo.
    pause
)
