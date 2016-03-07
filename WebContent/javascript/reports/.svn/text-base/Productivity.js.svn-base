var Productivity = function(target) {
    var self = this;

    self.target = $('#' + target),
    self.group = null,
    self.selected = '',
    self.selectedGroup = null,
    self.providerURL = [],
    self.cutoffDate = new Date(2012, 1, 1, 0, 0, 0, 0),
    self.groups = null,
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
        self.update(self.selectedGroup);
    };

    self.update = function(group) {
        self.group = group;
        _createModule();
    };

    return self;

    function _getRoleTargetValue(role, temporalShift) {
        var matrix = {
            'PSYCHIATRIST': [215, 644, 2574],
            'PSYCHOLOGIST': [161, 482, 1926],
            'SOCIALWORKER': [100, 299, 1194],
            'CNS': [164, 494, 1977],
            'RNP': [164, 494, 1977],
            'RN': ['--', '--', '--'],
            'AT': ['--', '--', '--'],
            'RT': ['--', '--', '--'],
            'PSYCHTECH': ['--', '--', '--']
        };
        return matrix[role][temporalShift];
    }

    function _createModule() {
        var quarters = _getQuarterNames();
        var disabledTabs = [];
        $('#saveExcelDivId').html('<a href="../ExcelServlet?option=Productivity&wgId=' + self.group.wgID + '&wgName=' + self.group.wgName + '" style="color: blue;">Save Excel</a>');
        var thisDiv =
                '<div id="mainProductivityTabsIds" style="width: 100%;float: left;">' +
                '<ul>' +
                '<li><a href="#productivityYearTabId">Year</a></li>';
        for (i in quarters) {//(quarters.length-1)-i
            var index = 3 - i;
            var quarter = quarters[index];
            var monthNumb = getMonthNumber(quarter.substring(0, 3));
            var parsedDate = new Date(quarter.substring(8, 12), monthNumb, 1, 0, 0, 0, 0);
            if (self.cutoffDate.getTime() > parsedDate.getTime()) {
                var disableThisIndex = Number(i) + 1;
                disabledTabs.push(disableThisIndex);
            }
            thisDiv += '<li><a href="#productivityQuarterTabId' + index + '">Q: ' + quarter + '</a></li>';
        }
        thisDiv += '<li><a href="#productivityMonthTabId">Current Quarter</a></li>' +
                '</ul>' +
                '<div id="productivityYearTabId">' +
                '<div id="productivityYearDivId"></div>' +
                '</div>' +
                '<div id="productivityQuarterTabId3">' +
                '<div id="productivityQuarterDivId3"></div>' +
                '</div>' +
                '<div id="productivityQuarterTabId2">' +
                '<div id="productivityQuarterDivId2"></div>' +
                '</div>' +
                '<div id="productivityQuarterTabId1">' +
                '<div id="productivityQuarterDivId1"></div>' +
                '</div>' +
                '<div id="productivityQuarterTabId0">' +
                '<div id="productivityQuarterDivId0"></div>' +
                '</div>' +
                '<div id="productivityMonthTabId">' +
                '<div id="productivityMonthDivId"></div>' +
                '</div>' +
                '</div>';
        self.target.html('');
        self.target.append(thisDiv);
        $('#mainProductivityTabsIds').tabs({selected: 0});
        $('#mainProductivityTabsIds').tabs("option", "disabled", disabledTabs);
        _loadTable('productivityYearDivId', self.group.wgID, 0, 2);
        $('#mainProductivityTabsIds').bind('tabsshow', function(event, ui) {
            if (ui.panel.id == "productivityYearTabId") {
                self.logger.log('Encounter Statistics Year Tab Selected', 1033);
            }
            if (ui.panel.id == "productivityQuarterTabId0") {
                self.logger.log('Productivity Last Quarter Tab Selected', 1048);
                if ($('#productivityQuarterDivId0').html() === '') {
                    _loadTable('productivityQuarterDivId0', self.group.wgID, 0, 1);
                }
            }
            if (ui.panel.id == "productivityQuarterTabId1") {
                self.logger.log('Productivity Second Last Quarter Tab Selected', 1049);
                if ($('#productivityQuarterDivId1').html() === '') {
                    _loadTable('productivityQuarterDivId1', self.group.wgID, 1, 1);
                }
            }
            if (ui.panel.id == "productivityQuarterTabId2") {
                self.logger.log('Productivity Third Last Quarter Tab Selected', 1050);
                if ($('#productivityQuarterDivId2').html() === '') {
                    _loadTable('productivityQuarterDivId2', self.group.wgID, 2, 1);
                }
            }
            if (ui.panel.id == "productivityQuarterTabId3") {
                self.logger.log('Productivity Forth Last Quarter Tab Selected', 1051);
                if ($('#productivityQuarterDivId3').html() === '') {
                    _loadTable('productivityQuarterDivId3', self.group.wgID, 3, 1);
                }
            }
            if (ui.panel.id == "productivityMonthTabId") {
                self.logger.log('Productivity Last Month Tab Selected', 1052);
                if ($('#productivityMonthDivId').html() === '') {
                    _loadTable('productivityMonthDivId', self.group.wgID, 0, 0);
                }
            }
        });
    }

    function _getQuarterNames() {
        var result = null;
        $.ajax({
            type: "post",
            url: "../ReportsServlet",
            data: "option=getQuarterNames",
            async: false,
            success: function(msg) {
                result = msg;
            }
        });
        return result;
    }

    function _loadTable(targetDiv, wgId, temporalOffset, temporalCatId) {
        $.ajax({
            type: "post",
            url: "../EncounterServlet",
            data: "option=getEncounterStatistics&wgId=" + wgId + "&temporalOffset=" + temporalOffset + "&temporalCatId=" + temporalCatId,
            async: true,
            success: function(msg) {
                _createTable(targetDiv, msg, temporalOffset, temporalCatId);
            }
        });
    }

    function _createTable(targetDiv, JSONdata, offset, temporalCatId) {
        var total = null,
                target = $('#' + targetDiv),
                providers = [],
                header = '',
                rows = '',
                footer = '',
                data = JSONdata.data._table;
        target.html('');
        for (i in data) {
            var id = data[i].staffSID,
                    name = data[i].name;
            if (name != 'TOTAL') {
                self.providerURL[id] = self.providerPageURL + '?name=' + name + '&sid=' + id;
                providers.push(data[i]);
            } else {
                total = data[i];
            }
        }
        header =
                '<tr>' +
                '<th class="ui-state-default">Provider</th>' +
                '<th>Role</th>' +
                '<th>Total wRVU</th>' +
                '<th>%Time</th>' +
                '<th>Productivity</th>' +
                '<th>Target</th>' +
                '<th>%Target</th>' +
                '<th>Unique<br>Indiv. Pts.</th>' +
                '<th>Total Encs.</th>' +
                '</tr>';
        for (i in providers) {
            var d = providers[i],
                    sid = d.staffSID,
                    row = '',
                    prod = '--',
                    target_wRVU = '--',
                    rawProd = '--',
                    error = (d.wRVUTot / d.wRVUFilter).toFixed(1),
                    prodTarget = '--';
            if (d.FTE > 0) {
                prod = (d.wRVUFilter / d.FTE).toFixed(1);
                rawProd = (d.wRVUTot / d.FTE).toFixed(1);
            } else {
                prod = d.wRVUFilter.toFixed(1);
                rawProd = d.wRVUTot.toFixed(1);
            }
            if (error > 10) {
                error = ">10";
            }
            if (_getRoleTargetValue(d.Role, temporalCatId) !== undefined) {
                target_wRVU = _getRoleTargetValue(d.Role, temporalCatId);
                if (temporalCatId == 0) {
                  // for the current quarter, which has Id = 0, we must obtain the quarter's wRVU
                  // and further adjust by the percentage of the quarter which has passed
                  target_wRVU = _getRoleTargetValue(d.Role, 1);
                  if (target_wRVU != '--') {
                    target_wRVU = (target_wRVU * percentOfQuarter(JSONdata.start,JSONdata.end)/100.0).toFixed(1);
                  }
                }
            }
            if (prod !== '--' && target_wRVU !== '--') {
                prodTarget = ((rawProd / target_wRVU) * 100).toFixed(0) + '%';
            }
            row +=
                    '<tr class="gradeC">' +
                    '<td><a href="#">' + d.name + '</a></td>' +
                    '<td class="center">' + d.Role + '</td>' +
                    '<td class="center">' + d.wRVUTot.toFixed(1) + '</td>' +
                    '<td class="center">' + (d.FTE * 100).toFixed(0) + '%</td>' +
                    '<td class="center">' + rawProd + '</td>' +
                    '<td class="center">' + target_wRVU + '</td>' +
                    '<td class="center">' + prodTarget + '</td>' +
                    '<td class="center">' + d.PatTot + '</td>' +
                    '<td class="center">' + d.EncTot + '</td>' +
                    '</tr>';
            rows += row;
        }
        var thisDiv =
                '<div style="width: 100%; height: 30px;">' +
                '<div style="float: left; height: 30px;"><span style="font-weight:bold;">Period: ' + JSONdata.start + ' to ' + JSONdata.end + ' </span></div>' +
                '<div style="float: right; height: 30px;"><span style="font-weight:bold;">U = Unique Patients; E = Encounters</span></div>' +
                '</div>' +
                '<table id="productivityTableDivId' + offset + '_' + temporalCatId + '" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                '<thead>' +
                header +
                '</thead>' +
                '<tbody>' +
                rows +
                '</tbody>' +
                '</table>';
        target.append(thisDiv);

        var oTable = $('#productivityTableDivId' + offset + '_' + temporalCatId).dataTable({
            "iDisplayLength": 25
            , "aLengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
            , "bJQueryUI": true
            , "sPaginationType": "full_numbers"
        });

        $('#productivityTableDivId' + offset + '_' + temporalCatId + ' thead th').click(function() {
            var cat = '';
            if (temporalCatId == 0) {
                cat = 'month';  //As of Dec.15,2014, temporalCatId = 0 means the current quarter up to today
            }
            else if (temporalCatId == 1) {
                cat = 'quarter';
            }
            else if (temporalCatId == 2) {
                cat = 'year';
            }
            self.rpc.log('Encounter Statistics Sort Column(' + offset + '-' + cat + ')', 1039);
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

    function _sort(a, b) {
        var nameA = parseInt(a), nameB = parseInt(b);
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    // Given the dayEndStr, and the dayStartStr, which
    // is assumed to be the first day of a quarter, this
    // returns the percent of the quarter past, rounded to the
    // nearest 1%, and the minimum is 1%.
    function percentOfQuarter(dayStartStr, dayEndStr) {
        var minutes = 1000*60;
        var hours = minutes*60;
        var days = hours*24;
        var onePercent = 0.01;
	var aveDaysPerQuarter = 90;   //use convenient average, which
		                      //necessitates adjusting the answer
		                      //near 0% and over 99%
    	var start = Date.parse(dayStartStr);
    	var end = Date.parse(dayEndStr);
    	var diffDays = Math.round((end - start)/days);
    	var pQuarter = Math.round(diffDays/(aveDaysPerQuarter*onePercent));
    	if (pQuarter < 1) pQuarter = 1;     // always give non-zero answer
    	if (pQuarter > 100) pQuarter = 100  // never over 100%
    	return pQuarter;
    }
};