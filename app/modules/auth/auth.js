define(['angular','angularResource','satellizer'],function(angular){
  'use strict';
  var auth = angular.module('auth',['ngResource','satellizer','config']);

  auth.config(['$authProvider','BASE_URL','AUTH',
    function($authProvider,BASE_URL,AUTH) {
      $authProvider.baseUrl = BASE_URL;
      $authProvider.loginUrl = AUTH.LOGIN_URL;
      $authProvider.authHeader = AUTH.AUTH_HEADER;
      $authProvider.authToken = AUTH.AUTH_TOKEN;
      $authProvider.tokenName = AUTH.AUTH_TOKEN_NAME;
    }
  ]);

  return auth;
});
