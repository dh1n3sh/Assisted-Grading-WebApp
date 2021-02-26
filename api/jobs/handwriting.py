from api.models import Student
import logging

import tensorflow as tf 
import numpy as np 
from PIL import Image

logger = logging.getLogger()
def verify_handwriting(student_class, answerscript_pdf):
    '''
    return whether handwriting in pdf corresponds to student.
    params 
        student_class : student roll no to identify model
        answerscript_pdf : relative path to pdf
    '''
    s = Student.objects.filter(roll = student_class)
    model_path = ''
    if len(s)>0:
        model_path = s[0].handwriting_model
    
    # loadmodel
    model = tf.keras.models.load_model(model_path) 

    # open pdf and pre process into 500*1000*1 strips
    paths = list()
    # Fill paths aptly  
    test_images = np.zeros ((len(paths), 500, 1000, 1)) 
    
    
    for i in range (len(paths)): 

        path = paths[i] 
        img = Image.open (path) 
        data = np.array(img) 
        data = data.reshape ((data.shape[0], data.shape[1], 1)) 

        test_images[i] = data  
    
    test_images = test_images/255.0 
    y_pred = model.predict_classes (test_images)  
  
    logger.info('model '+str(model_path)+student_class)
    score = sum(y_pred)/len(y_pred)

    #Set threshold 
    threshold = 0.5 

    if (score >= threshold): 
        return True 
    else:
        return False