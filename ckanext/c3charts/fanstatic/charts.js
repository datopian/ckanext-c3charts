this.ckan = this.ckan || {};
this.ckan.views = this.ckan.views || {};
this.ckan.views.c3charts = this.ckan.views.c3charts || {};

(function (self, $) {
    "use strict";

    self.init = function init(elementId, resource, resourceView) {
        initPlot(elementId, resource, resourceView);
    };

    function initPlot(elementId, resource, resourceView) {
        var queryParams = generateQueryParams(resource, {});
        $.when(
            recline.Backend.Ckan.fetch(resource),
            recline.Backend.Ckan.query(queryParams, resource)
        ).done(function (fetch, query) {
            var fields = fetch.fields,
                data = query.hits;

            if (resourceView.key_fields) {
                var chart = c3.generate(chartBuilder(elementId, resourceView, data));
            } else {
                $(elementId).append("No keys defined");
            }
        });

    }

    function chartBuilder(elementId, resourceView, data) {
        var i, j,
            chartType = '',
            key_fields = resourceView.key_fields,
            x_fields = resourceView.x_fields,
            x_list = [],
            show_legends = resourceView.show_legends;

        if (resourceView.chart_type === 'Pie Chart') chartType = 'pie';
        if (resourceView.chart_type === 'Donut Chart') chartType = 'donut';
        if (resourceView.chart_type === 'Bar Chart') chartType = 'bar';
        if (resourceView.chart_type === 'Line Chart') chartType = 'line';
        if (resourceView.chart_type === 'Spline Chart') chartType = 'spline';

        if (Array.isArray(x_fields)) {

        } else {
            for (i in data) {
                x_list.push(data[i][x_fields]);
            }
        }

        return {
            bindto: elementId,
            data: {
                json: data,
                keys: {
                    value: key_fields
                },
                type: chartType
            },
            padding: {
                bottom: 16
            },
            axis: {
                x: {
                    tick: {
                        culling: true,
                        fit: false,
                        centered: true
                    },
                    type: 'category',
                    categories: x_list
                }
            }
        }
    }

    function generateQueryParams(resource, params) {
        var query = {
            filters: [],
            sort: [],
            size: 500
        };

        return query;
    }

})(this.ckan.views.c3charts, this.jQuery);