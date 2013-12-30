/**
 * Dependencies
 */

var ev = require('event'),
    delegate = require('delegate');

/**
 * Map touch events.
 * @type {Object}
 * @api private
 */

var mapper = {
	'click' : 'touchend',
	'mousedown' : 'touchstart',
	'mouseup' : 'touchend',
	'mousemove' : 'touchmove'
};


/**
 * Expose 'Event plugin'
 */

module.exports = Event;


/**
 * Event plugin constructor
 * @param {Object} view event plugin scope
 * @param {Boolean} isTouch optional
 * @api public
 */

function Event(view, isTouch){
  this.view = view;
  this.isTouch = isTouch || (window.ontouchstart !== undefined);
}


/**
 * Listen events.
 * @param {HTMLElement} node 
 * @param {String} type event's type
 * @param {String} callback view's callback name
 * @param {String} capture useCapture
 * @api private
 */

Event.prototype.on = function(node, type, callback, capture) {
  var _this = this;
  ev.bind(node, this.map(type), function(e){
    _this.view[callback].call(_this.view, e, node);
  }, (capture === 'true'));
};


/**
 * Event delegation.
 * @param {HTMLElement} node 
 * @param {String} selector
 * @param {String} type event's type
 * @param {String} callback view's callback name
 * @param {String} capture useCapture
 * @api private
 */

Event.prototype.delegate = function(node, selector, type, callback, capture) {
  var _this = this;
  delegate.bind(node, selector, this.map(type), function(e){
    _this.view[callback].call(_this.view, e, node);
  }, capture);
};


/**
 * Map events (desktop and mobile)
 * @param  {String} type event's name
 * @return {String} mapped event
 */

Event.prototype.map = function(type) {
	return this.isTouch ? (mapper[type] || type) : type;
};
