var Emitter = require('emitter'),
		index = require('indexof');
		// normalize = function(fn, arr) {
		// 	return function() {
		// 		var curry = function curry() {
		// 			var length = arguments.length;
		// 			if(length) {
		// 				for(var l = length; l--;) {
		// 					fn.call(this, arguments[l]);
		// 				}
		// 			} else {
		// 				curry.call(this, arr);
		// 			}
		// 		};
		// 		return curry;
		// 	};
		// };


/**
 * Expose 'Doors'
 */

module.exports = Doors;


/**
 * Doors constructor.
 * @api public
 */

function Doors(name) {
	this.name = name;
	this.keys = [];
  this.locks = {};

}


//Doors is an emitter

Emitter(Doors.prototype);


/**
 * Has key.
 *
 * @param {String} key 
 * @return {Boolean} true if key is locked
 * @api public
 */

Doors.prototype.has = function(key) {
	return !!~index(this.keys, key);
};


/**
 * Add lock.
 *
 * @param {String} name 
 * @api public
 */

Doors.prototype.add = function(lock) {
	if(!this.has(lock)) {
		this.locks[lock] = lock;
		this.keys.push(lock);
	}
};


/**
 * Lock a previously added lock.
 * Examples:
 *
 *     door.lock('olivier'); //lock 'olivier'
 *     door.lock('olivier', 'amy'); //lock 'olivier' and 'amy'
 *     door.lock(); //lock all the locks
 *
 * @api public
 */

Doors.prototype.lock = function() {
	var length = arguments.length;
	if(length) {
		for(var l = length; l--;) {
			var key = arguments[l];
			if(this.locks[key] && !this.has(key)) {
				this.keys.push(key);
			}
		}
	} else {
		this.lock.apply(this, Object.keys(this.locks));
	}
};


/**
 * Open the door only if all locks are unlocked.
 * and emit open event.
 * 
 * @return {Boolean} true if open
 * @api public
 */

Doors.prototype.open = function() {
	if(!this.keys.length) {
		this.emit('open');
		return true;
	}
	return false;
};


/**
 * Unlock door's lock(s).
 * Examples:
 *
 *     door.unlock('olivier'); //unlock 'olivier'
 *     door.unlock('olivier', 'amy'); //unlock 'olivier' and 'amy'
 *     door.unlock(); //unlock all the locks
 *
 * @params {String} key(s)
 * @api public
 */

Doors.prototype.unlock = function() {
	var length = arguments.length;
	if(length) {
		for(var l = length; l--;) {
			var key = arguments[l];
			if(this.has(key)) this.keys.splice(index(this.keys, key), 1);
			this.open();
		}
	} else {
		this.unlock.apply(this, this.keys);
	}
};

