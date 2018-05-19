define(['club/club','moment','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club,moment){
  'use strict';

  club.controller('club.timelineController',['$scope','$filter','$location','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory',function ($scope,$filter,$location,$auth,authFactory,modalFactory,errorFactory) {

      $scope.chanceList = [];

      $scope.chanceList = [
        {
          is_home:true,
          minute:5,
          scored_player:'a'
        },
        {
          is_home:true,
          minute:10,
          scored_player:'b'
        },
        {
          is_home:false,
          minute:15,
          scored_player:'c'
        },
        {
          is_home:false,
          minute:20,
          scored_player:'d'
        },
        {
          is_home:false,
          minute:25,
          scored_player:'e'
        },
        {
          is_home:true,
          minute:30,
          scored_player:'f'
        }
      ];

      // var lastChance = {is_home:false};
      // angular.forEach($scope.o_chanceList, function(chance, key) {
      //   // console.log('KEY ==> ', key);
      //   // console.log('CHANCE ==> ', chance);
      //   if (chance.is_home === lastChance.is_home) {
      //     // $scope.o_chanceList.splice(key, 0, {is_home: !chance.is_home, hide:true});
      //     $scope.chanceList.push({is_home: !chance.is_home, hide:true})
      //   }
      //   lastChance = chance;
      //   $scope.chanceList.push(chance);
      // });

      // console.log('CHANCELIST ==> ', $scope.o_chanceList);
      // console.log('CHANCELIST ==> ', $scope.chanceList);
      // $scope.showshow = true;
      // var rows = Math.ceil($scope.chanceList.length/2);
      // console.log('ROWS )=> ', rows);
      // $scope.wrapperHeight = rows * (400 + 90) + 180;
      // console.log('HEIGHT .. ', $scope.wrapperHeight );



  }]);
});
