"""
settngs/production.py
Production settings for lensplease.
"""

import os

from .common import *

DEBUG = False
TEMPLATE_DEBUG = False

ALLOWED_HOSTS = [
    '162.243.116.167',
    'uchicago.wherearemyclasses.com',
	]
	
DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql_psycopg2',
                'NAME': 'wamc',
                'USER': 'WAMC',
                'PASSWORD': os.environ["PROD_DB_PASS"],
                'HOST': 'localhost',
                'PORT': '',
            }
        }
        
SECRET_KEY = os.environ["PROD_SECRET_KEY"]


