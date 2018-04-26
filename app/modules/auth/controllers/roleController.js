define(['auth/auth'], function(auth){
  'use strict';

  auth.controller('auth.roleController',['$scope','$location','ROLE',
    function ($scope,$location,ROLE){

      $scope.ROLE = ROLE;
      $scope.roleList = JSON.parse(localStorage.getItem('roleList'));

      $scope.$emit('navbar:unselectRole');
      localStorage.removeItem('currentRole');
      localStorage.removeItem('userRoleId');

      $scope.goRole = function (role) {
        localStorage.setItem('currentRole',role.roleConstant);
        localStorage.setItem('userRoleId',role.userRoleId);
        $scope.$emit('navbar:selectRole',role.roleConstant);
        $location.path(ROLE[role.roleConstant].PATH);
      };
    }
  ]);

});
