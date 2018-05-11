define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.completionActionController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.completionActionList = [];
      $scope.completionAction = {};
      $scope.crudOption = '';

      $scope.completionActionListAlert = null;
      $scope.completionActionListLoading = false;
      $scope.completionActionCrudAlert = null;
      $scope.completionActionCrudLoading = false;

      var uploader = $scope.uploader = new FileUploader();
      uploader.onAfterAddingFile  = function(item) {
        uploader.queue = [];
        uploader.queue[0] = item;
      };

      $scope.getCompletionActionList = function() {
        $scope.completionActionListLoading = true;
        $scope.completionActionList = [];
        authFactory.get({entity:'completionActions'}).then(function(result) {
          $scope.completionActionList = result.data;
          $scope.completionActionListLoading = false;
        }, function (error) {
          $scope.completionActionList = [];
          $scope.completionActionListLoading = false;
        });
      };

      $scope.getCompletionActionList();

      $scope.goAddCompletionAction = function() {
        $scope.subOption = 2;
        $scope.completionAction = {};
        $scope.crudOption = 'Agregar';
        $scope.completionActionListAlert = null;
        $scope.completionActionCrudAlert = null;
      };

      $scope.goEditCompletionAction = function(completionAction) {
        $scope.subOption = 3;
        $scope.completionAction = completionAction;
        $scope.crudOption = 'Editar';
        $scope.completionActionListAlert = null;
        $scope.completionActionCrudAlert = null;
        downloadPicture();
      };

      function downloadPicture() {
        if ($scope.completionAction.picture) {
          imageFactory.getImage($scope.completionAction.picture)
          .then(function(data) {
            var file = new File([data], $scope.completionAction.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.completionAction.picture;
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

      $scope.goRemoveCompletionAction = function(completionAction) {
        $scope.cleanAlertCompletionActionList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar la Finalización de la Jugada ' + completionAction.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.completionActionListLoading = true;
          authFactory.delete({entity:'completionAction',id:completionAction.id})
          .then(function(result) {
            $scope.completionActionListAlert = errorFactory.getCustomAlert('success','Finalización de la Jugada eliminada satisfactoriamente');
            $scope.getCompletionActionList();
          }, function (error) {
            $scope.completionActionListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.completionActionSubmit = function() {
        if ($scope.uploader.queue.length === 1) {
          $scope.completionActionCrudLoading = true;
          var fd = new FormData();

          fd.append('file',$scope.uploader.queue[0]._file);
          fd.append('type','completionAction')

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
          $scope.completionAction.picture = pictureURL;
        }
        if ($scope.subOption === 2) {
          addCompletionAction();
        } else if ($scope.subOption === 3) {
          editCompletionAction();
        }
      }

      function addCompletionAction() {
        $scope.completionActionCrudLoading = true;
        authFactory.save({entity:'completionAction'}, $scope.completionAction).then(function(result) {
          $scope.completionActionCrudLoading = false;
          $scope.completionAction = {};
          $scope.subOption = 1;
          $scope.completionActionListAlert = errorFactory.getCustomAlert('success','Finalización de la Jugada agregada satisfactoriamente');
          $scope.getCompletionActionList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      function editCompletionAction() {
        $scope.completionActionCrudLoading = true;
        authFactory.edit({entity:'completionAction',id:$scope.completionAction.id}, $scope.completionAction).then(function(result) {
          $scope.completionActionCrudLoading = false;
          $scope.completionAction = {};
          $scope.subOption = 1;
          $scope.completionActionListAlert = errorFactory.getCustomAlert('success','Finalización de la Jugada editada satisfactoriamente');
          $scope.getCompletionActionList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getCompletionActionList();
        $scope.completionActionListAlert = null;
        $scope.completionActionCrudAlert = null;
        uploader.queue = [];
      };

      function showError(error) {
        $scope.completionActionCrudLoading = false;
        $scope.completionActionCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertCompletionActionList = function() {
        $scope.completionActionListAlert = null;
      };
  }]);

});
