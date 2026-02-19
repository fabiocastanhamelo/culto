@echo off
echo ========================================
echo  Deploy das Credenciais do Supabase
echo ========================================
echo.

set SUPABASE_ACCESS_TOKEN=sbp_875aba5b51e092d6a7666f908a6709675c7bb08d
call npx supabase secrets set --env-file .env

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo  ERRO AO DEPLOYAR CREDENCIAIS
    echo ========================================
    echo.
    echo Tente novamente ou verifique o token.
    pause
) else (
    echo.
    echo ========================================
    echo  CREDENCIAIS ATUALIZADAS COM SUCESSO!
    echo ========================================
    echo.
    echo Agora o Mercado Pago deve funcionar em Producao.
    pause
)
