# bookings/models.py
import uuid
from django.db import models
from django.conf import settings


class Booking(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    hotel = models.ForeignKey('hotels.Hotel', on_delete=models.CASCADE, related_name='bookings')

    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    guest_name = models.CharField(max_length=255)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=20, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def user_id(self):
        return self.user.id

    @property
    def hotel_id(self):
        return self.hotel.id

    def __str__(self):
        return f'Booking {self.id} for {self.hotel.name} by {self.user.email}'