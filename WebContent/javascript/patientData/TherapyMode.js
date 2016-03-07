var TherapyMode = function() {
    var self = this;

    (function() {
        self.primaryMode      = null,
        self.secondaryMode    = null,
        self.duration         = null,
        self.serviceModality  = null,
        self.contactType      = null;
    })(jQuery);

    self.getClone = function() {
        var clone = new TherapyMode();
        clone.primaryMode = self.primaryMode;
        clone.secondaryMode = self.secondaryMode;
        clone.duration = self.duration;
        clone.serviceModality = self.serviceModality;
        clone.contactType = self.contactType;
        return clone;
    }

    self.print = function() {
        var displayText = "";
        if (self.primaryMode != null) {
            displayText += displayText += "PRIMARY MODE: " + self.primaryMode;
        }
        if (self.secondaryMode != null) {
            displayText += "\nSECONDARY MODE: " + self.secondaryMode;
        }
        if (self.duration  != null) {
            displayText += "\nDuration: " + self.duration;
        }
        if(self.serviceModality !=null) {
            displayText += "\nServiceModality: " + self.serviceModality;
        }
        if(self.contactType !=null) {
            displayText += "\nContact Type: " + self.contactType;
        }
        return displayText;
    }

    self.getHash = function() {
        var hash = '';
        if( (self.primaryMode!=null) || (self.secondaryMode) || (self.duration) || (self.serviceModality) || (self.contactType) ) {
            hash += '[Therapy Mode=';
            if(self.primaryMode!=null) {
                hash += '[PRIMARY MODE=' + self.primaryMode + ']';
            }
            if(self.secondaryMode!=null) {
                hash += '[SECONDARY MODE=' + self.secondaryMode + ']';
            }
            if(self.duration!=null) {
                hash += '[Duration=' + self.duration + ']';
            }
            if(self.serviceModality!=null) {
                hash += '[Service Modality=' + self.serviceModality + ']';
            }
            if(self.contactType!=null) {
                hash += '[Contact Type=' + self.contactType + ']';
            }
            hash += ']';
        }
        return hash;
    }
    
    self.getTherapys = function() {
        var returnStr = "";
        if(self.primaryMode!=null) {
            returnStr += self.primaryMode;
        }
        if(self.secondaryMode!=null) {
            if(returnStr!="") {
                returnStr += ", ";
            }
            returnStr += self.secondaryMode;
        }
        if(returnStr!="") {
            returnStr = "Therapy Mode: " + returnStr;
        }
        return returnStr;
    }

    return self;
};