define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.pentagonCompletionController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.pentagonCompletionList = [];
      $scope.pentagonCompletion = {};
      $scope.crudOption = '';

      $scope.pentagonCompletionListAlert = null;
      $scope.pentagonCompletionListLoading = false;
      $scope.pentagonCompletionCrudAlert = null;
      $scope.pentagonCompletionCrudLoading = false;

      var uploader = $scope.uploader = new FileUploader();
      uploader.onAfterAddingFile  = function(item) {
        uploader.queue = [];
        uploader.queue[0] = item;
      };

      $scope.getPentagonCompletionList = function() {
        $scope.pentagonCompletionListLoading = true;
        $scope.pentagonCompletionList = [];
        authFactory.get({entity:'pentagonCompletions'}).then(function(result) {
          $scope.pentagonCompletionList = result.data;
          $scope.pentagonCompletionListLoading = false;
        }, function (error) {
          $scope.pentagonCompletionList = [];
          $scope.pentagonCompletionListLoading = false;
        });
      };

      $scope.getPentagonCompletionList();

      $scope.goAddPentagonCompletion = function() {
        $scope.subOption = 2;
        $scope.pentagonCompletion = {};
        $scope.crudOption = 'Agregar';
        $scope.pentagonCompletionListAlert = null;
        $scope.pentagonCompletionCrudAlert = null;
      };

      $scope.goEditPentagonCompletion = function(pentagonCompletion) {
        $scope.subOption = 3;
        $scope.pentagonCompletion = pentagonCompletion;
        $scope.crudOption = 'Editar';
        $scope.pentagonCompletionListAlert = null;
        $scope.pentagonCompletionCrudAlert = null;
        downloadPicture();
      };

      function downloadPicture() {
        if ($scope.pentagonCompletion.picture) {
          imageFactory.getImage($scope.pentagonCompletion.picture)
          .then(function(data) {
            var file = new File([data], $scope.pentagonCompletion.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.pentagonCompletion.picture;
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

      $scope.goRemovePentagonCompletion = function(pentagonCompletion) {
        $scope.cleanAlertPentagonCompletionList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar la Pentágono ' + pentagonCompletion.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.pentagonCompletionListLoading = true;
          authFactory.delete({entity:'pentagonCompletion',id:pentagonCompletion.id})
          .then(function(result) {
            $scope.pentagonCompletionListAlert = errorFactory.getCustomAlert('success','Pentágono de Finalización eliminada satisfactoriamente');
            $scope.getPentagonCompletionList();
          }, function (error) {
            $scope.pentagonCompletionListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.pentagonCompletionSubmit = function() {
        if ($scope.uploader.queue.length === 1) {
          $scope.pentagonCompletionCrudLoading = true;
          var fd = new FormData();

          fd.append('file',$scope.uploader.queue[0]._file);
          fd.append('type','pentagonCompletion')

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
          $scope.pentagonCompletion.picture = pictureURL;
        }
        if ($scope.subOption === 2) {
          addPentagonCompletion();
        } else if ($scope.subOption === 3) {
          editPentagonCompletion();
        }
      }

      function addPentagonCompletion() {
        $scope.pentagonCompletionCrudLoading = true;
        authFactory.save({entity:'pentagonCompletion'}, $scope.pentagonCompletion).then(function(result) {
          $scope.pentagonCompletionCrudLoading = false;
          $scope.pentagonCompletion = {};
          $scope.subOption = 1;
          $scope.pentagonCompletionListAlert = errorFactory.getCustomAlert('success','Pentágono de Finalización agregada satisfactoriamente');
          $scope.getPentagonCompletionList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      function editPentagonCompletion() {
        $scope.pentagonCompletionCrudLoading = true;
        authFactory.edit({entity:'pentagonCompletion',id:$scope.pentagonCompletion.id}, $scope.pentagonCompletion).then(function(result) {
          $scope.pentagonCompletionCrudLoading = false;
          $scope.pentagonCompletion = {};
          $scope.subOption = 1;
          $scope.pentagonCompletionListAlert = errorFactory.getCustomAlert('success','Pentágono de Finalización editada satisfactoriamente');
          $scope.getPentagonCompletionList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getPentagonCompletionList();
        $scope.pentagonCompletionListAlert = null;
        $scope.pentagonCompletionCrudAlert = null;
        uploader.queue = [];
      };

      function showError(error) {
        $scope.pentagonCompletionCrudLoading = false;
        $scope.pentagonCompletionCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertPentagonCompletionList = function() {
        $scope.pentagonCompletionListAlert = null;
      };
  }]);

});
