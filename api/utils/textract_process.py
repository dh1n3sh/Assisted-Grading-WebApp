import json 
from bisect import bisect_left  

class BoundingBox: 
  def __init__(self, x1, y1, x2, y2, text=None):    
    self.x1 = x1 
    self.y1 = y1 
    self.x2 = x2 
    self.y2 = y2 
    self.text = text 
  
  def area(self): 
    return (self.x2-self.x1)*(self.y2-self.y1) 
  
  def intersection (self, boxB): 

    commonLen = min (self.y2, boxB.y2) - max (self.y1, boxB.y1) 
    commonWid = min (self.x2, boxB.x2) - max (self.x1, boxB.x1) 

    if commonLen>0 and commonWid>0:
      return commonLen*commonWid 
    else: 
      return 0 
  
  def union (self, boxB): 
    return self.area() + boxB.area() - self.intersection(boxB) 
  
  def iou (self, boxB): 
    return self.intersection (boxB)/ self.union(boxB) 

  def __str__(self):
    return str([self.x1, self.y1, self.x2, self.y2, self.text])

def loadTextractResults(data, pageWidth, pageHeight):  
    # with open(jsonPath) as f:
    #     data = json.load(f)

    # print (data.keys()) 

    blocks = data['Blocks'] 
    info = list() 

    for block in blocks: 

        if block["BlockType"] == "WORD": 
            info.append ({
                "confidence": block['Confidence'], 
                "text": block['Text'],
                "box": block['Geometry']['BoundingBox']
            })
            
    boundingBoxes = list() 
    for line in info: 

        box = line["box"] 
        w,h = box["Width"],box["Height"] 
        x1,y1= box["Top"], box["Left"] 

        w = int(w*pageWidth) 
        h = int(h*pageHeight)  
        x1 = int(x1*pageHeight) 
        y1 = int(y1*pageWidth) 
    
        boundingBoxes.append (
            BoundingBox(x1, y1, x1+h, y1+w, line["text"]) 
        )
    boundingBoxes.sort (key=lambda x:x.x1)  
    return boundingBoxes 

#roi is segmented bounding box from mmdet. indexed is sorted boxes indexed by x 
def getCharsQuestion(roi, indexed): 
    
    pad = 30 
    upperX = roi.x1-pad 
    lowerX = roi.x2+pad
    X = [x.x1 for x in indexed]

    i = bisect_left(X, upperX) 
    j = bisect_left(X, lowerX) 

    maxIou = -1 
    ansBox = None 
    for box in indexed[i:j]: 
        iou = box.iou (roi)

        if iou > maxIou:
            
            maxIou = iou
            ansBox = box 

    if ansBox is None: return None 
    else: return ansBox.text 