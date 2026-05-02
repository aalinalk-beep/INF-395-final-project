from django.contrib import admin
from .models import Destination

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'best_season', 'created_at']
    search_fields = ['name', 'location', 'description']
    ordering = ['name']