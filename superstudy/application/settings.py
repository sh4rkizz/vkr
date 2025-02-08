import os
from configparser import RawConfigParser, ExtendedInterpolation
from django.utils.translation import gettext_lazy as t


config = RawConfigParser(interpolation=ExtendedInterpolation())

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLATFORM_NAME = 'kra'

config_path = os.path.join(BASE_DIR, 'config', '{}.conf'.format(PLATFORM_NAME))
config.read(config_path, encoding='utf-8')

DEBUG = config.getboolean('common', 'debug', fallback=False)
SECRET_KEY = config.get('common', 'secret_key', fallback='!SECRET_KEY!')


ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core',
    'attachment',
    'study',
    'stages',
    'mgmt',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'application.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, "templates"),
        ],
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

WSGI_APPLICATION = 'application.wsgi.application'

AUTH_USER_MODEL = 'core.User'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
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
LANGUAGE_CODE = 'ru'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

DEFAULT_LANG = 'ru'

LANGUAGES = (
    ('ru', t('Русский')),
    ('en', t('Английский'))
)

LANGUAGE_COOKIE_NAME = 'CurrentLang'

MODELTRANSLATION_FALLBACK_LANGUAGES = {
    'default': ('ru', 'en'),
}


# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "core/static/"),
    'static/',
]
