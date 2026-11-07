from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True, help_text="Email address")
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    academic_year = models.CharField(max_length=50, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
