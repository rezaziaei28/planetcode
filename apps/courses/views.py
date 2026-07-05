from django.views.generic import TemplateView

class AllCoursesView(TemplateView):
    template_name = 'courses/all-course.html'