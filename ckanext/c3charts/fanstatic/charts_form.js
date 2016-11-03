ckan.module('c3charts_form', function ($, _) {
    "use strict";

    function appropriateControls(chartType) {
        if (chartType == 'Pie Chart' ||
            chartType == 'Donut Chart') {
            $('#x-fields').hide();
            $('#table-chart').hide();
            $('#remap-key').show();
        } else if (chartType == 'Table Chart' ||
                   chartType == 'Simple Chart') {
            $('#x-fields').show();
            $('#table-chart').show();
            $('#remap-key').hide();
        } else {
            $('#x-fields').show();
            $('#table-chart').hide();
            $('#remap-key').hide();
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
                for (i = 0; i < key_fields.length; i++) {
                    if(i == 0) {
                        var currentDiv = $('[id=\'key_fields_' + key_fields[i] + '\']').parents('div.key_field');
                        currentDiv.insertBefore('div.key_field:first');
                    } else {
                        var currentDiv = $('[id=\'key_fields_' + key_fields[i] + '\']').parents('div.key_field');
                        var previousDiv =$('[id=\'key_fields_' + key_fields[i-1] + '\']').parents('div.key_field');
                        currentDiv.insertAfter(previousDiv);
                    }
                    $('[id=\'key_fields_' + key_fields[i] + '\']').prop('checked', 'True');
                }
            } else {
                $('[id=\'key_fields_' + key_fields + '\']').prop('checked', 'True');
            }

            if (Array.isArray(x_fields)) {
                for (i = 0; i < x_fields.length; i++) {
                    if(i == 0) {
                        var currentDiv = $('[id=\'x_fields_' + x_fields[i] + '\']').parents('div.x_field');
                        currentDiv.insertBefore('div.x_field:first');
                    } else {
                        var currentDiv = $('[id=\'x_fields_' + x_fields[i] + '\']').parents('div.x_field');
                        var previousDiv =$('[id=\'x_fields_' + x_fields[i-1] + '\']').parents('div.x_field');
                        currentDiv.insertAfter(previousDiv);
                    }
                    $('[id=\'x_fields_' + x_fields[i] + '\']').prop('checked', 'True');
                }
            } else {
                $('[id=\'x_fields_' + x_fields + '\']').prop('checked', 'True');
            }

            var colorSchemes = {pallete1: ['#9999FF', '#B579F2'],
                                pallete2: ['#8888AA', '#888811']};
            $.each(colorSchemes, function () {
                $('#colors_select').append($("<option><div style='background: colorSchemes[value][0]'>AA</div></option>"));
            });

            $('#chart_base_color').change(function() {

                var hex = '#' + $('#chart_base_color').val();
                var base = new KolorWheel(hex);
                var target = base.abs('#141314', 12);
                var color_scheme = [];

                target.each(function() {
                    color_scheme.push(this.getHex());
                });
                $('#color_scheme').val(color_scheme.toString());

            });

            $('.sortable').sortable({
                cursorAt: { left: 5 },
                axis: 'y',
                placeholder: 'sortable-placeholder'
            });
        }
    }
});