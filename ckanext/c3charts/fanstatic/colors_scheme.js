$(document).ready(function () {

    $('#chart_base_color').change(function() {

        var hex = '#' + $('#chart_base_color').val();

        var base = new KolorWheel(hex);
        var target = base.abs('#141314', 12);
        var color_scheme = [];

        target.each(function() {
            color_scheme.push(this.getHex());
        });

       console.log(color_scheme)
       $('#color_scheme').val(color_scheme.toString());

    });
});