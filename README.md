# Adaptive E-Learning Platform using Student Facial Expressions and Feedback

**Architecture:** Pure Python Django MVC (Model - Template - View)  
**Database:** SQLite (`db.sqlite3`)  
**Frontend:** Django Templates + Bootstrap 5.3 + Bootstrap Icons

---

## 🌟 Overview

This project implements the foundational user authentication and role management system for the **Adaptive E-Learning Platform using Student Facial Expressions and Feedback**.

Strictly following the **MVC (MTV) pattern** (no REST API / no DRF), the application provides:
- **Registration & Account Creation:** Supports registering as either **Student** or **Admin**.
- **User Authentication:** Login and Logout using username or email and password.
- **Role-Based Portals:**
  - **Student Portal:** Personalized dashboard displaying student information (username, email, academic year, phone), profile edit form, and a preview of the upcoming webcam-based facial emotion detection module (confused, bored, focused, happy).
  - **Admin Dashboard:** Administrative portal displaying registered user counts, student vs admin breakdowns, a search & role filter bar, and complete user listing.
- **Django Admin Access:** Full backend administration at `/django-admin/`.

---

## 🚀 How to Run the Server

From the project root directory:

```powershell
#install env
python -m venv env

# Activate the environment (optional if invoking directly)
.\env\Scripts\activate
#install dependencies
pip install -r requirements.txt

# Run database migrations
.\env\Scripts\python.exe manage.py migrate

# (Optional) Seed demo users if not already done:
.\env\Scripts\python.exe manage.py seed_demo_users

# Start the Django development server
.\env\Scripts\python.exe manage.py runserver
```

Open your browser and navigate to:
👉 **http://127.0.0.1:8000/**

---

## 🔑 Pre-seeded Demo Accounts

For instant testing, two accounts have been pre-created:

| Role | Username | Password | Email | Dashboard Route |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | `admin@elearning.local` | `/admin-portal/dashboard/` |
| **Student** | `student` | `student123` | `student@elearning.local` | `/student/dashboard/` |

---

## 📂 Project Structure (MVC)

```text
E-Learning/
│
├── elearning_platform/          # Django Project Configuration
│   ├── settings.py              # Configuration & Custom User Model registration
│   ├── urls.py                  # Main URL router
│   └── wsgi.py
│
├── accounts/                    # Accounts & Auth App (MVC)
│   ├── models.py                # Model: Custom User model with Role (STUDENT / ADMIN)
│   ├── forms.py                 # Forms: UserRegisterForm, UserLoginForm, UserProfileUpdateForm
│   ├── views.py                 # Views: Controller logic for Register, Login, Logout, Dashboards
│   ├── urls.py                  # App URL routing
│   ├── admin.py                 # Django Admin integration
│   ├── tests.py                 # Automated unit tests
│   └── management/commands/     # Seed command (seed_demo_users)
│
├── templates/                   # Views / HTML Templates (Presentation)
│   ├── base.html                # Main master template with Navbar, alerts, footer
│   └── accounts/
│       ├── home.html            # Platform landing page
│       ├── login.html           # Login page
│       ├── register.html        # Register page with Student/Admin role selector
│       ├── student_dashboard.html # Student portal & emotion engine preview
│       └── admin_dashboard.html   # Admin user management & analytics
│
├── manage.py                    # Django CLI entrypoint
└── db.sqlite3                   # Database
```

