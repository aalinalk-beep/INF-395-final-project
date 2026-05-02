from django.contrib import admin
from .models import Hotel, Review

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'price_per_night', 'rating', 'created_at']
    list_filter = ['city', 'rating', 'created_at']
    search_fields = ['name', 'location', 'description', 'city']
    ordering = ['-rating', 'name']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'user_email', 'hotel_name', 'rating', 'title', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['user__email', 'hotel__name', 'title', 'content']
    ordering = ['-created_at']
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    
    def hotel_name(self, obj):
        return obj.hotel.name
    hotel_name.short_description = 'Hotel'