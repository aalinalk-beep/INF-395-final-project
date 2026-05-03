"""
URL configuration for discover_kaz_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/hotels/', include('hotels.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/destinations/', include('destinations.urls')),
    path('api/events/', include('events.urls')),
]

# Serve media files in deployment
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)