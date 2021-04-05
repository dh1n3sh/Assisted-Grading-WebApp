release: python manage.py migrate
web: gunicorn fyp.wsgi --log-file -
worker: ./manage.py qcluster