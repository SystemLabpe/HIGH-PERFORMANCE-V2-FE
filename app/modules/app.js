define(['bootstrap','bootstrapUI',
  'shared/shared','shared/directives/navbar','shared/directives/ngthumb',
  'shared/controllers/userSettingsController','shared/controllers/profileController',
  'auth/auth','auth/factories/authFactory','auth/controllers/roleController',
  'auth/controllers/loginController','auth/controllers/logoutController',
  'admin/admin','admin/controllers/homeController', 'admin/controllers/clubController',
  'admin/controllers/fieldAreaController','admin/controllers/startTypeController',
  'admin/controllers/initialPenetrationController','admin/controllers/playerPositionController',
  'admin/controllers/fieldZoneController','admin/controllers/invationLevelController',
  'admin/controllers/numericalBalanceController','admin/controllers/possessionPassesController',
  'admin/controllers/penetratingPassesController','admin/controllers/progressionTypeController',
  'admin/controllers/pentagonCompletionController','admin/controllers/previousActionController',
  'admin/controllers/completionActionController','admin/controllers/stoppedBallController',

  'club/club','club/controllers/homeController','club/controllers/matchController',
  'club/controllers/tournamentController','club/controllers/rivalCrudController',
  'club/controllers/rivalController','club/controllers/matchAddEditController',
  'club/controllers/timelineController','club/controllers/matchDetailController',
  'club/controllers/clubController','club/controllers/reportTournamentController',

  'admin/controllers/roleController',
  'doctor/doctor','doctor/controllers/homeController',
  'angularRoute','config'],function(){
  'use strict';

  var app = angular.module('app',['ui.bootstrap','ngRoute','config','shared','auth','admin','club']);

  app.config(['$locationProvider','$routeProvider','ROLE',
    function($locationProvider,$routeProvider,ROLE){
      // $locationProvider.html5Mode(true);

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
      });

      $routeProvider
      .when('/', {
        templateUrl : 'modules/auth/views/login.tpl.html',
        controller  : 'auth.loginController',
        resolve     : {
          skipIfLoggedIn: ['auth.authFactory',function (authFactory) {
            return authFactory.skipIfLoggedIn();
          }]
        }
      })
      .when('/login', {
        templateUrl : 'modules/auth/views/login_2.tpl.html',
        controller  : 'auth.loginController',
        resolve     : {
          skipIfLoggedIn: ['auth.authFactory',function (authFactory) {
            return authFactory.skipIfLoggedIn();
          }]
        }
      })
      .when('/logout', {
        template : null,
        controller  : 'auth.logoutController'
      })
      // .when('/configuracion', {
      //   templateUrl : 'modules/shared/views/user-settings.tpl.html',
      //   controller  : 'shared.userSettingsController',
      //   resolve     : {
      //     loginRequired: ['auth.authFactory',function (authFactory) {
      //       return authFactory.loginRequired();
      //     }]
      //   }
      // })
      // .when('/roles', {
      //   templateUrl : 'modules/auth/views/roles.tpl.html',
      //   controller  : 'auth.roleController',
      //   resolve     : {
      //     loginRequired: ['auth.authFactory',function (authFactory) {
      //       return authFactory.loginRequired();
      //     }]
      //   }
      // })
      .when('/profile', {
        templateUrl : 'modules/shared/views/profile.tpl.html',
        controller  : 'shared.profileController',
        resolve     : {
          loginRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRequired();
          }]
        }
      })
      .when('/admin', {
        templateUrl : 'modules/admin/views/home.tpl.html',
        controller  : 'admin.homeController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/club', {
        templateUrl : 'modules/admin/views/club-detail.tpl.html',
        controller  : 'admin.clubController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/field-area', {
        templateUrl : 'modules/admin/views/crud-field-area.tpl.html',
        controller  : 'admin.fieldAreaController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/start-type', {
        templateUrl : 'modules/admin/views/crud-start-type.tpl.html',
        controller  : 'admin.startTypeController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/initial-penetration', {
        templateUrl : 'modules/admin/views/crud-initial-penetration.tpl.html',
        controller  : 'admin.initialPenetrationController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/player-position', {
        templateUrl : 'modules/admin/views/crud-player-position.tpl.html',
        controller  : 'admin.playerPositionController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/field-zone', {
        templateUrl : 'modules/admin/views/crud-field-zone.tpl.html',
        controller  : 'admin.fieldZoneController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/invation-level', {
        templateUrl : 'modules/admin/views/crud-invation-level.tpl.html',
        controller  : 'admin.invationLevelController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/numerical-balance', {
        templateUrl : 'modules/admin/views/crud-numerical-balance.tpl.html',
        controller  : 'admin.numericalBalanceController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/possession-passes', {
        templateUrl : 'modules/admin/views/crud-possession-passes.tpl.html',
        controller  : 'admin.possessionPassesController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/penetrating-passes', {
        templateUrl : 'modules/admin/views/crud-penetrating-passes.tpl.html',
        controller  : 'admin.penetratingPassesController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/progression-type', {
        templateUrl : 'modules/admin/views/crud-progression-type.tpl.html',
        controller  : 'admin.progressionTypeController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/pentagon-completion', {
        templateUrl : 'modules/admin/views/crud-pentagon-completion.tpl.html',
        controller  : 'admin.pentagonCompletionController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/previous-action', {
        templateUrl : 'modules/admin/views/crud-previous-action.tpl.html',
        controller  : 'admin.previousActionController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/completion-action', {
        templateUrl : 'modules/admin/views/crud-completion-action.tpl.html',
        controller  : 'admin.completionActionController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/stopped-ball', {
        templateUrl : 'modules/admin/views/crud-stopped-ball.tpl.html',
        controller  : 'admin.stoppedBallController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/club', {
        templateUrl : 'modules/club/views/home.tpl.html',
        controller  : 'club.homeController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.CLUB.ID);
          }]
        }
      })
      .when('/club/match', {
        templateUrl : 'modules/club/views/match.tpl.html',
        controller  : 'club.matchController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.CLUB.ID);
          }]
        }
      })
      .when('/club/m-tournament', {
        templateUrl : 'modules/club/views/crud-tournament.tpl.html',
        controller  : 'club.tournamentController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.CLUB.ID);
          }]
        }
      })
      .when('/club/m-rival', {
        templateUrl : 'modules/club/views/crud-rival.tpl.html',
        controller  : 'club.rivalCrudController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.CLUB.ID);
          }]
        }
      })
      .when('/club/rival-list', {
        templateUrl : 'modules/club/views/rival.tpl.html',
        controller  : 'club.rivalController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.CLUB.ID);
          }]
        }
      })
      .when('/club/match-add-edit', {
        templateUrl : 'modules/club/views/match-form.tpl.html',
        controller  : 'club.matchAddEditController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.CLUB.ID);
          }]
        }
      })
      .when('/club/match-detail', {
        templateUrl : 'modules/club/views/match-detail.tpl.html',
        controller  : 'club.matchDetailController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.CLUB.ID);
          }]
        }
      })
      .when('/club/report-tournament', {
        templateUrl : 'modules/club/views/report-tournament.tpl.html',
        controller  : 'club.reportTournamentController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.CLUB.ID);
          }]
        }
      })
      .when('/club/club-detail', {
        templateUrl : 'modules/club/views/club-detail.tpl.html',
        controller  : 'club.clubController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.CLUB.ID);
          }]
        }
      })
      .when('/timeline', {
        templateUrl : 'modules/club/views/timeline_2.tpl.html',
        controller  : 'club.timelineController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.CLUB.ID);
          }]
        }
      })


      .otherwise({ redirectTo : '/'});
    }]);

  angular.bootstrap(document, ['app']);
  return app;
});
