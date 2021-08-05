# Assisted-Grading-WebApp
This repo contains the webapp for assisted grading.   
The backend API is build using Django and the Frontend is build using ReactJS. Both the components are prensent in the root of the repo.     
The [src](https://github.com/dh1n3sh/Assisted-Grading-WebApp/tree/master/src) folder contains the code for the frontend.    
The [api](https://github.com/dh1n3sh/Assisted-Grading-WebApp/tree/master/api) is a [Django app](https://docs.djangoproject.com/en/3.2/ref/applications/) that contains the API that the frontend calls.      
The MMDET Model that detects answer numbers is served in a seperate API because the model takes up a lot of resource and needs a GPU. So, the webapp and the model can be deployed in separate servers. The API can be found [here](https://github.com/dh1n3sh/Assisted-Grading-MMDET-API).   

## Demo
- To mock the [Assisted-Grading-MMDET-API](https://github.com/dh1n3sh/Assisted-Grading-MMDET-API/) API set `MOCK_GRADE_TREE` env variable to True. `export MOCK_GRADE_TREE=TRUE`
- A sample Snapshot of the DB is available in repo. This can be loaded by using the following commands.
     - `./manage.py flush`
     - `./manage.py loaddata media/fixtures/dump.json` 
- The handwriting model for the student should be uploaded 


## Development
1. Create a venv
2. `pip install -r requirements.txt` This also includes the requirements for the [Assisted-Grading-MMDET-API](https://github.com/dh1n3sh/Assisted-Grading-MMDET-API/). The requirements might be different based on the system. For example, the requirements contains torch version comptatible with CUDA 11.1. 
3. Run the [Assisted-Grading-MMDET-API](https://github.com/dh1n3sh/Assisted-Grading-MMDET-API/).
4. Build the ReactJs files. `yarn build`
5. Run django server. `python manage.py runserver`


