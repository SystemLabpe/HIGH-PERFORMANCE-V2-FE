define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.initialPenetrationController',['$scope','$filter','$location','$auth',
    'auth.authFactory','shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

    $scope.subOption = 1; // 1: list, 2:add, 3:edit
    $scope.initialPenetrationList = [];
    $scope.initialPenetration = {};
    $scope.crudOption = '';

    $scope.initialPenetrationListAlert = null;
    $scope.initialPenetrationListLoading = false;
    $scope.initialPenetrationCrudAlert = null;
    $scope.initialPenetrationCrudLoading = false;

    var uploader = $scope.uploader = new FileUploader();
    uploader.onAfterAddingFile  = function(item) {
      uploader.queue = [];
      uploader.queue[0] = item;
    };

    $scope.getInitialPenetrationList = function() {
      $scope.initialPenetrationListLoading = true;
      $scope.initialPenetrationList = [];
      authFactory.get({entity:'initialPenetrations'}).then(function(result) {
        $scope.initialPenetrationList = result.data;
        $scope.initialPenetrationListLoading = false;
      }, function (error) {
        $scope.initialPenetrationList = [];
        $scope.initialPenetrationListLoading = false;
      });
    };

    $scope.getInitialPenetrationList();

    $scope.goAddInitialPenetration = function() {
      $scope.subOption = 2;
      $scope.initialPenetration = {};
      $scope.crudOption = 'Agregar';
      $scope.initialPenetrationListAlert = null;
      $scope.initialPenetrationCrudAlert = null;
    };

    $scope.goEditInitialPenetration = function(initialPenetration) {
      $scope.subOption = 3;
      $scope.initialPenetration = initialPenetration;
      $scope.crudOption = 'Editar';
      $scope.initialPenetrationListAlert = null;
      $scope.initialPenetrationCrudAlert = null;
      downloadPicture();
    };

    function downloadPicture() {
        if ($scope.initialPenetration.picture) {
          imageFactory.getImage($scope.initialPenetration.picture)
          .then(function(data) {
            var file = new File([data], $scope.initialPenetration.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.initialPenetration.picture;
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

    $scope.goRemoveInitialPenetration = function(initialPenetration) {
      $scope.cleanAlertInitialPenetrationList();
      var modalData = {
        title:'Confirme eliminación',
        message:'¿Desea eliminar la Penetración Inicial ' + initialPenetration.name +' ?'
      };
      modalFactory.showModal(modalData)
      .then(function() {
        $scope.initialPenetrationCrudLoading = true;
        authFactory.delete({entity:'initialPenetration',id:initialPenetration.id})
        .then(function(result) {
          $scope.initialPenetrationListAlert = errorFactory.getCustomAlert('success','Penetración Inicial eliminada satisfactoriamente');
          $scope.getInitialPenetrationList();
        }, function (error) {
          $scope.initialPenetrationListAlert = errorFactory.getError(error);
        });
      });
    };

    $scope.initialPenetrationSubmit = function() {
      if ($scope.uploader.queue.length === 1) {
        $scope.initialPenetrationCrudLoading = true;
        var fd = new FormData();

        fd.append('file',$scope.uploader.queue[0]._file);
        fd.append('type','initialPenetration')

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
        $scope.initialPenetration.picture = pictureURL;
      }
      if ($scope.subOption === 2) {
        addInitialPenetration();
      } else if ($scope.subOption === 3) {
        editInitialPenetration();
      }
    }

    function addInitialPenetration() {
      $scope.initialPenetrationCrudLoading = true;
      authFactory.save({entity:'initialPenetration'}, $scope.initialPenetration).then(function(result) {
        $scope.initialPenetrationCrudLoading = false;
        $scope.initialPenetration = {};
        $scope.subOption = 1;
        $scope.initialPenetrationListAlert = errorFactory.getCustomAlert('success','Penetración Inicial agregada satisfactoriamente');
        $scope.getInitialPenetrationList();
        uploader.queue = [];
      }, function (error) {
        showError(error);
      });
    }

    function editInitialPenetration() {
      $scope.initialPenetrationCrudLoading = true;
      authFactory.edit({entity:'initialPenetration',id:$scope.initialPenetration.id}, $scope.initialPenetration).then(function(result) {
        $scope.initialPenetrationCrudLoading = false;
        $scope.initialPenetration = {};
        $scope.subOption = 1;
        $scope.initialPenetrationListAlert = errorFactory.getCustomAlert('success','Penetración Inicial editada satisfactoriamente');
        $scope.getInitialPenetrationList();
        uploader.queue = [];
      }, function (error) {
        showError(error);
      });
    }

    $scope.goBack = function() {
      $scope.subOption = 1;
      $scope.getInitialPenetrationList();
      $scope.initialPenetrationListAlert = null;
      $scope.initialPenetrationCrudAlert = null;
      uploader.queue = [];
    };

    function showError(error) {
      $scope.initialPenetrationCrudLoading = false;
      $scope.initialPenetrationCrudAlert = $filter('errorFilter')(error.data.data.code);
    }

    $scope.cleanAlertInitialPenetrationList = function() {
      $scope.initialPenetrationListAlert = null;
    };
  }]);

});
