define([],function(){
  'use strict';

  var config = angular.module('config', []);

  config.constant('BASE_URL','http://192.168.1.34:8080');

  config.constant(
    'AUTH', {
      LOGIN_URL: '/auth',
      AUTH_HEADER: 'X-Auth-Token',
      AUTH_TOKEN: null
    }
  );

  config.constant(
    'ROLE', {
      ADMIN: {
        ID:1,
        NAME:'Administrador',
        PATH:'/admin',
        ROUTES: [
          {
            NAME : 'Mantenimiento',
            PATH : '/admin/mantenimiento'
          },
          {
            NAME : 'Reportes',
            PATH : '/admin/reportes'
          }
        ]
      },
      CLIENT: {
        ID: 2,
        NAME: "Club",
        PATH: "/club",
        ROUTES: [
          {
            NAME : 'JUGADORES',
            PATH : '/club/jugadores'
          },
          {
            NAME : 'RIVALES',
            PATH : '/club/rivales'
          }
        ]
      }
    }
  );

  config.constant(
    'STATE', {
      DISABLE : '0',
      ENABLE  : '1'
    }
  );

  config.constant(
    'MESSAGE', {
      SUCCESS : {
        TYPE  : 'success'
      },
      INFO    : {
        TYPE  : 'info'
      },
      WARNING  : {
        TYPE  : 'warning'
      },
      ERROR : {
        TEXT  : 'Ocurrión un eror, recargue la página.',
        TYPE  : 'danger'
      },
    }
  );

  return config;
});
