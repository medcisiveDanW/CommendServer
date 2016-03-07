var MedUtil = function(graphAPI) {
  var self = this;

    (function() {
        self.graphAPI = graphAPI;
        self.dataset = self.graphAPI.dataset;
        self.plot = self.graphAPI.plot;
        self.offset = self.plot.getPlotOffset();
        self.ctx = self.plot.getCanvas().getContext("2d");
        self.globalCompositeOperation = self.ctx.globalCompositeOperation;
        self.width = self.plot.width()+self.plot.offset().left; // Note: geting style width may return % which will not work for mesurments.
        self.height = removePX(self.graphAPI.eGraphDiv.style.height);
        self.left = self.plot.offset().left/2; // this one is good
        self.top = (self.height - self.plot.offset().top)/2; // this is not correct, fix in future
        self.right = self.width - self.left;// this one is good
        self.bottem = self.height + self.top; // this is not correct
        self.gfx = new GFXUtil(self);
        self.alpha = 1.0;
        self.boxHeight = 20;
        self.gapSize = 8;
        //alert(self.width + " : " + $(self.graphAPI.canvasElementName).width());
        /*
        self.width = $(self.graphAPI.canvasElementGraph).width(); // Note: geting style width may return % which will not work for mesurments.
        self.height = $(self.graphAPI.canvasElementGraph).height();//removePX(self.graphAPI.eGraphDiv.style.height);
        self.plotWidth = self.plot.width();
        self.plotHeight = self.plot.height();
        self.left = self.offset.left;//self.plot.offset().left/2; // this one is good
        self.top = self.offset.top;//(self.height - self.plot.offset().top)/2; // this is not correct, fix in future
        self.right = self.offset.right;
        self.bottom = self.offset.bottom;
        self.startPos = 50;
        self.gapSize = 20;
        self.boxHeight = 20;
        self.gfx = new GFXUtil(self);
        self.alpha = 1.0;
        self.textData = [];
         */
    })();

    self.draw = function() {
        var curData = self.graphAPI.displayData;
        var numbOfBoxs = sizeOf(curData);
        var displacement = self.gapSize + self.boxHeight;//( (self.height) - numbOfBoxs*self.boxHeight) / (numbOfBoxs+1);
        //alert("Numb of Boxes: " + numbOfBoxs + " totBoxHeight: " + numbOfBoxs*self.boxHeight + " totHeight: " + self.height + " Disp: " + displacement);
        var counter = 0;
        for(var i in curData) {
            var data = curData[i];
            var y = displacement*counter + 15;
            var medName = data.label;
            var medColor = getDataColor(medName);
            data = data.data;

            for(var j in data) {
                var dataPoints = data[j];
                var first = dataPoints[0];
                var second = dataPoints[1];
                var strength = dataPoints[2];
                var o1 = self.plot.pointOffset({x: first, y: 1});
                var o2 = self.plot.pointOffset({x: second, y: 1});
                if(strength!=undefined) {
                    self.gfx.drawBox(strength, medColor, o1.left, y, o2.left, y + self.boxHeight);
                } else {
                    self.gfx.drawBox(strength, medColor, o1.left, y, o1.left+12, y + self.boxHeight);
                }
            }
            counter++;
        }
    }

    return self;

    function getDataColor(label) {
        var series = self.plot.getData();
        for (var s = 0; s < series.length; ++s) {
            if(series[s].label==label) {
                return series[s].color;
            }
        }
        return null;
    }
    function removePX(str) {
        str = str.split('p');
        return parseInt(str[0]);
    }
    function sizeOf(array) {
        var index = 0;
        for(var i in array)
        {index++;}
        return index;
    }
};