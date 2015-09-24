/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = __webpack_require__(1);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi main\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_main?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("var EventEmitter = __webpack_require__(2);\nvar addEvent = function(target, eventName, cb) {\n  target.addEventListener(eventName, function(e) {\n    e.preventDefault();\n    e.returnValue = false;\n    if (e.changedTouches) {\n          cb(e.changedTouches[0],e);\n    } else{\n      cb(e);\n    }\n  }, false)\n}\n\nvar offEvent = function(target, eventName, handler) {\n\n}\n\nfunction funPage() {}\n\nfunPage.prototype = EventEmitter.inherit({});\n\nfunPage.prototype.init = function(opts) {\n  var self = this;\n  self.opts = {\n    disScrollPage: true\n  }\n\n  self.TAG = {\n    PAGE: 'funpage',\n    ENTER : 'fun-enter-class',\n    DELAY : 'fun-delay'\n  };\n\n  self.pages = self.elemFactory(window.document.documentElement.querySelectorAll('['+ self.TAG['PAGE'] +']'));\n\n  self.handleTouch();\n\n}\n\nfunPage.prototype.on = function(type, fn) {\n  this.reg(type, fn.bind(this));\n}\n\nfunPage.prototype.endRun = function() {\n  this.running = false;\n  console.log('end')\n}\nfunPage.prototype.startRun = function() {\n  this.running = true;\n}\n\nfunPage.prototype.elemFactory = function(elems) {\n  var self = this;\n  var i = 0;\n  var elem;\n  for (i; i < elems.length; i ++) {\n    elem = elems[i];\n    elem.funEnterClass = elem.getAttribute(self.TAG['ENTER']);\n    elem.funDelay = parseInt(elem.getAttribute(self.TAG['DELAY'])) || 0;\n    elem.childs = self.elemFactory(elem.querySelectorAll('['+ self.TAG['ENTER'] +']'));\n    elem.getElemOffset = function() {\n      var get = function(ele) {\n        var top = 0;\n        do {\n          if (!isNaN(ele.offsetTop)) {\n            top += ele.offsetTop;\n          }\n        } while( ele = ele.offsetParent);\n        return {top: top};\n      }\n      return get(this);\n    }\n    elem.isVisible = function() {\n      var top = this.getElemOffset().top,\n          bottom = this.offsetHeight + top,\n          style = window.getComputedStyle(this, null),\n          viewTop = window.pageYOffset,\n          viewBottom = window.innerHeight + viewTop,\n          isInView = (top < viewBottom && bottom > viewTop),\n          isFixed = style.position == 'fixed';\n      return isInView || isFixed;\n    }\n    elem.hasClass = function(cls) {\n      return this.className.match(new RegExp('(\\\\s|^)' + cls + '(\\\\s|$)'))\n    }\n    elem.addClass = function(cls) {\n      if (cls && !this.hasClass(cls)) {\n        this.className += \" \" + cls;\n        return this;\n      }\n      return this;\n    }\n    elem.removeClass = function(cls) {\n      if (cls && this.hasClass(cls)) {\n        var reg = new RegExp('(\\\\s|^)' + cls + '(\\\\s|$)');\n        this.className = this.className.replace(reg, ' ');\n        return this;\n      }\n      return this;\n    }\n    elem.getNextSibling = function() {\n      var y = this.nextSibling;\n      while (y && y.nodeType != 1) {\n        y = y.nextSibling;\n      }\n      y = y ? y : this;\n      return y.getAttribute(self.TAG['PAGE']) == null ? this : y;\n    }\n    elem.getPreviousSibling = function() {\n      var y = this.previousSibling;\n      while (y && y.nodeType != 1) {\n        y = y.previousSibling;\n      }\n      y = y ? y : this;\n      return y.getAttribute(self.TAG['PAGE']) == null ? this : y;\n    }\n    elem.enter = function() {\n      var self = this;\n      self.funTimeout = setTimeout(function() {\n        self.addClass(self.funEnterClass);\n      }, self.funDelay);\n\n      for (var i = 0; i < self.childs.length ; i ++) {\n        (function(i, self) {\n          self.childs[i].funTimeout = setTimeout(function() {\n            self.childs[i].addClass(self.childs[i].funEnterClass);\n          }, self.childs[i].funDelay);\n        })(i, self);\n      }\n    }\n    elem.leave = function() {\n      clearTimeout(this.funTimeout);\n      this.removeClass(this.funEnterClass);\n      for (var i = 0; i < this.childs.length ; i ++) {\n        clearTimeout(this.childs[i].funTimeout);\n        this.childs[i].removeClass(this.childs[i].funEnterClass);\n      }\n    }\n\n  }\n  return elems;\n}\n\nfunPage.prototype.handleTouch = function() {\n  addEvent(window.document, 'touchstart', this.touchStart.bind(this));\n  addEvent(window.document, 'touchend', this.touchEnd.bind(this));\n}\n\nfunPage.prototype.offHandler = function() {\n\n}\n\nfunPage.prototype.touchStart = function(e) {\n  this.finger = {\n    x: e.pageX,\n    y: e.pageY\n  }\n  this.target = e.target;\n}\n\nfunPage.prototype.touchEnd = function(e) {\n  console.log(this.running)\n  if (this.running) {\n    console.log('is running return')\n    return;\n  }\n\n  var self = this, type;\n  self.disFinger = {\n    x: e.pageX - self.finger.x,\n    y: e.pageY - self.finger.y\n  }\n\n  if (self.disFinger.y > 0) {\n    self.emit('down')\n  } else if (self.disFinger.y < 0){\n    self.emit('up')\n  } else {\n    return;\n  }\n}\n\nfunPage.prototype.ScrollTo = function(elem, cb) {\n  var self = this;\n  var x = window.scrollX;\n  var y = window.scrollY;\n  var getOffset = function(ele) {\n    var top = 0, left = 0;\n    do {\n      if (!isNaN(ele.offsetTop)) {\n        top += ele.offsetTop;\n        left += ele.offsetLeft;\n      }\n    } while( ele = ele.offsetParent);\n\n    return {y: top, x: left};\n  }\n  var offset = getOffset(elem);\n\n  var speed = Math.ceil(0.1 * (Math.abs(offset.y - y)));\n\n  if (offset.y > y) {\n    y += speed;\n\n    if (y > offset.y) {\n      y = offset.y;\n    }\n  } else if (offset.y < y) {\n    y -= speed;\n    if (y < offset.y) {\n      y = offset.y;\n    }\n  } else {\n\n  }\n  this.startRun();\n  window.scrollTo(0, y);\n  if (Math.abs(y - offset.y) > 0) {\n    console.log('scrolling')\n    window.setTimeout(funPage.prototype.ScrollTo.bind(self, elem, cb), 16);\n  } else {\n    cb && cb();\n  }\n}\n\nwindow.funPage = new funPage();\n\n\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./index.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./index.js?");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;\n\n(function(root, factory){\n  if (typeof exports !== 'undefined' && module.exports) {\n    module.exports = exports = factory();\n  } else if (\"function\" === 'function' && __webpack_require__(3).cmd) {\n    !(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {\n      module.exports = exports = factory();\n    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n  } else if (true) {\n    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {\n      return factory();\n    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n  } else {\n    window.EventEmitter = factory();\n  }\n})(window, function() {\n\n  function EventEmitter() {\n\n  }\n\n  EventEmitter.prototype.inherit = function(obj) {\n    if (!obj) {\n      obj = {};\n    }\n    for(var key in EventEmitter.prototype) {\n      obj[key] = EventEmitter.prototype[key];\n    }\n    return obj;\n  };\n\n  EventEmitter.prototype.reg = function(eventName, fn) {\n    var self = this;\n    self.events = self.events || {};\n    if (!self.events[eventName]) {\n      self.events[eventName] = [{\n        eventId: ++self.eventId,\n        fn: fn\n      }];\n    } else {\n      self.events[eventName].push({\n        eventId: ++self.eventId,\n        fn: fn\n      });\n    }\n  };\n\n  EventEmitter.prototype.emit = function() {\n    var self = this;\n    var eventName = arguments[0];\n    var args = [];\n    for (i = 1; i < arguments.length; i++) {\n        args[i - 1] = arguments[i];\n    }\n    if (!eventName || !self.events[eventName]) {\n      return;\n    }\n    for(var i = 0; i < self.events[eventName].length; i ++) {\n      (function(i) {\n        self.events[eventName][i].fn.apply(self,args);\n      })(i);\n    }\n\n  };\n  return new EventEmitter();\n})\n\n\n\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./lib/eventEmitter.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./lib/eventEmitter.js?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("module.exports = function() { throw new Error(\"define cannot be used indirect\"); };\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** (webpack)/buildin/amd-define.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///(webpack)/buildin/amd-define.js?");

/***/ }
/******/ ]);