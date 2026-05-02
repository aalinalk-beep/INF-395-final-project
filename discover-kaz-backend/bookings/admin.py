# bookings/admin.py
from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'user_email', 'hotel_name', 'check_in', 'check_out', 'status', 'created_at']
    list_filter = ['status', 'check_in', 'check_out', 'created_at']
    search_fields = ['user__email', 'hotel__name', 'guest_name']
    list_editable = ['status']
    ordering = ['-created_at']
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    
    def hotel_name(self, obj):
        return obj.hotel.name
    hotel_name.short_description = 'Hotel'