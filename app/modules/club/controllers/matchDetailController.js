define(['club/club','moment','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club, moment){
  'use strict';

  club.controller('club.matchDetailController',['$scope','$filter','$location','$sce','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory','shared.imageFactory','FileUploader',
    function ($scope,$filter,$location,$sce,$auth,authFactory,modalFactory,errorFactory,imageFactory,FileUploader) {

      $scope.match = {};
      $scope.showVideo = false;

      $scope.subOption = 3;
      $scope.videoSource = null;

      if(sessionStorage.getItem('match')) {
        $scope.match = JSON.parse(sessionStorage.getItem('match'));
        if ($scope.match.url_detail) {
          console.log('aaaaaa ===> ', getParameterByName('v', $scope.match.url_detail));
          $scope.videoSource = $sce.trustAsResourceUrl('//www.youtube.com/embed/' +  getParameterByName('v',$scope.match.url_detail));
        }
        getChanceList();
      }

      $scope.goEditMatch = function() {
        sessionStorage.setItem('match',JSON.stringify($scope.match));
        $location.path('/club/match-add-edit');
      };

      function getChanceList() {
        $scope.chanceListLoading = true;
        $scope.chanceList = [];
        authFactory.get({entity:'chances',method:'me',param1:'match',param2:$scope.match.id}).then(function(result) {
          $scope.chanceList = result.data;
          $scope.chanceListLoading = false;
        }, function (error) {
          $scope.chanceList = [];
          $scope.chanceListLoading = false;
        });
      }

      $scope.showInfo = function(info) {
        modalFactory.showInfoListModalFactory(info);
      };

      $scope.showVideoContainer = function() {
        $scope.showVideo =! $scope.showVideo;
      };

      function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }

      $scope.goBack = function() {
        $scope.subOption = 3;
        $scope.chance = {};
      };

      $scope.goDetailChance = function(chance) {
        $scope.subOption = 4;
        $scope.chance = chance;
        $scope.chance.chance_type = $scope.chance.chance_type.toString();
      };


  }]);

});
