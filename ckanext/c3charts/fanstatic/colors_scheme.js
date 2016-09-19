$(document).ready(function () {

    $('#chart_base_color').change(function() {

        var hex = '#' + $('#chart_base_color').val();

        var base = new KolorWheel(hex);
        var target = base.abs('#ede7f2', 9);
        var color_scheme = [];

        target.each(function() {
            color_scheme.push(this.getHex());
        });

       $('#color_scheme').val(color_scheme.toString());

    });
});

