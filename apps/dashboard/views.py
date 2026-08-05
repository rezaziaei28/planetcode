from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render

class student_dashboardView(LoginRequiredMixin, TemplateView):
    """Student dashboard view"""
    template_name = 'dashboard/dashboard.html'


class instructor_dashboardView(LoginRequiredMixin, TemplateView):
    """Instructor dashboard view"""
    template_name = 'dashboard/instructor/instructor_dashboard.html'


class instructor_coursesView(LoginRequiredMixin, TemplateView):
    """Instructor courses management view"""
    template_name = 'dashboard/instructor/instructor_courses.html'


class instructor_sectionsView(LoginRequiredMixin, TemplateView):
    """Instructor sections/lessons management view"""
    template_name = 'dashboard/instructor/instructor_sections.html'


class instructor_lessonsView(LoginRequiredMixin, TemplateView):
    """Instructor lessons management view"""
    template_name = 'dashboard/instructor/instructor_lessons.html'


class instructor_lesson_formView(LoginRequiredMixin, TemplateView):
    """Instructor lesson form view"""
    template_name = 'dashboard/instructor/instructor_lesson_form.html'


class instructor_course_formView(LoginRequiredMixin, TemplateView):
    """Instructor course form view"""
    template_name = 'dashboard/instructor/instructor_course_form.html'