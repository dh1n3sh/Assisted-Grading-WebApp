release: python manage.py migrate
web: gunicorn fyp.wsgi --log-file -
worker: python manage.py qcluster --settings=fyp/settings.py