var Utility = function() {
    var self = this;

    (function() {
        if(!window.console) {
            window.console =
                {
                    log: function() {},
                    info: function() {},
                    time: function() {}
                };
        }
        self.ua = $.browser,
        self.isMozilla  = self.ua.mozilla,
        self.isIE = self.ua.msie,
        self.console = window.console;
        if(!self.isIE) { self.isIE = false; }
    })(jQuery);

    self.print = function(str) {
        self.console.log(str);
        return self;
    }

    self.props = function(obj) {
        if(typeof obj!=='object') { alert(obj); }
        else { _dumpProps(obj); }
        return self;
    }

    self.toJSON = function(str) {
        return _parse(str);
    }

    return self;

    function _parse(str) { // convert JSON stirngs to Objects
        if (str === "") str = '""';
        eval("var p=" + str + ";");
        return p;
    };

    function _print(obj) { // Cross platform debuging tool
        if(self.isIE) {
            if(typeof obj!=='object') {
                alert(obj);
            } else {
                _dumpProps(obj);
            }
        }
        else {
            self.console.log(obj);
        }
        return self;
    }

    function _dumpProps(obj, parent) { // for IE debuging
        for (var i in obj) {
            if (parent) {
                var msg = parent + "." + i + "\n" + obj[i];
            } else {
                var msg = i + "\n" + obj[i];
            }
            if (!confirm(msg)) {
                return;
            }
            if (typeof obj[i] == "object") {
                if (parent) {
                    _dumpProps(obj[i], parent + "." + i);
                } else {
                    _dumpProps(obj[i], i);
                }
            }
        }
    }
};