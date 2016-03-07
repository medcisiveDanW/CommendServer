var Workgroup = function(targetDiv) {
    var self = this;

    (function() {
        self.target = $('#' + targetDiv),
        self.groups = null,
        self.defaultGroup = null,
        self.root = '../';
    })(jQuery);

    self.setup = function() {
        var wrapperHtml =
            '<div id="workgroupWrapperId" style="width:100%;height: 500px;"></div>'
            + '<div id="newGroupPopupDivId" style="display: none;">What would you like to call this new workgroup?<br><input id="newWorkgroupNameInputId" type="text"/></div>'
            + '<div id="groupPopupDivId" style="display: none;"></div>';
        self.target.html('');
        self.target.append(wrapperHtml);
        self.wrapper = $('#workgroupWrapperId');
        
        $("#newGroupPopupDivId").dialog({
            modal: true,
            autoOpen: false,
            resizable: false,
            title: "Creating New Workgroup",
            buttons: {
                Save: function() {
                    var wgName = $('#newWorkgroupNameInputId').val();
                    var wgId = _addGroup(wgName);
                    $(this).dialog("close");
                    if(wgName!='' && wgId>-1) {
                        $().loading(true,self.root);
                        $('#popupDivId').popup('management_workgroup_edit.html?wgId=' + wgId + '&wgName=' + wgName);
                    } else {
                        alert('There has been an error in creating the new workgroup.');
                    }
                },
                Close: function() {
                    $(this).dialog("close");
                }
            }
        });
        _load();
        socket.close(function() {
            _load();
        });
    };

    return self;

    function _loadGroups() {
        var result = null;
        $.ajax({
            type:   "post",
            url:    self.root + "WorkgroupServlet",
            data:   "option=getGroups",
            async:  false,
            success: function(msg) {
                result = msg._table;
            }
        });
        return result;
    }

    function _getDefaultGroup() {
        var result = null;
        for(var i in self.groups) {
            var temp = self.groups[i];
            if(temp.isDefaultWg=='Y') {
                result = temp;
                break;
            }
        }
        return result;
    }

    function _generateProviderList(wgId) {
        var result = [],
            g = null,
            cur = null;
        if(self.groups!=null) {
            for(i in self.groups) {
                cur = self.groups[i];
                if(cur.wgID==wgId) {
                    g = cur;
                    break;
                }
            }
        }
        if(g!=null) {
            for(i in g.providers) {
                cur = g.providers[i];
                result.push(cur);
            }
        }
        return result;
    }

    function _load() {
        self.groups = _loadGroups(),
        self.defaultGroup = _getDefaultGroup();
        var groupTable =
            '<table id="workGroupTableId" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                '<thead>' +
                    '<tr>' +
                        '<th>Workgroup</th>' +
                        '<th>Default</th>' +
                        '<th>Edit</th>' +
                        '<th>Delete</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>';
            for(i in self.groups) {
                var obj = self.groups[i];
                var defaultGroup = '';
                if(obj.isDefaultWg=='Y') {
                    defaultGroup='checked'
                }
                groupTable +=
                    '<tr id="' + obj.wgID + 'wgId" class="gradeC">' +
                        '<td>' + obj.wgName + '</td>' +
                        '<td class="center"><input class="defaultWorkGroupRadioGroupClass" type="radio" name="defaultWorkGroupRadioGroup" value="' + obj.wgID + '" ' + defaultGroup + '></td>' +
                        '<td class="center"><img id="' + obj.wgID + 'EditImgId" class="edit" style="width: 20px; height: 20px;" src="' + self.root + 'images/edit.png" alt="Edit"/></td>' +
                        '<td class="center"><img id="' + obj.wgID + 'DeleteImgId" class="delete" style="width: 20px; height: 20px;" src="' + self.root + 'images/X-icon-small.png" alt="Delete"/></td>' +
                    '</tr>';
            }
            groupTable +=
                '</tbody>' +
            '</table>';
        var module =
            '<div style="float:left;width:100%;height:35px">' +
                '<button id="newGroupButtonID">New Workgroup</button>' +
            '</div>' +
            '<div style="float:left;width:100%;">' +
                '<table style="width: 100%;">' +
                    '<tr>' +
                        '<td>' +
                            '<div style="width: 70%; float: left;>' +
                                '<div style="margin-right: 10px;">' +
                                    '<div style="background-color: lightgray;">' +
                                        groupTable +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div style="width: 30%; float: left;">' +
                                '<div id="providerListDivId" style="margin-left: 10px;"></div>' +
                            '</div>' +
                        '</td>' +
                    '</tr>' +
                '</table>' +
            '</div>';
        self.wrapper.html('');
        self.wrapper.append(module);
        $('#newGroupButtonID').button().click(function() {
            $('#newWorkgroupNameInputId').val('');
            $("#newGroupPopupDivId").dialog('open');
        });
        $('#workGroupTableId').dataTable({
            "bLengthChange": false
            ,"bJQueryUI": true
            ,"sScrollY": "300px"
            ,"bScrollCollapse": true
            ,"bPaginate": false
            ,"sPaginationType": "full_numbers"
        });
        _updateProviderListTable(self.defaultGroup);
        for(i in self.groups) {
            obj = self.groups[i];
            $('#' + obj.wgID + 'wgId').click(function() {
                var wgId = this.id.replace('wgId',''),
                    obj = _getObjByWgId(wgId,self.groups);
                _updateProviderListTable(obj);
            });
            $('#' + obj.wgID + 'EditImgId').click(function() {
                var wgId = this.id.replace('EditImgId',''),
                    obj = _getObjByWgId(wgId,self.groups);
                $('#popupDivId').popup('management_workgroup_edit.html?wgId=' + obj.wgID + '&wgName=' + obj.wgName);
            });
            $('#' + obj.wgID + 'DeleteImgId').click(function() {
                var wgId = this.id.replace('DeleteImgId','');
                _removeGroup(wgId);
                _load();
            });
        }
        $('.defaultWorkGroupRadioGroupClass').click(function() {
            _setDefaultGroup($('input[name=defaultWorkGroupRadioGroup]:checked').val());
        });
    }

    function _addGroup(wgName) {
        var result = null;
        if(wgName==null) {return result;}
        $.ajax({
            type:   "post",
            url:    self.root + "WorkgroupServlet",
            data:   "option=addGroup&wgName=" + wgName,
            async:  false,
            success: function(msg) {
                result = msg;
            }
        });
        return result;
    }

    function _removeGroup(wgId) {
        if(wgId==null) {return;}
        $("#workgroupSelectId option[value='" + wgId + "']").each(function(){
            $(this).remove();
        });
        $.ajax({
            type:   "post",
            url:    self.root + "WorkgroupServlet",
            data:   "option=removeGroup&wgId=" + wgId,
            async:  false,
            success: function(msg) {}
        });
    }

    function _setDefaultGroup(wgId) {
        if(wgId==null) {return;}
        $.ajax({
            type:   "post",
            url:    self.root + "WorkgroupServlet",
            data:   "option=setDefaultGroup&wgId=" + wgId,
            async:  false,
            success: function(msg) {}
        });
    }

    function _getObjByWgId(wgId,list) {
        for(i in list) {
            var cur = list[i];
            if(cur.wgID==wgId) {
                return cur;
            }
        }
        return null;
    }

    function _getObjBySID(sid, list) {
        for(i in list) {
            var cur = list[i];
            if(cur.providerSID==sid) {
                return cur;
            }
        }
        return null;
    }

    function _updateProviderListTable(group) {
        if(group!=null) {
            var list = _generateProviderList(group.wgID);
            var providerListTable =
                '<table id="providerListTableId" cellpadding="0" cellspacing="0" border="0" class="display" width="100%">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>' + group.wgName + ' Providers</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>';
                for(i in list) {
                    var obj = list[i];
                    providerListTable +=
                        '<tr class="gradeC">' +
                            '<td>' + obj.providerName + '</td>' +
                        '</tr>';
                }
                providerListTable +=
                    '</tbody>' +
                '</table>';
            $('#providerListDivId').html('');
            $('#providerListDivId').append(providerListTable);
            $('#providerListTableId').dataTable({
                "bLengthChange": false
                ,"bJQueryUI": true
                ,"bFilter": false
            });
        }
        parent.update();
    }
};