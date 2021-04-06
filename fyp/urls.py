"""fyp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from django.conf.urls.static import static
from django.conf import settings

from rest_framework import routers
from django.views.generic.base import RedirectView
from api import views

router = routers.DefaultRouter()
router.register(r'courses', views.CourseView, 'course')
router.register(r'tests', views.TestView, 'test')
router.register(r'login', views.UserLoginView, 'login')
router.register(r'signup', views.SignupView, 'signup')
router.register(r'submissions', views.SubmissionView, 'submissions')
router.register(r'me', views.MyProfessorView, 'me')
router.register(r'student', views.StudentView, 'student')
router.register(r'gradetree',views.GradeTreeView,'gradetree')
# router.register(r'marksheet',views.Marksheet, 'marksheet')

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/', include('api.urls')),
    path('grading/', include('assisted_grading.urls')),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('', views.index, name='index'),
    path('api/marksheet/',views.Marksheet.as_view())
    # path('', RedirectView.as_view(
    #     url='api/', permanent=False), name='index'),
    
] + static('/segmented_images/', document_root='segmented_images')
urlpatterns+=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
