define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.progressionTypeController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.progressionTypeList = [];
      $scope.progressionType = {};
      $scope.crudOption = '';

      $scope.progressionTypeListAlert = null;
      $scope.progressionTypeListLoading = false;
      $scope.progressionTypeCrudAlert = null;
      $scope.progressionTypeCrudLoading = false;

      var uploader = $scope.uploader = new FileUploader();
      uploader.onAfterAddingFile  = function(item) {
        uploader.queue = [];
        uploader.queue[0] = item;
      };

      $scope.getProgressionTypeList = function() {
        $scope.progressionTypeListLoading = true;
        $scope.progressionTypeList = [];
        authFactory.get({entity:'progressionTypes'}).then(function(result) {
          $scope.progressionTypeList = result.data;
          $scope.progressionTypeListLoading = false;
        }, function (error) {
          $scope.progressionTypeList = [];
          $scope.progressionTypeListLoading = false;
        });
      };

      $scope.getProgressionTypeList();

      $scope.goAddProgressionType = function() {
        $scope.subOption = 2;
        $scope.progressionType = {};
        $scope.crudOption = 'Agregar';
        $scope.progressionTypeListAlert = null;
        $scope.progressionTypeCrudAlert = null;
      };

      $scope.goEditProgressionType = function(progressionType) {
        $scope.subOption = 3;
        $scope.progressionType = progressionType;
        $scope.crudOption = 'Editar';
        $scope.progressionTypeListAlert = null;
        $scope.progressionTypeCrudAlert = null;
        downloadPicture();
      };

      function downloadPicture() {
        if ($scope.progressionType.picture) {
          imageFactory.getImage($scope.progressionType.picture)
          .then(function(data) {
            var file = new File([data], $scope.progressionType.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.progressionType.picture;
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

      $scope.goRemoveProgressionType = function(progressionType) {
        $scope.cleanAlertProgressionTypeList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar el Tipo de Progresión ' + progressionType.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.progressionTypeListLoading = true;
          authFactory.delete({entity:'progressionType',id:progressionType.id})
          .then(function(result) {
            $scope.progressionTypeListAlert = errorFactory.getCustomAlert('success','Tipo de Progresión eliminado satisfactoriamente');
            $scope.getProgressionTypeList();
          }, function (error) {
            $scope.progressionTypeListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.progressionTypeSubmit = function() {
        if ($scope.uploader.queue.length === 1) {
          $scope.progressionTypeCrudLoading = true;
          var fd = new FormData();

          fd.append('file',$scope.uploader.queue[0]._file);
          fd.append('type','progressionType')

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
          $scope.progressionType.picture = pictureURL;
        }
        if ($scope.subOption === 2) {
          addProgressionType();
        } else if ($scope.subOption === 3) {
          editProgressionType();
        }
      }

      function addProgressionType() {
        $scope.progressionTypeCrudLoading = true;
        authFactory.save({entity:'progressionType'}, $scope.progressionType).then(function(result) {
          $scope.progressionTypeCrudLoading = false;
          $scope.progressionType = {};
          $scope.subOption = 1;
          $scope.progressionTypeListAlert = errorFactory.getCustomAlert('success','Tipo de Progresión agregado satisfactoriamente');
          $scope.getProgressionTypeList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      function editProgressionType() {
        $scope.progressionTypeCrudLoading = true;
        authFactory.edit({entity:'progressionType',id:$scope.progressionType.id}, $scope.progressionType).then(function(result) {
          $scope.progressionTypeCrudLoading = false;
          $scope.progressionType = {};
          $scope.subOption = 1;
          $scope.progressionTypeListAlert = errorFactory.getCustomAlert('success','Tipo de Progresión editado satisfactoriamente');
          $scope.getProgressionTypeList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getProgressionTypeList();
        $scope.progressionTypeListAlert = null;
        $scope.progressionTypeCrudAlert = null;
        uploader.queue = [];
      };

      function showError(error) {
        $scope.progressionTypeCrudLoading = false;
        $scope.progressionTypeCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertProgressionTypeList = function() {
        $scope.progressionTypeListAlert = null;
      };
  }]);

});
