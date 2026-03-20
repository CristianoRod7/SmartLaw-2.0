from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # api 앱의 주소를 프로젝트에 연결!
    path('api/v1/', include('api.urls')), 
]