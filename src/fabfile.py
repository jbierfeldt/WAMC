from __future__ import with_statement
from fabric.api import *
from fabric.contrib.console import confirm

env.hosts = ['lensplease@dev.lensplease.com']

def test():
    with settings(warn_only=True):
        result = local("python manage.py test --settings=lensplease.settings.development", capture=True)
    if result.failed and not confirm("Tests failed. Continue anyway?"):
        abort("Aborting at user request.")

def commit():
    local("git add -p && git commit")

def push():
    local("git push")

def prepare_deploy():
    test()
    commit()
    push()

def deploy():
    code_dir = "/webapps/dev.lensplease/lensplease/"
    with cd(code_dir):
        run("git pull")
        run("touch /webapps/dev.lensplease/lensplease/lensplease/lensplease/wsgi.py")
