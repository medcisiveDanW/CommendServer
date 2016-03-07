var GFXUtil = function(medUtil) {
  var self = this;

    (function() {
        self.medUtil = medUtil;
        self.ctx = medUtil.ctx;
        self.img = new Image();
        self.img.src = 'images/ui-bg_glass_40_246075_1x400.png';
        self.alpha = 1.0;
        self.defaultFont = medUtil.ctx.font;
        self.defaultFill = medUtil.ctx.fillStyle;
        self.defaultStroke=medUtil.ctx.strokeStyle;
        self.font = '12px "Calibri"';//'20px "Segoe UI" bold';//"20px bold Calibri"; // NOTE!!!! font pixel height must be first!!!!
        self.fillStyle = '#449';
        self.strokeStyle = '#666';
    })();

    self.drawBox = function(lable, color, x1,y1,x2,y2)
    {
        var draw = true;
        self.fillStyle = color;
        self.strokeStyle = '000';
        if(self.medUtil.left > x1) { x1 = self.medUtil.left; }
        if(self.medUtil.left > x2) { draw = false; }
        if(self.medUtil.right < x2) { x2 = self.medUtil.right; }
        if(self.medUtil.right < x1) { draw = false; }
        if(draw)
        {
            //var compo = self.ctx.globalCompositeOperation;
            //self.ctx.globalCompositeOperation = 'source-over';
            self.drawRec(color,x1,y1,x2,y2,0.7);
            startFont();
            var stringWidth = getStringWidth(lable);
            stopFont();
            var mid = x1 + (x2-x1)/2;
            var left = mid - stringWidth/2;
            var right = mid + stringWidth/2;
            if(self.medUtil.left > left)
            { }//self.Text(lable, color, x1+stringWidth, y1, x2, y2); }
            else if(self.medUtil.right < right)
            { }//self.Text(lable, color, x1-stringWidth,y1, x2, y2); }
            else
            { self.Text(lable, color, x1,y1, x2, y2); }
            
            //self.ctx.globalCompositeOperation = compo;
        }
    }
    self.drawRec = function(color, x1, y1, x2, y2, alpha)
    {
        self.ctx.save();
        self.ctx.globalAlpha = alpha;
        self.ctx.fillStyle = color;
        self.ctx.fillRect(x1,y1,(x2-x1),(y2-y1));
        self.ctx.globalAlpha = self.alpha;
        self.ctx.restore();
    }
    self.gfxImage = function(x,y,w,h,r,alpha) {
        var ie = $.browser.msie;
        if(ie==true) {
            self.gfxImageIE(x,y,w,h,r);
        }
        else {
            self.gfxImageNonIE(x,y,w,h,r,alpha);
        }
    }
    self.gfxImageNonIE = function(x,y,w,h,r,alpha)
    {
        img = new Image();
        img.onload = function()
        {
            self.ctx.save();
                self.ctx.globalAlpha = alpha;
                self.ctx.translate(x, y);
                self.ctx.rotate(r * Math.PI / 180);
                self.ctx.drawImage(self.img,0,0,w,h);
                self.ctx.globalAlpha = self.alpha;
            self.ctx.restore();
        };
        img.src = self.img.src;
    };
    self.gfxImageIE = function(x,y,w,h,r)
    {
        img = new Image();
        img.src = self.img.src;
            self.ctx.save();
                self.ctx.translate(x, y);
                self.ctx.rotate(r * Math.PI / 180);
                self.ctx.drawImage(self.img,0,0,w,h);
            self.ctx.restore();
        img.src = self.img.src;
    };
    /*
    self.gfxImage = function(x,y,w,h,r)
    {
        img = new Image();
        img.onload = function()
        {
            self.ctx.save();
            self.ctx.translate(x, self.ctx.height-y);
            self.ctx.rotate(r * Math.PI / 180);
            self.ctx.drawImage(self.img,-w/2,-h/2,w,h);
            self.ctx.restore();
        };
        img.src = self.img.src;
    };
    */
    self.ImageXY = function(x1,y1,x2,y2, alpha)
    {
        img = new Image();
        img.onload = function()
        {
            self.ctx.save();
            self.ctx.globalAlpha = alpha;
            self.ctx.drawImage(self.img,x1,y1,(x2-x1),(y2-y1));
            self.ctx.globalAlpha = self.alpha;
            self.ctx.restore();
        };
        img.src = self.img.src;
    };
    self.Text = function(lable, color, x1, y1, x2, y2)
    {
        if(lable!=undefined) {
            startFont();
                //startShadow();
                    var barHeight = y2-y1;
                    var fontHeight = removePX(self.ctx.font);
                    var textY = y1+barHeight/2+fontHeight/3;
                    var mid = x1 + (x2 - x1)/2;
                    var strWidth = getStringWidth(lable);
                    var textX = mid - strWidth/2;
                    self.ctx.fillText(lable, textX, textY);
                    self.ctx.strokeText(lable, textX, textY);
                //stopShadow();
            stopFont();
        }
    }
    self.gfxLineTo = function(x,y) { self.ctx.lineTo(x,y); };
    self.gfxMoveTo = function(x,y) { self.ctx.moveTo(x,self.ctx.height-y); };
    
    return self;

    function startShadow()
    {
        self.ctx.shadowOffsetX = 4;
        self.ctx.shadowOffsetY = 4;
        self.ctx.shadowBlur    = 3;
        self.ctx.shadowColor   = 'rgba(0, 0, 0, 0.2)';
    }
    function stopShadow()
    {
        self.ctx.shadowOffsetX = 0;
        self.ctx.shadowOffsetY = 0;
        self.ctx.shadowBlur    = 0;
        self.ctx.shadowColor   = 'rgba(0, 0, 0, 1.0)';
    }
    function startFont()
    {
        self.ctx.font = self.font;
        self.ctx.fillStyle = self.fillStyle;
        self.ctx.strokeStyle = self.strokeStyle;
    }
    function stopFont()
    {
        self.ctx.font = self.defaultFont;
        self.ctx.fillStyle = self.defaultFill;
        self.ctx.strokeStyle = self.defaultStroke;
    }
    function getStringWidth(str)
    {
        var jDiv = $('#strLenghtDiv');
        jDiv.css('font', self.ctx.font);
        jDiv.html(str);
        var length = jDiv.width();
        return length;
    }
    function removePX(str)
    {
        str = str.split('p');
        return parseInt(str[0]);
    }
    function dumpProps(obj, parent) {
       for (var i in obj) {
          if (parent) {var msg = parent + "." + i + "\n" + obj[i];} else {var msg = i + "\n" + obj[i];}
          if (!confirm(msg)) {return;}
          if (typeof obj[i] == "object") {
             if (parent) {dumpProps(obj[i], parent + "." + i);} else {dumpProps(obj[i], i);}
          }
       }
    }
};