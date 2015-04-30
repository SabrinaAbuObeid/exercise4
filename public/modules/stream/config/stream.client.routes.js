'use strict';

//Setting up route
angular.module('stream').config(['$stateProvider',
	function($stateProvider) {
		// Stream state routing
		$stateProvider.
		state('stream', {
			url: '/stream',
			templateUrl: 'modules/stream/views/stream.client.view.html'
		});
	}
]);