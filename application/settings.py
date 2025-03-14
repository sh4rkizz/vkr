import os
from configparser import RawConfigParser, ExtendedInterpolation
from django.utils.translation import gettext_lazy as t


config = RawConfigParser(interpolation=ExtendedInterpolation())

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLATFORM_NAME = 'kra'

config_path = os.path.join(BASE_DIR, 'config', '{}.conf'.format(PLATFORM_NAME))
config.read(config_path, encoding='utf-8')

DEBUG = config.getboolean('common', 'DEBUG', fallback=False)
DEBUG_TOOLBAR = config.getboolean('common', 'DEBUG_TOOLBAR', fallback=False)
SECRET_KEY = config.get('common', 'SECRET_KEY', fallback='!SECRET_KEY!')
SITE_URL = config.get('common', 'SITE_URL', fallback='http://kra.localhost')


ALLOWED_HOSTS = ['*']

INTERNAL_IPS = ["127.0.0.1"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core',
    'attachments',
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

if DEBUG and DEBUG_TOOLBAR:
    INSTALLED_APPS.append('debug_toolbar')
    MIDDLEWARE.insert(1, 'debug_toolbar.middleware.DebugToolbarMiddleware')


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
                'core.context_processors.user_processor',
            ],
            'builtins': [
                'core.templatetags.common_tags',
            ]
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

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

# Minio

AWS_STORAGE_BUCKET_NAME = config.get('minio', 'BUCKET_NAME', fallback='kra')
AWS_ACCESS_KEY_ID = config.get('minio', 'ACCESS_KEY', fallback='admin')
AWS_SECRET_ACCESS_KEY = config.get('minio', 'SECRET_KEY', fallback='admin')
AWS_S3_ENDPOINT_URL = AWS_s3_endpoint_url = config.get('minio', 'ENDPOINT_URL', fallback=SITE_URL)


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
