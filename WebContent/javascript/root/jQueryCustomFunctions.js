(function($) {

$.jc = $.jc || {};
if ( $.jc.version ) {
	return;
}

$.extend( $.jc, {
	version: "1.0.0"
});

$.fn.preventDoubleSubmit = function() {
    jQuery(this).submit(function() {
        if (this.beenSubmitted) {
            return false;
        }
        else {
            this.beenSubmitted = true;
            return true;
        }
    });
};

$.fn.preventAjaxDoubleClick = function(f) {
    var beenClicked = false;
    if(f==undefined) { f = function() {}; }
    jQuery(this).click(function(e) {
        if (beenClicked) {}
        else {
            beenClicked = f();
        }
    }).bind("ajaxComplete", function() {
        beenClicked = false;
    });
};

$.fn.ForceNumericOnly = function() {
    return this.each(function() {
        $(this).keydown(function(e) {
            if(e.shiftKey) {
                e.preventDefault();
            }
            var key = e.charCode || e.keyCode || 0;
            return (
                key == 8 ||
                key == 9 ||
                key == 46 ||
                (key >= 37 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));

        });
    });
};

$.fn.ForceAlphabeticOnly = function() {
    return this.each(function() {
        $(this).keydown(function(e) {
            var key = e.charCode || e.keyCode || 0;
            return (
                key == 8 ||
                key == 9 ||
                key == 32 ||
                key == 46 ||
                (key >= 56 && key <= 90) ||
                (key >= 37 && key <= 40));
        });
    });
};

$.fn.ForceNewline = function() {
    return this.each(function() {
        $(this).keydown(function(e) {
            var key = e.charCode || e.keyCode || 0;
            if(key==13) {$(this).val($(this).val() + '\n');}
            return key;
        });
    });
};

$.fn.dynamicDialog = function(controller) {
    var self = this,
        title = null,
        width = null,
        height = null,
        url = null,
        html = null,
        openButtonId = null,
        isOpen = false,
        isLoaded = false;
    if(controller==undefined) { controller = function() {}; }
    if(controller.title==undefined) {title = 'No Title Found';}
    else {title = controller.title;}
    if(controller.width==undefined) {width = 'auto';}
    else {width = controller.width;}
    if(controller.height==undefined) {height = 'auto';}
    else {height = controller.height;}
    if(controller.url==undefined) {url = undefined;}
    else {url = controller.url;}
    if(controller.html==undefined) {html = undefined;}
    else {html = controller.html;}
    if(controller.openButtonId==undefined) {
        title += ' - No Open Button Assigned';
        openButtonId = undefined;
        isOpen = true;
    }
    else { openButtonId = controller.openButtonId; }
    self.keypress(function(event) {
        if (event.which == '13') {
            event.preventDefault();
        }
    });

    function loadPopup() {
        if(!isLoaded) {
            isLoaded = true;
            if(url==undefined && html==undefined){
                var errorHTML = '<h1>Error loading URL</h1>';
                self.html(errorHTML);
                isOpen = true;
            }
            else if(url!=undefined){
                $.ajax({
                    url: url,
                    async: false,
                    success: function(data) {
                        self.html(data);
                    }
                });
            }
            else if(html!=undefined) {
                self.html(html);
            }
        }
    }

    function ifSave() {
        if(controller.save!=undefined){
            return {
                Enter: function() {
                    if(controller.save()) {
                        self.dialog("close");
                    }
                },
                Cancel: function() {
                    self.dialog("close");
                }
            };
        }
        else {
            return {
                Cancel: function() {
                    self.dialog("close");
                }
            };
        }
    }
    self.dialog({
        width: width,
        height: height,
        modal: true,
        autoOpen: isOpen,
        resizable: false,
        title: title,
        open: function() { loadPopup(); controller.load(); },
        buttons: ifSave()
    });
    if(openButtonId!=undefined) {
        $('#'+openButtonId).click(function(){
            self.dialog("open");
        });
    }
};

$.fn.tooltip = function(tip) {
    return this.hover(function() {
        $(this).mousemove(function(e) {
            var width = $(document).width();
            var diff = width - e.pageX;

            if(diff<200) {//alert(diff);
                $("#customTooltipId").remove();
                $('<div id="customTooltipId">' + tip + '</div>').css( {
                    position: 'absolute',
                    display: 'none',
                    top: e.pageY-10,
                    left: e.pageX-200,
                    width: 190,
                    border: '1px solid #000',
                    'background-color': '#ffe',
                    'zIndex': '2'
                }).appendTo("body").show();
            } else {
                $("#customTooltipId").remove();
                $('<div id="customTooltipId">' + tip + '</div>').css( {
                    position: 'absolute',
                    display: 'none',
                    top: e.pageY-10,
                    left: e.pageX+20,
                    border: '1px solid #000',
                    'background-color': '#ffe',
                    'zIndex': '2'
                }).appendTo("body").show();
            }
        });
    }, function() {
        $("#customTooltipId").remove();
    });
};

$.fn.loading = function(IsLoading,rootPath) {
    var divId = 'loadingDivId',
        updateIndex = 0,
        timeoutPtr = null;
    if(rootPath===undefined){
        rootPath = './';
    }
    
    function updateMessage() {
        var message = '<h1>Processing .';
        for(var i = 0; i < updateIndex; i++) {
            message += ' .';
        }
        message += '</h1>';
        $('#' + divId + 'Message').html(message);
        updateIndex++;
        if(updateIndex>3){
            updateIndex = 0;
        }
    }

    if(IsLoading){
        $('<div id="' + divId + 'Background"></div>').css( {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            'zIndex': '10',
            'background-color':'#000',
            'opacity':0.4,
            'filter':'alpha(opacity=40)'
        }).appendTo("body").show();
        
        $('<div id="' + divId + '"><div style="float:left;"><img src="' + rootPath + 'images/loading.gif" width="32" height="32"></div><div id="' + divId + 'Message" style="float:left;padding-left:20px;"><h1>Processing . . .</h1></div></div>').css( {
            position: 'absolute',
            top: 50,
            left: 50,
            width: 400,
            height: 45,
            padding: 10,
            'zIndex': '11',
            border: '2px solid black',
            'background-color':'rgb(255,255,255)'
        }).appendTo("body").show();
        timeoutPtr = setInterval(function(){updateMessage();},1000);
    } else {
        clearTimeout(timeoutPtr);
        $('#' + divId).remove();
        $('#' + divId + 'Background').remove();
    }
};

})(jQuery);