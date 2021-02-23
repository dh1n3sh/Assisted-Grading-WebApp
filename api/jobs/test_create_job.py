from zipfile import ZipFile
from api.models import Submission, Test
import os
from tempfile import TemporaryDirectory
from django.core.files.base import File, ContentFile
from .handwriting import verify_handwriting
from .segment_pdf import generate_grade_tree
from api.config import *
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

        for name in os.listdir(tmpdirname):
            logger.info('processing pdf '+name+' for test '+str(test.id))
            pdf_file = os.path.join(tmpdirname, name)
            # run ML
            new_sub = Submission(
                test=test,
                name=name,
                status=0,
                grade_tree=None
            )
            with open(pdf_file, 'rb') as doc_file:
                new_sub.answerscript_pdf.save(name, File(doc_file), save=True)
            new_sub.save()

            # run handwriting verification
            student_class = name.split('.')[0] #remove extension like .pdf
            student_class = student_class.split(PDF_NAME_DELIMITER)[0] #split and take first obj
            new_sub.handwriting_verified =  verify_handwriting(student_class, new_sub.answerscript_pdf)
            new_sub.save()

            # run dhsegment
            grade_tree = generate_grade_tree("answerscript_pdf")
            new_sub.grade_tree.save(name+'grade.json', ContentFile(grade_tree))



if __name__ == 'django.core.management.commands.shell':
    a = Test.objects.all()[0]
    make_submissions(a)
