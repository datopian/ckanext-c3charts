ckan.module('c3charts_builder', function ($, _) {
    "use strict";

    return {
        initialize: function () {
            var self = this,
                endpoint = self.options.endpoint || self.sandbox.client.endpoint + "/api",
                resourceView = self.options.resourceView,
                elementId = "#" + self.el['0'].id,
                resource = {
                    id: self.options.resourceId,
                    endpoint: endpoint
                };
            ckan.views.c3charts.init(elementId, resource, resourceView);
        }
    }
});