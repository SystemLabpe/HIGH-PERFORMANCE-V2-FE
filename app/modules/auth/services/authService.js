define(['auth/auth'],function(auth){
  'use strict';

  auth.service('auth.authService',['$resource','BASE_URL',
    function ($resource,BASE_URL){
      return $resource(BASE_URL + '/:entity/:method/:id/:param1/:param2',null,
        {
          'get' : {
            method:'GET' ,params: {entity : '@entity', method:'@method'},
            transformResponse: function(data,headers,status) {
              var response = {};
              response.data = JSON.parse(data);
              response.status = status;
              return response;
            }
          },
          'query' : {
            method:'GET' , params: {entity : '@entity', method:'@method'},
            transformResponse: function(data,headers,status) {
              var response = {};
              response.data = JSON.parse(data);
              response.status = status;
              return response;
            }
          },
          'save' : {
            method:'POST' ,params: {entity : '@entity', method:'@method'},
            transformResponse: function(data,headers,status) {
              var response = {};
              response.data = JSON.parse(data);
              response.status = status;
              return response;
            }
          },
          'put': {
            method:'PUT' ,params: {entity : '@entity', method:'@method'},
            transformResponse: function(data,headers,status) {
              var response = {};
              if (data) {
                response.data = JSON.parse(data);
              } else {
                response.data = {};
              }
              response.status = status;
              return response;
            }
          },
          'delete': {
            method:'DELETE' ,params: {entity : '@entity', method:'@method'},
            transformResponse: function(data,headers,status) {
              var response = {};
              if (data) {
                response.data = JSON.parse(data);
              } else {
                response.data = {};
              }
              response.status = status;
              return response;
            }
          },
          'sendFile': {
            method:'POST' ,params: {entity : '@entity', method:'@method'}, isArray:false,
            transformRequest: angular.identity, headers: {'Content-Type':undefined}
          }
        }
      );
    }
  ]);

});
