var GoalTrackingMeasuresPopupController = function(path, patientData, ajax) {
    var self = this;

    (function() {
        self.title = 'Goal Tracking Measures',
        self.width = 600,
        self.height = 600,
        self.ajax = ajax,
        self.url = path + 'goalTrackingMeasuresPopup.jsp',
        self.openButtonId = 'goalTrackingMeasuresButtonId',
        self.isInitialized = false,
        self.temporaryGoalTrackingMeasure = null,
        self.patientData = patientData;
    })(jQuery);

    self.load = function() {
        self.ajax.logEvent('GoalTracking (load)', 1015);
        if(!self.isInitialized) {
            for(var key in self.patientData.goalTrackingMeasures.hash) {
                addMeasureCheckEventHandler(key);
            }
            self.isInitialize = true;
        }
        loadGoalTrackingMeasuresPopup();
        parent.$('body, html').trigger('scroll');
    };

    self.save = function() {
        self.ajax.logEvent('GoalTracking (save)', 1015);
        return saveGoalTrackingMeasurePopup();
    };

    return self;

    function loadGoalTrackingMeasuresPopup() {
        self.temporaryGoalTrackingMeasure = self.patientData.goalTrackingMeasures.getClone();
        $('.goalTrackingMeasuresCheckbox').attr('checked', false);
        for(var key in self.temporaryGoalTrackingMeasure.hash) {
            var current = self.temporaryGoalTrackingMeasure.hash[key];
            var checked = current.checked;
            var value = current.value;
            if(checked) {
                $('#' + key + 'CheckboxId').attr('checked', checked);
            }
            $('.' + key + 'MeasureDivRadioButton').attr('checked', false);
            if(value!=null) {
                $('input[name="' + key + 'MeasureDivRadioButton"]')[value].checked = checked;
            }
            if(checked) { $('#' + key + 'MeasureDiv').css( {'display' : 'block'} ); }
            else { $('#' + key + 'MeasureDiv').css( {'display' : 'none'} ); }
        }
    }

    function addMeasureCheckEventHandler(key) {
        var id = key + 'CheckboxId';
        var divId = key + 'MeasureDiv';
        $('#' + id).change( function() {
            var current = self.temporaryGoalTrackingMeasure.hash[key];
            if($('#' + id).attr('checked')) {
                self.ajax.logEvent('GoalTracking (' + id + ')', 1015);
                $('#' + divId).css( {'display' : 'block'} );
                current.checked = true;
            }
            else {
                $('#' + divId).css( {'display' : 'none'} );
                current.checked = false;
                current.value = null;
            }
        });
        $('input[name="' + key + 'MeasureDivRadioButton"]').change(function() {
            var val = $('input[name="' + key + 'MeasureDivRadioButton"]:checked').val();
            if(val!=undefined) {
                self.temporaryGoalTrackingMeasure.hash[key].value = val;
            }
        });
    }
    function saveGoalTrackingMeasurePopup() {
        var isValid = true;
        for(var key in self.temporaryGoalTrackingMeasure.hash) {
            var current = self.temporaryGoalTrackingMeasure.hash[key];
            if( (current.checked==true) && (current.value==null)) {
                isValid = false;
            }
        }
        if(isValid) {
            self.patientData.goalTrackingMeasures = self.temporaryGoalTrackingMeasure.getClone();
            $('#txtArea_trtMonRight').val(self.patientData.getMeasuresDisplay());
            return true;
        }
        else {
            alert('Please check to make sure all day values have been entered.')
        }
        return false;
    }
};