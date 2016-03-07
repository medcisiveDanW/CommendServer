var OEFOIFStatistics = function(target) {
    var self = this;

    (function() {
        self.target = $('#' + target),
        self.loadingTarget = $('#loadingOEF4SatisticsDivId'),
        self.group = null,
        self.providerPageURL = 'providerSite.jsp',
        self.providerURL = [],
        self.dateFormat = 'MMMM d, yyyy',
        self.list = null,
        self.month = null,
        self.year = null,
        self.fiscalYear = null,
        self.aYear = null, //adjusted year
        self.rpc = new RemoteInvocationController();
    })(jQuery);

    self.update = function(group) {
        self.group = group;
        var list = '';
        for(i in self.group.providers) {
            var cur = self.group.providers[i];
            list += cur.providerSID + ',';
        }
        self.list = list.substring(0,list.lastIndexOf(','));
        self.month = Date.today().getMonth(); // January is Zero.
        self.year = Date.today().getFullYear();
        self.fiscalYear = self.year;
        if(self.month>=9) { // 9 because October(10) - 1
            self.fiscalYear++;
        }
        self.aYear = self.fiscalYear - 1;
        _createModule();
    }

    return self;

    function _createModule() {
        var thisDiv =
            '<div id="mainOEF4SatisticsTabsIds">'
                + '<ul>'
                    + '<li><a href="#OEF4SatisticsYearTabId">Year</a></li>'
                    + '<li><a href="#OEF4SatisticsQuarterTabId0">Q: Oct-Dec ' + (self.fiscalYear-1) + '</a></li>'
                    + '<li><a href="#OEF4SatisticsQuarterTabId1">Q: Jan-Mar ' + self.fiscalYear + '</a></li>'
                    + '<li><a href="#OEF4SatisticsQuarterTabId2">Q: Apr-Jun ' + self.fiscalYear + '</a></li>'
                    + '<li><a href="#OEF4SatisticsQuarterTabId3">Q: Jul-Sep ' + self.fiscalYear + '</a></li>'
                    + '<li><a href="#OEF4SatisticsMonthTabId">Last Month</a></li>'
                + '</ul>'
                + '<div id="OEF4SatisticsYearTabId">'
                    + '<div id="OEF4SatisticsYearDivId"></div>'
                + '</div>'
                + '<div id="OEF4SatisticsQuarterTabId0">'
                    + '<div id="OEF4SatisticsQuarterDivId0"></div>'
                + '</div>'
                + '<div id="OEF4SatisticsQuarterTabId1">'
                    + '<div id="OEF4SatisticsQuarterDivId1"></div>'
                + '</div>'
                + '<div id="OEF4SatisticsQuarterTabId2">'
                    + '<div id="OEF4SatisticsQuarterDivId2"></div>'
                + '</div>'
                + '<div id="OEF4SatisticsQuarterTabId3">'
                    + '<div id="OEF4SatisticsQuarterDivId3"></div>'
                + '</div>'
                + '<div id="OEF4SatisticsMonthTabId">'
                    + '<div id="OEF4SatisticsMonthDivId"></div>'
                + '</div>'
            + '</div>';
        self.target.html('');
        self.target.append(thisDiv);
        $('#mainOEF4SatisticsTabsIds').tabs({selected: 0});
        _createTable('OEF4SatisticsYearDivId'
            ,Date.today().set({year: self.aYear, month: 9, day: 1, hour: 0, minute: 0 }).add(0).months()
            ,Date.today().set({year: self.aYear, month: 9, day: 1, hour: 0, minute: 0 }).add(12).months());
        $('#mainOEF4SatisticsTabsIds').bind('tabsshow', function(event, ui) {
            if (ui.panel.id == "OEF4SatisticsYearTabId") {
                //self.rpc.log('OEF4 Statistics Year Tab Selected',1033);
            }
            if (ui.panel.id == "OEF4SatisticsQuarterTabId0") {
                //self.rpc.log('OEF4 Statistics Last Quarter Tab Selected',1034);
                if($('#OEF4SatisticsQuarterDivId0').html()==='') {
                    _createTable('OEF4SatisticsQuarterDivId0'
                        ,Date.today().set({year: self.aYear, month: 9, day: 1, hour: 0, minute: 0 }).add(0).months()
                        ,Date.today().set({year: self.aYear, month: 9, day: 1, hour: 0, minute: 0 }).add(3).months());
                }
            }
            if (ui.panel.id == "OEF4SatisticsQuarterTabId1") {
                //self.rpc.log('OEF4 Statistics Second Last Quarter Tab Selected',1035);
                if($('#OEF4SatisticsQuarterDivId1').html()==='') {
                    _createTable('OEF4SatisticsQuarterDivId1'
                        ,Date.today().set({year: self.aYear, month: 9, day: 1, hour: 0, minute: 0 }).add(3).months()
                        ,Date.today().set({year: self.aYear, month: 9, day: 1, hour: 0, minute: 0 }).add(6).months());
                }
            }
            if (ui.panel.id == "OEF4SatisticsQuarterTabId2") {
                //self.rpc.log('OEF4 Statistics Third Last Quarter Tab Selected',1036);
                if($('#OEF4SatisticsQuarterDivId2').html()==='') {
                    _createTable('OEF4SatisticsQuarterDivId2'
                        ,Date.today().set({year: self.aYear, month: 9, day: 1, hour: 0, minute: 0 }).add(6).months()
                        ,Date.today().set({year: self.aYear, month: 9, day: 1, hour: 0, minute: 0 }).add(9).months());
                }
            }
            if (ui.panel.id == "OEF4SatisticsQuarterTabId3") {
                //self.rpc.log('Encounter Statistics Forth Last Quarter Tab Selected',1037);
                if($('#OEF4SatisticsQuarterDivId3').html()==='') {
                    _createTable('OEF4SatisticsQuarterDivId3'
                        ,Date.today().set({year: self.aYear, month: 9, day: 1, hour: 0, minute: 0 }).add(9).months()
                        ,Date.today().set({year: self.aYear, month: 9, day: 1, hour: 0, minute: 0 }).add(12).months());
                }
            }
            if (ui.panel.id == "OEF4SatisticsMonthTabId") {
                //self.rpc.log('Encounter Statistics Last Month Tab Selected',1038);
                if($('#OEF4SatisticsMonthDivId').html()==='') {
                    _createTable('OEF4SatisticsMonthDivId'
                        ,Date.today().set({year: self.year, month: self.month-1, day: 1, hour: 0, minute: 0 })
                        ,Date.today().set({year: self.year, month: self.month-1, day: 1, hour: 0, minute: 0 }).add(1).months());
                }
            }
        });
    }

    function _createTable(targetDiv,start,end) {
        var target = $('#' + targetDiv),
            header = '',
            rows = '',
            footer = '',
            totals = _stubMe(null),
            id = end.getTime()-start.getTime(),
            data = _getOEF4StatisticsData(start.getTime(),end.getTime());
        header =
            '<tr>' +
                '<th class="ui-state-default">' +
                    'Provider' +
                '</th>' +
                '<th>' +
                    'Complete' +
                '</th>' +
                '<th>' +
                    'Incomplete' +
                '</th>' +
                '<th>' +
                    'Qualified' +
                '</th>' +
                '<th>' +
                    '%' +
                '</th>' +
            '</tr>';
        for(i in self.group.providers) {
            var cur = self.group.providers[i],
                sid = cur.providerSID,
                m0 = _getObj(sid,data);
            m0 = _stubMe(m0);
            totals.complete += m0.complete;
            totals.incomplete += m0.incomplete;
            totals.qualified += m0.qualified;
            rows +=
                '<tr class="gradeC">' +
                    '<td>' +
                        '<a href="' + self.providerPageURL + '?name=' + cur.providerName + '&sid=' + sid + '">' + cur.providerName + '</a>' +
                    '</td>' +
                    '<td class="center">' +
                        m0.complete +
                    '</td>' +
                    '<td class="center">' +
                        m0.incomplete +
                    '</td>' +
                    '<td class="center">' +
                        m0.qualified +
                    '</td>' +
                    '<td class="center">' +
                        m0.result +
                    '</td>' +
                '</tr>';
        }
        totals = _stubMe(totals);
        footer =
            '<tr>' +
                '<th>' +
                    'TOTAL' +
                '</th>' +
                '<th>' +
                    totals.complete +
                '</th>' +
                '<th>' +
                    totals.incomplete +
                '</th>' +
                '<th>' +
                    totals.qualified +
                '</th>' +
                '<th>' +
                    totals.result +
                '</th>' +
            '</tr>';
        var thisDiv =
            '<div style="width: 100%; height: 30px;">' +
                '<div style="width: 25%;float: left; height: 30px;"></div>' +
                '<div style="float: left; height: 30px;"><span style="font-weight:bold;">Period: ' + start.toString(self.dateFormat) + ' to ' + end.add(-1).days().toString(self.dateFormat) + '</span></div>' +
            '</div>' +
            '<table id="oefoifStatisticsTableDivId' + id + '" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                '<thead>' +
                    header +
                '</thead>' +
                '<tfoot>' +
                    footer +
                '</tfoot>' +
                '<tbody>' +
                    rows +
                '</tbody>' +
            '</table>';
        target.html('');
        target.append(thisDiv);

        $('#oefoifStatisticsTableDivId' + id).dataTable({
            "iDisplayLength": 25,
            "aLengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            "bJQueryUI": true,
            "sPaginationType": "full_numbers"
        });
    }

    function _getOEF4StatisticsData(start,end) {
        var result = null;
        $.ajax({
            type:   "post",
            url:    "AdministrationServlet",
            data:   "option=getOEF4StatisticsData&start=" + start + "&end=" + end + "&sids=" + self.list,
            async:  false,
            success: function(msg) {
                result = msg._table;
            }
        });
        return result;
    }

    function _getQuarterNames() {
        var result = null;
        $.ajax({
            type:   "post",
            url:    "AdministrationServlet",
            data:   "option=quarterNames",
            async:  false,
            success: function(msg) {
                result = msg;
            }
        });
        return result;
    }

    function _getObj(sid,list) {
        for(i in list) {
            var obj = list[i];
            if(obj.providerSID==sid) {
                return obj;
            }
        }
        return null;
    }

    function _stubMe(obj) {
        if(obj==null) {
            obj = { complete:0,incomplete:0,qualified:0,providerSID:-1 };
        }
        obj.result = (obj.complete / obj.qualified)*100;
        if(isNaN(obj.result)) {
            obj.result = 0;
        }
        obj.result = obj.result.toFixed(1);
        return obj;
    }
};