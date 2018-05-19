define(['auth/auth', 'auth/factories/authFactory','auth/filters/roleFilter','shared/filters/errorFilter'], function(auth){
  'use strict';

  auth.controller('auth.loginController',['$scope','$auth','$filter','$location', 'auth.authFactory','ROLE','MESSAGE',
    function ($scope,$auth,$filter,$location,authFactory,ROLE,MESSAGE){

      $scope.loading = false;

      $scope.login = function() {
        loading();
        $scope.cleanAlert();
        var roles = [];
        $auth.login($scope.user)
        .then(function(response) {
          loaded();
          getUserRole();
        }, function (error) {
          error.data.code = 401;
          showError(error);
        });
      };

      function getUserRole() {
        authFactory.get({method:'me'}).then(function(result) {
          loaded();
          localStorage.setItem('username', result.name);
          var roleId = result.u_type;
          var roleName = $filter('roleFilter')(roleId);
          localStorage.setItem('currentRole',roleName);
          $scope.$emit('navbar:authenticate',true);
          $scope.$emit('navbar:selectRole',roleName);
          if (result.club) {
            localStorage.setItem('myClub', JSON.stringify(result.club));
            $scope.$emit('navbar:setMyClub');
          }
          $location.path(ROLE[roleName].PATH);
        }, function (error) {

        });
      }

      $scope.cleanAlert = function(){
        $scope.alert = null;
      };

      function showError(error) {
        loaded();
        $scope.alert = $filter('errorFilter')(error.data.code);
        console.log('error -> ',error);
      }

      function loading() {
        $scope.loading = true;
      }

      function loaded() {
        $scope.loading = false;
      }

    }
  ]);

});
