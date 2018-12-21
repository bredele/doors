# doors

[![Build Status](https://travis-ci.org/bredele/doors.svg?branch=master)](https://travis-ci.org/bredele/doors)
 [![NPM](https://img.shields.io/npm/v/doors.svg)](https://www.npmjs.com/package/doors)
 [![Downloads](https://img.shields.io/npm/dm/doors.svg)](http://npm-stat.com/charts.html?package=doors)
 [![pledge](https://bredele.github.io/contributing-guide/community-pledge.svg)](https://github.com/bredele/contributing-guide/blob/master/guidelines.md)


Use door to represent asynchronous operation depending on multiple conditions. Imagine a door with multiple locks, you can not open the door until all locks are unlocked and one lock is enough for the door to be closed.

[Check it out online!](http://bredele.github.io/doors)

## Usage

A door is either opened or closed. The transition from one state to an other is not immutable and depends on conditions called "locks".

```js
const doors = require('doors')

// initialize door with one lock
const door = doors('lock1')

// listen when door opens
door.on('open', () => console.log('do something when no lock'))
// listen when door closes
door.on('close', () => console.log('do something when at least one lock'))

door.on('unlock lock1', () => console.log('do something when lock1 is unlocked'))
door.on('unlock lock2', () => console.log('do something when lock1 is locked'))

// is lock1 unlocked?
door.knock('lock1')
// => false
door.unlock('lock1')

// lock lock1 againi
door.lock('lock1')

```

A transition may depend on multiple locks.

```js
const door = doors('lock1 lock2 lock3')
door.unlock('lock3 lock1')
door.knock('lock2 lock1')
// => false
door.knock('lock3 lock1')
// => true

// unlock lock2 after 1 second
door.unlock('lock2', new Promise(resolve => {
  setTimeout(resolve, 1000)
}))

// door is opened
door.knock()
// => true
```

Immutable computations can be created from door locks.

```js
// create a promise that is fulfilled when door opens
door.promise().then(
  () => console.log('door is opened'),
  () => console.log('door is closed')
)

// create a promise that is fulfilled when lock1 is unlocked
door.promise('lock1').then(
  () => console.log('lock1 unlock'),
  () => console.log('lock1 lock')
)

// create a promise that is fulfilled when lock1 and lock3 are unlocked
door.promise('lock1 lock3').then(
  () => console.log('both lock1 and lock3 unlock'),
  () => console.log('both lock1 and lock3 lock')
)
```


## Installation

```shell
npm install doors --save
```

[![NPM](https://nodei.co/npm/doors.png)](https://nodei.co/npm/doors/)


## Question

For questions and feedback please use our [twitter account](https://twitter.com/bredeleca). For support, bug reports and or feature requests please make sure to read our
<a href="https://github.com/bredele/contributing-guide/blob/master/guidelines.md" target="_blank">community guideline</a> and use the issue list of this repo and make sure it's not present yet in our reporting checklist.

## Contribution

doors is an open source project and would not exist without its community. If you want to participate please make sure to read our <a href="https://github.com/bredele/contributing-guide/blob/master/guidelines.md" target="_blank">guideline</a> before making a pull request. If you have any doors related project, component or other let everyone know in our wiki.

## License

The MIT License (MIT)

Copyright (c) 2016 Olivier Wietrich

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
