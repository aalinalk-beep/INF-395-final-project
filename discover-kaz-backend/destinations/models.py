# destinations/models.py
import uuid
from django.db import models

class Destination(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    long_description = models.TextField(blank=True)
    image_url = models.CharField(max_length=500, blank=True)  # Relative path: images/destination1.png
    gallery_urls = models.JSONField(default=list)  # List of relative paths
    location = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    best_season = models.CharField(max_length=100, blank=True)
    transport_options = models.TextField(blank=True)
    highlights = models.JSONField(default=list) # Для хранения списка фич
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name