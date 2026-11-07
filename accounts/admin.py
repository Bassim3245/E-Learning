from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'academic_year', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)

    fieldsets = UserAdmin.fieldsets + (
        ('Extra Information', {
            'fields': ('phone_number', 'academic_year', 'bio')
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Extra Information', {
            'fields': ('email', 'first_name', 'last_name', 'phone_number', 'academic_year', 'bio')
        }),
    )
