# Planet Code

An online learning platform built with Django. This is a personal project to practice full-stack web development.

> Work in progress — frontend and static pages are being built. Backend coming next.

---

## Features (So Far)

- Homepage with latest courses (static)
- All courses page with category filters and sorting
- Course detail page with syllabus accordion and free lessons
- Shopping cart UI with quantity management
- Dark/light theme toggle
- Fully responsive layout (mobile-first)

---

## Technologies Used

- Python 3.10
- Django 5.2
- Bootstrap 5
- Vanilla JavaScript
- SQLite (development)
- Git & GitHub

---

## Installation & Setup

```bash
git clone https://github.com/rezaziaei28/planetcode.git
cd planetcode
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Visit http://127.0.0.1:8000/

---

## Project Structure

```
planetcode/
├── apps/
│   ├── accounts/
│   ├── pages/
│   ├── courses/
│   ├── cart/
│   └── dashboard/
├── config/
├── static/
├── templates/
└── media/
```

---

## What I Learned

- Django project structure with multiple apps
- Class-based views (TemplateView, ListView)
- Template inheritance and static file management
- Responsive design with Bootstrap 5
- CSS custom properties for dark/light theming
- Git workflow and meaningful commits

---

## Next Steps

- Add database models for courses and categories
- Implement user authentication and registration
- Connect shopping cart to backend
- Build checkout flow
- Add user dashboard with enrolled courses
