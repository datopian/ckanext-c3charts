# Ckan Charts

## [![Build Status](https://travis-ci.org/ViderumGlobal/ckanext-c3charts.svg?branch=master)](https://travis-ci.org/ViderumGlobal/ckanext-c3charts)
## [![Coverage Status](https://coveralls.io/repos/github/ViderumGlobal/ckanext-c3charts/badge.svg?branch=master)](https://coveralls.io/github/ViderumGlobal/ckanext-c3charts?branch=master)

This extension provides chart library that enables deeper integration of charts into CKAN applications.

## Installation

To install ckanext-c3charts:

1. Activate your CKAN virtual environment, for example:

```
. /usr/lib/ckan/default/bin/activate
```

2. Install the ckanext-c3charts Python package into your virtual environment:

```
pip install ckanext-c3charts
```

3. Add ``c3charts`` to the ``ckan.plugins`` setting in your CKAN
   config file (by default the config file is located at
   ``/etc/ckan/default/production.ini``).

4. Restart CKAN. For example if you've deployed CKAN with Apache on Ubuntu:

```
sudo service apache2 reload
```


## Config Settings

These are the required configuration options used by the extension:
```

```

## Development Installation

To install ckanext-c3charts for development, activate your CKAN virtualenv
and do:

```
git clone https://github.com/ViderumGlobal/ckanext-c3charts.git
cd ckanext-c3charts
python setup.py develop
pip install -r dev-requirements.txt
```

## Running the Tests

To run the tests, first make sure that you have installed the required
development dependencies in CKAN, which can be done by running the following
command in the CKAN's `src` directory:

```
pip install -r dev-requirements.txt
```

After that just type this command to actually run the tests in the extension.

```
nosetests --ckan --with-pylons=test.ini
```
To run the tests and produce a coverage report, first make sure you have coverage installed in your virtualenv (pip install coverage) then run:

```
nosetests --nologcapture --with-pylons=test.ini --with-coverage --cover-package=ckanext.c3charts --cover-inclusive --cover-erase --cover-tests
```
