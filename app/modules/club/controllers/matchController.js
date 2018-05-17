define(['club/club','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club){
  'use strict';

  club.controller('club.matchController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory', function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory) {

      $scope.lastMatchesList = [];

      $scope.lastMatchesListLoading = false;

      $scope.getLastMatchesList = function() {
        $scope.lastMatchesListLoading = true;
        $scope.lastMatchesList = [];

        // authFactory.get({entity:'matchs',method:'last'}).then(function(result) {
        //   $scope.lastMatchesList = result.data;
        //   $scope.lastMatchesListLoading = false;
        // }, function (error) {
        //   $scope.lastMatchesList = [];
        //   $scope.lastMatchesListLoading = false;
        // });

      };

      $scope.addMatch = function() {
        $location.path('/club/match-add-edit');
      };

    }
  ]);

});
