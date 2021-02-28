from api.models import Student
import logging

import tensorflow as tf 
import numpy as np 

from PIL import Image   
import cv2 
import os 
import shutil 

logger = logging.getLogger()

def pdfToImages (pdf):  
    pass 

def padLen (img, r, c, stripLen): 
    
    padded = np.zeros ((r, stripLen, 1)) 
    
    if (c >= stripLen):
        padded[:][:] = img[:][:stripLen]   
        return padded 

    padded[:][:c] = img[:][:] 
    padded[:][c:] = 255 

    return padded 

def imageToStrips (imagePaths):

    strips = 0 
    stripLen, stripWidth = 1000,500 
    
    for path in imagePaths: 
        img = cv2.imread (path, 0)
        if (img is None):
            continue 

        r,c = img.shape[0], img.shape[1] 
        strips += r//stripWidth 

    test_images = np.zeros ((strips, stripWidth, stripLen, 1)) 
    k = 0 
    for path in imagePaths: 

        img = cv2.imread (path, 0)
        if (img is None):
            continue 

        r,c = img.shape[0], img.shape[1] 
        for i in range (r//stripWidth): 
            test_images[k] = padLen(img[i*stripWidth: (i+1)*stripWidth][:], r, c, stripLen)  
            k += 1

    test_images = test_images/255.0 
    return test_images 
    
def verify_handwriting(model_path, answerscript_pdf):
    '''
    return whether handwriting in pdf corresponds to student.
    params 
        student_class : student roll no to identify model
        answerscript_pdf : relative path to pdf
    '''
    # loadmodel
    model = tf.keras.models.load_model(model_path) 

    # open pdf and pre process into 500*1000*1 strips
    # Fill paths aptly  

    # test_images = np.zeros ((len(paths), 500, 1000, 1)) 
    
    # for i in range (len(paths)): 

    #     path = paths[i] 
    #     img = Image.open (path) 
    #     data = np.array(img) 
    #     data = data.reshape ((data.shape[0], data.shape[1], 1)) 

    #     test_images[i] = data  
    
    # test_images = test_images/255.0 
    
    paths = pdfToImages (answerscript_pdf) 
    test_images = imageToStrips (paths) 
    y_pred = model.predict_classes (test_images)  
  
    logger.info('model '+str(model_path)+student_class)
    score = sum(y_pred)/len(y_pred)

    #Set threshold 
    threshold = 0.5 

    if (score >= threshold): 
        return True 
    else:
        return False