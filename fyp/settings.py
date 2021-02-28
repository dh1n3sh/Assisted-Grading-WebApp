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

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

HANDWRITING_MODELS_DIR = os.path.join(BASE_DIR, 'uploads/handwriting/models/')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '7@--w3s7xqct^p=*_e4er%i9yf3=u44py8rxpbjsx!73w(2t^@'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

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
    'api.jobs'
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
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware'
]

ROOT_URLCONF = 'fyp.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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
]

# CORS_ORIGIN_WHITELIST = (
#     'https://localhost:3000'
# )
