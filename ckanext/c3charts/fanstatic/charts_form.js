ckan.module('c3charts_form', function ($, _) {
    "use strict";

    function appropriateControls(chartType) {
        if (chartType == 'Pie Chart' ||
            chartType == 'Donut Chart') {
            $('#x_fields_label').hide();
            $('#x_fields_container').hide();
        } else {
            $('#x_fields_label').show();
            $('#x_fields_container').show();
        }
    }

    return {
        initialize: function () {
            var i = 0,
                self = this,
                key_fields = self.options.controls.key_fields,
                x_fields = self.options.controls.x_fields;

            appropriateControls($('#chart_type option:selected').text());
            $('#chart_type').change(function() {
                appropriateControls($('#chart_type option:selected').text());
            });

            if (Array.isArray(key_fields)) {
                for (i in key_fields) {
                    $('[id=\'key_fields_' + key_fields[i] + '\']').prop('checked', 'True');
                }
            } else {
                $('[id=\'key_fields_' + key_fields + '\']').prop('checked', 'True');
            }

            if (Array.isArray(x_fields)) {
                for (i in x_fields) {
                    $('[id=\'x_fields_' + x_fields[i] + '\']').prop('checked', 'True');
                }
            } else {
                $('[id=\'x_fields_' + x_fields + '\']').prop('checked', 'True');
            }
        }
    }
});