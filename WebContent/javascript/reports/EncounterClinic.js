var EncounterClinic = function(target) {
    var self = this;

    self.target = $('#' + target),
    self.loadingTarget = $('#loadingEncounterStatisticsLongDivId'),
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
            '<div id="encounterStatisticsLongMainTabId" style="width: 100%;float: left;">' +
                '<ul>' +
                    '<li><a href="#EncounterStatisticsLongYearTabId">Year</a></li>';
            for(i in quarters) {
                var index = 3-i;
                var quarter = quarters[index];
                thisDiv += '<li><a href="#EncounterStatisticsLongQuarterTabId' + index + '">Q: ' + quarter + '</a></li>';
            }
            thisDiv += '<li><a href="#EncounterStatisticsLongMonthTabId">Current Quarter</a></li>' +
                '</ul>' +
                '<div id="EncounterStatisticsLongYearTabId">' +
                    '<div id="EncounterStatisticsLongYearDivId"></div>' +
                '</div>' +
                '<div id="EncounterStatisticsLongQuarterTabId3">' +
                    '<div id="EncounterStatisticsLongQuarterDivId3"></div>' +
                '</div>' +
                '<div id="EncounterStatisticsLongQuarterTabId2">' +
                    '<div id="EncounterStatisticsLongQuarterDivId2"></div>' +
                '</div>' +
                '<div id="EncounterStatisticsLongQuarterTabId1">' +
                    '<div id="EncounterStatisticsLongQuarterDivId1"></div>' +
                '</div>' +
                '<div id="EncounterStatisticsLongQuarterTabId0">' +
                    '<div id="EncounterStatisticsLongQuarterDivId0"></div>' +
                '</div>' +
                '<div id="EncounterStatisticsLongMonthTabId">' +
                    '<div id="EncounterStatisticsLongMonthDivId"></div>' +
                '</div>' +
            '</div>';
        self.target.html('');
        self.target.append(thisDiv);
        $('#encounterStatisticsLongMainTabId').tabs({selected: 0});
        _loadTable('EncounterStatisticsLongYearDivId',self.group.wgID,0,2);
        $('#encounterStatisticsLongMainTabId').bind('tabsshow', function(event, ui) {
            if (ui.panel.id == "EncounterStatisticsLongYearTabId") {
                self.logger.log('Encounter Statistics Year Tab Selected',1033);
            }
            if (ui.panel.id == "EncounterStatisticsLongQuarterTabId0") {
                self.logger.log('Encounter Statistics Last Quarter Tab Selected',1034);
                if($('#EncounterStatisticsLongQuarterDivId0').html()===''){
                    _loadTable('EncounterStatisticsLongQuarterDivId0',self.group.wgID,0,1);
                }
            }
            if (ui.panel.id == "EncounterStatisticsLongQuarterTabId1") {
                self.logger.log('Encounter Statistics Second Last Quarter Tab Selected',1035);
                if($('#EncounterStatisticsLongQuarterDivId1').html()===''){
                    _loadTable('EncounterStatisticsLongQuarterDivId1',self.group.wgID,1,1);
                }
            }
            if (ui.panel.id == "EncounterStatisticsLongQuarterTabId2") {
                self.logger.log('Encounter Statistics Third Last Quarter Tab Selected',1036);
                if($('#EncounterStatisticsLongQuarterDivId2').html()===''){
                    _loadTable('EncounterStatisticsLongQuarterDivId2',self.group.wgID,2,1);
                }
            }
            if (ui.panel.id == "EncounterStatisticsLongQuarterTabId3") {
                self.logger.log('Encounter Statistics Forth Last Quarter Tab Selected',1037);
                if($('#EncounterStatisticsLongQuarterDivId3').html()===''){
                    _loadTable('EncounterStatisticsLongQuarterDivId3',self.group.wgID,3,1);
                }
            }
            if (ui.panel.id == "EncounterStatisticsLongMonthTabId") {
                self.logger.log('Encounter Statistics Last Month Tab Selected',1038);
                if($('#EncounterStatisticsLongMonthDivId').html()===''){
                    _loadTable('EncounterStatisticsLongMonthDivId',self.group.wgID,0,0);
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
                _createTable(targetDiv,msg,wgId,temporalOffset,temporalCatId);
            }
        });
    }
    
    function _pullGroupStatistics(wgId,temporalOffset,temporalCatId) {
        var result;
        $.ajax({
            type:   "post",
            url:    "../GroupServlet",
            data:   "option=getGroupStatistics&wgId=" + wgId + "&temporalOffset=" + temporalOffset + "&temporalCatId=" + temporalCatId,
            async:  false,
            success: function(msg) {
                result = msg.data._table;
            }
        });
        return result;
    }

    function _createTable(targetDiv,JSONdata,wgId,offset,temporalCatId) {
        var total = null,
            target = $('#' + targetDiv),
            providers = [],
            header = '',
            rows = '',
            footer = '',
            data = JSONdata.data._table,
            groupStatistics = _pullGroupStatistics(wgId,offset,temporalCatId),
            EstClnLoad = 0;
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
            total.PatEva = '--',
            total.EncEva = '--',
            total.PatP60 = '--',
            total.EncP60 = '--',
            total.PatP90 = '--',
            total.EncP90 = '--',
            total.PatPMM = '--',
            total.EncPMM = '--',
            total.PatCM = '--',
            total.EncCM = '--',
            total.PatMM = '--',
            total.EncMM = '--',
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
                
                '<th class="ui-state-default" colspan="2">Eva</th>' +
                '<th class="ui-state-default" colspan="2">P60</th>' +
                '<th class="ui-state-default" colspan="2">P90</th>' +
                '<th class="ui-state-default" colspan="2">PMM</th>' +
                '<th class="ui-state-default" colspan="2">CM</th>' +
                '<th class="ui-state-default" colspan="2">MM</th>' +
                
                '<th class="ui-state-default" colspan="2">Group</th>' +
                '<th class="ui-state-default" colspan="2">Telephone</th>' +
                '<th class="ui-state-default" rowspan="2">Est.Cln.Hrs</th>' +
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
                '<th>U</th>' +
                '<th>E</th>' +
                '<th>U</th>' +
                '<th>#ofSess</th>' +
                '<th>U</th>' +
                '<th>E</th>' +
            '</tr>';
        
        var totalNumberOfSesstions = 0;
        for(i in providers) {
            var d = providers[i],
                row = '',
                providerGroupStats=_getObjBySID(d.staffSID,groupStatistics),
                numberOfSesstions = 0;
            if(providerGroupStats && providerGroupStats.NumberOfSessions > 0 ){
                numberOfSesstions = providerGroupStats.NumberOfSessions-1;
                totalNumberOfSesstions += numberOfSesstions;
            }
            EstClnLoad = d.EncEva*0.5 + d.EncP60*1.0 + d.PatP90*1.5 + d.EncPMM*1.0 + d.EncCM*0.5 + d.EncMM*0.5 + numberOfSesstions*1.0 + d.EncTel*0.25;

            row +=
                '<tr class="gradeC">' +
                    '<td><a href="#" sid="' + d.staffSID + '">' + d.name + '</a></td>' +
                    '<td class="center">' + d.PatEva + '</td>' +
                    '<td class="center">' + d.EncEva + '</td>' +
                    '<td class="center">' + d.PatP60 + '</td>' +
                    '<td class="center">' + d.EncP60 + '</td>' +
                    '<td class="center">' + d.PatP90 + '</td>' +
                    '<td class="center">' + d.EncP90 + '</td>' +
                    '<td class="center">' + d.PatPMM + '</td>' +
                    '<td class="center">' + d.EncPMM + '</td>' +
                    '<td class="center">' + d.PatCM + '</td>' +
                    '<td class="center">' + d.EncCM + '</td>' +
                    '<td class="center">' + d.PatMM + '</td>' +
                    '<td class="center">' + d.EncMM + '</td>' +
                    '<td class="center">' + d.PatGro + '</td>' +
                    '<td class="center">' + numberOfSesstions + '</td>' +
                    '<td class="center">' + d.PatTel + '</td>' +
                    '<td class="center">' + d.EncTel + '</td>' +
                    '<td class="center">' + EstClnLoad.toFixed(0) + '</td>' +
                '</tr>';
            rows += row;
        }
        footer =
            '<tr>' +
                '<th>TOTAL</th>' +
                '<th>' + total.PatEva + '</th>' +
                '<th>' + total.EncEva + '</th>' +
                '<th>' + total.PatP60 + '</th>' +
                '<th>' + total.EncP60 + '</th>' +
                '<th>' + total.PatP90 + '</th>' +
                '<th>' + total.EncP90 + '</th>' +
                '<th>' + total.PatPMM + '</th>' +
                '<th>' + total.EncPMM + '</th>' +
                '<th>' + total.PatCM + '</th>' +
                '<th>' + total.EncCM + '</th>' +
                '<th>' + total.PatMM + '</th>' +
                '<th>' + total.EncMM + '</th>' +
                '<th>' + total.PatGro + '</th>' +
                '<th>' + totalNumberOfSesstions + '</th>' +
                '<th>' + total.PatTel + '</th>' +
                '<th>' + total.EncTel + '</th>' +
                '<th></th>' +
            '</tr>';
        var thisDiv =
            '<div style="width: 100%; height: 30px;">' +
                '<div style="float: left; height: 30px;"><span style="font-weight:bold;">Period: ' + JSONdata.start + ' to ' + JSONdata.end + '</span></div>' +
                '<div style="float: right; height: 30px;"><span style="font-weight:bold;">U = Unique Patients; E = Encounters</span></div>' +
            '</div>' +
            '<table id="EncounterStatisticsLongTableDivId' + offset + '_' + temporalCatId + '" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
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

        $('#EncounterStatisticsLongTableDivId' + offset + '_' + temporalCatId).dataTable({
            "iDisplayLength": 25
            ,"aLengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
            ,"bJQueryUI": true
            ,"sPaginationType": "full_numbers"
        });

        $('#EncounterStatisticsLongTableDivId' + offset + '_' + temporalCatId + ' tbody td a').click(function() {
            $().loading(true,self.root);
            $('#popupDivId').popup('performance_encounter_patient.html?providerName=' + $(this).html() + '&providerSID=' + $(this).attr('sid') + '&temporalCatId=' + temporalCatId + '&temporalOffset=' + offset);
        });

        $('#EncounterStatisticsLongTableDivId' + offset + '_' + temporalCatId + ' thead th').click(function() {
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
    
    function _getObjBySID(sid, list) {
        for(i in list) {
            var cur = list[i];
            if(cur.ProviderSID==sid) {
                return cur;
            }
        }
        return null;
    }
};