from django.urls import path
from apps.dashboard import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.student_dashboardView.as_view(), name='student_dashboard'),
    
    # Instructor URLs
    path('instructor/', views.instructor_dashboardView.as_view(), name='instructor_dashboard'),
    path('instructor/courses/', views.instructor_coursesView.as_view(), name='instructor_courses'),
    path('instructor/sections/', views.instructor_sectionsView.as_view(), name='instructor_sections'),
    path('instructor/lessons/', views.instructor_lessonsView.as_view(), name='instructor_lessons'),
    path('instructor/lesson-form/', views.instructor_lesson_formView.as_view(), name='instructor_lesson_form'),
    path('instructor/course-form/', views.instructor_course_formView.as_view(), name='instructor_course_form'),
]