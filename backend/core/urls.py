from django.urls import path, include
from django.contrib import admin
from .views import home

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/', include('tarefas.urls')),
]
