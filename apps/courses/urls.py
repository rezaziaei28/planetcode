from django.urls import path
from . import views

app_name = 'courses'

urlpatterns = [
    path('', views.AllCoursesView.as_view(), name='all_courses'),
    
    # Detail page with slug (SEO friendly)
    path('a/', views.CourseDetailView.as_view(), name='course_detail'),
]