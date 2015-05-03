'use strict';

//note addition of $http
angular.module('photos')
.controller('PhotosController', ['$scope', '$stateParams', '$location', '$http', 'Socket', 'Authentication', 'Photos', 
	function($scope, $stateParams, $location, $http, Socket, Authentication, Photos) {
	  $scope.authentication = Authentication;

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


	  //var _sepiaImage= '';
	  //var _greyscaleImage= '';
	  var _invertImage= '';
	
	// Update existing Photo
$scope.update = function() {
var photo = $scope.photo;

photo.$update(function() {
//Socket.on('photo.updated', function(photo) {
//console.log('photo updated');
//});

$location.path('photos/' + photo._id);
}, function(errorResponse) {
$scope.error = errorResponse.data.message;
});
};
	  // Update existing Photo
	  $scope.updateFilter = function() {
	    
	    //var	sepiaImage = function(newSepiaImage) {
	    	 //console.log('client view title preview');
     // return angular.isDefined(newSepiaImage) ? (_sepiaImage = newSepiaImage) : _sepiaImage;
     
    //};
     var	invertImage = function(newInvertImage) {
	    	 console.log('client view title preview');

      //return angular.isDefined(newInvertImage) ? (_invertImage = newInvertImage) : _invertImage;
     
    };
    //var	greyscaleImage = function(newGreyscaleImage) {
     // return angular.isDefined(newGreyscaleImage) ? (_greyscaleImage = newGreyscaleImage) : _greyscaleImage;
      
    //};
    var photo = $scope.photo;
	    photo.$update(function() {
	      $location.path('photos/' + photo._id);
	    }, function(errorResponse) {
		 $scope.error = errorResponse.data.message;
	       });
	 
	  //notify socket when updated
	  $http.put('photos/' + photo._id).success(function() {
             Socket.on('photo.updated', function(photo) {
		    console.log('photo updated');
		});

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

         };  
        }]);
/*
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
    	
}]);


 */
