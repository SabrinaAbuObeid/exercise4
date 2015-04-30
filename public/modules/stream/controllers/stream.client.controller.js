'use strict';

angular.module('stream').controller('StreamController', ['$scope', '$stateParams', 'Photos',
	function($scope, $stateParams, Photos) {
		// Stream controller logic
		 $scope.find = function() {
	    $scope.photos = Photos.query();
	  };
	

	// Find existing Photo
	  $scope.findOne = function() {
	    $scope.photo = Photos.get({ 
	      photoId: $stateParams.photoId
	    },

              function(){console.log('error');});

	  };
	}
]);