define(['club/club','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club){
  'use strict';

  club.controller('club.matchController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory', function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory) {

      $scope.tournamentList = [];
      $scope.matchList = [];
      // todo: replace tournament_id

      $scope.matchListLoading = false;
      $scope.filterAlert = null;

      $scope.clearFilter  = function(){
        $scope.filter = {};
        $scope.filter.tournament_id = 0;
        $scope.filter.home_club_id = $scope.myClub.id;
        $scope.filter.away_club_id = 0;
      };

      $scope.clearFilter();

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
          $scope.filter.home_club_id = 0;
          $scope.filter.away_club_id = 0;
        }
        $scope.filter.home_club_id = $scope.myClub.id;
        $scope.filter.away_club_id = 0;
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

      $scope.filterMatch = function() {
        $scope.filterAlert = null;
        if (validateFilter()) {

        }
      };

      function validateFilter() {
        console.log('==> ', $scope.filter);
        if (($scope.filter.home_club_id !== 0 ||  $scope.filter.away_club_id !== 0) &&
            $scope.filter.home_club_id === $scope.filter.away_club_id) {
          $scope.filterAlert = errorFactory.getCustomAlert('danger','Los equipos Local y Visitante deben ser distintos');
          return false;
        }
        return true;
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
