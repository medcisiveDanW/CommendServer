var ScoreGraphAPI = function(canvasElement, data, dateSpan, ajax) {
    var self = this;

    (function() {
        self.mouseX = 0,
        self.mouseY = 0,
        self.mousePressed = false,
        self.isTesting = false,
        self.monthMilliseconds = 2592000000,
        self.oneDay = 1 * 24 * 60 * 60 * 1000,
        self.oneMonth = self.oneDay*30,
        self.canvasElementName = '#' + canvasElement,
        self.eGraphDiv = document.getElementById(canvasElement),
        self.jGraphDiv = $(self.eGraphDiv),
        self.plot = null,
        self.ctx = null,
        self.gfx = null,
        self.med = null,
        self.choiceList = [],
        self.selectedIdList = [],
        self.selectedDataList = [],
        self.dataset = data,
        self.dateSpan = dateSpan,
        self.ajax = ajax;
        self.displayData = [],
        self.maxCheckedboxes = 2,
        self.checkedCounter = 0,
        self.currentSelectedData = null,
        self.synchronizedGraphAPI = null,
        self.nullData = {"No Measures": {label: "No Measures", yaxis: 1, data:[[1200000000000,0]]},
                          "No Side Effects": {label: "No Side Effects", yaxis: 1, data:[[1200000000000,0]]}},
        self.options = {
                            points: {show: true, symbol: "square"},
                            lines: {show: true, fill: true},
                            xaxis: {
                                    mode: "time",
                                    timeformat: "%b %y",
                                    monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                                    minTickSize: [1, "month"],
                                    min: dateSpan.start,
                                    max: dateSpan.end
                                    },
                            yaxes: [{position: "left" , color: "#f33", labelWidth: 12, tickDecimals: 0, tickColor: "#bbb"},
                                    {position: "right", color: "#33f", labelWidth: 12, tickDecimals: 0} ],
                            legend: {
                                    position: "nw",
                                    backgroundOpacity: .8,
                                    show: true
                                    },
                            grid: {show: true, backgroundColor: {colors: ["#eee","#bbb"]}, borderColor: "#77f", clickable: true, hoverable: true}
                        };
        setupSelection(data);
        setupTooltip();
        self.displayData = getSelectedData();
        plotFunc();
    })(jQuery);

    self.draw = function() {
        plotFunc();
    }

    return self;

    function setupTooltip() {
        var previousPoint = null;
        self.jGraphDiv.bind("plothover", function (event, pos, item) {
            if (item) {
                if (previousPoint != item.datapoint) {
                    previousPoint = item.datapoint;
                    $("#tooltip").remove();

                    var label = item.series.label,
                        x = item.datapoint[0],
                        y = item.datapoint[1],
                        d = new Date(x),
                        sideEffectsDataset = null,
                        sideEffectsData = null,
                        sideEffectsList = null,
                        sideEffectsY = null;
                    if(self.dataset['choiceSideEffects'].data!=undefined) {
                        sideEffectsDataset = self.dataset['choiceSideEffects'].data;
                        if(sideEffectsDataset['Side Effects']!=undefined) {
                            sideEffectsData = sideEffectsDataset['Side Effects'].data;
                            sideEffectsList = findSideEffects(sideEffectsData,x);
                            sideEffectsY = findValue(sideEffectsData,x);
                        }
                    }
                    if( label=="Side Effects" ) {
                        showTooltip(item.pageX+5, item.pageY-20, "Severity: " + sideEffectsY + "  SE: " + sideEffectsList);
                    }
                    else {
                        showTooltip(item.pageX+5, item.pageY-20, "Score of " + y + " on " + d.format("mmmm dS, yyyy"));
                    }
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    }
    function setupSelection(data) {
        if(data==null) {return;}
        for(var i in data) {
            var choiceName = i;
            self.choiceList.push(choiceName);
            var hash = data[i].data;
            if(hash==null) {return;}
            var choice = document.getElementById(choiceName);
            var jChoice = $(choice);

            $.each(hash, function(key, val) {
                var id = 'id' + choiceName + val.label;
                id = removeSpecial(id);
                jChoice.append('<input type="checkbox" name="' + val.label +
                                   '" id="' + id + '">' +
                                   '<label for="id' + val.label + '">'
                                    + val.label + '</label><br>');
                $('#' + id).data(id, val);
                $('#' + id).click(function() {
                    if($('#'+id).is(':checked')) {
                        self.ajax.logGraphEvent('Measure (' + val.label + ')',1011);
                        /*
                        self.checkedCounter++;
                        if(self.checkedCounter>=self.maxCheckedboxes) {
                            //disableCheckboxs(true);
                        }
                        */
                    }
                    else {
                        /*
                        self.checkedCounter--;
                        if(self.checkedCounter<self.maxCheckedboxes) {
                            //disableCheckboxs(false);
                        }
                        */
                    }
                    self.displayData = getSelectedData();
                    plotFunc();
                });
                if(self.checkedCounter < self.maxCheckedboxes) {
                    self.checkedCounter++;
                    $('#' + id).attr('checked', true);
                }
                else {//disableCheckboxs(true);
                }
            });
        }
    }
    function plotFunc() {
        self.plot = $.plot(self.jGraphDiv, self.displayData, self.options);
    }
    function showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y,
            left: x,
            border: '1px solid #fdd',
            padding: '2px',
            'background-color': '#ffb',
            opacity: 0.80
        }).appendTo("body").show();
    }
    function removeSpecial(str) {
        var temp = '',
            length = str.length;
        for(var i = 0; i < length; i++) {
            if( (str.charAt(i)!=' ') && (str.charAt(i)!='/') ) {
                temp += str.charAt(i);
            }
        }
        return temp;
    }
    function findSideEffects(data, ms) {
        for(var i in data) {
            var cur = data[i];
            if(cur[0]==ms) {
                return cur[2];
            }
        }
        return -1;
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
    function getSelectedData() { // start for wendsday
        var data = [];
        for(var i in self.choiceList) {
            var choice = document.getElementById(self.choiceList[i]);
            var jChoice = $(choice);
            var found = jChoice.find(':checked');
            found.each( function() {
                var id = $(this).attr('id'),
                    d = $(this).data(id);
                if($.inArray(id,self.selectedIdList)>=0) { }
                else {
                    self.selectedIdList.push(id);
                    self.selectedDataList.push(d);
                }
            });
            if(self.selectedIdList.length>2) {
                var deselect = self.selectedIdList.shift();
                self.selectedDataList.shift();
                $('#' + deselect).attr('checked', false);
            }
        }
        for(d in self.selectedDataList) {
            data.push(self.selectedDataList[d]);
        }
        if(data[0]==undefined) {
            data.push(self.nullData["No Measures"]);
            data.push(self.nullData["No Side Effects"]);
        }
        if(data.length==self.maxCheckedboxes){
            data[0].yaxis = 1;
            data[0].color = self.options.yaxes[0].color;
            data[self.maxCheckedboxes-1].yaxis = 2;
            data[self.maxCheckedboxes-1].color = self.options.yaxes[1].color;
        }
        else{
            data[0].yaxis = 1;
            data[0].color = self.options.yaxes[0].color;
        }
        return data;
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
    function dumpProps(obj, parent) {
       for (var i in obj) {
          if (parent) {var msg = parent + "." + i + "\n" + obj[i];} else {var msg = i + "\n" + obj[i];}
          if (!confirm(msg)) {return;}
          if (typeof obj[i] == "object") {
             if (parent) {dumpProps(obj[i], parent + "." + i);} else {dumpProps(obj[i], i);}
          }
       }
    }
};