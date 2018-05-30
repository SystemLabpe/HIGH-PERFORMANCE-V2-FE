define(['shared/shared','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(shared){
  'use strict';

  shared.controller('shared.profileController',['$scope','$filter','$location','$auth','auth.authFactory','shared.modalFactory','shared.errorFactory',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory) {

      $scope.profileLoading = true;
      authFactory.get({method:'me'}).then(function(result) {
        $scope.user = result;
        localStorage.setItem('username', result.name);
        var roleId = result.u_type;
        var roleName = $filter('roleFilter')(roleId);
        $scope.$emit('navbar:selectRole',roleName);
        $scope.profileLoading = false;
      }, function (error) {

      });

      $scope.profileSubmit = function() {
        $scope.profileAlert = null;
        if (validateUser()) {
          $scope.profileLoading = false;
          authFactory.edit({method:'me'}, $scope.user).then(function(result) {
            localStorage.setItem('username', result.name);
            var roleId = result.u_type;
            var roleName = $filter('roleFilter')(roleId);
            $scope.$emit('navbar:selectRole',roleName);
            $scope.profileLoading = false;
            $scope.profileAlert = {TYPE:'success', TEXT:'Usario editado satisfactoriamente'};
          }, function (error) {
            console.log('error => ',  $filter('errorFilter')(error.data.data.code));
            $scope.profileAlert = $filter('errorFilter')(error.data.data.code);
          });
        }
      };

      function validateUser() {
        if ($scope.user.password !== $scope.user.confirm_password) {
          $scope.profileAlert = errorFactory.getCustomAlert('danger','Las contraseñas no coinciden');
          return false;
        }
        return true;
      }

    }
  ]);

});
