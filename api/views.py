from django_q.tasks import async_task, result
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from django.core.exceptions import PermissionDenied, SuspiciousOperation
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User, AnonymousUser
from rest_framework import viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from itertools import chain
from django.views import View
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from .serializers import ProfessorSerializer, CourseSerializer, TestSerializer, SubmissionSerializer, UserSerializer, StudentSerializer, GradeTreeSerializer
from .models import Course, Professor, Test, Submission, Student
import sys
from api.jobs.test_create_job import make_submissions
import csv
from django.views.decorators.http import require_http_methods, require_GET
def auth(user):

    if isinstance(user, AnonymousUser):
        raise PermissionDenied

    return Professor.objects.filter(user=user)[0]

index = never_cache(TemplateView.as_view(template_name='index.html'))


class CourseView(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.none()

    def list(self, request):

        profLoggedIn = auth(request.user)

        querySet = Course.objects.filter(
            professor=profLoggedIn
        )
        serialized = CourseSerializer(querySet, many=True)

        return Response(serialized.data)

    def create(self, request):

        profLoggedIn = auth(request.user)

        course_id = request.POST['course_id']
        name = request.POST['name']
        offering_dept = request.POST['offering_dept']

        course = Course(
            professor=profLoggedIn,
            name=name,
            offering_dept=offering_dept,
            course_id=course_id
        )
        course.save()

        return Response(CourseSerializer(course).data)

    def retrieve(self, request, pk=None):

        profLoggedIn = auth(request.user)
        matches = Course.objects.filter(
            professor=profLoggedIn,
        )

        course = get_object_or_404(matches, pk=pk)
        serializer = CourseSerializer(course)
        return Response(serializer.data)

    def destroy(self, request, pk=None):

        profLoggedIn = auth(request.user)
        matches = Course.objects.filter(
            professor=profLoggedIn,
        )

        course = get_object_or_404(matches, pk=pk)
        course.delete()

        return HttpResponse(
            "deleted"
        )


class TestView(viewsets.ModelViewSet):
    serializer_class = TestSerializer
    queryset = Test.objects.all()

    def getTestProf(self, test):
        pass

    def list(self, request):

        profLoggedIn = auth(request.user)
        if 'course' not in request.GET:

            profCourses = Course.objects.filter(
                professor=profLoggedIn
            )

            q_set = Test.objects.none()
            for course in profCourses:
                tests = Test.objects.filter(course=course)
                q_set = q_set | tests

        else:

            matches = Course.objects.filter(
                professor=profLoggedIn,
            )

            course = get_object_or_404(matches, pk=request.GET['course'])
            q_set = Test.objects.filter(course=course)

        serialized = TestSerializer(q_set.order_by("-date"), many=True)
        return Response(serialized.data)

    def create(self, request):

        profLoggedIn = auth(request.user)
        matches = Course.objects.filter(
            professor=profLoggedIn,
        )

        course = get_object_or_404(matches, pk=request.POST['course'])

        # if request.method == 'POST':

        name = request.POST['name']
        date = request.POST['date']
        qp_tree = request.FILES['qp_tree']
        answer_scripts = request.FILES['answer_scripts']

        test = Test(
            course=course,
            name=name,
            date=date,
            qp_tree=qp_tree,
            answer_scripts=answer_scripts
        )
        test.save()
        # USE UTILS AND CALL ML SERVICE

        # make_submissions(test)
        task_id = async_task(make_submissions, test)

        return Response(TestSerializer(test).data)


class SubmissionView (viewsets.ModelViewSet):

    # http_method_names = ['post']
    # Try updating to include other parameters for filtering tests

    serializer_class = SubmissionSerializer
    queryset = Submission.objects.all()

    def list(self, request):

        profLoggedIn = auth(request.user)

        try:
            testCourse = Test.objects.get(id=request.GET['test']).course
            prof = Course.objects.get(id=testCourse.id).professor
            if (prof != profLoggedIn):
                raise Http404()
        except:
            raise Http404()

        q_set = Submission.objects.filter(test=request.GET['test']).order_by('status')
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
        user = authenticate(username=request.data.get(
            'username'), password=request.data.get('password'))
        if user is not None:
            login(request, user)
            return Response(UserSerializer(user).data)

        else:
            return Response("Login Failed")


class ProfessorView(viewsets.ModelViewSet):
    pass


class MyProfessorView(viewsets.ModelViewSet):
    serializer_class = ProfessorSerializer
    queryset = Professor.objects.all()

    def list(self, request, pk=None):

        profLoggedIn = auth(request.user)
        serializer = ProfessorSerializer(profLoggedIn)
        return Response(serializer.data)

class StudentView(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()

from django.conf import settings
import json
from io import StringIO
from django.core.files.base import ContentFile

def total_grade(grade_tree):
    if(isinstance(grade_tree,list)):
        return grade_tree[1], grade_tree[0]
    total = 0
    remarks = ""
    for q in grade_tree:
        t,r = total_grade(grade_tree[q])
        total+=t
        remarks+=r
    return total, remarks


class Marksheet(View):
    def get(self,request):
        # Create the HttpResponse object with the appropriate CSV header.
        test = Test.objects.get(id=request.GET['test'])
        submissions = Submission.objects.filter(test=test.id)
            
        csv_buffer = StringIO()
        writer = csv.writer(csv_buffer)
        writer.writerow(['Student', 'Marks', 'Remarks'])
        all_student_total = 0
        
        for submission_object in submissions:
            grade_tree = json.loads(open(submission_object.grade_tree.path,'r').read())
            total,remarks =total_grade(grade_tree)

            writer.writerow([submission_object.name, total, remarks])
            all_student_total += total

        test.consolidated_marksheet.save("{}_{}_marksheet.csv".format(test.course.name,test.name),
            ContentFile(csv_buffer.getvalue()))       

        response = HttpResponse(csv_buffer.getvalue(),content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="{}_{}_marksheet.csv"'.format(test.course.name,test.name)

        return response


class GradeTreeView (viewsets.ModelViewSet):

    # http_method_names = ['post']
    # Try updating to include other parameters for filtering tests

    serializer_class = GradeTreeSerializer
    queryset = Submission.objects.all()

# class GradeTree(View):
#     def put(self, request)
# def index(request):
#     return HttpResponse("Hello, world. You're at the api index.")
