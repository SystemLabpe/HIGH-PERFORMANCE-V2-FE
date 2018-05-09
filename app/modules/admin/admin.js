define(['angular','auth/auth','angularFileUpload'],function(angular){
  'use strict';

  var admin = angular.module('admin',['auth','angularFileUpload']);
  return admin;

});
