define(['club/club','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club){
  'use strict';

  club.controller('club.clubController',['$scope','$filter','$location','$timeout','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory', function ($scope,$filter,$location,$timeout,$auth,authFactory,modalFactory,errorFactory) {

    $scope.club = {};
    $scope.filterAlert = null;

    if(sessionStorage.getItem('lastTournament')) {
        $scope.lastTournament = JSON.parse(sessionStorage.getItem('lastTournament'));
      }

    if(sessionStorage.getItem('club')) {
      $scope.club = JSON.parse(sessionStorage.getItem('club'));
      // todo: get matches and report
    }

    $scope.clearFilter  = function(){
      $scope.filter = {};
      $scope.filter.tournament_id = 0;
      $scope.filter.first_club_id = 0;
      $scope.filter.state_first_club_id = null;
      $scope.filter.second_club_id = 0;
    };

    function initFilter() {
      $scope.clearFilter();
      $scope.filter.tournament_id = $scope.lastTournament.id;
      $scope.filter.first_club_id = $scope.club.id;
    }

    initFilter();

    $scope.getTournamentList = function() {
      $scope.tournamentListLoading = true;
      $scope.tournamentList = [];
      authFactory.get({entity:'tournaments',method:'me'}).then(function(result) {
        $scope.tournamentList = result.data;
        $scope.tournamentList.splice(0, 0, {id:0, name:'Todos'});
        $scope.tournamentListLoading = false;
      }, function (error) {
        $scope.tournamentList = [];
        $scope.tournamentListLoading = false;
      });
    };

    $scope.getTournamentList();

    $scope.selectTournament = function(tournamentId,cleanClubs) {
      if (cleanClubs) {
        $scope.filter.first_club_id = 0;
        $scope.filter.second_club_id = 0;
      }
      $scope.filter.first_club_id = $scope.club.id;
      $scope.filter.state_first_club_id = null;
      $scope.filter.second_club_id = 0;
      $scope.rivalList = [];

      var getParameters = {};
      getParameters.entity = 'clubs';
      getParameters.method = 'rivals';
      if(tournamentId !== 0) {
        getParameters.param1 = 'tournament';
        getParameters.param2 = tournamentId;
      }

      authFactory.get(getParameters).then(function(result) {
        $scope.rivalList = result.data;
        $scope.rivalList.splice(0, 0, $scope.myClub);
        $scope.rivalList.splice(0, 0, {id:0, full_name:'Todos'});
      }, function (error) {
        $scope.rivalList = [];
      });
    };

    $scope.selectTournament(0, false);

    $scope.getPossessionStartReport = function(){
      $scope.possessionStartReport = [];
      authFactory.save({entity:'report',method:'filter',param1:'initPossession'}, $scope.filterRequest).then(function(result) {
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
      authFactory.save({entity:'report',method:'filter',param1:'rivalInitSituation'},$scope.filterRequest).then(function(result) {
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
      authFactory.save({entity:'report',method:'filter',param1:'developmentPossesion'},$scope.filterRequest).then(function(result) {
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
      authFactory.save({entity:'report',method:'filter',param1:'endPossesion'},$scope.filterRequest).then(function(result) {
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
      authFactory.save({entity:'report',method:'filter',param1:'stoppedBalls'},$scope.filterRequest).then(function(result) {
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
      authFactory.save({entity:'report',method:'filter',param1:'general'},$scope.filterRequest).then(function(result) {
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

    $scope.filterMatch = function() {
      $scope.filterAlert = null;
      $scope.filterRequest = validateFilter();
      if ($scope.filterRequest) {
        $scope.matchesList = [];
        $scope.matchListLoading = true;
        authFactory.save({entity:'matches',method:'me',param1:'filter'},$scope.filterRequest).then(function(result) {
          $scope.matchesList = result.data;
          $scope.matchListLoading = false;
        }, function (error) {
          $scope.matchesList = [];
          $scope.matchListLoading = false;
        });
      }

      $scope.getGeneralReport();
      $scope.getPossessionStartReport();
      $scope.getInitialSituationReport();
      $scope.getDevelopmentOfPossessionReport();
      $scope.getEndOfPossessionReport();
      $scope.getStoppedBallReport();
    };

    $scope.filterMatch();

    function validateFilter() {
      if (($scope.filter.first_club_id !== 0 ||  $scope.filter.second_club_id !== 0) &&
          $scope.filter.first_club_id === $scope.filter.second_club_id) {
        $scope.filterAlert = errorFactory.getCustomAlert('danger','Los equipos deben ser distintos');
        return null;
      }
      var filter = {};
      if ($scope.filter.tournament_id != 0) {
        filter.tournament_id = $scope.filter.tournament_id;
      } else {
        filter.tournament_id = null;
      }
      if ($scope.filter.first_club_id != 0) {
        filter.first_club_id = $scope.filter.first_club_id;
      } else {
        filter.first_club_id = null;
      }
      if ($scope.filter.second_club_id !== 0) {
        filter.second_club_id = $scope.filter.second_club_id;
      } else {
        filter.second_club_id = null;
      }
      if ($scope.filter.state_first_club_id) {
        filter.state_first_club_id = $scope.filter.state_first_club_id;
      } else {
        filter.state_first_club_id = null;
      }

      return filter;
    }

    $scope.goMatchDetail = function(match) {
      sessionStorage.setItem('match',JSON.stringify(match));
      $location.path('/club/match-detail');
    };



    }
  ]);

});
