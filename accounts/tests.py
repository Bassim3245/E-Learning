from django.test import TestCase, Client
from django.urls import reverse
from accounts.models import User


class AccountsMVCTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.student_user = User.objects.create_user(
            username='student1',
            email='student1@example.com',
            password='password123',
            first_name='Alice',
            last_name='Smith',
            role=User.Role.STUDENT,
            academic_year='2nd Year'
        )
        self.admin_user = User.objects.create_user(
            username='admin1',
            email='admin1@example.com',
            password='adminpassword123',
            first_name='Bob',
            last_name='Admin',
            role=User.Role.ADMIN
        )

    def test_home_page_loads(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Adaptive E-Learning Platform')

    def test_student_registration(self):
        response = self.client.post(reverse('register'), {
            'role': User.Role.STUDENT,
            'username': 'newstudent',
            'first_name': 'Charlie',
            'last_name': 'Brown',
            'email': 'charlie@example.com',
            'phone_number': '123456789',
            'academic_year': '1st Year',
            'password': 'secretpassword',
            'confirm_password': 'secretpassword',
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(username='newstudent').exists())
        user = User.objects.get(username='newstudent')
        self.assertEqual(user.role, User.Role.STUDENT)
        self.assertFalse(user.is_staff)

    def test_admin_registration(self):
        response = self.client.post(reverse('register'), {
            'role': User.Role.ADMIN,
            'username': 'newadmin',
            'first_name': 'Diana',
            'last_name': 'Prince',
            'email': 'diana@example.com',
            'phone_number': '987654321',
            'academic_year': '',
            'password': 'adminpassword',
            'confirm_password': 'adminpassword',
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(username='newadmin').exists())
        admin_user = User.objects.get(username='newadmin')
        self.assertEqual(admin_user.role, User.Role.ADMIN)
        self.assertTrue(admin_user.is_staff)

    def test_login_with_username_and_role_redirect(self):
        # Student login
        response = self.client.post(reverse('login'), {
            'username_or_email': 'student1',
            'password': 'password123'
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'accounts/student_dashboard.html')

        # Logout
        self.client.get(reverse('logout'))

        # Admin login
        response = self.client.post(reverse('login'), {
            'username_or_email': 'admin1',
            'password': 'adminpassword123'
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'accounts/admin_dashboard.html')

    def test_login_with_email(self):
        response = self.client.post(reverse('login'), {
            'username_or_email': 'student1@example.com',
            'password': 'password123'
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'accounts/student_dashboard.html')

    def test_student_restricted_from_admin_dashboard(self):
        self.client.login(username='student1', password='password123')
        response = self.client.get(reverse('admin_dashboard'), follow=True)
        # Should redirect student away from admin dashboard
        self.assertTemplateUsed(response, 'accounts/student_dashboard.html')
        self.assertContains(response, 'Access restricted')

    def test_admin_dashboard_user_list(self):
        self.client.login(username='admin1', password='adminpassword123')
        response = self.client.get(reverse('admin_dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'student1')
        self.assertContains(response, 'admin1')
