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
		this.keys.push(lock);
	}
};


/**
 * [lock description]
 * @return {[type]} [description]
 */

Doors.prototype.lock = function(name) {
	
};


/**
 * [lock description]
 * @return {[type]} [description]
 */

Doors.prototype.unlock = function(key) {
	var idx = index(this.keys, key);
	this.keys.splice(idx, 1);
};

