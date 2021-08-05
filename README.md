# Assisted-Grading-WebApp
This repo contains the webapp for assisted grading.   
The backend API is build using Django and the Frontend is build using ReactJS. Both the components are prensent in the root of the repo. 
The [src](https://github.com/dh1n3sh/Assisted-Grading-WebApp/tree/master/src) folder contains the code for the frontend.
The [api](https://github.com/dh1n3sh/Assisted-Grading-WebApp/tree/master/api) is a [Django app](https://docs.djangoproject.com/en/3.2/ref/applications/) that contains the API that the frontend calls.  


## Demo
 
## Setup
pip install -r requirements.txt   
export MOCK_GRADE_TREE=TRUE   

./manage.py flush   
./manage.py loaddata media/fixtures/dump.json    

pip install torch==1.8.1+cu111 torchvision==0.9.1+cu111 torchaudio==0.8.1 -f https://download.pytorch.org/whl/torch_stable.html --no-cache-dir   
pip install mmcv-full -f https://download.openmmlab.com/mmcv/dist/cu111/torch1.8.0/index.html
## Development

## Dependecies

## Known Issues

