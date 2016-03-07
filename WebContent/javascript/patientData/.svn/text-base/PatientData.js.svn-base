var PatientData = function() {
    var self = this;

    (function() {
        self.therapyMode            = new TherapyMode(),
        self.symFunScale            = new SymptomFunctioningScale(),
        self.goalTrackingMeasures   = new GoalTrackingMeasures(),
        self.customGoals            = null,
        self.sideEffects            = new SideEffects(),
        self.therapyMode            = new TherapyMode(),
        self.encounter              = null,
        self.isValid                = false;
    })(jQuery);

    self.getMeasuresDisplay = function() {
        return self.symFunScale.print() + self.goalTrackingMeasures.print() + self.customGoalsPrint();
    }
    self.customGoalsPrint = function() {
        var displayText = '';
        if(self.customGoals!=null) {
            for(var i in self.customGoals) {
                var custom = self.customGoals[i];
                if(custom.isChecked) {
                    if(custom.scaleId==1) {
                        displayText += '    ' + custom.name + ': ' + custom.value + ' per ' + custom.freqUnit + '\n';
                    } else {
                        displayText += '    ' + custom.name + ': ' + custom.value + ' \n';
                    }
                }
            }
        }
        if(displayText!='') {
            displayText = '\nCustom Goals:\n' + displayText;
        }
        return displayText;
    }
    self.getCustomGoalsHash = function() {
        var hash = '';
        if(self.customGoals!=null) {
            for(var i in self.customGoals) {
                var custom = self.customGoals[i],
                    freq = '';
                if(custom.freqUnit!=null) {
                    freq = ' ' + custom.freqUnit;
                }
                if(custom.isChecked) {
                    hash += '[' + custom.name + '(' + custom.id + ')=' + custom.value + freq + ']';
                }
            }
        }
        if(hash!='') {
            hash = '[Custom Goals=' + hash + ']';
        }
        return hash;
    }
    self.getCustomGoalsClone = function(){
        var temparr = [];
        for(var i in self.customGoals){
            var clone = self.customGoals[i].clone();
            temparr.push(clone);
        }
        return temparr;
    }
    self.setEncounter = function(encounter) {
        if(!isEmpty(encounter)) {
            self.encounter = "[Encounter=" + encounter + "]";
            self.isValid = true;
        }
        else {
            self.encounter = null;
            self.isValid = false;
        }
    }
    self.getHash = function() {
        var hash = '';
        if(self.encounter!=null) {
            hash += self.therapyMode.getHash();
            hash += self.symFunScale.getHash();
            hash += self.getCustomGoalsHash();
            hash += self.goalTrackingMeasures.getHash();
            hash += self.sideEffects.getHash();
            hash += self.encounter;
        }
        return hash;
    }

    return self;

    function isEmpty(string) {
        if(string=="") { return true; }
        return false;
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

