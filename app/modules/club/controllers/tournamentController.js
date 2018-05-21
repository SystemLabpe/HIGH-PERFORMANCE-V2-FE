define(['club/club','moment','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club,moment){
  'use strict';

  club.controller('club.tournamentController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory',function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory) {

      $scope.subOption = 1; // 1: list, 2:add, 3:edit
      $scope.tournamentList = [];
      $scope.rivalList = [];
      $scope.tournament = {};
      $scope.crudOption = '';

      $scope.tournamentListAlert = null;
      $scope.tournamentListLoading = false;
      $scope.tournamentCrudAlert = null;
      $scope.tournamentCrudLoading = false;
      $scope.rivalAddSelected = {};

      $scope.datePickerOptions = {showWeeks:false};
      $scope.tournamentIDateOpened = false;
      $scope.tournamentEDateOpened = false;

      $scope.openDp = function($event,t_date) {
        $event.preventDefault();
        $event.stopPropagation();
        if(t_date === 'date_init') {
          $scope.tournamentIDateOpened = !$scope.tournamentIDateOpened;
        } else {
          $scope.tournamentEDateOpened = !$scope.tournamentEDateOpened;
        }
      };

      $scope.getTournamentList = function() {
        $scope.tournamentListLoading = true;
        $scope.tournamentList = [];
        authFactory.get({entity:'tournaments',method:'me'}).then(function(result) {
          $scope.tournamentList = result.data;
          $scope.tournamentListLoading = false;
        }, function (error) {
          $scope.tournamentList = [];
          $scope.tournamentListLoading = false;
        });
      };

      $scope.getTournamentList();

      $scope.getRivalList = function() {
        $scope.rivalList = [];
        authFactory.get({entity:'clubs',method:'rivals'}).then(function(result) {
          $scope.rivalList = result.data;
        }, function (error) {
          $scope.rivalList = [];
        });
      };

      $scope.getRivalList();

      $scope.goAddTournament = function() {
        $scope.subOption = 2;
        $scope.tournament = {};
        $scope.tournament.clubs = [];
        $scope.crudOption = 'Agregar';
        $scope.tournamentListAlert = null;
        $scope.tournamentCrudAlert = null;
      };

      $scope.goEditTournament = function(tournament) {
        $scope.subOption = 3;
        $scope.tournament = tournament;
        $scope.tournament.date_init = moment($scope.tournament.date_init)._d;
        $scope.tournament.date_end = moment($scope.tournament.date_end)._d;
        $scope.crudOption = 'Editar';
        $scope.tournamentListAlert = null;
        $scope.tournamentCrudAlert = null;
      };

      $scope.addRival = function(rival) {
        var hasAdded = false;
        angular.forEach($scope.tournament.clubs,function(rivalSelected,key) {
          if(rivalSelected.id === rival.id) {
            hasAdded = true;
          }
        });
        if(!hasAdded) {
          $scope.tournament.clubs.push(rival);
        }
      };

      $scope.removeRivalSelected = function(index) {
        $scope.tournament.clubs.splice(index,1);
      };

      $scope.goRemoveTournament = function(tournament) {
        $scope.cleanAlertTournamentList();
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar el Torneo ' + tournament.name +' ?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.tournamentListLoading = true;
          authFactory.delete({entity:'tournament',id:tournament.id})
          .then(function(result) {
            $scope.tournamentListAlert = errorFactory.getCustomAlert('success','Torneo eliminado satisfactoriamente');
            $scope.getTournamentList();
          }, function (error) {
            $scope.tournamentListAlert = errorFactory.getError(error);
          });
        });
      };

      $scope.tournamentSubmit = function() {
        var request = {
          name: $scope.tournament.name,
          date_init: moment($scope.tournament.date_init).format('YYYY-MM-DD'),
          date_end: moment($scope.tournament.date_end).format('YYYY-MM-DD'),
          clubs: $scope.tournament.clubs
        };
        $scope.tournament.name;

        if ($scope.subOption === 2) {
          addTournament(request);
        } else if ($scope.subOption === 3) {
          editTournament(request);
        }
      };

      function addTournament(request) {
        $scope.tournamentCrudLoading = true;
        authFactory.save({entity:'tournament', method:'me'}, request).then(function(result) {
          $scope.tournamentCrudLoading = false;
          $scope.tournament = {};
          $scope.subOption = 1;
          $scope.tournamentListAlert = errorFactory.getCustomAlert('success','Zona de campo agregada satisfactoriamente');
          $scope.getTournamentList();
          $scope.rivalAddSelected = {};
        }, function (error) {
          showError(error);
        });
      }

      function editTournament(request) {
        $scope.tournamentCrudLoading = true;
        authFactory.edit({entity:'tournament', method:'me',id:$scope.tournament.id}, request).then(function(result) {
          $scope.tournamentCrudLoading = false;
          $scope.tournament = {};
          $scope.subOption = 1;
          $scope.tournamentListAlert = errorFactory.getCustomAlert('success','Zona de campo editada satisfactoriamente');
          $scope.getTournamentList();
          $scope.rivalAddSelected = {};
        }, function (error) {
          showError(error);
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.getTournamentList();
        $scope.tournament = {};
        $scope.tournamentListAlert = null;
        $scope.tournamentCrudAlert = null;
        $scope.rivalAddSelected = {};
      };

      function showError(error) {
        $scope.tournamentCrudLoading = false;
        $scope.tournamentCrudAlert = $filter('errorFilter')(error.data.data.code);
      }

      $scope.cleanAlertTournamentList = function() {
        $scope.tournamentListAlert = null;
      };
  }]);

});
