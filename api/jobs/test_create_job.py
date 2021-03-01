from zipfile import ZipFile
from api.models import Submission, Test, Student
import os, shutil
from tempfile import TemporaryDirectory
from django.core.files.base import File, ContentFile
from .handwriting import verify_handwriting
from .segment_pdf import generate_grade_tree
from api.config import *
from fyp.settings import HANDWRITING_MODELS_DIR
import logging
logger = logging.getLogger()
# finish logger


def make_submissions(test):
    '''
    gets the pdfs in the answer script zip file and creates individual submission entries
    PARAMS
        test: Test object
    '''
    # from zipfile import ZipFile
    # from api.models import Submission, Test
    # from tempfile import TemporaryDirectory
    # from django.core.files import File


    zip_path = test.answer_scripts

    with TemporaryDirectory() as tmpdirname:
        logger.info('created temporary directory '+ tmpdirname)
        with ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(tmpdirname)

        for file in os.listdir(tmpdirname):
            logger.info('processing pdf '+file+' for test '+str(test.id))
            pdf_file = os.path.join(tmpdirname, file)
            name = file.split('.')[0] #remove extension like .pdf
            
            new_sub = Submission(
                test=test,
                name=name,
                status=0,
                grade_tree=None
            )
            with open(pdf_file, 'rb') as doc_file:
                new_sub.answerscript_pdf.save(file, File(doc_file), save=False)
            

            # run handwriting verification
            student_roll = name.split(PDF_NAME_DELIMITER)[0] #split and take first obj
            print("Processing student submission with roll :", student_roll)
            students = Student.objects.filter(roll = student_roll)

            # TODO : consider len == 1 to get a unique student
            if len(students)>0: 

                student = students[0]
                model_path = student.handwriting_model_path

                if not student.handwriting_model_path and student.handwriting_model_zip:
                    # lazy extract and save
                    model_path = os.path.join(HANDWRITING_MODELS_DIR, str(student.id))
                    if not os.path.exists(model_path):
                        os.makedirs(model_path)
                    with ZipFile(student.handwriting_model_zip, 'r') as zip:

                        zip.extractall(model_path)
                        contents = os.listdir(model_path)

                        if len(contents)==1:
                            # zip contains a folder which contains model files
                            model_path = os.path.join(model_path, contents[0])
                        elif len(contents) == 3:
                            # zip contains model files in root
                            continue
                        else:
                            # zip contains model in unknown structure or doesn't contain the model
                            shutil.rmtree(model_path)

                    
                if model_path:
                    student.handwriting_model_path = model_path
                    student.save()
                    new_sub.handwriting_verified =  verify_handwriting(model_path, new_sub.answerscript_pdf.path)
                    print(student.handwriting_model_path, new_sub.handwriting_verified)
                    

            # run dhsegment
            grade_tree = generate_grade_tree("answerscript_pdf")
            new_sub.grade_tree.save(name+'grade.json', ContentFile(grade_tree), save = False)

            new_sub.save()



if __name__ == 'django.core.management.commands.shell':
    a = Test.objects.all()[0]
    make_submissions(a)
