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

        $scope.addCondition = function () {
            $('#addConditionModal').modal('show');
            $('#addConditionForm').form('reset');
            $('#addConditionForm .error.message').empty();
        };

        // var dayPageSetup = function () {
        //
        // };
        //
        // //on scope load
        // $scope.$on('$viewContentLoaded', function () {
        //     dayPageSetup();
        // });

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
                name: "Drug 3",
                instructions: "Fusce et dolor eget quam.",
                amt: "2",
                time: '0800'
            }
        ];

        var modalConfig = function() {
            $('#addConditionModal').modal({
                closable: false,//forces the user to close the modal through one of the buttons
                //On Deny & On Approve handle the closing of the modal.
                //if they return true, modal closes
                onDeny: function () {
                    //Reset the form on the cancel button
                    $('#addConditionForm').form('reset');
                    $('#addConditionForm .error.message').empty(); //clears Error messages
                    return true;
                },
                onApprove: function () {
                    //checks the validation of the form
                    var isValid = $('#addConditionForm').form('is valid');
                    $('#addConditionForm').form('validate form');//call the form's on success or on failure
                    return isValid;
                }
            });
        };


        var formConfig = function () {
            $('#addConditionForm')
                .form({
                    //Handles the validation on the form
                    fields: {
                        addCondition: {
                            identifier: 'addCondition',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please add a condition'
                                }
                            ]
                        }
                    },
                    onSuccess: function (event, fields) {
                        //what happens when the form is filed in
                        //console.log(fields);

                        $('#addConditionForm').form('reset');
                        $('#addConditionForm .error.message').empty();
                    },
                    onFailure: function (formErrors, fields) {
                        return null; // What happens when the form is not filed out
                    },
                    keyboardShortcuts: false //disables enter key trigger
                });
        };

        $scope.$on('$viewContentLoaded', function () {
            formConfig();
            modalConfig();
        });
    }]);
