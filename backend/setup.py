import os
from setuptools import setup, find_packages

requires = [
    'pyramid',
    'pyramid_debugtoolbar',
    'waitress',
    'SQLAlchemy',
    'pyramid_tm',
    'transaction',
    'zope.sqlalchemy',
    'alembic',
    'bcrypt',
    'pyramid_jwt'
]

setup(
    name='backend',
    version='0.0',
    description='Backend Tugas Besar',
    author='',
    author_email='',
    url='',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main=backend:main',
        ],
    },
) 