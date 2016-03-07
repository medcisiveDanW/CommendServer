var SideEffects = function() {
    var self = this;

    (function() {
        self.sideEffectsInOrder = null,
        self.numbOfDays         = null;

        self.hash = new Object();
        self.hash['none']                   = { checked: false, primary: false, value: null, dialog: 'none' },
        self.hash['diarrhea']               = { checked: false, primary: false, value: null, dialog: 'diarrhea' },
        self.hash['dryMouth']               = { checked: false, primary: false, value: null, dialog: 'dry mouth' },
        self.hash['nauseaVomiting']         = { checked: false, primary: false, value: null, dialog: 'nausea/vomiting' },
        self.hash['palpitation']            = { checked: false, primary: false, value: null, dialog: 'palpitations' },
        self.hash['dizzinessOnStanding']    = { checked: false, primary: false, value: null, dialog: 'dizziness on standing' },
        self.hash['chestPain']              = { checked: false, primary: false, value: null, dialog: 'chest pain' },
        self.hash['heartOther']             = { checked: false, primary: false, value: null, dialog: 'heart-other' },
        self.hash['rash']                   = { checked: false, primary: false, value: null, dialog: 'rash'},
        self.hash['increasedPerspiration']  = { checked: false, primary: false, value: null, dialog: 'increased perspiration' },
        self.hash['drySkin']                = { checked: false, primary: false, value: null, dialog: 'dry skin' },
        self.hash['skinOther']              = { checked: false, primary: false, value: null, dialog: 'skin-other' },
        self.hash['headache']               = { checked: false, primary: false, value: null, dialog: 'headache' },
        self.hash['tremors']                = { checked: false, primary: false, value: null, dialog: 'tremors' },
        self.hash['poorCoordination']       = { checked: false, primary: false, value: null, dialog: 'poor coordination' },
        self.hash['dizziness']              = { checked: false, primary: false, value: null, dialog: 'dizziness' },
        self.hash['anxiety']                = { checked: false, primary: false, value: null, dialog: 'anxiety' },
        self.hash['poorConcentration']      = { checked: false, primary: false, value: null, dialog: 'poor concentration' },
        self.hash['generalMalaise']         = { checked: false, primary: false, value: null, dialog: 'general malaise' },
        self.hash['restlessness']           = { checked: false, primary: false, value: null, dialog: 'restlessness' },
        self.hash['extrapyramidalSymptoms'] = { checked: false, primary: false, value: null, dialog: 'extrapyramidal symptoms' },
        self.hash['fatigue']                = { checked: false, primary: false, value: null, dialog: 'fatigue' },
        self.hash['decreasedEnergy']        = { checked: false, primary: false, value: null, dialog: 'decreased energy' },
        self.hash['nervousSystemOther']     = { checked: false, primary: false, value: null, dialog: 'nervous system-other' },
        self.hash['difficultySleeping']     = { checked: false, primary: false, value: null, dialog: 'difficulty sleeping' },
        self.hash['sleepingTooMuch']        = { checked: false, primary: false, value: null, dialog: 'sleeping too much' },
        self.hash['sleepingOther']          = { checked: false, primary: false, value: null, dialog: 'sleeping-other' },
        self.hash['lossOfSexualDesire']     = { checked: false, primary: false, value: null, dialog: 'loss of sexual desire' },
        self.hash['troubleAchievingOrgasm'] = { checked: false, primary: false, value: null, dialog: 'trouble achieving orgasm' },
        self.hash['sexualFunctioningOther'] = { checked: false, primary: false, value: null, dialog: 'sexual functioning-other' },
        self.hash['majorAdverseEvent']      = { checked: false, primary: false, value: null, dialog: 'major adverse event' },
        self.hash['labAbnormality']         = { checked: false, primary: false, value: null, dialog: 'lab abnormality' },
        self.hash['weight']                 = { checked: false, primary: false, value: null, dialog: 'weight' };
    })(jQuery);

    self.getClone = function() {
        var clone = new SideEffects();
        clone.sideEffectsInOrder = self.sideEffectsInOrder,
        clone.numbOfDays = self.numbOfDays;
        for(var i in self.hash) {
            clone.hash[i].checked = self.hash[i].checked;
            clone.hash[i].primary = self.hash[i].primary;
            clone.hash[i].value = self.hash[i].value;
            clone.hash[i].dialog = self.hash[i].dialog;
        }
        return clone;
    }
    self.print = function() {
        var displayText = '',
            primaryKey = null,
            key = null;
        self.sideEffectsInOrder = '';
        for(key in self.hash) {
            if(self.hash[key].primary==true) {
                primaryKey = key;
            }
        }
        if(primaryKey!=null) {
            self.sideEffectsInOrder += self.hash[primaryKey].value;
            for(key in self.hash) {
                if( (primaryKey!=key) && (self.hash[key].value!=null) ) {
                    self.sideEffectsInOrder += ', ' + self.hash[key].value;
                }
            }
        }
        if( (self.sideEffectsInOrder!='') && (self.numbOfDays!=null) ){
            displayText += 'Side Effects (in order of Severity):\n';
            displayText += '    ' + self.sideEffectsInOrder + '\n';
            displayText += 'Frequency: ' + self.numbOfDays + ' day(s)/week\n';
        }
        return displayText;
    }

    self.getHash = function() {
        var hashTree = '',
            primaryKey = null,
            key = null
            self.sideEffectsInOrder = '';
        for(key in self.hash) {
            if(self.hash[key].primary==true) {
                primaryKey = key;
            }
        }
        if(primaryKey!=null) {
            self.sideEffectsInOrder += self.hash[primaryKey].value;
            for(key in self.hash) {
                if( (primaryKey!=key) && (self.hash[key].value!=null) ) {
                    self.sideEffectsInOrder += ', ' + self.hash[key].value;
                }
            }
        }
        if( (self.sideEffectsInOrder!='') && (self.numbOfDays!=null) ){
            hashTree += '[Side Effects=';
            hashTree += '[Ordered By Severity=' + self.sideEffectsInOrder + ']';
            hashTree += '[Frequency=' + self.numbOfDays + ' day(s)/week]]';
        }
        return hashTree;
    }

    return self;

    function isValid() {
        if(!isEmpty(self.sideEffectsInOrder) || !isEmpty(self.nofDays)) {return true;}
        return false;
    }
    function isEmpty(string) {
        if(string=="") {return true;}
        return false;
    }
    function removePX(str) {
        str = str.split('p');
        return parseInt(str[0]);
    }
    function dumpProps(obj, parent) {
       for (var i in obj) {
          if (parent) {var msg = parent + "." + i + "\n" + obj[i];} else {var msg = i + "\n" + obj[i];}
          if (!confirm(msg)) {return;}
          if (typeof obj[i] == "object") {
             if (parent) {dumpProps(obj[i], parent + "." + i);} else {dumpProps(obj[i], i);}
          }
       }
    }
    function sizeOf(array) {
        var index = 0;
        for(var i in array)
        {index++;}
        return index;
    }
};