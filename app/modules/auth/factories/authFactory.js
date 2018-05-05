define(['auth/auth','auth/services/authService'],function(auth){
  'use strict';

  auth.factory('auth.authFactory',['$q','$location','$auth','auth.authService','ROLE',
    function ($q,$location,$auth,authService,ROLE) {
      var authFactory = {};

      authFactory.loginRolRequired = function(roleId) {

        var deferred = $q.defer();

        if ($auth.isAuthenticated()) {
          var roleName = localStorage.getItem('currentRole');
          if (ROLE[roleName].ID === roleId)
            deferred.resolve();
          else
            $location.path(ROLE[roleName].PATH);
        } else {
          $location.path('/logout');
        }

        return deferred.promise;
      };

      authFactory.loginRequired = function() {
        var deferred = $q.defer();

        if ($auth.isAuthenticated()) {
            deferred.resolve();
        } else {
          $location.path('/logout');
        }

        return deferred.promise;
      };

      authFactory.skipIfLoggedIn = function() {
        var deferred = $q.defer();

        if ($auth.isAuthenticated()) {
          var roleName = localStorage.getItem('currentRole');
          if (roleName) {
            $location.path(ROLE[roleName].PATH);
          } else {
            $location.path('/roles');
          }
        } else {
          deferred.resolve();
        }

        return deferred.promise;
      };

      authFactory.get = function(params) {
        var deferred = $q.defer();

        authService.get(params).$promise.then(function(result) {
          deferred.resolve(result.data);
        }, function(errorMsg) {
          deferred.reject(errorMsg);
        });

        return deferred.promise;
      };

      authFactory.list = function(params) {
        var deferred = $q.defer();

        authService.query(params).$promise.then(function(result) {
          deferred.resolve(result);
        }, function(errorMsg) {
          deferred.reject(errorMsg);
        });

        return deferred.promise;
      };

      authFactory.save = function(params,request) {
        var deferred = $q.defer();

        authService.save(params,request).$promise.then(function(result) {
          deferred.resolve(result.data);
        }, function(errorMsg) {
          deferred.reject(errorMsg);
        });

        return deferred.promise;
      }

      authFactory.edit = function(params,request) {
        var deferred = $q.defer();

        authService.put(params,request).$promise.then(function(result) {
          deferred.resolve(result.data);
        }, function(errorMsg) {
          deferred.reject(errorMsg);
        });

        return deferred.promise;
      }

      authFactory.delete = function(params,request) {
        var deferred = $q.defer();

        authService.delete(params,request).$promise.then(function(result) {
          deferred.resolve(result);
        }, function(errorMsg) {
          deferred.reject(errorMsg);
        });

        return deferred.promise;
      }
      return authFactory;
    }
  ]);

});
