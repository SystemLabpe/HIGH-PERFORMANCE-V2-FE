define(['shared/shared'], function(shared){
  'use strict';

  shared.controller('shared.infoListModalController',['$scope','$uibModalInstance','infoList',
    function($scope,$uibModalInstance,infoList){

      if (!angular.isArray(infoList)) {
        $scope.modalData = [infoList];
      } else {
        $scope.modalData = infoList;
      }

      $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.ok = function () {
        $uibModalInstance.close();
      };


    }
  ]);

});
