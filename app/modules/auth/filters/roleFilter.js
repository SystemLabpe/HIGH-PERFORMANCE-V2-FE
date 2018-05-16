define(['auth/auth'], function(auth) {
  'use strict';

  auth.filter('roleFilter', function() {
    return function(input) {
      if (!angular.isUndefined(input)) {
        var roleFilter = {
          2: 'ADMIN',
          1: 'CLUB'
        };
        return roleFilter[input];
      } else {
        return input;
      }

    };
  });

});
