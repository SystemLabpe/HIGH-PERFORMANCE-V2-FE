define(['shared/shared'], function(shared) {
  'use strict';

  shared.filter('errorFilter', function() {
    return function(input) {
      if (!angular.isUndefined(input)) {
        console.log ('ERROR INPUT => ', input);
        var errorFilter = {
          401: 'Credenciales inválidas',
          101: 'Email ya existe'
        };
        return {
          TYPE: 'danger',
          TEXT: errorFilter[input]
        };
      } else {
        return input;
      }

    };
  });

});
