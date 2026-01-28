from django.urls import path
from . import views

from django.urls import path
from . import views
from django.urls import path
from . import views

urlpatterns = [
    path('score/', views.scoring_view, name='score'),
    path('validate/', views.validation_view, name='validate'),
    path('rules/', views.scoring_rules, name='rules'),


    path('test-submit/', views.test_vendor_submit, name='test_vendor_submit'),
]
