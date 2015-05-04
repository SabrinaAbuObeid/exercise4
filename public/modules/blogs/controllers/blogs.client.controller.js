'use strict';

// Blogs controller
angular.module('blogs').controller('BlogsController', ['$scope', '$stateParams', '$location', '$http', 'Socket', 'Authentication', 'Blogs',
	function($scope, $stateParams, $location, $http, Socket, Authentication, Blogs) {
		$scope.authentication = Authentication;

var blog = new Blogs ({
	      name: $scope.imageName,
              file: $scope.imageFile,

	    });

		// Create new Blog
		$scope.create = function() {
			// Create new Blog object
			var blog = new Blogs ({
				name: $scope.imageName,
              file: $scope.imageFile,
              //title: $scope.imageTitle,
				//content: $scope.imageContent,
				title: this.title,
				content: this.content,
			});

			// Redirect after save
			blog.$save(function(response) {
				$location.path('blogs/' + response._id);

				// Clear form fields
				$scope.imageName = '';
              	$scope.imageFile = '';
              	$scope.title = '';
				$scope.content = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Blog
		$scope.remove = function(blog) {
			if ( blog ) { 
				blog.$remove();

				for (var i in $scope.blogs) {
					if ($scope.blogs [i] === blog) {
						$scope.blogs.splice(i, 1);
					}
				}
			} else {
				$scope.blog.$remove(function() {
					$location.path('blogs');
				});
			}
		};

		// Update existing Blog
		$scope.update = function() {
			var blog = $scope.blog;

			blog.$update(function() {
				Socket.on('photo.updated', function(photo) {
		   		console.log('photo updated');
				});
				$location.path('blogs/' + blog._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Blogs
		$scope.find = function() {
			$scope.blogs = Blogs.query();
		};

		// Find existing Blog
		$scope.findOne = function() {
			$scope.blog = Blogs.get({ 
				blogId: $stateParams.blogId
			});
		};
	}
]);
/*.directive('fileModel', ['$parse', function ($parse) {
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