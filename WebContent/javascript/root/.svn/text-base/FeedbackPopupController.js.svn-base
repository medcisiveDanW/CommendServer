var FeedbackPopupController = function(relativeLocation, ajax) {
    var self = this;

    (function() {
        self.title = 'Feedback',
        self.width = 600,
        self.height = 395,
        self.url = relativeLocation + '/feedback.jsp',
        self.openButtonId = 'feedbackButtonId',
        self.isInitialized = false,
        self.ajax = ajax,
        self.bugText = 
'So you have found a bug that needs to be fixed.  Below is a list of items that will help the developers of COMMEND solve this problem more efficiently.\n\
    1)  Where in COMMEND were you when the issue was encountered?\r\n\
        Examples:\r\n\
            I was in the Symptom Function Scales popup.\r\n\
            It happened while I was entering text into the note text area “Education”.\r\n\
    2)  How would you explain the issue?\r\n\
        Examples:\r\n\
            I was trying to type text into the field but only ‘A’s where showing up. “AAAAAAAA”\r\n\
            When I clicked the button nothing happened.\r\n\
    3)  Can you reproduce problem and if so what are the steps needed to replicate the issue?\r\n\
        Example:\r\n\
        1.	 Open the patient details page.\r\n\
        2.	Open the note tab at the bottom of the page.\r\n\
        3.	Click save note.\r\n\
',
        self.likedText = 
'Tell us what you LIKED about COMMEND.',
        self.dislikedText = 
'Tell us what you DISLIKED about the COMMEND system.  Please elaborate enough for us to fully understand your concerns so we may improve the system in future iterations.',
        self.wishlistText =
'So COMMEND is currently operating as expected but something is missing that you would really like to see in COMMEND?  Please let us know what would be on your wish list of new functionality.';
    })(jQuery);

    self.load = function() {
        if(!self.isInitialized) {
            $('#feedbackTextareaId').ForceNewline();
            self.isInitialized = true;
            $('#feedbackSelectId').change(function() {
                var type = $('#feedbackSelectId').val();
                if(type=='Bug') {
                    $('#feedbackTextareaId').val(self.bugText);
                }
                else if(type=='Liked') {
                    $('#feedbackTextareaId').val(self.likedText);
                }
                else if(type=='Disliked') {
                    $('#feedbackTextareaId').val(self.dislikedText);
                }
                else if(type=='Wish List') {
                    $('#feedbackTextareaId').val(self.wishlistText);
                }
                else {
                    $('#feedbackTextareaId').val(self.bugText);
                }
            });
        }
        loadText();
    };
    self.save = function() {
        return saveFeedback();
    };

    return self;

    function loadText() {
        var type = $('#feedbackSelectId').val();
        if(type=='Bug') {
            $('#feedbackTextareaId').val( "" + self.bugText);
        }
        else if(type=='Liked') {
            $('#feedbackTextareaId').val(self.likedText);
        }
        else if(type=='Disliked') {
            $('#feedbackTextareaId').val(self.dislikedText);
        }
        else if(type=='Wish List') {
            $('#feedbackTextareaId').val(self.wishlistText);
        }
        else {
            $('#feedbackTextareaId').val(self.bugText);
        }
    }

    function saveFeedback() {
        var type = $('#feedbackSelectId').val();
        var textarea = $('#feedbackTextareaId').val();
        var url = relativeLocation+'/updateLogFeedback.jsp';
        ajax.logFeedback(url,textarea, type);
        alert('Thank you for your feedback.');
        return true;
    }
};