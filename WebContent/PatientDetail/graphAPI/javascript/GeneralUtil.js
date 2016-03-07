var GeneralUtil = function(testDiv) {
  var self = this;

    (function() {
        self.testDiv = '#' + testDiv,
        self.font = '12px "Calibri"';
    })(jQuery);
    self.getStringWidth = function(str)
    {
        var jDiv = $(self.testDiv);
        jDiv.css('font', self.font);
        jDiv.html(str);
        var length = jDiv.width();
        return length;
    };
    self.getStringHeight = function(str) {
        var jDiv = $(self.testDiv);
        jDiv.css('font', self.font);
        jDiv.html(str);
        var height = jDiv.outerHeight();
        return height;
    };
    self.toCamel = function(str) { // only dose one word at a time
        var first = true,
            retStr = '',
            length = str.length;
        for(var i = 0; i < length; i++) {
            if(first) {
                retStr += str.charAt(i).toUpperCase();
                first = false;
            }
            else if(str.charAt(i)=='/') { // this is for multi drug i.e. Acetaminophen/Codeine
                first = true;
                retStr += str.charAt(i).toLowerCase();
            }
            else { retStr += str.charAt(i).toLowerCase(); }
        }
        return retStr;
    };
    self.getDateSpan = function(data) {
        var startDate = 1000000000000000000;
        var endDate = 0;
        for(var i in data) {
            var cur = data[i].data;
            var size = sizeOf(cur);
            if(size>0) {
                var first = cur[0];
                var last = cur[size];
                if(first[0]<startDate)
                { startDate = first[0]; }
                if(last[0]>endDate)
                { endDate = last[0]; }
            }
        }
        return { start: startDate, end: endDate };
    };
    self.getScoreSpan = function(data) {
        var highScore = 0;
        var lowScore = 100000000000000;
        for(var i in data) {
            var dataset = data[i].data;
            var size = sizeOf(dataset);
            for(var j in dataset) {
                var elem = dataset[j];
                if(elem[1]>highScore) { highScore = elem[1]; }
                if(elem[1]<lowScore) { lowScore = elem[1]; }
            }
        }
        if(highScore > 1000) { highScore = 0; }
        if(lowScore > 1000) { lowScore = 0; }
        return { start: lowScore, end: highScore };
    };
    self.getGreaterSpan = function(data1, data2) {
        var startDate;
        var endDate;
        if(data1.start>data2.start) { startDate = data2.start; }
        else { startDate = data1.start; }
        if(data1.end<data2.end) { endDate = data2.end; }
        else { endDate = data1.end; }
        return { start: startDate, end: endDate };
    };
    self.sizeOf = function(dataset) {
        var index = 0;
        for(var i in dataset)
        { if(i>index) { index=i; } }
        return index;
    };
    return self;
};