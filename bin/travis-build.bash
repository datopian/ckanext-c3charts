#!/usr/bin/env bash
set -e

echo "This is travis-build.bash..."

echo "Installing the packages that CKAN requires..."
sudo apt-get update -qq
sudo apt-get install postgresql-$PGVERSION solr-jetty

echo "Installing CKAN and its Python dependencies..."
git clone https://github.com/ckan/ckan
cd ckan
git checkout "ckan-2.7.2"
python setup.py develop
# Travis has an issue with older version of psycopg2 (2.4.5)
sed -i 's/psycopg2==2.4.5/psycopg2==2.7.3.2/' requirements.txt
pip install -r requirements.txt
pip install -r dev-requirements.txt
pip install coveralls
cd -

echo "Creating the PostgreSQL user and database..."
sudo -u postgres psql -c "CREATE USER ckan_default WITH PASSWORD 'pass';"
sudo -u postgres psql -c 'CREATE DATABASE ckan_test WITH OWNER ckan_default;'

echo "Initialising the database..."
cd ckan
paster --plugin ckan db init -c test-core.ini
cd -

sudo -E -u postgres ckan/bin/postgres_init/2_create_ckan_datastore_db.sh

sed -i -e 's/.*datastore.read_url.*/ckan.datastore.read_url = postgresql:\/\/datastore_default:pass@\/datastore_test/' ckan/test-core.ini
paster datastore -c ckan/test-core.ini set-permissions | sudo -u postgres psql

echo "Installing ckanext-charts and its requirements..."
python setup.py develop
pip install -r dev-requirements.txt

echo "travis-build.bash is done."
