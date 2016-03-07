var TherapyModePopupController = function(path, patientData, ajax) {
    var self = this;

    (function() {
        self.title = 'Procedure',
        self.width = 360,
        self.height = 360,
        self.ajax = ajax,
        self.path = path,
        self.u = new Utility();
        self.url = path + 'therapyModePopup.jsp',
        self.openButtonId = 'therapyModeButtonId',
        self.nothingEntered = '',
        self.isInitialized = false,
        self.temporaryTherapyMode = null,
        self.patientData = patientData;
    })(jQuery);

    self.load = function() {
        self.ajax.logEvent('TherapyMode(load)', 1013 );
        if(!self.isInitialized) {
            $(".vertMenu").buildMenu({
                menuWidth:170,
                openOnRight:true,
                menuSelector: ".menuContainer",
                iconPath:"javascript/root/jquery.mb.menu-2.9.6/ico/",
                hasImages:true,
                fadeInTime:200,
                fadeOutTime:200,
                adjustLeft:0,
                adjustTop:0,
                opacity:.95,
                openOnClick:false,
                minZindex:2000,
                shadow:false,
                hoverIntent:0,
                submenuHoverIntent:0,
                closeOnMouseOut:true
            });
            $('#primary_mode_other_text_id').hide();
            $('#secondary_mode_other_text_id').hide();
            $('.minutesSelectionClass').click(function() {
                $('#therapy_duration_id').html($(this).html());
            });
            self.isInitialized = true;
        }
        loadTherapyModePopup();
        parent.$('body, html').trigger('scroll');
    }

    self.save = function() {
        self.ajax.logEvent('TherapyMode(save)', 1013 );
        var requirementsMet = saveTherapyModePopup();
        if(requirementsMet) {
            self.patientData.therapyMode = self.temporaryTherapyMode.getClone();
            $('#therapyModePopupErrorDisplayId').text('');
            return true;
        } else {
            var str = '';
            if($('#primary_mode_id').html()==self.nothingEntered) {
                str += "Please enter a Type of Therapy.\n"
            }
            if($('#therapy_duration_id').html()==self.nothingEntered) {
                str += "Please enter a Duration."
            }
            $('#therapyModePopupErrorDisplayId').text(str);
        }
        return false;
    };

    return self;

    function loadTherapyModePopup() {
        self.temporaryTherapyMode = self.patientData.therapyMode.getClone();
        if(self.temporaryTherapyMode.primaryMode!=null) {
            $('#primary_mode_id').html(self.temporaryTherapyMode.primaryMode);
        } else {
            $('#primary_mode_id').html(self.nothingEntered);
        }
        if(self.temporaryTherapyMode.secondaryMode!=null) {
            $('#secondary_mode_id').html(self.temporaryTherapyMode.secondaryMode);
        } else {
            $('#secondary_mode_id').html('None');
        }
        if(self.temporaryTherapyMode.duration!=null) {
            $('#therapy_duration_id').html(self.temporaryTherapyMode.duration);
        } else {
            $('#therapy_duration_id').html(self.nothingEntered);
        }
        if(self.temporaryTherapyMode.serviceModality!=null) {
            $('#interaction_id').html(self.temporaryTherapyMode.serviceModality);
        } else {
            $('#interaction_id').html(self.nothingEntered);
        }
        if(self.temporaryTherapyMode.contactType!=null) {
            $('#contact_type_id').html(self.temporaryTherapyMode.contactType);
        } else {
            $('#contact_type_id').html(self.nothingEntered);
        }
    }
    function saveTherapyModePopup() {
        var requirementPrimaryMode = false;
        var requirementDuration = false;
        var optional = '';
        if($('#primary_mode_id').html()!=self.nothingEntered) {
            requirementPrimaryMode = true;
            optional = '';
            if($('#primary_mode_other_text_id').val()!='') {
                optional = '(' + $('#primary_mode_other_text_id').val() + ')';
            }
            self.temporaryTherapyMode.primaryMode = $('#primary_mode_id').html() + optional;
        } else {
            self.temporaryTherapyMode.primaryMode = null;
        }
        if($('#secondary_mode_id').html()!='None') {
            optional = '';
            if($('#secondary_mode_other_text_id').val()!='') {
                optional = '(' + $('#secondary_mode_other_text_id').val() + ')';
            }
            self.temporaryTherapyMode.secondaryMode = $('#secondary_mode_id').html() + optional;
        } else {
            self.temporaryTherapyMode.secondaryMode = null;
        }
        if($('#therapy_duration_id').html()!=self.nothingEntered) {
            requirementDuration = true;
            self.temporaryTherapyMode.duration = $('#therapy_duration_id').html();
        } else {
            self.temporaryTherapyMode.duration = null;
        }
        if($("#interaction_id").html()!=self.nothingEntered) {
            self.temporaryTherapyMode.serviceModality = $("#interaction_id").html();
        } else {
            self.temporaryTherapyMode.serviceModality = null;
        }
        if($("#contact_type_id").html()!=self.nothingEntered) {
            self.temporaryTherapyMode.contactType = $("#contact_type_id").html();
        } else {
            self.temporaryTherapyMode.contactType = null;
        }
        if(requirementPrimaryMode && requirementDuration) {
            return true;
        }
        return false;
    }
};

function setDuration(input) {
    alert(input);
    $('#therapy_duration_id').val(input);
}
function setContactType(input) {
    $('#contact_type_id').html(input);
}
function setInteraction(input) {
    $('#interaction_id').html(input);
}
function setPrimaryMode(input) {
    $('#primary_mode_id').html(input);
    if(input.indexOf('(Other)')>0) {
        $('#primary_mode_other_text_id').show();
    } else {
        $('#primary_mode_other_text_id').hide();
    }
}
function setSecondaryMode(input) {
    $('#secondary_mode_id').html(input);
    if(input.indexOf('(Other)')>0) {
        $('#secondary_mode_other_text_id').show();
    } else {
        $('#secondary_mode_other_text_id').hide();
    }
}

