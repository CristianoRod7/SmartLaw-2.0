from rest_framework.views import APIView
from rest_framework.response import Response
from .models import LegalUpdate
from .serializers import LegalUpdateSerializer
from .services import crawl_legal_news

class LegalUpdateListAPIView(APIView):
    def get(self, request):
        # 1. API 호출 시 실시간으로 긁어오기
        crawl_legal_news()
        
        # 2. DB에서 데이터 읽기
        updates = LegalUpdate.objects.all()[:6]
        serializer = LegalUpdateSerializer(updates, many=True)
        
        return Response({
            "status": "success",
            "data": serializer.data
        })