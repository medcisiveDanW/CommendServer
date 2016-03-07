/*
Flot plugin that adds some extra symbols for plotting points.

The symbols are accessed as strings through the standard symbol
choice:

  series: {
      points: {
          symbol: "square" // or "diamond", "triangle", "cross"
      }
  }

*/

(function ($) {
    function fillFunction(ctx) {
        var prev = ctx.fillStyle,
            ga = ctx.globalAlpha;
        ctx.fillStyle = ctx.strokeStyle;
        ctx.globalAlpha = 0.4;
        ctx.fill();
        ctx.fillStyle = prev;
        ctx.globalAlpha = ga;
    }
    function processRawData(plot, series, datapoints) {
        // we normalize the area of each symbol so it is approximately the
        // same as a circle of the given radius

        var handlers = {
            circle: function (ctx, x, y, radius, shadow) {
                ctx.arc(x, y, radius, 0, shadow ? Math.PI : Math.PI * 2, false);
                fillFunction(ctx);
            },
            square: function (ctx, x, y, radius, shadow) {
                var size = radius * Math.sqrt(Math.PI) / 2;
                ctx.rect(x - size, y - size, size + size, size + size);
                fillFunction(ctx);
            },
            diamond: function (ctx, x, y, radius, shadow) {
                var size = radius * Math.sqrt(Math.PI / 2);
                ctx.moveTo(x - size, y);
                ctx.lineTo(x, y - size);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x, y + size);
                ctx.lineTo(x - size, y);
                fillFunction(ctx);
            },
            triangle: function (ctx, x, y, radius, shadow) {
                var size = radius * Math.sqrt(2 * Math.PI / Math.sin(Math.PI / 3)),
                    height = size * Math.sin(Math.PI / 3);
                ctx.moveTo(x - size/2, y + height/2);
                ctx.lineTo(x + size/2, y + height/2);
                if (!shadow) {
                    ctx.lineTo(x, y - height/2);
                    ctx.lineTo(x - size/2, y + height/2);
                }
                fillFunction(ctx);
            },
            cross: function (ctx, x, y, radius, shadow) {
                var size = radius * Math.sqrt(Math.PI) / 2;
                ctx.moveTo(x - size, y - size);
                ctx.lineTo(x + size, y + size);
                ctx.moveTo(x - size, y + size);
                ctx.lineTo(x + size, y - size);
            }
        }

        var s = series.points.symbol;
        if (handlers[s])
            series.points.symbol = handlers[s];
    }

    function init(plot) {
        plot.hooks.processDatapoints.push(processRawData);
    }

    $.plot.plugins.push({
        init: init,
        name: 'symbols',
        version: '1.0'
    });
})(jQuery);
