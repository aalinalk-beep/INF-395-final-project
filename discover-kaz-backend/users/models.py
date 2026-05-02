# users/models.py
import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager


class CustomUser(AbstractUser):
    # Убираем username, так как будем использовать email для входа
    username = None

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField('email address', unique=True)
    name = models.CharField(max_length=255, blank=True)

    # Указываем, что поле email будет использоваться для логина
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']  # Поля, обязательные при создании суперпользователя

    objects = CustomUserManager()

    def __str__(self):
        return self.email