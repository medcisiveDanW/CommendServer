var GoalTrackingMeasures = function() {
    var self = this;

    (function() {
        self.hash = new Object();
        self.hash['activity']   = { checked: false, value: null},
        self.hash['recreation'] = { checked: false, value: null},
        self.hash['socializing']= { checked: false, value: null},
        self.hash['practicing'] = { checked: false, value: null},
        self.hash['sleep']      = { checked: false, value: null},
        self.hash['nutrition']  = { checked: false, value: null},
        self.hash['exercise']   = { checked: false, value: null},
        self.hash['depression'] = { checked: false, value: null},
        self.hash['anxiety']    = { checked: false, value: null},
        self.hash['insomnia']   = { checked: false, value: null},
        self.hash['anger']      = { checked: false, value: null},
        self.hash['fatigue']    = { checked: false, value: null};
                
        //
        // For each goal, the outcomeMap allows mapping from the 
        // name or key in javascript space to the name of the goal
        // as found in the saved progress note or database table 
        // CommendOutcomeDefn. 
        //
        self.outcomeMap = new Object();
        self.outcomeMap['activity']   = 'Activity Level';
        self.outcomeMap['recreation'] = 'Recreation'; 
        self.outcomeMap['socializing']= 'Socializing';
        self.outcomeMap['practicing'] = 'Practicing Skills';
        self.outcomeMap['sleep']      = 'Sleep Hygiene'; 
        self.outcomeMap['nutrition']  = 'Nutrition';
        self.outcomeMap['exercise']   = 'Exercise';
        self.outcomeMap['depression'] = 'Depression';
        self.outcomeMap['anxiety']    = 'Anxiety';
        self.outcomeMap['insomnia']   = 'Insomnia';
        self.outcomeMap['anger']      = 'Anger/Irritability';
        self.outcomeMap['fatigue']    = 'Fatigue';

    })(jQuery);

    self.getClone = function() {
        var clone = new GoalTrackingMeasures();
        for(var i in self.hash) {
            var h = self.hash[i];
            var c = clone.hash[i];
            c.checked = h.checked;
            c.value   = h.value;
        }
        return clone;
    }
    self.print = function() {
        var displayText = "";
        for(var key in self.hash) {
            if (self.hash[key].value != null) {
                var temp = "    " + key + ": ";
                displayText += temp + self.hash[key].value + " day(s)/week\n";
            }
        }
        if(displayText!="") {
            displayText = "\nGoal Tracking Measures:\n" + displayText;
        }
        return displayText;
    }
    self.getHash = function() {
        var hashTree = '';
        for(var key in self.hash) {
            if (self.hash[key].value != null) {
                hashTree += '[' + self.outcomeMap[key] + '=' + self.hash[key].value + ' day(s)/week]';
            }
        }
        if(hashTree!='') {
            hashTree = '[Goal Tracking Measures=' + hashTree + ']';
        }
        return hashTree;
    }

    return self;
};