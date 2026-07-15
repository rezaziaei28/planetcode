from django.views.generic import TemplateView

class LoginView(TemplateView):
    template_name = 'accounts/login.html'

class SignupView(TemplateView):
    template_name = 'accounts/signup.html'

class VerifyView(TemplateView):
    template_name = 'accounts/verify.html'
