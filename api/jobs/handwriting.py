from api.models import Student
import logging

import tensorflow as tf 
import numpy as np 
import tempfile

from PIL import Image, ImageOps, UnidentifiedImageError 
import os 
import shutil 
import math 

from pdf2image import convert_from_path

logger = logging.getLogger()

def pdfToImages (pdf, folderName):   
    
    #extract images to output folder folderName 
    pdf = convert_from_path (pdf) 
    cnt = 1 
    for page in pdf :
        page.save (os.path.join (folderName, str(cnt)+".jpg"), "JPEG")  
        cnt += 1    

    paths = list() 
    for picture in os.listdir (folderName) :
        paths.append (os.path.join(folderName, picture))  

    return paths 

def crop (path, stripLen, stripWidth, counter, array):  

  im = Image.open (path) 
  im = ImageOps.grayscale (im) 
  imgwidth, imgheight = im.size

  for i in range (0, imgheight, stripLen): 

    box = (0, i, stripWidth, i+stripLen) 
    a = im.crop(box)
    data = np.array (a) 
    data = data.reshape ((data.shape[0], data.shape[1], 1))  

    array[counter[0]] = data 
    counter[0] += 1 

def imagesToStrips(paths):  
    
  count = 0 
  stripLen, stripWidth = 500, 1000
  paths = os.listdir() 

  for p in paths:

    try:
      im = Image.open (p) 
    except UnidentifiedImageError: 
      continue 

    im = ImageOps.grayscale (im) 
    imgwidth, imgheight = im.size

    for i in range (0, imgheight, stripLen): 
      count += 1
 
  array = np.zeros ((count, stripLen, stripWidth, 1)) 
  counter = [0] 

  for p in paths:
    try:  
      crop (p, stripLen, stripWidth, counter, array) 
    except UnidentifiedImageError:
      continue 
  
  array = array/255.0 
  return array 

def verify_handwriting(model_path, answerscript_pdf):
    '''
    return whether handwriting in pdf corresponds to student.
    params 
        student_class : student roll no to identify model
        answerscript_pdf : relative path to pdf
    '''
    # loadmodel
    model = tf.keras.models.load_model(model_path) 
    score = 0 

    with tempfile.TemporaryDirectory() as tmpdirname: 
        
        paths = pdfToImages (answerscript_pdf, tmpdirname)  
        test_images = imagesToStrips (paths)  

        y_pred = model.predict_classes (test_images)  
        score = sum(y_pred)/len(y_pred)

    #Set threshold 
    # logger.info('model '+str(model_path)+student_class)
    threshold = 0.5 

    if (score >= threshold): 
        return True 
    else:
        return False