var AjaxManager = function(SSN,DUZ,computerName) {
    var self = this;
    (function() {
        self.SSN = SSN;
        self.DUZ = DUZ;
        self.computerNmae = computerName;
        $(this).bind("ajaxError", function() {
            alert('There has been an internal AJAX error. \nThe COMMEND staff has been notified of this occurrence.');
        });
    })(jQuery);

    self.saveCustomGoal = function(custom) {
        $.ajax({
            type:   "post",
            url:    "../saveUpdateCustomGoal.jsp",
            data:   custom.ajaxHash(),
            async: false,
            success: function(msg) {
                msg = msg.replace(/^\s+|\s+$/g, '') ;
                custom.id = parseInt(msg);
            }
        });
    }
    self.logEvent = function(event,eventId) {
        $.ajax({
            type:   "post",
            url:    "updateLogEvent.jsp",
            data:   'event=' + event + '&eventId=' + eventId,
            async: false,
            success: function(msg) {
                msg = msg.replace(/^\s+|\s+$/g, '') ;
            }
        });
    };
    self.logPDEvent = function(event,eventId) {
        $.ajax({
            type:   "post",
            url:    "../updateLogEvent.jsp",
            data:   'event=' + event + '&eventId=' + eventId,
            async: false,
            success: function(msg) {
                msg = msg.replace(/^\s+|\s+$/g, '') ;
            },
            error: function(xhr, textStatus, errorThrown) {
                self.logEvent(event,eventId);
            }
        });
    };
    self.logGraphEvent = function(event,eventId) {
        $.ajax({
            type:   "post",
            url:    "../../updateLogEvent.jsp",
            data:   'event=' + event + '&eventId=' + eventId,
            async: false,
            success: function(msg) {
                msg = msg.replace(/^\s+|\s+$/g, '') ;
            }
        });
    };
    self.logFeedback = function(url, text, type) {
        $.ajax({
            type:   "post",
            url:    url,
            data:   'SSN=' + self.SSN + '&DUZ=' + self.DUZ + '&text=' + text + '&type=' + type,
            async: false,
            success: function(msg) {
                msg = msg.replace(/^\s+|\s+$/g, '') ;
            }
        });
    };
    return self;
};