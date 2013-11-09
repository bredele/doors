
/**
 * Dependencies
 */

var View = require('view'),
		Stack = require('stack'),
		Listener = require('event-plugin'),
		query = require('query'),
		classes = require('classes');


//declare stack

var stack = new Stack(query('.content'));


//declare view

var current = query('.demo-btn.active'); //this is shit
var view = new View();
view.plugin('event', new Listener({
	switch: function(ev){
		var node = ev.target,
				classList = classes(node);

		if(classList.has('btn-demo1')) {
			stack.show('demo1');
		} else {
			stack.show('demo2');
		}

		//do a control plugin
		if(!current.isEqualNode(node)) {
			classes(current).remove('active');
			classList.add('active');
		}
		current = node;
	}
}));
view.alive( query('.header'));


//initialize stack

stack.add('demo1', require('./javascripts/demo1'));
stack.add('demo2', require('./javascripts/demo2'));
stack.show('demo1');