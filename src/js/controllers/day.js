'use strict';

/**
 * @ngdoc function
 * @name StillKickingApp.controller:LoginCtrl
 * @description
 * # StillKickingApp
 * Controller of the StillKickingApp
 */
angular.module('StillKickingApp')
    .controller('DayCtrl', ['$scope', 'AuthService', '$state', function ($scope) {

        $scope.openSettings = function () {
            console.log('hit');
            $('#addDrugModal').modal('show');
        };

        var dayPageSetup = function(){

        };

        //on scope load
        $scope.$on('$viewContentLoaded', function () {
            dayPageSetup();
        });

        $scope.currentTime ="1240";

        $scope.drugSchedule =[
            {
                name:'Breakfast',
                startTime:'0800',
                expireTime:'0900',
                drugs:[
                    {
                        name: 'Drug 1',
                        amt: 1,
                        taken:true,
                        optional: false
                    },
                    {
                        name: 'Drug 2',
                        amt: 2,
                        taken:true,
                        optional: false
                    },
                    {
                        name: 'Drug 3',
                        amt: 1,
                        taken:true,
                        optional: false
                    },
                    {
                        name: 'Drug 4',
                        amt: 1,
                        taken:false,
                        optional: false
                    }
                ]
            },
            {
                name:'',
                startTime:'1030',
                expireTime:'1130',
                drugs:[
                    {
                        name:'drug 4',
                        amt:1,
                        taken:true,
                        optional: false
                    }
                ]
            },
            {
                name:'Lunch',
                startTime:'1200',
                expireTime:'1300',
                drugs:[
                    {
                        name: 'Drug 1',
                        amt: 1,
                        taken:true,
                        optional: false
                    },
                    {
                        name: 'Drug 3',
                        amt: 1,
                        taken:false,
                        optional: false
                    }
                ]
            },
            {
                name:'Dinner',
                startTime:'1700',
                expireTime:'1800',
                drugs:[
                   {
                        name: 'Drug 3',
                        amt: 1,
                        taken:false,
                        optional: false
                    },
                    {
                        name: 'Drug 6',
                        amt: 1,
                        taken:false,
                        optional: false
                    }
                ]
            },
            {
                name:'',
                startTime:'2000',
                expireTime:'2330',
                drugs:[
                    {
                        name:'drug 4',
                        amt:1,
                        taken:false,
                        optional: false
                    }
                ]
            }
        ];

    }]);
