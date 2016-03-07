var PTSDGraph = function(canvasElement, data) {
    var self = this;

    (function() {
        // 1323417600000 is the milliseconds for the date 2011-12-09 00:00:00.000
        self.u = new Utility(),
        self.monthms = 2592000000,
        self.today = new Date(), //parseInt(1323417600000)
        self.canvasElementName = '#' + canvasElement,
        self.eGraphDiv = document.getElementById(canvasElement),
        self.jGraphDiv = $(self.eGraphDiv),
        self.plot = null,
        self.ctx = null,
        self.gfx = null,
        self.rpc = new RemoteInvocationController(),
        self.isFirstSymbolHover = true,
        self.windowStart = parseInt(data["windowStart"]),
        self.windowEnd = self.windowStart + parseInt(8467200000),
        self.deadline = parseInt(data["deadline"]),
        self.dataset = data["graphData"],
        self.displaySelect = [],
        self.displayData = [],
        self.dateSpan = {
            start: self.today.getTime()-self.monthms*15,
            end: self.today.getTime()+self.monthms*3
        },
        self.options = {
            points: {
                show: true,
                fill: false,
                radius: 5
            },
            lines: {
                show: false,
                fill: false
            },
            legend: {
                show: false
            },
            xaxis: {
                show: true,
                mode: "time",
                timeformat: "%b %y",
                monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                minTickSize: [1, "month"],
                tickFormatter: _myFormatter,
                min: self.dateSpan.start,
                max: self.dateSpan.end,
                color: '#000'
            },
            yaxis: {
                show: true,
                tickFormatter: _myFormatter,
                tickSize: 1,
                panRange: [-1,1],
                zoomRange: [-1,1]
            },
            grid: {
                show: true,
                backgroundColor: {
                    colors: ["#ccc", "#fff"]
                },
                borderColor: "#77f",
                clickable: true,
                hoverable: true
            },
            zoom: {
                interactive: false
            },
            pan: {
                interactive: false
            },
            hooks: {
                draw: [_drawWindow]
            }
        };
        if(data["status"]=='Complete') {
            self.options.grid.backgroundColor.colors = ["#AF8", "#FFF"];
        }
        else if(data["status"]=='Incomplete') {
            self.options.grid.backgroundColor.colors = ["#FB5", "#FFF"];//F90
        }
        else if(data["status"]=='Exclude') {
            self.options.grid.backgroundColor.colors = ["#AAF", "#FFF"];
        }
        _displaySelectSetup();
        self.displayData = self.dataset;
        _setupTooltip();
        _plotFunc();
        self.u.print(self.dataset);
    })(jQuery);

    self.setDisplaySelect = function(key, value) {
        self.displayData = [];
        self.displaySelect[key] = value;
        for(var k in self.dataset) {
            var data = self.dataset[k];
            if(self.displaySelect[data.points.symbol]) {
                self.displayData.push(data);
            }
        }
        _plotFunc();
    }

    self.refresh = function() {
        _plotFunc();
    }

    self.disableDates = function() {
        _disableDates();
    }

    self.enableDates = function() {
        _enableDates();
    }

    self.enablePan = function() {
        self.options.pan.interactive = true;
    }

    return self;

    function _disableDates() {
        self.options.xaxis.tickFormatter = _myFormatter;
        _plotFunc();
    }

    function _enableDates() {
        self.options.xaxis.tickFormatter = null;
        _plotFunc();
    }

    function _tooltipContents(item) {
        var result = null,
            x = item.datapoint[0],
            d = new Date(x),
            date = d.format("mmmm dS, yyyy"),
            procedure = 'incomplete',
            diagnosis = 'incomplete',
            pText = 'no',
            dText = 'no',
            symbol = '',
            title = '';
        if(_isGreenDiamond(item)) {
            procedure = 'complete';
            diagnosis = 'complete';
            pText = 'Yes';
            dText = 'Yes';
            symbol = 'gd';
            title = 'Qualifying Date';
        }
        else if(_isBlueDiamond(item)) {
            diagnosis = 'complete';
            dText = 'Yes';
            symbol = 'bd';
            title = 'Qualifying Date';
        }
        else if(_isGreenCircle(item)) {
            procedure = 'complete';
            diagnosis = 'complete';
            pText = 'Yes';
            dText = 'Yes';
            symbol = 'gc';
        }
        else if(_isOrangeCircle(item)) {
            procedure = 'complete';
            pText = 'Yes';
            symbol = 'oc';
        }
        else if(_isOrangeTriangle(item)) {
            diagnosis = 'complete';
            dText = 'Yes';
            symbol = 'ot';
        }
        else if(_isOrangeCross(item)) {
            symbol = 'ox';
        }
        result =
            '<div class="row-container">' +
                '<div class="tt-cell">' +
                    '<div class="left icon ' + symbol + '"></div>' +
                    '<div class="pad-left left">' + title + '</div>' +
                '</div>' +
                '<div class="tt-cell">' +
                    '<div class="pad-left">Date: ' + date + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="row-container">' +
                '<div class="pad-left left pad-right">' +
                    '<div class="tt-cell">' +
                        '<div class="left">Psychotherapy</div>' +
                        '<div class="right ' + procedure + '">' + pText + '</div>' +
                    '</div>' +
                    '<div class="tt-cell">' +
                        '<div class="left">PTSD Diagnosis</div>' +
                        '<div class="right ' + diagnosis + '">' + dText + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        return result;
    }

    function _setupTooltip() {
        var previousPoint = null;
        self.jGraphDiv.bind("plothover", function (event, pos, item) {
            if (item) {
                if (previousPoint != item.datapoint) {
                    previousPoint = item.datapoint;
                    $("#tooltip").remove();
                    _showTooltip(item.pageX, item.pageY, _tooltipContents(item));
                    if(self.isFirstSymbolHover) {
                        self.isFirstSymbolHover = false;
                        self.rpc.log('Provider Timeline Symbol Hover',1042);
                    }
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    }

    function _isGreenDiamond(item) {
        var result = false,
            diamond = 'function (ctx, x, y, radius, shadow) { var size = radius * Math.sqrt(Math.PI / 2); ctx.moveTo(x - size, y); ctx.lineTo(x, y - size); ctx.lineTo(x + size, y); ctx.lineTo(x, y + size); ctx.lineTo(x - size, y); fillFunction(ctx); }',
            color = item.series.color,
            itemFunction = '' + item.series.points.symbol;
            itemFunction = itemFunction.replace(/\s+/g, ' ');
        if(diamond==itemFunction && color=='#063') {
            result = true;
        }
        return result;
    }

    function _isBlueDiamond(item) {
        var result = false,
            diamond = 'function (ctx, x, y, radius, shadow) { var size = radius * Math.sqrt(Math.PI / 2); ctx.moveTo(x - size, y); ctx.lineTo(x, y - size); ctx.lineTo(x + size, y); ctx.lineTo(x, y + size); ctx.lineTo(x - size, y); fillFunction(ctx); }',
            color = item.series.color,
            itemFunction = '' + item.series.points.symbol;
            itemFunction = itemFunction.replace(/\s+/g, ' ');
        if(diamond==itemFunction && color=='#039') {
            result = true;
        }
        return result;
    }

    function _isGreenCircle(item) {
        var result = false,
            circle = 'function (ctx, x, y, radius, shadow) { ctx.arc(x, y, radius, 0, shadow ? Math.PI : Math.PI * 2, false); fillFunction(ctx); }',
            color = item.series.color,
            itemFunction = '' + item.series.points.symbol;
            itemFunction = itemFunction.replace(/\s+/g, ' ');
        if(circle==itemFunction && color=='#063') {
            result = true;
        }
        return result;
    }

    function _isOrangeCircle(item) {
        var result = false,
            circle = 'function (ctx, x, y, radius, shadow) { ctx.arc(x, y, radius, 0, shadow ? Math.PI : Math.PI * 2, false); fillFunction(ctx); }',
            color = item.series.color,
            itemFunction = '' + item.series.points.symbol;
            itemFunction = itemFunction.replace(/\s+/g, ' ');
        if(circle==itemFunction && color=='#F60') {
            result = true;
        }
        return result;
    }

    function _isOrangeTriangle(item) {
        var result = false,
            triangle = 'function (ctx, x, y, radius, shadow) { var size = radius * Math.sqrt(2 * Math.PI / Math.sin(Math.PI / 3)), height = size * Math.sin(Math.PI / 3); ctx.moveTo(x - size / 2, y + height / 2); ctx.lineTo(x + size / 2, y + height / 2); if (!shadow) { ctx.lineTo(x, y - height / 2); ctx.lineTo(x - size / 2, y + height / 2); } fillFunction(ctx); }',
            color = item.series.color,
            itemFunction = '' + item.series.points.symbol;
            itemFunction = itemFunction.replace(/\s+/g, '');
            triangle = triangle.replace(/\s+/g, ''); // something weard here
        if(triangle==itemFunction && color=='#F60') {
            result = true;
        }
        return result;
    }

    function _isOrangeCross(item) {
        var result = false,
            cross = 'function (ctx, x, y, radius, shadow) { var size = radius * Math.sqrt(Math.PI) / 2; ctx.moveTo(x - size, y - size); ctx.lineTo(x + size, y + size); ctx.moveTo(x - size, y + size); ctx.lineTo(x + size, y - size); }',
            color = item.series.color,
            itemFunction = '' + item.series.points.symbol;
            itemFunction = itemFunction.replace(/\s+/g, ' ');
        if(cross==itemFunction && color=='#F60') {
            result = true;
        }
        return result;
    }

    function _drawWindow(plot, canvascontext) {
        if( (self.windowStart!=undefined) && (plot!=null)) {
            var o1 = plot.pointOffset({
                x: self.windowStart,
                y: 0
            });
            var o2 = plot.pointOffset({
                x: self.windowEnd,
                y: 0
            });
            _drawBox(o1.left-7, o1.top+7, o2.left+7, o1.top-7,canvascontext);
        }
    }

    function _drawBox(x1,y1,x2,y2,ctx) {
        ctx.save();
        ctx.strokeStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2, y1);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    function _showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y - 25,
            left: x + 20,
            border: '1px solid #000',
            padding: '2px',
            'background-color': '#ffe',
            'z-index': 5000
        }).appendTo("body").show();
    }

    function _displaySelectSetup() {
        var data = null;
        for(var key in self.dataset){
            data = self.dataset[key];
            self.displaySelect[data.points.symbol] = true;
        }
    }

    function _plotFunc() {
        self.plot = $.plot(self.jGraphDiv, self.displayData, self.options);
    }

    function _myFormatter(v, xaxis) {
        return " ";
    }

    function removeSpecial(str) {
        var temp = '',
        length = str.length;
        for(var i = 0; i < length; i++) {
            if( (str.charAt(i)!=' ') && (str.charAt(i)!='/') ) {
                temp += str.charAt(i);
            }
        }
        return temp;
    }

    function findValue(data, ms) {
        for(var i in data) {
            var cur = data[i];
            if(cur[0]==ms) {
                return cur[1];
            }
        }
        return -1;
    }

    function sizeOf(dataset) {
        var index = 0;
        for(var i in dataset) {
            if(i>index) {
                index=i;
            }
        }
        return index;
    }
};
