var PTSDManager = function(sid) {
    var self = this;

    (function() {
        self.sid = sid,
        self.patients = [],
        self.filteredPatients = [],
        self.pages = [],
        self.currentPage = 0,
        self.options = {
            cross: false,
            oefoif: true,
            sort: 'name'
        },
        self.isReady = false,
        self.rpc = new RemoteInvocationController(),
        self.isFirstLegendHover = true,
        self.isPanEnabled = true,
        self.patients = null,
        self.utility = new Utility(),
        self.panel = new PatientPanel('patientPanelDivId',sid);
    })(jQuery);

    self.initDiv = function(divID,start,end) {
        var startms = Date.parse(start).valueOf(),
            endms = Date.parse(end).valueOf();
        if(isNaN(startms) || isNaN(endms)) {
            self.patients = _load();
        } else {
            self.patients = _loadRange(startms,endms);
        }
        _sort();
        _filter();
        _generatePaging();

        /*
        if(self.isReady==true) {
            return;
        }
        self.isReady=true;
        */

        var target = $('#' + divID);
        var thisDiv =

        '<div id="patientGraphHeaderDivID" style="width: 100%;height:50px;">' +
            '<div style="float: right;">' +
                '<div style="display:inline"><input type="checkbox" id="legendID"/><label id="legendCheckboxLabelID" for="legendID">Legend</label></div>' +
                '<div id="patientPanelRadioGraphDivId" style="display:inline;">' +
                    '<input type="radio" id="oefoifradioGraph" name="radio2" checked="checked"/><label for="oefoifradioGraph">OEF/OIF</label>' +
                    '<input type="radio" id="allradioGraph" name="radio2" /><label for="allradioGraph">All</label>' +
                '</div>' +
            '</div>' +
            '<div style="float:right;height: 40px;padding-right: 20%;">' +
                '<div class="pad-left left">' +
                    '<div class="info-cell">' +
                        '<div class="left complete">Complete</div>' +
                        '<div class="right table-icon greenbg"></div>' +
                    '</div>' +
                    '<div class="info-cell">' +
                        '<div class="left incomplete">Incomplete</div>' +
                        '<div class="right table-icon orangebg"></div>' +
                    '</div>' +
                '</div>' +
                '<div class="pad-left left">' +
                    '<div class="info-cell">' +
                        '<div class="left excluded">Excluded</div>' +
                        '<div class="right table-icon bluebg"></div>' +
                    '</div>' +
                    '<div class="info-cell">' +
                        '<div class="left noQualifying">No Qualifying</div>' +
                        '<div class="right table-icon graybg"></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div id="ptsdTherapyGraphsID" style="width:100%;height:500px;position: relative;"></div>' +
        '<div style="width:100%;height:50px;padding-top:5px;">' +
            '<div style="float:right;width:240px;height:45px">' +
                '<button id="firstPageID">First</button>' +
                '<button id="prevPageID">Prev</button>' +
                '<button id="nextPageID">Next</button>' +
                '<button id="lastPageID">Last</button>' +
            '</div>' +
            '<div style="float:right;width:50px;height:45px">Pages: <div id="pageNumberID">unknown</div></div>' +
        '</div>';
        target.html('');
        target.append(thisDiv);
        $('#legendCheckboxLabelID').hover(function(e) {
            if(self.isFirstLegendHover) {
                self.isFirstLegendHover = false;
                self.rpc.log('Provider Timeline Legend Hover',1041);
            }
            _showLegend(e);
        },function() {
            _hideLegend();
        });
        $('#legendID').button();
        $('#patientPanelRadioGraphDivId').buttonset();
        function updateOEFOIFGraphs(enableOEFIOF) {
            self.rpc.log('Provider Timeline OEF/OIF Toggle',1030);
            self.options.oefoif = enableOEFIOF;
            $('.processingOverlay').show();
            setTimeout(function() {
                self.update();
            }, 100);
        };
        $('#oefoifradioGraph').click(function() {
            updateOEFOIFGraphs(true);
        });
        $('#allradioGraph').click(function() {
            updateOEFOIFGraphs(false);
        });
        if($.browser.msie) {
            $(".fakePatientGraphClass").removeClass(); // IE hack to cause repainting
        }
        $('#firstPageID').button().click(function() { // More IE hacks
            $('.processingOverlay').show();
            setTimeout("$('#firstPageID').removeClass('ui-state-focus')", 500);
            setTimeout(function() {
                _firstPage();
            }, 100);
        });
        $('#prevPageID').button().click(function() {
            $('.processingOverlay').show();
            setTimeout("$('#prevPageID').removeClass('ui-state-focus')", 500);
            setTimeout(function() {
                _prevPage();
            }, 100);
        });
        $('#nextPageID').button().click(function() {
            $('.processingOverlay').show();
            setTimeout("$('#nextPageID').removeClass('ui-state-focus')", 500);
            setTimeout(function() {
                _nextPage();
            }, 100);
        });
        $('#lastPageID').button().click(function() {
            $('.processingOverlay').show();
            setTimeout("$('#lastPageID').removeClass('ui-state-focus')", 500);
            setTimeout(function() {
                _lastPage();
            }, 100);
        });
        _switchPage(0);
    }

    self.setDisplaySelect = function(key, value) {
        for(var pat in self.patients) {
            var patient = self.patients[pat];
            if(patient.isVisible) {
                patient.graph.setDisplaySelect(key,value);
            }
        }
    }

    self.update = function() {
        _filter();
        _generatePaging();
        _firstPage();
    }

    return self;

    function _load() {
        var result = [];
        $.ajax({
            type:   "post",
            url:    "PTSDManagerServlet",
            data:   "option=graphData&sid=" + self.sid + "&type=RM",
            async:  false,
            success: function(msg) {
                for(var i in msg) {
                    var j = self.utility.toJSON(msg[i]);
                    if(j['name']!=undefined) {
                        result.push(j);
                    }
                }
            }
        });
        return result;
    }

    function _loadRange(start,end) {
        var result = [];
        $.ajax({
            type:   "post",
            url:    "PTSDManagerServlet",
            data:   "option=graphDataWithinRange&start=" + start + "&end=" + end,
            async:  false,
            success: function(msg) {
                for(var i in msg) {
                    var j = _parse(msg[i]);
                    if(j['name']!=undefined) {
                        result.push(j);
                    }
                }
            }
        });
        return result;
    }

    function _firstPage() {
        self.currentPage = 0;
        _switchPage(self.currentPage);
    }

    function _lastPage() {
        self.currentPage = self.pages.length-1;
        _switchPage(self.currentPage);
    }

    function _nextPage() {
        self.currentPage++;
        if(self.currentPage>=self.pages.length) {
            self.currentPage = 0;
        }
        _switchPage(self.currentPage);
    }

    function _prevPage() {
        self.currentPage--;
        if(self.currentPage<0) {
            self.currentPage = self.pages.length-1;
        }
        _switchPage(self.currentPage);
    }

    function _switchPage(pageNumber) {
        self.rpc.log('Provider Timeline Page Change Event(' + pageNumber + ')',1032);
        $('#ptsdTherapyGraphsID').empty();
        var page = self.pages[pageNumber],
            data = null,
            patient = null,
            count = 0,
            size = page.length-1;
        for(var ien in page) {
            data = page[ien];
            patient = new PTSDPatient(data);
            patient.append('ptsdTherapyGraphsID');
            patient.manager = self;
            if(count==size) {
                patient.graph.enableDates();
            }
            count++
        }
        $('#pageNumberID').html( (pageNumber+1) + ' of ' + self.pages.length);
        $('.processingOverlay').hide();
    }

    function _sort() {
        if(self.options.sort=='name') {
            self.patients.sort(_sortByName);
        }
    }

    function _sortByName(a,b) {
        var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    function _filter() {
        var patient = null;
        self.filteredPatients = [];
        for(var pat in self.patients) {
            patient = self.patients[pat];
            self.filteredPatients[pat] = patient;
        }
        if(self.options.oefoif==true) {
            _filterOEFOIF();
        }
    }

    function _filterOEFOIF() {
        var patient = null,
        temp = [];
        for(var pat in self.filteredPatients) {
            patient = self.filteredPatients[pat];
            if(patient['oefoif']=='Y') {
                temp[pat] = patient;
            }
        }
        self.filteredPatients = [];
        self.filteredPatients = temp;
    }

    function _generatePaging() {
        var count = 0,
        pageCount = 0,
        page = [],
        patient = null;
        self.pages = [];
        for(var pat in self.filteredPatients) {
            if(count>9) {
                count = 0;
                self.pages[pageCount] = page;
                page = [];
                pageCount++;
            }
            patient = self.filteredPatients[pat];
            page[count] = patient;
            count++;
        }
        self.pages[pageCount] = page;
    }

    function _showLegend(event) {
        var legendHtml =
            '<div class="tt-cell">' +
                '<div class="left icon gd"></div>' +
                '<div class="pad-left left">Qualifying Date</div>' +
            '</div>' +
            '<div class="row-container">' +
                '<div class="pad-left left pad-right">' +
                    '<div class="tt-cell">' +
                        '<div class="left">Psychotherapy</div>' +
                        '<div class="right complete">Yes</div>' +
                    '</div>' +
                    '<div class="tt-cell">' +
                        '<div class="left">PTSD Diagnosis</div>' +
                        '<div class="right complete">Yes</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="tt-cell">' +
                '<div class="left icon bd"></div>' +
                '<div class="pad-left left">Qualifying Date</div>' +
            '</div>' +
            '<div class="row-container">' +
                '<div class="pad-left left pad-right">' +
                    '<div class="tt-cell">' +
                        '<div class="left">Psychotherapy</div>' +
                        '<div class="right incomplete">No</div>' +
                    '</div>' +
                    '<div class="tt-cell">' +
                        '<div class="left">PTSD Diagnosis</div>' +
                        '<div class="right complete">Yes</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="tt-cell">' +
                '<div class="left icon gc"></div>' +
            '</div>' +
            '<div class="row-container">' +
                '<div class="pad-left left pad-right">' +
                    '<div class="tt-cell">' +
                        '<div class="left">Psychotherapy</div>' +
                        '<div class="right complete">Yes</div>' +
                    '</div>' +
                    '<div class="tt-cell">' +
                        '<div class="left">PTSD Diagnosis</div>' +
                        '<div class="right complete">Yes</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="tt-cell">' +
                '<div class="left icon oc"></div>' +
            '</div>' +
            '<div class="row-container">' +
                '<div class="pad-left left pad-right">' +
                    '<div class="tt-cell">' +
                        '<div class="left">Psychotherapy</div>' +
                        '<div class="right complete">Yes</div>' +
                    '</div>' +
                    '<div class="tt-cell">' +
                        '<div class="left">PTSD Diagnosis</div>' +
                        '<div class="right incomplete">No</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="tt-cell">' +
                '<div class="left icon ot"></div>' +
            '</div>' +
            '<div class="row-container">' +
                '<div class="pad-left left pad-right">' +
                    '<div class="tt-cell">' +
                        '<div class="left">Psychotherapy</div>' +
                        '<div class="right incomplete">No</div>' +
                    '</div>' +
                    '<div class="tt-cell">' +
                        '<div class="left">PTSD Diagnosis</div>' +
                        '<div class="right complete">Yes</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="tt-cell">' +
                '<div class="left icon ox"></div>' +
            '</div>' +
            '<div class="row-container">' +
                '<div class="pad-left left pad-right">' +
                    '<div class="tt-cell">' +
                        '<div class="left">Psychotherapy</div>' +
                        '<div class="right incomplete">No</div>' +
                    '</div>' +
                    '<div class="tt-cell">' +
                        '<div class="left">PTSD Diagnosis</div>' +
                        '<div class="right incomplete">No</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        var p = $('#legendID').position();
        /*
        var x = event.pageX,
            y = event.pageY;
        */
        $('<div id="legendTooltipID">' + legendHtml + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: p.top+140,
            left: p.left+10,
            border: '1px solid #000',
            'background-color': '#ffe'
        }).appendTo("body").show();
    }

    function _hideLegend() {
        $("#legendTooltipID").remove();
    }
};

