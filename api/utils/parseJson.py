import json 

def dfs (submissionDict, question_number): 
    
    if not isinstance (submissionDict, dict):
        print (question_number, submissionDict[1]) 
        return     

    for key in submissionDict.keys(): 
        question_number.append (key) 
        dfs (submissionDict[key], question_number)     
        question_number.pop() 
    
with open('getSubmissionTest.json') as f:
  data = json.load(f) 

submissions = data["submissions"] 
for submission in submissions: 

    print (submission["submission_id"]) 
    
    question = list() 
    dfs (submission["submission"], question)  