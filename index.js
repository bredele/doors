
var View = require('view'),
		Door = require('doors'),
		Store = require('store'),
		EachPlugin = require('each-plugin'),
		EventPlugin = require('event-plugin');

var locks = new Door('demo', ['l1', 'l2']);
var door = document.querySelector('.door');


function closeDoor(){
	if(locks.keys.length === 0) {
		door.classList.remove('close');
	} else {
		door.classList.add('close');
	}
}

locks.on('open', function(){
	door.classList.remove('close');
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

		locks.toggle(name, target.classList.contains('on'));
		closeDoor();
	}
}));
view.alive(document.querySelector('.locks-panel'));
