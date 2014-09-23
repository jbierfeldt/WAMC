"""
settngs/development.py
Development settings for wherearemyclasses.

The development environment is light and local. All data is stored underneath
the development virtualenv.
"""
import os

from common import *

DEBUG = True
TEMPLATE_DEBUG = DEBUG

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "wamc",
        "USER": "",
        "PASSWORD": "",
        "HOST": "localhost",
        "PORT": "",
    }
}

INSTALLED_APPS += ("debug_toolbar", )
INTERNAL_IPS = ("127.0.0.1",)
MIDDLEWARE_CLASSES += ("debug_toolbar.middleware.DebugToolbarMiddleware", )
SECRET_KEY = 's'

if 'WAMC_CONFIG_PATH' in os.environ:
    execfile(os.environ['WAMC_CONFIG_PATH'])
