define(['admin/admin','../../auth/factories/authFactory'], function(admin){
  'use strict';

  admin.controller('admin.homeController',['$scope','$location','$auth','auth.authFactory',
    function ($scope,$location,$auth,authFactory) {

      $scope.clubList = [];

      $scope.getClubList = function() {
        authFactory.get({entity:'clubs',method:'customers'}).then(function(result) {
          $scope.clubList = result.data;
        }, function (error) {

        });
        // $scope.clubList = [
        //   {
        //     id: 1,
        //     full_name: 'Sport Loreto'
        //   },
        //   {
        //     id: 2,
        //     full_name: 'Universitario de Deportes'
        //   }
        // ];
      };

      $scope.getClubList();

      $scope.addClub = function() {
        $location.path('/admin/club');
      };

      $scope.goClub = function(club) {
        sessionStorage.setItem('club',JSON.stringify(club));
        $location.path('/admin/club');
      };

      sessionStorage.removeItem('club');
  }]);

});
