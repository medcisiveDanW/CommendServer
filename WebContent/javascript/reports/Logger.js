var Logger = function() {
    var self = this;

    self.log = function(event,eventId) {
        $.ajax({
            type:   "post",
            url:    "ReportsServlet",
            data:   'option=log&event=' + event + '&eventId=' + eventId,
            async:  false,
            success: function(msg) {}
        });
        return self;
    };

    return self;
};