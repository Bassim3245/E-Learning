from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = "Seed demo admin and student accounts for testing"

    def handle(self, *args, **options):
        # Create Admin
        admin_user, created_admin = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@elearning.local',
                'first_name': 'System',
                'last_name': 'Administrator',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created_admin:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Created demo Admin: admin / admin123"))
        else:
            self.stdout.write("Admin user already exists.")

        # Create Student
        student_user, created_student = User.objects.get_or_create(
            username='student',
            defaults={
                'email': 'student@elearning.local',
                'first_name': 'Alex',
                'last_name': 'Johnson',
                'role': User.Role.STUDENT,
                'academic_year': '3rd Year Computer Science',
                'phone_number': '+1 555 019 283',
            }
        )
        if created_student:
            student_user.set_password('student123')
            student_user.save()
            self.stdout.write(self.style.SUCCESS("Created demo Student: student / student123"))
        else:
            self.stdout.write("Student user already exists.")

