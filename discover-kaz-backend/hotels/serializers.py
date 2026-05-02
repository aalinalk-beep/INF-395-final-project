# hotels/serializers.py
from rest_framework import serializers
from .models import Hotel, Review

class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    # Добавляем поля из property модели, которые требует фронтенд
    user_email = serializers.EmailField(read_only=True)
    user_id = serializers.UUIDField(read_only=True)
    hotel_id = serializers.UUIDField(read_only=True)

    class Meta:
        model = Review
        # 'user' и 'hotel' нужны для создания, но не всегда для отображения
        # Мы их укажем как write_only, чтобы они не дублировались с user_id/hotel_id
        fields = [
            'id', 'user_id', 'hotel_id', 'user_email', 'rating', 'title',
            'content', 'helpful_count', 'image_urls', 'created_at', 'updated_at',
            'user', 'hotel'
        ]
        extra_kwargs = {
            'user': {'write_only': True, 'required': False},
            'hotel': {'write_only': True}
        }