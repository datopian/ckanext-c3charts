import mock
import ckan.plugins as p

try:
    # CKAN 2.7 and later
    from ckan.common import config
except ImportError:
    # CKAN 2.6 and earlier
    from pylons import config


class BaseTest(object):
    @classmethod
    def setup_class(cls):
        p.load('c3charts')
        p.load('datastore')
        cls.plugin = p.get_plugin('c3charts')

    def setup(self):
        pass

    @classmethod
    def teardown_class(cls):
        p.unload('c3charts')
        p.unload('datastore')

    def _setup_template_variables(self, resource=None, resource_view={}):
        if resource is None:
            resource = {'id': 'id'}
        context = {}
        data_dict = {
            'resource': resource,
            'resource_view': resource_view
        }
        return self.plugin.setup_template_variables(context, data_dict)


class TestChartBuilder(BaseTest):
    def test_view_template_is_correct(self):
        view_template = self.plugin.view_template({}, {})
        assert view_template == 'charts_view.html', view_template

    def test_form_template_is_correct(self):
        form_template = self.plugin.form_template({}, {})
        assert form_template == 'charts_form.html', form_template

    def test_schema_exists(self):
        schema = self.plugin.info()['schema']
        assert schema is not None, schema

    def test_schema_has_legend(self):
        schema = self.plugin.info()['schema']
        legend = schema.get('legend')
        assert legend is not None, legend

    def test_schema_has_chart_type(self):
        schema = self.plugin.info()['schema']
        chart_type = schema.get('chart_type')
        assert chart_type is not None, chart_type

    def test_schema_has_x_label_position(self):
        schema = self.plugin.info()['schema']
        x_label_position = schema.get('x_label_position')
        assert x_label_position is not None, x_label_position

    def test_schema_has_y_label_position(self):
        schema = self.plugin.info()['schema']
        y_label_position = schema.get('y_label_position')
        assert y_label_position is not None, y_label_position

    def test_schema_has_x_tick_count(self):
        schema = self.plugin.info()['schema']
        x_tick_count = schema.get('x_tick_count')
        assert x_tick_count is not None, x_tick_count

    def test_schema_has_y_tick_count(self):
        schema = self.plugin.info()['schema']
        y_tick_count = schema.get('y_tick_count')
        assert y_tick_count is not None, y_tick_count

    def test_schema_has_measure_unit_x(self):
        schema = self.plugin.info()['schema']
        measure_unit_x = schema.get('measure_unit_x')
        assert measure_unit_x is not None, measure_unit_x

    def test_schema_has_measure_unit_y(self):
        schema = self.plugin.info()['schema']
        measure_unit_y = schema.get('measure_unit_y')
        assert measure_unit_y is not None, measure_unit_y

    @mock.patch('ckan.plugins.toolkit.get_action')
    def test_template_variables(self, _):
        resource = {
            'id': 'resource_id',
        }

        template_variables = self._setup_template_variables(resource)
        assert 'resource' in template_variables
        assert 'resource_view' in template_variables
        assert 'remap_keys' in template_variables
        assert 'chart_types' in template_variables
        assert 'fields' in template_variables
        assert 'legend_options' in template_variables
        assert 'text_chart_number_actions' in template_variables
        assert 'x_label_position_opts' in template_variables
        assert 'y_label_position_opts' in template_variables
