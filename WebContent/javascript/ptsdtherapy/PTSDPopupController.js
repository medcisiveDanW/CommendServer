var PTSDPopupController = function(data) {
    var self = this;

    (function() {
        self.data = data,
        self.title = 'Patient Information for ' + data['name'],
        self.width = 700,
        self.height = 570,
        self.id = data['ien'],
        self.url = 'encounterTable.jsp?id=' + self.id,
        self.openButtonId = self.id+'NameId',
        self.target = null,
        self.obj = null,
        self.graph = null,
        self.isInitialized = false,
        self.utility = new Utility();
    })(jQuery);

    self.load = function() {
        if(self.isInitialized==false) {
            self.isInitialized = true;
            _init();
        }
        setTimeout(function() {
            $('.processingOverlay').hide();
        }, 100);
    };

    return self;

    function _init() {
        self.target = $('#encounterGraph' + self.id);
        var graphWidth = '85',
            nameColor = '#000';
        if(self.utility.isIE) {
            graphWidth = '82';
        }
        if(self.data["2"]!=null) {
            nameColor = '#060';
        }
        if((self.data["1"]!=null) && (self.data["2"]==null)) {
            nameColor = '#F30';
        }
        var thisDiv =
            '<div id="popup' + self.id + '" style="width:100%;height:50px">'
                + '<div id="popup' + self.id + 'NameId" style="float:left;width:15%;height:40px;font-family:Arial;font-size:0.85em;padding-top:10px; color: ' + nameColor + ';font-weight:bold;">' + self.data["name"] + '</div>'
                + '<div id="popupgraphDiv' + self.id + 'ID" style="float:left;width:' + graphWidth + '%;height:60px;"></div>'
            + '</div>';
        self.target.append(thisDiv);
        self.graph = new PTSDGraph('popupgraphDiv' + self.id + 'ID', self.data);
        self.graph.enablePan();
        if(self.data["2"]!=null) {
            self.graph.options.grid.backgroundColor.colors = ["#AF8", "#FFF"];
            self.graph.refresh();
        }
        if((self.data["1"]!=null) && (self.data["2"]==null)) {
            self.graph.options.grid.backgroundColor.colors = ["#F90", "#FFF"];
            self.graph.refresh();
        }
        $('#encounterTable' + self.id).dataTable({
            "bLengthChange": false
            ,"bJQueryUI": true
            ,"sScrollY": "300px"
            ,"bPaginate": false
            ,"sPaginationType": "full_numbers"
        });
    }
};

