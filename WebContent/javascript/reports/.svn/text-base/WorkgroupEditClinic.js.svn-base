var WorkgroupEditClinic = function() {
    var self = this;

    self.sid = socket.getParameter('sid'),
    self.name = socket.getParameter('name'),
    self.sta3n = '640',
    self.isReady = false;
    self.data = null,
    self.root = '../';

    self.load = function() {
        if(!self.isReady) {
            _init();
            self.isReady = true;
        }
        self.data = _getClinicTimes();
        $('#clinicTimeProviderNameDivId').html(self.name);
        $('#startDatepickerInputId').val('');
        $('#finishDatepickerInputId').val('');
        $('#clinicTimeInputId').val('');
        var module =
            '<table id="tableId" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                '<thead>' +
                    '<tr>' +
                        '<th>ID</th>' +
                        '<th>Clinic %Time</th>' +
                        '<th>Start</th>' +
                        '<th>Delete</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>';
        for(i in self.data) {
            var cur = self.data[i],
                id = cur.ID,
                start = new Date(cur.Start),
                clinicTime = cur.ClinicTimeRate*100;
            module +=
                '<tr id="trId' + cur.ProviderSID + '" class="gradeC">' +
                    '<td class="center tdEditClinicTimeProviderID">' + cur.ID + '</td>' +
                    '<td class="center tdEditClinicTimeProviderClinicTime"><button id="clinicTimeButtonId' + id + '">' + Math.floor(clinicTime) + '%</button></td>' +
                    '<td class="center tdEditClinicTimeProviderInput"><input type="text" value="' + start.format("mm/dd/yyyy") + '" id="startInputId' + id + '" style="width: 80px;" disabled/></td>' +
                    '<td class="center"><img class="icon-class delete-class" src="' + self.root + 'images/X-icon-small.png" alt="Delete"/></td>' +
                '</tr>';
        }
        module +=
            '</tbody>' +
        '</table>';
        $('#tableDivId').html('');
        $('#tableDivId').append(module);
        $('#tableId').dataTable({
            "bLengthChange": false
            ,"bJQueryUI": true
            ,"sScrollY": "200px"
            ,"bScrollCollapse": true
            ,"bPaginate": false
            ,"bSort": false
            ,"sPaginationType": "full_numbers"
        });
        for(i in self.data){
            var cur = self.data[i],
                id = cur.ID;
            $('#startInputId' + id).datepicker({
                showOn: "button",
                buttonImage: self.root + "images/calendar.gif",
                buttonImageOnly:true,
                changeMonth: true,
                changeYear: true
            });
            $('#startInputId' + id).change(function(){
                var parent = $(this).parent().parent(),
                    curId = parent.find('td.tdEditClinicTimeProviderID').html(),
                    start = parent.find('td.tdEditClinicTimeProviderInput').find('input').val(),
                    time = parent.find('td.tdEditClinicTimeProviderClinicTime').find('button').val().replace('%','');
                _setClinicTime(curId, time, start);
            });
            $('#clinicTimeButtonId' + id).click(function(){
                var parent = $(this).parent().parent(),
                    curId = parent.find('td.tdEditClinicTimeProviderID').html(),
                    start = parent.find('td.tdEditClinicTimeProviderInput').find('input').val(),
                    time = parent.find('td.tdEditClinicTimeProviderClinicTime').find('button').val().replace('%','');
                var newTime = _editClinicTime(curId, time, start);
                if(newTime!==null){
                    $('#clinicTimeButtonId' + curId).html(newTime+'%');
                }
            });
        }
        $('.delete-class').click(function() {
            var parent = $(this).parent().parent(),
                id = parent.find('td.tdEditClinicTimeProviderID').html();
            _removeClinicTime(id);
            self.load();
        });
    }

    return self;

    function _init() {
        $('#saveButtonID').click(function() {
            var start = $('#startDatepickerInputId').val(),
                time = $('#clinicTimeInputId').val();
            _addClinicTime(time,start);
            self.load();
        });
        $('#clinicTimeInputId').ForceNumericOnly();
        $('#startDatepickerInputId').datepicker({
            showOn: "button",
            buttonImage: self.root + "images/calendar.gif",
            buttonImageOnly:true,
            changeMonth: true,
            changeYear: true
        });
        $('button').button();
    }
    
    function _editClinicTime(id, time, start){
        var result = prompt("Please enter the new % clinic time.",time);
        if(result!==null){
            _setClinicTime(id, result, start);
        }
        return result;
    }
    
    function _getClinicTimes() {
        var result = null;
        if(self.sid===null) {return result;}
        $.ajax({
            type:   "post",
            url:    self.root + "WorkgroupServlet",
            data:   "option=getClinicTimes&sid=" + self.sid,
            async:  false,
            success: function(msg) {
                result = msg._table;
            }
        });
        return result;
    }

    function _setClinicTime(id, time, start) {
        $.ajax({
            type:   "post",
            url:    self.root + "WorkgroupServlet",
            data:   "option=setClinicTime&id=" + id + "&time=" + time + "&start=" + start,
            async:  false
        });
    }
    
    function _addClinicTime(time, start) {
        if(self.sid===null || self.sta3n===null) {return;}
        $.ajax({
            type:   "post",
            url:    self.root + "WorkgroupServlet",
            data:   "option=addClinicTime&sid=" + self.sid + "&sta3n=" + self.sta3n + "&start=" + start + "&time=" + time,
            async:  false
        });
    }

    function _removeClinicTime(id) {
        $.ajax({
            type:   "post",
            url:    self.root + "WorkgroupServlet",
            data:   "option=removeClinicTime&id=" + id,
            async:  false
        });
    }
    
    function _getData(id){
        var result = null;
        for(i in self.data) {
            var cur = self.data[i],
                curId = cur.ID;
            if(id===curId){
                result = cur;
                break;
            }
        }
        return result;
    }
};