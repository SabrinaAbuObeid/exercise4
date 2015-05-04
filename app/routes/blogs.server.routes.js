'use strict';
/**
 * Module dependencies.
 */
 var users = require('../../app/controllers/users.server.controller'),
   		blogs = require('../../app/controllers/blogs.server.controller'),
   		multer = require('multer');

module.exports = function(app) {
	//var users = require('../../app/controllers/users.server.controller');
	//var blogs = require('../../app/controllers/blogs.server.controller');
	app.use(multer({ dest:'./public/uploads'}));

	// Blogs Routes
	app.route('/blogs')
		.get(blogs.list)
		.post(users.requiresLogin, blogs.create);

	app.route('/blogs/:blogId')
		.get(blogs.read)
		.put(users.requiresLogin, blogs.hasAuthorization, blogs.update)
		.delete(users.requiresLogin, blogs.hasAuthorization, blogs.delete);

	// Finish by binding the Blog middleware
	app.param('blogId', blogs.blogByID);
};
