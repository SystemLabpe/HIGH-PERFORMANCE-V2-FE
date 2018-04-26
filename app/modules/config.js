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
      SUPERADMIN: {
        ID:1,
        NAME:'Super Administrador',
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
      DOCTOR: {
        ID:2,
        NAME:'Doctor',
        PATH:'/doctor',
         ROUTES: [
          {
            NAME : 'Citas',
            PATH : '/'
          },
          {
            NAME : 'Horarios',
            PATH : '/'
          }
        ]
      },
      RECEPTIONIST: {
        ID:3,
        NAME:'Recepcionista',
        PATH:'/secretary'
      },
      ADMIN: {
        ID:4,
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
