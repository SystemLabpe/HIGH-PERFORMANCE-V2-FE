define(['club/club','chart','jquery','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club,Chart,$){
  'use strict';

  club.controller('club.homeController',['$scope','$filter','$location','$timeout','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory', function ($scope,$filter,$location,$timeout,$auth,authFactory,modalFactory,errorFactory) {

      $scope.lastMatchesList = [];
      $scope.lastMatchGeneralReport = [];
      $scope.lastMatchReport = [];
      $scope.lastMatch = {};

      $scope.lastMatchesListLoading = false;

      $scope.getLastMatchesList = function() {
        $scope.lastMatchesListLoading = true;
        $scope.lastMatchesList = [];

        authFactory.get({entity:'matches',method:'me',id:'home'}).then(function(result) {
          $scope.lastMatchesList = result.data;
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
        authFactory.get({entity:'clubs',method:'rivals',id:'home'}).then(function(result) {
          $scope.rivalList = result.data;
          $scope.rivalList.splice(0, 0, $scope.myClub);
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

      $scope.goRivalDetail = function(club) {
        sessionStorage.setItem('club',JSON.stringify(club));
        $location.path('/club/club-detail');
      };

      $scope.getLastGameGeneralReport = function() {
        $scope.lastGameGeneralReportLoading = true;
        $scope.lastMatchGeneralReport = [];
        authFactory.get({entity:'report',method:'lastmatch',id:'general'}).then(function(result) {
          $scope.lastMatchGeneralReport = result.data.reports;
          $scope.lastmatch = result.data.match;
          sessionStorage.setItem('lastTournament',JSON.stringify($scope.lastmatch.tournament));
          $scope.lastGameGeneralReportLoading = false;

          angular.forEach($scope.lastMatchGeneralReport, function(report, index) {
            report.id = 'g_' + index;
            $('#' + report.id).replaceWith('<canvas id=#' + report.id + '></canvas>');
          });

          $timeout(function() {

            angular.forEach($scope.lastMatchGeneralReport, function(report, index) {
              var id = '#' + report.id;
              new Chart($(id), report.chart);
            });
          },40);


        }, function (error) {
          $scope.lastMatchGeneralReport = [];
          $scope.lastGameGeneralReportLoading = false;
        });
      };

      $scope.getLastGameGeneralReport();

      $scope.getLastTournamentGeneralRepor = function() {
        $scope.lastGameGeneralReportLoading = true;
        $scope.lastTournamentGeneralReport = [];
        authFactory.get({entity:'report',method:'lasttournament',id:'general'}).then(function(result) {
          $scope.lastTournamentGeneralReport = result.data.reports;
          // $scope.lastmatch = result.data.match;
          // sessionStorage.setItem('lastTournament',JSON.stringify($scope.lastmatch.tournament));
          $scope.lastGameGeneralReportLoading = false;

          angular.forEach($scope.lastTournamentGeneralReport, function(report, index) {
            report.id = 'tg_' + index;
            $('#' + report.id).replaceWith('<canvas id=#' + report.id + '></canvas>');
          });

          $timeout(function() {
            angular.forEach($scope.lastTournamentGeneralReport, function(report, index) {
              var id = '#' + report.id;
              new Chart($(id), report.chart);
            });
          },40);


        }, function (error) {
          $scope.lastTournamentGeneralReport = [];
          $scope.lastGameGeneralReportLoading = false;
        });
      };

      $scope.getLastTournamentGeneralRepor();
    }

  ]);

});
