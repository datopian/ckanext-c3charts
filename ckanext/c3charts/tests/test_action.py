import mock
from ckan.tests import helpers, factories
from ckan import plugins


class ActionBase(object):
    @classmethod
    def setup_class(self):
        if not plugins.plugin_loaded('c3charts'):
            plugins.load('c3charts')

    def setup(self):
        helpers.reset_db()

    @classmethod
    def teardown_class(self):
        if plugins.plugin_loaded('c3charts'):
            plugins.unload('c3charts')


class TestCalendarActions(ActionBase):
    @mock.patch('ckan.plugins.toolkit.get_action')
    def test_resource_view_sql_search(self, _):
        pass
