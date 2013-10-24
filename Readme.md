
# doors

  door pattern

## Installation

  Install with [component(1)](http://component.io):

    $ component install bredele/doors

## API

  - [Doors()](#doors)
  - [Doors.has()](#doorshaskeystring)
  - [Doors.add()](#doorsaddnamestring)
  - [Doors.lock()](#doorslock)
  - [Doors.unlock()](#doorsunlock)
  - [Doors.toggle()](#doorstogglenamestringboolboolean)
  - [Doors.open()](#doorsopen)

### Doors()

  Doors constructor.

### Doors.has(key:String)

  Has key.

### Doors.add(name:String)

  Add lock.

### Doors.lock()

  Lock a previously added lock.
  Examples:
  
```js
  door.lock('olivier'); //lock 'olivier'
  door.lock('olivier', 'amy'); //lock 'olivier' and 'amy'
  door.lock(); //lock all the locks
```

### Doors.unlock()

  Unlock door's lock(s).
  Examples:
  
```js
  door.unlock('olivier'); //unlock 'olivier'
  door.unlock('olivier', 'amy'); //unlock 'olivier' and 'amy'
  door.unlock(); //unlock all the locks
```

### Doors.toggle(name:String, bool:Boolean)

  Toggle Lock.

### Doors.open()

  Open the door only if all locks are unlocked.
  and emit open event.



## License

  MIT
