from api.models import Student
import logging
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

    # open pdf and pre process

    # predict
    logger.info('model '+str(model_path)+student_class)
    return True