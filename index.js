var Emitter = require('emitter'),
		index = require('indexof');


/**
 * Expose 'Doors'
 */

module.exports = Doors;


/**
 * Doors constructor.
 * @api public
 */

function Doors(name, locks) {
	var arr = locks || [];
	this.name = name;
	this.keys = [];
  this.locks = {};
  for(var l = arr.length; l--;) {
    this.add(arr[l]);
  }
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
		var key = lock;
		if(lock instanceof Doors) {
			key = lock.name;
		}
		this.locks[key] = lock;
		this.keys.push(key);
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


/**
 * Toggle Lock.
 * 
 * @param  {String} name 
 * @param  {Boolean} bool 
 * @api public
 */

Doors.prototype.toggle = function(name, bool) {
	if(bool) {
		this.unlock(name);
	} else {
		this.lock(name);
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
