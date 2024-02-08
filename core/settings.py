import os
import socket
from multiprocessing import cpu_count
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY", "secret_key_123")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG") is not None

ENVIRONMENT = os.getenv("ENVIRONMENT") or "production"


ALLOWED_HOSTS = [".localhost", "127.0.0.1", "[::1]"]

# Enable functionality with specific IPs
#   e.g.) debug_toolbar only shows if website accessed from INTERNAL_IPS
INTERNAL_IPS = ["127.0.0.1"]

if ENVIRONMENT == "development":
    CORS_ALLOWED_ORIGIN_REGEXES = [
        r"^http:\/\/localhost:*([0-9]+)?$",
        r"^https:\/\/localhost:*([0-9]+)?$",
        r"^http:\/\/127.0.0.1:*([0-9]+)?$",
        r"^https:\/\/127.0.0.1:*([0-9]+)?$",
    ]

    CORS_ALLOW_CREDENTIALS = True

    # wildcard for ports?
    CSRF_TRUSTED_ORIGINS = ["http://localhost:5173"]
    
    # SESSION_COOKIE_SAMESITE = "None"


if os.getenv("DOCKER_CONTAINER") and DEBUG:
    hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
    INTERNAL_IPS = [ip[: ip.rfind(".")] + ".1" for ip in ips] + [
        "127.0.0.1",
        "10.0.2.2",
    ]

# see api/models
PRODUCTION_URL = os.getenv("PRODUCTION_URL") if ENVIRONMENT == "production" else "http://localhost"

# Application definition
INSTALLED_APPS = [
    "daphne",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    "debug_toolbar",
    "rest_framework",
    "django_celery_results",
    "corsheaders",
    "core",
    "api",
    "frontend",
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"
ASGI_APPLICATION = "core.asgi.application"


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases
if os.getenv("DOCKER_COMPOSE"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("POSTGRES_DB"),
            "USER": os.getenv("POSTGRES_USER"),
            "PASSWORD": os.getenv("POSTGRES_PASSWORD"),
            "HOST": "postgres",
            "PORT": "5432",
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# defaults cache to local memory
if os.getenv("DOCKER_COMPOSE"):
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": "redis://redis:6379/0",
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
            },
        }
    }


# defaults session storage to db
if os.getenv("DOCKER_COMPOSE"):
    SESSION_ENGINE = "django.contrib.sessions.backends.cached_db"


if os.getenv("DOCKER_COMPOSE"):
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [("redis", 6379)],
            },
        },
    }
else:
    CHANNEL_LAYERS = {"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}}


AUTH_USER_MODEL = "api.User"

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "local": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "s3": {
        "BACKEND": "storages.backends.s3.S3Storage",
        "OPTIONS": {
            # To do...
            # https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html
        },
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        # Compression w/o caching
        # "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Celery Configuration Options
if os.getenv("DOCKER_COMPOSE"):
    CELERY_BROKER_URL = "redis://redis:6379/0"
    CELERY_RESULT_BACKEND = "django-cache"
else:
    CELERY_BROKER_URL = "sqla+sqlite:///" + os.path.join(BASE_DIR, "db.sqlite3")
    CELERY_RESULT_BACKEND = "django-db"

# CELERY_TIMEZONE = "Australia/Tasmania"
# CELERY_TASK_TRACK_STARTED = True
# CELERY_TASK_TIME_LIMIT = 30 * 60
CELERY_WORKER_CONCURRENCY = (
    2 if ENVIRONMENT == "development" else cpu_count()
)
