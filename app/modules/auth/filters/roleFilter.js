define(['auth/auth'], function(auth) {
  'use strict';

  auth.filter('roleFilter', function() {
    return function(input) {
      if (!angular.isUndefined(input)) {
        var roleFilter = {
          1: 'SUPERADMIN',
          2: 'DOCTOR',
          3: 'RECEPTIONIST',
          4: 'ADMIN'
        };
        return roleFilter[input];
      } else {
        return input;
      }

    };
  });

});
