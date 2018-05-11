define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.playerPositionController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.playerPositionList = [];
      $scope.playerPosition = {};
      $scope.crudOption = '';

      $scope.playerPositionListAlert = null;
      $scope.playerPositionListLoading = false;
      $scope.playerPositionCrudAlert = null;
      $scope.playerPositionCrudLoading = false;

      var uploader = $scope.uploader = new FileUploader();
      uploader.onAfterAddingFile  = function(item) {
        uploader.queue = [];
        uploader.queue[0] = item;
      };

      $scope.getPlayerPositionList = function() {
        $scope.playerPositionListLoading = true;
        $scope.playerPositionList = [];
        authFactory.get({entity:'playerPositions'}).then(function(result) {
          $scope.playerPositionList = result.data;
          $scope.playerPositionListLoading = false;
        }, function (error) {
          $scope.playerPositionList = [];
          $scope.playerPositionListLoading = false;
        });
      };

      $scope.getPlayerPositionList();

      $scope.goAddPlayerPosition = function() {
        $scope.subOption = 2;
        $scope.playerPosition = {};
        $scope.crudOption = 'Agregar';
        $scope.playerPositionListAlert = null;
        $scope.playerPositionCrudAlert = null;
      };

      $scope.goEditPlayerPosition = function(playerPosition) {
        $scope.subOption = 3;
        $scope.playerPosition = playerPosition;
        $scope.crudOption = 'Editar';
        $scope.playerPositionListAlert = null;
        $scope.playerPositionCrudAlert = null;
        downloadPicture();
      };

      function downloadPicture() {
        if ($scope.playerPosition.picture) {
          imageFactory.getImage($scope.playerPosition.picture)
          .then(function(data) {
            var file = new File([data], $scope.playerPosition.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.playerPosition.picture;
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

      $scope.goRemovePlayerPosition = function(playerPosition) {
        $scope.cleanAlertPlayerPositionList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar la Posición de Jugador ' + playerPosition.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.playerPositionListLoading = true;
          authFactory.delete({entity:'playerPosition',id:playerPosition.id})
          .then(function(result) {
            $scope.playerPositionListAlert = errorFactory.getCustomAlert('success','Posición de Jugador eliminada satisfactoriamente');
            $scope.getPlayerPositionList();
          }, function (error) {
            $scope.playerPositionListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.playerPositionSubmit = function() {
        if ($scope.uploader.queue.length === 1) {
          $scope.playerPositionCrudLoading = true;
          var fd = new FormData();

          fd.append('file',$scope.uploader.queue[0]._file);
          fd.append('type','playerPosition')

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
          $scope.playerPosition.picture = pictureURL;
        }
        if ($scope.subOption === 2) {
          addPlayerPosition();
        } else if ($scope.subOption === 3) {
          editPlayerPosition();
        }
      }

      function addPlayerPosition() {
        $scope.playerPositionCrudLoading = true;
        authFactory.save({entity:'playerPosition'}, $scope.playerPosition).then(function(result) {
          $scope.playerPositionCrudLoading = false;
          $scope.playerPosition = {};
          $scope.subOption = 1;
          $scope.playerPositionListAlert = errorFactory.getCustomAlert('success','Posición de Jugador agregada satisfactoriamente');
          $scope.getPlayerPositionList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      function editPlayerPosition() {
        $scope.playerPositionCrudLoading = true;
        authFactory.edit({entity:'playerPosition',id:$scope.playerPosition.id}, $scope.playerPosition).then(function(result) {
          $scope.playerPositionCrudLoading = false;
          $scope.playerPosition = {};
          $scope.subOption = 1;
          $scope.playerPositionListAlert = errorFactory.getCustomAlert('success','Posición de Jugador editada satisfactoriamente');
          $scope.getPlayerPositionList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getPlayerPositionList();
        $scope.playerPositionListAlert = null;
        $scope.playerPositionCrudAlert = null;
        uploader.queue = [];
      };

      function showError(error) {
        $scope.playerPositionCrudLoading = false;
        $scope.playerPositionCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertPlayerPositionList = function() {
        $scope.playerPositionListAlert = null;
      };
  }]);

});
