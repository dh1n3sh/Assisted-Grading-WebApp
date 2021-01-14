from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.userLogin, name='PostLogin'),
    path('courses/', views.getCourses, name='getCourses'),
    # path('signup', views.signup, name='signup')
]
# router.register(r'signup', views.signup, 'login')
