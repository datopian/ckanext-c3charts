import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
import ckan.logic as l
import logging

logger = logging.getLogger(__name__)
not_empty = plugins.toolkit.get_validator('not_empty')
ignore_missing = plugins.toolkit.get_validator('ignore_missing')
ignore_empty = plugins.toolkit.get_validator('ignore_empty')

try:
    # CKAN 2.7 and later
    from ckan.common import config
except ImportError:
    # CKAN 2.6 and earlier
    from pylons import config


class ChartsPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer, inherit=True)
    plugins.implements(plugins.IResourceView, inherit=True)
    plugins.implements(plugins.IActions)

    # IActions

    def get_actions(self):
        from ckanext.c3charts.actions import (resource_view_sql_search, )
        return {'resource_view_sql_search': resource_view_sql_search}

    # IConfigurer

    def update_config(self, config):
        toolkit.add_template_directory(config, 'templates')
        toolkit.add_public_directory(config, 'public')
        toolkit.add_resource('fanstatic', 'c3charts')

    def info(self):
        schema = {
            'chart_type': [not_empty],
            'key_fields': [not_empty],
            'x_fields': [ignore_missing],
            'header': [ignore_missing],
            'measure_unit_x': [ignore_missing],
            'measure_unit_y': [ignore_missing],
            'x_tick_count': [ignore_missing],
            'y_tick_count': [ignore_missing],
            'text_chart_number_action': [not_empty],
            'legend': [not_empty],
            'rotated': [ignore_missing],
            'data_labels': [ignore_missing],
            'x_grid': [ignore_missing],
            'y_grid': [ignore_missing],
            'remap_key': [ignore_missing],
            'aggregate': [ignore_missing],
            'sql_expression': [ignore_missing],
            'use_sql_keys': [ignore_missing],
            'y_label_position': [ignore_missing],
            'x_label_position': [ignore_missing]
        }
        map(lambda s: schema.update({'{0}_padding'.format(s): [ignore_missing]}), ('r', 'l', 't', 'b'))

        return {'name': 'Chart builder',
                'icon': 'bar-chart',
                'filterable': True,
                'iframed': False,
                'schema': schema}

    def can_view(self, data_dict):
        return data_dict['resource'].get('datastore_active', False)

    def setup_template_variables(self, context, data_dict):
        resource = data_dict['resource']
        resource_view = data_dict['resource_view']

        if 'sql_expression' in resource_view and \
                        resource_view['sql_expression'] not in (None, '', u''):
            _ = l.get_action('resource_view_sql_search') \
                (context, {
                    'sql_expression': resource_view['sql_expression'],
                    'resource_id': resource['id']})
            resource_view['sql_data'] = _['records']
            resource_view['sql_keys'] = _['fields']

        fields = _get_fields_without_id(resource)
        remap_keys = list(fields)
        remap_keys.insert(0, {'value': ''})

        return {
            'resource': resource,
            'resource_view': resource_view,
            'fields': fields,
            'remap_keys': remap_keys,
            'chart_types': [{'value': 'Bar Chart'},
                            {'value': 'Stacked Bar Chart'},
                            {'value': 'Donut Chart'},
                            {'value': 'Line Chart'},
                            {'value': 'Area-spline Chart'},
                            {'value': 'Pie Chart'},
                            {'value': 'Spline Chart'},
                            {'value': 'Table Chart'},
                            {'value': 'Simple Chart'}],
            'text_chart_number_actions': [{'value': 'substract',
                                           'text': 'Substract last two entries'},
                                          {'value': 'average',
                                           'text': 'Average'},
                                          {'value': 'last',
                                           'text': 'Show last'}],
            'legend_options': [{'text': 'Hide', 'value': 'hide'},
                               {'text': 'Right', 'value': 'right'},
                               {'text': 'Bottom', 'value': 'bottom'}],
            'x_label_position_opts': [{'text': 'Inner Right', 'value': 'inner-right'},
                                      {'text': 'Inner Center', 'value': 'inner-center'},
                                      {'text': 'Inner Left', 'value': 'inner-left'},
                                      {'text': 'Outer Right', 'value': 'outer-right'},
                                      {'text': 'Outer Center', 'value': 'outer-center'},
                                      {'text': 'Outer Left', 'value': 'outer-left'}],
            'y_label_position_opts': [{'text': 'Inner Top', 'value': 'inner-top'},
                                      {'text': 'Inner Middle', 'value': 'inner-middle'},
                                      {'text': 'Inner Bottom', 'value': 'inner-bottom'},
                                      {'text': 'Outer Top', 'value': 'outer-top'},
                                      {'text': 'Outer Middle', 'value': 'outer-middle'},
                                      {'text': 'Outer Bottom', 'value': 'outer-bottom'}]
        }

    def view_template(self, context, data_dict):
        return 'charts_view.html'

    def form_template(self, context, data_dict):
        return 'charts_form.html'


def _get_fields_without_id(resource):
    fields = _get_fields(resource)
    return [{'value': v['id']} for v in fields if v['id'] != '_id']


def _get_fields(resource):
    data = {
        'resource_id': resource['id'],
        'limit': 0
    }
    result = plugins.toolkit.get_action('datastore_search')({}, data)
    return result['fields']
