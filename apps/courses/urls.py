from django.urls import path
from . import views

app_name = 'courses'

urlpatterns = [
    path('', views.AllCoursesView.as_view(), name='all_courses'),
]