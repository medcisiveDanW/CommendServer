var GroupNote = function(sta3n,patientSID) {
    var self = this;

    (function() {
        self.sta3n = sta3n,
        self.sid = patientSID,
        self.titleIEN = null,
        self.title = null,
        self.groupMembers = null,
        self._root = null,
        self.historic = null,
        self.result = null,
        self.encounters = null,
        self.currentSelectedMember = null,
        self.savingGroup = false,
        self.hash = {},
        self.hash['encounter'] = null,
        self.hash['titleIEN'] = null,
        self.hash['groupNote'] = null,
        self.hash['patientData'] = null,
        self.hash['numberOfParticipants'] = 0;
        self.utility = new Utility();
    })(jQuery);

    self.init = function() {
        if(self.utility.isIE) {
            $(".fakePatientGraphClass").removeClass(); // IE hack to cause repainting
        }
        _setupEncounters();
        $('#saveButtonId').click(function(){
            self.save();
        });
    };

    self.save = function() {
        if(!self.savingGroup){
            self.currentSelectedMember.Note=$('#patientNoteTextareaId').val();
        }
        if(self.groupMembers.length>0){
            $('#saveingOverlayId').show();
            self.savingGroup = true;
            setTimeout(function() {
                _save();
                var data = {option: 'saveNote', noteData: self.hash };
                $.ajax({
                    type:       "post",
                    url:        "GroupNoteServlet",
                    dataType:   "json",
                    data:       data,
                    async:      false,
                    success:    function(msg) {
                        if(msg==true) {
                            var height = $('.savingOverlayTop').css('height').replace('px','');
                            height = parseInt(height) + 15;
                            $('.savingOverlayTop').css('height',height);
                            $('#groupMembersSavedSoFarDivId').append('<br><span style="font-size:1.2em;">' + self.currentSelectedMember.Name + '\'s note has been saved.</span>');
                            self.save();
                        }
                        else {
                            alert("Save failed! This error has been logged in our database.\n\nTo help assist in resolving this issue please feel free give any further details in the Feedback section below.");
                        }
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        if(xhr.responseText=='MDWSfailed') {
                            alert('An external dependency to COMMEND has failed at this time.  Note saving capability is not available.');
                        }
                    }
                });
                //$('#saveingOverlayId').hide();
            },500);
        } else {
            if(self.savingGroup) {
                alert("All Notes Have Been Saved Successfully!");
                $('#returnToHomeId').submit();
            }
        }
    };
    
    return self;

    function _save() {
        self.patData = $('body').data('patData');
        self.patData.setEncounter(_getDate($('#encounterSelectId :selected').text()));
        self.currentSelectedMember = self.groupMembers[0];
        self.groupMembers.splice(0,1);
        self.hash['encounter'] = $('#encounterSelectId :selected').val(),
        self.hash['titleIEN'] = $('#noteTitleSelectorOptionId').find(':selected').val(), //'4119',     // 4119-> "MH COMMEND TRACKING NOTE"; 304->"MHC FOLLOWUP 10456""
        self.hash['groupNote'] = $("#groupNoteTextareaId").val(),
        self.hash['patientNote'] = self.currentSelectedMember.Note,
        self.hash['patientData'] = self.patData.getHash(),
        self.hash['patientIEN'] = self.currentSelectedMember.PatientIEN;
    }
    
    function _setupEncounters(){
        _pullEncounters();
        for(var i in self.encounters){
            var obj = self.encounters[i];
            $('#encounterSelectId').append('<option value="' + obj.Encounter + '">' + obj.Display + '</option>');
        }
        var encounterString = $('#encounterSelectId :selected').val();
        _getGroupMembers(encounterString);
        _setGroupNoteHeader();
        _generateGroupMemberPanel();
        $('#encounterSelectId').change(function() {
            var encounterString = $('#encounterSelectId :selected').val();
            _getGroupMembers(encounterString);
            _setGroupNoteHeader();
            _generateGroupMemberPanel();
        });
        
        $('#therapyModeDialogId').bind('dialogclose',function(event){
            _setGroupNoteHeader();
        });
    }

    function _pullEncounters() {
        var data = {option:'getAppointments', sta3n:self.sta3n, patientSID:self.sid};
        $.ajax({
            type:   "post",
            url:    "GroupNoteServlet",
            data:   data,
            async:  false,
            success: function(msg) {
                self.encounters = msg;
            },
            error: function(xhr, textStatus, errorThrown) {
                self.utility.print(xhr);
                self.utility.print(textStatus);
                self.utility.print(errorThrown);
                self.encounters=null;
            }
        });
    }
    
    function _generateGroupMemberPanel(){
        var module =
            '<table id="groupMembersTableId" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                '<thead>' +
                    '<tr>' +
                        '<th>Group Members</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>';
            for(i in self.groupMembers) {
                var cur = self.groupMembers[i];
                module +=
                    '<tr id="trId' + cur.PatientSID + '" class="gradeC">' +
                        '<td>' + cur.Name + '</td>' +
                    '</tr>';
            }
        module +=
                '</tbody>' +
            '</table>';
        $('#groupMembersDivId').html('');
        $('#groupMembersDivId').append(module);
        $('#groupMembersTableId').dataTable({
            "bLengthChange": false
            ,"bJQueryUI": true
            ,"sScrollY": "370px"
            ,"bPaginate": false
            ,"bFilter": false
            ,"sPaginationType": "full_numbers"
        });
        for(i in self.groupMembers) {
            var cur = self.groupMembers[i];
            if(i==0){
                self.currentSelectedMember=cur;
                cur.TrId='trId' + cur.PatientSID;
                cur.DefaultColor=$('#' + cur.TrId).find('td').css('background-color');
                $('#' + cur.TrId).find('td').css('background-color','#30AC30');
                $('#patientNoteTextareaId').val('');
                $('#currentMemberDivId').html(self.currentSelectedMember.Name);
            }
            
            $('#trId' + cur.PatientSID).click(function(){
                var parent = $(this),
                    id = parent.attr('id'),
                    sid = id.substring(4),
                    pat = _getPatient(sid);
                if(pat.DefaultColor===undefined){
                    pat.DefaultColor=parent.find('td').css('background-color');
                    pat.TrId=id;
                }
                self.currentSelectedMember.Note=$('#patientNoteTextareaId').val();
                $('#patientNoteTextareaId').val(pat.Note);
                self.currentSelectedMember=pat;
                _restoreDefaultColors();                
                parent.find('td').css('background-color','#30AC30');
                $('#currentMemberDivId').html(self.currentSelectedMember.Name);
            });
        }
    }
    
    function _getGroupMembers(encounterString) {
        var data = {option:'getGroupMembers',encounterString:encounterString};
        $.ajax({
            type:   "post",
            url:    "GroupNoteServlet",
            data:   data,
            async:  false,
            success: function(msg) {
                self.groupMembers = msg;
            },
            error: function(xhr, textStatus, errorThrown) {
                self.utility.print(xhr);
                self.utility.print(textStatus);
                self.utility.print(errorThrown);
                self.encounters=null;
            }
        });
    }
    
    function _setGroupNoteHeader(){
        var result = '';
        self.hash['numberOfParticipants'] = self.groupMembers.length;
        var pd = self.patData = $('body').data('patData');
        if(pd!=null){
            if(pd.therapyMode!=null){
                if(pd.therapyMode.primaryMode!=null){
                    result += 'Group For: ' + pd.therapyMode.primaryMode + '<br>';
                }
            }
        }
        if(self.groupMembers!=null){
            result += 'Number of participants: ' + self.hash['numberOfParticipants'] + '<br>';
        }
        if(pd!=null){
            if(pd.therapyMode!=null){
                if(pd.therapyMode.duration!=null){
                    result += 'Duration: ' + pd.therapyMode.duration;
                }
            }
        }
        $('#noteHeaderInfoDivId').html(result);
    }

    function _repairString(str) {
        str = str.replace("<", "[");
        str = str.replace(">", "]");
        return str;
    }

    function _isEmpty(obj) {
        for(var i in obj) {return false;}
        return true;
    }
    
    function _restoreDefaultColors(){
        for(i in self.groupMembers) {
            var cur = self.groupMembers[i];
            if(cur.TrId!==undefined){
                $('#' + cur.TrId).find('td').css('background-color',cur.DefaultColor);
            }
        }
    }
    
    function _getPatient(sid){
        for(var i in self.groupMembers) {
            var cur = self.groupMembers[i];
            if(cur.PatientSID===sid){
                return cur;
            }
        }
        return null;
    }

    function _getDate(str) {
        var indexStart = -1,
            indexEnd = -1,
            editedStr = '',
            i = 0,
            length = str.length;
        if(str.length>21) {
            for(i = 0; i < 21; i++) {
                editedStr += str.charAt(i);
            }
            return editedStr;
        }
        //else search for old style (may need to be taken out)
        for(i = 0; i < length; i++) {
            if(str.charAt(i)==':') {
                indexStart = i+2;
                break;
            }
        }
        for(i = 0; i < length; i++) {
            if(str.charAt(i)=='[') {
                indexEnd = i-1;
            }
        }
        if( (indexStart>0) && (indexEnd>0)) {
            for(i = indexStart; i < indexEnd; i++) {
                editedStr += str.charAt(i);
            }
            return editedStr;
        }
        return '';
    }
};


