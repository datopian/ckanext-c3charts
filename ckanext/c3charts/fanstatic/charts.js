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
                console.log(chartBuilder(elementId, resourceView, data));
                c3.generate(chartBuilder(elementId, resourceView, data));
            } else {
                $(elementId).append("No keys defined");
            }
        });
    }

    function chartBuilder(elementId, resourceView, data) {
        var i, j,
            chart_type = resourceView.chart_type,
            x_list = [],
            key_fields = resourceView.key_fields,
            x_fields = resourceView.x_fields;

        console.log(data);

        if (chart_type === 'Pie Chart') chart_type = 'pie';
        else if (chart_type === 'Donut Chart') chart_type = 'donut';
        else if (chart_type === 'Bar Chart') chart_type = 'bar';
        else if (chart_type === 'Stacked Bar Chart') chart_type = 'bar';
        else if (chart_type === 'Line Chart') chart_type = 'line';
        else if (chart_type === 'Spline Chart') chart_type = 'spline';

        if (! Array.isArray(key_fields)) {
            key_fields = [key_fields];
        }

        if (Array.isArray(x_fields)) {
            for (i=0; i < data.length; i++){
                for (j=0; j < x_fields.length; j++) {
                    if (!x_list[i]) {
                        x_list[i] = data[i][x_fields[j]];
                    } else {
                        x_list[i] += '-' + data[i][x_fields[j]];
                    }
                }
            }
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
                type: chart_type,
                groups: resourceView.chart_type != 'Stacked Bar Chart' || [key_fields]
            },
            padding: {
                bottom: 16
            },
            axis: {
                x: {
                    tick: {
                        culling: false,
                        fit: false,
                        centered: true
                    },
                    type: 'category',
                    categories: x_list
                }
            },
            color: {
                pattern: resourceView.color_scheme.split(',')
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