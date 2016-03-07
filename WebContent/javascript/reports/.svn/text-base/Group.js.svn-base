var Group = function(target) {
    var self = this;

    self.target = $('#' + target),
    self.loadingTarget = $('#loadingEncounterSatisticsDivId'),
    self.group = null,
    self.selected = '',
    self.selectedGroup = null,
    self.providerURL = [],
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

    function _createModule() {
        var quarters = _getQuarterNames();
        var thisDiv =
            '<div id="groupStatisticsMainTabId" style="width: 100%;float: left;">' +
                '<ul>' +
                    '<li><a href="#groupStatisticsYearTabId">Year</a></li>';
            for(i in quarters) {
                var index = 3-i;
                var quarter = quarters[index];
                thisDiv += '<li><a href="#groupStatisticsQuarterTabId' + index + '">Q: ' + quarter + '</a></li>';
            }
            thisDiv += '<li><a href="#groupStatisticsMonthTabId">Current Quarter</a></li>' +
                '</ul>' +
                '<div id="groupStatisticsYearTabId">' +
                    '<div id="groupStatisticsYearDivId"></div>' +
                '</div>' +
                '<div id="groupStatisticsQuarterTabId3">' +
                    '<div id="groupStatisticsQuarterDivId3"></div>' +
                '</div>' +
                '<div id="groupStatisticsQuarterTabId2">' +
                    '<div id="groupStatisticsQuarterDivId2"></div>' +
                '</div>' +
                '<div id="groupStatisticsQuarterTabId1">' +
                    '<div id="groupStatisticsQuarterDivId1"></div>' +
                '</div>' +
                '<div id="groupStatisticsQuarterTabId0">' +
                    '<div id="groupStatisticsQuarterDivId0"></div>' +
                '</div>' +
                '<div id="groupStatisticsMonthTabId">' +
                    '<div id="groupStatisticsMonthDivId"></div>' +
                '</div>' +
            '</div>';
        self.target.html('');
        self.target.append(thisDiv);
        $('#groupStatisticsMainTabId').tabs({selected: 0});
        _loadTable('groupStatisticsYearDivId',self.group.wgID,0,2);
        $('#groupStatisticsMainTabId').bind('tabsshow', function(event, ui) {
            if (ui.panel.id == "groupStatisticsYearTabId") {
                self.logger.log('Encounter Statistics Year Tab Selected',1033);
            }
            if (ui.panel.id == "groupStatisticsQuarterTabId0") {
                self.logger.log('Encounter Statistics Last Quarter Tab Selected',1034);
                if($('#groupStatisticsQuarterDivId0').html()===''){
                    _loadTable('groupStatisticsQuarterDivId0',self.group.wgID,0,1);
                }
            }
            if (ui.panel.id == "groupStatisticsQuarterTabId1") {
                self.logger.log('Encounter Statistics Second Last Quarter Tab Selected',1035);
                if($('#groupStatisticsQuarterDivId1').html()===''){
                    _loadTable('groupStatisticsQuarterDivId1',self.group.wgID,1,1);
                }
            }
            if (ui.panel.id == "groupStatisticsQuarterTabId2") {
                self.logger.log('Encounter Statistics Third Last Quarter Tab Selected',1036);
                if($('#groupStatisticsQuarterDivId2').html()===''){
                    _loadTable('groupStatisticsQuarterDivId2',self.group.wgID,2,1);
                }
            }
            if (ui.panel.id == "groupStatisticsQuarterTabId3") {
                self.logger.log('Encounter Statistics Forth Last Quarter Tab Selected',1037);
                if($('#groupStatisticsQuarterDivId3').html()===''){
                    _loadTable('groupStatisticsQuarterDivId3',self.group.wgID,3,1);
                }
            }
            if (ui.panel.id == "groupStatisticsMonthTabId") {
                self.logger.log('Encounter Statistics Last Month Tab Selected',1038);
                if($('#groupStatisticsMonthDivId').html()===''){
                    _loadTable('groupStatisticsMonthDivId',self.group.wgID,0,0);
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
            url:    "../GroupServlet",
            data:   "option=getGroupStatistics&wgId=" + wgId + "&temporalOffset=" + temporalOffset + "&temporalCatId=" + temporalCatId,
            async:  true,
            success: function(msg) {
                _createTable(targetDiv,msg,temporalOffset,temporalCatId);
            }
        });
    }

    function _createTable(targetDiv,JSONdata,offset,temporalCatId) {
        var target = $('#' + targetDiv),
            header = '',
            rows = '',
            data = JSONdata.data._table;
        target.html('');
        header =
            '<tr>' +
                '<th class="ui-state-default">Provider</th>' +
                '<th class="ui-state-default">Num Sessions</th>' +
                '<th class="ui-state-default">Ave #Pts </th>' +
                '<th class="ui-state-default">Max #Pts</th>' +
                '<th class="ui-state-default">Median #Pts</th>' +
                '<th class="ui-state-default">Mode #Pts</th>' +
                '<th class="ui-state-default">U</th>' +
                '<th class="ui-state-default">E</th>' +
            '</tr>';
        for(i in data) {
            var d = data[i];
            var row =
                '<tr class="gradeC">' +
                    '<td><a href="#">' + d.Name + '</a></td>' +
                    '<td class="center">' + (d.NumberOfSessions-1) + '</td>' +
                    '<td class="center">' + (d.NumberOfEncounters/(d.NumberOfSessions-1)).toFixed(1) + '</td>' +
                    '<td class="center">' + d.MaxPatients + '</td>' +
                    '<td class="center">' + d.MedianPatients + '</td>' +
                    '<td class="center">' + d.ModePatients + '</td>' +
                    '<td class="center">' + d.UniquePatients + '</td>' +
                    '<td class="center">' + d.NumberOfEncounters + '</td>' +
                '</tr>';
            rows += row;
        }
        var thisDiv =
            '<div style="width: 100%; height: 30px;">' +
                '<div style="float: left; height: 30px;"><span style="font-weight:bold;">Period: ' + JSONdata.start + ' to ' + JSONdata.end + '</span></div>' +
                '<div style="float: right; height: 30px;"><span style="font-weight:bold;">U = Unique Patients; E = Encounters</span></div>' +
            '</div>' +
            '<table id="groupStatisticsTableDivId' + offset + '_' + temporalCatId + '" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                '<thead>' +
                    header +
                '</thead>' +
                '<tbody>' +
                    rows +
                '</tbody>' +
            '</table>';
        target.append(thisDiv);

        var oTable = $('#groupStatisticsTableDivId' + offset + '_' + temporalCatId).dataTable({
            "iDisplayLength": 25
            ,"aLengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
            ,"bJQueryUI": true
            ,"sPaginationType": "full_numbers"
        });

        $('#groupStatisticsTableDivId' + offset + '_' + temporalCatId + ' thead th').click(function() {
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
            self.logger.log('Encounter Statistics Sort Column(' + offset + '-' + cat + ')',1039);
        });
        
        parent.update();
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