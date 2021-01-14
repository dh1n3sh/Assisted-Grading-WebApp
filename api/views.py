from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from itertools import chain

from .serializers import CourseSerializer, TestSerializer, UserSerializer, ProfessorSerializer
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

    def create(self, request):
        user = authenticate(
            username=request.POST['username'], password=request.POST['password'])
        if user is not None:
            login(request, user)
            return Response(UserSerializer(user).data)
            # return HttpResponse("Hey "+user.username)
        else:
            return Response("Login Failed")
            # return HttpResponse("Failed")

class UserSignupView(viewsets.ModelViewSet):
    serializer_class = ProfessorSerializer
    queryset = Professor.objects.all() #none
    def create(self,request):
        username = request.GET['username']
        password = request.GET['password']
        name = request.GET['name']
        department = request.GET['department']
        user = User(username=username, password=password)
        user.save()
        prof = Professor(user=user,  name=name)
        prof.save()
        return Response(ProfessorSerializer(prof).data)

# Create your views here.


class ProfessorView(viewsets.ModelViewSet):
    pass


def index(request):
    return HttpResponse("Hello, world. You're at the api index.")

class signup(viewsets.ModelViewSet):
    serializer_class = ProfessorSerializer
    queryset = Professor.objects.all()

    def create(self, request):
        # print()
        if request.method == 'POST':
            # return Response(request.POST.items())
            username = request.POST['user.username']
            password = request.POST['user.password']
            email = request.POST['user.email']

            name = request.POST['name']
            department = request.POST['department']
            user = User.objects.create_user(
                username=username, email=email, password=password)
            user.save()
            prof = Professor(user=user,  name=name)
            prof.save()
            return Response(ProfessorSerializer(prof).data)



def getCourses(request):

    # print(request.user)
    # prof = request.GET['user']
    # print(prof)

    return HttpResponse(request.user.professor.name)
