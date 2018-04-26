define(['shared/shared','shared/services/mainService'],function(shared){
  'use strict';

  shared.factory('shared.mainFactory',['$q','shared.mainService', function ($q,mainService) {
    var mainFactory = {};

    mainFactory.list = function(params) {
      var deferred = $q.defer();

      mainService.get(params).$promise.then(function(result) {
        deferred.resolve(result);
      }, function(errorMsg) {
        deferred.reject(errorMsg);
      });

      return deferred.promise;
    };

    mainFactory.save = function(params,request) {
      var deferred = $q.defer();

      mainService.save(params,request).$promise.then(function(result) {
        deferred.resolve(result);
      }, function(errorMsg) {
        deferred.reject(errorMsg);
      });

      return deferred.promise;
    }


    return mainFactory;

  }]);

});
