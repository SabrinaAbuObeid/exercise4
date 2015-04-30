'use strict';

// Authentication service for prof pic
angular.module('users').factory('ItemsService', ['$http','$rootScope', function($http, $rootScope) 
{
    var service={};

    service.saveItem = function(item, image)
    {

        var fd = new FormData();
        fd.append('file', image);
        fd.append('item', JSON.stringify(item));
        $http.post('items/', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
            console.log('success add new item');
        })
        .error(function(e){
            console.log('error add new item', e);
        });


    };

    return service;

}

]);