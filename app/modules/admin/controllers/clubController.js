define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.clubController',['$scope','$filter','$auth','auth.authFactory','shared.modalFactory','shared.errorFactory',
    function ($scope,$filter,$auth,authFactory,modalFactory,errorFactory) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.club = {};
      $scope.adminList = [];
      $scope.clubAdmin = {};
      $scope.clubSubmitButton = '';
      if(sessionStorage.getItem('club')) {
        $scope.club = JSON.parse(sessionStorage.getItem('club'));
        $scope.clubSubmitButton = 'Editar';
      } else {
        $scope.clubSubmitButton = 'Agregar';
      }

      $scope.clubLoading = false;
      $scope.clubAlert = null;
      $scope.clubAdminLoading = false;
      $scope.clubAdminAlert = null;
      $scope.clubAdminListLoading = false;

      $scope.submitClub = function() {
        $scope.cleanAlertClub();
        loadingClub();
        if ($scope.club.id) {
          authFactory.edit({entity:'clubs', method:'customer', id: $scope.club.id}, $scope.club).then(function(result) {
            loadedClub();
            $scope.clubAlert = errorFactory.getCustomAlert('success','Club editado satisfactoriamente');
          }, function (error) {

          });
        } else {
          authFactory.save({entity:'clubs', method:'customer'}, $scope.club).then(function(result) {
            loadedClub();
            $scope.club = result.data;
            $scope.clubAlert = errorFactory.getCustomAlert('success','Club agregado satisfactoriamente');
            sessionStorage.setItem('club',JSON.stringify($scope.club));
            $scope.clubSubmitButton = 'Editar';
          }, function (error) {

          });
        }
      };

      $scope.getAdminList = function() {
        $scope.clubAdminListLoading = true;
        $scope.adminList = [];
        authFactory.get({entity:'users', method:'club', id:$scope.club.id}).then(function(result) {
          $scope.adminList = result.data;
          $scope.clubAdminListLoading = false;
        }, function (error) {
          $scope.adminList = [];
          $scope.clubAdminListLoading = false;
        });
      };

      if (sessionStorage.getItem('club')) {
        $scope.getAdminList();
      }


      $scope.goAddAmin = function() {
        $scope.subOption = 2;
        $scope.clubAdmin = {};
        $scope.crudOption = 'Agregar';
        $scope.cleanAlertClubAdminError();
      };

      $scope.goEditAdmin = function(admin) {
        $scope.subOption = 3;
        $scope.clubAdmin = admin;
        $scope.crudOption = 'Editar';
        $scope.cleanAlertClubAdminError();
      };

      $scope.goRemoveAdmin = function(admin) {
        $scope.cleanAlertClubAdmin();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar al administrador ' + admin.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.clubAdminListLoading = true;
          authFactory.delete({entity:'user',method:'club',id:admin.id})
          .then(function(result) {
            $scope.clubAdminAlert = errorFactory.getCustomAlert('success','Administrador eliminado satisfactoriamente');
            $scope.getAdminList();
          }, function (error) {
            $scope.clubAdminAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.clubAdminSubmit = function() {
        if ($scope.subOption === 2) {
          addClubAdmin();
        } else if ($scope.subOption === 3) {
          editClubAdmin();
        }
      };

      function addClubAdmin() {
        loadingClubAdmin();
        authFactory.save({entity:'user',method:'club',id:$scope.club.id}, $scope.clubAdmin).then(function(result) {
          loadedClubAdmin();
          $scope.clubAdmin = {};
          $scope.subOption = 1;
          $scope.clubAdminAlert = errorFactory.getCustomAlert('success','Administrador agregado satisfactoriamente');
          $scope.getAdminList();
        }, function (error) {
          showError(error);
        });
      }

      function editClubAdmin() {
        loadingClubAdmin();
        authFactory.edit({entity:'user',method:'club',id:$scope.clubAdmin.id}, $scope.clubAdmin).then(function(result) {
          loadedClubAdmin();
          $scope.clubAdmin = {};
          $scope.subOption = 1;
          $scope.clubAdminAlert = errorFactory.getCustomAlert('success','Administrador editado satisfactoriamente');
          $scope.getAdminList();
        }, function (error) {
          console.log('ERRROR')
          showError(error);
        });
      }

      $scope.cleanAlertClub = function() {
        $scope.clubAlert = null;
      };

      $scope.cleanAlertClubAdmin = function() {
        $scope.clubAdminAlert = null;
      };

      $scope.cleanAlertClubAdminError = function() {
        $scope.clubAdminAlertError = null;
      };

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getAdminList();
        $scope.cleanAlertClub();
        $scope.cleanAlertClubAdmin();
        $scope.cleanAlertClubAdminError();
      };

      function showError(error) {
        loadedClub();
        loadedClubAdmin();
        $scope.clubAdminAlertError = $filter('errorFilter')(error.data.data.code);
        console.log('$scope.clubAdminAlertError -> ',$scope.clubAdminAlertError);
      }

      function loadingClubAdmin() {
        $scope.clubAdminLoading = true;
      }

      function loadedClubAdmin() {
        $scope.clubAdminLoading = false;
      }

      function loadingClub() {
        $scope.clubLoading = true;
      }

      function loadedClub() {
        $scope.clubLoading = false;
      }
  }]);

});
