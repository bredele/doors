
/**
 * Module dependencies.
 * @api private
 */

var Emitter = require('component-emitter');
var index = require('indexof');


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


//inherits Emitter

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
 * Examples:
 *
 *   door.add('lock1');
 *
 * @param {String} name 
 * @return {this}
 * @api public
 */

Doors.prototype.add = function(lock) {
  if(!this.has(lock)) {
    var key = lock;
    if(lock instanceof Doors) {
      var _this = this;
      key = lock.name;
      lock.on('open', function() {
        _this.unlock(key);
      });
    }
    this.locks[key] = lock;
    this.keys.push(key);
  }
  return this;
};


/**
 * Lock a previously added lock.
 * 
 * Examples:
 *
 *     door.lock('olivier'); //lock 'olivier'
 *     door.lock('olivier', 'amy'); //lock 'olivier' and 'amy'
 *     door.lock(); //lock all the locks
 *
 * @return {this}
 * @api public
 */

Doors.prototype.lock = function() {
  var length = arguments.length;
  if(length) {
    for(var l = length; l--;) {
      var key = arguments[l];
      if(this.locks[key] && !this.has(key)) {
        var lock = this.locks[key];
        if(lock instanceof Doors) {
          lock.lock();
        }
        this.keys.push(key);
      }
    }
  } else if(Object.keys(this.locks).length){
    this.lock.apply(this, Object.keys(this.locks));
  }
  return this;
};


/**
 * Unlock door's lock(s).
 * 
 * Examples:
 *
 *     door.unlock('olivier'); //unlock 'olivier'
 *     door.unlock('olivier', 'amy'); //unlock 'olivier' and 'amy'
 *     door.unlock(); //unlock all the locks
 *
 * @params {String} key(s)
 * @return {this} 
 * @api public
 */

Doors.prototype.unlock = function() {
  var length = arguments.length;
  if(length) {
    for(var l = length; l--;) {
      var key = arguments[l];
      if(this.has(key)) {
        var lock = this.locks[key];
        this.keys.splice(index(this.keys, key), 1);
        if(lock instanceof Doors) {
          lock.unlock();
        }
        this.open();
      }
    }
  } else if(this.keys.length){
    this.unlock.apply(this, this.keys);
  }
  return this;
};


/**
 * Toggle Lock.
 *
 * Examples:
 *
 *   // unlock
 *   door.toggle('lock1', true);
 *   //lock
 *   door.toogle('lock1');
 * 
 * @param  {String} name 
 * @param  {Boolean} bool 
 * @return {this}
 * @api public
 */

Doors.prototype.toggle = function(name, bool) {
  if(bool) this.unlock(name);
  else this.lock(name);
  return this;
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
