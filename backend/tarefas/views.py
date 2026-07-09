from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .models import Tarefa
from .serializers import TarefaSerializer
import requests


class TarefaViewSet(viewsets.ModelViewSet):
    serializer_class = TarefaSerializer

    def get_queryset(self):
        data = self.request.query_params.get('data')
        qs = Tarefa.objects.all()
        if data:
            qs = qs.filter(data=data)
        return qs


@api_view(['POST'])
def chatbot(request):
    mensagem = request.data.get('mensagem', '').strip()
    tarefas_ctx = request.data.get('tarefas_contexto', '')

    if not mensagem:
        return Response({'erro': 'Mensagem vazia'}, status=status.HTTP_400_BAD_REQUEST)

    groq_key   = settings.GROQ_API_KEY
    openai_key = settings.OPENAI_API_KEY

    # Ignora chave padrão não configurada
    if groq_key in ('', 'sua-chave-groq-aqui'):
        groq_key = ''
    if openai_key in ('', 'sua-chave-openai-aqui'):
        openai_key = ''

    # Sem nenhuma chave válida → resposta offline
    if not groq_key and not openai_key:
        return Response({'resposta': resposta_offline(mensagem)})

    # Escolhe provedor: Groq tem prioridade por ser gratuito
    if groq_key:
        url    = 'https://api.groq.com/openai/v1/chat/completions'
        key    = groq_key
        model  = 'llama3-8b-8192'
    else:
        url    = 'https://api.openai.com/v1/chat/completions'
        key    = openai_key
        model  = 'gpt-3.5-turbo'

    system_prompt = (
        "Você é um assistente de produtividade pessoal e empresarial, amigável e motivador. "
        "Responda em português, de forma concisa (máximo 3 parágrafos curtos). "
        f"Contexto do usuário: {tarefas_ctx}"
    )

    try:
        resp = requests.post(
            url,
            headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
            json={
                'model': model,
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user',   'content': mensagem}
                ],
                'max_tokens': 300,
                'temperature': 0.8
            },
            timeout=15
        )
        data = resp.json()
        texto = data['choices'][0]['message']['content'].strip()
        return Response({'resposta': texto})
    except Exception:
        return Response({'resposta': resposta_offline(mensagem)})


def resposta_offline(msg):
    m = msg.lower()
    if 'motiv' in m:
        return '🔥 Cada tarefa concluída é um passo em direção ao seu objetivo! Foque no progresso, não na perfeição.'
    if 'produtiv' in m:
        return '⚡ Tente a técnica Pomodoro: 25 min de foco total, 5 min de pausa. Repita 4x!'
    if 'organiz' in m:
        return '📌 Priorize por urgência e importância. Comece sempre pelas tarefas de alta prioridade!'
    if 'ideia' in m:
        return '💡 Reserve 15 minutos hoje para planejar amanhã. Isso aumenta muito sua produtividade!'
    if 'cansad' in m or 'stress' in m:
        return '😌 Respire fundo. Faça uma pausa de 5 minutos, tome água e volte com energia renovada!'
    return '🤖 Configure OPENAI_API_KEY no arquivo .env para respostas personalizadas!'
