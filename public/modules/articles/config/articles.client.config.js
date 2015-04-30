'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Photo Blogs', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'Photo Blog Stream', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Photo Blog', 'articles/create');
	}
]);