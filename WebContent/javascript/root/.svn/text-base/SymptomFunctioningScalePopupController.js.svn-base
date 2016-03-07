var SymptomFunctioningScalePopupController = function(path, patientData, ajax) {
    var self = this;

    (function() {
        self.title = 'Symptom/Functioning',
        self.width = 360,
        self.height = 280,
        self.ajax = ajax,
        self.url = path + 'symptomFunctioningScalePopup.jsp',
        self.openButtonId = 'symptomFunctioiningScaleButtonId',
        self.isInitialized = false,
        self.temporarySymptomFunctioningScale = null,
        self.patientData = patientData;
        $('#txtArea_trtMonRight').val(self.patientData.getMeasuresDisplay());
        //self.utility = new Utility();
    })(jQuery);

    self.load = function() {
        self.ajax.logEvent('SymptomFunctioning(load)', 1014);
        loadSympFuncScalePopup();
        parent.$('body, html').trigger('scroll');
    }
    self.save = function() {
        self.ajax.logEvent('SymptomFunctioning(save)', 1014);
        var returnString = saveSympFuncScalePopup();
        if(returnString=='') {
            self.patientData.symFunScale = self.temporarySymptomFunctioningScale.getClone();
            $('#txtArea_trtMonRight').val(self.patientData.getMeasuresDisplay());
            $('#sympFuncScalePopupErrorDisplayId').html('');
            return true;
        }
        else {
            $('#sympFuncScalePopupErrorDisplayId').html(returnString);
        }
        return false;
    };

    return self;

    function loadSympFuncScalePopup() {
        $('#phqTextId').ForceNumericOnly();
        $('#pclTextId').ForceNumericOnly();
        $('#bamTextId').ForceNumericOnly();
        $('#bprsTextId').ForceNumericOnly();
        $('#bdi2TextId').ForceNumericOnly();
        $('#audcTextId').ForceNumericOnly();
        self.temporarySymptomFunctioningScale = self.patientData.symFunScale.getClone();
        if(self.temporarySymptomFunctioningScale.PHQ!=null) {
            $('#phqTextId').val(self.temporarySymptomFunctioningScale.PHQ);
        }
        else {
            $('#phqTextId').val('');
        }
        if(self.temporarySymptomFunctioningScale.PCL!=null) {
            $('#pclTextId').val(self.temporarySymptomFunctioningScale.PCL);
        }
        else {
            $('#pclTextId').val('');
        }
        if(self.temporarySymptomFunctioningScale.BAM!=null) {
            $('#bamTextId').val(self.temporarySymptomFunctioningScale.BAM);
        }
        else {
            $('#bamTextId').val('');
        }
        if(self.temporarySymptomFunctioningScale.BPRS!=null) {
            $('#bprsTextId').val(self.temporarySymptomFunctioningScale.BPRS);
        }
        else {
            $('#bprsTextId').val('');
        }
        if(self.temporarySymptomFunctioningScale.BDI2!=null) {
            $('#bdi2TextId').val(self.temporarySymptomFunctioningScale.BDI2);
        }
        else {
            $('#bdi2TextId').val('');
        }
        if(self.temporarySymptomFunctioningScale.AUDC!=null) {
            $('#audcTextId').val(self.temporarySymptomFunctioningScale.AUDC);
        }
        else {
            $('#audcTextId').val('');
        }
    }
    function saveSympFuncScalePopup() {
        var returnString = '';
        var phqString = $('#phqTextId').val();
        var pclString = $('#pclTextId').val();
        var bamString = $('#bamTextId').val();
        var bprsString = $('#bprsTextId').val();
        var bdi2String = $('#bdi2TextId').val();
        var audcString = $('#audcTextId').val();

        var phqInt = parseInt(phqString);
        var pclInt = parseInt(pclString);
        var bamInt = parseInt(bamString);
        var bprsInt = parseInt(bprsString);
        var bdi2Int = parseInt(bdi2String);
        var audcInt = parseInt(audcString);

        if( ((phqInt>=9) && (phqInt<=27)) || (phqString=='') ) { //phq 9 27
            if(phqString=='') {self.temporarySymptomFunctioningScale.PHQ = null;}
            else {
                self.temporarySymptomFunctioningScale.PHQ = phqInt;
                self.ajax.logEvent('SymptomFunctioning(PHQScore)',1014);
            }
        }
        else {
            returnString += "You entered " + phqInt + ". Required range for PHQ-9 is 9 to 27.<br>";
        }

        if( ((pclInt>=17) && (pclInt<=85)) || (pclString=='') ) { //pcl 17 85
            if(pclString=='')  {self.temporarySymptomFunctioningScale.PCL = null;}
            else {
                self.temporarySymptomFunctioningScale.PCL = pclInt;
                self.ajax.logEvent('SymptomFunctioning(PCLScore)',1014);
            }
        }
        else {
            returnString += "You entered " + pclInt + ". Required range for PCL-C is 17 to 85.<br>";
        }

        if( ((bamInt>=1) && (bamInt<=100)) || (bamString=='') ) { //bam 1 100
            if(bamString=='') {self.temporarySymptomFunctioningScale.BAM = null;}
            else {
               self.temporarySymptomFunctioningScale.BAM = bamInt;
               self.ajax.logEvent('SymptomFunctioning(BAMScore)',1014);
            }

        }
        else {
            returnString += "You entered " + bamInt + ". Required range for BAM is 1 to 100.<br>";
        }

        if( ((bprsInt>=18) && (bprsInt<=126)) || (bprsString=='') ) { //bprs 18 126
            if(bprsString=='') {self.temporarySymptomFunctioningScale.BPRS = null;}
            else {
                self.temporarySymptomFunctioningScale.BPRS = bprsInt;
                self.ajax.logEvent('SymptomFunctioning(BPRSScore)',1014);
            }
        }
        else {
            returnString += "You entered " + bprsInt + ". Required range for BPRS is 18 to 126.<br>";
        }

        if( ((bdi2Int>=0) && (bdi2Int<=63)) || (bdi2String=='') ) { //bdi2 0 63
            if(bdi2String=='') {self.temporarySymptomFunctioningScale.BDI2 = null;}
            else {
                self.temporarySymptomFunctioningScale.BDI2 = bdi2Int;
                self.ajax.logEvent('SymptomFunctioning(BDI2Score)',1014);
            }
        }
        else {
            returnString += "You entered " + bdi2Int + ". Required range for BDI-2 is 0 to 63.<br>";
        }

        if( ((audcInt>=0) && (audcInt<=12)) || (audcString=='') ) { //audc 0 12
            if(audcString=='') {self.temporarySymptomFunctioningScale.AUDC = null;}
            else {
                self.temporarySymptomFunctioningScale.AUDC = audcInt;
                self.ajax.logEvent('SymptomFunctioning(AUDCScore)',1014);
            }
        }
        else {
            returnString += "You entered " + audcInt + ". Required range for AUDC is 0 to 12.<br>";
        }

        return returnString;
    }
};