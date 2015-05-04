'use strict';

// Configuring the Articles module
angular.module('blogs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Blogs', 'blogs', 'dropdown', '/blogs(/create)?');
		Menus.addSubMenuItem('topbar', 'blogs', 'List Blogs', 'blogs');
		Menus.addSubMenuItem('topbar', 'blogs', 'New Blog', 'blogs/create');
	}
]);