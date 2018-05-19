define(['club/club','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club){
  'use strict';

  club.controller('club.homeController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory', function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory) {

      $scope.lastMatchesList = [];

      $scope.lastMatchesListLoading = false;

      $scope.getLastMatchesList = function() {
        $scope.lastMatchesListLoading = true;
        $scope.lastMatchesList = [];

        authFactory.get({entity:'matches',method:'me'}).then(function(result) {
          $scope.lastMatchesList = result.data.slice(0,5);
          $scope.lastMatchesListLoading = false;
        }, function (error) {
          $scope.lastMatchesList = [];
          $scope.matchListLoading = false;
        });

      };

      $scope.getLastMatchesList();

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

      $scope.goMatchDetail = function(match) {
        sessionStorage.setItem('match',JSON.stringify(match));
        $location.path('/club/match-detail');
      };

    }

  ]);

});
