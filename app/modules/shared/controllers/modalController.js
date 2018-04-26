define(['shared/shared'], function(shared){
  'use strict';

  shared.controller('shared.modalController',['$scope','$uibModalInstance','modalData',
    function($scope,$uibModalInstance,modalData){

      $scope.modalData = modalData;

      $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.ok = function () {
        $uibModalInstance.close();
      };


    }
  ]);

});
