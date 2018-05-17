define(['club/club','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club){
  'use strict';

  club.controller('club.rivalController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory',function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory) {

      $scope.rivalList = [];

      $scope.rivalListLoading = false;

      $scope.getRivalList = function() {
        $scope.rivalListLoading = true;
        $scope.rivalList = [];
        authFactory.get({entity:'clubs',method:'rivals'}).then(function(result) {
          $scope.rivalList = result.data;
          $scope.rivalListLoading = false;
        }, function (error) {
          $scope.rivalList = [];
          $scope.rivalListLoading = false;
        });
      };

      $scope.getRivalList();

    }]);
});
