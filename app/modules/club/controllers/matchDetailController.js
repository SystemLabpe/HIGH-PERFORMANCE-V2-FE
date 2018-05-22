define(['club/club','moment','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club, moment){
  'use strict';

  club.controller('club.matchDetailController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.match = {};

      if(sessionStorage.getItem('match')) {
        $scope.match = JSON.parse(sessionStorage.getItem('match'));
        getChanceList();
      }

      $scope.goEditMatch = function() {
        sessionStorage.setItem('match',JSON.stringify($scope.match));
        $location.path('/club/match-add-edit');
      };

      function getChanceList() {
        $scope.chanceListLoading = true;
        $scope.chanceList = [];
        authFactory.get({entity:'chances',method:'me',param1:'match',param2:$scope.match.id}).then(function(result) {
          $scope.chanceList = result.data;
          $scope.chanceListLoading = false;
        }, function (error) {
          $scope.chanceList = [];
          $scope.chanceListLoading = false;
        });
      }


  }]);

});
