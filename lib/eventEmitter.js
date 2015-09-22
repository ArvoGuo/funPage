

(function(root, factory){
  if (typeof exports !== 'undefined' && module.exports) {
    module.exports = exports = factory();
  } else if (typeof define === 'function' && define.cmd) {
    define(function(require, exports, module) {
      module.exports = exports = factory();
    });
  } else if (typeof define === 'function' && define.amd) {
    define('EventEmitter', [], function() {
      return factory();
    });
  } else {
    window.EventEmitter = factory();
  }
})(window, function() {

  function EventEmitter() {

  }

  EventEmitter.prototype.inherit = function(obj) {
    if (!obj) {
      obj = {};
    }
    for(var key in EventEmitter.prototype) {
      obj[key] = EventEmitter.prototype[key];
    }
    return obj;
  };

  EventEmitter.prototype.reg = function(eventName, fn) {
    var self = this;
    self.events = self.events || {};
    if (!self.events[eventName]) {
      self.events[eventName] = [{
        eventId: ++self.eventId,
        fn: fn
      }];
    } else {
      self.events[eventName].push({
        eventId: ++self.eventId,
        fn: fn
      });
    }
  };

  EventEmitter.prototype.emit = function() {
    var self = this;
    var eventName = arguments[0];
    var args = [];
    for (i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
    }
    if (!eventName || !self.events[eventName]) {
      return;
    }
    for(var i = 0; i < self.events[eventName].length; i ++) {
      (function(i) {
        self.events[eventName][i].fn.apply(self,args);
      })(i);
    }

  };
  return new EventEmitter();
})



