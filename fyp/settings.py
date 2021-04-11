"""
Django settings for fyp project.

Generated by 'django-admin startproject' using Django 3.1.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

from pathlib import Path
import os
import django_heroku
import boto3
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

HANDWRITING_MODELS_DIR = os.path.join(BASE_DIR, 'models/handwriting/')
MMDET_CONFIG = os.path.join(BASE_DIR, 'models/mmdet_answerscript/full_config.py')
MMDET_CHECKPOINT = os.path.join(BASE_DIR, 'models/mmdet_answerscript/epoch_12.pth')
if not os.environ.get('MOCK_GRADE_TREE') == 'TRUE':
    AWS_SESSION = boto3.Session(profile_name='textract')
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '7@--w3s7xqct^p=*_e4er%i9yf3=u44py8rxpbjsx!73w(2t^@'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# AWS S3 SETTINGS
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
AWS_URL = os.environ.get('AWS_URL')
AWS_DEFAULT_ACL = None
USE_S3 = os.getenv('USE_S3') == 'TRUE'

# AWS_S3_REGION_NAME = 'us-east-2'
# AWS_S3_SIGNATURE_VERSION = 's3v4'
# ALLOWED_HOSTS = ["*"]
ALLOWED_HOSTS = ['0.0.0.0', 'localhost', '127.0.0.1', 'assisted-grading.herokuapp.com',
    'f1d2d3712e2a.ngrok.io']
# CORS_ORIGIN_ALLOW_ALL = True
# CORS_ALLOW_ALL_ORIGINS = True
# Application definition
from corsheaders.defaults import default_headers

CORS_ALLOW_HEADERS = list(default_headers) + [
    'Access-Control-Allow-Origin',
]
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000","https://f1d2d3712e2a.ngrok.io","https://dhinesh.ml"
]
CORS_ALLOW_CREDENTIALS = True
INSTALLED_APPS = [
    'api.apps.ApiConfig',
    'assisted_grading.apps.AssistedGradingConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_extensions',
    'corsheaders',
    'rest_framework',
    'django_q',
    'api.jobs',
    'storages',
    'api.utils',
]

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'fmt1': {
            'format': '[FMT1] %(asctime)-15s %(message)s',
        },
        'fmt2': {
            'format': '[FMT2] %(asctime)-15s %(message)s',
        }
    },
    'handlers': {
        'console1': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'fmt1',
        },
        'console2': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'fmt2',
        },
    },
    # First config for root logger: console1 -> fmt1
    'root': {
        'handlers': ['console1'],
        'level': 'DEBUG',
        'propagate': True,
    },
    'loggers': {
        # Second config for root logger: console2 -> fmt2
        '': {
            'handlers': ['console2'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Whitenoise Middleware
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware'
    
]

ROOT_URLCONF = 'fyp.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'fyp.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'fyp',
        'USER': 'fyp_admin',
        'PASSWORD': 'fyp_admin',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

if os.environ.get("REDIS_URL") is not None:
    Q_CLUSTER = {
        'name': 'django_q_django',
        # omitted for brevity  
        'label': 'Django Q',
        'redis': os.environ.get("REDIS_URL")
    }
else:
    Q_CLUSTER = {
        'redis': {
            'host': 'localhost',
            'port': 6379,
            'db': 0,
            'password': None,
            'socket_timeout': None,
            'charset': 'utf-8',
            'errors': 'strict',
            'unix_socket_path': None
        }
    }

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/uploads/'
STATICFILES_DIRS = [
    BASE_DIR / "uploads",
    "/segmented_images/"
]

# CORS_ORIGIN_WHITELIST = (
#     'https://localhost:3000'
# )
django_heroku.settings(locals())

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/
STATIC_URL = '/static/'
# Place static in the same location as webpack build files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'build/static'),os.path.join(BASE_DIR, 'public')]

# If you want to serve user uploaded files add these settings
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR,'media')

if USE_S3:
    MEDIA_URL = AWS_URL + '/media/'
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    print('using s3')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'