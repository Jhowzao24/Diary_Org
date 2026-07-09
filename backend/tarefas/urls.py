from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TarefaViewSet, chatbot

router = DefaultRouter()
router.register(r'tarefas', TarefaViewSet, basename='tarefa')

urlpatterns = [
    path('', include(router.urls)),
    path('chatbot/', chatbot),
]
