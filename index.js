/**
 * Dependency
 */

var emitter = require('zeroin')

/**
 * Door factory.
 *
 * Examples:
 *
 *  door()
 *  door('lock1')
 *  door('lock1 lock2')
 *  door(['lock1', 'lock2'])
 *  door(core => {
 *    core.unlock('lock1')
 *  }, 'lock1')
 *
 *
 * @param {String|Array?}
 * @return {Object}
 * @api public
 */

module.exports = function (fn, names) {
  if (typeof fn === 'function') {
    var door = doors(names)
    var promise = door.promise()
    fn(door)
    return promise
  }
  return doors(fn)
}

/**
 * Door constructor.
 *
 * Examples:
 *
 *  door()
 *  door('lock1')
 *  door('lock1 lock2')
 *  door(['lock1', 'lock2'])
 *
 *
 * @param {String|Array?}
 * @return {Object}
 * @api public
 */

function doors(arg) {

  var door = emitter({})

  /**
   * List of locks that are locked.
   * @type {Array}
   */

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
   *  knock(['lock1', 'lock2'])
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

  /**
   * Promise factory.
   * Resolve promise when open and reject when close.
   * Resolve promise when lock and reject when unlock.
   *
   * Examples:
   *
   *  promise()
   *  promise('lock1')
   *  promise('lock2 lock1')
   *  promise(['lock1', 'lock2'])
   *
   * @param {String|Array?}
   * @return {Promise}
   * @api public
   */

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

  /**
   * Lock one or multiple locks.
   *
   * Examples:
   *
   *  lock('lock1')
   *  lock('lock1 lock2')
   *  lock(['lock1', 'lock2'])
   *
   * @param {String?} names
   * @api public
   */

  door.lock = function (names, promise) {
    var add = map(names, door.add)
    switch (type(promise)) {
      case 'promise':
        promise.then(add)
        break
      default:
        add()
    }
  }

  /**
   * Unlock one or multiple locks.
   *
   * Examples:
   *
   *  unlock('lock1')
   *  unlock('lock1 lock2')
   *  unlock(['lock1', 'lock2'])
   *
   * @param {String?} names
   * @param {Promise?} promise
   * @api public
   */

  door.unlock = function (names, promise) {
    var remove = map(names, door.remove)
    switch (type(promise)) {
      case 'promise':
        promise.then(remove)
        break
      default:
        remove()
    }
  }

  /**
   * Add locks on construction.
   */

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

/**
 * Map function with names input.
 *
 * @param {String|Array} names
 * @param {Function} fn
 * @return {Function}
 * @api private
 */

function map (names, fn) {
  return function () {
    split(names).map(fn)
  }
}

/**
 * Return object type.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function type (obj) {
  if (obj) {
    if (typeof obj.then === 'function') return 'promise'
    else if (typeof obj.on === 'function' && typeof obj.emit === 'function') return 'emitter'
  }
}
