from rest_framework import serializers
from .models import LegalUpdate

class LegalUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalUpdate
        fields = '__all__' # DB의 모든 항목(ID, 제목, 내용 등)을 다 보내겠다는 뜻!