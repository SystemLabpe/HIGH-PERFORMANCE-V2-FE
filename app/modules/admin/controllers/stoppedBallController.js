define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.stoppedBallController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.stoppedBallList = [];
      $scope.stoppedBall = {};
      $scope.crudOption = '';

      $scope.stoppedBallListAlert = null;
      $scope.stoppedBallListLoading = false;
      $scope.stoppedBallCrudAlert = null;
      $scope.stoppedBallCrudLoading = false;

      var uploader = $scope.uploader = new FileUploader();
      uploader.onAfterAddingFile  = function(item) {
        uploader.queue = [];
        uploader.queue[0] = item;
      };

      $scope.getStoppedBallList = function() {
        $scope.stoppedBallListLoading = true;
        $scope.stoppedBallList = [];
        authFactory.get({entity:'stoppedBalls'}).then(function(result) {
          $scope.stoppedBallList = result.data;
          $scope.stoppedBallListLoading = false;
        }, function (error) {
          $scope.stoppedBallList = [];
          $scope.stoppedBallListLoading = false;
        });
      };

      $scope.getStoppedBallList();

      $scope.goAddStoppedBall = function() {
        $scope.subOption = 2;
        $scope.stoppedBall = {};
        $scope.crudOption = 'Agregar';
        $scope.stoppedBallListAlert = null;
        $scope.stoppedBallCrudAlert = null;
      };

      $scope.goEditStoppedBall = function(stoppedBall) {
        $scope.subOption = 3;
        $scope.stoppedBall = stoppedBall;
        $scope.crudOption = 'Editar';
        $scope.stoppedBallListAlert = null;
        $scope.stoppedBallCrudAlert = null;
        downloadPicture();
      };

      function downloadPicture() {
        if ($scope.stoppedBall.picture) {
          imageFactory.getImage($scope.stoppedBall.picture)
          .then(function(data) {
            var file = new File([data], $scope.stoppedBall.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.stoppedBall.picture;
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

      $scope.goRemoveStoppedBall = function(stoppedBall) {
        $scope.cleanAlertStoppedBallList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar el Balón Parado ' + stoppedBall.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.stoppedBallListLoading = true;
          authFactory.delete({entity:'stoppedBall',id:stoppedBall.id})
          .then(function(result) {
            $scope.stoppedBallListAlert = errorFactory.getCustomAlert('success','Balón parado eliminado satisfactoriamente');
            $scope.getStoppedBallList();
          }, function (error) {
            $scope.stoppedBallListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.stoppedBallSubmit = function() {
        if ($scope.uploader.queue.length === 1) {
          $scope.stoppedBallCrudLoading = true;
          var fd = new FormData();

          fd.append('file',$scope.uploader.queue[0]._file);
          fd.append('type','stoppedBall')

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
          $scope.stoppedBall.picture = pictureURL;
        }
        if ($scope.subOption === 2) {
          addStoppedBall();
        } else if ($scope.subOption === 3) {
          editStoppedBall();
        }
      }

      function addStoppedBall() {
        $scope.stoppedBallCrudLoading = true;
        authFactory.save({entity:'stoppedBall'}, $scope.stoppedBall).then(function(result) {
          $scope.stoppedBallCrudLoading = false;
          $scope.stoppedBall = {};
          $scope.subOption = 1;
          $scope.stoppedBallListAlert = errorFactory.getCustomAlert('success','Balón parado agregado satisfactoriamente');
          $scope.getStoppedBallList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      function editStoppedBall() {
        $scope.stoppedBallCrudLoading = true;
        authFactory.edit({entity:'stoppedBall',id:$scope.stoppedBall.id}, $scope.stoppedBall).then(function(result) {
          $scope.stoppedBallCrudLoading = false;
          $scope.stoppedBall = {};
          $scope.subOption = 1;
          $scope.stoppedBallListAlert = errorFactory.getCustomAlert('success','Balón parado editado satisfactoriamente');
          $scope.getStoppedBallList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getStoppedBallList();
        $scope.stoppedBallListAlert = null;
        $scope.stoppedBallCrudAlert = null;
        uploader.queue = [];
      };

      function showError(error) {
        $scope.stoppedBallCrudLoading = false;
        $scope.stoppedBallCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertStoppedBallList = function() {
        $scope.stoppedBallListAlert = null;
      };
  }]);

});
