define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.previousActionController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.previousActionList = [];
      $scope.previousAction = {};
      $scope.crudOption = '';

      $scope.previousActionListAlert = null;
      $scope.previousActionListLoading = false;
      $scope.previousActionCrudAlert = null;
      $scope.previousActionCrudLoading = false;

      var uploader = $scope.uploader = new FileUploader();
      uploader.onAfterAddingFile  = function(item) {
        uploader.queue = [];
        uploader.queue[0] = item;
      };


      $scope.getPreviousActionList = function() {
        $scope.previousActionListLoading = true;
        $scope.previousActionList = [];
        authFactory.get({entity:'previousActions'}).then(function(result) {
          $scope.previousActionList = result.data;
          $scope.previousActionListLoading = false;
        }, function (error) {
          $scope.previousActionList = [];
          $scope.previousActionListLoading = false;
        });
      };

      $scope.getPreviousActionList();

      $scope.goAddPreviousAction = function() {
        $scope.subOption = 2;
        $scope.previousAction = {};
        $scope.crudOption = 'Agregar';
        $scope.previousActionListAlert = null;
        $scope.previousActionCrudAlert = null;
      };

      $scope.goEditPreviousAction = function(previousAction) {
        $scope.subOption = 3;
        $scope.previousAction = previousAction;
        $scope.crudOption = 'Editar';
        $scope.previousActionListAlert = null;
        $scope.previousActionCrudAlert = null;
        downloadPicture();
      };

      function downloadPicture() {
        if ($scope.previousAction.picture) {
          imageFactory.getImage($scope.previousAction.picture)
          .then(function(data) {
            var file = new File([data], $scope.previousAction.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.previousAction.picture;
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

      $scope.goRemovePreviousAction = function(previousAction) {
        $scope.cleanAlertPreviousActionList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar la Acción Previa ' + previousAction.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.previousActionListLoading = true;
          authFactory.delete({entity:'previousAction',id:previousAction.id})
          .then(function(result) {
            $scope.previousActionListAlert = errorFactory.getCustomAlert('success','Acción Previa eliminada satisfactoriamente');
            $scope.getPreviousActionList();
          }, function (error) {
            $scope.previousActionListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.previousActionSubmit = function() {
        if ($scope.uploader.queue.length === 1) {
          $scope.previousActionCrudLoading = true;
          var fd = new FormData();

          fd.append('file',$scope.uploader.queue[0]._file);
          fd.append('type','previousAction')

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
          $scope.previousAction.picture = pictureURL;
        }
        if ($scope.subOption === 2) {
          addPreviousAction();
        } else if ($scope.subOption === 3) {
          editPreviousAction();
        }
      }


      function addPreviousAction() {
        $scope.previousActionCrudLoading = true;
        authFactory.save({entity:'previousAction'}, $scope.previousAction).then(function(result) {
          $scope.previousActionCrudLoading = false;
          $scope.previousAction = {};
          $scope.subOption = 1;
          $scope.previousActionListAlert = errorFactory.getCustomAlert('success','Acción Previa agregada satisfactoriamente');
          $scope.getPreviousActionList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      function editPreviousAction() {
        $scope.previousActionCrudLoading = true;
        authFactory.edit({entity:'previousAction',id:$scope.previousAction.id}, $scope.previousAction).then(function(result) {
          $scope.previousActionCrudLoading = false;
          $scope.previousAction = {};
          $scope.subOption = 1;
          $scope.previousActionListAlert = errorFactory.getCustomAlert('success','Acción Previa editada satisfactoriamente');
          $scope.getPreviousActionList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getPreviousActionList();
        $scope.previousActionListAlert = null;
        $scope.previousActionCrudAlert = null;
        uploader.queue = [];
      };

      function showError(error) {
        $scope.previousActionCrudLoading = false;
        $scope.previousActionCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertPreviousActionList = function() {
        $scope.previousActionListAlert = null;
      };
  }]);

});
