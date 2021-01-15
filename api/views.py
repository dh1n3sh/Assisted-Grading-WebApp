from django.shortcuts import render
from django.http import HttpResponse
from django.core.exceptions import PermissionDenied, SuspiciousOperation
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User, AnonymousUser 
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

        if isinstance(request.user, AnonymousUser):
            raise PermissionDenied  

        profLoggedIn = Professor.objects.filter (user = request.user) [0] 
        querySet = Course.objects.filter( 
            professor = profLoggedIn  
        ) 
        serialized = CourseSerializer(querySet, many=True) 
        
        return Response (serialized.data) 
    
    def create(self, request):
        
        if isinstance(request.user, AnonymousUser):
            raise PermissionDenied  

        profLoggedIn = Professor.objects.filter (user = request.user) [0]

        if request.method == 'POST':
            
            course_id = request.POST['course_id']
            name = request.POST['name']
            offering_dept = request.POST['offering_dept']

            course = Course (
                professor = profLoggedIn, 
                name = name, 
                offering_dept = offering_dept, 
                course_id = course_id 
            )
            course.save() 

            return Response(CourseSerializer(course).data)  

class TestView(viewsets.ModelViewSet):
    serializer_class = TestSerializer
    queryset = Test.objects.all()

    def list(self, request):
        
        if isinstance(request.user, AnonymousUser):
            raise PermissionDenied  

        if 'course' not in request.GET:
            raise SuspiciousOperation("Invalid request; missing course details") 

        profLoggedIn = Professor.objects.filter (user = request.user) [0]
        try: 
            courseProf = Course.objects.get(id = request.GET['course']).professor    
        except: 
            raise PermissionDenied 

        if profLoggedIn != courseProf:
            raise PermissionDenied 
        
        q_set = Test.objects.filter(course=request.GET['course'])
        print (q_set) 
        serialized = TestSerializer(q_set, many=True)
        return Response(serialized.data)
    
    def create(self, request):
        
        if isinstance(request.user, AnonymousUser):
            raise PermissionDenied  

        if 'course' not in request.POST:
            raise SuspiciousOperation("Invalid request; missing course details") 

        profLoggedIn = Professor.objects.filter (user = request.user) [0]
        try: 
            courseProf = Course.objects.get(id = request.GET['course']).professor    
        except: 
            raise PermissionDenied 

        if profLoggedIn != courseProf:
            raise PermissionDenied 

        if request.method == 'POST': #USE UTILS AND CALL ML SERVICE 
            
            name = request.POST['name']   
            date = request.POST['date']
            qp_tree = request.POST['qp_tree']
            answer_scripts = request.POST['answer_scripts']
            
            course_id = request.POST['course']
            course = Course.objects.get (id = course_id) 

            test = Test (
                course = course, 
                name = name, 
                date = date, 
                qp_tree = qp_tree, 
                answer_scripts = answer_scripts 
            )
            test.save() 

            return Response(TestSerializer(test).data)

class SubmissionView (viewsets.ModelViewSet):

    # http_method_names = ['post']
    #Try updating to include other parameters for filtering tests 

    serializer_class = SubmissionSerializer
    queryset = Submission.objects.all()

    def list(self, request):

        if isinstance(request.user, AnonymousUser):
            raise PermissionDenied
        
        if 'test' not in request.GET:
            raise SuspiciousOperation("Invalid request; missing test details") 
    
        profLoggedIn = Professor.objects.filter (user = request.user) [0]

        try: 
            testCourse = Test.objects.get (id = request.GET['test']).course 
            prof = Course.objects.get(id = testCourse.id).professor
        except: 
            raise PermissionDenied 

        if (prof != profLoggedIn):  
            raise PermissionDenied

        q_set = Submission.objects.filter(test=request.GET['test'])
        serialized = SubmissionSerializer(q_set, many=True)
        return Response(serialized.data)

class SignupView(viewsets.ModelViewSet):
    http_method_names = ['post']

    serializer_class = ProfessorSerializer
    queryset = Professor.objects.all()

    def create(self, request):
        
        if request.method == 'POST':
            
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

class UserLoginView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def create(self, request):
        user = authenticate(
            username=request.POST['username'], password=request.POST['password'])
        if user is not None:
            login(request, user)
            return Response(UserSerializer(user).data)
            
        else:
            return Response("Login Failed")


class ProfessorView(viewsets.ModelViewSet):
    pass


def index(request):
    return HttpResponse("Hello, world. You're at the api index.")