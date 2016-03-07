var PatientsView = function(target) {
    var self = this;

    (function() {
        self.target = $('#' + target),
        self.rpc = new RemoteInvocationController();
        _createModule();
    })(jQuery);

    return self;

    function _createModule() {
        var thisDiv =
            '<div id="patientsViewTabsId">'
                + '<ul>'
                    + '<li><a href="#oef4QualifyingReportTabId">OEF4 Qualifying Report</a></li>'
                    + '<li><a href="#oef4DeadlineReportTabId">OEF4 Deadline Report</a></li>'
                + '</ul>'
                + '<div id="oef4QualifyingReportTabId">'
                    + '<div id="oef4QualifyingReportDivId"></div>'
                + '</div>'
                + '<div id="oef4DeadlineReportTabId">'
                    + '<div id="oef4DeadlineReportDivId"></div>'
                + '</div>'
            + '</div>';
        self.target.html('');
        self.target.append(thisDiv);
        $('#patientsViewTabsId').tabs();
        new OEF4QualifyingReport('oef4QualifyingReportDivId');
        $('#patientsViewTabsId').bind('tabsshow', function(event, ui) {
            if (ui.panel.id == "oef4QualifyingReportTabId") {
                //self.rpc.log('Encounter Statistics Year Tab Selected',1033);
                if($('#oef4QualifyingReportDivId').html()===''){}
            }
            if (ui.panel.id == "oef4DeadlineReportTabId") {
                //self.rpc.log('Encounter Statistics Year Tab Selected',1033);
                if($('#oef4DeadlineReportDivId').html()===''){
                    new OEF4DeadlineReport('oef4DeadlineReportDivId');
                }
            }
        });
    }
};