
var View = require('view'),
		Door = require('doors'),
		Store = require('store'),
		EachPlugin = require('each-plugin'),
		EventPlugin = require('event-plugin'),
		query = require('query'),
		classes = require('classes');

var locks = new Door('demo', ['l1', 'l2']);
var door = query('.door');
var status = query('.status');


function closeDoor(){
	if(locks.keys.length === 0) {
		classes(door).remove('close');
		status.innerText = 'Open';
	} else {
		classes(door).add('close');
		status.innerText = 'Close';
	}
}

locks.on('open', function(){
	closeDoor();
});


var store = new Store([{
	name:'l1'
}, {
	name: 'l2'
}]);


var view = new View();
view.plugin('list', new EachPlugin(store));
view.plugin('event', new EventPlugin({
	add: function(){
		var length = store.data.length,
				name = 'l'+(length + 1);

		store.set(length, {
			name: name
		});

		locks.add(name);
		closeDoor();
	},
	toggle: function(el, node){
		var target = el.target,
				name = target.getAttribute('for').substring(1);

		locks.toggle(name, classes(target).has('on'));
		closeDoor();
	}
}));
view.alive(query('.locks-panel'));
