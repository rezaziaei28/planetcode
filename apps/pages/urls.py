from django.urls import path
from apps.pages.views import *

app_name = 'pages'

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
]