var NoteTitle = function(patientIEN) {
    var self = this;

    (function() {
        self.patientIEN = patientIEN,
        self.historic = null,
        self.titleIEN = null,
        self.title = null,
        self.utility = new Utility();
    })(jQuery);
    
    self.init = function() {
        var first = true,
            sel = 'selected="selected"';
        if(self.utility.isIE) {
            $(".fakePatientGraphClass").removeClass(); // IE hack to cause repainting
        }
        _pullData(null);
        if(self.historic!=null && !_isEmpty(self.historic)) {
            for(var i in self.historic) {
                var cur = self.historic[i];
                if(first) {first = false;}
                else {sel = '';}
                $("#noteTitleSelectorOptionId").append('<option class="tempNoteTitleOptionClass" value=' + i + '  ' + sel + '>' + cur + '</option>');
            }
        }
        else {
            $("#noteTitleSelectorOptionId").append('<option class="tempNoteTitleOptionClass" value=304 selected="selected">MHC [MHC FOLLOWUP 10456]</option>');
        }
        self.titleIEN = $('#noteTitleSelectorOptionId').find(':selected').val();
        self.title = $('#noteTitleSelectorOptionId :selected').text();
        
        $("#noteTitleSearchId").click(function() {_update();});
        $("#noteTitleSearchTextId").keypress(function(e) {
            if (e.keyCode == 13 && !e.shiftKey) {
                e.preventDefault();
                _update();
            }
        });
        $('#noteTitleSearchTextId').click(function() {$('#noteTitleSearchTextId').val('');});
        $('#noteTitleSearchTextId').blur(function() {
            var val = $('#noteTitleSearchTextId').val();
            if(val=='') {
                $('#noteTitleSearchTextId').val('Enter Desired Title');
            } else {}
        });
        $('#noteTitleSelectorOptionId').change(function() {
            self.titleIEN = $('#noteTitleSelectorOptionId').find(':selected').val();
            self.title = $('#noteTitleSelectorOptionId :selected').text();
        });
    }
    
    return self;
    
    function _update() {
        var val = $("#noteTitleSearchTextId").val(),
            sel = 'selected="selected"',
            first = true;
        if(val.length>1 && val!='Enter Desired Title') {
            _pullData(val);
            if(self.result!=null) {
                $(".tempNoteTitleOptionClass").remove();
                for(var i in self.result) {
                    var cur = _repairString(self.result[i]);
                    if(first) {first = false;}
                    else {sel = '';}
                    $("#noteTitleSelectorOptionId").append('<option class="tempNoteTitleOptionClass" value=' + i + ' ' + sel + '>' + cur + '</option>');
                }
            }
        }
        self.titleIEN = $('#noteTitleSelectorOptionId').find(':selected').val();
        self.title = $('#noteTitleSelectorOptionId :selected').text();
        $("#noteTitleSelectorOptionId").css('width','520px');
    }
    
    function _pullData(search) {
        $.ajax({
            type:   "post",
            url:    "NoteServlet",
            data:   "option=searchTitle&ien=" + self.ien + "&search=" + search,
            async:  false,
            success: function(msg) {
                self._root = msg._root;
                self.historic = self._root.historic;
                self.result = self._root.search;
            }
        });
    }
    
    function _isEmpty(obj) {
        for(var i in obj) {return false;}
        return true;
    }
    
    function _repairString(str) {
        str = str.replace("<", "[");
        str = str.replace(">", "]");
        return str;
    }
};