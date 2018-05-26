define(['auth/auth'], function(auth){
  'use strict';

  auth.controller('auth.logoutController',['$scope','$location','$auth',
    function ($scope,$location,$auth){

      if (!$auth.isAuthenticated()) {
        $location.path('/');
      }

      function cleanStorage() {
        localStorage.clear();
        sessionStorage.clear();
      }

      cleanStorage();

      $auth.logout()
      .then(function() {
        $scope.$emit('navbar:authenticate',false);
        $location.path('/');
      });

  }]);

});
