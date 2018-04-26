define(['auth/auth','auth/filters/roleFilter'], function(auth){
  'use strict';

  auth.controller('auth.loginController',['$scope','$auth','$filter','$location','ROLE','MESSAGE',
    function ($scope,$auth,$filter,$location,ROLE,MESSAGE){

      $scope.loading = false;

      $scope.login = function() {
        loading();
        $scope.cleanAlert();
        var roles = [];
        $auth.login($scope.user)
        .then(function(response) {
          loaded();
          if (response.status === 200) {
            roles = response.data.userRoleList;
            var rolesStorage = [];
            //change username
            localStorage.setItem('username',$scope.user.account);
            $scope.$emit('navbar:authenticate',true);
            if (roles.length > 1) {
              angular.forEach(roles, function (role,key) {
                var roleStorage = {
                  roleConstant: $filter('roleFilter')(role.roleId),
                  userRoleId: role.userRoleId
                };
                rolesStorage.push(roleStorage);
              });
              localStorage.setItem('roleList',JSON.stringify(rolesStorage));
              $location.path('/roles');
            } else {
              var roleId = roles[0].roleId;
              var roleName = $filter('roleFilter')(roleId);
              rolesStorage.push($filter('roleFilter')(roleId));
              localStorage.setItem('roleList',JSON.stringify(rolesStorage));
              localStorage.setItem('currentRole',roleName);
              localStorage.setItem('userRoleId',roles[0].userRoleId);
              $scope.$emit('navbar:selectRole',roleName);
              $location.path(ROLE[roleName].PATH);
            }
          } else {
            showError(response.statusText);
          }
        }, function (error) {
          showError(error);
        });
      };

      $scope.cleanAlert = function(){
        $scope.alert = null;
      };

      function showError(error) {
        loaded();
        $scope.alert = MESSAGE.ERROR;
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
