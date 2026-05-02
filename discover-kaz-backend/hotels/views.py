# hotels/views.py
from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Hotel, Review
from .serializers import HotelSerializer, ReviewSerializer


class HotelViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для просмотра отелей и их отзывов.
    """
    queryset = Hotel.objects.all().order_by('name')
    serializer_class = HotelSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        hotel = self.get_object()
        reviews = hotel.reviews.all().order_by('-created_at')
        # Используем пагинацию для отзывов
        page = self.paginate_queryset(reviews)
        if page is not None:
            serializer = ReviewSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class ReviewCreateView(generics.CreateAPIView):
    """
    Эндпоинт для создания нового отзыва.
    Требует аутентификации.
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print(f"📝 Review create - User: {request.user.email}")
        print(f"📝 Review data: {request.data}")
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        # Привязываем отзыв к текущему пользователю
        serializer.save(user=self.request.user)