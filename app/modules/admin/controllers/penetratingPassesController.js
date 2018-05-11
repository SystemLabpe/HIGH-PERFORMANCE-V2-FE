define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.penetratingPassesController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.penetratingPassesList = [];
      $scope.penetratingPasses = {};
      $scope.crudOption = '';

      $scope.penetratingPassesListAlert = null;
      $scope.penetratingPassesListLoading = false;
      $scope.penetratingPassesCrudAlert = null;
      $scope.penetratingPassesCrudLoading = false;

      var uploader = $scope.uploader = new FileUploader();
      uploader.onAfterAddingFile  = function(item) {
        uploader.queue = [];
        uploader.queue[0] = item;
      };

      $scope.getPenetratingPassesList = function() {
        $scope.penetratingPassesListLoading = true;
        $scope.penetratingPassesList = [];
        authFactory.get({entity:'penetratingPasses'}).then(function(result) {
          $scope.penetratingPassesList = result.data;
          $scope.penetratingPassesListLoading = false;
        }, function (error) {
          $scope.penetratingPassesList = [];
          $scope.penetratingPassesListLoading = false;
        });
      };

      $scope.getPenetratingPassesList();

      $scope.goAddPenetratingPasses = function() {
        $scope.subOption = 2;
        $scope.penetratingPasses = {};
        $scope.crudOption = 'Agregar';
        $scope.penetratingPassesListAlert = null;
        $scope.penetratingPassesCrudAlert = null;
      };

      $scope.goEditPenetratingPasses = function(penetratingPasses) {
        $scope.subOption = 3;
        $scope.penetratingPasses = penetratingPasses;
        $scope.crudOption = 'Editar';
        $scope.penetratingPassesListAlert = null;
        $scope.penetratingPassesCrudAlert = null;
        downloadPicture();
      };

      function downloadPicture() {
        if ($scope.penetratingPasses.picture) {
          imageFactory.getImage($scope.penetratingPasses.picture)
          .then(function(data) {
            var file = new File([data], $scope.penetratingPasses.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.penetratingPasses.picture;
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

      $scope.goRemovePenetratingPasses = function(penetratingPasses) {
        $scope.cleanAlertPenetratingPassesList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar el Pase penetrante ' + penetratingPasses.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.penetratingPassesListLoading = true;
          authFactory.delete({entity:'penetratingPass',id:penetratingPasses.id})
          .then(function(result) {
            $scope.penetratingPassesListAlert = errorFactory.getCustomAlert('success','Pase penetrante eliminada satisfactoriamente');
            $scope.getPenetratingPassesList();
          }, function (error) {
            $scope.penetratingPassesListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.penetratingPassesSubmit = function() {
        if ($scope.uploader.queue.length === 1) {
          $scope.penetratingPassesCrudLoading = true;
          var fd = new FormData();

          fd.append('file',$scope.uploader.queue[0]._file);
          fd.append('type','penetratingPasses')

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
          $scope.penetratingPasses.picture = pictureURL;
        }
        if ($scope.subOption === 2) {
          addPenetratingPasses();
        } else if ($scope.subOption === 3) {
          editPenetratingPasses();
        }
      }

      function addPenetratingPasses() {
        $scope.penetratingPassesCrudLoading = true;
        authFactory.save({entity:'penetratingPass'}, $scope.penetratingPasses).then(function(result) {
          $scope.penetratingPassesCrudLoading = false;
          $scope.penetratingPasses = {};
          $scope.subOption = 1;
          $scope.penetratingPassesListAlert = errorFactory.getCustomAlert('success','Pase penetrante agregada satisfactoriamente');
          $scope.getPenetratingPassesList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      function editPenetratingPasses() {
        $scope.penetratingPassesCrudLoading = true;
        authFactory.edit({entity:'penetratingPass',id:$scope.penetratingPasses.id}, $scope.penetratingPasses).then(function(result) {
          $scope.penetratingPassesCrudLoading = false;
          $scope.penetratingPasses = {};
          $scope.subOption = 1;
          $scope.penetratingPassesListAlert = errorFactory.getCustomAlert('success','Pase penetrante editada satisfactoriamente');
          $scope.getPenetratingPassesList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getPenetratingPassesList();
        $scope.penetratingPassesListAlert = null;
        $scope.penetratingPassesCrudAlert = null;
        uploader.queue = [];
      };

      function showError(error) {
        $scope.penetratingPassesCrudLoading = false;
        $scope.penetratingPassesCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertPenetratingPassesList = function() {
        $scope.penetratingPassesListAlert = null;
      };
  }]);

});
