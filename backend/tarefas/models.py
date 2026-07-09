from django.db import models

class Tarefa(models.Model):
    PRIORIDADE = [('baixa', 'Baixa'), ('media', 'Média'), ('alta', 'Alta')]

    texto = models.CharField(max_length=200)
    prioridade = models.CharField(max_length=10, choices=PRIORIDADE, default='media')
    concluida = models.BooleanField(default=False)
    data = models.DateField()
    criada_em = models.TimeField(auto_now_add=True)

    class Meta:
        ordering = ['-prioridade', 'concluida', 'criada_em']

    def __str__(self):
        return f"{self.data} | {self.texto}"
