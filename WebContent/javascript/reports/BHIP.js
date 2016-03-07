var BHIP = function(target) {
    var self = this;

    self.target = $('#' + target),
    self.group = null,
    self.selected = '',
    self.selectedTeam = null,
    self.providerURL = [],
    self.firstLoad = true,
    self.currentBHIPTeamTable = null,
    self.logger = new Logger();
    
    self.setup = function(){
        _loadBHIPTeams();
    };

    return self;

    function _loadBHIPTeams() {
        $.ajax({
            type:   "post",
            url:    "../BHIPServlet",
            data:   "option=getBHIPTeams",
            async:  true,
            beforeSend: function(){
                if(!self.firstLoad){
                    $().loading(true,'../');
                }
            },
            complete: function(){
                $().loading(false);
            },
            success: function(msg) {
                var teams = msg._table,
                    module = '<span style="font:bold; font-size: large;">Team</span><select id="BHIPTeamSelectId">',
                    selected = '',
                    first = true;
                for(i in teams) {
                    var obj = teams[i];
                    if(first) {
                        selected = 'selected';
                        first = false;
                        self.selectedTeam = obj.team;
                    }
                    else {selected = '';}
                    module += '<option value="' + obj.team + '" ' + selected + '>' + obj.team + '</option>';
                }
                module += '</select>';
                $('#BHIPTeamSelectDivId').html('');
                $('#BHIPTeamSelectDivId').append(module);
                _loadBHIPTeam();
                
                $('#BHIPTeamSelectId').change(function() {
                    self.selectedTeam=$(this).find('option:selected').html();
                    _loadBHIPTeam();
                });
            }
        });
    }
    
    function _loadBHIPTeam() {
        $.ajax({
            type:   "post",
            url:    "../BHIPServlet",
            data:   "option=getBHIPTeam&team=" + self.selectedTeam,
            async:  true,
            beforeSend: function(){
                if(!self.firstLoad){
                    $().loading(true,'../');
                }
            },
            complete: function(){
                $().loading(false);
            },
            success: function(msg) {
                var patients = msg._table,
                    module = null,
                    row = '';
                for(i in patients) {
                    var d = patients[i],
                        appt = new Date(d.NextAppointmentDatetime);
                    row +=
                        '<tr class="gradeC">' +
                            '<td><a href="#" sid="' + d.PatientSID + '" sta3n="' + d.Sta3n + '">' + d.PatientName + '</a></td>' +
                            '<td class="center">' + d.Last4 + '</td>' +
                            '<td class="center">' + d.Age + '</td>' +
                            '<td class="center">' + d.ProviderName + '</td>' +
                            '<td class="center">' + appt.toString("yyyy-MM-dd HH:mm") + '</td>' +
                            '<td class="center">' + d.NextAppointmentLocation + '</td>' +
                        '</tr>';
                }
                module =
                    '<table id="bhipTableId" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                        '<thead>' +
                            '<tr>' +
                                '<th>Name</th>' +
                                '<th>Last 4</th>' +
                                '<th>Age</th>' +
                                '<th>MHTC</th>' +
                                '<th>Next Appt.</th>' +
                                '<th>Location</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                            row +
                        '</tbody>' +
                    '</table>';
                self.target.html('');
                self.target.append(module);
                self.currentBHIPTeamTable = $('#bhipTableId').dataTable({
                    "bLengthChange": false
                    ,"bJQueryUI": true
                    ,"sScrollY": "350px"
                    ,"bScrollCollapse": true
                    ,"bPaginate": false
                    ,"sPaginationType": "full_numbers"
                });
                $('#bhipTableId tbody td a').click(function() {
                    $().loading(true,'../');
                    $('#popupDivId').popup('bhip_overview_patient.html?name=' + $(this).html() + '&sid=' + $(this).attr('sid') + '&sta3n=' + $(this).attr('sta3n') + '&team=' + self.selectedTeam);
                });
                $('#TodayButtonId').click(function(){
                    var today = new Date();
                    self.currentBHIPTeamTable.fnFilter(today.toString("yyyy-MM-dd"));
                });
                self.firstLoad = false;
                parent.update();
            }
        });
    }
};
