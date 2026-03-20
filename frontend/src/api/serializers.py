from rest_framework import serializers
from .models import LegalUpdate

class LegalUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalUpdate
        fields = '__all__' # 모든 필드를 JSON으로 변환