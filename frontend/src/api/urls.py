from django.urls import path
from .views import LegalUpdateListAPIView

urlpatterns = [
    path('legal-updates/', LegalUpdateListAPIView.as_view(), name='legal-updates'),
]