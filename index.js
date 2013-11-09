
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

var view = new View();
view.plugin('event', new Listener({
	switch: function(ev){
		if(classes(ev.target).has('btn-demo1')) {
			stack.show('demo1');
		} else {
			stack.show('demo2');
		}
	}
}));
view.alive( query('.header'));


//initialize stack

stack.add('demo1', require('./javascripts/demo1'));
stack.add('demo2', require('./javascripts/demo2'));
stack.show('demo1');