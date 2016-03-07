var OutcomeNote = function(patientIEN) {
    var self = this;

    (function() {
        self.ien = patientIEN,
        self.titleIEN = null,
        self.title = null,
        self.groupMembers = null,
        self._root = null,
        self.historic = null,
        self.result = null,
        self.encounters = null,
        self.hash = {},
        self.hash['encounter'] = null,
        self.hash['titleIEN'] = null,
        self.hash['outcomeNote'] = null,
        self.hash['patientData'] = null;
        self.utility = new Utility();
    })(jQuery);

    self.init = function() {
        if(self.utility.isIE) {
            $(".fakePatientGraphClass").removeClass(); // IE hack to cause repainting
        }
        _setupEncounters();
    }

    self.save = function() {
        $('#saveingOverlayId').show();
        setTimeout(function() {
            _save();
            var obj = {option: 'saveOutcomeNote', noteData: self.hash };
            $.ajax({
                type:       "post",
                url:        "NoteServlet",
                dataType:   "json",
                data:       obj,
                async:      false,
                success:    function(msg) {
                    if(msg==true) {
                        alert("Note Saved Successfully!");
                        returnToHomePage();
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
            $('#saveingOverlayId').hide();
        },500);

    }
    return self;

    function _save() {
        var patHash = '';
        self.patData = $('body').data('patData');
        self.patData.setEncounter(_getDate($('#encounterSelectId :selected').text()));
        self.utility.print(self.patData);
        if(self.patData!=null || self.patData!=undefined) {
            patHash = self.patData.getHash();
        }self.utility.print(patHash);
        var shiftContentBelowHeader = "\n";
        self.hash['encounter'] = $('#encounterSelectId :selected').val(),
        self.hash['titleIEN'] = '4119',     // 4119-> "MH COMMEND TRACKING NOTE"; 304->"MHC FOLLOWUP 10456""
        self.hash['outcomeNote'] = shiftContentBelowHeader + $("#outcomeNoteTextareaId").val(),
        self.hash['patientData'] = patHash;
    }
    function _setupEncounters(){
        _pullEncounters();
        for(var i in self.encounters){
            var obj = self.encounters[i];
            $('#encounterSelectId').append('<option value="' + obj.encounter + '">' + obj.display + '</option>');
        }
        $('#encounterSelectId').change(function() {
            var encounterString = $('#encounterSelectId :selected').val();
            console.log(encounterString);
            _getGroupMembers(encounterString);
            var namez = '';
            var dlem = '';
            for(i in self.groupMembers){
                namez += dlem + self.groupMembers[i].Name;
                dlem = '/';
            }
            console.log(namez);
        });
    }

    function _pullEncounters() {
        $.ajax({
            type:   "post",
            url:    "GroupNoteServlet",
            data:   "option=getEncounters",
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
    
    function _getGroupMembers(encounterString) {
        $.ajax({
            type:   "post",
            url:    "GroupNoteServlet",
            data:   "option=getGroupMembers&encounterString=" + encounterString,
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

    function _repairString(str) {
        str = str.replace("<", "[");
        str = str.replace(">", "]");
        return str;
    }

    function _isEmpty(obj) {
        for(var i in obj) {return false;}
        return true;
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