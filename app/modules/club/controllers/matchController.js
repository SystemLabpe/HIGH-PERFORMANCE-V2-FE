define(['club/club','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club){
  'use strict';

  club.controller('club.matchController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory', function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory) {

      $scope.tournamentList = [];
      $scope.matchList = [];

      if(sessionStorage.getItem('lastTournament')) {
        $scope.lastTournament = JSON.parse(sessionStorage.getItem('lastTournament'));
      }

      // todo: replace tournament_id

      $scope.matchListLoading = false;
      $scope.filterAlert = null;

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
        $scope.filter.first_club_id = $scope.myClub.id;
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
        $scope.filter.first_club_id = $scope.myClub.id;
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

      // $scope.getMatchList = function() {
      //   $scope.matchListLoading = true;
      //   $scope.matchList = [];

      //   authFactory.get({entity:'matches',method:'me'}).then(function(result) {
      //     $scope.matchList = result.data;
      //     $scope.matchListLoading = false;
      //   }, function (error) {
      //     $scope.matchList = [];
      //     $scope.matchListLoading = false;
      //   });
      // };

      // $scope.getMatchList();

      $scope.filterMatch = function() {
        $scope.filterAlert = null;
        var request = validateFilter();
        if (request) {
          $scope.matchList = [];
          $scope.matchListLoading = true;
          authFactory.save({entity:'matches',method:'me',param1:'filter'},request).then(function(result) {
            $scope.matchList = result.data;
            $scope.matchListLoading = false;
          }, function (error) {
            $scope.matchList = [];
            $scope.matchListLoading = false;
          });
        }
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

      $scope.addMatch = function() {
        $location.path('/club/match-add-edit');
      };

      sessionStorage.removeItem('match');

    }
  ]);

});
