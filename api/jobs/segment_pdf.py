from api.utils.toImage import convert_single_pdf_to_images
from django.conf import settings
import os
from PIL import Image
from api.utils.textract_process import BoundingBox, loadTextractResults, getCharsQuestion
import requests
import json
from api.jobs.answer_tree import *
from PIL import Image, ImageDraw, ImageFont
import numpy
def texttractRawResponse(documentName, textract):
    
    with open(documentName, 'rb') as document:
        imageBytes = bytearray(document.read())
    response = textract.detect_document_text(Document={'Bytes': imageBytes})
    return response

font = ImageFont.truetype("./Gidole-Regular.ttf", size=32)
dest = './test/'
def crop_questions(answer_dict, q = ''):
    
    if isinstance(answer_dict, list):
        i = 0
        for image_obj in answer_dict:
            img = Image.open(image_obj[0])
            width, height = img.size 
            
            cropped = img.crop((0,image_obj[1],width,image_obj[2]))
            draw = ImageDraw.Draw (cropped)
            draw.text((0,0),q,font=font,fill="red")
            cropped.save(dest+q+str(i)+'.jpg')
            i+=1
        return 
    for q_k in answer_dict:
        crop_questions(answer_dict[q_k], q+q_k)

def buildGradeTree(answer_dict, dest, q = ''): 
    
    if isinstance(answer_dict, list):
        i = 0
        child = ["",0,0,[]]
        for image_obj in answer_dict:
            img = Image.open(image_obj[0])
            width, height = img.size 
            cropped = img.crop((0,image_obj[1],width,image_obj[2]))
            draw = ImageDraw.Draw (cropped)
            draw.text((0,0),q,font=font,fill="red")
            cropped.save(os.path.join(dest,q+str(i)+'.jpg'))
            
            child[3].append(os.path.join(settings.MEDIA_URL,
                os.path.relpath(
                    os.path.join(dest,q+str(i)+'.jpg'),
                    settings.MEDIA_ROOT)
                    )
                )
            i+=1
        return child

    subDict = {}
    for q_k in answer_dict:
        subDict[q_k] = buildGradeTree(answer_dict[q_k],dest, q+q_k)  

    return subDict
    
def generate_grade_tree(answerscript_pdf, qp_tree_path, submission):
    '''
    Convert answerscript into a stringified gradetree using dhsegment
    params
        answerscript_pdf : relative path to pdf
    returns 
        stringified gradetree
    '''
    imagespath = os.path.join(settings.MEDIA_ROOT,'as_images',str(submission.test.course.id),
        str(submission.test.id), str(submission.id))
    convert_single_pdf_to_images(answerscript_pdf,imagespath)

    page_number = 0
    pages = []
    boxes = []
    ocr_whitelist = '0123456789abcdefABCDEFivx'
    textract = settings.AWS_SESSION.client('textract')


    # build the model from a config file and a checkpoint file
    # model = init_detector(settings.MMDET_CONFIG, settings.MMDET_CHECKPOINT, device='cuda:0')

    for image_file in sorted(os.listdir(imagespath)): 
        # if not image_file.endswith('.jpeg'):
        #     continue 

        image_full_path = os.path.join(imagespath,image_file)
        img = Image.open(image_full_path)
        pageWidth, pageHeight = img.size
        pages.append(Page(image_full_path, pageHeight))

        result = texttractRawResponse(image_full_path,textract)
        # bbi = getBBox(image_full_path, mmdet_model)
        text = ''
        for item in result["Blocks"]:
            if item["BlockType"] == "LINE":
                text += item["Text"]
        print('TEXTTRACT',text)

        files = {"answer_image": (image_file, open(image_full_path, 'rb'))}

        resp = requests.post("http://localhost:8008/detect/", files=files)
        print(resp.text)
        print("status code " + str(resp.status_code))

        if resp.status_code == 200:
            print ("Success")
            data = json.loads(resp.text)
            bbi = data['answer_bboxes']
            print (bbi)
        else:
            print ("Failure")
            return open('api/fixtures/grade_tree.json').read()

        print(bbi)

        indexed = loadTextractResults(result, pageWidth, pageHeight)

        
        for box in bbi:
            newBox = BoundingBox(box[1],box[0],box[3],box[2])
            ocr_result = getCharsQuestion(newBox, indexed)
            print(ocr_result,box[1],box[0])
            ocr_whitelisted = ''
            if ocr_result != None:
                for ch in ocr_result:
                    if ch in ocr_whitelist:
                        ocr_whitelisted += ch
            boxes.append(Box(ocr_whitelisted, box[1], box[0], page_number))
        page_number += 1

    print(pages)
    print(boxes)

    for page in pages:
        print(page.path, page.h)
    for box in boxes:
        print(box.ocr, box.xMin, box.yMin, box.pageNumber)
    grade_tree = {1: '2'}
    answer = AnswerTree ({'1':{'a':{}, 'b':{}}, '3':{'a':{}, 'b':{}}, '4':{},'5':{}})
    answer.processAnswerScript (pages, boxes)
    answer.disp(answer.root)
    answer_dict = answer.buildDict(answer.root)
    crop_questions(answer_dict)
    print(answer_dict)
    dest = os.path.join(settings.MEDIA_ROOT,'cropped_images',str(submission.test.course.id),
        str(submission.test.id), str(submission.id))
    if not os.path.exists(dest):
        os.makedirs(dest)
    return json.dumps(buildGradeTree(answer_dict, dest) ,indent=2)

