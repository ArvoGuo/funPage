window.funPage = (function(window) {
  'use strict';
  var TAG_FUN_BASIC = 'fun-basic-class',
      TAG_FUN_ENTER = 'fun-enter-class',
      TAG_FUN_LEAVE = 'fun-leave-class';
  var requestAnimationFrame = (function(){
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function( callback ){
                  window.setTimeout( callback, 1000 / 60 );
                };
      })();
  function funPage(config) {
    this.init();
  }

  var fn = funPage.prototype;

  funPage.prototype = {
    init: function() {
      var self = this;
      self.elems = self.elemFactory(window.document.documentElement.querySelectorAll('['+ TAG_FUN_BASIC +']'));

      self.listenScroll();
    },
    listenScroll: function() {
      var self = this;
      window.addEventListener('scroll', self.handleScroll.bind(self), false);
      window.addEventListener('resize', self.handleScroll.bind(self), false);
    },
    elemFactory: function(elems) {
      var i = 0;
      var elem;
      for (i; i < elems.length; i ++) {
        elem = elems[i];
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
          if (!this.hasClass(cls)) {
            this.className += " " + cls;
            return true;
          }
          return false;
        }
        elem.removeClass = function(cls) {
          if (this.hasClass(cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            this.className = this.className.replace(reg, ' ');
          }
        }
        elem.funBasicClass = elem.getAttribute(TAG_FUN_BASIC);
        elem.funEnterClass = elem.getAttribute(TAG_FUN_ENTER);
        elem.funLeaveClass = elem.getAttribute(TAG_FUN_LEAVE);
        if (elem.funBasicClass) {
          elem.addClass(elem.funBasicClass)
        }
      }
      return elems;
    },
    animate: function() {
      var self = this;
      var elem;
      var visible;
      for(var i = 0; i < self.elems.length; i ++) {
        elem = self.elems[i];
        visible = elem.isVisible();
        if (visible) {
          elem.removeClass(elem.funLeaveClass);
          elem.addClass(elem.funEnterClass);
        } else {
          elem.removeClass(elem.funEnterClass);
          elem.addClass(elem.funLeaveClass)
        }
      }
    },
    handleScroll: function(e) {
      var self = this;
      requestAnimationFrame(function() {
        self.animate();
      });
    }
  }


  return funPage;
})(window)