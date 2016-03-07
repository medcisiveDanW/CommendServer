
var Socket = function() {
    var self = this;

    (function() {
        self.id = null,
        self.parent = null,
        self.children = [],
        self.newChildId = null,
        self.data = [],
        self.stack = new Array(),
        self.title = document.title,
        /* Do not remove below. */
        self.ua = $.browser,
        self.isMozilla  = self.ua.mozilla,
        self.isIE = self.ua.msie;
    })(jQuery);

    $(document).ready(function() {
        _setParent();
    });

    self.setChild = function(id) {
        self.newChildId = id;
        return self;
    };

    self.addChild = function(key, value) {
        self.children[key] = value;
        return self;
    };

    self.child = function(key) {
        return self.children[key];
    };

    self.put = function(key, value) { // set hash datastore
        self.data[key] = value;
        return self;
    };

    self.get = function(key) { // get hash datastore
        return self.data[key];
    };

    self.set = function(value) { // set single var datastore
        self.variable = value;
        return self;
    };

    self.push = function(value) { // push stack datastore
        self.stack.push(value);
        return self;
    };

    self.pop = function() { // pop stack datastore
        return self.stack.pop();
    };

    self.sayHello = function() {
        _print(self.title + ' socket says hi!');
        return self;
    };

    self.print = function(text) {
        if(text==null || text==undefined) {
            _print(self);
            return self;
        }
        _print(text);
        return self;
    };

    self.isReady = function(f) {
        $(self).bind('socket_ready',function() {
            f();
        });
        return self;
    };

    self.close = function(f) {
        $(self).bind('socket_close',function() {
            f();
        });
        return self;
    };

    self.triggerReady = function() {
        $(self).trigger('socket_ready');
        return self;
    };

    self.triggerClose = function() {
        $(self).trigger('socket_close');
        return self;
    };

    self.getParameter = function(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if(results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    return self;

    function _print(txt) {
        console.log(txt);
    }

    function _setParent() {
        if(parent.location != window.location) {
            self.parent = parent.socket;
            if(self.parent.newChildId==null) {}
            else {
                self.parent.addChild(self.parent.newChildId,self);
                self.id = self.parent.newChildId;
                self.parent.newChildId = null;
                self.parent.triggerReady();
            }
        }
    }
};

var socket = new Socket();
socket.put('width',800);
socket.put('height',600);
socket.put('buttons',{
    Close: function() {
        socket.parent.triggerClose();
    }
});

(function($) {
    $.jc2 = $.jc2 || {};
    if ( $.jc2.version ) {
        return;
    }
    $.extend( $.jc2, {
        version: "2.0.0"
    });
    $.fn.popup = function(url) {
        var self = this;
        self.id = self[0].id,
        self.frameId = 'iFrame_' + self.id,
        self.url = url;
        $(self).dialog('destroy');
        self.keypress(function(event) {
            if (event.which == '13') {
                event.preventDefault();
            }
        });
        socket.setChild(self.frameId);
        var thisDiv =
            '<div id="thisDiv' + self.frameId + '" style="overflow: hidden; width: 100%; height: 100%;">' +
                '<iframe id="' + self.frameId + '" src="' + self.url + '" width="100%" height="100%" allowtransparency="true" frameborder="0" style="border: 0px solid #ffffff;"></iframe>' +
            '</div>'
        self.html('');
        self.html(thisDiv);
        socket.isReady(function() {
            self.dialog({
                modal: true,
                autoOpen: true,
                resizable: true,
                width: socket.child(self.frameId).get('width'),
                height: socket.child(self.frameId).get('height'),
                title: socket.child(self.frameId).title,
                buttons: socket.child(self.frameId).get('buttons'),
                close: function(ev,ui) {
                    self.dialog('destroy');
                    self.html('');
                }
            });
        });
        socket.close(function() {
            self.dialog("close");
        });
    };
})(jQuery);