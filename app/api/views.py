from rest_framework.views import APIView
from rest_framework.response import Response
from .models import LegalUpdate
from .serializers import LegalUpdateSerializer
from .services import crawl_legal_news

class LegalUpdateListAPIView(APIView):
    def get(self, request):
        # 1. 요청 올 때마다 크롤링 실행 (실시간 업데이트)
        crawl_legal_news()
        
        # 2. DB에 저장된 최신 뉴스 6개 가져오기
        updates = LegalUpdate.objects.all()[:6]
        
        # 3. JSON으로 변환해서 리액트한테 던져주기
        serializer = LegalUpdateSerializer(updates, many=True)
        return Response({
            "status": "success",
            "data": serializer.data
        })