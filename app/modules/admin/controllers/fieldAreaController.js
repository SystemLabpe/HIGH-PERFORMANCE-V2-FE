define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.fieldAreaController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.fieldAreaList = [];
      $scope.fieldArea = {};
      $scope.crudOption = '';

      $scope.fieldAreaListAlert = null;
      $scope.fieldAreaListLoading = false;
      $scope.fieldAreaCrudAlert = null;
      $scope.fieldAreaCrudLoading = false;

      var uploader = $scope.uploader = new FileUploader();
      uploader.onAfterAddingFile  = function(item) {
        uploader.queue = [];
        uploader.queue[0] = item;
      };

      $scope.getFieldAreaList = function() {
        $scope.fieldAreaListLoading = true;
        $scope.fieldAreaList = [];
        authFactory.get({entity:'fieldAreas'}).then(function(result) {
          $scope.fieldAreaList = result.data;
          $scope.fieldAreaListLoading = false;
        }, function (error) {
          $scope.fieldAreaList = [];
          $scope.fieldAreaListLoading = false;
        });
      };

      $scope.getFieldAreaList();

      $scope.goAddFieldArea = function() {
        $scope.subOption = 2;
        $scope.fieldArea = {};
        $scope.crudOption = 'Agregar';
        $scope.fieldAreaListAlert = null;
        $scope.fieldAreaCrudAlert = null;
      };

      $scope.goEditFieldArea = function(fieldArea) {
        $scope.subOption = 3;
        $scope.fieldArea = fieldArea;
        $scope.crudOption = 'Editar';
        $scope.fieldAreaListAlert = null;
        $scope.fieldAreaCrudAlert = null;
        downloadPicture();
      };

      function downloadPicture() {
        if ($scope.fieldArea.picture) {
          imageFactory.getImage($scope.fieldArea.picture)
          .then(function(data) {
            var file = new File([data], $scope.fieldArea.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.fieldArea.picture;
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

      $scope.goRemoveFieldArea = function(fieldArea) {
        $scope.cleanAlertFieldAreaList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar la Área ' + fieldArea.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.fieldAreaListLoading = true;
          authFactory.delete({entity:'fieldArea',id:fieldArea.id})
          .then(function(result) {
            $scope.fieldAreaListAlert = errorFactory.getCustomAlert('success','Área de campo eliminada satisfactoriamente');
            $scope.getFieldAreaList();
          }, function (error) {
            $scope.fieldAreaListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.fieldAreaSubmit = function() {
        if ($scope.uploader.queue.length === 1) {
          $scope.fieldAreaCrudLoading = true;
          var fd = new FormData();

          fd.append('file',$scope.uploader.queue[0]._file);
          fd.append('type','fieldArea')

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
          $scope.fieldArea.picture = pictureURL;
        }
        if ($scope.subOption === 2) {
          addFieldArea();
        } else if ($scope.subOption === 3) {
          editFieldArea();
        }
      }

      function addFieldArea() {
        $scope.fieldAreaCrudLoading = true;
        authFactory.save({entity:'fieldArea'}, $scope.fieldArea).then(function(result) {
          $scope.fieldAreaCrudLoading = false;
          $scope.fieldArea = {};
          $scope.subOption = 1;
          $scope.fieldAreaListAlert = errorFactory.getCustomAlert('success','Área de campo agregada satisfactoriamente');
          $scope.getFieldAreaList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      function editFieldArea() {
        $scope.fieldAreaCrudLoading = true;
        authFactory.edit({entity:'fieldArea',id:$scope.fieldArea.id}, $scope.fieldArea).then(function(result) {
          $scope.fieldAreaCrudLoading = false;
          $scope.fieldArea = {};
          $scope.subOption = 1;
          $scope.fieldAreaListAlert = errorFactory.getCustomAlert('success','Área de campo editada satisfactoriamente');
          $scope.getFieldAreaList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getFieldAreaList();
        $scope.fieldAreaListAlert = null;
        $scope.fieldAreaCrudAlert = null;
        uploader.queue = [];
      };

      function showError(error) {
        $scope.fieldAreaCrudLoading = false;
        $scope.fieldAreaCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertFieldAreaList = function() {
        $scope.fieldAreaListAlert = null;
      };
  }]);

});
