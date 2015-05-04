'use strict';

//note addition of $http
angular.module('photos')
.controller('PhotosController', ['$scope', '$stateParams', '$location', '$http', 'Socket', 'Authentication', 'Photos', 
	function($scope, $stateParams, $location, $http, Socket, Authentication, Photos) {
	  $scope.authentication = Authentication;
	  $scope.invertImage = 0;
	  $scope.likes = 0;
	  $scope.isLiked = false;

var photo = new Photos ({
	      name: $scope.imageName,
              file: $scope.imageFile,

	    });





		// Create new Photo

	  $scope.create = function() {
	    // Create new Photo object
	    var photo = new Photos ({
	      name: $scope.imageName,
              file: $scope.imageFile,

	    });
	    photo.$save(function(response) {
	      $location.path('photos/' + response._id);
	      // Clear form fields
	      $scope.imageName = '';
              $scope.imageFile = '';

	    }, function(errorResponse) {
		 $scope.error = errorResponse.data.message;
	       });
            
	  };
	  //Swipe to remove photo from display
	  //$scope.hide = function($index) {
		//$scope.photos.splice($index,1);
	  //};

	  
	  // Remove existing Photo
	  $scope.remove = function(photo) {
	    if ( photo ) { 
	      photo.$remove();
              
	      for (var i in $scope.photos) {
		if ($scope.photos [i] === photo) {
		  $scope.photos.splice(i, 1);
		}
	      }
	    } else {
	      $scope.photo.$remove(function() {
		$location.path('photos');
	      });
	    }
	  };


	
		
	  /* -----Update existing Photo with a filter (same thing as the update function except is called updateFilter 
	  so it can connect to jimp separately)-------*/

	  $scope.updateFilter = function(updateFilter) {
  	    $scope.photo.invertImage =1;
	   var photo = $scope.photo;
	    var invertImage = $scope.invertImage;
	    photo.$update(function() {
	    	 Socket.on('photo.updated', function(photo) {
		    console.log('photo updated');
		    //$location.path('photos/' + photo._id);

		});
	  
	  var _invertImage= '';
	  invertImage = function(newInvertImage) {
	  console.log('client view filter preview');
      return angular.isDefined(newInvertImage) ? (_invertImage = newInvertImage) : _invertImage;
      };

	  $http.get('/uploads/' + photo._id ).success(function(invertImage) {
	  	});
		$http.put('/uploads/' + photo._id ).success(function(invertImage) {
	  	});

 /* 
-------I tried the above commented out code in many forms changing paths and also changing photo._id to photo.image and there
			always seems to be an error. The code works the same with or with out them and what really breaks it is if
			I remove the location.path code below. I feel like this is where the error is because it isn't loading the result
			on it's own but the filter applies.-------------------------------------------------------------------------
	  	*/
	  	console.log('The invertImage CLIENT function has been accessed.');
	  
	      $location.path('photos/' + photo._id);
	    }, function(errorResponse) {
		 $scope.error = errorResponse.data.message;
	       });


	   


/* THE BELOW CODE IS FOR REALTIME VIEW OF THE FILTERS. IT WORKS WITH OUR BLOG SECTION
SO ONCE FILTERS WORK, LITTLE TO NO TWEAKING WILL MAKE THIS WORK. THIS IS NOT AFFECTING
THE CODE AS OF NOW*/
	

      //var _sepiaImage= '';
	  //var _greyscaleImage= '';
	  
	  /*var sepiaImage = function(newSepiaImage) {
	    	 console.log('client view title preview');
      return angular.isDefined(newSepiaImage) ? (_sepiaImage = newSepiaImage) : _sepiaImage;
      };*/ 
      /* var greyscaleImage = function(newGreyscaleImage) {
      return angular.isDefined(newGreyscaleImage) ? (_greyscaleImage = newGreyscaleImage) : _greyscaleImage;
      };*/
	  };






	  // Update existing Photo
	  $scope.update = function() {
	    var photo = $scope.photo;

	    photo.$update(function() {
	    	 Socket.on('photo.updated', function(photo) {
		    console.log('photo updated');
		});

	      $location.path('photos/' + photo._id);
	    }, function(errorResponse) {
		 $scope.error = errorResponse.data.message;
	       });
	  };



	  // Find a list of Photos
	  $scope.find = function() {
	    $scope.photos = Photos.query();
	  };

	  // Find existing Photo
	  $scope.findOne = function() {
	    $scope.photo = Photos.get({ 
	      photoId: $stateParams.photoId
	    },
	    function(){
                var user = $scope.authentication.user;
                var containsValue=false;
                if($scope.authentication.user) {
					console.log('ID '+$scope.authentication.user._id);
					$scope.likes = $scope.photo.likes.length;
					for(var i=0; i<$scope.photo.likes.length; i++) {
						console.log('Comparing ' + $scope.photo.likes[i] + ' to ' + user._id + ' is ' + ($scope.photo.likes[i]===user._id).toString());
						if($scope.photo.likes[i]===user._id) {
							containsValue = true;
						}
					}
				}
                $scope.isLiked = containsValue;
              },

              function(){console.log('error');});

	  };
         



   
	  //Like a photo
	 
	  $scope.likeThis = function() {
	  	$scope.photo.likes +=1;
	    var photo = $scope.photo;
	    $http.put('photos/like/' + photo._id).success(function() {
              // Update the photo with our user ID.
              photo.likes.push($scope.authentication.user._id);
              $scope.isLiked=true;

	    });

	    
	    console.log('like function called');
			//saves the photo -- note the authorization problem in this version
			photo.$update(function() {
				$location.path('photos/' + photo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			 Socket.on('photo.liked', function(photo) {
		    console.log('photo liked');

		});
         };  
        }]);