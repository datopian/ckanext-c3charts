import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
import logging

logger = logging.getLogger(__name__)
not_empty = plugins.toolkit.get_validator('not_empty')
ignore_missing = plugins.toolkit.get_validator('ignore_missing')
ignore_empty = plugins.toolkit.get_validator('ignore_empty')


class ChartsPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer, inherit=True)
    plugins.implements(plugins.IResourceView, inherit=True)

    # IConfigurer

    def update_config(self, config):
        toolkit.add_template_directory(config, 'templates')
        toolkit.add_public_directory(config, 'public')
        toolkit.add_resource('fanstatic', 'c3charts')

    def info(self):
        schema = {
            'chart_base_color': [not_empty],
            'chart_type': [not_empty],
            'key_fields': [not_empty],
            'x_fields': [ignore_missing],
            'color_scheme': [not_empty],
            'header': [ignore_missing],
            'measure_unit_x': [ignore_missing],
            'measure_unit_y': [ignore_missing],
            'text_chart_number_action': [not_empty],
            'legend': [not_empty],
            'rotated': [ignore_missing],
            'data_labels': [ignore_missing],
            'x_grid': [ignore_missing],
            'y_grid': [ignore_missing],
            'remap_key': [ignore_missing],
            'aggregate': [ignore_missing]
        }

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

        fields = _get_fields_without_id(resource)
        remap_keys = list(fields)
        remap_keys.insert(0, {'value': ''})
        logger.debug(remap_keys)

        return {'resource': resource,
                'resource_view': resource_view,
                'fields': fields,
                'remap_keys': remap_keys,
                'chart_types': [{'value': 'Bar Chart'},
                                {'value': 'Stacked Bar Chart'},
                                {'value': 'Donut Chart'},
                                {'value': 'Line Chart'},
                                {'value': 'Pie Chart'},
                                {'value': 'Spline Chart'},
                                {'value': 'Table Chart'},
                                {'value': 'Simple Chart'}],
                'default_color_scheme': '#FFDF12,#B9F10B,#5DD214,#1DB51C,#219B4E,#25826A,#27636B,#263E56,#242842,#252131,#1F1B22,#141314',
                'text_chart_number_actions': [{'value': 'substract',
                                               'text': 'Substract last two entries'},
                                              {'value': 'average',
                                               'text': 'Average'},
                                              {'value': 'last',
                                               'text': 'Show last'}],
                'legend_options': [{'text': 'Hide', 'value': 'hide'},
                                     {'text': 'Right', 'value': 'right'},
                                     {'text': 'Bottom', 'value': 'bottom'}]
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
