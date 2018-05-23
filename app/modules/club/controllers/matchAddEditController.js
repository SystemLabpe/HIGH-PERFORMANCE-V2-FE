define(['club/club','moment','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club, moment){
  'use strict';

  club.controller('club.matchAddEditController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.match = {};
      if(sessionStorage.getItem('match')) {
        var match = JSON.parse(sessionStorage.getItem('match'));
        getMatch(match);
        $scope.match.id = match.id;
        getChanceList();
      }

      function getMatch(match) {
        $scope.chanceFormLoading = true;
        authFactory.get({entity:'match',id:match.id}).then(function(result) {
          $scope.selectTournament(match.tournament_id,false);
          if (result.data.home_score) {
            result.data.home_score = parseInt(result.data.home_score);
          }
          if (result.data.away_score) {
            result.data.away_score = parseInt(result.data.away_score);
          }
          if (result.data.match_date) {
            result.data.match_date = moment(result.data.match_date)._d;
          }
          $scope.match = result.data;
          $scope.chanceFormLoading = false;
        }, function (error) {
          $scope.chanceFormLoading = false;
        });
      }

      $scope.crudMatchOption = 'Agregar';

      $scope.tournamentList = [];
      $scope.rivalList = [];
      $scope.chanceList = [];
      $scope.chance = {};

      $scope.subOption = 1; // 1: list, 2:add, 3:edit chances
      $scope.stoppedBallList = [];
      $scope.startTypeList = [];
      $scope.fieldZoneList = [];
      $scope.initialPenetrationList = [];
      $scope.playerPositionList = [];
      $scope.fieldAreaList = [];
      $scope.invationLevelList = [];
      $scope.numericalBalanceList = [];
      $scope.possessionPassesList = [];
      $scope.penetratingPassesList = [];
      $scope.progressionTypeList = [];
      $scope.pentagonCompletionList = [];
      $scope.previousActionList = [];
      $scope.completionActionList = [];

      $scope.matchFormAlert = null;
      $scope.matchFormLoading = false;
      $scope.chanceListAlert = null;
      $scope.chanceListLoading = null;
      $scope.chanceFormAlert = null;
      $scope.chanceFormLoading = false;

      $scope.openDp = function($event,t_date) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.matchDateOpened = !$scope.matchDateOpened;
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

      $scope.selectTournament = function(tournamentId,cleanClubs) {
        if (cleanClubs) {
          $scope.match.home_club_id = null;
          $scope.match.away_club_id = null;
        }
        $scope.rivalList = [];
        authFactory.get({entity:'clubs',method:'rivals', param1:'tournament', param2:tournamentId}).then(function(result) {
          $scope.rivalList = result.data;
          $scope.rivalList.splice(0, 0, $scope.myClub);
        }, function (error) {
          $scope.rivalList = [];
        });
      }

      $scope.matchSubmit = function() {
        $scope.matchFormAlert = null;
        if (validateMatch()) {
          var request = {
            match_date: moment($scope.match.match_date).format('YYYY-MM-DD'),
            home_score: $scope.match.home_score,
            away_score: $scope.match.away_score,
            tournament_id: $scope.match.tournament_id,
            home_club_id: $scope.match.home_club_id,
            away_club_id: $scope.match.away_club_id,
            url_detail: $scope.match.url_detail
          };
          if (!$scope.match.id) {
            addMatch(request);
          } else {
            editMatch(request);
          }
        }
      };

      function validateMatch() {
        if (!$scope.match.tournament_id) {
          $scope.matchFormAlert = errorFactory.getCustomAlert('danger','Debe seleccionar Torneo');
          return false;
        } else if (!$scope.match.home_club_id || !$scope.match.away_club_id) {
          $scope.matchFormAlert = errorFactory.getCustomAlert('danger','Debe seleccionar equipo Local y Visitante');
          return false;
        } else if ($scope.match.home_club_id === $scope.match.away_club_id) {
          $scope.matchFormAlert = errorFactory.getCustomAlert('danger','Los equipos Local y Visitante deben ser distintos');
          return false;
        }
        return true;
      }

      function addMatch(request) {
        $scope.matchFormLoading = true;
        authFactory.save({entity:'match', method:'me'}, request).then(function(result) {
          $scope.matchFormLoading = false;
          $scope.tournament = {};
          $scope.subOption = 1;
          $scope.matchFormAlert = errorFactory.getCustomAlert('success','Partido agregado satisfactoriamente');
          $scope.match.id = result.data.id;
          $scope.rivalAddSelected = {};
        }, function (error) {
          $scope.matchFormLoading = false;

        });
      }

      function editMatch(request) {
        $scope.matchFormLoading = true;
        authFactory.edit({entity:'match', method:'me', id:$scope.match.id}, request).then(function(result) {
          $scope.matchFormLoading = false;
          $scope.tournament = {};
          $scope.subOption = 1;
          $scope.matchFormAlert = errorFactory.getCustomAlert('success','Partido editado satisfactoriamente');
          $scope.rivalAddSelected = {};
        }, function (error) {
          $scope.matchFormLoading = false;

        });
      }

      $scope.deleteMatch = function(){
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar el Partido?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.chanceFormLoading = true;
          authFactory.delete({entity:'match',method:'me',id:$scope.match.id})
          .then(function(result) {
            $location.path('/club/match');
          }, function (error) {
            $scope.matchFormAlert = errorFactory.getError(error);
            $scope.chanceFormLoading = false;
          });
        });
      };

      function getChanceList() {
        if ($scope.match.id) {
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
      }

      $scope.goAddChance = function() {
        $scope.subOption = 2;
        $scope.matchFormAlert = null;
        $scope.chance = {};
        $scope.crudChanceOption = 'Agregar';
        $scope.matchFormAlert = null;
        $scope.chanceFormAlert = null;
      };

      $scope.goEditChance = function(chance) {
        $scope.subOption = 3;
        $scope.matchFormAlert = null;
        $scope.chance = chance;
        $scope.chance.chance_type = $scope.chance.chance_type.toString();
        $scope.crudChanceOption = 'Editar';
        $scope.matchFormAlert = null;
        $scope.chanceFormAlert = null;
      };

      $scope.goDetailChance = function(chance) {
        $scope.subOption = 4;
        $scope.matchFormAlert = null;
        $scope.chance = chance;
        $scope.chance.chance_type = $scope.chance.chance_type.toString();
        $scope.matchFormAlert = null;
        $scope.chanceFormAlert = null;
      };

      $scope.deleteChance = function(chance) {
        var modalData = {
          title:'Confirme eliminación',
          message:'¿Desea eliminar la Ocación de Gol?'
        };
        modalFactory.showModal(modalData)
        .then(function() {
          $scope.chanceFormLoading = true;
          authFactory.delete({entity:'chance',method:'me',id:chance.id})
          .then(function(result) {
            $scope.chanceListAlert = errorFactory.getCustomAlert('success','Ocación de Gol eliminada satisfactoriamente');
            $scope.goBack();
            $scope.chanceFormLoading = false;
            getChanceList();
          }, function (error) {
            $scope.chanceListAlert = errorFactory.getError(error);
            $scope.chanceFormLoading = false;
          });
        });
      };

      $scope.chanceSubmit = function() {
        $scope.chance.match_id = $scope.match.id;
        if (!$scope.chance.is_goal) {
          $scope.chance.is_goal = 0;
          $scope.chance.scored_player = null;
          $scope.chance.assisted_player = null;
        }
        if ($scope.chance.chance_type == 1) {
          $scope.chance.stopped_ball_id = null;
        } else if ($scope.chance.chance_type == 2) {
          $scope.chance.start_type_id = null;
          $scope.chance.field_zone_id = null;
          $scope.chance.initial_penetration_id = null;
          $scope.chance.player_position_id = null;
          $scope.chance.invation_level_id = null;
          $scope.chance.numerical_balance_id = null;
          $scope.chance.possession_passes_id = null;
          $scope.chance.penetrating_passes_id = null;
          $scope.chance.progression_type_id = null;
          $scope.chance.pentagon_completion_id = null;
          $scope.chance.previous_action_id = null;
          $scope.chance.completion_action_id = null;
          $scope.chance.penultimate_field_zone = null;
          $scope.chance.ultimate_fieldZone_id = null;
        }
        if ($scope.subOption === 2) {
          addChance();
        } else if ($scope.subOption === 3) {
          editChance();
        }
      };

      function addChance() {
        $scope.chanceFormLoading = true;
        authFactory.save({entity:'chance', method:'me'}, $scope.chance).then(function(result) {
          $scope.chanceFormLoading = false;
          $scope.chance = {};
          $scope.subOption = 1;
          $scope.chanceListAlert = errorFactory.getCustomAlert('success','Ocación de Gol agregada satisfactoriamente');
          getChanceList();
        }, function (error) {
          $scope.chanceFormLoading = false;
        });
      }

      function editChance() {
        $scope.chanceFormLoading = true;
        authFactory.edit({entity:'chance', method:'me', id:$scope.chance.id}, $scope.chance).then(function(result) {
          $scope.chanceFormLoading = false;
          $scope.chance = {};
          $scope.subOption = 1;
          $scope.chanceListAlert = errorFactory.getCustomAlert('success','Ocación de Gol editada satisfactoriamente');
          getChanceList();
        }, function (error) {
          $scope.chanceFormLoading = false;
        });
      }

      $scope.goBack = function() {
        $scope.subOption = 1;
        $scope.chance = {};
        $scope.matchFormAlert = null;
      };

      $scope.showInfo = function(info) {
        modalFactory.showInfoListModalFactory(info);
      };

      $scope.getStoppedBallList = function() {
        $scope.stoppedBallListLoading = true;
        $scope.stoppedBallList = [];
        authFactory.get({entity:'stoppedBalls'}).then(function(result) {
          $scope.stoppedBallList = result.data;
          $scope.stoppedBallListLoading = false;
        }, function (error) {
          $scope.stoppedBallList = [];
          $scope.stoppedBallListLoading = false;
        });
      };

      $scope.getStoppedBallList();

      $scope.getStartTypeList = function() {
        $scope.startTypeListLoading = true;
        $scope.startTypeList = [];
        authFactory.get({entity:'startTypes'}).then(function(result) {
          $scope.startTypeList = result.data;
          $scope.startTypeListLoading = false;
        }, function (error) {
          $scope.startTypeList = [];
          $scope.startTypeListLoading = false;
        });
      };

      $scope.getStartTypeList();

      $scope.getFieldZoneList = function() {
        $scope.fieldZoneListLoading = true;
        $scope.fieldZoneList = [];
        authFactory.get({entity:'fieldZones'}).then(function(result) {
          $scope.fieldZoneList = result.data;
          $scope.fieldZoneListLoading = false;
        }, function (error) {
          $scope.fieldZoneList = [];
          $scope.fieldZoneListLoading = false;
        });
      };

      $scope.getFieldZoneList();

      $scope.getInitialPenetrationList = function() {
        $scope.initialPenetrationListLoading = true;
        $scope.initialPenetrationList = [];
        authFactory.get({entity:'initialPenetrations'}).then(function(result) {
          $scope.initialPenetrationList = result.data;
          $scope.initialPenetrationListLoading = false;
        }, function (error) {
          $scope.initialPenetrationList = [];
          $scope.initialPenetrationListLoading = false;
        });
      };

      $scope.getInitialPenetrationList();

      $scope.getPlayerPositionList = function() {
        $scope.playerPositionListLoading = true;
        $scope.playerPositionList = [];
        authFactory.get({entity:'playerPositions'}).then(function(result) {
          $scope.playerPositionList = result.data;
          $scope.playerPositionListLoading = false;
        }, function (error) {
          $scope.playerPositionList = [];
          $scope.playerPositionListLoading = false;
        });
      };

      $scope.getPlayerPositionList();

      $scope.getFieldAreaList = function() {
        $scope.fieldAreaListLoading = true;
        $scope.fieldAreaList = [];
        authFactory.get({entity:'fieldAreas'}).then(function(result) {
          $scope.fieldAreaList = result.data;
          $scope.fieldAreaListLoading = false;
        }, function (error) {
          $scope.fieldAreaList = [];
          $scope.fieldAreaListLoading = false;
        });
      };

      $scope.getFieldAreaList();

      $scope.getInvationLevelList = function() {
        $scope.invationLevelListLoading = true;
        $scope.invationLevelList = [];
        authFactory.get({entity:'invationLevels'}).then(function(result) {
          $scope.invationLevelList = result.data;
          $scope.invationLevelListLoading = false;
        }, function (error) {
          $scope.invationLevelList = [];
          $scope.invationLevelListLoading = false;
        });
      };

      $scope.getInvationLevelList();

      $scope.getNumericalBalanceList = function() {
        $scope.numericalBalanceListLoading = true;
        $scope.numericalBalanceList = [];
        authFactory.get({entity:'numericalBalances'}).then(function(result) {
          $scope.numericalBalanceList = result.data;
          $scope.numericalBalanceListLoading = false;
        }, function (error) {
          $scope.numericalBalanceList = [];
          $scope.numericalBalanceListLoading = false;
        });
      };

      $scope.getNumericalBalanceList();

      $scope.getPossessionPassesList = function() {
        $scope.possessionPassesListLoading = true;
        $scope.possessionPassesList = [];
        authFactory.get({entity:'possessionPasses'}).then(function(result) {
          $scope.possessionPassesList = result.data;
          $scope.possessionPassesListLoading = false;
        }, function (error) {
          $scope.possessionPassesList = [];
          $scope.possessionPassesListLoading = false;
        });
      };

      $scope.getPossessionPassesList();

      $scope.getPenetratingPassesList = function() {
        $scope.penetratingPassesListLoading = true;
        $scope.penetratingPassesList = [];
        authFactory.get({entity:'penetratingPasses'}).then(function(result) {
          $scope.penetratingPassesList = result.data;
          $scope.penetratingPassesListLoading = false;
        }, function (error) {
          $scope.penetratingPassesList = [];
          $scope.penetratingPassesListLoading = false;
        });
      };

      $scope.getPenetratingPassesList();

      $scope.getProgressionTypeList = function() {
        $scope.progressionTypeListLoading = true;
        $scope.progressionTypeList = [];
        authFactory.get({entity:'progressionTypes'}).then(function(result) {
          $scope.progressionTypeList = result.data;
          $scope.progressionTypeListLoading = false;
        }, function (error) {
          $scope.progressionTypeList = [];
          $scope.progressionTypeListLoading = false;
        });
      };

      $scope.getProgressionTypeList();

      $scope.getPentagonCompletionList = function() {
        $scope.pentagonCompletionListLoading = true;
        $scope.pentagonCompletionList = [];
        authFactory.get({entity:'pentagonCompletions'}).then(function(result) {
          $scope.pentagonCompletionList = result.data;
          $scope.pentagonCompletionListLoading = false;
        }, function (error) {
          $scope.pentagonCompletionList = [];
          $scope.pentagonCompletionListLoading = false;
        });
      };

      $scope.getPentagonCompletionList();

      $scope.getPreviousActionList = function() {
        $scope.previousActionListLoading = true;
        $scope.previousActionList = [];
        authFactory.get({entity:'previousActions'}).then(function(result) {
          $scope.previousActionList = result.data;
          $scope.previousActionListLoading = false;
        }, function (error) {
          $scope.previousActionList = [];
          $scope.previousActionListLoading = false;
        });
      };

      $scope.getPreviousActionList();

      $scope.getCompletionActionList = function() {
        $scope.completionActionListLoading = true;
        $scope.completionActionList = [];
        authFactory.get({entity:'completionActions'}).then(function(result) {
          $scope.completionActionList = result.data;
          $scope.completionActionListLoading = false;
        }, function (error) {
          $scope.completionActionList = [];
          $scope.completionActionListLoading = false;
        });
      };

      $scope.getCompletionActionList();

      $scope.cleanAlert = function() {
        $scope.matchFormAlert = null;
        $scope.chanceListAlert = null;
        $scope.chanceFormAlert = null;
      };
  }]);

});
