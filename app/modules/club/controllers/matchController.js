define(['club/club','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club){
  'use strict';

  club.controller('club.matchController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory', function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory) {

      $scope.matchList = [];

      $scope.matchListLoading = false;

      $scope.getMatchList = function() {
        $scope.matchListLoading = true;
        $scope.matchList = [];

        authFactory.get({entity:'matches',method:'me'}).then(function(result) {
          $scope.matchList = result.data;
          $scope.matchListLoading = false;
        }, function (error) {
          $scope.matchList = [];
          $scope.matchListLoading = false;
        });
      };

      $scope.getMatchList();

      $scope.goMatchDetail = function(match) {
        sessionStorage.setItem('match',JSON.stringify(match));
        $location.path('/club/match-detail');
      };

      $scope.addMatch = function() {
        $location.path('/club/match-add-edit');
      };

      sessionStorage.removeItem('match');

    }
  ]);

});
