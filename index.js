/**
 * Dependency
 */

var emitter = require('component-emitter')


module.exports = function (arg) {

  var door = emitter({})

  var locks = []

  /**
   * Check if door is locked (true) or unlocked (false).
   * Check if lock is locked or not.
   *
   * Examples:
   *
   *  knock()
   *  knock('lock1')
   *  knock('lock1 lock2')
   *
   * @param {String?} names
   * @return {Boolean}
   * @api public
   */

  door.knock = function (names) {
    if (names) {
      return split(names).reduce(function (a, b) {
        return !~locks.indexOf(b) && a
      }, true)
    }
    return locks.length < 1
  }

  door.promise = function (names) {

  }

  /**
   * Add lock.
   *
   * @param {String} name
   * @api private
   */

  door.add = function (name) {
    if (!~locks.indexOf(name)) locks.push(name)
  }

  /**
   * Remove lock.
   *
   * @param {String} name
   * @api private
   */

  door.remove = function (name) {
    var index = locks.indexOf(name)
    if (index > -1) locks.splice(index, 1)
  }

  door.lock = function (names) {
    split(names).map(function (name) {
      door.emit('lock ' + name)
      door.emit('lock', name)
      door.add(name)
    })
  }

  door.unlock = function (names) {
    split(names).map(function (name) {
      door.emit('unlock ' + name)
      door.emit('unlock', name)
      door.remove(name)
    })
  }

  if (arg) {
    split(arg).map(function (name) {
      door.add(name)
    })
  }

  return door
}

/**
 * Split string into array of words without spaces.
 *
 * @param {String|Array} names
 * @return {Array}
 * @api private
 */

function split (names) {
  return names instanceof Array
    ? names
    : names.trim().split(/\s+/g)
}
