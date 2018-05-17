define(['club/club','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club){
  'use strict';

  club.controller('club.rivalCrudController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.rivalList = [];
      $scope.rival = {};
      $scope.crudOption = '';

      $scope.rivalListAlert = null;
      $scope.rivalListLoading = false;
      $scope.rivalCrudAlert = null;
      $scope.rivalCrudLoading = false;

      var uploader = $scope.uploader = new FileUploader();
      uploader.onAfterAddingFile  = function(item) {
        uploader.queue = [];
        uploader.queue[0] = item;
      };

      $scope.getRivalList = function() {
        $scope.rivalListLoading = true;
        $scope.rivalList = [];
        authFactory.get({entity:'clubs',method:'rivals'}).then(function(result) {
          $scope.rivalList = result.data;
          $scope.rivalListLoading = false;
        }, function (error) {
          $scope.rivalList = [];
          $scope.rivalListLoading = false;
        });
      };

      $scope.getRivalList();

      $scope.goAddRival = function() {
        $scope.subOption = 2;
        $scope.rival = {};
        $scope.crudOption = 'Agregar';
        $scope.rivalListAlert = null;
        $scope.rivalCrudAlert = null;
      };

      $scope.goEditRival = function(rival) {
        $scope.subOption = 3;
        $scope.rival = rival;
        $scope.crudOption = 'Editar';
        $scope.rivalListAlert = null;
        $scope.rivalCrudAlert = null;
        downloadPicture();
      };

      function downloadPicture() {
        if ($scope.rival.picture) {
          imageFactory.getImage($scope.rival.picture)
          .then(function(data) {
            var file = new File([data], $scope.rival.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.rival.picture;
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

      $scope.goRemoveRival = function(rival) {
        $scope.cleanAlertRivalList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar el Rival ' + rival.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.rivalListLoading = true;
          authFactory.delete({entity:'clubs',method:'rival',id:rival.id})
          .then(function(result) {
            $scope.rivalListAlert = errorFactory.getCustomAlert('success','Rival eliminado satisfactoriamente');
            $scope.getRivalList();
          }, function (error) {
            $scope.rivalListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.rivalSubmit = function() {
        if ($scope.uploader.queue.length === 1) {
          $scope.rivalCrudLoading = true;
          var fd = new FormData();

          fd.append('file',$scope.uploader.queue[0]._file);
          fd.append('type','club')

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
          $scope.rival.picture = pictureURL;
        }
        if ($scope.subOption === 2) {
          addRival();
        } else if ($scope.subOption === 3) {
          editRival();
        }
      }

      function addRival() {
        $scope.rivalCrudLoading = true;
        authFactory.save({entity:'clubs',method:'rival'}, $scope.rival).then(function(result) {
          $scope.rivalCrudLoading = false;
          $scope.rival = {};
          $scope.subOption = 1;
          $scope.rivalListAlert = errorFactory.getCustomAlert('success','Rival agregado satisfactoriamente');
          $scope.getRivalList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      function editRival() {
        $scope.rivalCrudLoading = true;
        authFactory.edit({entity:'clubs',method:'rival',id:$scope.rival.id}, $scope.rival).then(function(result) {
          $scope.rivalCrudLoading = false;
          $scope.rival = {};
          $scope.subOption = 1;
          $scope.rivalListAlert = errorFactory.getCustomAlert('success','Rival editado satisfactoriamente');
          $scope.getRivalList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getRivalList();
        $scope.rivalListAlert = null;
        $scope.rivalCrudAlert = null;
        uploader.queue = [];
      };

      function showError(error) {
        $scope.rivalCrudLoading = false;
        $scope.rivalCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertRivalList = function() {
        $scope.rivalListAlert = null;
      };
  }]);

});
