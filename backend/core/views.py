from django.http import HttpResponse

def home(request):
    html = """
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diário de Tarefas — API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .container { max-width: 680px; width: 100%; }

    .header { text-align: center; margin-bottom: 40px; }
    .header .icon { font-size: 56px; margin-bottom: 16px; }
    .header h1 { font-size: 32px; font-weight: 700; color: #f1f5f9; }
    .header p { font-size: 15px; color: #64748b; margin-top: 8px; }

    .badge {
      display: inline-block;
      background: #052e16;
      color: #86efac;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 20px;
      margin-top: 12px;
    }

    .section { margin-bottom: 28px; }
    .section-title {
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 14px;
      overflow: hidden;
    }

    .endpoint {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      border-bottom: 1px solid #334155;
      text-decoration: none;
      transition: background 0.15s;
    }
    .endpoint:last-child { border-bottom: none; }
    .endpoint:hover { background: #263348; }

    .method {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      min-width: 44px;
      text-align: center;
    }
    .get  { background: #052e16; color: #86efac; }
    .post { background: #1e3a5f; color: #93c5fd; }
    .all  { background: #312e81; color: #a5b4fc; }

    .endpoint-info { flex: 1; }
    .endpoint-path { font-size: 14px; font-weight: 600; color: #cbd5e1; font-family: monospace; }
    .endpoint-desc { font-size: 12px; color: #64748b; margin-top: 2px; }

    .arrow { color: #475569; font-size: 16px; }

    .admin-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 18px;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 14px;
      text-decoration: none;
      transition: background 0.15s;
    }
    .admin-card:hover { background: #263348; border-color: #6366f1; }
    .admin-icon {
      width: 40px; height: 40px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
    }
    .admin-info h3 { font-size: 15px; font-weight: 600; color: #f1f5f9; }
    .admin-info p  { font-size: 12px; color: #64748b; margin-top: 2px; }

    .footer {
      text-align: center;
      margin-top: 32px;
      font-size: 12px;
      color: #334155;
    }
  </style>
</head>
<body>
<div class="container">

  <div class="header">
    <div class="icon">📋</div>
    <h1>Diário de Tarefas</h1>
    <p>Backend API — Django REST Framework</p>
    <span class="badge">✅ Servidor rodando</span>
  </div>

  <div class="section">
    <div class="section-title">Endpoints disponíveis</div>
    <div class="card">
      <a class="endpoint" href="/api/tarefas/" target="_blank">
        <span class="method get">GET</span>
        <div class="endpoint-info">
          <div class="endpoint-path">/api/tarefas/</div>
          <div class="endpoint-desc">Lista todas as tarefas (filtrar por ?data=YYYY-MM-DD)</div>
        </div>
        <span class="arrow">↗</span>
      </a>
      <a class="endpoint" href="/api/tarefas/" target="_blank">
        <span class="method post">POST</span>
        <div class="endpoint-info">
          <div class="endpoint-path">/api/tarefas/</div>
          <div class="endpoint-desc">Criar nova tarefa</div>
        </div>
        <span class="arrow">↗</span>
      </a>
      <a class="endpoint" href="/api/tarefas/1/" target="_blank">
        <span class="method all">PATCH</span>
        <div class="endpoint-info">
          <div class="endpoint-path">/api/tarefas/{id}/</div>
          <div class="endpoint-desc">Atualizar ou deletar uma tarefa</div>
        </div>
        <span class="arrow">↗</span>
      </a>
      <a class="endpoint" href="/api/chatbot/" target="_blank">
        <span class="method post">POST</span>
        <div class="endpoint-info">
          <div class="endpoint-path">/api/chatbot/</div>
          <div class="endpoint-desc">Chatbot IA — envia mensagem e recebe resposta</div>
        </div>
        <span class="arrow">↗</span>
      </a>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Administração</div>
    <a class="admin-card" href="/admin/" target="_blank">
      <div class="admin-icon">⚙️</div>
      <div class="admin-info">
        <h3>Django Admin</h3>
        <p>Gerenciar tarefas, usuários e banco de dados</p>
      </div>
      <span class="arrow" style="margin-left:auto; color:#6366f1">↗</span>
    </a>
  </div>

  <div class="footer">
    Frontend React rodando em
    <a href="http://localhost:3000" target="_blank" style="color:#6366f1">http://localhost:3000</a>
  </div>

</div>
</body>
</html>
"""
    return HttpResponse(html)
