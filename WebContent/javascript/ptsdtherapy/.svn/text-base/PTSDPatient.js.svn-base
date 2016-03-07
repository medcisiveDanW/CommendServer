var PTSDPatient = function(data) {
    var self = this;

    (function() {
        self.id = data["ien"],
        self.data = data,
        self.divId = 'patientGraphDiv' + self.id + 'ID',
        self.manager = null,
        self.isVisible = false,
        self.graph = null,
        self.mouseX = 0,
        self.mouseY = 0,
        self.dx = 0,
        self.dy = 0,
        self.rpc = new RemoteInvocationController(),
        self.isMousedown = false,
        self.controller = null,
        self.utility = new Utility();
    })(jQuery);

    self.append = function(divID) {
        var target = $('#' + divID),
            graphWidth = '85',
            nameColor = '#000';
        if(self.utility.isIE) {
            graphWidth = '82';
        }
        if(self.data["status"]=='Complete') {
            nameColor = '#060';
        }
        if(self.data["status"]=='Incomplete') {
            nameColor = '#F30';
        }
        if(self.data["status"]=='Exclude') {
            nameColor = '#00B';
        }
        var thisDiv =
            '<div id="' + self.divId + '" class="fakePatientGraphClass" style="width:100%;height:50px">'
                + '<div id="' + self.id + 'NameId" style="float:left;width:15%;height:40px;font-family:Arial;font-size:0.85em;padding-top:10px; color: ' + nameColor + ';font-weight:bold;">' + self.data["name"] + '</div>'
                + '<div id="graphDiv' + self.data["ien"] + 'ID" style="float:left;width:' + graphWidth + '%;height:50px"></div>'
                + '<div id="' + self.id + 'DialogId" style="padding: 0px; margin: 0px; overflow: hidden;"></div>'
            + '</div>';
        target.append(thisDiv);
        var firstClick = true;
        $('#'+ self.id + 'NameId').click(function() {
            self.rpc.log('Provider Timeline Patient Selected','1031');
            $('.processingOverlay').show();
            if(firstClick) {
                firstClick = false;
                setTimeout(function() {
                    self.controller = new PTSDPopupController(self.data);
                    $('#' + self.id + 'DialogId').dynamicDialog(self.controller);
                    $('#' + self.id + 'DialogId').dialog('open');
                }, 100);
            }
        });
        if(self.graph==null) {
            self.graph = new PTSDGraph('graphDiv' + self.data["ien"] + 'ID', self.data);
        }
        //self.hide();
        /*
        $('#' + self.divId).mousemove(function(event) {
            var x = self.mouseX,
                y = self.mouseY,
                fact = 1;
            self.mouseX = event.pageX;
            self.mouseY = event.pageY;
            self.dx = fact*(x - self.mouseX);
            self.dy = fact*(y - self.mouseY);
        });
        $('#graphDiv' + self.data["ien"] + 'ID').mousedown(function () {
            self.isMousedown = true;
        });
        $('#graphDiv' + self.data["ien"] + 'ID').mouseup(function () {
            self.isMousedown = false;
        });
        $('#graphDiv' + self.data["ien"] + 'ID').mouseout(function () {
            self.isMousedown = false;
        });
        $('#graphDiv' + self.data["ien"] + 'ID').mouseleave(function () {
            self.isMousedown = false;
        });
        $('#graphDiv' + self.data["ien"] + 'ID').mousemove(function(event) {
            if(self.isMousedown) {
                var obj = shiftGraphs();
            }
        });
        */
    }

    self.hide = function() {
        $('#' + self.divId).hide();
    }

    self.show = function() {
        $('#' + self.divId).show();
        self.graph.refresh();
    }

    self.remove = function() {
        $('#' + self.divId).hide();
    }

    return self;

    function shiftGraphs() {
        var obj = {left: self.dx, top: 0};
        for(var key in self.manager.patients) {
            var pat = self.manager.patients[key];
            if(pat.isVisible) {
                pat.graph.plot.pan(obj);
                pat.graph.drawWindow();
            }
        }
        return obj;
    }
};
