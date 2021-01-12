from django.db import models

# Create your models here.


class Professor(models.Model):
    Name = models.CharField(max_length=50)
    Email = models.CharField(max_length=50)
    Department = models.CharField(max_length=20)


# class Course(models.Model):


# class Submission(models.Model):


# class Test(models.Model):


# class QpTree(models.Model):


# class GradeTree(QpTree):
