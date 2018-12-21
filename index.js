/**
 * Dependency
 */

var emitter = require('component-emitter')


module.exports = function () {

  const door = emitter({})

  const locks = []

  door.on('lock', function (name) {
    const size = locks.length
    if (!~locks.indexOf(name)) locks.push(name)
    if (size < 1) door.emit('close')
  })

  door.on('unlock', function (name) {
    var index = locks.indexOf(name)
    if (index > -1) locks.splice(index, 1)
    if (locks.length < 1) door.emit('open')
  })

  door.promise = function (names) {
    if (names) {
      return Promise.all(split(names).map(name => {
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

  door.lock = function (names) {
    split(names).map(function (name) {
      door.emit('lock ' + name)
      door.emit('lock', name)
    })
  }

  door.unlock = function (names) {
    split(names).map(function (name) {
      door.emit('unlock ' + name)
      door.emit('unlock', name)
    })
  }

  return door
}


function split (names) {
  return names.trim().split(/\s+/g)
}
