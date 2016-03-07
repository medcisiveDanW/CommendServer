var WorkgroupEdit = function() {
    var self = this;

    (function() {
        self.wgId = socket.getParameter('wgId'),
        self.wgName = socket.getParameter('wgName'),
        self.group = null,
        self.startGroup = null,
        self.available = null,
        self.u = new Utility(),
        self.sidRegExp = /^\d*_/igm,
        self.sta3nRegExp = /_\d*/igm,
        self.root = '../';
    })(jQuery);

    self.load = function() {
        _load();
        parent.$().loading(false);
    };

    self.save = function() {
        _save();
    };

    return self;

    function _addProvider(sta3n,sid,role) {
        if(sid==null) {return;}
        if(role==null) { role="PSYCHOLOGIST"; }
        $.ajax({
            type:   "post",
            url:    self.root + "WorkgroupServlet",
            data:   "option=addProviderToGroup&wgId=" + self.wgId + "&sta3n=" + sta3n + "&sid=" + sid + "&role=" + role,
            async:  false,
            success: function(msg) {}
        });
    }

    function _removeProvider(sta3n,sid) {
        if(sid==null) {return;}
        $.ajax({
            type:   "post",
            url:    self.root + "WorkgroupServlet",
            data:   "option=removeProviderFromGroup&wgId=" + self.wgId + "&sta3n=" + sta3n + "&sid=" + sid,
            async:  false,
            success: function(msg) {}
        });
    }

    function _loadGroup() {
        var result = null;
        if(self.wgId==null) {return result;}
        $.ajax({
            type:   "post",
            url:    self.root + "WorkgroupServlet",
            data:   "option=getGroup&wgId=" + self.wgId,
            async:  false,
            success: function(msg) {
                result = msg._table;
            }
        });
        return result;
    }

    function _loadAvailable(list) {
        var result = null;
        if(list==null) {return result;}
        $.ajax({
            type:   "post",
            url:    self.root + "WorkgroupServlet",
            data:   "option=getAvailableProviders&list=" + list,
            async:  false,
            success: function(msg) {
                result = msg._table;
            }
        });
        return result;
    }

    function _load() {
        self.group = _loadGroup(),
        self.startGroup = _loadGroup();
        var memberList = '';
        if(self.wgName==null) {self.wgName = '';}
        $('#groupNameTextId').val(self.wgName);
        var module =
            '<table id="groupTableId" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                '<thead>' +
                    '<tr>' +
                        '<th>Provider</th>' +
                        '<th>Clinic Time</th>' +
                        '<th>Role</th>' +
                        '<th>Delete</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>';
            for(i in self.group) {
                var cur = self.group[i],
                    role = cur.Role,
                    PSYCHIATRIST = '',
                    PSYCHOLOGIST = '',
                    SOCIALWORKER = '',
                    CNS = '',
                    RNP = '',
                    RN = '',
                    AT = '',
                    RT = '',
                    PSYCHTECH = '';
                memberList += cur.providerSID + ',';
                if(role==='PSYCHIATRIST') {
                    PSYCHIATRIST = 'selected';
                } else if(role==='PSYCHOLOGIST') {
                    PSYCHOLOGIST = 'selected';
                } else if(role==='SOCIALWORKER') {
                    SOCIALWORKER = 'selected';
                } else if(role==='SOCIALWORKER') {
                    SOCIALWORKER = 'selected';
                } else if(role==='CNS') {
                    CNS = 'selected';
                } else if(role==='RNP') {
                    RNP = 'selected';
                } else if(role==='RN') {
                    RN = 'selected';
                } else if(role==='AT') {
                    AT = 'selected';
                } else if(role==='RT') {
                    RT = 'selected';
                } else if(role==='PSYCHTECH') {
                    PSYCHTECH = 'selected';
                }
                module +=
                    '<tr id="trId' + cur.providerSta3n + '_' + cur.providerSID + '" class="gradeC">' +
                        '<td>' + cur.providerName + '</td>' +
                        '<td><img id="editId' + cur.providerSta3n + '_' + cur.providerSID + '" class="icon-class" src="' + self.root + 'images/edit.png" alt="Edit"/></td>' +
                        '<td><select id="providerRoleSelectId' + cur.providerSta3n + '_' + cur.providerSID + '">' +
                                '<option value="PSYCHIATRIST" ' + PSYCHIATRIST + '>PSYCHIATRIST</option>' +
                                '<option value="PSYCHOLOGIST" ' + PSYCHOLOGIST + '>PSYCHOLOGIST</option>' +
                                '<option value="SOCIALWORKER" ' + SOCIALWORKER + '>SOCIALWORKER</option>' +
                                '<option value="CNS" ' + CNS + '>CNS</option>' +
                                '<option value="RNP" ' + RNP + '>RNP</option>' +
                                '<option value="RN" ' + RN + '>RN</option>' +
                                '<option value="AT" ' + AT + '>AT</option>' +
                                '<option value="RT" ' + RT + '>RT</option>' +
                                '<option value="PSYCHTECH" ' + PSYCHTECH + '>PSYCHTECH</option>' +
                        '</select></td>' +
                        '<td><img id="deleteId' + cur.providerSta3n + '_' + cur.providerSID + '" class="icon-class" src="' + self.root + 'images/X-icon-small.png" alt="Delete"/></td>' +
                    '</tr>';
            }
            module +=
                '</tbody>' +
            '</table>';
        memberList = memberList.substring(0,memberList.length-1);
        $('#groupDivId').html('');
        $('#groupDivId').append(module);
        $('#groupTableId').dataTable({
            "bLengthChange": false
            ,"bJQueryUI": true
            ,"sScrollY": "250px"
            ,"bScrollCollapse": true
            ,"bPaginate": false
            ,"sPaginationType": "full_numbers"
        });
        self.available = _loadAvailable(memberList);
        var availableProviders = '';
            for(i in self.available) {
                cur = self.available[i];
                availableProviders +=
                    '<tr id="trId' + cur.providerSta3n + '_' + cur.providerSID + '" class="gradeC">' +
                        '<td>' + cur.providerName + '</td>' +
                        '<td class="center"><img id="addId' + cur.providerSta3n + '_' + cur.providerSID + '" class="icon-class" src="' + self.root + 'images/add.png" alt="Add"/></td>' +
                    '</tr>';
            }
        module =
            '<table id="availableTableId" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                '<thead>' +
                    '<tr>' +
                        '<th>Provider</th>' +
                        '<th>Add</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    availableProviders +
                '</tbody>' +
            '</table>';
        $('#availableDivId').html('');
        $('#availableDivId').append(module);
        $('#availableTableId').dataTable({
            "bLengthChange": false
            ,"bJQueryUI": true
            ,"sScrollY": "250px"
            ,"bScrollCollapse": true
            ,"bPaginate": false
            ,"sPaginationType": "full_numbers"
        });
        for(i in self.group) {
            var cur = self.group[i];
            $('#providerRoleSelectId' + cur.providerSta3n + '_' + cur.providerSID).change(function() {
                var id = this.id,
                    combo = id.replace('providerRoleSelectId',''),
                    sid = combo.replace(self.sidRegExp,''),
                    sta3n = combo.replace(self.sta3nRegExp,'');
                _changeProviderRole(sta3n, sid, $(this).find('option:selected').html());
            });
            $('#editId' + cur.providerSta3n + '_' + cur.providerSID).click(function() {
                var id = this.id,
                    combo = id.replace('editId',''),
                    sid = combo.replace(self.sidRegExp,''),
                    sta3n = combo.replace(self.sta3nRegExp,''),
                    pro = _getProviderFromGroup(sta3n,sid);
                $('#clinicTimePopupDivId').popup('management_workgroup_edit_clinic.html?sta3n=' + sta3n + '&sid=' + sid + '&name=' + pro.providerName);
            });
            $('#deleteId' + cur.providerSta3n + '_' + cur.providerSID).click(function() {
                var id = this.id,
                    combo = id.replace('deleteId',''),
                    sid = combo.replace(self.sidRegExp,''),
                    sta3n = combo.replace(self.sta3nRegExp,''),
                    pro = _moveProviderToAvailable(sta3n,sid);
                _deleteProviderT(pro);
            });
        }
        for(i in self.available) {
            cur = self.available[i];
            $('#addId' + cur.providerSta3n + '_' + cur.providerSID).click(function() {
                var id = this.id,
                    combo = id.replace('addId',''),
                    sid = combo.replace(self.sidRegExp,''),
                    sta3n = combo.replace(self.sta3nRegExp,''),
                    pro = _moveProviderToGroup(sta3n,sid);
                _addProviderT(pro);
            });
        }
        $('#hiddinSaveGroupTitleButtonId').button().click(function() {
            //_save();
        });
        $('#groupNameTextId').keypress(function() {
            $('#hiddinButtonDivId').show();
        });
        $('#saveButtonID').button().click(function() {
            _save();
            socket.parent.triggerClose();
        });
    }

    function _save() {
        var removeGroup = [],
            addGroup = [],
            match = false,
            a = null,
            b = null;
        
        for(i in self.startGroup) {
            a = self.startGroup[i];
            match = false;
            for(j in self.group) {
                b = self.group[j];
                if(a.providerSID==b.providerSID) {
                    match = true;
                }
            }
            if(!match) {
                removeGroup.push(a);
            }
        }
        for(i in self.group) {
            a = self.group[i];
            match = false;
            for(j in self.startGroup) {
                b = self.startGroup[j];
                if(a.providerSID==b.providerSID) {
                    match = true;
                }
            }
            if(!match) {
                addGroup.push(a);
            }
        }
        for(i in removeGroup) {
            var sta3n = removeGroup[i].providerSta3n;
            var sid = removeGroup[i].providerSID;
            _removeProvider(sta3n,sid);
        }
        for(i in addGroup) {
            var sta3n = addGroup[i].providerSta3n;
            var sid = addGroup[i].providerSID;
            var role = addGroup[i].Role;
            _addProvider(sta3n,sid,role);
        }
    }

    function _deleteProviderT(obj) {
        var oTable = $('#groupTableId').dataTable();
        var nTr = $('#deleteId' + obj.providerSta3n + '_' + obj.providerSID).closest('tr');
        var pos = oTable.fnGetPosition( nTr[0] );
        oTable.dataTable().fnDeleteRow(pos, null, true);
        $('#availableTableId').dataTable().fnAddData([
		obj.providerName,
		'<img id="addId' + obj.providerSta3n + '_' + obj.providerSID + '" class="icon-class" src="' + self.root + 'images/add.png" alt="Add"/>'
        ]);
        $('#addId' + obj.providerSta3n + '_' + obj.providerSID).click(function() {
            var id = this.id,
                combo = id.replace('addId',''),
                sid = combo.replace(self.sidRegExp,''),
                sta3n = combo.replace(self.sta3nRegExp,''),
                pro = _moveProviderToGroup(sta3n,sid);
            _addProviderT(pro);
        });
    }

    function _addProviderT(obj) {
        var oTable = $('#availableTableId').dataTable();
        var nTr = $('#addId' + obj.providerSta3n + '_' + obj.providerSID).closest('tr');
        var pos = oTable.fnGetPosition( nTr[0] );
        oTable.dataTable().fnDeleteRow(pos, null, true);
        var role = obj.Role,
            PSYCHIATRIST = '',
            PSYCHOLOGIST = '',
            SOCIALWORKER = '',
            CNS = '',
            RNP = '',
            RN = '',
            AT = '',
            RT = '',
            PSYCHTECH = '';
        if(role==='PSYCHIATRIST') {
            PSYCHIATRIST = 'selected';
        } else if(role==='PSYCHOLOGIST') {
            PSYCHOLOGIST = 'selected';
        } else if(role==='SOCIALWORKER') {
            SOCIALWORKER = 'selected';
        } else if(role==='CNS') {
            CNS = 'selected';
        } else if(role==='RNP') {
            RNP = 'selected';
        } else if(role==='RN') {
            RN = 'selected';
        } else if(role==='AT') {
            AT = 'selected';
        } else if(role==='RT') {
            RT = 'selected';
        } else if(role==='PSYCHTECH') {
            PSYCHTECH = 'selected';
        }  
        $('#groupTableId').dataTable().fnAddData([
		obj.providerName
                ,'<div>Save Group Required<div>'
                ,'<select id="providerRoleSelectId' + obj.providerSta3n + '_' + obj.providerSID + '">' +
                        '<option value="PSYCHIATRIST" ' + PSYCHIATRIST + '>PSYCHIATRIST</option>' +
                        '<option value="PSYCHOLOGIST" ' + PSYCHOLOGIST + '>PSYCHOLOGIST</option>' +
                        '<option value="SOCIALWORKER" ' + SOCIALWORKER + '>SOCIALWORKER</option>' +
                        '<option value="CNS" ' + CNS + '>CNS</option>' +
                        '<option value="RNP" ' + RNP + '>RNP</option>' +
                        '<option value="RN" ' + RN + '>RN</option>' +
                        '<option value="AT" ' + AT + '>AT</option>' +
                        '<option value="RT" ' + RT + '>RT</option>' +
                        '<option value="PSYCHTECH" ' + PSYCHTECH + '>PSYCHTECH</option>' +
                '</select></td>'
		,'<img id="deleteId' + obj.providerSta3n + '_' + obj.providerSID + '" class="icon-class" src="' + self.root + 'images/X-icon-small.png" alt="Delete"/>'
        ]);
        $('#providerRoleSelectId' + obj.providerSta3n + '_' + obj.providerSID).change(function() {
            var id = this.id,
                combo = id.replace('providerRoleSelectId',''),
                sid = combo.replace(self.sidRegExp,''),
                sta3n = combo.replace(self.sta3nRegExp,''),
                pro = _getProviderFromGroup(sta3n,sid);
            pro.Role=$(this).find('option:selected').html();
        });
        $('#deleteId' + obj.providerSta3n + '_' + obj.providerSID).click(function() {
            var id = this.id,
                combo = id.replace('deleteId',''),
                sid = combo.replace(self.sidRegExp,''),
                sta3n = combo.replace(self.sta3nRegExp,''),
                pro = _moveProviderToAvailable(sta3n,sid);
            _deleteProviderT(pro);
        });
    }

    function _findProviderObj(sta3n, sid, list) {
        for(i in list) {
            var cur = list[i];
            if(cur.providerSta3n==sta3n && cur.providerSID==sid) {
                return cur;
            }
        }
        return null;
    }

    function _moveProviderToAvailable(sta3n, sid) {
        var result = null;
        for(i in self.group) {
            var cur = self.group[i];
            if(cur.providerSta3n==sta3n && cur.providerSID==sid) {
                result = cur;
                delete self.group[i];
                var lKey = _largeKey(self.available);
                self.available[(lKey+1)] = result;
            }
        }
        return result;
    }

    function _moveProviderToGroup(sta3n, sid) {
        var result = null;
        for(i in self.available) {
            var cur = self.available[i];
            if(cur.providerSta3n==sta3n && cur.providerSID==sid) {
                result = cur;
                delete self.available[i];
                var lKey = _largeKey(self.group);
                self.group[(lKey+1)] = result;
            }
        }
        return result;
    }

    function _moveProviderObj(sta3n,sid,listA,listB) {
        var result = null;
        for(i in listA) {
            var cur = listA[i];
            if(cur.providerSta3n==sta3n && cur.providerSID==sid) {
                result = cur;
                delete listA[i];
                var lKey = _largeKey(listB);
                listB[(lKey+1)] = result;
            }
        }
        return result;
    }

    function _changeProviderRole(sta3n,sid,role) {
        if(sta3n==null||sid==null||role==null) {return;}
        $.ajax({
            type:   "post",
            url:    self.root + "WorkgroupServlet",
            data:   "option=changeProviderRole&sta3n=" + sta3n + "&sid=" + sid + "&role=" + role,
            async:  true,
            success: function(msg) {},
            error: function(xhr,ajaxOptions,thrownError) {
                alert(xhr.responseText);
            }
        });
    }

    function _getProviderFromGroup(sta3n,sid) {
        for(i in self.group) {
            var cur = self.group[i];
            if(cur.providerSta3n==sta3n && cur.providerSID==sid) {
                return cur;
            }
        }
        return null;
    }

    function _size(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }

    function _largeKey(obj) {
        var largeKey = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                key = parseInt(key);
                if(largeKey<key) {
                    largeKey = key;
                }
            }
        }
        return largeKey;
    }
};