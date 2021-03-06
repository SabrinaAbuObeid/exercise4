'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Jimp = require('jimp'),
	Photo = mongoose.model('Photo'),
	_ = require('lodash');







/**
 * Create a Photo
 */
exports.create = function(req, res) {
  console.log(req.body);
  console.log(req.files);
  
  var photo = new Photo(req.body);
  photo.user = req.user;
  //photo.likes.push(req.user._id);


  if(req.files.image) {
    photo.image =req.files.image.path.substring(7);
    console.log(photo.image);
  }  else
    photo.image='default.jpg';

	photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.redirect('/#!/photos/'+photo._id); 
		}
	});
};

/**
 * Show the current Photo
 */
exports.read = function(req, res) {
	req.photo.views += 1;
	req.photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
			res.jsonp(req.photo);
		});
};


/**
 * Likes a photo
 */
exports.like = function(req, res) {
  var user = req.user;
  var containsValue = false;

  // Determine if user is already in 
  for(var i=0; i<req.photo.likes.length; i++) {
    console.log('Comparing ' + req.photo.likes[i] + ' to ' + req.user._id + ' is ' + req.photo.likes[i].equals(req.user._id));
    if(req.photo.likes[i].equals(req.user._id)) {
      containsValue = true;
      var photo = req.photo ;
      var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
			socketio.sockets.emit('photo.liked', photo); // emit an event for all connected clients
    }
  }
  if(!containsValue) {
	req.photo.likes.push(req.user._id);
  }
  req.photo.save(function(err) {
    if (err) {
      return res.status(400).send({
		message: errorHandler.getErrorMessage(err)
      });
    } else {
    	
      res.jsonp(req.photo);
	 }
  });
};



/**
 * Update a Photo
 */
exports.update = function(req, res) {
	var photo = req.photo ;
	
	photo = _.extend(photo , req.body);
	
	var invertImage = req.invertImage;
	var greyscaleImage = req.greyscaleImage;
	var sepiaImage = req.greyscaleImage;
	
	photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
				
			invertImage = new Jimp('./public/'+photo.image, function () 
			{
  			this.invert(); 
  			photo.image = photo.image.substring(0, photo.image.indexOf('.'))+'-inv'+photo.image.substring(photo.image.indexOf('.'), photo.image.length);
  			this.write('./public/'+photo.image); 
  			res.jsonp(photo);
  			
			});
		
	
		/*
		 if(photo.greyscaleImage){
			greyscaleImage = new Jimp('./public/'+photo.image, function () 
			{
  			this.greyscale(); 
  			//photo.image = photo.image.substring(0, photo.image.indexOf('.'))+'-gre'+photo.image.substring(photo.image.indexOf('.'), photo.image.length);
  			this.write('./public/'+photo.image); 

  			
			});
		
		}
		if(photo.sepiaImage){
			sepiaImage = new Jimp('./public/'+photo.image, function () 
			{
  			this.sepia(); 
  			//photo.image = photo.image.substring(0, photo.image.indexOf('.'))+'-sep'+photo.image.substring(photo.image.indexOf('.'), photo.image.length);
  			this.write('./public/'+photo.image); 

  			
			});
		
		}*/
		
	}
	var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
			socketio.sockets.emit('photo.updated', photo); // emit an event for all connected clients
		
	});
};





/**
 * Delete an Photo
 */
exports.delete = function(req, res) {
	var photo = req.photo ;

	photo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			
			res.jsonp(photo);
		}
	});
};

/**
 * List of Photos
 */
exports.list = function(req, res) { 
	Photo.find().sort('-created').populate('user', 'displayName').exec(function(err, photos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photos);
		}
	});
};

/**
 * Photo middleware
 */
exports.photoByID = function(req, res, next, id) { 
	Photo.findById(id).populate('user', 'displayName').exec(function(err, photo) {
		if (err) return next(err);
		if (! photo) return next(new Error('Failed to load Photo ' + id));
		req.photo = photo ;
		next();
	});
};

/**
 * Photo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.photo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};