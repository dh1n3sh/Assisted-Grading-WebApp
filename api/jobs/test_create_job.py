from zipfile import ZipFile
from api.models import Submission, Test
import os
from tempfile import TemporaryDirectory
from django.core.files.base import File, ContentFile


def make_submissions(test):
    '''
    gets the pdfs in the answer script zip file and creates individual submission entries
    PARAMS
        test: Test object
    '''
    from zipfile import ZipFile
    from api.models import Submission, Test
    from tempfile import TemporaryDirectory
    from django.core.files import File

    zip_path = test.answer_scripts

    with TemporaryDirectory() as tmpdirname:
        print('created temporary directory', tmpdirname)
        with ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(tmpdirname)

        for name in os.listdir(tmpdirname):
            print(name)

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
            student_class = name.split('-')[0]
            new_sub.handwriting_verified =  verify_handwriting(student_class, 'a')
            new_sub.save()
            # run dhsegment
            grade_tree = generate_grade_tree("answerscript_pdf")
            new_sub.grade_tree.save(name+'grade.json', ContentFile(grade_tree))
            print(new_sub)


def verify_handwriting(student_class, answerscript_pdf):
    '''
    return whether handwriting in pdf corresponds to student.
    '''
    return True


def generate_grade_tree(answerscript_pdf):
    return "{'1': '2'}"


if __name__ == 'django.core.management.commands.shell':
    a = Test.objects.all()[0]
    make_submissions(a)
