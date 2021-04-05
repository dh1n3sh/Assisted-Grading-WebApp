class Page: 
  def __init__(self, path, h):  
    self.path = path 
    self.h =h 
  def __str__(self):
    return str([self.path, self.h])
class Box: 
  def __init__(self, ocr, xMin, yMin, pageNumber): 
    self.ocr = ocr 
    self.xMin = xMin
    self.yMin = yMin  
    self.pageNumber = pageNumber
  
  def __str__(self):
    return str([self.ocr, self.xMin, self.yMin, self.pageNumber])

def sortKey (a, b): 

    if (a.pageNumber != b.pageNumber): return a.pageNumber < b.pageNumber 
    elif (a.xMin != b.xMin): return a.xMin < b.xMin 
    else: return a.yMin < b.yMin 

setattr (Box, "__lt__", lambda self, other: sortKey(self, other))  

class AnswerTreeNode: 

  def __init__(self): 

    self.parent = None 
    self.children = dict()  
    self.snippet = list()  

class AnswerTree: 

  def __init__(self, jsonDict): 

    self.root = AnswerTreeNode() 
    self.curr = self.root 

    self.constructSubtree (jsonDict, self.root) 

  def _clearContents(self, node): 

    node.snippet.clear() 
    for child in node.children.values(): 
      self._clearContents (child) 

  def reset(self): 
    self.curr = self.root 
    self._clearContents (self.root) 

  def addPageDetailsToNode(self, currentAnsList, pages, startBox, endBox=None):  
    
    padding = 100  
        
    if (endBox is None) :
        endBox = Box ("", pages[-1].h-1, -1, len(pages)-1)   
        
    startPage = startBox.pageNumber
    endPage = endBox.pageNumber


    if (startPage == endPage) :  

        topX = max (startBox.xMin - padding, 0)  
        bottomX = min (endBox.xMin+padding, pages[endBox.pageNumber].h -1) 

        currentAnsList.append (
            [pages[startPage].path, topX, bottomX]  
        )
        return 

    currentAnsList.append (
        [pages[startPage].path, max(startBox.xMin - padding, 0), pages[startPage].h-1]   
    ) 

    for i in range (startPage+1, endPage): 
        currentAnsList.append (
            [pages[i].path , 0, pages[i].h-1]  
        ) 

    currentAnsList.append (
            [pages[endPage].path, 0, min(pages[endPage].h-1, endBox.xMin + padding)]  
        )    

  def _insert (self, box, pages, boxNext=None): #box and character 

    dest = box.ocr  
    temp = self.curr 
    
    while (dest not in temp.children) and temp!=self.root:  
      temp = temp.parent 
    
    if (dest not in temp.children): 
      return  
    
    self.curr = temp.children[dest] 

    if (len(self.curr.children) != 0): 
      return 

    self.addPageDetailsToNode (self.curr.snippet, pages, box, boxNext) 
  
  def validate(self, nextBox):
    dest = nextBox.ocr
    temp = self.curr
    
    while (dest not in temp.children) and temp!=self.root:  
      temp = temp.parent 
    
    if (dest not in temp.children): 
      return False
    
    return True

  def processAnswerScript (self, pages, boxes): 

    boxes.sort() 
    self.reset() 

    curBox = boxes[0]
    for i in range (len(boxes)-1): 
      if(self.validate(boxes[i+1])):
        self._insert (curBox, pages, boxes[i+1])
        curBox = boxes[i+1] 
    self._insert (curBox, pages)  

  
  def constructSubtree (self, qpJsonDict, node): 

    # if not isinstance(qpJsonDict, dict): 
    #   return 

    for key in  qpJsonDict.keys(): 

      child = AnswerTreeNode() 
      child.parent = node 
      node.children[key] = child 
      self.constructSubtree (qpJsonDict[key], child) 
      
    return 
    
  def disp(self, node, questionNumber=""): 

    if (len(node.children) == 0): 
      print (questionNumber, node.snippet) 
      return 

    for key in node.children.keys(): 

      self.disp (node.children[key], questionNumber + key)


  def buildDict(self, node=None, questionNumber=""): 
    if node is None:
      node = self.root
      
    subDict = {}
    if (len(node.children) == 0): 
      return node.snippet

    for key in node.children.keys(): 
      subDict[key] = self.buildDict (node.children[key], questionNumber + key)
    return subDict      

  def buildGradeTree(self, node=None, questionNumber=""): 
    if node is None:
      node = self.root
      
    subDict = {}
    if (len(node.children) == 0): 
      return ["",0,0,node.snippet]

    for key in node.children.keys(): 
      subDict[key] = self.buildDict (node.children[key], questionNumber + key)
    return subDict     