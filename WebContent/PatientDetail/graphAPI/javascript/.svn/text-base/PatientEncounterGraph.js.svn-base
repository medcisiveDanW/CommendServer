var PatientEncounterGraph = function(divId) {
    var self = this;

    (function() {
        self.u = new Utility();
        // 1323417600000 is the milliseconds for the date 2011-12-09 00:00:00.000
        self.monthms = 2592000000,
        self.today = new Date(),
        self.canvasElementName = '#' + divId,
        self.eGraphDiv = document.getElementById(divId),
        self.jGraphDiv = $(self.eGraphDiv),
        self.plot = null,
        self.ctx = null,
        self.gfx = null,
        self.isFirstSymbolHover = true,
        self.patientData = _load(),
        self.data = self.patientData.flot,
        self.info = self.patientData.info,
        self.dateSpan = {
            start: self.today.getTime()-self.monthms*6,
            end: self.today.getTime()+self.monthms*0
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
            //yaxis: {
            //    show: true,
            //    tickFormatter: _myFormatter,
            //    tickSize: 1,
            //    panRange: [-1,1],
            //    zoomRange: [-1,1]
            //},
            yaxes: [{ position: "left" , color: "#f33", tickColor: "#bbb", min: -100, max: 100, ticks: [[-10, ""]], labelWidth: 10 },
                    { position: "right", color: "#33f", tickColor: "#bbb", min: -100, max: 100, ticks: [[-10, ""]], labelWidth: 10 } ],
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
            }//,
            //hooks: {
                //draw: [_drawWindow]
            //}
        };
        self.plot = $.plot(self.jGraphDiv, self.data, self.options);
        _setupTooltip();
    })(jQuery);

    self.draw = function() {
        self.plot = $.plot(self.jGraphDiv, self.data, self.options);
    }

    return self;

    function _load() {
        var result = [];
        $.ajax({
            type:   "post",
            url:    "../../PatientServlet",
            data:   "option=getPatientEncounterData",
            async:  false,
            success: function(msg) {
                result = msg;
            }
        });
        return result;
    }

    function _myFormatter(v, xaxis) { return " "; }

    function _tooltipContents(item) {
        var result = null,
            x = item.datapoint[0],
            type = item.series.type,
            color = item.series.color,
            d = new Date(x),
            date = d.format("mmmm dS, yyyy"),
            cpt = '',
            primary = '',
            secondary = '';
        self.u.print(self.info[x]);
        if(self.info[x]!=undefined) {
            cpt = self.info[x].cptCodes,
            primary = self.info[x].primaryDiagnosis,
            secondary = self.info[x].secondaryDiagnosis;
        }
        result =
            '<table style="border:1px solid black;">' +
                '<tr>' +
                    '<td>Date:</td>' +
                    '<td>' + date + '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Type:</td>' +
                    '<td style="background: ' + color + ';"><b>' + type + '</b></td>' +
                '</tr>' +
                '<tr>' +
                    '<td>CPT Codes:</td>' +
                    '<td>' + cpt + '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Primary:</td>' +
                    '<td>' + primary + '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Secondary:</td>' +
                    '<td>' + secondary + '</td>' +
                '</tr>' +
            '</table>';
        return result;
    }

    function _setupTooltip() {
        var previousPoint = null;
        self.jGraphDiv.bind("plothover", function (event, pos, item) {
            if (item) {
                if (previousPoint != item.datapoint) {
                    previousPoint = item.datapoint;
                    $("#tooltip").remove();
                    var width = self.jGraphDiv.width(),
                        x = item.pageX,
                        y = item.pageY + 50,
                        diff = width - item.pageX;
                    if(diff<200) {
                        x = x - 200;
                    }
                    _showTooltip(x, y, _tooltipContents(item));
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
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
};