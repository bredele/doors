/**
 * Dependencies.
 */

var test = require('tape')
var doors = require('..')

test('should have the following API', assert => {
  assert.plan(5)
  var door = doors()
  assert.equal(typeof door, 'object')
  assert.equal(typeof door.promise, 'function')
  assert.equal(typeof door.lock, 'function')
  assert.equal(typeof door.unlock, 'function')
  assert.equal(typeof door.knock, 'function')
})

test('should be an event emitter', assert => {
  assert.plan(3)
  var door = doors()
  assert.equal(typeof door.on, 'function')
  assert.equal(typeof door.emit, 'function')
  assert.equal(typeof door.once, 'function')
})

test('should be openned by default', assert => {
  assert.plan(1)
  var door = doors()
  assert.equal(door.knock(), true)
})

test('should return false if door is locked (close)', assert => {
  assert.plan(1)
  var door = doors()
  door.lock('hello')
  assert.equal(door.knock(), false)
})

test('knock should return true if door is unlocked (open)', assert => {
  assert.plan(1)
  var door = doors()
  door.lock('hello')
  door.unlock('hello')
  assert.equal(door.knock(), true)
})


// test('knock should return true if lock is closed', assert => {
//   assert.plan(1)
//   var door = doors()
//   assert.equal(door.knock('hello'), false)
// })
//
//
// test('knock should return false if lock is opened', assert => {
//   assert.plan(1)
//   var door = doors()
//   door.lock('hello')
//   assert.equal(door.knock('hello'), true)
// })
