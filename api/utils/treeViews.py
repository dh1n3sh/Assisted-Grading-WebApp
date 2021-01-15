from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from itertools import chain
import json 
from django.http import JsonResponse
from rest_framework.decorators import action

from .serializers import CourseSerializer, TestSerializer, UserSerializer, ProfessorSerializer
from .models import Course, Professor, Test, Submission, QpNode, GradeNode 

class customTreeSerializer:

    def __init__(self):
        pass

    def createGradeTreeJson (self, jsonNode, submission, parent): 
        
        children = GradeNode.objects.filter (submission = submission).filter (parent = parent) 
        if (len(children) == 0): 
            jsonNode[parent.question.question_number] = [
                parent.remarks, parent.awarded_marks, parent.segmentation_image, parent.processed_image
            ] 
        else: 
            jsonNode[parent.question.question_number] = dict() 
            for child in children:
                self.createGradeTreeJson (jsonNode[parent.question.question_number], 
                submission, child) 

    def createQpTreeJson (self, jsonNode, test, parent) : 
        
        children = QpNode.objects.filter(test = test).filter (parent = parent) 
        if (len(children) == 0): 
            jsonNode[parent.question_number] = parent.max_marks 

        else: 
            jsonNode[parent.question_number] = dict() 
            for child in children: 
                self.createQpTreeJson (jsonNode[parent.question_number], test, child)  

    def getOpTreeJson(self, test):   

        qpJson = dict() 
        rootNode = QpNode.objects.filter (test = test).filter (parent = None)[0]  
        self.createQpJson (qpJson, test, rootNode)   
        return qpJson 
    
    def getGradeTreeJson (self, submission): 

        submissionJson = dict() 
        rootNode = GradeNode.objects.filter (submission = submission).filter (parent = None)[0] 
        self.createGradeTreeJson (submissionJson, submission, rootNode) 
        return submissionJson 

class getSubmissionsView (viewsets.ViewSet): 

    def list(self, request, pk=None):
        
        #add auth 

        test = None 
        submissions = Submission.objects.all()         

        submissionsDict = dict() 

        return JsonResponse(submissionsDict) 