# -*- coding: utf-8 -
import json
import logging

try:
    # CKAN 2.7 and later
    from ckan.common import config
except ImportError:
    # CKAN 2.6 and earlier
    from pylons import config

import ckan.logic as l

from ckanext.datastore.db import (_get_engine, _get_fields_types, _PG_ERR_CODE, _get_unique_key)
from sqlalchemy.exc import ProgrammingError, DBAPIError
from collections import OrderedDict
from datetime import datetime, date, time

DATE_FORMAT = '%Y-%m-%d'
TIME_FORMAT = '%H:%M'

log = logging.getLogger(__name__)

def _format_results(types, results):
    records = []
    for result in results:
        _ = OrderedDict()
        for k, v in zip(types, result):
            if isinstance(v, (datetime, date, time)):
                _.update({k.encode('utf-8'): v.strftime(
                    '{0} {1}'.format(DATE_FORMAT,
                                     TIME_FORMAT))
                })
            else:
                _.update({k.encode('utf-8'): v})
        records.append(_)
    return records

def _search_sql(context, data_dict):
    # Setup DataStore connection with read-only user
    data_dict['connection_url'] = config.get('ckan.datastore.read_url')
    engine = _get_engine(data_dict)
    context['connection'] = engine.connect()

    _types = _get_fields_types(context, data_dict)
    fields = map(lambda i: i, _types)
    fields.remove('_id')

    records = []
    try:
        context['connection'].execute(u'SET LOCAL statement_timeout TO {0}'.format(60000))
        sql_string = data_dict['sql_expression']
        records = context['connection'].execute(sql_string).fetchall()
    except ProgrammingError as e:
        log.error('ProgrammingError: %r', e)
    except DBAPIError, e:
        log.error('DBAPIError: %r', e)
    except Exception as e:
        log.error('GeneralException: %r', e)
    finally:
        context['connection'].close()

    return _format_results(fields, records)

@l.side_effect_free
def resource_view_sql_search(context, data_dict):
    return _search_sql(context, data_dict)