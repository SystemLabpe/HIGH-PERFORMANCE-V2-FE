define(['shared/shared'],function(shared){
  'use strict';

  shared.factory('shared.imageFactory',['$http','$q','BASE_URL_IMG',
    function ($http,$q,BASE_URL_IMG){

      var imageFactory = {};

      imageFactory.getImage = function(imageName) {
        var deferred = $q.defer();

        $http.get(imageName, { responseType: "blob" })
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
          console.log('data -> ',data);
          console.log('status -> ',status);
          console.log('headers -> ',headers);
          console.log('config -> ',config);
        });

        return deferred.promise;
      };

      return imageFactory;
    }
  ]);
});
