var CustomGoal = function(id, name, question, scaleId, goal, symp, value, isRangeHigher, freqUnit, isChecked) {
    var self = this;

    (function() {
        self.id         = id,
        self.name       = name,
        self.question   = question,
        self.scaleId    = scaleId,
        self.goal       = goal,
        self.symp       = symp,
        self.value      = value,
        self.isRangeHigher = isRangeHigher,
        self.freqUnit   = freqUnit,
        self.isChecked  = isChecked,
        self.min        = -1,
        self.max        = -1,
        self.isBrowserIE = false,
        self.likertHash = new Array();
        self.likertHash[1] = 'Not at all';
        self.likertHash[2] = 'A little';
        self.likertHash[3] = 'Moderately';
        self.likertHash[4] = 'Very';
        self.likertHash[5] = 'Extremely';
        if ( $.browser.msie ) {
            self.isBrowserIE = true;
        }
        setupMinMax();
    })(jQuery);

    self.clone = function() {
        return new CustomGoal(self.id,self.name,self.question,self.scaleId,self.goal,self.symp,self.value,self.isRangeHigher,self.freqUnit,self.isChecked);
    }

    self.ajaxHash = function() {
        if (self.goal != parseInt(self.goal)) { // making sure goal is a number (int) in this case
            self.goal = 0;
        }
        var returnStr = '';
        if(self.id!=null) { returnStr += 'id=' + self.id + '&'; }
        if(self.name!=null) { returnStr += 'name=' + self.name + '&'; }
        if(self.question!=null) { returnStr += 'question=' + self.question + '&'; }
        if(self.scaleId!=null) { returnStr += 'scaleId=' + self.scaleId + '&'; }
        if(self.goal!=null) { returnStr += 'goal=' + self.goal + '&'; }
        if(self.symp!=null) { returnStr += 'symp=' + self.symp + '&'; }
        if(self.value!=null) { returnStr += 'value=' + self.value + '&'; }
        if(self.isRangeHigher!=null) { returnStr += 'isRangeHigher=' + self.isRangeHigher + '&'; }
        if(self.freqUnit!=null) { returnStr += 'freqUnit=' + self.freqUnit + '&'; }
        if(self.isChecked!=null) { returnStr += 'isChecked=' + self.isChecked + '&'; }
        if(returnStr.length>1) { returnStr.substring(0, returnStr.length - 1); }
        return returnStr;
    }
    self.saveMe = function() {
        var result = true,
            tempVal = null;
        if(self.scaleId==2) {
            tempVal = $('input:radio[name=selectedRadio' + self.id + ']:checked').val();
        } else {
            tempVal = $('#selectedGoalsText' + self.id).val();
        }
        tempVal = parseInt(tempVal);
        if( (tempVal!=undefined) && (tempVal!='')) {
            self.value = tempVal;
        }
        if(self.isChecked) {
            if(self.scaleId==1) {
                if( self.value!=null && !isNaN(self.value) ) {
                } else {
                    alert(self.name + ' dose not have a valid value (' + $('#selectedGoalsText' + self.id).val() + ').\nPlease enter a number.');
                    result = false;
                }
            }
            else if(self.scaleId==2) {
                if( self.value!=null && !isNaN(self.value) ) {
                } else {
                    alert(self.name + ' dose not have a valid value (' + self.value + ').\nPlease select one of the available radio buttons.');
                    result = false;
                }
            }
            else if(self.scaleId==4) {
                if( (self.value >= self.min && self.value <= self.max) || (self.value <= self.min && self.value >= self.max) ) {
                } else {
                    alert('You entered a value of ' + self.value + ' for ' + self.name + '.\nEntered value must be within custom goal range of ' + self.min + ' and ' + self.max + '.');
                    result = false;
                }
            }
        }
        return result;
    }
    self.removeMe = function(anArrayImIn) {
        if(anArrayImIn==null || anArrayImIn==undefined) { return; }
        $('#availableGoal' + self.id).remove();
        $('#selectedGoals' + self.id).remove();
        var myPos = 0;
        for(var i in anArrayImIn) {
            if(anArrayImIn[i].name==self.name) {
                break;
            }
            myPos++;
        }
        anArrayImIn.splice(myPos,1);
    }
    self.getAvailableGoalHtml = function() {
        var checked,
            browserPadding = '';
        if(self.isChecked) {
            checked = 'checked'
        }
        if(self.isBrowserIE) {
            browserPadding = '<div class="innerBlockRight" style="width: 18px;"></div>';
        }
        var html =  '<div id="availableGoal' + self.id + '" class="outterBlock availableGoals">' +
                    '    <div id="availableGoalName' + self.id + '" class="innerBlockLeft">' +
                            self.name +
                    '    </div>' +
                    browserPadding +
                    '    <div class="innerBlockRight">' +
                    '        <input type="radio" name="availableGoalsRadio" id="availableGoalsRadio' + self.id + '">' +
                    '    </div>' +
                    '    <div class="innerBlockRight endent">' +
                    '        <input type="checkbox" name="availableGoalsCheckbox" id="availableGoalsCheckbox' + self.id + '" ' + checked + '>' +
                    '    </div>' +
                    '</div>';
        return html;
    };
    self.insertGoalIntoTable = function(tableId) {
        if(tableId==null || tableId==undefined) { return; }
        var html = '<div id="selectedGoalTable' + self.id + 'Id"></div>';
        if(self.scaleId==1) {
             html +=
                '<input id="selectedGoalsText' + self.id + '" type="textbox" size="3" value="">per '+ self.freqUnit;
        } else if(self.scaleId==2) {
/*html =
    '<div id="selectedRadio' + self.id + 'DivId" style="position: relative; font-size: .6em !important;">'
        + '<input id="selectedRadio' + self.id + '_1Id" type="radio" name="selectedRadio' + self.id + '" value="1"/><label for="selectedRadio' + self.id + '_1Id">Not at all</label>'
        + '<input id="selectedRadio' + self.id + '_2Id" type="radio" name="selectedRadio' + self.id + '" value="2"/><label for="selectedRadio' + self.id + '_2Id">A little</label>'
        + '<input id="selectedRadio' + self.id + '_3Id" type="radio" name="selectedRadio' + self.id + '" value="3"/><label for="selectedRadio' + self.id + '_3Id">Moderately</label>'
        + '<input id="selectedRadio' + self.id + '_4Id" type="radio" name="selectedRadio' + self.id + '" value="4"/><label for="selectedRadio' + self.id + '_4Id">Very</label>'
        + '<input id="selectedRadio' + self.id + '_5Id" type="radio" name="selectedRadio' + self.id + '" value="5"/><label for="selectedRadio' + self.id + '_5Id">Extremely</label>'
    + '</div>';*/
            var checked1 = '',
                checked2 = '',
                checked3 = '',
                checked4 = '',
                checked5 = '';
            if(self.value==1) { checked1 = 'checked="checked"'; }
            else if(self.value==2) { checked2 = 'checked="checked"'; }
            else if(self.value==3) { checked3 = 'checked="checked"'; }
            else if(self.value==4) { checked4 = 'checked="checked"'; }
            else if(self.value==5) { checked5 = 'checked="checked"'; }
            html +=
                '<table>'
                    + '<tr>'

                        + '<td style="width: 40px;"><input id="selectedRadio' + self.id + '_1Id" type="radio" name="selectedRadio' + self.id + '" value="1" ' + checked1 + '/>1</td>'
                        + '<td style="width: 40px;"><input id="selectedRadio' + self.id + '_2Id" type="radio" name="selectedRadio' + self.id + '" value="2" ' + checked2 + '/>2</td>'
                        + '<td style="width: 40px;"><input id="selectedRadio' + self.id + '_3Id" type="radio" name="selectedRadio' + self.id + '" value="3" ' + checked3 + '/>3</td>'
                        + '<td style="width: 40px;"><input id="selectedRadio' + self.id + '_4Id" type="radio" name="selectedRadio' + self.id + '" value="4" ' + checked4 + '/>4</td>'
                        + '<td style="width: 40px;"><input id="selectedRadio' + self.id + '_5Id" type="radio" name="selectedRadio' + self.id + '" value="5" ' + checked5 + '/>5</td>'
                    + '</tr>'
                + '</table>';

        } else if(self.scaleId==4) {
            setupMinMax();
            html +=
                '<input id="selectedGoalsText' + self.id + '" type="textbox" size="3" value="">(min:' + self.min + '/max:' + self.max + ')';
        }
        $('#' + tableId).dataTable().fnAddData([
                self.question,html
        ]);
        if(self.scaleId==2) {
            //$('#selectedRadio' + self.id + 'DivId').buttonset();
            /* Dosent work in IE
            if(self.value!=null) {
                $('#selectedRadio' + self.id + '_' + self.value + 'Id').attr('checked', 'checked');
            }
             */
        }
        else {
            if(self.value!=null && !isNaN(self.value) ) { $('#selectedGoalsText' + self.id).val(self.value); }
            $('#selectedGoalsText' + self.id).click(function() {
                $('#selectedGoalsText' + self.id).ForceNumericOnly();
            });
        }
    }

    self.getMyPrintString = function() {
        return self.id + self.name + self.question + self.scaleId + self.goal + self.value + self.isRangeHigher + self.freqUnit + self.isChecked;
    }

    return self;

    function setupMinMax() {
        if(self.goal>self.symp) {
            self.max = goal;
            self.min = symp;
        } else if(self.goal<self.symp) {
            self.max = symp;
            self.min = goal;
        } else {
            self.max = -1;
            self.min = -1;
        }
    }
}

