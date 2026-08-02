from django.views.generic import TemplateView

class AllCoursesView(TemplateView):
    template_name = 'courses/all-course.html'

class CourseDetailView(TemplateView):
    template_name = 'courses/course_detail.html'