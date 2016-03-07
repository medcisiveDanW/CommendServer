var MHCFollowupNote = function(ien,criticalHash,noteBuilder) {
    var self = this;

    (function() {
        self.u = new Utility();
        self.patData = new PatientData();
        self.titleSelector = new NoteTitleSelector(ien);
        self.titleSelector.init();
        self.criticalHash = criticalHash;
        self.nb = noteBuilder;
        self.autoSaveEnabled = false;
        self.ajaxManager = null;
        self.hash = {};
        self.hash['encounter'] = null,
        self.hash['titleIEN'] = null,
        self.hash['title'] = null,
        self.hash['patientData'] = null,
        self.hash['saveNoteHash'] = null,
        self.hash['saveHash'] = null,
        self.hash['principalMentalHealthProvider'] = null,
        self.hash['timeInSession'] = null,
        self.hash['sessionNumber'] = null,
        self.hash['information'] = null,
        self.hash['vetransChart'] = null,
        self.hash['sessionFocusedOn'] = null,
        self.hash['substanceUse'] = null,
        self.hash['suicidalHomicidalRisk'] = null,
        self.hash['medicationManagement'] = null,
        self.hash['activeProblemList'] = null,
        self.hash['sideEffects'] = null,
        self.hash['sideEffectsMeasurements'] = null,
        self.hash['labs'] = null,
        self.hash['weight'] = null,
        self.hash['mentalStatusExam'] = null,
        self.hash['outcomeMeasurements'] = null,
        self.hash['impression'] = null,
        self.hash['assessment'] = null,
        self.hash['diagnosis'] = null,
        self.hash['plan'] = null,
        self.hash['seenByAttendingPhysician'] = null,
        self.hash['lpsConserved'] = null,
        self.hash['clientStatesThat'] = null,
        self.hash['medicationRefills'] = null,
        self.hash['education'] = null,
        self.hash['tobaccoScreen'] = null;
        self.substanceUseId = null,
        self.suicidalId = null,
        self.medicationManagmentId = null,
        self.activeProblemListId = null,
        self.sideEffectsId = null,
        self.labsId = null,
        self.weightId = null,
        self.mentalStatusExamId = null,
        self.impressionId = null,
        self.seenByAttendingPhysicianId = null,
        self.LPSConservedId = null,
        self.clientStatesThatId = null,
        self.medicationRefillsId = null,
        self.tobaccoScreenId = null;
        self.medicationRefillSelectedValue = -1;
        self.confirm = {};
        self.confirm['SI HI'] = false;
        self.confirm['Session focused'] = false;
        self.confirm['Plan'] = false;
    })(jQuery);

    self.save = function() {
        var patHash = '',
            sessionTime = $("#timeInSessionTextId").val(),
            peObj = getPEStudy(),
            end =  '\n                                                                             [*]\n';
        if(self.patData!=null || self.patData!=undefined) {
            patHash = self.patData.getHash();
            patHash += getTemplateData(peObj.data());
        }
        if((sessionTime==null) || (sessionTime=='')) {sessionTime = '';}
        else {sessionTime += ' minutes';}
        var shiftContentBelowHeader = "\n";
        self.hash['encounter'] = $('#encounterSelectId :selected').val(),
        self.hash['titleIEN'] = self.titleSelector.titleIEN,
        self.hash['title'] = self.titleSelector.title,
        self.hash['patientData'] = patHash,
        self.hash['saveNoteHash'] = saveHeaderHash(),
        self.hash['principalMentalHealthProvider'] = $("#principalmMentalHealthProviderTextId").val(),
        self.hash['timeInSession'] = sessionTime,
        self.hash['sessionNumber'] = $("#sessionNumberSelectId").val(),
        self.hash['information'] = shiftContentBelowHeader + $("#informationTextareaId").val() + peObj.era(),
        self.hash['vetransChart'] = $('#veteranChartButtonId').val() + " reviewed.",
        self.hash['sessionFocusedOn'] = shiftContentBelowHeader + $("#sessionFucusedTextId").val() + peObj.tele(),
        self.hash['substanceUse'] = shiftContentBelowHeader + $("#substanceUseTextId").val(),
        self.hash['suicidalHomicidalRisk'] = shiftContentBelowHeader + saveSuicidalHomicidalRisk(),
        self.hash['medicationManagement'] = shiftContentBelowHeader + $("#medicationManagmentTextId").val(),
        self.hash['outcomeMeasurements'] = shiftContentBelowHeader + self.patData.getMeasuresDisplay(),
        self.hash['activeProblemList'] = shiftContentBelowHeader + $("#activeProblemListTextId").val(),
        self.hash['sideEffects'] = shiftContentBelowHeader + $("#sideEffectsTextId").val(),
        self.hash['sideEffectsMeasurements'] = shiftContentBelowHeader + self.patData.sideEffects.print(),
        self.hash['labs'] = shiftContentBelowHeader + $("#labsTextId").val(),
        self.hash['weight'] = shiftContentBelowHeader + '    ' + $("#weightTextId").val() + ' Lbs.',
        self.hash['mentalStatusExam'] = shiftContentBelowHeader + $("#mentalStatusExamTextId").val(),
        self.hash['impression'] = shiftContentBelowHeader + $("#impressionTextId").val(),
        self.hash['assessment'] = shiftContentBelowHeader + $("#assessmentTextId").val(),
        self.hash['diagnosis'] =shiftContentBelowHeader +  $("#diagnosisTextId").val(),
        self.hash['plan'] = shiftContentBelowHeader + savePlan(),
        self.hash['seenByAttendingPhysician'] = shiftContentBelowHeader + $("#seenByAttendingPhysicianTextareaId").val(),
        self.hash['lpsConserved'] = shiftContentBelowHeader + $("#LPSConservedTextareaId").val(),
        self.hash['clientStatesThat'] = saveClientStatesThat(),
        self.hash['medicationRefills'] = saveMedicationRefills(),
        self.hash['education'] = shiftContentBelowHeader + saveEducation() + peObj.homework(),
        self.hash['tobaccoScreen'] = shiftContentBelowHeader + saveTobaccoScreen();

        if(self.patData.therapyMode.primaryMode!=null) {
            self.hash['sessionNumber'] += end;
            self.hash['sessionNumber'] += 'Primary Therapy Mode: ' + self.patData.therapyMode.primaryMode;
            if(self.patData.therapyMode.secondaryMode!=null) {
                self.hash['sessionNumber'] += '\nSecondary Therapy Mode: ' + self.patData.therapyMode.secondaryMode;;
            }
        }
    }
    self.noteConfirmed = function() {
        var prefix = '<div class="ui-widget" style="padding-bottom: 5px;"><div class="ui-state-error ui-corner-all"><p style="margin: 3px 0px;"><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>',
            post ='</p></div></div>';
        var isConfirmed = checkList(self.confirm);
        var string = '<div id="noteNotConfirmedDivId" title="Save Note Requirements Have Not Been Met">';
        if(!self.confirm['Session focused']) {
            string += prefix + 'Information about the client\'s concerns for this session is not present or unchanged from the previous session.' + post;
        }
        if(!self.confirm['SI HI']) {
            string += prefix + 'You have not documented the patient\'s suicidal/homicidal risk.' + post;
        }
        if(!self.confirm['Plan']) {
            string += prefix + 'Information about future steps (under header PLAN) is not present or unchanged from the previous session.' + post;
        }
        string += '</div>';
        if(!isConfirmed) {
            window.parent.document.getElementById('frameNote').scrollIntoView(true);
            $('#noteNotConfirmedDivId').remove();
            $('body').append(string);

            $('#noteNotConfirmedDivId').dialog({
                resizable: false,
                width:450,
                position: ['auto', 0],
                modal: true,
                buttons: {
                    "Close": function() {
                        $(this).dialog( "close" );
                    }
                }
            });
        }
        return isConfirmed;
    }

    self.init = function() {
        //$('button').button();
        $('#toggleAllTextAreasId').tooltip('This button opens and closes all optional note text areas.');
        $('.noteSaveButtonClass').tooltip("Pressing this button saves text entered using COMMEND's Progress Note Template as an unsigned note in CPRS. Therapy modes and outcomes entered via COMMEND are also saved in this note. After saving a note the user must go into CPRS to edit the encounter and sign the note.");
        $('.noteSaveButtonClass').click(function() { saveNote(); });
        $('.noteTextAreaFocusClass').click(function(){
            if(!self.autoSaveEnabled) {
                self.autoSaveEnabled = true;
                var myInterval = setInterval(function() {
                    if(!saveDraft()) {
                        clearInterval(myInterval);
                    }
                }, 30000);
            }
        });
        $('.saveDraftButtonClass').tooltip("Pressing this button stores text entered using COMMEND's Progress Note Template in a special draft database. COMMEND will prompt you to reload the draft text when you open up the Progress Note Template for this patient again.");
        $('.saveDraftButtonClass').click(function() { saveDraft(); });
        $('#timeInSessionTextId').ForceNumericOnly();
        $('#weightTextId').ForceNumericOnly();

        self.patData.setEncounter(getDate($('#encounterSelectId :selected').text()));
        if(self.patData.therapyMode.duration!=null) {$('#timeInSessionTextId').val(self.patData.therapyMode.duration);}

        initOptionBlocks();
        setTemplateData();
        parent.$("#accordionNotes").click(function() {
            if(self.patData.therapyMode.duration!=null) {$('#timeInSessionTextId').val(self.patData.therapyMode.duration);}
        });
        $('#encounterSelectId').change( function() {
             self.patData.setEncounter(getDate($('#encounterSelectId :selected').text()));
        });

        $("#datepicker").datepicker({altField: '#alternate', altFormat: 'DD, d MM, yy'});

        self.seenByAttendingPhysicianId = setRadioHookEvent('seenByAttendingPhysicianId','seenByAttendingPhysicianExpandId','seenByAttendingPhysicianTextareaId','seenByAttendingPhysicianRadio','seenByAttendingPhysicianGroup');
        self.LPSConservedId             = setRadioHookEvent('LPSConservedId','LPSConservedExpandId','LPSConservedTextareaId','LPSConservedRadio','LPSConservedGroup');

        $('#clientStatesCommentsTextId').html('<textarea rows="5" cols="40"></textarea>');

        setButtonToggleEvent('vetranChartButtonId', 'was', 'was not');
        setButtonToggleEvent('clientStatesId', 'he', 'she');
        setButtonToggleEvent('tobaccoScreenCompletedButtonId', 'has', 'has not');
        setButtonToggleEvent('medicationRefillsButtonId','were','were not');

        $('#veteranChartButtonId').click(function() {
            var wasWasNot = $('#veteranChartButtonId').val();
            if(wasWasNot=='was') {
                $('#veteranChartButtonId').val('was not');
            } else {
                $('#veteranChartButtonId').val('was');
            }
        });

        $(".clientStatesCheckboxClass").click(function() {
            if($(this).attr('checked')) {
                self.criticalHash['clientStatesThatTextId'] = true;
            } else if($('.clientStatesCheckboxClass:checked').length==0) { // all unchecked
                self.criticalHash['clientStatesThatTextId'] = false;
            }
        });

        $(".medicationRefillsRadio").click(function() {
            self.criticalHash['medicationRefillsTextId'] = true;
            self.medicationRefillSelectedValue = $(this).val();
            if($('#medRefillsNotDiscussedId').attr('checked')){
                $('#medRefillsNotDiscussedExpandId').show();
            }
            else {
                $('#medRefillsNotDiscussedExpandId').hide();
            }
        });

        $('body').mousemove(function() {
            updateParent();
        });

        $(".noteTextAreaToggleClass").click( function() {
           logNoteInteraction('noteTextAreaToggle (' + this.id + ')', 1018);
        });

        $(".noteTextAreaFocusClass").click( function() {
           logNoteInteraction('noteTextAreaFocus (' + this.id + ')', 1018);
        });

        $('.suicidalConfirm').click(function() {
            if($('.suicidalConfirm:checked').length>0) {
                self.confirm['SI HI'] = true;
                $(".suicidalConfirm").closest('div').removeClass('highlightBackground');
                $(".suicidalConfirm").removeClass('highlightBackground');
            } else {
                self.confirm['SI HI'] = false;
                $('#suicidalHomicidalRiskSpanId').closest('div').addClass('highlightBackground');
            }
        });

        var sessionText = $('#sessionFucusedTextId').val();
        $("#sessionFocusedSpanId").closest('div').addClass('highlightBackground');
        $('#sessionFucusedTextId').keyup(function() {
            if(($('#sessionFucusedTextId').val()!='') && ($('#sessionFucusedTextId').val()!=sessionText)) {
                self.confirm['Session focused'] = true;
                $("#sessionFocusedSpanId").closest('div').removeClass('highlightBackground');
//                self.u.print('Session focused not start state');
            } else {
                self.confirm['Session focused'] = false;
                $("#sessionFocusedSpanId").closest('div').addClass('highlightBackground');
//                self.u.print('Session focused start state');
            }
        });

        var plan = $('#TAplanTextId').val();
        $('#planSpanId').closest('div').addClass('highlightBackground');
        $('#datepicker').addClass('highlightBackground');
        $('#TAplanTextId').addClass('highlightBackground');
        function confirmPlanDatepicker() {
            var datetime = $('#datepicker').val();
            if(datetime=='Click Here') {
                $('#datepicker').addClass('highlightBackground');
                return false;
            } else {
                $('#datepicker').removeClass('highlightBackground');
                return true;
            }
        }
        function confirmPlanText() {
            if(($('#TAplanTextId').val()!='') && ($('#TAplanTextId').val()!=plan)) {
                $("#TAplanTextId").removeClass('highlightBackground');
                return true;
            } else {
                $("#TAplanTextId").addClass('highlightBackground');
                return false;
            }
        }
        function confirmPlan() {
            var text = confirmPlanText(),
                picker = confirmPlanDatepicker();
            if(text && picker) {
                self.confirm['Plan'] = true;
                $("#planSpanId").closest('div').removeClass('highlightBackground');
                return true;
            } else {
                self.confirm['Plan'] = false;
                $("#planSpanId").closest('div').addClass('highlightBackground');
                return false;
            }
        }
        $('#datepicker').change(function() {
            confirmPlan();
        });
        $('#TAplanTextId').keyup(function() {
            confirmPlan();
        });

        var therapyModePopupController = new TherapyModePopupController('./', self.patData, self.ajaxManager),
            symptomFunctioningScalePopupController = new SymptomFunctioningScalePopupController('./', self.patData,self.ajaxManager),
            goalTrackingMeasuresPopupController = new GoalTrackingMeasuresPopupController('./', self.patData, self.ajaxManager),
            customGoalTrackingMeasuresPopupManager = new CustomGoalTrackingMeasuresPopupManager('./', self.patData, self.ajaxManager),
            customGoalTrackingMeasuresPopupController = new CustomGoalTrackingMeasuresPopupController(customGoalTrackingMeasuresPopupManager),
            sideEffectsPopupController = new SideEffectsPopupController('./', self.patData, self.ajaxManager);

        $('#therapyModeDialogId').dynamicDialog(therapyModePopupController);
        $('#symptomFunctioningDialogId').dynamicDialog(symptomFunctioningScalePopupController);
        $('#goalTrackingMeasuresDialogId').dynamicDialog(goalTrackingMeasuresPopupController);
        $('#customGoalTrackingMeasuresDialogId').dynamicDialog(customGoalTrackingMeasuresPopupController);
        $('#sideEffectsDialogId').dynamicDialog(sideEffectsPopupController);
        $('body').css("position", "relative");
        var par = parent.$('body, html');
        par.scroll(function() {
            var pos = parent.$("#accordionNotes").position();
            if($('#therapyModeDialogId').dialog('isOpen')) {
                $('#therapyModeDialogId').dialog('option', 'position', ['center',par.scrollTop()-pos.top]);
            }
            if($('#symptomFunctioningDialogId').dialog('isOpen')) {
                $('#symptomFunctioningDialogId').dialog('option', 'position', ['center',par.scrollTop()-pos.top]);
            }
            if($('#goalTrackingMeasuresDialogId').dialog('isOpen')) {
                $('#goalTrackingMeasuresDialogId').dialog('option', 'position', ['center',par.scrollTop()-pos.top]);
            }
            if($('#customGoalTrackingMeasuresDialogId').dialog('isOpen')) {
                $('#customGoalTrackingMeasuresDialogId').dialog('option', 'position', ['center',par.scrollTop()-pos.top]);
            }
            if($('#sideEffectsDialogId').dialog('isOpen')) {
                $('#sideEffectsDialogId').dialog('option', 'position', ['center',par.scrollTop()-pos.top]);
            }
        });
    }

    return self;

    function saveNote() {
        if(self.noteConfirmed()) {
            window.parent.document.getElementById('frameNote').scrollIntoView(true);
            $('#saveingOverlayId').show();
            setTimeout(function() {
                self.save();
                var obj = {option: 'saveNote', noteData: self.hash };
                $.ajax({
                    type:       "post",
                    url:        "NoteServlet",
                    dataType:   "json",
                    data:       obj,
                    async:      false,
                    success:    function(msg) {
                        if(msg==true) {
                            alert("Note Saved Successfully!");
                            parent.returnToHomePage();
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
    }

    function saveDraft() {
        var result = false;
        self.save();
        var obj = {option: 'saveDraft', noteData: self.hash };
        $.ajax({
            type:       "post",
            url:        "NoteServlet",
            dataType:   "json",
            data:       obj,
            async:      false,
            success:    function(msg) { result = true; },
            error: function(xhr, textStatus, errorThrown) {
                var u = new Utility();
                u.print(xhr); //JSON object i.e. responseText==whatever you sent from servlet
                u.print(textStatus); // error
                u.print(errorThrown); // Internal Server Error (HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
            }
        });
        return result;
    }

    function getTemplateData(injectData) {
        var hash = '[Template Data=';
        hash += '   [SI HI=';
        hash += '       [Denied=' + $('#suicidalDeniedId').attr('checked') + ']';
        hash += '       [Stable=' + $('#suicidalStableMoodId').attr('checked') + ']';
        hash += '       [Thoughts=' + $('#suicidalAcknowledgeId').attr('checked') + ']]';
        if(injectData!=undefined && injectData!='') {
            hash += injectData;
        }
        if(self.medicationRefillsId.getState()) {
            hash += '   [Medication Refill=';
            hash += '       [SelectedValue=' + self.medicationRefillSelectedValue + ']';
            hash += '       [ButtonValue=' + $('#medicationRefillsButtonId').val() + ']]';
        }
        if(self.clientStatesThatId.getState()) {
            hash += '   [Client states with regards psych meds=';
            hash += '       [IsTakingMeds=' + $('#clientStatesThatTakingMedsId').attr('checked') + ']';
            hash += '       [IsNotTakingMeds=' + $('#clientStatesThatNotTakingMedsId').attr('checked') + ']';
            hash += '       [LikeChange=' + $('#clientStatesThatLikeChangeMedsId').attr('checked') + ']';
            hash += '       [NotInterested=' + $('#clientStatesThatNotInterestedMedsId').attr('checked') + ']]';
        }
        hash += ']';
        return hash;
    }
    function setTemplateData() {
        var _tree = self.nb['_tree'];
        $('#medRefillsNotDiscussedExpandId').hide();
        $('#suicidalHomicidalRiskSpanId').closest('div').addClass('highlightBackground');
        if(_tree['Template Data']!=undefined) {
            var template = _tree['Template Data'];
            if(template['SI HI']!=undefined) {
                var sihi = template['SI HI'];
                if(isChecked(sihi['Denied'])) {
                    $('#suicidalDeniedId').closest('div').addClass('highlightBackground');
                }
                if(isChecked(sihi['Stable'])) {
                    $('#suicidalStableMoodId').closest('div').addClass('highlightBackground');
                }
                if(isChecked(sihi['Thoughts'])) {
                    $('#suicidalAcknowledgeId').closest('div').addClass('highlightBackground');
                }
            }
            if(template['Medication Refill']!=undefined) {
                var med = template['Medication Refill'];
                $('input:radio[name="medicationRefillsGroup"]').filter('[value="' + med['SelectedValue'] + '"]').attr('checked','checked');
                self.medicationRefillSelectedValue = med['SelectedValue'];
                if(med['SelectedValue']=='2') {$('#medRefillsNotDiscussedExpandId').show();
                } else {$('#medRefillsNotDiscussedExpandId').hide();}
                $('#medicationRefillsButtonId').val(med['ButtonValue']);
                if(self.medicationRefillSelectedValue>=0) {
                    self.criticalHash['medicationRefillsTextId']=true;
                    self.medicationRefillsId.toggleState();
                }
            }
            if(template['Client states with regards psych meds']!=undefined) {
                var client = template['Client states with regards psych meds'];
                $('#clientStatesThatTakingMedsId').attr('checked',isChecked(client['IsTakingMeds']));
                $('#clientStatesThatNotTakingMedsId').attr('checked',isChecked(client['IsNotTakingMeds']));
                $('#clientStatesThatLikeChangeMedsId').attr('checked',isChecked(client['LikeChange']));
                $('#clientStatesThatNotInterestedMedsId').attr('checked',isChecked(client['NotInterested']));
                if($('.clientStatesCheckboxClass:checked').length>0) {
                    self.criticalHash['clientStatesThatTextId'] = true;
                    self.clientStatesThatId.toggleState();
                }
            }
            if(template['Era']!=undefined) {
                var era = template['Era'];
                $('#eraOfServiceSelectId').val(era).attr('selected',true);
            }
        }
    }
    function getPEStudy() {
        var era = $('#eraOfServiceSelectId').val(),
            eraText = '',
            telehealth = $('#telehealthInputId').attr('checked'),
            teleText = '',
            homework = '',
            completed = $('#veteranCompletedSelectId').val(),
            completedText = '',
            appeared = $('#veteranAppearedSelectId').val(),
            appearedText = '',
            hash = '',
            end =  '\n                                                                             [*]\n';
        if(era!='') {
            hash += '       [Era=' + era + ']';
            eraText = end + 'Era of Service: ' + era;
        }
        if(telehealth!='') {
            hash += '       [Telehealth=' + telehealth + ']';
            teleText = end + 'The Veteran has verbally consented to receive health care using CVT/SF/CCHT. The Veteran is an appropriate candidate for telehealth and has been informed that their choice to participate in telehealth is voluntary. They have been informed that they can cease participation at any time without adverse effect to their continued access to health care services.';
        }
        if(completed!='N/A') {
            hash += '       [Completed=' + completed + ']';
            completedText = 'The veteran completed ' + completed + ' of the homework assigned.\n';
        }
        if(appeared!='N/A') {
            hash += '       [Engaged=' + appeared + ']';
            appearedText = 'Veteran appeared to be ' + appeared + ' engaged in working on his/her homework assignment.\n';
        }
        if(completed!='N/A' || appeared!='N/A') {
            homework = end + 'Homework Completion:\n' + completedText + appearedText;
        }
        return {
                data: function() {
                    return hash;
                },
                era: function() {
                    return eraText;
                },
                tele: function() {
                    return teleText;
                },
                homework: function() {
                    return homework;
                }
            };
    }
    function isChecked(bool) {
        if(isTrue(bool)) {
            return 'checked';
        } else {return '';}
    }
    function isTrue(bool) {
        if(bool=='true') {
            return true;
        }
        return false;
    }
    function initOptionBlocks() {
        self.substanceUseId         = setButtonHookEvent('substanceUseId','substanceUseExpandId','substanceUseSpanId','substanceUseTextId');
        self.suicidalId             = setButtonHookEvent('suicidalId','suicidalExpandId','suicidalSpanId','suicidalRiskTextId');
        self.medicationManagmentId  = setButtonHookEvent('medicationManagmentId','medicationManagmentExpandId','medicationManagmentSpanId','medicationManagmentTextId');
        self.activeProblemListId    = setButtonHookEvent('activeProblemListId','activeProblemListExpandId','activeProblemListSpanId','activeProblemListTextId');
        self.sideEffectsId          = setButtonHookEvent('sideEffectsId','sideEffectsExpandId','sideEffectsSpanId','sideEffectsTextId');
        self.labsId                 = setButtonHookEvent('labsId','labsExpandId','labsSpanId','labsTextId');
        self.weightId               = setButtonHookEvent('weightId','weightExpandId','weightSpanId','weightTextId');
        self.mentalStatusExamId     = setButtonHookEvent('mentalStatusExamId','mentalStatusExamExpandId','mentalStatusExamSpanId','mentalStatusExamTextId');
        self.impressionId           = setButtonHookEvent('impressionId','impressionExpandId','impressionSpanId','impressionTextId');
        self.clientStatesThatId     = setButtonHookEvent('clientStatesThatId','clientStatesThatExpandId','clientStatesThatSpanId','clientStatesThatTextId');
        self.medicationRefillsId     = setButtonHookEvent('medicationRefillsId','medicationRefillsExpandId','medicationRefillsSpanId','medicationRefillsTextId');
        self.tobaccoScreenId        = setButtonHookEvent('tobaccoScreenId','tobaccoScreenExpandId','tobaccoScreenSpanId','tobaccoScreenTextId');
        if(self.criticalHash['substanceUseTextId']===true) {self.substanceUseId.toggleState();}
        if(self.criticalHash['suicidalRiskTextId']===true) {self.suicidalId.toggleState();}
        if(self.criticalHash['medicationManagmentTextId']===true) {self.medicationManagmentId.toggleState();}
        if(self.criticalHash['activeProblemListTextId']===true) {self.activeProblemListId.toggleState();}
        if(self.criticalHash['sideEffectsTextId']===true) {self.sideEffectsId.toggleState();}
        if(self.criticalHash['labsTextId']===true) {self.labsId.toggleState();}
        if(self.criticalHash['weightTextId']===true) {self.weightId.toggleState();}
        if(self.criticalHash['mentalStatusExamTextId']===true) {self.mentalStatusExamId.toggleState();}
        if(self.criticalHash['impressionTextId']===true) {self.impressionId.toggleState();}
        if(self.criticalHash['tobaccoScreenTextId']===true) {self.tobaccoScreenId.toggleState();}
    }
    function saveSuicidalHomicidalRisk() {
        var suicidalDenied = $('#suicidalDeniedId').attr('checked');
        var suicidalStableMood = $('#suicidalStableMoodId').attr('checked');
        var suicidalAcknowledge = $('#suicidalAcknowledgeId').attr('checked');
        var suicidalHighRisk = $('#suicidalRiskTextId').val();
        var returnStr = "";
        if(suicidalDenied) {
            returnStr += "Client denied current suicidal or homicidal thoughts. ";
        }
        if(suicidalStableMood) {
            returnStr += "Client reports stable mood, no evidence of SI or HI. ";
        }
        if(suicidalAcknowledge) {
            returnStr += "Client acknowledged suicidal/homicidal thoughts, but denied plan or intent. ";
        }
        if(self.suicidalId.getState()) {
            returnStr += "Client is at high risk for hurting self or someone else.\nActions taken include: \n";
            returnStr += suicidalHighRisk;
        }
        return returnStr;
    }
    function savePlan() {
        var datepicker = $('#datepicker').val(),
            TAplanTextId = $('#TAplanTextId').val(),
            returnStr = "Client is scheduled for a follow-up appt at the MHC on " + datepicker + ".\n";
        returnStr += TAplanTextId;
        return returnStr;
    }
    function saveClientStatesThat() {
        var clientStatesThat = $('#clientStatesThatHeSheDivId').html();
        var clientStatesThatTakingMeds = $('#clientStatesThatTakingMedsId').attr('checked');
        var clientStatesThatNotTakingMeds = $('#clientStatesThatNotTakingMedsId').attr('checked');
        var clientStatesThatLikeChangeMeds = $('#clientStatesThatLikeChangeMedsId').attr('checked');
        var clientStatesThatNotInterestedMeds = $('#clientStatesThatNotInterestedMedsId').attr('checked');
        var clientStatesThatComments = $('#clientStatesThatTextId').val();
        var returnStr = " " + clientStatesThat + " ";
        if(clientStatesThatTakingMeds) {
            returnStr += "is taking psych meds as prescribed. ";
        }
        if(clientStatesThatNotTakingMeds) {
            returnStr += "is not taking psych meds as prescribed. ";
        }
        if(clientStatesThatLikeChangeMeds) {
            returnStr += "would like a change in psych meds. ";
        }
        if(clientStatesThatNotInterestedMeds) {
            returnStr += "is not interested in psych meds now. ";
        }
        returnStr += "\n\nComments:\n";
        returnStr += clientStatesThatComments;
        return returnStr;
    }
    function saveMedicationRefills() {
        var value = $("input[name='medicationRefillsGroup']:checked").val(),
            medRefillsNotDiscussedText = $('#medicationRefillsTextId').val(),
            wereWereNot = $('#medicationRefillsButtonId').val(),
            returnStr = " " + wereWereNot + " discussed and reviewed. It appears that ";
        if(value==0) {returnStr += "client is taking meds as prescribed.";}
        else if(value==1) {returnStr += "client is NOT taking meds as prescribed.";}
        else if(value==2) {
            returnStr += "med refills were not discussed because:\n";
            returnStr += medRefillsNotDiscussedText;
        }
        return returnStr;
    }
    function saveEducation() {
        var returnStr = "";
        returnStr += $('#educationTextId').val();
        returnStr += "\n" + $('#educationDivId').html();
        return returnStr;
    }
    function saveTobaccoScreen() {
        var returnStr = "";
        returnStr += "Tobacco screen/counseling ";
        returnStr += $('#tobaccoScreenCompletedButtonId').val();
        returnStr += " been completed.\n";
        returnStr += $('#tobaccoScreenTextId').val();
        return returnStr;
    }
    function saveHeaderHash() {
        var hash = new Array();
        if(self.substanceUseId.getState()===true) {
            hash["CURRENT SUBSTANCE USE:"] = 1;
        } else {hash["CURRENT SUBSTANCE USE:"] = 0;}

        if(self.medicationManagmentId.getState()===true) {
            hash["MEDICATION MANAGEMENT:"] = 1;
        } else {hash["MEDICATION MANAGEMENT:"] = 0;}

        if(self.activeProblemListId.getState()===true) {
            hash["ACTIVE PROBLEM LIST:"] = 1;
        } else {hash["ACTIVE PROBLEM LIST:"] = 0;}

        if(self.sideEffectsId.getState()===true) {
            hash["SIDE EFFECTS:"] = 1;
        } else {hash["SIDE EFFECTS:"] = 0;}

        if(self.labsId.getState()===true) {
            hash["LABS:"] = 1;
        } else {hash["LABS:"] = 0;}

        if(self.weightId.getState()===true) {
            hash["WEIGHT:"] = 1;
        } else {hash["WEIGHT:"] = 0;}

        if(self.mentalStatusExamId.getState()===true) {
            hash["MENTAL STATUS EXAM:"] = 1;
        } else {hash["MENTAL STATUS EXAM:"] = 0;}

        if(self.impressionId.getState()===true) {
            hash["IMPRESSION:"] = 1;
        } else {hash["IMPRESSION:"] = 0;}

        if(self.seenByAttendingPhysicianId.getState()===true) {
            hash["SEEN BY ATTENDING PHYSICIAN:"] = 1;
        } else {hash["SEEN BY ATTENDING PHYSICIAN:"] = 0;}

        if(self.LPSConservedId.getState()===true) {
            hash["LPS CONSERVED:"] = 1;
        } else {hash["LPS CONSERVED:"] = 0;}

        if(self.clientStatesThatId.getState()===true) {
            hash["Client states that:"] = 1;
        } else {hash["Client states that:"] = 0;}

        if(self.medicationRefillsId.getState()===true) {
            hash["Medication refills:"] = 1;
        } else {hash["Medication refills:"] = 0;}

        if(self.tobaccoScreenId.getState()===true) {
            hash["TOBACCO SCREEN:"] = 1;
        } else {hash["TOBACCO SCREEN:"] = 0;}

        var returnStr = "";
        for(var i in hash) {
            returnStr += i + hash[i] + ",";
        }
        return returnStr;
    }
    function createButton(buttonId, openHook, closeHook) {
        if(openHook==undefined) {openHook = function() {}};
        if(closeHook==undefined) {closeHook = function() {}};
        var state = false;
        $('#' + buttonId).click(function() {
            toggle();
        });
        function toggle(isCritical) {
            if(state) {closeHook(isCritical);$('#' + buttonId + ' img').attr('src', 'images/ButtonImages/oneRightArrow.png' );}
            else {openHook(isCritical);$('#' + buttonId + ' img').attr('src', 'images/ButtonImages/oneDownArrow.png' );}
            state = !state;
        }
        return  {
                    getState: function() {
                        return state;
                    },
                    toggleState: function(isCritical) {
                        if(isCritical==undefined) {isCritical=false;}
                        toggle(isCritical);
                    }
                }
    }
    function setButtonHookEvent(buttonId, divId, headerId, textId) {
        if(divId!=undefined) {
            $('#' + divId).hide();
        }
        var content = $('#' + textId).val();
        $('#' + textId).keyup(function() {
            if( ($('#' + textId).val()!=content) && ($('#' + textId).val()!='') ) {
                self.criticalHash[textId]=true;
            } else if($('#' + textId).val()=='') {
                self.criticalHash[textId]=false;
            }
        });
        return createButton(
                                buttonId,
                                function() {
                                    $('#' + divId).show();
                                    if(self.criticalHash[textId]==true && headerId!=undefined) {
                                        //$('#' + headerId).css({ 'color': 'green', 'font-size': '100%' });
                                    } else {}
                                    $('#' + headerId).css({'color': 'black', 'font-size': '100%'});
                                },
                                function() {
                                    $('#' + divId).hide();
                                    if(self.criticalHash[textId]==true && headerId!=undefined) {
                                        $('#' + headerId).css({'color': '#dc143c', 'font-size': '100%'});
                                    } else {
                                        $('#' + headerId).css({'color': 'black', 'font-size': '100%'});
                                    }
                                }
                            );
    }
    function setRadioHookEvent(buttonId, contanerDivId, textareaId, radioClass, group) {
        $('#' + contanerDivId).hide();
        $('#' + textareaId).val($("input[name='" + group + "']:checked").val());

        $("." + radioClass).click(function() {
            $('#' + textareaId).val($("input[name='" + group + "']:checked").val());
        });
        return setButtonHookEvent(buttonId,contanerDivId);
    }
    function setButtonToggleEvent(buttonId, firstString, secondString) {
        $('#' + buttonId).click(function() {
            var value = $('#' + buttonId).val();
            if(value==firstString) {$('#' + buttonId).val(secondString);}
            else {$('#' + buttonId).val(firstString);}
        });
    }
    function getDate(str) {
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
    function showAllTextAreas() {
        if(self.substanceUseId.getState()===false) {self.substanceUseId.toggleState();}
        if(self.suicidalId.getState()===false) {self.suicidalId.toggleState();}
        if(self.medicationManagmentId.getState()===false) {self.medicationManagmentId.toggleState();}
        if(self.activeProblemListId.getState()===false) {self.activeProblemListId.toggleState();}
        if(self.sideEffectsId.getState()===false) {self.sideEffectsId.toggleState();}
        if(self.labsId.getState()===false) {self.labsId.toggleState();}
        if(self.weightId.getState()===false) {self.weightId.toggleState();}
        if(self.mentalStatusExamId.getState()===false) {self.mentalStatusExamId.toggleState();}
        if(self.impressionId.getState()===false) {self.impressionId.toggleState();}
        if(self.seenByAttendingPhysicianId.getState()===false) {self.seenByAttendingPhysicianId.toggleState();}
        if(self.LPSConservedId.getState()===false) {self.LPSConservedId.toggleState();}
        if(self.clientStatesThatId.getState()===false) {self.clientStatesThatId.toggleState();}
        if(self.tobaccoScreenId.getState()===false) {self.tobaccoScreenId.toggleState();}
    }
    function hideAllTextAreas() {
        if(self.substanceUseId.getState()===true) {self.substanceUseId.toggleState();}
        if(self.suicidalId.getState()===true) {self.suicidalId.toggleState();}
        if(self.medicationManagmentId.getState()===true) {self.medicationManagmentId.toggleState();}
        if(self.activeProblemListId.getState()===true) {self.activeProblemListId.toggleState();}
        if(self.sideEffectsId.getState()===true) {self.sideEffectsId.toggleState();}
        if(self.labsId.getState()===true) {self.labsId.toggleState();}
        if(self.weightId.getState()===true) {self.weightId.toggleState();}
        if(self.mentalStatusExamId.getState()===true) {self.mentalStatusExamId.toggleState();}
        if(self.impressionId.getState()===true) {self.impressionId.toggleState();}
        if(self.seenByAttendingPhysicianId.getState()===true) {self.seenByAttendingPhysicianId.toggleState();}
        if(self.LPSConservedId.getState()===true) {self.LPSConservedId.toggleState();}
        if(self.clientStatesThatId.getState()===true) {self.clientStatesThatId.toggleState();}
        if(self.tobaccoScreenId.getState()===true) {self.tobaccoScreenId.toggleState();}
    }
    function updateParent() {
        var thisHeight = $('body').height() + 30;
        if(typeof parent.updateNoteAccordionHeight == 'function') {
            parent.updateNoteAccordionHeight(thisHeight);
        }
    }
    function logNoteInteraction(event,eventId) {
        $.ajax({
            type:   "post",
            url:    "updateLogEvent.jsp",
            data:   'event=' + event + '&eventId=' + eventId,
            async: false,
            success: function(msg) {
                msg = msg.replace(/^\s+|\s+$/g, '') ;
            }
        });
    };
    function checkList(list) {
        for(var id in list) {
            var notTrue = !list[id];
            if(notTrue) {
                return false;
            }
        }
        return true;
    }
};