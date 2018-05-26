define(['club/club','moment','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club, moment){
  'use strict';

  club.controller('club.matchDetailController',['$scope','$filter','$location','$timeout','$sce','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$timeout,$sce,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.match = {};
      $scope.showVideo = false;

      $scope.subOption = 3;
      $scope.videoSource = null;

      if(sessionStorage.getItem('match')) {
        $scope.match = JSON.parse(sessionStorage.getItem('match'));
        if ($scope.match.url_detail) {
          $scope.videoSource = $sce.trustAsResourceUrl('//www.youtube.com/embed/' +  getParameterByName('v',$scope.match.url_detail));
        }
        getChanceList();
      }

      $scope.getPossessionStartReport = function(){
        $scope.possessionStartReport = [];
        authFactory.get({entity:'report',method:'match',param1:'initPossession',param2:$scope.match.id}).then(function(result) {
          $scope.possessionStartReport = result.data.reports;
          angular.forEach($scope.possessionStartReport, function(report, index) {
            report.id = 'ps_' + index;
            $('#' + report.id).replaceWith('<canvas id=#' + report.id + '></canvas>');
          });

          $timeout(function() {
            angular.forEach($scope.possessionStartReport, function(report, index) {
              var id = '#' + report.id;
              new Chart($(id), report.chart);
            });
          },40);
        }, function (error) {
          $scope.possessionStartReport = [];
        });
      };

      $scope.getInitialSituationReport = function(){
        $scope.initialSituationReport = [];
        authFactory.get({entity:'report',method:'match',param1:'rivalInitSituation',param2:$scope.match.id}).then(function(result) {
          $scope.initialSituationReport = result.data.reports;
          angular.forEach($scope.initialSituationReport, function(report, index) {
            report.id = 'is_' + index;
            $('#' + report.id).replaceWith('<canvas id=#' + report.id + '></canvas>');
          });

          $timeout(function() {
            angular.forEach($scope.initialSituationReport, function(report, index) {
              var id = '#' + report.id;
              new Chart($(id), report.chart);
            });
          },40);
        }, function (error) {
          $scope.initialSituationReport = [];
        });
      };

      $scope.getDevelopmentOfPossessionReport = function(){
        $scope.developmentOfPossessionReport = [];
        authFactory.get({entity:'report',method:'match',param1:'developmentPossesion',param2:$scope.match.id}).then(function(result) {
          $scope.developmentOfPossessionReport = result.data.reports;
          angular.forEach($scope.developmentOfPossessionReport, function(report, index) {
            report.id = 'dop_' + index;
            $('#' + report.id).replaceWith('<canvas id=#' + report.id + '></canvas>');
          });

          $timeout(function() {
            angular.forEach($scope.developmentOfPossessionReport, function(report, index) {
              var id = '#' + report.id;
              new Chart($(id), report.chart);
            });
          },40);
        }, function (error) {
          $scope.endOfPossessionReport = [];
        });
      };

      $scope.getEndOfPossessionReport = function(){
        $scope.endOfPossessionReport = [];
        authFactory.get({entity:'report',method:'match',param1:'endPossesion',param2:$scope.match.id}).then(function(result) {
          $scope.endOfPossessionReport = result.data.reports;
          angular.forEach($scope.endOfPossessionReport, function(report, index) {
            report.id = 'op_' + index;
            $('#' + report.id).replaceWith('<canvas id=#' + report.id + '></canvas>');
          });

          $timeout(function() {
            angular.forEach($scope.endOfPossessionReport, function(report, index) {
              var id = '#' + report.id;
              new Chart($(id), report.chart);
            });
          },40);
        }, function (error) {
          $scope.endOfPossessionReport = [];
        });
      };

      $scope.getStoppedBallReport = function(){
        $scope.stoppedBallReport = [];
        authFactory.get({entity:'report',method:'match',param1:'stoppedBalls',param2:$scope.match.id}).then(function(result) {
          $scope.stoppedBallReport = result.data.reports;
          angular.forEach($scope.stoppedBallReport, function(report, index) {
            report.id = 'sb_' + index;
            $('#' + report.id).replaceWith('<canvas id=#' + report.id + '></canvas>');
          });

          $timeout(function() {
            angular.forEach($scope.stoppedBallReport, function(report, index) {
              var id = '#' + report.id;
              new Chart($(id), report.chart);
            });
          },40);
        }, function (error) {
          $scope.stoppedBallReport = [];
        });
      };

      $scope.getGeneralReport = function() {
        $scope.lastTournamentGeneralReport = [];
        $scope.reportListLoading = true;
        authFactory.get({entity:'report',method:'match',param1:'general',param2:$scope.match.id}).then(function(result) {
          $scope.lastTournamentGeneralReport = result.data.reports;
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
          $scope.matchList = [];
          $scope.reportListLoading = false;
        });
      };

      $scope.getReportList = function() {
        $scope.getGeneralReport();
        $scope.getPossessionStartReport();
        $scope.getInitialSituationReport();
        $scope.getDevelopmentOfPossessionReport();
        $scope.getEndOfPossessionReport();
        $scope.getStoppedBallReport();
      };

      $scope.getReportList();

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

      $scope.showInfo = function(info) {
        modalFactory.showInfoListModalFactory(info);
      };

      $scope.showVideoContainer = function() {
        $scope.showVideo =! $scope.showVideo;
      };

      function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }

      $scope.goBack = function() {
        $scope.subOption = 3;
        $scope.chance = {};
      };

      $scope.goDetailChance = function(chance) {
        $scope.subOption = 4;
        $scope.chance = chance;
        $scope.chance.chance_type = $scope.chance.chance_type.toString();
      };


  }]);

});
