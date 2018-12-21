/**
 * Dependency
 */

var emitter = require('component-emitter')


module.exports = function () {

  var door = emitter({})

  var locks = []

  door.knock = function (name) {
    return locks.length < 1
  }

  door.promise = function (names) {

  }

  door.add = function (name) {
    if (!~locks.indexOf(name)) locks.push(name)
  }

  door.remove = function (name) {
    var index = locks.indexOf(name)
    if (index > -1) locks.splice(index, 1)
  }

  door.lock = function (names) {
    split(names).map(function (name) {
      door.add(name)
    })
  }

  door.unlock = function (names) {
    door.remove(names)
  }

  return door
}


function split (names) {
  return names.trim().split(/\s+/g)
}
