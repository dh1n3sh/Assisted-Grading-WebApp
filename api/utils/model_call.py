import requests
import json


f = open('1_1.jpg', 'rb')

files = {"answer_image": ("/home/dhinesh/school/fyp/webapp/fyp/media/as_images/5/46/65/2.jpg", f)}

resp = requests.post("http://localhost:8008/detect/", files=files)
print(resp.text)

print("status code " + str(resp.status_code))

if resp.status_code == 200:
    print ("Success")
    data = json.loads(resp.text)
    file_ids = data['answer_bboxes']
    print (file_ids)
else:
    print ("Failure")