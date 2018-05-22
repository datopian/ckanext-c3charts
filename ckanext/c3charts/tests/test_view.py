import ckan.plugins as p

from ckan.tests import helpers, factories


class TestChartView(helpers.FunctionalTestBase):

    @classmethod
    def setup_class(cls):

        super(TestChartView, cls).setup_class()

        if not p.plugin_loaded('c3charts'):
            p.load('c3charts')

        if not p.plugin_loaded('datastore'):
            p.load('datastore')

    @classmethod
    def teardown_class(cls):
        p.unload('c3charts')
        p.unload('datastore')

        super(TestChartView, cls).teardown_class()

        helpers.reset_db()

    @helpers.change_config('ckan.views.default_views', '')
    def test_view_shown_on_resource_page(self):
        app = self._get_test_app()

        dataset = factories.Dataset()
        sysadmin = factories.Sysadmin()

        resource = factories.Resource(package_id=dataset['id'],
                                      url='http://some.website.html',)

        datastore_resource = p.toolkit.get_action('datastore_create')(
           {'user': sysadmin.get('name')},
           {'resource_id': resource.get('id'), 'force': True}
        )

        resource_view = factories.ResourceView(
            resource_id=resource['id'],
            view_type='Chart builder',
            chart_type='Bar Chart',
            key_fields='foo,bar',
            x_fields='foo',
            color_scheme='#B80000',
            text_chart_number_action='average',
            legend='bottom',)

        response = p.toolkit.get_action('resource_view_show')(
            {'user': sysadmin.get('name')},
            {'id': resource_view.get('id')}
        )

        assert response.get('view_type') == 'Chart builder'
        assert response.get('chart_type') == 'Bar Chart'
        assert response.get('key_fields') == 'foo,bar'
        assert response.get('x_fields') == 'foo'
        assert response.get('color_scheme') == '#B80000'
        assert response.get('text_chart_number_action') == 'average'
        assert response.get('legend') == 'bottom'
