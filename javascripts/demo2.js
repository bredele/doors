
/**
 * Dependencies
 */

var View = require('view'),
		tmpl = require('./demo2.html');


//declare view

var view = new View();
view.template(tmpl);
view.alive();

module.exports = view.dom;