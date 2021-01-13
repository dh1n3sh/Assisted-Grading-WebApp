from django.db import models

# Create your models here.

class Professor(models.Model):

    prof_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50)
    department = models.CharField(max_length=20)

class Course(models.Model):

    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)
    
    name = models.CharField (max_length = 50)
    offering_dept = models.CharField (max_length = 50) 
    course_id = models.CharField (max_length = 50) 

class Test(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    
    date = models.DateField() 
    duration = models.DurationField() 
    consolidated_marksheet = models.FileField(upload_to='uploads/testMarksheets/')

#https://docs.djangoproject.com/en/3.1/ref/models/fields/#filefield 
class Submission(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)

    answerscript_pdf = models.FileField(upload_to='uploads/submissions/')
    submission_time = models.DateTimeField()  
    status = models.IntegerField() 

class QpNode (models.Model): 

    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    
    question_number = models.CharField (max_length = 50) 
    level = models.IntegerField() 
    maxMarks = models.IntegerField() 
    children_count = models.IntegerField() 

class QpNodeAdjList(models.Model):

    parentNode = models.ForeignKey (QpNode, on_delete = models.CASCADE)  
    childNode = models.ForeignKey (QpNode, on_delete = models.CASCADE, related_name='QpdNodeToChild') 

class GradeNode (QpNode):

    submission = models.ForeignKey (Submission, on_delete = models.CASCADE)
    awarded_marks = models.IntegerField() 
    remarks = models.CharField(max_length = 100) 
    status = models.IntegerField() 

    segmentation_image = models.FileField(upload_to='uploads/segmentation_images/')
    processed_image =  models.FileField(upload_to='uploads/processed_images/') 

class GradeNodeAdjList (models.Model): 

    parentNode = models.ForeignKey (GradeNode, on_delete = models.CASCADE) 
    childNode = models.ForeignKey (GradeNode, on_delete = models.CASCADE, related_name='GradeNodeToChild')  