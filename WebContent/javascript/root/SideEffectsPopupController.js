var SideEffectsPopupController = function(path, patientData, ajax) {
    var self = this;

    (function() {
        self.title = 'Side Effects',
        self.width = 750,
        self.height = 630,
        self.ajax = ajax,
        self.url = path + 'sideEffectsPopup.jsp',
        self.openButtonId = 'sideEffectsButtonId',
        self.isInitialized = false,
        self.temporarySideEffects = null,
        self.patientData = patientData;
        $('#SE_txtArea_trtMonRight').val(self.patientData.sideEffects.print());
    })(jQuery);

    self.load = function() {
        self.ajax.logEvent('SideEffects(load)',1017);
        if(!self.isInitialized) {
            init();
            self.isInitialize = true;
        }
        loadSideEffectsPopup();
        parent.$('body, html').trigger('scroll');
    };
    self.save = function() {
        self.ajax.logEvent('SideEffects(save)',1017);
        return saveSideEffects();
    };

    return self;

    function init() {
        $('#noneSideEffectsCheckboxId').change(function() {
            if(this.checked) {
                $('.sideEffects_column').hide();
                $('#sideEffectRadioButton0Id').attr('checked',true);
                $('input:radio').each(function() {
                    $(this).attr('disabled','disabled');
                });
                $('#selectSvrSEid').attr('disabled','disabled');
            } else {
                $('.sideEffects_column').show();
                $('input:radio').each(function() {
                    $(this).removeAttr('disabled');
                });
                $('#selectSvrSEid').removeAttr('disabled');
            }
        });
        for(var i in self.patientData.sideEffects.hash) {
            var sideEffectDialog = self.patientData.sideEffects.hash[i].dialog;
            addCheckboxEventHandler( i,  sideEffectDialog);
        }
        $('#selectSvrSEid').change(function() {
            var currentlySelected = $('#selectSvrSEid option:selected').val();
            var key = '';
            for(var i in self.temporarySideEffects.hash) {
                if( i + 'SideEffectsCheckboxIdOption' == currentlySelected) {
                    key = i;
                }
            }
            setPrimary(key);
        });
    }
    function loadSideEffectsPopup() {
        self.temporarySideEffects = self.patientData.sideEffects.getClone();
        $('.selectionOptionSideEffectClass').remove();
        $('#selectSvrSEid').append('<option class="selectionOptionSideEffectClass" value="defaultSideEffectSelect" selected>not selected</option>');
        for(var i in self.temporarySideEffects.hash) {
            var checked = self.temporarySideEffects.hash[i].checked;
            var primary = self.temporarySideEffects.hash[i].primary;
            var dialog = self.temporarySideEffects.hash[i].dialog;
            var checkboxId = i + 'SideEffectsCheckboxId';
            if(checked) {
                $('#' + checkboxId).attr('checked', true);
                if(primary) {
                    $('#selectSvrSEid').append('<option class="selectionOptionSideEffectClass" value="' + checkboxId + 'Option" selected="selected">' + dialog + '</option>');
                }
                else {
                    $('#selectSvrSEid').append('<option class="selectionOptionSideEffectClass" value="' + checkboxId + 'Option">' + dialog + '</option>');
                }
            }
            else {
                $('#' + checkboxId).attr('checked', false);
            }
        }
        if(self.temporarySideEffects.numbOfDays!=null) {
            $('#sideEffectRadioButton' + self.temporarySideEffects.numbOfDays + 'Id').attr('checked', true);
        }
    }
    function saveSideEffects() {
        var daysPerWeek = $('input[name=sideEffectRadioButton]:checked').val(),
        selectListSize = $("#selectSvrSEid option").size(),
        errorString = '<p>';
        if( (daysPerWeek!=undefined) && (selectListSize>1) ) {
            self.temporarySideEffects.numbOfDays = daysPerWeek;
            self.patientData.sideEffects = self.temporarySideEffects.getClone();
            $('#SE_txtArea_trtMonRight').val(self.patientData.sideEffects.print());
            $('#sideEffectsPopupErrorDisplayId').html('');
            return true;
        }
        if(daysPerWeek==undefined) {
            errorString += 'Please select a days per week value.<br>';
        }
        if(selectListSize<2) {
            errorString += 'Please select some side effects.';
        }
        $('#sideEffectsPopupErrorDisplayId').html(errorString + '</p>');
        return false;
    }
    function addCheckboxEventHandler(id, selectString) {
        var otherText = '';
        var checkboxId = id + 'SideEffectsCheckboxId';
        var textId = id + 'SideEffectsTextId';
        if(textId!=undefined) {
            var checkIfValidTextArea = $('#' + textId).val();
            if(checkIfValidTextArea!=undefined) {
                $('#' + textId).keyup(function(event) {
                    otherText = $('#' + textId).val();
                    if(otherText.length>2) {
                        $('#' + checkboxId).removeAttr("disabled");
                    }
                    else {
                        $('#' + checkboxId).attr('disabled', true);
                    }
                });
            }
        }
        $('#' + checkboxId).click(function() {
            var outputString = selectString;
            if(otherText!='') {
                outputString += ' (' + otherText + ')';
            }
            if($('#' + checkboxId).is(':checked')) {
                self.temporarySideEffects.hash[id].checked = true;
                setPrimary(id);
                self.temporarySideEffects.hash[id].value = outputString;
                $('#selectSvrSEid').append('<option class="selectionOptionSideEffectClass" value="' + checkboxId + 'Option" selected="selected">' + outputString + '</option>');
            }
            else {
                self.temporarySideEffects.hash[id].checked = false;
                self.temporarySideEffects.hash[id].primary = false;
                self.temporarySideEffects.hash[id].value = null;
                $("#selectSvrSEid" + " option[value='" + checkboxId + "Option']").remove();
            }
        });
    }
    function setPrimary(key) {
        for(var i in self.temporarySideEffects.hash) {
            if(key == i) {
                self.temporarySideEffects.hash[i].primary = true;
            }
            else {
                self.temporarySideEffects.hash[i].primary = false;
            }
        }
    }
    function debugSideEffectsHash(hash, comment) {
        var debugString = comment + '\n';
        for(var i in hash) {
            var checked = hash[i].checked;
            var primary = hash[i].primary;
            var dialog = hash[i].dialog;
            debugString += i + ' ' + checked + ' ' + primary + ' ' + dialog + '\n';
        }
        alert(debugString);
    }
};