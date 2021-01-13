from django.shortcuts import render
from django.http import HttpResponse
from .models import Course 

# Create your views here.
def index(request):
    return HttpResponse("Hello, world. You're at the api index.")

def getCourses (request): 
    
    print (request.user) 
    prof = request.GET['user']  
    print (prof) 

    return HttpResponse ("dummy response") 