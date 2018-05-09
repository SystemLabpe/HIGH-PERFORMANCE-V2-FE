define(['shared/shared'],function(shared){
  'use strict';

  shared.factory('shared.imageFactory',['$http','$q','BASE_URL',
    function ($http,$q,BASE_URL){

      var imageFactory = {};

      imageFactory.getImage = function(imageName) {
        var deferred = $q.defer();

        $http.get(imageName, { responseType: "blob",
          headers: {'Access-Control-Allow-Origin': '*'}
        })
        // $http.get(BASE_URL + '/file/retrieve/test/qApm7u9BEPRZfsXWs1YbFxyRH5nTjy2ubOaEnKjF/png', { responseType: "blob", })
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
