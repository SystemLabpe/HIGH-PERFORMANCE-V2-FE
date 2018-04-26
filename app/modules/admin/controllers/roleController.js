define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory'], function(admin){
  'use strict';

  admin.controller('admin.roleController',['$scope','auth.authFactory','shared.modalFactory','MESSAGE',
    function ($scope,authFactory,modalFactory,MESSAGE) {

      $scope.step = 1;
      $scope.formType = '';
      $scope.role = null;
      $scope.roleList = [];
      $scope.loading = false;
      $scope.alert = null;

      var userRoleId = localStorage.getItem('userRoleId');

      function getRoleList() {
        loading();
        $scope.roleList = [];
        authFactory.list({entity:'role'}).then(function(response) {
          loaded();
          if(response.status === 200) {
            $scope.roleList = response.data;
          } else {
            showError(response.statusText);
          }
        }, function (error) {
          showError(error);
        });
      }

      $scope.goAdd = function() {
        $scope.cleanAlert();
        $scope.step = 2;
        $scope.formType = 'Agregar Rol';
        $scope.role = {};
      };

      $scope.goEdit = function(role) {
        $scope.cleanAlert();
        $scope.role = role;
        $scope.step = 2;
        $scope.formType = 'Editar Rol';
      };

      $scope.goDelete = function(role) {
        $scope.cleanAlert();
        var modalData = {
          tittle:'Confirme eliminación',
          message:'¿Desea eliminar el rol ' + role.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          var update_date = role.update_date;
          authFactory.delete({entity:'role',id:role.id,param1:userRoleId,param2:update_date})
          .then(function(result) {
            loaded();
            if(result.status === 200) {
              $scope.alert = MESSAGE.SUCCESS;
              $scope.alert.TEXT = 'Rol eliminado satisfactoriamente';
              getRoleList();
            } else {
              showError(result);
            }
          }, function (error) {
            showError(error);
          });
        });
      };

      function addRole() {
        var request = $scope.role;
        request.s_name = 'ROLE_' + $scope.role.name;
        request.userRoleId = userRoleId;

        authFactory.save({entity:'role'},request).then(function(result) {
          loaded();
          if(result.status === 200) {
            getRoleList();
            $scope.step = 1;
            $scope.role = {};
            $scope.alert = MESSAGE.SUCCESS;
            $scope.alert.TEXT = 'Rol agregado satisfactoriamente';
            getRoleList();
          } else {
            showError(result);
          }
        }, function (error) {
          showError(error);
        });
      };

      function editRole() {
        var request = $scope.role;
        request.userRoleId = userRoleId;

        authFactory.edit({entity:'role',id:$scope.role.id},request).then(function(result) {
          loaded();
          if(result.status === 200) {
            getRoleList();
            $scope.step = 1;
            $scope.role = {};
            $scope.alert = MESSAGE.SUCCESS;
            $scope.alert.TEXT = 'Rol editado satisfactoriamente';
          } else {
            showError(result);
          }
        }, function (error) {
          showError(error);
        });
      };

      $scope.submitForm = function() {
        $scope.role.id ? editRole() : addRole();
      }

      $scope.goBack = function() {
        $scope.step = 1;
      };

      $scope.cleanAlert = function() {
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

      getRoleList();

  }]);

});
