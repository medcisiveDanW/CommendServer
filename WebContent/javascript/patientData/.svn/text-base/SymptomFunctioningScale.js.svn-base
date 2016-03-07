var SymptomFunctioningScale = function() {
    var self = this;

    (function() {
        self.PHQ = null,
        self.PCL = null,
        self.BAM = null,
        self.BPRS = null,
        self.BDI2 = null;
        self.AUDC = null;
    })(jQuery);

    self.getClone = function() {
        var clone = new SymptomFunctioningScale();
        clone.PHQ = self.PHQ,
        clone.PCL = self.PCL,
        clone.BAM = self.BAM,
        clone.BPRS = self.BPRS,
        clone.BDI2 = self.BDI2;
        clone.AUDC = self.AUDC;
        return clone;
    }
    self.print = function() {
        var displayText = '';
        if( (self.PHQ!=null) || (self.PCL!=null) || (self.BAM!=null) || (self.BPRS!=null) || (self.BDI2!=null) || (self.AUDC!=null)) {
            displayText += 'Symptom/Functioning Scale:\n';
            if( (self.PHQ!=null) && (self.PHQ!='') && (self.PHQ!=0) ) {
                displayText += '    PHQ-9: ' + self.PHQ + '\n';
            }
            if( (self.PCL!=null) && (self.PCL!='') && (self.PCL!=0) ) {
                displayText += '    PCL-C: ' + self.PCL + '\n';
            }
            if( (self.BAM!=null) && (self.BAM!='') && (self.BAM!=0) ) {
                displayText += '    BAM:   ' + self.BAM + '\n';
            }
            if( (self.BPRS!=null) && (self.BPRS!='') && (self.BPRS!=0) ) {
                displayText += '    BPRS:  ' + self.BPRS + '\n';
            }
            if( (self.BDI2!=null) && (self.BDI2!='') && (self.BDI2!=0) ) {
                displayText += '    BDI-2:  ' + self.BDI2 + '\n';
            }
            if( (self.AUDC!=null) && (self.AUDC!='') ) {
                displayText += '    AUDC:  ' + self.AUDC + '\n';
            }
        }
        return displayText;
    }
    self.getHash = function() {
        var hash = '';
        if( (self.PHQ!=null) || (self.PCL!=null) || (self.BAM!=null) ||
            (self.BPRS!=null) || (self.BDI2!=null) || (self.AUDC != null)) {
            hash += '[Symptom/Functioning Scale=';
            if(self.PHQ!=null) {
                hash += '[PHQ-9=' + self.PHQ + ']';
            }
            if(self.PCL!=null) {
                hash += '[PCL-C=' + self.PCL + ']';
            }
            if(self.BAM!=null) {
                hash += '[BAM=' + self.BAM + ']';
            }
            if(self.BPRS!=null) {
                hash += '[BPRS=' + self.BPRS + ']';
            }
            if(self.BDI2!=null) {
                hash += '[BDI2=' + self.BDI2 + ']';
            }
            if(self.AUDC!=null) {
                hash += '[AUDC=' + self.AUDC + ']';
            }
            hash += ']';
        }
        return hash;
    }

    return self;
};