from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from itertools import chain

from .serializers import ProfessorSerializer, CourseSerializer, TestSerializer, SubmissionSerializer, UserSerializer
from .models import Course, Professor, Test, Submission


class CourseView(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.none() 

    def list(self, request): 

        if 'professor' in request.GET: 
            querySet = Course.objects.filter( 
                professor = request.GET['professor'] 
            ) 
        else: 
            querySet = Course.objects.none() 
        
        serialized = CourseSerializer(querySet, many=True) 
        return Response (serialized.data) 

class TestView(viewsets.ModelViewSet):
    serializer_class = TestSerializer
    queryset = Test.objects.all()

    def list(self, request):
        # return Response(request.GET)
        if 'course' in request.GET:
            q_set = Test.objects.filter(course=request.GET['course'])
        else:
            q_set = Test.objects.all()
        serialized = TestSerializer(q_set, many=True)
        return Response(serialized.data)


class SignupView(viewsets.ModelViewSet):
    http_method_names = ['post']

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


class SubmissionView (viewsets.ModelViewSet):

    # http_method_names = ['post']

    serializer_class = SubmissionSerializer
    queryset = Submission.objects.all()

    def list(self, request):
        # return Response(request.GET)
        if 'test' in request.GET:
            q_set = Submission.objects.filter(test=request.GET['test'])
        else:
            q_set = Submission.objects.all()

        serialized = SubmissionSerializer(q_set, many=True)
        return Response(serialized.data)


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


class ProfessorView(viewsets.ModelViewSet):
    pass


def index(request):
    return HttpResponse("Hello, world. You're at the api index.")
