# destinations/views.py
from rest_framework import viewsets, permissions
from .models import Destination
from .serializers import DestinationSerializer

class DestinationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для просмотра списка и одного направления.
    """
    queryset = Destination.objects.all().order_by('-created_at')
    serializer_class = DestinationSerializer
    permission_classes = [permissions.AllowAny]