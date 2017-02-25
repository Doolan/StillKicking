'use strict';

/**
 * @ngdoc function
 * @name StillKickingApp.controller:LoginCtrl
 * @description
 * # EmergencyCard
 * Controller of the StillKickingApp
 */
angular.module('StillKickingApp')
    .controller('eCardCtrl', ['$scope', 'AuthService', '$state', function ($scope) {

        $scope.selectDrug = function(drug){
            $scope.activeDrug = drug;
            $('#drugModal').modal('show');
        };

        var dayPageSetup = function () {

        };

        //on scope load
        $scope.$on('$viewContentLoaded', function () {
            dayPageSetup();
        });

        $scope.activeDrug ={};

        $scope.userinfo = {
            name: 'Jedediah Doe',
            dob: '05/25/37',
            age: 80,
            medicalConditions: [
                "Pacemaker",
                "Alzheimer's",
                "Hypertension",
                "Hearing Impairment",
                "Lupus",
                "Misc. Old People Diseases"
            ]
        };

        $scope.drugHistory = [
            {
                name: "Drug 1",
                instructions: "Fusce et dolor eget quam.",
                amt: "2",
                time: '1000'
            },
            {
                name: "Drug 2",
                instructions: "Morbi at velit non lacus.",
                amt: "1",
                time: '0930'
            },
            {
                name: "Drug 1",
                instructions: "Fusce et dolor eget quam.",
                amt: "2",
                time: '0800'
            }
        ];

    }]);
