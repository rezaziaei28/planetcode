from django.views.generic import TemplateView

class DashboardView(TemplateView):
    template_name = 'dashboard/instructor/instructor_sections.html'