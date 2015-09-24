var EventEmitter = require('./lib/eventEmitter');
var addEvent = function(target, eventName, cb) {
  target.addEventListener(eventName, function(e) {
    e.preventDefault();
    e.returnValue = false;
    if (e.changedTouches) {
          cb(e.changedTouches[0],e);
    } else{
      cb(e);
    }
  }, false)
}

var offEvent = function(target, eventName, handler) {

}

function funPage() {}

funPage.prototype = EventEmitter.inherit({});

funPage.prototype.init = function(opts) {
  var self = this;
  self.opts = {
    disScrollPage: true
  }

  self.TAG = {
    PAGE: 'funpage',
    ENTER : 'fun-enter-class',
    DELAY : 'fun-delay'
  };

  self.pages = self.elemFactory(window.document.documentElement.querySelectorAll('['+ self.TAG['PAGE'] +']'));

  self.handleTouch();

}

funPage.prototype.on = function(type, fn) {
  this.reg(type, fn.bind(this));
}

funPage.prototype.endRun = function() {
  this.running = false;
  console.log('end')
}
funPage.prototype.startRun = function() {
  this.running = true;
}

funPage.prototype.elemFactory = function(elems) {
  var self = this;
  var i = 0;
  var elem;
  for (i; i < elems.length; i ++) {
    elem = elems[i];
    elem.funEnterClass = elem.getAttribute(self.TAG['ENTER']);
    elem.funDelay = parseInt(elem.getAttribute(self.TAG['DELAY'])) || 0;
    elem.childs = self.elemFactory(elem.querySelectorAll('['+ self.TAG['ENTER'] +']'));
    elem.getElemOffset = function() {
      var get = function(ele) {
        var top = 0;
        do {
          if (!isNaN(ele.offsetTop)) {
            top += ele.offsetTop;
          }
        } while( ele = ele.offsetParent);
        return {top: top};
      }
      return get(this);
    }
    elem.isVisible = function() {
      var top = this.getElemOffset().top,
          bottom = this.offsetHeight + top,
          style = window.getComputedStyle(this, null),
          viewTop = window.pageYOffset,
          viewBottom = window.innerHeight + viewTop,
          isInView = (top < viewBottom && bottom > viewTop),
          isFixed = style.position == 'fixed';
      return isInView || isFixed;
    }
    elem.hasClass = function(cls) {
      return this.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
    }
    elem.addClass = function(cls) {
      if (cls && !this.hasClass(cls)) {
        this.className += " " + cls;
        return this;
      }
      return this;
    }
    elem.removeClass = function(cls) {
      if (cls && this.hasClass(cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        this.className = this.className.replace(reg, ' ');
        return this;
      }
      return this;
    }
    elem.getNextSibling = function() {
      var y = this.nextSibling;
      while (y && y.nodeType != 1) {
        y = y.nextSibling;
      }
      y = y ? y : this;
      return y.getAttribute(self.TAG['PAGE']) == null ? this : y;
    }
    elem.getPreviousSibling = function() {
      var y = this.previousSibling;
      while (y && y.nodeType != 1) {
        y = y.previousSibling;
      }
      y = y ? y : this;
      return y.getAttribute(self.TAG['PAGE']) == null ? this : y;
    }
    elem.enter = function() {
      var self = this;
      self.funTimeout = setTimeout(function() {
        self.addClass(self.funEnterClass);
      }, self.funDelay);

      for (var i = 0; i < self.childs.length ; i ++) {
        (function(i, self) {
          self.childs[i].funTimeout = setTimeout(function() {
            self.childs[i].addClass(self.childs[i].funEnterClass);
          }, self.childs[i].funDelay);
        })(i, self);
      }
    }
    elem.leave = function() {
      clearTimeout(this.funTimeout);
      this.removeClass(this.funEnterClass);
      for (var i = 0; i < this.childs.length ; i ++) {
        clearTimeout(this.childs[i].funTimeout);
        this.childs[i].removeClass(this.childs[i].funEnterClass);
      }
    }

  }
  return elems;
}

funPage.prototype.handleTouch = function() {
  addEvent(window.document, 'touchstart', this.touchStart.bind(this));
  addEvent(window.document, 'touchend', this.touchEnd.bind(this));
}

funPage.prototype.offHandler = function() {

}

funPage.prototype.touchStart = function(e) {
  this.finger = {
    x: e.pageX,
    y: e.pageY
  }
  this.target = e.target;
}

funPage.prototype.touchEnd = function(e) {
  console.log(this.running)
  if (this.running) {
    console.log('is running return')
    return;
  }

  var self = this, type;
  self.disFinger = {
    x: e.pageX - self.finger.x,
    y: e.pageY - self.finger.y
  }

  if (self.disFinger.y > 0) {
    self.emit('down')
  } else if (self.disFinger.y < 0){
    self.emit('up')
  } else {
    return;
  }
}

funPage.prototype.ScrollTo = function(elem, cb) {
  var self = this;
  var x = window.scrollX;
  var y = window.scrollY;
  var getOffset = function(ele) {
    var top = 0, left = 0;
    do {
      if (!isNaN(ele.offsetTop)) {
        top += ele.offsetTop;
        left += ele.offsetLeft;
      }
    } while( ele = ele.offsetParent);

    return {y: top, x: left};
  }
  var offset = getOffset(elem);

  var speed = Math.ceil(0.1 * (Math.abs(offset.y - y)));

  if (offset.y > y) {
    y += speed;

    if (y > offset.y) {
      y = offset.y;
    }
  } else if (offset.y < y) {
    y -= speed;
    if (y < offset.y) {
      y = offset.y;
    }
  } else {

  }
  this.startRun();
  window.scrollTo(0, y);
  if (Math.abs(y - offset.y) > 0) {
    console.log('scrolling')
    window.setTimeout(funPage.prototype.ScrollTo.bind(self, elem, cb), 16);
  } else {
    cb && cb();
  }
}

window.funPage = new funPage();


