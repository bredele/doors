/**
 * Dependency
 */

var emitter = require('component-emitter')


module.exports = function () {
  const door = {}

  door.promise = function (name) {
    return new Promise(function (resolve, reject) {
      door.once('lock ' + name, reject)
      door.once('unlock ' + name, resolve)
    })
  }

  door.lock = function (name) {
    door.emit('lock ' + name)
  }

  door.unlock = function (name) {
    door.emit('unlock ' + name)
  }

  return emitter(door)
}
