var CustomGoalTrackingMeasuresPopupManager = function(path, patientData, ajax) {
    var self = this;

    (function() {
        self.path                   = path,
        self.patientData            = patientData,
        self.ajax                   = ajax,
        self.customGoals            = [],
        self.isProcessing           = false,
        self.jSelectedGoals         = $('#selectedGoalList');
    })(jQuery);

    self.refresh = function() {
        setCustomGoals();
        clearCustomGoalCreation();
        var table =
                '<table id="selectedCustomGoalsTableId" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">'
                    + '<thead>'
                        + '<tr>'
                            + '<th>Question</th>'
                            + '<th>Answer</th>'
                        + '</tr>'
                    + '</thead>'
                    + '<tbody>'
                    + '</tbody>'
                + '</table>';
        $('#selectedGoalList').html('');
        $('#selectedGoalList').append(table);
        $('#selectedCustomGoalsTableId').dataTable({
            "bLengthChange": false
            ,"bJQueryUI": true
            ,"bFilter": false
            ,"bPaginate": false
            ,"sScrollY": "115px"
            ,"sPaginationType": "full_numbers"
        });
        var firstPass = true;
        table =
                '<table id="availableCustomGoalsTableId" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">'
                    + '<thead>'
                        + '<tr>'
                            + '<th>Goal</th>'
                            + '<th>Select</th>'
                            + '<th>Edit</th>'
                        + '</tr>'
                    + '</thead>'
                    + '<tbody>';
        $(self.customGoals).each(function() {
            var data = this;
            var checked = '';
            if(data.isChecked) {checked = 'checked="checked"';}
            table +=
                '<tr class="gradeC">'
                    + '<td>' + data.name + '</td>'
                    + '<td><input type="checkbox" name="availableGoalsCheckbox" id="availableGoalsCheckbox' + data.id + '" ' + checked + '></td>'
                    + '<td><input type="radio" name="availableGoalsRadio" id="availableGoalsRadio' + data.id + '"></td>'
                + '</tr>';
        });
        table +=
                '</tbody>'
            + '</table>';
        $('#availableCustomGoalDivId').html('');
        $('#availableCustomGoalDivId').append(table);
        $('#availableCustomGoalsTableId').dataTable({
            "bLengthChange": false
            ,"bJQueryUI": true
            ,"bFilter": false
            ,"bPaginate": false
            ,"sScrollY": "200px"
            ,"sPaginationType": "full_numbers"
        });
        $(self.customGoals).each(function() {
            var data = this;
            addAvailableGoalsSelectEventHandler(data);
            addAvailableGoalsEditEventHandler(data);
            if(data.isChecked) {data.insertGoalIntoTable('selectedCustomGoalsTableId');}
            if(firstPass) {
                firstPass = false;
                setupEditCustomGoal(data);
                $('#availableGoalsRadio' + data.id).click();
            }
        });
        $('#createButtonId').unbind('click');
        $('#createButtonId').preventAjaxDoubleClick(function() {
            $('#saveingOutcomeOverlayId').show();
            setTimeout(function() {
                if(createGoal()) {
                    self.ajax.logEvent('CustomGoals(Create)', 1016);
                }
                $('#saveingOutcomeOverlayId').hide();
            },500);
        });
    };
    
    self.saveCustomGoals = function() {
        for(var i in self.customGoals) {
            var custom = self.customGoals[i];
            if(!custom.saveMe()) {
                return false;
            }
        }
        self.patientData.customGoals = self.customGoals;
        return true;
    };

    return self;

    function setCustomGoals() {
        self.customGoals = self.patientData.getCustomGoalsClone();
    }
    function clearCustomGoalCreation() {
        $('#likertCreateRadioId').trigger('click');
        $('#nameCreateInputId').val('');
        $('#questionCreateInputId').val('On a scale of 1 to 5, in the last week, how (_______) have you been...... OR How many times (per day/per week)....');
        $('#goalCreateInputId').val('0');
    }
    function addAvailableGoalsSelectEventHandler(data) {
        $('#availableGoalsCheckbox' + data.id).click( function() {
            if($('#availableGoalsCheckbox' + data.id).attr('checked')) {
                data.isChecked = true;
                data.insertGoalIntoTable('selectedCustomGoalsTableId');
            }
            else {
                data.isChecked = false;
                data.value = null;
                var oTable = $('#selectedCustomGoalsTableId').dataTable();
                var nTr = $('#selectedGoalTable' + data.id + 'Id').closest('tr');
                var pos = oTable.fnGetPosition( nTr[0] );
                oTable.dataTable().fnDeleteRow(pos, null, true);
            }
        });
    }
    function addAvailableGoalsEditEventHandler(data) {
        $('#availableGoalsRadio' + data.id).click( function() {
            if($('#availableGoalsRadio' + data.id).attr('checked')) {
                setupEditCustomGoal(data);
            }
        });
    }
    function setupEditCustomGoal(data) {
        $('#creationEditTabId').tabs({selected: 1});
        //$('#editTabs').trigger('click');
        $('#nameEditInputId').val(data.name);
        $('#questionEditInputId').val(data.question);
        if(data.scaleId==1) {
            $('#freqEditRadioId').attr('checked', true);
            $('#freqEditRadioId').click();
            $('#freqEditRadioId').button("refresh");
        }
        else if(data.scaleId==2) {
            $('#likertEditRadioId').attr('checked', true);
            $('#likertEditRadioId').click();
            $('#likertEditRadioId').button("refresh");
        }
        else if(data.scaleId==4) {
            $('#rangeEditRadioId').attr('checked', true);
            $('#rangeEditRadioId').click();
            $('#rangeEditRadioId').button("refresh");
            $('#minRangeSelectInputEditId').val(data.min);
            $('#maxRangeSelectInputEditId').val(data.max);
        }
        if(data.freqUnit!='') {
            $('#unitRadio' + data.freqUnit + 'EditId').attr('checked', true);
            $('#unitRadio' + data.freqUnit + 'EditId').click();
            $('#unitRadio' + data.freqUnit + 'EditId').button("refresh");
        }
        $('#goalEditInputId').val(data.goal);
        if(data.isRangeHigher) {
            $('#symptomaticRangeHigherEditId').attr('checked', true);
            $('#symptomaticRangeHigherEditId').click();
            $('#symptomaticRangeHigherEditId').button("refresh");
        }
        else {
            $('#symptomaticRangeLowerEditId').attr('checked', true);
            $('#symptomaticRangeLowerEditId').click();
            $('#symptomaticRangeLowerEditId').button("refresh");
        }
        $('#updateButtonEditId').unbind('click');
        $('#updateButtonEditId').click(function() {
            $('#saveingOutcomeOverlayId').show();
            setTimeout(function() {
                if(updateGoal(data)) {
                    self.ajax.logEvent('CustomGoals(update)',1016);
                }
                $('#saveingOutcomeOverlayId').hide();
            },500);
        });
        $('#deleteButtonEditId').unbind('click');
        $('#deleteButtonEditId').click(function() {
            $('#saveingOutcomeOverlayId').show();
            setTimeout(function() {
                if(deleteGoal(data)) {
                    self.ajax.logEvent('CustomGoals(Delete)',1016);
                }
                $('#saveingOutcomeOverlayId').hide();
            },500);
        });
    }
    
    function createGoal() {
        var name = $('#nameCreateInputId').val(),
            question =  $('#questionCreateInputId').val(),
            scaleId = -1,
            freqUnit = null,
            goal = parseInt($('#goalCreateInputId').val()),
            max = parseInt($('#maxRangeCreateInputId').val()),
            min = parseInt($('#minRangeCreateInputId').val()),
            isRangeHigher = false,
            result = false,
            symp = 0;
        if(max<=0) {
            max=null;
        }
        if(name!="") {
            if($('#freqCreateRadioId').attr('checked')) {scaleId = 1;}
            else if($('#likertCreateRadioId').attr('checked')) {scaleId = 2;}
            else if($('#rangeCreateRadioId').attr('checked')) {scaleId = 4;}

            if(scaleId==1) {
                freqUnit = $('input:radio[name=unitsRadioCreate]:checked').val();
            }
            else if(scaleId==2) {
            }
            else if(scaleId==4) {
                if(goal==max) {
                    symp = min;
                } else if (goal==min) {
                    symp = max;
                } else {
                    alert('Goal must equal min or max.');
                    return false;
                }
                if(max<min) {
                    alert('Max must be greater than min.');
                    return false;
                }
            }
            if($('#symptomaticRangeHigherCreateId').attr('checked')) {isRangeHigher = true;}
            //id, name, question, scaleId, goal, max, value, isRangeHigher, freqUnit, status, isChecked
            var custom = new CustomGoal(-1, name, question, scaleId, goal, symp, null, isRangeHigher, freqUnit, false);
            $.ajax({
                type:   "post",
                url:    "CustomOutcomeServlet",
                data:   "option=create&" + custom.ajaxHash(),
                async: false,
                success: function(msg) {
                    custom.id = parseInt(msg);
                }
            });
            self.patientData.customGoals.push(custom);
            self.refresh();
            result = true;
        }
        if(result) {
        } else {
            //error
        }
        return result;
    }
    function updateGoal(custom) {
        if(custom==undefined) {return false;}
        custom.name = $('#nameEditInputId').val(),
        custom.question =  $('#questionEditInputId').val();
        var result = false;
        $.ajax({
                type:   "post",
                url:    "CustomOutcomeServlet",
                data:   "option=update&" + custom.ajaxHash(),
                async: false,
                success: function(msg) {
                    result = msg;
                }
            });
        if(result) {
            for(i in self.patientData.customGoals) {
                var goal = self.patientData.customGoals[i];
                if(goal.id==custom.id) {
                    self.patientData.customGoals[i] = custom;
                    break;
                }
            }
            self.refresh();
        } else {
            //error
        }
        return result;
    }
    function deleteGoal(custom) {
        if(custom==undefined) {return false;}
        var result = false;
        $.ajax({
            type:   "post",
            url:    "CustomOutcomeServlet",
            data:   "option=delete&" + custom.ajaxHash(),
            async: false,
            success: function(msg) {
                result = msg;
            }
        });
        if(result) {
            for(i in self.patientData.customGoals) {
                var goal = self.patientData.customGoals[i];
                if(goal.id==custom.id) {
                    delete self.patientData.customGoals[i];
                }
            }
            self.refresh();
        } else {
            //error
        }
        return result;
    }
    function getObject(array, id) {
        for(var i in array) {
            var temp = array[i];
            if(temp.id === id) {
                return temp;
            }
        }
        return null;
    }
    function removePX(str) {
        str = str.split('p');
        return parseInt(str[0]);
    }
    function sizeOf(array) {
        var index = 0;
        for(var i in array)
        {index++;}
        return index;
    }
};
