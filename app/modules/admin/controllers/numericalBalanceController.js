define(['admin/admin','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(admin){
  'use strict';

  admin.controller('admin.numericalBalanceController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.numericalBalanceList = [];
      $scope.numericalBalance = {};
      $scope.crudOption = '';

      $scope.numericalBalanceListAlert = null;
      $scope.numericalBalanceListLoading = false;
      $scope.numericalBalanceCrudAlert = null;
      $scope.numericalBalanceCrudLoading = false;

      var uploader = $scope.uploader = new FileUploader();
      uploader.onAfterAddingFile  = function(item) {
        uploader.queue = [];
        uploader.queue[0] = item;
      };

      $scope.getNumericalBalanceList = function() {
        $scope.numericalBalanceListLoading = true;
        $scope.numericalBalanceList = [];
        authFactory.get({entity:'numericalBalances'}).then(function(result) {
          $scope.numericalBalanceList = result.data;
          $scope.numericalBalanceListLoading = false;
        }, function (error) {
          $scope.numericalBalanceList = [];
          $scope.numericalBalanceListLoading = false;
        });
      };

      $scope.getNumericalBalanceList();

      $scope.goAddNumericalBalance = function() {
        $scope.subOption = 2;
        $scope.numericalBalance = {};
        $scope.crudOption = 'Agregar';
        $scope.numericalBalanceListAlert = null;
        $scope.numericalBalanceCrudAlert = null;
      };

      $scope.goEditNumericalBalance = function(numericalBalance) {
        $scope.subOption = 3;
        $scope.numericalBalance = numericalBalance;
        $scope.crudOption = 'Editar';
        $scope.numericalBalanceListAlert = null;
        $scope.numericalBalanceCrudAlert = null;
        downloadPicture();
      };

      function downloadPicture() {
        if ($scope.numericalBalance.picture) {
          imageFactory.getImage($scope.numericalBalance.picture)
          .then(function(data) {
            var file = new File([data], $scope.numericalBalance.picture, { type: data.type });
            var dummy = new FileUploader.FileItem(uploader, {});
            dummy._file = file;
            dummy.file.mediaId = 122;
            dummy.file.name = $scope.numericalBalance.picture;
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

      $scope.goRemoveNumericalBalance = function(numericalBalance) {
        $scope.cleanAlertNumericalBalanceList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar el Balance Numérico ' + numericalBalance.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.numericalBalanceListLoading = true;
          authFactory.delete({entity:'numericalBalance',id:numericalBalance.id})
          .then(function(result) {
            $scope.numericalBalanceListAlert = errorFactory.getCustomAlert('success','Balance Numérico eliminado satisfactoriamente');
            $scope.getNumericalBalanceList();
          }, function (error) {
            $scope.numericalBalanceListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.numericalBalanceSubmit = function() {
        if ($scope.uploader.queue.length === 1) {
          $scope.numericalBalanceCrudLoading = true;
          var fd = new FormData();

          fd.append('file',$scope.uploader.queue[0]._file);
          fd.append('type','numericalBalance')

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
          $scope.numericalBalance.picture = pictureURL;
        }
        if ($scope.subOption === 2) {
          addNumericalBalance();
        } else if ($scope.subOption === 3) {
          editNumericalBalance();
        }
      }

      function addNumericalBalance() {
        $scope.numericalBalanceCrudLoading = true;
        authFactory.save({entity:'numericalBalance'}, $scope.numericalBalance).then(function(result) {
          $scope.numericalBalanceCrudLoading = false;
          $scope.numericalBalance = {};
          $scope.subOption = 1;
          $scope.numericalBalanceListAlert = errorFactory.getCustomAlert('success','Balance Numérico agregado satisfactoriamente');
          $scope.getNumericalBalanceList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      function editNumericalBalance() {
        $scope.numericalBalanceCrudLoading = true;
        authFactory.edit({entity:'numericalBalance',id:$scope.numericalBalance.id}, $scope.numericalBalance).then(function(result) {
          $scope.numericalBalanceCrudLoading = false;
          $scope.numericalBalance = {};
          $scope.subOption = 1;
          $scope.numericalBalanceListAlert = errorFactory.getCustomAlert('success','Balance Numérico editado satisfactoriamente');
          $scope.getNumericalBalanceList();
          uploader.queue = [];
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getNumericalBalanceList();
        $scope.numericalBalanceListAlert = null;
        $scope.numericalBalanceCrudAlert = null;
        uploader.queue = [];
      };

      function showError(error) {
        $scope.numericalBalanceCrudLoading = false;
        $scope.numericalBalanceCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertNumericalBalanceList = function() {
        $scope.numericalBalanceListAlert = null;
      };
  }]);

});
