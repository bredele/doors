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
  this.locks = [];
}


//Doors is an emitter

Emitter(Doors.prototype);


/**
 * [lock description]
 * @return {[type]} [description]
 */

Doors.prototype.add = function(name) {
	if(!~index(this.locks, name)) {
		this.locks.push(name);
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

Doors.prototype.unlock = function(name) {
	
};