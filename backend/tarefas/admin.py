from django.contrib import admin
from .models import Tarefa

@admin.register(Tarefa)
class TarefaAdmin(admin.ModelAdmin):
    list_display = ('texto', 'prioridade', 'concluida', 'data', 'criada_em')
    list_filter = ('prioridade', 'concluida', 'data')
    search_fields = ('texto',)
    ordering = ('-data', 'concluida')
