var CustomGoalTrackingMeasuresPopupController = function(customGoalTrackingMeasuresPopupManager) {
    var self = this;

    (function() {
        self.title = 'Custom Goal Tracking Measures',
        self.width = 720,
        self.height = 650,
        self.path = customGoalTrackingMeasuresPopupManager.path,
        self.url = self.path + 'customGoalTrackingMeasuresPopup.jsp',
        self.openButtonId = 'customGoalTrackingButtonId',
        self.isInitialized = false,
        self.temporaryPatientData = null,
        self.patientData = customGoalTrackingMeasuresPopupManager.patientData,
        self.customGoalTrackingMeasuresPopupManager = customGoalTrackingMeasuresPopupManager;
    })(jQuery);

    self.load = function() {
        self.customGoalTrackingMeasuresPopupManager.ajax.logEvent('CustomGoals(load)',1016);
        if(!self.isInitialized) {
            init();
            self.isInitialize = true;
        }
        self.customGoalTrackingMeasuresPopupManager.refresh();
        parent.$('body, html').trigger('scroll');
    };
    self.save = function() {
        self.customGoalTrackingMeasuresPopupManager.ajax.logEvent('CustomGoals(save)',1016);
        if(self.customGoalTrackingMeasuresPopupManager.saveCustomGoals()) {
            $('#txtArea_trtMonRight').val(self.patientData.getMeasuresDisplay());
            return true;
        } else {
            //alert("Please verify goals have values selected.")
        }
        return false;
    };

    return self;

    function init() {
        /*
        $('#likertEditDivId').hide(); // IE strikes again.. this is needed to hide table on startup
        $('#freqCreateRadioId').hide(); // IE
        $('#rangeCreateRadioId').hide();
        $('#likertEditDivId').removeClass('bob'); // IE
        */
        $('button').button();

        $('#nameCreateInputId').ForceAlphabeticOnly();
        $('#nameEditInputId').ForceAlphabeticOnly();
        $('#goalCreateInputId').ForceNumericOnly();
        $('#minRangeSelectInputCreateId').ForceNumericOnly();
        $('#maxRangeSelectInputCreateId').ForceNumericOnly();

        $('#creationEditTabId').tabs({
            selected: 0,
            select: function(event, ui) {
                if (ui.index == 0) {
                    self.customGoalTrackingMeasuresPopupManager.ajax.logEvent('CustomGoals(CreateTab)', 1016);
                } else if (ui.index == 1) {
                    self.customGoalTrackingMeasuresPopupManager.ajax.logEvent('CustomGoals(EditTab)', 1016);
                }
            }
        });

        $('#createRadioDivId').buttonset();
        $('#editRadioDivId').buttonset();
        $('#freqCreateDivId').buttonset();
        $('#freqCreateDivId').hide();
        $('#freqEditDivId').buttonset();
        $('#freqEditDivId').hide();

        $('#rangeCreateDivId').hide();

        $('#likertFreqRadioEditId').buttonset();
        $('#freqSelectRadioEditId').buttonset();
        $('#rangeRadioEditId').buttonset();
        $('#rangeRadioCreateId').buttonset();
        $('#freqSelectRadioEditId').hide();
        $('#likertSelectedEditId').hide();

        $('#likertCreateRadioId').click(function() {
            $('#likertCreateDivId').show();
            $('#freqCreateDivId').hide();
            $('#rangeCreateDivId').hide();
            $('#symptomaticRangeHigherCreateId').removeAttr('disabled');
            $('#symptomaticRangeLowerCreateId').removeAttr('disabled');
            $('#symptomaticRangeHigherCreateId').button("refresh");
            $('#symptomaticRangeLowerCreateId').button("refresh");
        });

        $('#freqCreateRadioId').click(function() {
            $('#freqCreateDivId').show();
            $('#rangeCreateDivId').hide();
            $('#likertCreateDivId').hide();
            $('#symptomaticRangeHigherCreateId').removeAttr('disabled');
            $('#symptomaticRangeLowerCreateId').removeAttr('disabled');
            $('#symptomaticRangeHigherCreateId').button("refresh");
            $('#symptomaticRangeLowerCreateId').button("refresh");
        });

        $('#rangeCreateRadioId').click(function() {
            $('#rangeCreateDivId').show();
            $('#freqCreateDivId').hide();
            $('#likertCreateDivId').hide();
            $('#symptomaticRangeHigherCreateId').attr('disabled','disabled');
            $('#symptomaticRangeLowerCreateId').attr('disabled','disabled');
            $('#symptomaticRangeHigherCreateId').button("refresh");
            $('#symptomaticRangeLowerCreateId').button("refresh");
        });

        $('#likertEditRadioId').click(function() {
            $('#likertEditDivId').show();
            $('#freqEditDivId').hide();
            $('#rangeEditDivId').hide();
        });
        $('#freqEditRadioId').click(function() {
            $('#freqEditDivId').show();
            $('#likertEditDivId').hide();
            $('#rangeEditDivId').hide();
        });
        $('#rangeEditRadioId').click(function() {
            $('#rangeEditDivId').show();
            $('#freqEditDivId').hide();
            $('#likertEditDivId').hide();
        });
    }
};