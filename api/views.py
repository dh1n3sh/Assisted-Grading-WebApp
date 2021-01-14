from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework import viewsets

from .serializers import CourseSerializer, TestSerializer, UserSerializer
from .models import Course, Professor, Test


class CourseView(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()


class TestView(viewsets.ModelViewSet):
    serializer_class = TestSerializer
    queryset = Test.objects.all()

class UserLoginView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    def create(self,request):
        serializer_class = UserSerializer                                                                                               
        queryset = User.objects.all()
        user = authenticate(
        username=request.POST['username'], password=request.POST['password'])
        if user is not None:    
            login(request, user)
            return HttpResponse("Hey "+user.username)
        else:
            return HttpResponse("Failed")

# Create your views here.


def index(request):
    return HttpResponse("Hello, world. You're at the api index.")


# def userLogin(request):
#     user = authenticate(
#         username=request.GET['username'], password=request.GET['password'])
#     if user is not None:
#         login(request, user)
#         return HttpResponse("Hey "+request.GET['username'])
#     else:
#         return HttpResponse("Failed")


def getCourses(request):

    # print(request.user)
    # prof = request.GET['user']
    # print(prof)

    return HttpResponse(request.user.professor.name)
