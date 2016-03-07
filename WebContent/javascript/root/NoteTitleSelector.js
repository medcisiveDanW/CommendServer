var NoteTitleSelector = function(patientIEN) {
    var self = this;

    (function() {
        self.ien = patientIEN,
        self.titleIEN = null,
        self.title = null,
        self._root = null,
        self.historic = null,
        self.result = null,
        self.encounters = null,
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
        _setupEncounters();
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
        // hack for IE
        //$("#noteTitleSelectorOptionId").css('width',100);
        //$("#noteTitleSelectorOptionId").css('width','auto');
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

    function _setupEncounters() {
        _pullEncounters();
        for(var i in self.encounters){
            var obj = self.encounters[i];
            $('#encounterSelectId').append('<option value="' + obj.encounter + '">' + obj.display + '</option>');
        }
    }

    function _pullEncounters() {
        $.ajax({
            type:   "post",
            url:    "NoteServlet",
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

    function _repairString(str) {
        str = str.replace("<", "[");
        str = str.replace(">", "]");
        return str;
    }

    function _isEmpty(obj) {
        for(var i in obj) {return false;}
        return true;
    }
};