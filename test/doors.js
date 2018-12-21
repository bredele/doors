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
  assert.plan(2)
  var door = doors()
  door.lock('hello')
  door.lock('world')
  door.unlock('hello')
  assert.equal(door.knock(), false)
  door.unlock('world')
  assert.equal(door.knock(), true)
})

test('knock should return true if given lock does not exist, false otherwise', assert => {
  assert.plan(2)
  var door = doors()
  assert.equal(door.knock('world'), true)
  door.lock('world')
  assert.equal(door.knock('world'), false)
})

test('should add multiple locks at a time', assert => {
  assert.plan(2)
  var door = doors()
  door.lock('hello world')
  door.unlock('hello')
  assert.equal(door.knock(), false)
  door.unlock('world')
  assert.equal(door.knock(), true)
})

test('should remove multiple locks at a time', assert => {
  assert.plan(2)
  var door = doors()
  door.lock('hello world foo')
  door.unlock('hello')
  assert.equal(door.knock(), false)
  door.unlock('foo world')
  assert.equal(door.knock(), true)
})

test('should knock at multiple locks at the same time', assert => {
  assert.plan(6)
  var door = doors()
  door.lock('world hello')
  assert.equal(door.knock('hello'), false)
  assert.equal(door.knock('world'), false)
  assert.equal(door.knock('hello world'), false)
  door.unlock('hello world')
  assert.equal(door.knock('hello world'), true)
  assert.equal(door.knock('hello'), true)
  assert.equal(door.knock('world'), true)
})

test('should add a lock from the constructor', assert => {
  assert.plan(1)
  var door = doors('hello')
  assert.equal(door.knock('hello'), false)
})

test('door should be locked if locks have been added from the constructor', assert => {
  assert.plan(1)
  var door = doors('hello')
  assert.equal(door.knock(), false)
})

test('should add multiple locks from the constructor', assert => {
  assert.plan(2)
  var door = doors('hello world')
  assert.equal(door.knock('world'), false)
  assert.equal(door.knock('hello'), false)
})

test('should knock at multiple locks at a time', assert => {
  assert.plan(3)
  var door = doors('hello world foo')
  assert.equal(door.knock('world hello'), false)
  door.unlock('hello world')
  assert.equal(door.knock('hello world'), true)
  assert.equal(door.knock('hello foo'), false)
})

test('should mix constructor locks and added locks', assert => {
  assert.plan(5)
  var door = doors('hello world foo')
  door.lock('beep')
  door.lock('boo canada')
  assert.equal(door.knock('boo'), false)
  assert.equal(door.knock('beep canada'), false)
  door.unlock('world canada')
  assert.equal(door.knock('canada world'), true)
  door.lock('canada')
  assert.equal(door.knock('canada'), false)
  assert.equal(door.knock('world'), true)
})

test('should accept arrays of locks', assert => {
  assert.plan(2)
  var door = doors(['hello', 'world'])
  door.unlock(['hello', 'world'])
  assert.equal(door.knock(['hello', 'world']), true)
  door.lock(['beep', 'boop'])
  assert.equal(door.knock(['boop', 'beep']), false)
})

test('should emit lock event when lock is added', assert => {
  assert.plan(2)
  var door = doors()
  door.on('lock', name => assert.equal(name, 'hello'))
  door.on('lock hello', () => assert.ok('event received'))
  door.lock('hello')
})

test('should emit multiple time the lock event', assert => {
  assert.plan(4)
  var door = doors()
  const locks = ['hello', 'world']
  door.on('lock hello', () => assert.ok('hello received'))
  door.on('lock world', () => assert.ok('world received'))
  door.on('lock', name => {
    assert.equal(locks.indexOf(name) > -1, true)
  })
  door.lock(locks)
})

test('should not emit lock event if lock has already been added', assert => {
  assert.plan(1)
  var door = doors('hello')
  door.on('lock hello', () => assert.fail('fail'))
  door.lock('hello')
  assert.ok('pass')
})

test('should emit unlock event when lock is unlocked', assert => {
  assert.plan(2)
  var door = doors('hello')
  door.on('unlock', name => assert.equal(name, 'hello'))
  door.on('unlock hello', () => assert.ok('event received'))
  door.unlock('hello')
})

test('should not emit unlock event if lock is not locked prior', assert => {
  assert.plan(1)
  var door = doors()
  door.on('unlock', name => assert.fail('should not be received'))
  door.unlock('hello')
  assert.ok('end')
})

test('should emit open event when door is openned', assert => {
  assert.plan(1)
  var door = doors('hello')
  door.on('open', () => assert.ok('open'))
  door.unlock('hello')
})

test('should emit open event once when door is openned', assert => {
  assert.plan(1)
  var door = doors('hello')
  door.on('open', () => assert.ok('open'))
  door.unlock('hello')
  door.unlock('hello')
})


test('should reject promise when door opens', assert => {
  assert.plan(1)
  var door = doors('hello')
  door.promise().then(() => assert.ok('open'), () => assert.fail('close'))
  door.unlock('hello')
})
