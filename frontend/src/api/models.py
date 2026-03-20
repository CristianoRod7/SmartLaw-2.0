from django.db import models

class LegalUpdate(models.Model):
    category = models.CharField(max_length=50) 
    tag = models.CharField(max_length=20)      
    title = models.CharField(max_length=200, unique=True) # 중복 저장 방지
    summary = models.TextField()
    impact = models.CharField(max_length=200)  
    link = models.URLField(max_length=500)     
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title