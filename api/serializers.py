
from rest_framework import serializers
from .models import Course, Test


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'course_id', 'name', 'offering_dept')


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ('id', 'name', 'date')
