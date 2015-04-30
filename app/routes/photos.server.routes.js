'use strict';
/**
 * Module dependencies.
 */
  var users = require('../../app/controllers/users.server.controller'),
   photos = require('../../app/controllers/photos.server.controller'),
   multer = require('multer');
module.exports = function(app) {

  
  app.use(multer({ dest:'./public/uploads'}));
  // Photos Routes
  app.route('/photos')
		.get(photos.list)
		.post(users.requiresLogin, photos.create);

	app.route('/photos/:photoId')
		.get(photos.read)
		.put(users.requiresLogin, photos.hasAuthorization, photos.update)
		.delete(users.requiresLogin, photos.hasAuthorization, photos.delete);


			//adds a route for likes

 
 // app.route('/photos/like/:photoId')
       // .put(users.requiresLogin, photos.like);


	// Finish by binding the Photo middleware
	app.param('photoId', photos.photoByID);


      
   
	
};
	
	

















