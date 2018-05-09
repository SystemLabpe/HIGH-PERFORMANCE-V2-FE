define([],function(){
  'use strict';

  var config = angular.module('config', []);

  // config.constant('BASE_URL','http://18.188.252.113/api');
  config.constant('BASE_URL','http://10.168.1.138:8080/api');
  config.constant('BASE_URL_IMG','http://18.188.252.113/img/');

  config.constant(
    'AUTH', {
      LOGIN_URL: '/login',
      AUTH_HEADER: 'Authorization',
      AUTH_TOKEN: 'Bearer',
      AUTH_TOKEN_NAME: 'access_token'
    }
  );

  config.constant(
    'ROLE', {
      ADMIN: {
        ID:2,
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
        ID: 1,
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
