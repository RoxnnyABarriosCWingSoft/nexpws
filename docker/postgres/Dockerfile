FROM postgres:11

ONBUILD RUN psql -U nexpws -d nexpws -c "create extension unaccent;"
ONBUILD RUN psql -U nexpws -d nexpws -c "create extension uuid-ossp;"
