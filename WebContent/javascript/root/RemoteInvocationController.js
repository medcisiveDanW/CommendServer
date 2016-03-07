/*
 * RemoteInvocationController is a JavaScript implementation of an RPC.
 */

var RemoteInvocationController = function() {
    var self = this;

    (function() {})(jQuery);

    self.log = function(event,eventId) {
        $.ajax({
            type:   "post",
            url:    "AdministrationServlet",
            data:   'option=log&event=' + event + '&eventId=' + eventId,
            async:  false,
            success: function(msg) {}
        });
        return self;
    }

    return self;
};