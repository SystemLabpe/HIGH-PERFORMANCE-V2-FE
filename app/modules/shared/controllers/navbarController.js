define(['shared/shared','jquery'], function(shared,$){
  'use strict';

  shared.controller('shared.navbarController',['$scope','$location','$auth','ROLE',
    function ($scope,$location,$auth,ROLE){

      $scope.navUsername = '';
      $scope.navRole = '';
      $scope.routes = [];
      $scope.isAuthenticated = false;
      var storageRole = localStorage.getItem('currentRole');

      function authenticate(isAuthenticated) {
        if (isAuthenticated) {
          $scope.navUsername = localStorage.getItem('username');
          $scope.isAuthenticated = true;
        } else {
          $scope.isAuthenticated = false;
          $scope.myClub = null;
        }
      }

      authenticate($auth.isAuthenticated());

      function selectRole(role) {
        $scope.navRole = ROLE[role].NAME + ': ';
        $scope.routes = ROLE[role].ROUTES;
      }

      if (storageRole) {
        selectRole(storageRole);
        setMyClub();
      }

      function setMyClub () {
        if (JSON.parse(localStorage.getItem('myClub'))) {
          $scope.myClub = JSON.parse(localStorage.getItem('myClub'));
        }
      }

      $scope.$on('navbar:authenticate',function (event,isAuthenticated) {
        authenticate(isAuthenticated);
      });

      $scope.$on('navbar:selectRole',function (event,role) {
        selectRole(role);
      });

      $scope.$on('navbar:setMyClub',function (event) {
        setMyClub();
      });

      $scope.$on('navbar:unselectRole',function (event) {
        $scope.navRole = '';
        $scope.routes = [];
      });

      $scope.collapse = function() {
        $('.navbar-collapse.in').collapse('hide');
      };

      $scope.isActive = function(path) {
        var currentPath = $location.path().split('/');
        var navPath = path.split('/');
        return currentPath[1] === navPath[1] && currentPath[2] === navPath[2];
      };

    }
  ]);

});
