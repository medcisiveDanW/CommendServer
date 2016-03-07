var Reports = function() {
    var self = this;

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
    self.root = '../',
    self.groups = null,
    self.ownerName = socket.getParameter('name');
    
    self.setup = function() {
        $(".myMenu").buildMenu({
            menuWidth: 200,
            openOnRight: false,
            menuSelector: ".menuContainer",
            iconPath: "../javascript/root/jquery.mb.menu-2.9.6/ico/",
            hasImages: true,
            fadeInTime: 100,
            fadeOutTime: 300,
            adjustLeft: 2,
            minZindex: "auto",
            adjustTop: 10,
            opacity: .95,
            shadow: false,
            shadowColor: "#ccc",
            hoverIntent: 0,
            openOnClick: true,
            closeOnMouseOut: true,
            closeAfter: 1000,
            submenuHoverIntent: 200
        });
        loadPage('performance_productivity.html','Productivity');
        $('#providerNameId').html(self.ownerName);
    };

    self.asdf = function(str) {
        if(str===undefined) { str = 'bob'; }
        return _asdf(str);
    };

    return self;

    function _asdf(str) {
        return str;
    }
};

function loadPage(url,header) {
    $().loading(true,'../');
    $('#headerDivId').html(header);
    document.getElementById('reportsIframeId').src = url;
};

function update(){
    var iFrameHeight = document.getElementById('reportsIframeId').contentWindow.document.body.scrollHeight + 10,
        minHeight = 500;
    if(iFrameHeight<minHeight) {
        iFrameHeight = minHeight;
    }
    $('#reportsIframeId').height(iFrameHeight);
    $().loading(false);
};