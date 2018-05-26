define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.possessionPassesController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.possessionPassesList = [];
      $scope.possessionPasses = {};
      $scope.crudOption = '';

      $scope.possessionPassesListAlert = null;
      $scope.possessionPassesListLoading = false;
      $scope.possessionPassesCrudAlert = null;
      $scope.possessionPassesCrudLoading = false;

      var uploader = $scope.uploader = new FileUploader();
      uploader.onAfterAddingFile  = function(item) {
        uploader.queue = [];
        uploader.queue[0] = item;
      };

      $scope.getPossessionPassesList = function() {
        $scope.possessionPassesListLoading = true;
        $scope.possessionPassesList = [];
        authFactory.get({entity:'possessionPasses'}).then(function(result) {
          $scope.possessionPassesList = result.data;
          $scope.possessionPassesListLoading = false;
        }, function (error) {
          $scope.possessionPassesList = [];
          $scope.possessionPassesListLoading = false;
        });
      };

      $scope.getPossessionPassesList();

      $scope.goAddPossessionPasses = function() {
        $scope.subOption = 2;
        $scope.possessionPasses = {};
        $scope.crudOption = 'Agregar';
        $scope.possessionPassesListAlert = null;
        $scope.possessionPassesCrudAlert = null;
      };

      $scope.goEditPossessionPasses = function(possessionPasses) {
        $scope.subOption = 3;
        $scope.possessionPasses = possessionPasses;
        $scope.crudOption = 'Editar';
        $scope.possessionPassesListAlert = null;
        $scope.possessionPassesCrudAlert = null;
        downloadPicture();
      };

      function downloadPicture() {
        if ($scope.possessionPasses.picture) {
          imageFactory.getImage($scope.possessionPasses.picture)
          .then(function(data) {
            var file = new File([data], $scope.possessionPasses.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.possessionPasses.picture;
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

      $scope.goRemovePossessionPasses = function(possessionPasses) {
        $scope.cleanAlertPossessionPassesList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar el Pase por posesión ' + possessionPasses.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.possessionPassesListLoading = true;
          authFactory.delete({entity:'possessionPass',id:possessionPasses.id})
          .then(function(result) {
            $scope.possessionPassesListAlert = errorFactory.getCustomAlert('success','Pase por posesión eliminado satisfactoriamente');
            $scope.getPossessionPassesList();
          }, function (error) {
            $scope.possessionPassesListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.possessionPassesSubmit = function() {
        if ($scope.uploader.queue.length === 1) {
          $scope.possessionPassesCrudLoading = true;
          var fd = new FormData();

          fd.append('file',$scope.uploader.queue[0]._file);
          fd.append('type','possessionPass')

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
          $scope.possessionPasses.picture = pictureURL;
        }
        if ($scope.subOption === 2) {
          addPossessionPasses();
        } else if ($scope.subOption === 3) {
          editPossessionPasses();
        }
      }

      function addPossessionPasses() {
        $scope.possessionPassesCrudLoading = true;
        authFactory.save({entity:'possessionPass'}, $scope.possessionPasses).then(function(result) {
          $scope.possessionPassesCrudLoading = false;
          $scope.possessionPasses = {};
          $scope.subOption = 1;
          $scope.possessionPassesListAlert = errorFactory.getCustomAlert('success','Pase por posesión agregado satisfactoriamente');
          $scope.getPossessionPassesList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      function editPossessionPasses() {
        $scope.possessionPassesCrudLoading = true;
        authFactory.edit({entity:'possessionPass',id:$scope.possessionPasses.id}, $scope.possessionPasses).then(function(result) {
          $scope.possessionPassesCrudLoading = false;
          $scope.possessionPasses = {};
          $scope.subOption = 1;
          $scope.possessionPassesListAlert = errorFactory.getCustomAlert('success','Pase por posesión editado satisfactoriamente');
          $scope.getPossessionPassesList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getPossessionPassesList();
        $scope.possessionPassesListAlert = null;
        $scope.possessionPassesCrudAlert = null;
        uploader.queue = [];
      };

      function showError(error) {
        $scope.possessionPassesCrudLoading = false;
        $scope.possessionPassesCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertPossessionPassesList = function() {
        $scope.possessionPassesListAlert = null;
      };
  }]);

});
