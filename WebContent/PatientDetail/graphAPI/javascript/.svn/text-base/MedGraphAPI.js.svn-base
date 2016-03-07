var MedGraphAPI = function(canvasElement, data, dateSpan, ajax) {
    var self = this;

    (function() {
        self.mouseX = 0;
        self.mouseY = 0;
        self.mousePressed = false;
        self.isTesting = false;
        self.ajax = ajax;
        self.monthMilliseconds = 2592000000;
        self.oneDay = 1 * 24 * 60 * 60 * 1000;
        self.oneMonth = self.oneDay*30;
        self.canvasElementName = '#' + canvasElement;
        self.eGraphDiv = document.getElementById(canvasElement);
        self.jGraphDiv = $(self.eGraphDiv);
        self.plot = null;
        self.ctx = null;
        self.gfx = null;
        self.med = null;
        self.choiceList = [];
        self.dataset = data;
        self.displayData = [];
        self.maxCheckedboxes = 4;
        self.checkedCounter = 0;
        self.currentSelectedData = null;
        self.synchronizedGraphAPI = null;
        self.nullData = { "No Medications": { label: "No Medications", yaxis:1, data:[[1292449260000,1265819580000]] },
                          "No Therapys": { label: "No Therapys", yaxis:2, data:[[1292449260000,1265819580000]] }};
        self.options = {
                            xaxis: {
                                    mode: "time",
                                    timeformat: "%b %y",
                                    monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                                    minTickSize: [1, "month"],
                                    min: dateSpan.start,
                                    max: dateSpan.end
                                    },
                            yaxes: [{ position: "left" , color: "#f33", tickColor: "#bbb", min: 0, max: 100, ticks: [[-10, "90"]], labelWidth: 10 },
                                    { position: "right", color: "#33f", tickColor: "#bbb", min: 0, max: 100, ticks: [[-10, "90"]], labelWidth: 10 } ],
                            legend: {
                                    position: "sw",
                                    backgroundOpacity: .8,
                                    show: true
                                    },
                            grid: {show: true, backgroundColor: {colors: ["#aaa", "#888"]}, borderColor: "#77f", clickable: true, hoverable: true}
                        };
        setupSelection(data);
        self.displayData = getSelectedData();
        plotFunc();
    })(jQuery);

    self.draw = function() { plotFunc(); }
    self.medDraw = function() { medDraw(); }

    return self;

    function plotFunc() {
        if(self.displayData==null) {
            self.displayData = [];
            self.displayData.push(self.nullData["No Medications"]);
            self.displayData.push(self.nullData["No Therapys"]);
            self.options.yaxes[0].min = 0;
            self.options.yaxes[0].max = 8;
            self.options.yaxes[1].min = 0;
            self.options.yaxes[1].max = 8;
        }
        self.plot = $.plot(self.jGraphDiv, self.displayData, self.options);
        self.med = null;
        self.med = new MedUtil(self);
        self.med.draw();
    }
    function medDraw() {
        self.med.draw();
    }
    function getSelectedData() {
        var data = [];
        for(var i in self.choiceList) {
            var choice = document.getElementById(self.choiceList[i]);
            var jChoice = $(choice);
            var found = jChoice.find(':checked');
            found.each( function() {
                data.push($(this).data($(this).attr('id')));
            });
        }
        if(data[0]==undefined) {
            return null;
        }
        return data;
    }
    function setupSelection(data)
    {
        if(data==null) { return; }
        for(var i in data)
        {
            var choiceName = i,
                hash = data[choiceName].data,
                util = new GeneralUtil('strLenghtDiv');
            self.choiceList.push(choiceName);
            if(hash==null) { return; }
            var choice = document.getElementById(choiceName);
            var jChoice = $(choice);
            $.each(hash, function(key, val) {
                var name = '';
                if(val!=undefined & val.label!=undefined) {
                    name = val.label;
                    name = name.replace(" ","");
                    name = name.replace("(","");
                    name = name.replace(")","");
                }
                var id = 'id' + choiceName + name;
                id = removeSpecial(id);
                jChoice.append('<input type="checkbox" name="' + val.label + '" id="' + id + '">' +
                                   '<label for="' + id + '">' + val.label + '</label><br>');
                $('#' + id).data(id, val);
                $('#' + id).click(function() {
                    self.ajax.logGraphEvent('MedicationOrTherapyMode (' + val.label + ')',1012);
                    if($('#'+id).is(':checked')) {
                        self.checkedCounter++;
                        if(self.checkedCounter>=self.maxCheckedboxes) {
                            disableCheckboxs(true);
                        }
                    }
                    else {
                        self.checkedCounter--;
                        if(self.checkedCounter<self.maxCheckedboxes) {
                            disableCheckboxs(false);
                        }
                    }
                    self.displayData = getSelectedData();
                    plotFunc();
                });
                if(self.checkedCounter < self.maxCheckedboxes) {
                    self.checkedCounter++;
                    $('#' + id).attr('checked', true);
                }
                else {disableCheckboxs(true);}
            });
        }
    }
    function disableCheckboxs(disabled) {
        for(var i in self.choiceList) {
            var choice = document.getElementById(self.choiceList[i]);
            var jChoice = $(choice);
            if(disabled==true) {
                jChoice.find('input').attr('disabled', true);
                jChoice.find(':checked').attr('disabled', false);
            }
            else {
                jChoice.find('input').attr('disabled', false);
            }
        }
    }
    function removeSpecial(str) {
        var temp = '',
            length = str.length;
        for(var i = 0; i < length; i++) {
            if( (str.charAt(i)!=' ') && (str.charAt(i)!='/')) {
                temp += str.charAt(i);
            }
        }
        return temp;
    }
    function findValue(data, ms) {
        for(var i in data) {
            var cur = data[i];
            if(cur[0]==ms) {
                return cur[1];
            }
        }
        return -1;
    }
    function sizeOf(dataset) {
        var index = 0;
        for(var i in dataset)
        {if(i>index) {index=i;}}
        return index;
    }
};