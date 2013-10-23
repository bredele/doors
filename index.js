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

function Doors(name) {
	this.name = name;
	this.keys = [];
  this.locks = {};

}


//Doors is an emitter

Emitter(Doors.prototype);


/**
 * Add lock.
 *
 * @param {String} name 
 * @api public
 */

Doors.prototype.add = function(lock) {
	if(!~index(this.keys, lock)) {
		this.locks[lock] = lock;
		this.keys.push(lock);
	}
};


/**
 * [lock description]
 * @return {[type]} [description]
 */

Doors.prototype.lock = function(name) {
	if(this.locks[name] && !~index(this.keys, name)) {
		this.keys.push(name);
	}
};


/**
 * [lock description]
 * @return {[type]} [description]
 */

Doors.prototype.open = function() {
	if(!this.keys.length) {
		this.emit('open');
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
		for(var l = arguments.length; l--;) {
			var key = arguments[l];
			var idx = index(this.keys, key);
			if(!!~idx) this.keys.splice(idx, 1);
			//delete this.locks[key];
			this.open();
		}
	} else {
		this.unlock.apply(this, this.keys);
	}
};

