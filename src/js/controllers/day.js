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

        /* -----  Scope Variables ------ */

        $scope.currentTime = "1240";

        $scope.drugSchedule = [
            {
                name: 'Breakfast',
                startTime: '0800',
                expireTime: '0900',
                drugs: [
                    {
                        name: 'Drug 1',
                        amt: 1,
                        taken: true,
                        optional: false
                    },
                    {
                        name: 'Drug 2',
                        amt: 2,
                        taken: true,
                        optional: false
                    },
                    {
                        name: 'Drug 3',
                        amt: 1,
                        taken: true,
                        optional: false
                    },
                    {
                        name: 'Drug 4',
                        amt: 1,
                        taken: false,
                        optional: false
                    }
                ]
            },
            {
                name: '',
                startTime: '1030',
                expireTime: '1130',
                drugs: [
                    {
                        name: 'drug 4',
                        amt: 1,
                        taken: true,
                        optional: false
                    }
                ]
            },
            {
                name: 'Lunch',
                startTime: '1200',
                expireTime: '1300',
                drugs: [
                    {
                        name: 'Drug 1',
                        amt: 1,
                        taken: true,
                        optional: false
                    },
                    {
                        name: 'Drug 3',
                        amt: 1,
                        taken: false,
                        optional: false
                    }
                ]
            },
            {
                name: 'Dinner',
                startTime: '1700',
                expireTime: '1800',
                drugs: [
                    {
                        name: 'Drug 3',
                        amt: 1,
                        taken: false,
                        optional: false
                    },
                    {
                        name: 'Drug 6',
                        amt: 1,
                        taken: false,
                        optional: false
                    }
                ]
            },
            {
                name: '',
                startTime: '2000',
                expireTime: '2330',
                drugs: [
                    {
                        name: 'drug 4',
                        amt: 1,
                        taken: false,
                        optional: false
                    }
                ]
            }
        ];


        /* -----  Scope Functions ------ */

        $scope.addDrugOpen = function () {
            console.log('hit');
            $('#addDrugModal').modal('show');
            $('#addDrugForm').form('reset');
            $('#addDrugForm .error.message').empty();
        };

        $scope.scheduleDrugOpen = function () {
            console.log('schedule drug');
            $('#scheduleDrugModal').modal('show');
            $('#scheduleDrugForm').form('reset');
            $('#scheduleDrugForm .error.message').empty();
        };

        $scope.drugList = [
            {
                name:'OxyContin'
            },
            {
                name:'Percocet'
            },
            {
                name:'Hydrocodone'
            },
            {
                name:'Vicodin'
            }
        ];

        /* -----  Set Up & Config Function ------ */

        var modalConfigs = function () {
            $('#addDrugModal').modal({
                closable: false,//forces the user to close the modal through one of the buttons
                //On Deny & On Approve handle the closing of the modal.
                //if they return true, modal closes
                onDeny: function () {
                    //Reset the form on the cancel button
                    $('#addDrugForm').form('reset');
                    $('#addDrugForm .error.message').empty(); //clears Error messages
                    return true;
                },
                onApprove: function () {
                    //checks the validation of the form
                    var isValid = $('#addDrugForm').form('is valid');
                    $('#addDrugForm').form('validate form');//call the form's on success or on failure
                    return isValid;
                }
            });
            $('#scheduleDrugModal').modal({
                closable: false,//forces the user to close the modal through one of the buttons
                //On Deny & On Approve handle the closing of the modal.
                //if they return true, modal closes
                onDeny: function () {
                    //Reset the form on the cancel button
                    $('#scheduleDrugForm').form('reset');
                    $('#scheduleDrugForm .error.message').empty(); //clears Error messages
                    return true;
                },
                onApprove: function () {
                    //checks the validation of the form
                    var isValid = $('#scheduleDrugForm').form('is valid');
                    $('#scheduleDrugForm').form('validate form');//call the form's on success or on failure
                    return isValid;
                }
            });
        };


        var formConfig = function () {
            $('#addDrugForm')
                .form({
                    //Handles the validation on the form
                    fields: {
                        ndc: {
                            identifier: 'ndc',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter an NDC number'
                                }
                            ]
                        },
                        rxcui: {
                            identifier: 'rxcui',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter an RXCUI number'
                                }
                            ]
                        },
                        name: {
                            identifier: 'name',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter your name'
                                }
                            ]
                        },
                        dosage: {
                            identifier: 'dosage',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter a dosage'
                                }
                            ]
                        },
                        amount: {
                            identifier: 'amount',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter an amount'
                                }
                            ]
                        },
                        interval: {
                            identifier: 'interval',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter an interval'
                                }
                            ]
                        },
                        time: {
                            identifier: 'time',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter a time'
                                }
                            ]
                        }
                    },
                    onSuccess: function (event, fields) {
                        //what happens when the form is filed in
                        console.log(fields);
                        $('#addDrugForm').form('reset');
                        $('#addDrugForm .error.message').empty();
                    },
                    onFailure: function (formErrors, fields) {
                        return null; // What happens when the form is not filed out
                    },
                    keyboardShortcuts: false //disables enter key trigger
                });
        }
        var formConfig = function () {
            $('#scheduleDrugForm')
                .form({
                    //Handles the validation on the form
                    fields: {
                        chooseDrug: {
                            identifier: 'chooseDrug',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please choose a drug'
                                }
                            ]
                        },
                        chooseRecurrence: {
                            identifier: 'chooseRecurrence',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please choose a recurrence'
                                }
                            ]
                        },
                        amount: {
                            identifier: 'amount',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter an amount'
                                }
                            ]
                        },
                        time: {
                            identifier: 'time',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter a time'
                                }
                            ]
                        },

                    },
                    onSuccess: function (event, fields) {
                        //what happens when the form is filed in
                        console.log(fields);
                        $('#scheduleDrugForm').form('reset');
                        $('#scheduleDrugForm .error.message').empty();
                    },
                    onFailure: function (formErrors, fields) {
                        return null; // What happens when the form is not filed out
                    },
                    keyboardShortcuts: false //disables enter key trigger
                });
        };

        var dayPageSetup = function () {
            modalConfigs();
            formConfig();
        };

        //on scope load
        $scope.$on('$viewContentLoaded', function () {
            dayPageSetup();
            $('.dropdown').dropdown();
        });
    }]);
