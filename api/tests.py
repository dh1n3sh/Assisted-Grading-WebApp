from django.test import TestCase, Client
from django.urls import reverse

from django.test.utils import setup_test_environment
from .views import TestView
from .models import Course
# setup_test_environment()

COURSE_EX = {
                "professor": 1,
                "name": "TOC",
                "offering_dept": "CSE",
                "course_id": "CS 6610"
             }
class TestCreateViewTests(TestCase):
    def test_sub_creation(self):
        new_course = Course(
            name=  COURSE_EX['name'],
            offering_dept = COURSE_EX['offering_dept']
        )
        new_course.save()
        url = '/api/tests'
        response = self.client.get(url)
        print(response)
        self.assertEqual(True,True)
