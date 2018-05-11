define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.invationLevelController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.invationLevelList = [];
      $scope.invationLevel = {};
      $scope.crudOption = '';

      $scope.invationLevelListAlert = null;
      $scope.invationLevelListLoading = false;
      $scope.invationLevelCrudAlert = null;
      $scope.invationLevelCrudLoading = false;

      var uploader = $scope.uploader = new FileUploader();
      uploader.onAfterAddingFile  = function(item) {
        uploader.queue = [];
        uploader.queue[0] = item;
      };

      $scope.getInvationLevelList = function() {
        $scope.invationLevelListLoading = true;
        $scope.invationLevelList = [];
        authFactory.get({entity:'invationLevels'}).then(function(result) {
          $scope.invationLevelList = result.data;
          $scope.invationLevelListLoading = false;
        }, function (error) {
          $scope.invationLevelList = [];
          $scope.invationLevelListLoading = false;
        });
      };

      $scope.getInvationLevelList();

      $scope.goAddInvationLevel = function() {
        $scope.subOption = 2;
        $scope.invationLevel = {};
        $scope.crudOption = 'Agregar';
        $scope.invationLevelListAlert = null;
        $scope.invationLevelCrudAlert = null;
      };

      $scope.goEditInvationLevel = function(invationLevel) {
        $scope.subOption = 3;
        $scope.invationLevel = invationLevel;
        $scope.crudOption = 'Editar';
        $scope.invationLevelListAlert = null;
        $scope.invationLevelCrudAlert = null;
        downloadPicture();
      };

      function downloadPicture() {
        if ($scope.invationLevel.picture) {
          imageFactory.getImage($scope.invationLevel.picture)
          .then(function(data) {
            var file = new File([data], $scope.invationLevel.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.invationLevel.picture;
            dummy.file.type = data.type;
            dummy.file.isProfile = false;

            dummy.progress = 100;
            dummy.size = 10000;
            dummy.isUploaded = true;
            dummy.isSuccess = true;

            uploader.queue.push(dummy);
          }, function() {

          });
        }
      }

      $scope.goRemoveInvationLevel = function(invationLevel) {
        $scope.cleanAlertInvationLevelList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar el Nivel de invasión ' + invationLevel.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.invationLevelListLoading = true;
          authFactory.delete({entity:'invationLevel',id:invationLevel.id})
          .then(function(result) {
            $scope.invationLevelListAlert = errorFactory.getCustomAlert('success','Nivel de invasión de campo eliminado satisfactoriamente');
            $scope.getInvationLevelList();
          }, function (error) {
            $scope.invationLevelListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.invationLevelSubmit = function() {
        if ($scope.uploader.queue.length === 1) {
          $scope.invationLevelCrudLoading = true;
          var fd = new FormData();

          fd.append('file',$scope.uploader.queue[0]._file);
          fd.append('type','invationLevel')

          authFactory.sendFile({entity:'file',method:'upload'},fd)
          .then(function(result) {
            save(result.data)
          }, function (error) {

          });
        } else {
          save();
        }
      };

      function save(pictureURL) {
        if (pictureURL) {
          $scope.invationLevel.picture = pictureURL;
        }
        if ($scope.subOption === 2) {
          addInvationLevel();
        } else if ($scope.subOption === 3) {
          editInvationLevel();
        }
      }

      function addInvationLevel() {
        $scope.invationLevelCrudLoading = true;
        authFactory.save({entity:'invationLevel'}, $scope.invationLevel).then(function(result) {
          $scope.invationLevelCrudLoading = false;
          $scope.invationLevel = {};
          $scope.subOption = 1;
          $scope.invationLevelListAlert = errorFactory.getCustomAlert('success','Nivel de invasión de campo agregado satisfactoriamente');
          $scope.getInvationLevelList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      function editInvationLevel() {
        $scope.invationLevelCrudLoading = true;
        authFactory.edit({entity:'invationLevel',id:$scope.invationLevel.id}, $scope.invationLevel).then(function(result) {
          $scope.invationLevelCrudLoading = false;
          $scope.invationLevel = {};
          $scope.subOption = 1;
          $scope.invationLevelListAlert = errorFactory.getCustomAlert('success','Nivel de invasión de campo editado satisfactoriamente');
          $scope.getInvationLevelList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getInvationLevelList();
        $scope.invationLevelListAlert = null;
        $scope.invationLevelCrudAlert = null;
        uploader.queue = [];
      };

      function showError(error) {
        $scope.invationLevelCrudLoading = false;
        $scope.invationLevelCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertInvationLevelList = function() {
        $scope.invationLevelListAlert = null;
      };
  }]);

});
