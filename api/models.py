from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Professor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    name = models.CharField(max_length=50, null=True)
    # email = models.EmailField(max_length=50, null=True)
    department = models.CharField(max_length=20, null=True)

class Student(models.Model):
    roll = models.CharField(max_length=50, null=True)
    name = models.CharField(max_length=50, null=True)
    handwriting_model = models.FileField(
        upload_to='uploads/handwriting/',
        null=True)


class Course(models.Model):
    professor = models.ForeignKey(
        Professor, on_delete=models.CASCADE, null=True)

    name = models.CharField(max_length=50)
    offering_dept = models.CharField(max_length=50, null=True)
    course_id = models.CharField(max_length=50, null=True)


class Test(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=50)
    date = models.DateField(null=True)

    consolidated_marksheet = models.FileField(
        upload_to='uploads/marksheets/',
        null=True)

    qp_tree = models.FileField(upload_to='uploads/qp_tree', null=True)
    answer_scripts = models.FileField(
        upload_to='uploads/answer_scripts/',
        null=True)
# https://docs.djangoproject.com/en/3.1/ref/models/fields/#filefield


class Submission(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=50)
    answerscript_pdf = models.FileField(
        upload_to='uploads/submissions/', null=True)
    submission_time = models.DateTimeField(null=True)
    status = models.IntegerField(null=True)
    grade_tree = models.FileField(upload_to='uploads/grade_tree/', null=True)
    handwriting_verified = models.BooleanField(null=True)


# DEPRECATED
class QpNode (models.Model):

    test = models.ForeignKey(Test, on_delete=models.CASCADE, null=True)

    question_number = models.CharField(max_length=50, null=True)
    max_marks = models.IntegerField(null=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True
    )

# DEPRECATED


class GradeNode (models.Model):

    submission = models.ForeignKey(
        Submission, on_delete=models.CASCADE, null=True
    )
    question = models.ForeignKey(
        QpNode, on_delete=models.CASCADE, null=True
    )

    awarded_marks = models.IntegerField(null=True)
    remarks = models.CharField(max_length=100, null=True)
    status = models.IntegerField(null=True)

    segmentation_image = models.FileField(
        upload_to='uploads/segmentation_images/',
        null=True
    )
    processed_image = models.FileField(
        upload_to='uploads/processed_images/',
        null=True
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True
    )
