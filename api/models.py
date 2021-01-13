from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Professor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    name = models.CharField(max_length=50, null=True)
    email = models.EmailField(max_length=50, null=True)
    department = models.CharField(max_length=20, null=True)


class Course(models.Model):
    professor = models.ForeignKey(
        Professor, on_delete=models.CASCADE, null=True)

    name = models.CharField(max_length=50)
    offering_dept = models.CharField(max_length=50, null=True)
    course_id = models.CharField(max_length=50, null=True)


class Test(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True)

    date = models.DateField(null=True)

    consolidated_marksheet = models.FileField(
        upload_to='uploads/testMarksheets/',
        null=True)

# https://docs.djangoproject.com/en/3.1/ref/models/fields/#filefield


class Submission(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, null=True)

    answerscript_pdf = models.FileField(
        upload_to='uploads/submissions/', null=True)
    submission_time = models.DateTimeField(null=True)
    status = models.IntegerField(null=True)


class QpNode (models.Model):

    test = models.ForeignKey(Test, on_delete=models.CASCADE, null=True)

    question_number = models.CharField(max_length=50, null=True)
    max_marks = models.IntegerField(null=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True
    )


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
