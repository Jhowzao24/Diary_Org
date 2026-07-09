@echo off
title Diario de Tarefas - Iniciando...
color 0A

echo.
echo  ============================================
echo   DIARIO DE TAREFAS - Iniciando servidores
echo  ============================================
echo.

REM ── Verifica Python ──────────────────────────
python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERRO] Python nao encontrado! Instale em python.org
    pause
    exit
)

REM ── Verifica Node ────────────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    echo  [ERRO] Node.js nao encontrado! Instale em nodejs.org
    pause
    exit
)

REM ── Verifica se .env tem chave configurada ───
findstr /C:"sua-chave-groq-aqui" "%~dp0backend\.env" >nul 2>&1
if not errorlevel 1 (
    echo.
    echo  [AVISO] Chave de IA nao configurada!
    echo  Abrindo o arquivo .env para voce colar sua chave...
    echo.
    echo  - Groq GRATUITO: https://console.groq.com
    echo  - OpenAI PAGO:   https://platform.openai.com/api-keys
    echo.
    echo  Edite o arquivo que vai abrir, salve e feche.
    pause
    notepad "%~dp0backend\.env"
    echo.
    echo  Continuando inicializacao...
    echo.
)

REM ── Instala dependencias Python se necessario ─
if not exist "%~dp0backend\db.sqlite3" (
    echo  [INFO] Primeira execucao - configurando banco de dados...
    cd /d "%~dp0backend"
    pip install -r requirements.txt -q
    python manage.py migrate --run-syncdb >nul 2>&1
    echo  [OK] Banco de dados configurado!
    echo.
)

REM ── Instala dependencias Node se necessario ──
if not exist "%~dp0frontend\node_modules" (
    echo  [INFO] Primeira execucao - instalando dependencias React...
    cd /d "%~dp0frontend"
    npm install --silent
    echo  [OK] Dependencias instaladas!
    echo.
)

REM ── Inicia Django ─────────────────────────────
echo  [1/2] Iniciando Backend Django em http://localhost:8000 ...
start "Backend - Django" cmd /k "color 0B && title Backend Django && cd /d %~dp0backend && python manage.py runserver"

timeout /t 2 /nobreak >nul

REM ── Inicia React ──────────────────────────────
echo  [2/2] Iniciando Frontend React em http://localhost:3000 ...
start "Frontend - React" cmd /k "color 0D && title Frontend React && cd /d %~dp0frontend && npm start"

echo.
echo  ============================================
echo   Servidores iniciados com sucesso!
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo  ============================================
echo.
echo  O navegador abrira automaticamente em instantes...
echo  Para encerrar, feche as janelas do Django e React.
echo.
pause
