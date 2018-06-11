ckan.module('c3charts-export-to-png', function($) {
    return {
        initialize: function(){
            this.el.click(function(e) {
                e.preventDefault()
                this.exportChartToPng('c3chart')
            }.bind(this))
        },
        exportChartToPng: function(className){
            //fix weird back fill
            d3.select('.' + className).selectAll("path").attr("fill", "none");
            //fix no axes
            d3.select('.' + className).selectAll("path.domain").attr("stroke", "black");
            //fix no tick
            d3.select('.' + className).selectAll(".tick line").attr("stroke", "black");
            var svgElement = $('.' + className).find('svg')[0];
            saveSvgAsPng(svgElement, className + '.png', {backgroundColor: 'white'});
        }
    }
})

