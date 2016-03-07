var SwitchAliasTemp = function() {
    var self = this;

    (function() {
        self.data = null;
        _init();
    })(jQuery);

    return self;

    function _init() {
        self.data = _load();
        $('#providerNameId').html(self.data.name);
        var providers = self.data.providers,
            options = '',
            keys = [];
        for(name in providers) { // cant sort hash so have to make an array to sort.
            keys.push(name);
        }
        keys.sort(_sortByName);
        for(id in keys) {
            var name = keys[id];
            var duz = providers[name];
            var selected = '';
            if(name==self.data.name) {
                selected = 'selected';
            }
            options += '<option value="' + duz + '" ' + selected + '>'+name+'</option>';
        }
        $('#selectProviderId').html(options);
        $('#selectProviderId').change(function() {
            var duz = $("#selectProviderId").val(),
            name = $("#selectProviderId option:selected").text();
            _updateAlias(name,duz);
            $('#refreshPageId').submit();
        });
        return self;
    }

    function _load() {
        var result = null;
        $.ajax({
            type:   "post",
            url:    "PTSDManagerServlet",
            data:   "option=data",
            async:  false,
            success: function(msg) {
                result = msg;
            }
        });
        return result;
    }

    function _updateAlias(name,duz) {
        $.ajax({
            type:   "post",
            url:    "PTSDManagerServlet",
            data:   "option=alias&aliasDUZ=" + duz + "&aliasName=" + name,
            async:  false,
            success: function(msg) {
            }
        });
    }

    function _sortByName(a,b) {
        var nameA=a.toLowerCase(), nameB=b.toLowerCase()
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }
};

