define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.startTypeController',['$scope','$filter','$location','$auth',
    'auth.authFactory','shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.startTypeList = [];
      $scope.startType = {};
      $scope.crudOption = '';

      $scope.startTypeListAlert = null;
      $scope.startTypeListLoading = false;
      $scope.startTypeCrudAlert = null;
      $scope.startTypeCrudLoading = false;

      var uploader = $scope.uploader = new FileUploader();
      uploader.onAfterAddingFile  = function(item) {
        uploader.queue = [];
        uploader.queue[0] = item;
      };

      $scope.getStartTypeList = function() {
        $scope.startTypeListLoading = true;
        $scope.startTypeList = [];
        authFactory.get({entity:'startTypes'}).then(function(result) {
          $scope.startTypeList = result.data;
          $scope.startTypeListLoading = false;
        }, function (error) {
          $scope.startTypeList = [];
          $scope.startTypeListLoading = false;
        });
      };

      $scope.getStartTypeList();

      $scope.goAddStartType = function() {
        $scope.subOption = 2;
        $scope.startType = {};
        $scope.crudOption = 'Agregar';
        $scope.startTypeListAlert = null;
        $scope.startTypeCrudAlert = null;
      };

      $scope.goEditStartType = function(startType) {
        $scope.subOption = 3;
        $scope.startType = startType;
        $scope.crudOption = 'Editar';
        $scope.startTypeListAlert = null;
        $scope.startTypeCrudAlert = null;
        downloadPicture();
      };

      function downloadPicture() {
        if ($scope.startType.picture) {
          $scope.startTypeCrudLoading = true;
          imageFactory.getImage($scope.startType.picture)
          .then(function(data) {
            var file = new File([data], $scope.startType.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.startType.picture;
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

      $scope.goRemoveStartType = function(startType) {
        $scope.cleanAlertStartTypeList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar el Tipo de Inicio ' + startType.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.startTypeListLoading = true;
          authFactory.delete({entity:'startType',id:startType.id})
          .then(function(result) {
            $scope.startTypeListAlert = errorFactory.getCustomAlert('success','Tipo de Inicio eliminado satisfactoriamente');
            $scope.getStartTypeList();
          }, function (error) {
            $scope.startTypeListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.startTypeSubmit = function() {
        if ($scope.uploader.queue.length === 1) {
          var fd = new FormData();

          fd.append('file',$scope.uploader.queue[0]._file);
          fd.append('type','startType')

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
          $scope.startType.picture = pictureURL;
        }
        if ($scope.subOption === 2) {
          addStartType();
        } else if ($scope.subOption === 3) {
          editStartType();
        }
      }

      function addStartType() {
        $scope.startTypeCrudLoading = true;
        authFactory.save({entity:'startType'}, $scope.startType).then(function(result) {
          $scope.startTypeCrudLoading = false;
          $scope.startType = {};
          $scope.subOption = 1;
          $scope.startTypeListAlert = errorFactory.getCustomAlert('success','Tipo de Inicio agregado satisfactoriamente');
          $scope.getStartTypeList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      function editStartType() {
        $scope.startTypeCrudLoading = true;
        authFactory.edit({entity:'startType',id:$scope.startType.id}, $scope.startType).then(function(result) {
          $scope.startTypeCrudLoading = false;
          $scope.startType = {};
          $scope.subOption = 1;
          $scope.startTypeListAlert = errorFactory.getCustomAlert('success','Tipo de Inicio editado satisfactoriamente');
          $scope.getStartTypeList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getStartTypeList();
        $scope.startTypeListAlert = null;
        $scope.startTypeCrudAlert = null;
        uploader.queue = [];
      };

      function showError(error) {
        $scope.startTypeCrudLoading = false;
        $scope.startTypeCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertStartTypeList = function() {
        $scope.startTypeListAlert = null;
      };
  }]);

});
