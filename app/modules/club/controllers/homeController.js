define(['club/club','chart','jquery','../../auth/factories/authFactory','../../shared/factories/modalFactory','../../shared/factories/errorFactory'], function(club,Chart,$){
  'use strict';

  club.controller('club.homeController',['$scope','$filter','$location','$timeout','$auth','auth.authFactory',
    'shared.modalFactory','shared.errorFactory', function ($scope,$filter,$location,$timeout,$auth,authFactory,modalFactory,errorFactory) {

      $scope.lastMatchesList = [];
      $scope.lastMatchGeneralReport = [];
      $scope.lastMatchReport = [];

      $scope.lastMatchesListLoading = false;

      $scope.getLastMatchesList = function() {
        $scope.lastMatchesListLoading = true;
        $scope.lastMatchesList = [];

        authFactory.get({entity:'matches',method:'me'}).then(function(result) {
          $scope.lastMatchesList = result.data.slice(0,5);
          $scope.lastMatchesListLoading = false;
        }, function (error) {
          $scope.lastMatchesList = [];
          $scope.matchListLoading = false;
        });

      };

      $scope.getLastMatchesList();

      $scope.getRivalList = function() {
        $scope.rivalListLoading = true;
        $scope.rivalList = [];
        authFactory.get({entity:'clubs',method:'rivals'}).then(function(result) {
          $scope.rivalList = result.data;
          $scope.rivalListLoading = false;
        }, function (error) {
          $scope.rivalList = [];
          $scope.rivalListLoading = false;
        });
      };

      $scope.getRivalList();

      $scope.goMatchDetail = function(match) {
        sessionStorage.setItem('match',JSON.stringify(match));
        $location.path('/club/match-detail');
      };

      $scope.getLastGameGeneralReport = function() {

        // Chart.defaults.global.defaultFontColor = 'red';

        $scope.lastGameGeneralReportLoading = true;
        $scope.lastMatchGeneralReport = [];
        authFactory.get({entity:'report',method:'lastmatch',id:'general'}).then(function(result) {
          $scope.lastMatchGeneralReport = result.data.reports;
          $scope.lastGameGeneralReportLoading = false;

          angular.forEach($scope.lastMatchGeneralReport, function(report, index) {
            report.id = 'g_' + index;
            $('#' + report.id).replaceWith('<canvas id=#' + report.id + '></canvas>');
          });

          $timeout(function() {

            angular.forEach($scope.lastMatchGeneralReport, function(report, index) {
              var id = '#' + report.id;
              // console.log(' ID ==> ', id);
              // console.log(' TAG ==> ', document.getElementById(chart.id));
              // console.log(' TAG ==> ', $(id));
              new Chart($(id), report.chart);
            });
          },40);


        }, function (error) {
          $scope.lastMatchGeneralReport = [];
          $scope.lastGameGeneralReportLoading = false;
        });





        // $scope.generalReport =
        //   {
        //     name:'Tipo de Inicio',
        //     charts: [
        //       {
        //         name: 'Tipo de Inicio 1',
        //         value: {
        //           type:"radar",
        //           data:{
        //             labels:["Eating","Drinking","Sleeping","Designing","Coding","Cycling","Running","aaaaaaaaa","bbbbbbbbbbbb","cccccccccccc","ddddddddddd","eeeeeeeeeee"],
        //             datasets:[
        //               {
        //                 label:"Local",
        //                 data:[65,59,90,81,56,55,40,45,32,18,98,63],
        //                 fill:true,
        //                 backgroundColor:"rgba(254, 199, 34, 0.2)",
        //                 borderColor:"rgb(254, 199, 34)",
        //                 pointBackgroundColor:"rgb(254, 199, 34)",
        //                 pointBorderColor:"#fff",
        //                 pointHoverBackgroundColor: "#fff",
        //                 pointHoverBorderColor: "rgb(254, 199, 34)"
        //               },
        //               {
        //                 label:"Visitante",
        //                 data:[28,48,40,19,96,27,100,21,14,56,32,78],
        //                 fill:true,
        //                 backgroundColor:"rgba(36, 37, 47, 0.2)",
        //                 borderColor:"rgb(36, 37, 47)",
        //                 pointBackgroundColor:"rgb(36, 37, 47)",
        //                 pointBorderColor:"#fff",
        //                 pointHoverBackgroundColor:"#fff",
        //                 pointHoverBorderColor:"rgb(36, 37, 47)"
        //               }
        //             ]
        //           },
        //           options: {
        //             responsive: true,
        //             maintainAspectRatio: false
        //           }
        //         }
        //       },
        //       {
        //         name: 'Tipo de Inicio 2',
        //         value: {
        //           type:"radar",
        //           data:{
        //             labels:["zzzzzzzzz","xxxxxxxxxxxxxx","ccccccccccc","Designing","Coding","Cycling","Running","aaaaaaaaa","bbbbbbbbbbbb","cccccccccccc","ddddddddddd","eeeeeeeeeee"],
        //             datasets:[
        //               {
        //                 label:"Local",
        //                 data:[11,22,33,81,56,55,40,45,32,18,98,63],
        //                 fill:true,
        //                 backgroundColor:"rgba(254, 199, 34, 0.2)",
        //                 borderColor:"rgb(254, 199, 34)",
        //                 pointBackgroundColor:"rgb(254, 199, 34)",
        //                 pointBorderColor:"#fff",
        //                 pointHoverBackgroundColor: "#fff",
        //                 pointHoverBorderColor: "rgb(254, 199, 34)"
        //               },
        //               {
        //                 label:"Visitante",
        //                 data:[44,55,66,19,96,27,100,21,14,56,32,78],
        //                 fill:true,
        //                 backgroundColor:"rgba(36, 37, 47, 0.2)",
        //                 borderColor:"rgb(36, 37, 47)",
        //                 pointBackgroundColor:"rgb(36, 37, 47)",
        //                 pointBorderColor:"#fff",
        //                 pointHoverBackgroundColor:"#fff",
        //                 pointHoverBorderColor:"rgb(36, 37, 47)"
        //               }
        //             ]
        //           },
        //           options: {
        //             responsive: true,
        //             maintainAspectRatio: false
        //           }
        //         }
        //       },
        //       {
        //         name: 'Tipo de Inicio 3',
        //         value: {
        //           type:"radar",
        //           data:{
        //             labels:["dddddddddd","eeeeeeeeeeeee","fffffff","Designing","Coding","Cycling","Running","aaaaaaaaa","bbbbbbbbbbbb","cccccccccccc","ddddddddddd","eeeeeeeeeee"],
        //             datasets:[
        //               {
        //                 label:"Local",
        //                 data:[77,88,99,81,56,55,40,45,32,18,98,63],
        //                 fill:true,
        //                 backgroundColor:"rgba(254, 199, 34, 0.2)",
        //                 borderColor:"rgb(254, 199, 34)",
        //                 pointBackgroundColor:"rgb(254, 199, 34)",
        //                 pointBorderColor:"#fff",
        //                 pointHoverBackgroundColor: "#fff",
        //                 pointHoverBorderColor: "rgb(254, 199, 34)"
        //               },
        //               {
        //                 label:"Visitante",
        //                 data:[10,11,12,19,96,27,100,21,14,56,32,78],
        //                 fill:true,
        //                 backgroundColor:"rgba(36, 37, 47, 0.2)",
        //                 borderColor:"rgb(36, 37, 47)",
        //                 pointBackgroundColor:"rgb(36, 37, 47)",
        //                 pointBorderColor:"#fff",
        //                 pointHoverBackgroundColor:"#fff",
        //                 pointHoverBorderColor:"rgb(36, 37, 47)"
        //               }
        //             ]
        //           },
        //           options: {
        //             responsive: true,
        //             maintainAspectRatio: false
        //           }
        //         }
        //       }
        //     ]
        //   }
        // ;

        // angular.forEach($scope.generalReport.charts, function(chart, index) {
        //   chart.id = 'g_' + index;
        //   $('#' + chart.id).replaceWith('<canvas id=#' + chart.id + '></canvas>');
        //   // new Chart($('#' + chart.id), chart.value);
        // });


        // $timeout(function() {

        //   angular.forEach($scope.generalReport.charts, function(chart, index) {
        //     var id = '#' + chart.id;
        //     // console.log(' ID ==> ', id);
        //     // console.log(' TAG ==> ', document.getElementById(chart.id));
        //     // console.log(' TAG ==> ', $(id));
        //     new Chart($(id), chart.value);
        //   });
        // },20);


        // $('#report').replaceWith('<canvas id="report"></canvas>');

        // new Chart($('#report'),
        // {
        //   type:"radar",
        //   data:{
        //     labels:["Eating","Drinking","Sleeping","Designing","Coding","Cycling","Running","aaaaaaaaa","bbbbbbbbbbbb","cccccccccccc","ddddddddddd","eeeeeeeeeee"],
        //     datasets:[
        //       {
        //         label:"Local",
        //         data:[65,59,90,81,56,55,40,45,32,18,98,63],
        //         fill:true,
        //         backgroundColor:"rgba(254, 199, 34, 0.2)",
        //         borderColor:"rgb(254, 199, 34)",
        //         pointBackgroundColor:"rgb(254, 199, 34)",
        //         pointBorderColor:"#fff",
        //         pointHoverBackgroundColor: "#fff",
        //         pointHoverBorderColor: "rgb(254, 199, 34)"
        //       },
        //       {
        //         label:"Visitante",
        //         data:[28,48,40,19,96,27,100,21,14,56,32,78],
        //         fill:true,
        //         backgroundColor:"rgba(36, 37, 47, 0.2)",
        //         borderColor:"rgb(36, 37, 47)",
        //         pointBackgroundColor:"rgb(36, 37, 47)",
        //         pointBorderColor:"#fff",
        //         pointHoverBackgroundColor:"#fff",
        //         pointHoverBorderColor:"rgb(36, 37, 47)"
        //       }
        //     ]
        //   }
        // });

      };

      $scope.getLastGameGeneralReport();

      $scope.getTestReport = function() {
        $('#test-report').replaceWith('<canvas id=test-report></canvas>');
        var barChartData = {
          labels: ['Jugadas', 'Pelota Parada'],
          datasets: [{
            label: 'Goles del local',
            backgroundColor: 'rgb(254, 199, 34)',
            stack: 'local', //id para agrupar en una misma columna
            data: [
              10, //goles de jugadas de local
              20  //goles de pelota parada de local
            ]
          }, {
            label: 'No Goles del local',
            backgroundColor: 'rgba(254, 199, 34, 0.2)',
            stack: 'local',
            data: [
              11, //no goles de jugadas de local
              21 //no goles de pelota parada de local
            ]
          }, {
            label: 'Goles del visitante',
            backgroundColor: 'rgb(36, 37, 47)',
            stack: 'away',
            data: [
              15, //goles de jugadas de visitante
              25  //goles de pelota parada de visitante
            ]
          }, {
            label: 'No Goles del visitante',
            backgroundColor: 'rgba(36, 37, 47, 0.2)',
            stack: 'away',
            data: [
              11, //no goles de jugadas de visitante
              21 //no goles de pelota parada de visitante
            ]
          }]

        };

        new Chart($('#test-report'), {
          type: 'bar',
          data: barChartData,
          options: {
            title: {
              display: true,
              text: 'TEST'
            },
            tooltips: {
              mode: 'index',
              intersect: false
            },
            responsive: true,
            scales: {
              xAxes: [{
                stacked: true,
              }],
              yAxes: [{
                stacked: true
              }]
            }
          }
        });

        // new Chart($(id), report.chart);

      };

      $scope.getTestReport();

    }

  ]);

});
