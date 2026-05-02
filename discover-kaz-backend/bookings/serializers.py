# bookings/serializers.py
from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source='user.id', read_only=True)
    hotel_id = serializers.UUIDField(source='hotel.id')

    class Meta:
        model = Booking
        fields = [
            'id', 'user_id', 'hotel_id', 'check_in', 'check_out',
            'guests', 'total_price', 'status', 'guest_name', 'guest_email',
            'guest_phone', 'created_at'
        ]
        read_only_fields = ('status', 'user_id', 'created_at')

    def create(self, validated_data):
        hotel_id = validated_data.pop('hotel')['id']
        booking = Booking.objects.create(hotel_id=hotel_id, **validated_data)
        return booking

class BookingCancelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'status']
        read_only_fields = ['id', 'status']