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
                if (resourceView.chart_type == 'Table Chart' ||
                    resourceView.chart_type == 'Simple Chart') {
                    textChartBuilder(elementId, resourceView, data);
                } else {
                    c3.generate(chartBuilder(elementId, resourceView, data));
                }
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
            x_fields = resourceView.x_fields,
            legend = (resourceView.legend == 'hide') ? {show: false} : {position: resourceView.legend,
                                                                        item: {
                                                                            onclick: function(id) {}
                                                                        }};
                                                                        
        var labelX = resourceView.measure_unit_x;
        var labelY = resourceView.measure_unit_y;
        var positionX = 'outer-middle';
        var positionY = 'outer-middle';
        
        switch (chart_type) {
            case 'Pie Chart':
                chart_type = 'pie';
                break;
            case 'Donut Chart':
                chart_type = 'donut';
                break;
            case 'Bar Chart':
                chart_type = 'bar';
                positionY = 'outer-center';
                break;
            case 'Stacked Bar Chart':
                chart_type = 'bar';
                break;
            case 'Line Chart':
                chart_type = 'line';
                break;
            case 'Spline Chart':
                chart_type = 'spline';
                positionX = 'outer-center';
                break;
        }

        if (!Array.isArray(key_fields)) {
            key_fields = [key_fields];
        }

        if (Array.isArray(x_fields)) {
            for (i = 0; i < data.length; i++) {
                for (j = 0; j < x_fields.length; j++) {
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

        console.log(resourceView.remap_key)
        if (resourceView.remap_key != '') {
            var remap_data = [],
                remap_key_fields = [],
                tmp_object = {},
                remap_field = resourceView.remap_key;
            for (i in data) {
                tmp_object[data[i][remap_field]] = data[i][key_fields];
                remap_data.push(tmp_object);
                remap_key_fields.push(data[i][remap_field]);
            }
            data = remap_data;
            key_fields = remap_key_fields;
        }

        console.log(resourceView);
        console.log(data);

        return {
            bindto: elementId,
            data: {
                json: data,
                keys: {
                    value: key_fields
                },
                type: chart_type,
                groups: resourceView.chart_type != 'Stacked Bar Chart' || [key_fields],
                labels: !! resourceView.data_labels
            },
            padding: {
                bottom: 16
            },
            axis: {
                x: {
                    type: 'category',
                    categories: x_list,
                    tick: {
                        culling: false,
                        fit: true,
                        centered: true,
                        format: function (d) {
                            var measureUnit = resourceView.measure_unit_x;
                            if (measureUnit) return x_list[d];
                            return x_list[d];
                        }
                    },
                    label: {
                    	text: labelX,
                    	position: positionX
                    }
                },
                y: {
                    tick: {
                        format: function(d) {
                            var measureUnit = resourceView.measure_unit_y;
                            if (measureUnit) return d;
                            return d;
                        }
                    },
                    label: {
                    	text: labelY,
                    	position: positionY
                    }
                },
                rotated: !! resourceView.rotated
            },
            color: {
                pattern: resourceView.color_scheme.split(',')
            },
            grid: {
                x: {
                    show: !! resourceView.x_grid
                },
                y: {
                    show: !! resourceView.y_grid
                }
            },
            legend: legend
        }
    }

    function textChartBuilder(elementId, resourceView, data) {

        function buildTable(resourceView, data) {
            var rowheaders = $('<tr />'),
                rowdata = $('<tr />'),
                datalength = data.length,
                i = datalength - 4;

            for (i; i < datalength; i++) {
                rowheaders.append(
                    $('<td />')
                        .text(data[i][resourceView.x_fields])
                );
                rowdata.append(
                    $('<td />')
                        .text(data[i][resourceView.key_fields])
                )
            }

            return $('<table />')
                .addClass('table')
                .addClass('table-bordered')
                .addClass('table-striped')
                .addClass('chart-table')
                .append(
                    $('<thead />')
                        .append(
                            $('<tr />')
                                .append(
                                    $('<th colspan="4" \>')
                                        .text(resourceView.key_fields)
                                )
                        )
                )
                .append(
                    $('<tbody />')
                        .append(rowheaders)
                        .append(rowdata)
                );
        }

        var keyField = resourceView.key_fields,
            tableNumber = 0,
            datalength = data.length,
            i = datalength - 4,
            measureUnit = resourceView.measure_unit,
            header = resourceView.header,
            triangle;

        switch (resourceView['text_chart_number_action']) {
            case 'average':
                for (i = 0; i < datalength; i++) {
                    tableNumber += Number(data[i][keyField]);
                }
                tableNumber = Math.round((tableNumber / datalength) * 100) / 100;
                break;
            case 'substract':
                tableNumber = data[datalength - 1][keyField] - data[datalength - 2][keyField];
                tableNumber = Math.round(tableNumber * 100) / 100;
                if (tableNumber > 0) {
                    triangle = $('<img src="/triangle-up.png" width="45px" style="padding-left: 24px; padding-bottom:35px" />');
                } else if (tableNumber < 0) {
                    triangle = $('<img src="/triangle-down.png" width="45px" style="padding-left: 24px; padding-bottom:0px" />')
                } else {
                    triangle = $('<div />');
                }
                break;
            case 'last':
                tableNumber = data[datalength - 1][keyField];
                break;
        }

        if (!header) {
            header = keyField;
        }

        if (measureUnit) {
            tableNumber = tableNumber + measureUnit;
        }

        var textChart = $('<div class="textChart" />')
            .append(
                $('<div />')
                    .addClass('text-center')
                    .addClass('table-number')
                    .text(tableNumber)
                    .append(triangle)
            );


        if (resourceView.chart_type == 'Table Chart') {
            textChart.append(buildTable(resourceView, data));
        }

        $(elementId)
            .addClass('c3chart')
            .append(textChart);
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