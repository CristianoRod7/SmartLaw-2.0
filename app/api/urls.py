from django.urls import path
from .views import LegalUpdateListAPIView

urlpatterns = [
    # http://localhost:8000/api/v1/legal-updates/ 주소를 만듦
    path('legal-updates/', LegalUpdateListAPIView.as_view(), name='legal-updates'),
]