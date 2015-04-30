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
  app.route('/stream')
		.get(photos.list);
		

	app.route('/photos/:photoId')
		.get(photos.read);

		

			
	// Finish by binding the Photo middleware
	app.param('photoId', photos.photoByID);
	
};
	
	

















