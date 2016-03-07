var EncounterPatients = function() {
    var self = this;

    (function() {
        self.providerName = socket.getParameter('providerName'),
        self.providerSID = socket.getParameter('providerSID'),
        self.temporalCatId = socket.getParameter('temporalCatId'),
        self.temporalOffset = socket.getParameter('temporalOffset'),
        self.u = new Utility(),
        self.root = '../',
        self.IsSecondTabLoaded = false;
    })(jQuery);
    
    self.load = function() {
        $('#providerPatientEncounterTabsId').tabs();
        _createProviderPatientTotalTable();
        $('#providerPatientEncounterTabsId').bind('tabsshow', function(event, ui) {
            if (ui.panel.id == "providerEncountersTabId") {
                if(!self.IsSecondTabLoaded){
                    self.IsSecondTabLoaded = true;
                    _createProviderPatientTable();
                }
            }
        });
    };

    return self;
 
    function _loadProviderPatientData() {
        var result = null;
        $.ajax({
            type:   "post",
            url:    self.root + "EncounterServlet",
            data:   "option=getProviderPatientEncounterBreakdown&providerSID=" + self.providerSID + "&temporalCatId=" + self.temporalCatId + "&temporalOffset=" + self.temporalOffset,
            async:  false,
            success: function(msg) {
                result = msg;
                parent.$().loading(false);
            }
        });
        return result;
    }

    function _loadProviderPatientTotalData() {
        var result = null;
        $.ajax({
            type:   "post",
            url:    self.root + "EncounterServlet",
            data:   "option=getProviderPatientTotalEncounterBreakdown&providerSID=" + self.providerSID + "&temporalCatId=" + self.temporalCatId + "&temporalOffset=" + self.temporalOffset,
            async:  false,
            success: function(msg) {
                result = msg;
                parent.$().loading(false);
            }
        });
        return result;
    }
    
    function _createProviderPatientTable() {
        var loadData = _loadProviderPatientData(),
            data = loadData.data._table,
            body = '',
            header = '',
            table = '',
            EstClnLoad = 0,
            Eva,P60,P90,PMM,CM,MM,Group,Tel,Other;
        Eva = P60 = P90 = PMM = CM = MM = Group = Tel = Other = 0;
        if(self.providerSID==null) { return; }
        
        header =
            '<tr>' +
                '<th class="ui-state-default">Patient</th>' +
                '<th class="ui-state-default">Eva</th>' +
                '<th class="ui-state-default">P60</th>' +
                '<th class="ui-state-default">P90</th>' +
                '<th class="ui-state-default">PMM</th>' +
                '<th class="ui-state-default">CM</th>' +
                '<th class="ui-state-default">MM</th>' +
                '<th class="ui-state-default">Group</th>' +
                '<th class="ui-state-default">Telephone</th>' +
                '<th class="ui-state-default">Est.Cln.Hrs</th>' +
            '</tr>';
        for(i in data) {
            var cur = data[i],
                Eva = cur.EVALUATION,
                P60 = cur.PSYCHOTHERAPY_60MINUTE,
                P90 = cur.PSYCHOTHERAPY_90MINUTE,
                PMM = cur.PSYCHOTHERAPY_WITH_MEDICATION_MANAGEMENT,
                CM = cur.CASE_MANAGEMENT,
                MM = cur.MEDICATION_MANAGEMENT,
                Group = cur.GROUP,
                Tel = cur.TELEPHONE,
                Other = cur.OTHER;

            EstClnLoad = Eva*0.5 + P60*1.0 + P90*1.5 + PMM*1.0 + CM*0.5 + MM*0.5 + Group*1.0 + Tel*0.25;
            body +=
                '<tr class="gradeC">' +
                    '<td><a href="#" sid="' + cur.PatientSID + '">' + cur.PatientName + '</a></td>' +
                    '<td class="center">' + Eva + '</td>' +
                    '<td class="center">' + P60 + '</td>' +
                    '<td class="center">' + P90 + '</td>' +
                    '<td class="center">' + PMM + '</td>' +
                    '<td class="center">' + CM + '</td>' +
                    '<td class="center">' + MM + '</td>' +
                    '<td class="center">' + Group + '</td>' +
                    '<td class="center">' + Tel + '</td>' +
                    '<td class="center">' + EstClnLoad.toFixed(0) + '</td>' +
                '</tr>';
        }
        
        table = 
            '<table id="ProviderPatientEncounterBreakdownTableDivId' + self.temporalOffset + '_' + self.temporalCatId + '" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                '<thead>' +
                    header +
                '</thead>' +
                '<tbody>' +
                    body +
                '</tbody>' +
            '</table>';
        $('#providerEncountersTableDivId').html('');
        $('#providerEncountersTableDivId').append(table);
        $('#ProviderPatientEncounterBreakdownTableDivId' + self.temporalOffset + '_' + self.temporalCatId).dataTable({
            "bLengthChange": false
            ,"bJQueryUI": true
            ,"sScrollY": "200px"
            ,"bScrollCollapse": true
            ,"bPaginate": false
            ,"sPaginationType": "full_numbers"
            ,"aoColumns": [
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]}
            ]
        });
    }
    
    function _createProviderPatientTotalTable() {
        var loadData = _loadProviderPatientTotalData(),
            data = loadData.data._table,
            body = '',
            header = '',
            table = '',
            EstClnLoad = 0,
            Eva,P60,P90,PMM,CM,MM,Group,Tel,Other;
        Eva = P60 = P90 = PMM = CM = MM = Group = Tel = Other = 0;
        if(self.providerSID==null) { return; }
        $('#dateRangeAId').html('Period: ' + loadData.start + ' to ' + loadData.end);
        $('#providerNameAId').html(self.providerName);
        
        header =
            '<tr>' +
                '<th class="ui-state-default">Patient</th>' +
                '<th class="ui-state-default">Eva</th>' +
                '<th class="ui-state-default">P60</th>' +
                '<th class="ui-state-default">P90</th>' +
                '<th class="ui-state-default">PMM</th>' +
                '<th class="ui-state-default">CM</th>' +
                '<th class="ui-state-default">MM</th>' +
                '<th class="ui-state-default">Group</th>' +
                '<th class="ui-state-default">Telephone</th>' +
                '<th class="ui-state-default">Est.Cln.Hrs</th>' +
            '</tr>';
        for(i in data) {
            var cur = data[i],
                Eva = cur.EVALUATION,
                P60 = cur.PSYCHOTHERAPY_60MINUTE,
                P90 = cur.PSYCHOTHERAPY_90MINUTE,
                PMM = cur.PSYCHOTHERAPY_WITH_MEDICATION_MANAGEMENT,
                CM = cur.CASE_MANAGEMENT,
                MM = cur.MEDICATION_MANAGEMENT,
                Group = cur.GROUP,
                Tel = cur.TELEPHONE,
                Other = cur.OTHER;

            EstClnLoad = Eva*0.5 + P60*1.0 + P90*1.5 + PMM*1.0 + CM*0.5 + MM*0.5 + Group*1.0 + Tel*0.25;
            body +=
                '<tr class="gradeC">' +
                    '<td><a href="#" sid="' + cur.PatientSID + '">' + cur.PatientName + '</a></td>' +
                    '<td class="center">' + Eva + '</td>' +
                    '<td class="center">' + P60 + '</td>' +
                    '<td class="center">' + P90 + '</td>' +
                    '<td class="center">' + PMM + '</td>' +
                    '<td class="center">' + CM + '</td>' +
                    '<td class="center">' + MM + '</td>' +
                    '<td class="center">' + Group + '</td>' +
                    '<td class="center">' + Tel + '</td>' +
                    '<td class="center">' + EstClnLoad.toFixed(0) + '</td>' +
                '</tr>';
        }
        
        table = 
            '<table id="ProviderPatientEncounterTotalBreakdownTableDivId' + self.temporalOffset + '_' + self.temporalCatId + '" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                '<thead>' +
                    header +
                '</thead>' +
                '<tbody>' +
                    body +
                '</tbody>' +
            '</table>';
        $('#allEncountersTableDivId').html('');
        $('#allEncountersTableDivId').append(table);
        $('#ProviderPatientEncounterTotalBreakdownTableDivId' + self.temporalOffset + '_' + self.temporalCatId).dataTable({
            "bLengthChange": false
            ,"bJQueryUI": true
            ,"sScrollY": "200px"
            ,"bPaginate": false
            ,"sPaginationType": "full_numbers"
            ,"aoColumns": [
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]},
                {"asSorting": ["desc","asc"]}
            ]
        });
    }
};