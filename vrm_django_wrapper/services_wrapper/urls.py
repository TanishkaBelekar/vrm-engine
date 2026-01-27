from django.urls import path
from . import views

urlpatterns = [
    path('rules/', views.scoring_rules, name='scoring_rules'),
    path('score/', views.scoring_view, name='scoring'),
    path('validate/', views.validation_view, name='validation'),
]
