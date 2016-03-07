var PatientPanel = function(targetDiv,sid) {
    var self = this;

    (function() {
        self.sid = sid,
        self.data = [],
        self.fym0 = [],
        self.fym1 = [],
        self.targetDiv = targetDiv,
        self.utility = new Utility(),
        self.rpc = new RemoteInvocationController();
        _setupManager();
    })(jQuery);

    return self;

    function _load() {
        $.ajax({
            type:   "post",
            url:    "PTSDManagerServlet",
            data:   "option=OEF4Panel&sid=" + self.sid,
            async:  false,
            success: function(msg) {
                self.data = msg._table;
            }
        });
    }

    function _filterOEFOIF(applyFilter) {
        self.fym0 = [];
        self.fym1 = [];
        var pat;
        if(applyFilter==true) {
            for(var i in self.data) {
                pat = self.data[i];
                if(pat.OEFOIFService=='Y') {
                    if((pat.measureType=='FYM0')&&(pat.FYM0Flag=='Y')) {
                        self.fym0[i] = pat;
                    }
                    else if((pat.measureType=='FYM1')&&(pat.FYM1Flag=='Y')) {
                        self.fym1[i] = pat;
                    }
                }
            }
        }
        else {
            for(var i in self.data) {
                pat = self.data[i];
                if((pat.measureType=='FYM0')&&(pat.FYM0Flag=='Y')) {
                    self.fym0[i] = pat;
                }
                else if((pat.measureType=='FYM1')&&(pat.FYM1Flag=='Y')) {
                    self.fym1[i] = pat;
                }
            }
        }
    }

    function _setupManager() {
        _load();
        _filterOEFOIF(true);
        var target = $('#' + self.targetDiv);
        var thisDiv =
            '<div style="width: 100%; margin: 0px; padding:0xp;">' +
                '<div id="fyTabsID">' +
                    '<ul>' +
                        '<li><a href="#tabFYM1Panel">Fiscal Year 2012</a></li>' +
                        '<li><a href="#tabFYM0Panel">Fiscal Year 2013</a></li>' +
                    '</ul>' +
                    '<div id="tabFYM1Panel" style="margin: 0px; padding:5xp;">' +
                        '<div id="patientPanelRadio2012DivId" style="height:50px;float: right">' +
                            '<input type="radio" id="oefoifradio2012" name="radio" checked="checked"/><label for="oefoifradio2012">OEF/OIF</label>' +
                            '<input type="radio" id="allradio2012" name="radio" /><label for="allradio2012">All</label>' +
                        '</div>' +
                        '<div id="FYM1divId"></div>' +
                    '</div>' +
                    '<div id="tabFYM0Panel" style="margin: 0px; padding:5xp;">' +
                        '<div id="patientPanelRadio2013DivId" style="height:50px;float: right">' +
                            '<input type="radio" id="oefoifradio2013" name="radio2" checked="checked"/><label for="oefoifradio2013">OEF/OIF</label>' +
                            '<input type="radio" id="allradio2013" name="radio2" /><label for="allradio2013">All</label>' +
                        '</div>' +
                        '<div id="FYM0divId"></div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        target.append(thisDiv);
        $('#fyTabsID' ).tabs();
        $('#patientPanelRadio2012DivId').buttonset();
        $('#patientPanelRadio2013DivId').buttonset();
        $('#tabs').bind('tabsshow', function(event, ui) {
            if (ui.panel.id == "tabFYM1Panel") {
                self.rpc.log('Provider Pending Patients FYM1 Selected',1028);
                _generateTable(self.fym1,'FYM1divId','FYM1');
            }
            if (ui.panel.id == "tabFYM0Panel") {
                self.rpc.log('Provider Pending Patients FYM0 Selected',1027);
                _generateTable(self.fym0,'FYM0divId','FYM0');
            }
        });
        _generateTable(self.fym0,'FYM0divId','FYM0');
        _generateTable(self.fym1,'FYM1divId','FYM1');
        function updateOEFOIFTables(on) {
            if(on) {
                $('#oefoifradio2012').attr('checked',true);
                $('#oefoifradio2013').attr('checked',true);
            }
            else {
                $('#allradio2012').attr('checked',true);
                $('#allradio2013').attr('checked',true);
            }
            $('#patientPanelRadio2012DivId').buttonset('refresh');
            $('#patientPanelRadio2013DivId').buttonset('refresh');
            _filterOEFOIF(on);
            _generateTable(self.fym0,'FYM0divId','FYM0');
            _generateTable(self.fym1,'FYM1divId','FYM1');
        };
        $('#oefoifradio2012').click(function() {
            self.rpc.log('Provider FY OEF/OIF Toggle(oefoif)',1029);
            updateOEFOIFTables(true);
        });
        $('#allradio2012').click(function() {
            self.rpc.log('Provider FY OEF/OIF Toggle(all)',1029);
            updateOEFOIFTables(false);
        });
        $('#oefoifradio2013').click(function() {
            self.rpc.log('Provider FY OEF/OIF Toggle(oefoif)',1029);
            updateOEFOIFTables(true);
        });
        $('#allradio2013').click(function() {
            self.rpc.log('Provider FY OEF/OIF Toggle(all)',1029);
            updateOEFOIFTables(false);
        });
    }

    function _generateTable(data, targetDiv, fy) {
        $('#' + targetDiv).html('');
        var header = '',
            body = '',
            format = 'mmm dS, yyyy';
        header =
            '<thead>'
                + '<tr>'
                    + '<th class="ui-state-default">Patient</th>'
                    + '<th>Status</th>'
                    + '<th>Deadline</th>'
                    + '<th>Window Start</th>'
                    + '<th>Window End</th>'
                    + '<th>Qualifying</th>'
                    + '<th>Sched Appts</th>'
                    + '<th>% Missed</th>'
                + '</tr>'
            + '</thead>';
        body = '<tbody align="center">';
        for(var i in data) {
            var pat = data[i];
            var status = pat.status,
                emergency = '';
            if(status!='Complete') {
                var today = new Date(),
                    end = new Date(pat.windowEnd),
                    comp = pat.numCompleted,
                    nToD = 8-parseInt(comp),
                    wks = Math.round(_daydiff(today,end)/7);
                if(pat.windowEnd==pat.deadline){
                    emergency = '<div style="padding-left: 5px;height100%;float: left;"><img src="images/exclamation.png" alt=" Warning!" height="20" width="20"/><div>';
                }
                status = '<div style="float: left;">To Do: ' + nToD + ' in '+ wks + ' weeks</div>' + emergency;
            }
            body +=
                '<tr class="gradeC">'
                    + '<td id="' + pat.patientIEN + 'PatientPanelLinkId" style="text-decoration:underline;" align="left">' + pat.patientName + '</td>'
                    + '<td>' + status + '</td>'
                    + '<td>' + dateFormat(new Date(pat.deadline), format) + '</td>'
                    + '<td>' + dateFormat(new Date(pat.windowStart), format) + '</td>'
                    + '<td>' + dateFormat(new Date(pat.windowEnd), format) + '</td>'
                    + '<td>' + dateFormat(new Date(pat.qualify2), format) + '</td>'
                    + '<td>' + pat.numAppts8weeks + '</td>'
                    + '<td>' + pat.pcMissedMH.toFixed(1) + '% (' + pat.totMHOneYear + ')</td>'
                + '</tr>';
        }
        body += '</tbody>';
        var thisDiv =
            '<table id="' + targetDiv + 'TableId" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                header + body +
            '</table>';

        for(i in data) {
            pat = data[i];
            thisDiv += '<div id="dialog' + pat.patientIEN + 'PatientPanelLinkId" style="padding: 0px; margin: 0px; overflow: hidden;"></div>';
        }

        $('#' + targetDiv).html('');
        $('#' + targetDiv).append(thisDiv);
        $('#' + targetDiv + 'TableId').dataTable({
            "bLengthChange": false
            ,"bJQueryUI": true
            ,"sScrollY": "300px"
            ,"bPaginate": false
            ,"sPaginationType": "full_numbers"
        });

        for(i in data) {
            pat = data[i];
            $('#' + pat.patientIEN + 'PatientPanelLinkId').click( function() {
                var id = this.id.replace('PatientPanelLinkId','');
                $('#dialog' + this.id).dynamicDialog(new PTSDPopupController(_getGraphJSONObject(id,fy)));
                $('#dialog' + this.id).dialog('open');
            });
        }

        $('#' + targetDiv + 'TableId' + ' thead th').click(function() {
            self.rpc.log('Pending Patients Fiscal Year Statistics Sort Column(' + targetDiv + ')',1040);
        });
    }

    function _getGraphJSONObject(ien,type) {
        var result = null;
        $.ajax({
            type:   "post",
            url:    "AdministrationServlet",
            data:   "option=getGraphJSON&ien=" + ien + "&type=" + type,
            async:  false,
            success: function(msg) {
                result = self.utility.toJSON(msg);
            }
        });
        return result;
    }

    function _parseDate(str) {
        var mdy = str.split('/')
        return new Date(mdy[2], mdy[0]-1, mdy[1]);
    }

    function _daydiff(first, second) {
        return (second-first)/(1000*60*60*24)
    }
};