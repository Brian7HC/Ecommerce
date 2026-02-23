"""
Main URL Configuration for CR7 Store
"""

from django.urls import path, include

urlpatterns = [
    path('api/', include('api.urls')),
]