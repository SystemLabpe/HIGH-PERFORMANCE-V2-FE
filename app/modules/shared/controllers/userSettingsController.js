define(['admin/admin','../../auth/factories/authFactory'], function(admin){
  'use strict';

  admin.controller('shared.userSettingsController',['$scope','$http','$auth','auth.authFactory',
    function ($scope,$http,$auth,authFactory) {

      $scope.ifRoleList = false;
      var roleList = JSON.parse(localStorage.getItem('roleList'));
      if (roleList.length > 1) {
        $scope.ifRoleList = true;
      }

  }]);

});
