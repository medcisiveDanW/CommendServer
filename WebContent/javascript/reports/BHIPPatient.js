var BHIPPatient = function() {
    var self = this;

    self.name = socket.getParameter('name'),
    self.sta3n = socket.getParameter('sta3n'),
    self.sid = socket.getParameter('sid'),
    self.team = socket.getParameter('team'),
    self.u = new Utility(),
    self.IsSecondTabLoaded = false;
    
    self.load = function() {
        $('#patientNameAId').html(self.name);
        $('#bhipTeamNameId').html(self.team);
        _loadPatientData();
    };

    return self;
 
    function _loadPatientData() {
        $.ajax({
            type:   "post",
            url:    "../BHIPServlet",
            data:   "option=getBHIPPatient&sta3n=" + self.sta3n + "&sid=" + self.sid + "&team=" + self.team,
            async:  false,
            success: function(msg) {
                var data = msg._table,
                    body = '',
                    header = '',
                    table = '';
                
                header =
                    '<tr>' +
                        '<th class="ui-state-default">Date</th>' +
                        '<th class="ui-state-default">Primary Diagnosis</th>' +
                        '<th class="ui-state-default">Procedure</th>' +
                        '<th class="ui-state-default">Provider</th>' +
                    '</tr>';
            
                for(i in data) {
                    var cur = data[i];
                    body +=
                        '<tr class="gradeC">' +
                            '<td class="center">' + cur.visitDateTime + '</td>' +
                            '<td class="center">' + cur.primaryICDCodeDescription + '</td>' +
                            '<td class="center">' + cur.encounterClass + '</td>' +
                            '<td class="center">' + cur.ProviderName + '</td>' +
                        '</tr>';
                }

                table = 
                    '<table id="bhipPatientEncounterTableId" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                        '<thead>' +
                            header +
                        '</thead>' +
                        '<tbody>' +
                            body +
                        '</tbody>' +
                    '</table>';
                $('#bhipPatientEncounterDivId').html('');
                $('#bhipPatientEncounterDivId').append(table);
                $('#bhipPatientEncounterTableId').dataTable({
                    "bLengthChange": false
                    ,"bJQueryUI": true
                    ,"sScrollY": "300px"
                    ,"bScrollCollapse": true
                    ,"bPaginate": false
                    ,"sPaginationType": "full_numbers"
                });
                parent.$().loading(false);
            }
        });
    }
};