from rest_framework import serializers
from .models import Course, Test, Professor, Submission, Student
from django.contrib.auth.models import User


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'course_id', 'name', 'offering_dept')


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ('id', 'name', 'date', 'qp_tree', 'answer_scripts', 'course','consolidated_marksheet')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email')


class SubmissionSerializer (serializers.ModelSerializer):

    class Meta:
        model = Submission
        fields = ('id', 'name', 'submission_time',
                  'status', 'grade_tree', 'test', 'answerscript_pdf', 'handwriting_verified')


class ProfessorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Professor
        fields = ('id', 'name', 'department', 'user')
        # depth = 2

class StudentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Student
        fields = ('id', 'roll', 'name', 'handwriting_model_zip', 'handwriting_model_path')