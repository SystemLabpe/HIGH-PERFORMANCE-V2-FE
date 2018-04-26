define(['shared/shared'],function(shared){
  'use strict';

  shared.service('shared.mainService',['$resource','BASE_URL', function ($resource,BASE_URL){
    return $resource(BASE_URL + '/:entity/:method/:id/:param1/:param2',null,
      {
      'put': { method:'PUT' ,params: {entity : '@entity', method:'@method'} }
      }
    );
  }]);

});
