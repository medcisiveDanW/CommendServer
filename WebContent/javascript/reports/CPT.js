var CPT = function(target) {
    var self = this;

    self.target = $('#' + target),
    self.loadingTarget = $('#loadingCPTPatternsDivId'),
    self.group = null,
    self.selected = '',
    self.selectedGroup = null,
    self.providerURL = [],
    self.cutoffDate = new Date(2012,1,1,0,0,0,0),
    self.logger = new Logger();

    self.setup = function() {
        $.ajax({
            type: "post",
            url: "../WorkgroupServlet",
            data: "option=getGroups",
            async: false,
            success: function(msg) {
                self.groups = msg._table;
            }
        });
        if (jQuery.isEmptyObject(self.groups)) {
            $.ajax({
                type: "post",
                url: "../WorkgroupServlet",
                data: "option=addSelfWorkgroup",
                async: false,
                success: function(msg) {
                    window.location.href = window.location.href;
                }
            });
        }
        var module = '<select id="workgroupSelectId">';
        for (i in self.groups) {
            var obj = self.groups[i];
            if (obj.isDefaultWg == 'Y') {
                self.selected = 'selected';
                self.selectedGroup = obj;
            }
            else {
                self.selected = '';
            }
            module += '<option value="' + obj.wgID + '" ' + self.selected + '>' + obj.wgName + '</option>';
        }
        module += '</select>';
        self.update(self.selectedGroup);
        $('#workgroupSelectDivId').html('');
        $('#workgroupSelectDivId').append(module);
        $('#workgroupSelectId').change(function() {
            var wgId = $("#workgroupSelectId option:selected").val();
            for (i in self.groups) {
                var obj = self.groups[i];
                if (obj.wgID == wgId) {
                    self.selectedGroup = obj;
                }
            }
            self.update(self.selectedGroup);
        });
    };
    
    self.update = function(group) {
        self.group = group;
        _createModule();
    };

    return self;

    function _getRoleTargetValue(role,temporalShift){
        var matrix = {
            'PSYCHIATRIST': [215,644,2574],
            'PSYCHOLOGIST': [161,482,1926],
            'SOCIALWORKER': [100,299,1194],
            'CNS': [164,494,1977],
            'RNP': [164,494,1977],
            'RN': [0,0,0],
            'AT': [0,0,0],
            'RT': [0,0,0],
            'PSYCHTECH': [0,0,0]
        };
        return matrix[role][temporalShift];
    }
    
    function _createModule() {
        var quarters = _getQuarterNames();
        var disabledTabs = [];
        $('#saveExcelDivId').html('<a href="../ExcelServlet?option=CPT&wgId=' + self.group.wgID + '&wgName=' + self.group.wgName + '" style="color: blue;">Save Excel</a>');
        var thisDiv =
            '<div id="mainCPTPatternsTabsIds" style="width: 100%;float: left;">' +
                '<ul>' +
                    '<li><a href="#cptPatternsYearTabId">Year</a></li>';
            for(i in quarters) { //(quarters.length-1)-i
                var index = 3-i;
                var quarter = quarters[index];
                var monthNumb = getMonthNumber(quarter.substring(0,3));
                var parsedDate = new Date(quarter.substring(8,12),monthNumb,1,0,0,0,0);
                if(self.cutoffDate.getTime()>parsedDate.getTime()) {
                    var disableThisIndex = Number(i)+1;
                    disabledTabs.push(disableThisIndex);
                }
                thisDiv += '<li><a href="#cptPatternsQuarterTabId' + index + '">Q: ' + quarter + '</a></li>';
            }
            thisDiv += '<li><a href="#cptPatternsMonthTabId">Current Quarter</a></li>' +
                '</ul>' +
                '<div id="cptPatternsYearTabId">' +
                    '<div id="cptPatternsYearDivId"></div>' +
                '</div>' +
                '<div id="cptPatternsQuarterTabId3">' +
                    '<div id="cptPatternsQuarterDivId3"></div>' +
                '</div>' +
                '<div id="cptPatternsQuarterTabId2">' +
                    '<div id="cptPatternsQuarterDivId2"></div>' +
                '</div>' +
                '<div id="cptPatternsQuarterTabId1">' +
                    '<div id="cptPatternsQuarterDivId1"></div>' +
                '</div>' +
                '<div id="cptPatternsQuarterTabId0">' +
                    '<div id="cptPatternsQuarterDivId0"></div>' +
                '</div>' +
                '<div id="cptPatternsMonthTabId">' +
                    '<div id="cptPatternsMonthDivId"></div>' +
                '</div>' +
            '</div>';
        self.target.html('');
        self.target.append(thisDiv);
        $('#mainCPTPatternsTabsIds').tabs({selected: 0});
        $('#mainCPTPatternsTabsIds').tabs( "option", "disabled", disabledTabs);
        _loadTable('cptPatternsYearDivId',self.group.wgID,0,2);
        $('#mainCPTPatternsTabsIds').bind('tabsshow', function(event, ui) {
            if (ui.panel.id == "cptPatternsYearTabId") {
                self.logger.log('CPT Patterns Year Tab Selected',1053);
            }
            if (ui.panel.id == "cptPatternsQuarterTabId0") {
                self.logger.log('CPT Patterns Last Quarter Tab Selected',1054);
                if($('#cptPatternsQuarterDivId0').html()===''){
                    _loadTable('cptPatternsQuarterDivId0',self.group.wgID,0,1);
                }
            }
            if (ui.panel.id == "cptPatternsQuarterTabId1") {
                self.logger.log('CPT Patterns Second Last Quarter Tab Selected',1055);
                if($('#cptPatternsQuarterDivId1').html()===''){
                    _loadTable('cptPatternsQuarterDivId1',self.group.wgID,1,1);
                }
            }
            if (ui.panel.id == "cptPatternsQuarterTabId2") {
                self.logger.log('CPT Patterns Third Last Quarter Tab Selected',1056);
                if($('#cptPatternsQuarterDivId2').html()===''){
                    _loadTable('cptPatternsQuarterDivId2',self.group.wgID,2,1);
                }
            }
            if (ui.panel.id == "cptPatternsQuarterTabId3") {
                self.logger.log('CPT Patterns Forth Last Quarter Tab Selected',1057);
                if($('#cptPatternsQuarterDivId3').html()===''){
                    _loadTable('cptPatternsQuarterDivId3',self.group.wgID,3,1);
                }
            }
            if (ui.panel.id == "cptPatternsMonthTabId") {
                self.logger.log('CPT Patterns Last Month Tab Selected',1058);
                if($('#cptPatternsMonthDivId').html()===''){
                    _loadTable('cptPatternsMonthDivId',self.group.wgID,0,0);
                }
            }
        });
    }

    function _getQuarterNames() {
        var result = null;
        $.ajax({
            type:   "post",
            url:    "../ReportsServlet",
            data:   "option=getQuarterNames",
            async:  false,
            success: function(msg) {
                result = msg;
            }
        });
        return result;
    }

    function _loadTable(targetDiv,wgId,temporalOffset,temporalCatId) {
        $.ajax({
            type:   "post",
            url:    "../CPTServlet",
            data:   "option=getCPTPatterns&wgId=" + wgId + "&temporalOffset=" + temporalOffset + "&temporalCatId=" + temporalCatId,
            async:  true,
            success: function(msg) {
                _createTable(targetDiv,msg,temporalOffset,temporalCatId);
            }
        });
    }

    function _createTable(targetDiv,JSONdata,offset,temporalCatId) {
        var total = null,
            target = $('#' + targetDiv),
            providers = [],
            header = '',
            rows = '',
            data = JSONdata.data._table,
            row = '';
        target.html('');
        for(i in data) {
            var id = data[i].staffSID,
                name = data[i].name;
            if(name!='TOTAL') {
                self.providerURL[id] = self.providerPageURL + '?name=' + name + '&sid=' + id;
                providers.push(data[i]);
            } else {
                total = data[i];
            }
        }
        header =
            '<tr>' +
                '<th class="ui-state-default">Provider</th>' +
                '<th>Total Encounters</th>' +
                '<th>Too many E&M</th>' +
                '<th>Prescribing</th>' +
                '<th>Intake</th>' +
                '<th>AddOn With E&M</th>' +
                '<th>AddOn Only</th>' +
                '<th>Crisis</th>' +
                '<th>High Complexity</th>' +
                '<th>Medium Complexity</th>' +
                '<th>Low Complexity</th>' +
                '<th>Group Therapy</th>' +
                '<th>Prolonged Service</th>' +
                '<th>Interactive Complexity</th>' +
            '</tr>';
        for(i in providers) {
            var d = providers[i];
            row =
                '<tr class="gradeC">' +
                    '<td><a href="#">' + d.name + '</a></td>' +
                    '<td class="center">' + d.EncTot + '</td>' +
                    '<td class="center">' + d.TooManyEM + '</td>' +
                    '<td class="center">' + d.Prescribing + '</td>' +
                    '<td class="center">' + d.Intake + '</td>' +
                    '<td class="center">' + d.AddOnWithEM + '</td>' +
                    '<td class="center">' + d.AddOnOnly + '</td>' +
                    '<td class="center">' + d.Crisis + '</td>' +
                    '<td class="center">' + d.HighComplexity + '</td>' +
                    '<td class="center">' + d.MediumComplexity + '</td>' +
                    '<td class="center">' + d.LowComplexity + '</td>' +
                    '<td class="center">' + d.GroupTherapy + '</td>' +
                    '<td class="center">' + d.ProlongedService + '</td>' +
                    '<td class="center">' + d.InteractiveComplexity + '</td>' +
                '</tr>';
            rows += row;
        }
        var thisDiv =
            '<div style="width: 100%; height: 30px;">' +
                '<div style="float: left; height: 30px;"><span style="font-weight:bold;">Period: ' + JSONdata.start + ' to ' + JSONdata.end + '</span></div>' +
                '<div style="float: right; height: 30px;"><span style="font-weight:bold;">U = Unique Patients; E = Encounters</span></div>' +
            '</div>' +
            '<table id="cptPatternsTableDivId' + offset + '_' + temporalCatId + '" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                '<thead>' +
                    header +
                '</thead>' +
                '<tbody>' +
                    rows +
                '</tbody>' +
            '</table>';
        target.append(thisDiv);

        var oTable = $('#cptPatternsTableDivId' + offset + '_' + temporalCatId).dataTable({
            "iDisplayLength": 25
            ,"aLengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
            ,"bJQueryUI": true
            ,"sPaginationType": "full_numbers"
        });

        $('#cptPatternsTableDivId' + offset + '_' + temporalCatId + ' thead th').click(function() {
            var cat = '';
            if(temporalCatId==0) {
                cat = 'month';
            }
            else if(temporalCatId==1) {
                cat = 'quarter';
            }
            else if(temporalCatId==2) {
                cat = 'year';
            }
            self.logger.log('CPT Patterns Sort Column(' + offset + '-' + cat + ')',1059);
        });
        parent.update();
    }
    
    function getMonthNumber(monthStr) {
        var monthMap = new Object();
        monthMap['Jan'] = 0;
        monthMap['Feb'] = 1;
        monthMap['Mar'] = 2;
        monthMap['Apr'] = 3;
        monthMap['May'] = 4;
        monthMap['Jun'] = 5;
        monthMap['Jul'] = 6;
        monthMap['Aug'] = 7;
        monthMap['Sep'] = 8;
        monthMap['Oct'] = 9;
        monthMap['Nov'] = 10;
        monthMap['Dec'] = 11;
        return monthMap[monthStr];
    }

    function _sort(a,b) {
        var nameA=parseInt(a), nameB=parseInt(b);
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }
};