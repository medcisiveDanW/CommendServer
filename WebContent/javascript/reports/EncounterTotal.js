var EncounterTotal = function(target) {
    var self = this;

    self.target = $('#' + target),
    self.loadingTarget = $('#loadingEncounterSatisticsDivId'),
    self.group = null,
    self.selected = '',
    self.selectedGroup = null,
    self.providerURL = [],
    self.root = '../',
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
        $('#saveExcelDivId').html('<a href="../ExcelServlet?option=Encounters&wgId=' + self.group.wgID + '&wgName=' + self.group.wgName + '" style="color: blue;">Save Excel</a>');
        var thisDiv =
            '<div id="EncounterStatisticsMainTabId" style="width: 100%;float: left;">' +
                '<ul>' +
                    '<li><a href="#EncounterStatisticsYearTabId">Year</a></li>';
            for(i in quarters) {
                var index = 3-i;
                var quarter = quarters[index];
                thisDiv += '<li><a href="#EncounterStatisticsQuarterTabId' + index + '">Q: ' + quarter + '</a></li>';
            }
            thisDiv += '<li><a href="#EncounterStatisticsMonthTabId">Current Quarter</a></li>' +
                '</ul>' +
                '<div id="EncounterStatisticsYearTabId">' +
                    '<div id="EncounterStatisticsYearDivId"></div>' +
                '</div>' +
                '<div id="EncounterStatisticsQuarterTabId3">' +
                    '<div id="EncounterStatisticsQuarterDivId3"></div>' +
                '</div>' +
                '<div id="EncounterStatisticsQuarterTabId2">' +
                    '<div id="EncounterStatisticsQuarterDivId2"></div>' +
                '</div>' +
                '<div id="EncounterStatisticsQuarterTabId1">' +
                    '<div id="EncounterStatisticsQuarterDivId1"></div>' +
                '</div>' +
                '<div id="EncounterStatisticsQuarterTabId0">' +
                    '<div id="EncounterStatisticsQuarterDivId0"></div>' +
                '</div>' +
                '<div id="EncounterStatisticsMonthTabId">' +
                    '<div id="EncounterStatisticsMonthDivId"></div>' +
                '</div>' +
            '</div>';
        self.target.html('');
        self.target.append(thisDiv);
        $('#EncounterStatisticsMainTabId').tabs({selected: 0});
        _loadTable('EncounterStatisticsYearDivId',self.group.wgID,0,2);
        $('#EncounterStatisticsMainTabId').bind('tabsshow', function(event, ui) {
            if (ui.panel.id == "EncounterStatisticsYearTabId") {
                self.logger.log('Encounter Statistics Year Tab Selected',1033);
            }
            if (ui.panel.id == "EncounterStatisticsQuarterTabId0") {
                self.logger.log('Encounter Statistics Last Quarter Tab Selected',1034);
                if($('#EncounterStatisticsQuarterDivId0').html()===''){
                    _loadTable('EncounterStatisticsQuarterDivId0',self.group.wgID,0,1);
                }
            }
            if (ui.panel.id == "EncounterStatisticsQuarterTabId1") {
                self.logger.log('Encounter Statistics Second Last Quarter Tab Selected',1035);
                if($('#EncounterStatisticsQuarterDivId1').html()===''){
                    _loadTable('EncounterStatisticsQuarterDivId1',self.group.wgID,1,1);
                }
            }
            if (ui.panel.id == "EncounterStatisticsQuarterTabId2") {
                self.logger.log('Encounter Statistics Third Last Quarter Tab Selected',1036);
                if($('#EncounterStatisticsQuarterDivId2').html()===''){
                    _loadTable('EncounterStatisticsQuarterDivId2',self.group.wgID,2,1);
                }
            }
            if (ui.panel.id == "EncounterStatisticsQuarterTabId3") {
                self.logger.log('Encounter Statistics Forth Last Quarter Tab Selected',1037);
                if($('#EncounterStatisticsQuarterDivId3').html()===''){
                    _loadTable('EncounterStatisticsQuarterDivId3',self.group.wgID,3,1);
                }
            }
            if (ui.panel.id == "EncounterStatisticsMonthTabId") {
                self.logger.log('Encounter Statistics Last Month Tab Selected',1038);
                if($('#EncounterStatisticsMonthDivId').html()===''){
                    _loadTable('EncounterStatisticsMonthDivId',self.group.wgID,0,0);
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
            url:    "../EncounterServlet",
            data:   "option=getEncounterStatistics&wgId=" + wgId + "&temporalOffset=" + temporalOffset + "&temporalCatId=" + temporalCatId,
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
            footer = '',
            data = JSONdata.data._table;
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
        if(total==null) {
            total = [];
            total.PatInd = '--',
            total.EncInd = '--',
            total.PatGro = '--',
            total.EncGro = '--',
            total.PatTel = '--',
            total.EncTel = '--',
            total.PatOth = '--',
            total.EncOth = '--',
            total.PatTot = '--',
            total.EncTot = '--';
        }
        header =
            '<tr>' +
                '<th class="ui-state-default" rowspan="2">Provider</th>' +
                '<th class="ui-state-default" colspan="2">Individual</th>' +
                '<th class="ui-state-default" colspan="2">Group</th>' +
                '<th class="ui-state-default" colspan="2">Telephone</th>' +
                '<th class="ui-state-default" colspan="2">Other</th>' +
                '<th class="ui-state-default" colspan="2">Total</th>' +
            '</tr>' +
            '<tr>' +
                '<th>U</th>' +
                '<th>E</th>' +
                '<th>U</th>' +
                '<th>E</th>' +
                '<th>U</th>' +
                '<th>E</th>' +
                '<th>U</th>' +
                '<th>E</th>' +
                '<th>U</th>' +
                '<th>E</th>' +
            '</tr>';
        footer =
            '<tr>' +
                '<th>TOTAL</th>' +
                '<th>' + total.PatInd + '</th>' +
                '<th>' + total.EncInd + '</th>' +
                '<th>' + total.PatGro + '</th>' +
                '<th>' + total.EncGro + '</th>' +
                '<th>' + total.PatTel + '</th>' +
                '<th>' + total.EncTel + '</th>' +
                '<th>' + total.PatOth + '</th>' +
                '<th>' + total.EncOth + '</th>' +
                '<th>' + total.PatTot + '</th>' +
                '<th>' + total.EncTot + '</th>' +
            '</tr>';
        for(i in providers) {
            var d = providers[i]
                ,row = '';
            row +=
                '<tr class="gradeC">' +
                    '<td><a href="#" sid="' + d.staffSID + '">' + d.name + '</a></td>' +
                    '<td class="center">' + d.PatInd + '</td>' +
                    '<td class="center">' + d.EncInd + '</td>' +
                    '<td class="center">' + d.PatGro + '</td>' +
                    '<td class="center">' + d.EncGro + '</td>' +
                    '<td class="center">' + d.PatTel + '</td>' +
                    '<td class="center">' + d.EncTel + '</td>' +
                    '<td class="center">' + d.PatOth + '</td>' +
                    '<td class="center">' + d.EncOth + '</td>' +
                    '<td class="center">' + d.PatTot + '</td>' +
                    '<td class="center">' + d.EncTot + '</td>' +
                '</tr>';
            rows += row;
        }
        var thisDiv =
            '<div style="width: 100%; height: 30px;">' +
                '<div style="float: left; height: 30px;"><span style="font-weight:bold;">Period: ' + JSONdata.start + ' to ' + JSONdata.end + '</span></div>' +
                '<div style="float: right; height: 30px;"><span style="font-weight:bold;">U = Unique Patients; E = Encounters</span></div>' +
            '</div>' +
            '<table id="EncounterStatisticsTableDivId' + offset + '_' + temporalCatId + '" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                '<thead>' +
                    header +
                '</thead>' +
                '<tfoot>' +
                    footer +
                '</tfoot>' +
                '<tbody>' +
                    rows +
                '</tbody>' +
            '</table>';
        target.append(thisDiv);

        $('#EncounterStatisticsTableDivId' + offset + '_' + temporalCatId).dataTable({
            "iDisplayLength": 25
            ,"aLengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
            ,"bJQueryUI": true
            ,"sPaginationType": "full_numbers"
        });
        
        $('#EncounterStatisticsTableDivId' + offset + '_' + temporalCatId + ' tbody td a').click(function() {
            $().loading(true,self.root);
            $('#popupDivId').popup('performance_encounter_patient.html?providerName=' + $(this).html() + '&providerSID=' + $(this).attr('sid') + '&temporalCatId=' + temporalCatId + '&temporalOffset=' + offset);
        });

        $('#EncounterStatisticsTableDivId' + offset + '_' + temporalCatId + ' thead th').click(function() {
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
            self.rpc.log('Encounter Statistics Sort Column(' + offset + '-' + cat + ')',1039);
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