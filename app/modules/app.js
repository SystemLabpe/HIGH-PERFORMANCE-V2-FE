define(['bootstrap','bootstrapUI',
  'shared/shared','shared/directives/navbar','shared/controllers/userSettingsController',
  'auth/auth','auth/factories/authFactory','auth/controllers/roleController',
  'auth/controllers/loginController','auth/controllers/logoutController',
  'admin/admin','admin/controllers/homeController', 'admin/controllers/clubController',
  'admin/controllers/fieldAreaController',

  'admin/controllers/roleController',
  'doctor/doctor','doctor/controllers/homeController',
  'angularRoute','config'],function(){
  'use strict';

  var app = angular.module('app',['ui.bootstrap','ngRoute','config','shared','auth','admin','doctor']);

  app.config(['$locationProvider','$routeProvider','ROLE',
    function($locationProvider,$routeProvider,ROLE){
      $locationProvider.html5Mode(true);

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
      // .when('/perfil', {
      //   templateUrl : 'modules/shared/views/profile.tpl.html',
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



      .when('/admin/mantenimiento', {
        templateUrl : 'modules/admin/views/maintenance.tpl.html',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/mantenimiento/doctor', {
        templateUrl : 'modules/admin/views/crud-doctor.tpl.html',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/mantenimiento/rol', {
        templateUrl : 'modules/admin/views/crud-role.tpl.html',
        controller  : 'admin.roleController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/admin/reportes', {
        templateUrl : 'modules/admin/views/reports.tpl.html',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.ADMIN.ID);
          }]
        }
      })
      .when('/doctor', {
        templateUrl : 'modules/doctor/views/home.tpl.html',
        controller  : 'doctor.homeController',
        resolve     : {
          loginRolRequired: ['auth.authFactory',function (authFactory) {
            return authFactory.loginRolRequired(ROLE.DOCTOR.ID);
          }]
        }
      })
      .otherwise({ redirectTo : '/'});
    }]);

  angular.bootstrap(document, ['app']);
  return app;
});
