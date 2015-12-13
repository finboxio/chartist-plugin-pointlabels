(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.returnExportsGlobal = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['Chartist.plugins.ctPointLabels'] = factory();
  }
}(this, function () {

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
      hideX: false
    };

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.ctPointLabels = function(options) {

      options = Chartist.extend({}, defaultOptions, options);

      return function ctPointLabels(chart) {
        if(chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
          chart.on('draw', function(data) {
            if(data.type === 'point') {
              data.group.elem('text', {
                x: data.x + options.labelOffset.x,
                y: data.y + options.labelOffset.y,
                style: 'text-anchor: ' + options.textAnchor
              }, options.labelClass).text(options.labelInterpolationFnc((options.hideX || data.value.x === undefined) ? data.value.y : data.value.x + ', ' + data.value.y));
            }
          });
        }

        if(chart instanceof Chartist.Bar) {
          chart.on('draw', function (data) {
            var barHorizontalCenter, barVerticalCenter, label, value;
            if (data.type === 'bar') {
              barHorizontalCenter = data.x1 + (data.element.width() * .5);
              barVerticalCenter = data.y1 + (data.element.height() * -1) - 10;
              value = data.element.attr('ct:value');
              if (value !== '0') {
                label = new Chartist.Svg('text');
                label.text(options.labelFormat(value));
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

  return Chartist.plugins.ctPointLabels;

}));
