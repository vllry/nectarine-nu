#!/usr/bin/python3
#THING I LEARNED THE HARD WAY:
#	Don't call this file yoyo.py

from yoyo import read_migrations, get_backend
from os import path
import json

with open('config.json') as data_file:
    config = json.load(data_file)


backend = get_backend('mysql://'+config['mysql']['user']+':'+config['mysql']['password']+'@'+config['mysql']['host']+'/'+config['mysql']['database'])
here = path.dirname(path.realpath(__file__))
migrations = read_migrations(path.join(here, '../yoyo'))
backend.apply_migrations(backend.to_apply(migrations))
