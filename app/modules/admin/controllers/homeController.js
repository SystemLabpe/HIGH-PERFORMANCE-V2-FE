define(['admin/admin','../../auth/factories/authFactory'], function(admin){
  'use strict';

  admin.controller('admin.homeController',['$scope','$http','$auth','auth.authFactory',
    function ($scope,$http,$auth,authFactory) {

      $scope.text = 'ADMIN - HOME';

      $scope.testAuth = function() {
        authFactory.list({method:'getUser'}).then(function(result) {
          console.log('test Auth -> ', result);
        }, function (error) {
          console.log('ERROR AUTH: ', error);
        });
      };

  }]);

});
