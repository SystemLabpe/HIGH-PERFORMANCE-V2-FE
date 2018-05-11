define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.fieldZoneController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.fieldZoneList = [];
      $scope.fieldZone = {};
      $scope.crudOption = '';

      $scope.fieldZoneListAlert = null;
      $scope.fieldZoneListLoading = false;
      $scope.fieldZoneCrudAlert = null;
      $scope.fieldZoneCrudLoading = false;

      var uploader = $scope.uploader = new FileUploader();
      uploader.onAfterAddingFile  = function(item) {
        uploader.queue = [];
        uploader.queue[0] = item;
      };

      $scope.getFieldZoneList = function() {
        $scope.fieldZoneListLoading = true;
        $scope.fieldZoneList = [];
        authFactory.get({entity:'fieldZones'}).then(function(result) {
          $scope.fieldZoneList = result.data;
          $scope.fieldZoneListLoading = false;
        }, function (error) {
          $scope.fieldZoneList = [];
          $scope.fieldZoneListLoading = false;
        });
      };

      $scope.getFieldZoneList();

      $scope.goAddFieldZone = function() {
        $scope.subOption = 2;
        $scope.fieldZone = {};
        $scope.crudOption = 'Agregar';
        $scope.fieldZoneListAlert = null;
        $scope.fieldZoneCrudAlert = null;
      };

      $scope.goEditFieldZone = function(fieldZone) {
        $scope.subOption = 3;
        $scope.fieldZone = fieldZone;
        $scope.crudOption = 'Editar';
        $scope.fieldZoneListAlert = null;
        $scope.fieldZoneCrudAlert = null;
        downloadPicture();
      };

      function downloadPicture() {
        if ($scope.fieldZone.picture) {
          imageFactory.getImage($scope.fieldZone.picture)
          .then(function(data) {
            var file = new File([data], $scope.fieldZone.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.fieldZone.picture;
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

      $scope.goRemoveFieldZone = function(fieldZone) {
        $scope.cleanAlertFieldZoneList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar la Zona ' + fieldZone.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.fieldZoneListLoading = true;
          authFactory.delete({entity:'fieldZone',id:fieldZone.id})
          .then(function(result) {
            $scope.fieldZoneListAlert = errorFactory.getCustomAlert('success','Zona de campo eliminada satisfactoriamente');
            $scope.getFieldZoneList();
          }, function (error) {
            $scope.fieldZoneListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.fieldZoneSubmit = function() {
        if ($scope.uploader.queue.length === 1) {
          $scope.fieldZoneCrudLoading = true;
          var fd = new FormData();

          fd.append('file',$scope.uploader.queue[0]._file);
          fd.append('type','fieldZone')

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
          $scope.fieldZone.picture = pictureURL;
        }
        if ($scope.subOption === 2) {
          addFieldZone();
        } else if ($scope.subOption === 3) {
          editFieldZone();
        }
      }

      function addFieldZone() {
        $scope.fieldZoneCrudLoading = true;
        authFactory.save({entity:'fieldZone'}, $scope.fieldZone).then(function(result) {
          $scope.fieldZoneCrudLoading = false;
          $scope.fieldZone = {};
          $scope.subOption = 1;
          $scope.fieldZoneListAlert = errorFactory.getCustomAlert('success','Zona de campo agregada satisfactoriamente');
          $scope.getFieldZoneList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      function editFieldZone() {
        $scope.fieldZoneCrudLoading = true;
        authFactory.edit({entity:'fieldZone',id:$scope.fieldZone.id}, $scope.fieldZone).then(function(result) {
          $scope.fieldZoneCrudLoading = false;
          $scope.fieldZone = {};
          $scope.subOption = 1;
          $scope.fieldZoneListAlert = errorFactory.getCustomAlert('success','Zona de campo editada satisfactoriamente');
          $scope.getFieldZoneList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getFieldZoneList();
        $scope.fieldZoneListAlert = null;
        $scope.fieldZoneCrudAlert = null;
        uploader.queue = [];
      };

      function showError(error) {
        $scope.fieldZoneCrudLoading = false;
        $scope.fieldZoneCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertFieldZoneList = function() {
        $scope.fieldZoneListAlert = null;
      };
  }]);

});
