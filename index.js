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
    if (names) {
      return Promise.all(split(names).map(function (name) {
        return new Promise(function (resolve, reject) {
          door.once('lock ' + name, reject)
          door.once('unlock ' + name, resolve)
        })
      }))
    }
    return new Promise(function (resolve, reject) {
      door.once('open', resolve)
      door.once('close', reject)
    })
  }

  /**
   * Add lock.
   *
   * @param {String} name
   * @api private
   */

  door.add = function (name) {
    if (!~locks.indexOf(name)) {
      var open = locks.length < 1
      locks.push(name)
      door.emit('lock ' + name)
      door.emit('lock', name)
      if (open && locks.length > 0) door.emit('close')
    }
  }

  /**
   * Remove lock.
   *
   * @param {String} name
   * @api private
   */

  door.remove = function (name) {
    var index = locks.indexOf(name)
    if (index > -1) {
      var close = locks.length > 0
      locks.splice(index, 1)
      door.emit('unlock ' + name)
      door.emit('unlock', name)
      if (close && locks.length < 1) door.emit('open')
    }
  }

  door.lock = function (names) {
    split(names).map(function (name) {
      door.add(name)
    })
  }

  door.unlock = function (names) {
    split(names).map(function (name) {
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
