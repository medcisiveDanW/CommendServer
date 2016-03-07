var OEF4DeadlineReport = function(target) {
    var self = this;

    (function() {
        self.target = $('#' + target),
        self.providerPageURL = 'providerSite.jsp',
        self.dateFormat = 'MMM d, yyyy',
        self.utility = new Utility(),
        self.rpc = new RemoteInvocationController();
        _createModule();
    })(jQuery);

    return self;

    function _createModule() {
        var tabName = '',
            numberOfMonths = 6,
            thisDiv =
            '<div id="OEF4DeadlineReportTabsId"><ul>';
                for(var i = 0; i < numberOfMonths; i++) {
                    tabName = Date.today().add(i).months().getMonthName() + ' ' + Date.today().add(i).months().getFullYear();
                    thisDiv += '<li><a href="#OEF4DeadlineReport' + i + 'TabId">' + tabName + '</a></li>';
                }
                thisDiv += '</ul>';
                for(i = 0; i < numberOfMonths; i++) {
                    thisDiv +='<div id="OEF4DeadlineReport' + i + 'TabId">'
                        + '<div id="OEF4DeadlineReport' + i + 'DivId"></div>'
                    + '</div>';
                }
                thisDiv +=
            '</div>';
        self.target.html('');
        self.target.append(thisDiv);
        $('#OEF4DeadlineReportTabsId').tabs();
        $('#OEF4DeadlineReportTabsId').tabs({selected: 0});
        _createTable('OEF4DeadlineReport0DivId',0);
        $('#OEF4DeadlineReportTabsId').bind('tabsshow', function(event, ui) {
            for(i = 0; i < numberOfMonths; i++) {
                if (ui.panel.id == "OEF4DeadlineReport" + i + "TabId") {
                    //self.rpc.log('Encounter Statistics Year Tab Selected',1033);
                    if($('#OEF4DeadlineReport' + i + 'DivId').html()==''){
                        _createTable('OEF4DeadlineReport' + i + 'DivId',i);
                    }
                }
            }
        });
    }

    function _createTable(targetId,index) {
        if(index==null) {return;}
        var jTarget = $('#' + targetId),
            header = '',
            body = '',
            thisDiv = '',
            data = null,
            complete = 0,
            incomplete = 0,
            failed = 0,
            start = Date.today().add(index).months().set({day: 1, hour: 1, minute: 0}),
            end = Date.today().add(index+1).months().set({day: 1, hour: 1, minute: 0});
        $.ajax({
            type:   "post",
            url:    "AdministrationServlet",
            data:   "option=getOEF4DeadlineReportWithinRange&start=" + start.valueOf() + "&end=" + end.valueOf(),
            async:  false,
            success: function(msg) {
                data = msg._table;
            }
        });
        header = '<tr>'
                    + '<th>Patient</th>'
                    + '<th>Location</th>'
                    + '<th>Status</th>'
                    + '<th>Deadline</th>'
                    + '<th>Completed</th>'
                    + '<th>Window Start</th>'
                    + '<th>Window End</th>'
                    + '<th>Qualifying</th>'
                    + '<th>Sched Appts</th>'
                    + '<th>% Missed</th>'
                + '</tr>';
        //self.providerURL[id] = self.providerPageURL + '?name=' + name + '&sid=' + id;
        for(var i in data) {
            var curr = data[i];
            if(curr.windowStart==undefined) {curr.windowStart = '--';} else { curr.windowStart = Date.parse(curr.windowStart).toString(self.dateFormat); }
            if(curr.windowEnd==undefined) {curr.windowEnd = '--';} else { curr.windowEnd = Date.parse(curr.windowEnd).toString(self.dateFormat); }
            if(curr.status=='Complete') {complete++;}
            if(curr.status=='Incomplete') {incomplete++;}
            if(curr.status=='Failed') {failed++;}
            curr.deadline = Date.parse(curr.deadline).toString(self.dateFormat);
            curr.qualify2 = Date.parse(curr.qualify2).toString(self.dateFormat);
            body +=
                  '<tr>'
                    + '<td id="' + curr.patientIEN + 'DeadlineLinkId" style="text-decoration:underline;" align="left">' + curr.patientName+ '</td>'
                    + '<td>' + curr.institutionName + '</td>'
                    + '<td>' + curr.status + '</td>'
                    + '<td>' + curr.deadline + '</td>'
                    + '<td>' + curr.numCompleted + '</td>'
                    + '<td>' + curr.windowStart + '</td>'
                    + '<td>' + curr.windowEnd + '</td>'
                    + '<td>' + curr.qualify2 + '</td>'
                    + '<td>' + curr.numAppts8weeks + '</td>'
                    + '<td>' + curr.pcMissedMH.toFixed(1) + '% (' + curr.totMHOneYear + ')</td>'
                + '</tr>';
        }
        var qualifyed = complete + incomplete + failed;
        var percentage = (complete/qualifyed)*100;
        thisDiv =
            '<div style="width:100%;height:25px;font-weight:bold;">Complete: ' + complete + ' Qualifyed: ' + qualifyed + ' (' + percentage.toFixed(2) + '%)</div>'
            + '<table id="OEF4DeadlineReport' + index + 'TableDivId" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">'
                + '<thead>'
                    + header
                + '</thead>'
                + '<tbody align="center">'
                    + body
                + '</tbody>'
            + '</table>';
        for(i in data) {
            curr = data[i];
            thisDiv += '<div id="dialog' + curr.patientIEN + 'DeadlineLinkId" style="padding: 0px; margin: 0px; overflow: hidden;"></div>';
        }
        jTarget.html('');
        jTarget.append(thisDiv);

        $('#OEF4DeadlineReport' + index + 'TableDivId').dataTable({
            "bLengthChange": false
            ,"bJQueryUI": true
            ,"sScrollY": "300px"
            ,"bPaginate": false
            ,"sPaginationType": "full_numbers"
        });

        for(i in data) {
            curr = data[i];
            $('#' + curr.patientIEN + 'DeadlineLinkId').click( function() {
                var id = this.id.replace('DeadlineLinkId','');
                $('#dialog' + this.id).dynamicDialog(new PTSDPopupController(_getGraphJSONObject(id,'FYM1')));
                $('#dialog' + this.id).dialog('open');
            });
        }
    }

    function _formatDate(date) {
        var result = '';
        _print(date.month());
        _print(date.day());
        _print(date.year());
        return result;
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
};