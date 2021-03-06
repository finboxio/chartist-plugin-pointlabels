/**
 * Chartist.js plugin to display a data label on top of the points in a line chart.
 *
 */
/* global Chartist */
(function(window, document, Chartist) {
  'use strict';

  var defaultOptions = {
    labelClass: 'ct-label',
    labelOffset: {
      x: 0,
      y: -10
    },
    textAnchor: 'middle',
    labelInterpolationFnc: Chartist.noop,
    labelFormat: Chartist.noop,
    hideXLabel: false,
    hideAllLabels: false
  };

  Chartist.plugins = Chartist.plugins || {};
  Chartist.plugins.ctPointLabels = function(options) {

    options = Chartist.extend({}, defaultOptions, options);

    return function ctPointLabels(chart) {
      if(!options.hideAllLabels && chart instanceof Chartist.Line) {
        chart.on('draw', function(data) {
          if(data.type === 'point') {
            data.group.elem('text', {
              x: data.x + options.labelOffset.x,
              y: data.y + options.labelOffset.y,
              style: 'text-anchor: ' + options.textAnchor
            }, options.labelClass).text(options.labelInterpolationFnc((options.hideXLabel || data.value.x === undefined) ? data.value.y : data.value.x + ', ' + data.value.y));
          }
        });
      }

      if(!options.hideAllLabels && chart instanceof Chartist.Bar) {
        chart.on('draw', function (data) {
          var barHorizontalCenter, barVerticalCenter, label, value;
          if (data.type === 'bar') {
            barHorizontalCenter = data.x1 + (data.element.width() * .5);
            barVerticalCenter = data.y1 + (data.element.height() * -1) - 10;
            value = data.element.attr('ct:value');
            if (value !== '0') {
              label = new Chartist.Svg('text');
              label.text(options.labelInterpolationFnc(value));
              label.addClass('ct-barlabel');
              label.attr({
                x: barHorizontalCenter,
                y: barVerticalCenter,
                'text-anchor': 'middle'
              });
              return data.group.append(label);
            }
          }
        });
      }
    };
  };

}(window, document, Chartist));
