/**
 * Dependencies.
 */

var test = require('tape')
var doors = require('..')

test('should have the following API', assert => {
  assert.plan(4)
  var door = doors()
  assert.equal(typeof door, 'object')
  assert.equal(typeof door.promise, 'function')
  assert.equal(typeof door.lock, 'function')
  assert.equal(typeof door.unlock, 'function')
})
// 
// test('should ', assert => {
//
// })
