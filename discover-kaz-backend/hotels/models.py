# hotels/models.py
import uuid
from django.db import models
from django.conf import settings  # Для связи с CustomUser


class Hotel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image_url = models.CharField(max_length=500, blank=True)  # Relative path: images/hotel1.png
    gallery_urls = models.JSONField(default=list)  # List of relative paths
    location = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    city = models.CharField(max_length=100)
    amenities = models.JSONField(default=list)
    rating = models.FloatField(default=0.0)
    total_reviews = models.IntegerField(default=0)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    available_rooms = models.IntegerField(default=0)
    tier = models.CharField(max_length=20, choices=[('Luxury', 'Luxury'), ('Standard', 'Standard')], default='Standard')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField()
    title = models.CharField(max_length=255)
    content = models.TextField()
    helpful_count = models.IntegerField(default=0)
    image_urls = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Для отображения email в API контракте
    @property
    def user_email(self):
        return self.user.email

    # Для отображения ID в API контракте (если потребуется)
    @property
    def user_id(self):
        return self.user.id

    @property
    def hotel_id(self):
        return self.hotel.id

    def __str__(self):
        return f'Review by {self.user.email} for {self.hotel.name}'