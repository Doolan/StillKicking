'use strict';

/**
 * @ngdoc function
 * @name StillKickingApp.controller:LoginCtrl
 * @description
 * # StillKickingApp
 * Controller of the StillKickingApp
 */
angular.module('StillKickingApp')
    .controller('DayCtrl', ['$scope', 'AuthService', 'DrugService', function ($scope, AuthService, DrugService) {

        /* -----  Scope Variables ------ */

        $scope.currentTime = "1240";

        $scope.drugSchedule = [];


        $scope.drugList = [];

        $scope.drugWeekList = {};


        /* -----  Scope Functions ------ */

        $scope.addDrugOpen = function () {
            $('#addDrugModal').modal('show');
            $('#addDrugForm').form('reset');
            $('#addDrugForm .error.message').empty();
        };

        $scope.scheduleDrugOpen = function () {
            $('#scheduleDrugModal').modal('show');
            $('#scheduleDrugForm').form('reset');
            $('#scheduleDrugForm .error.message').empty();

            $scope.drugWeekList = {
                sunday:false,
                monday: false,
                tuesday:false,
                wednesday:false,
                thursday:false,
                friday:false,
                saturday:false
            }
        };

        $scope.lookupDrug = function(){
            var ndc = $('#addDrugForm').form('get value', ndc);
            if(ndc) {
                console.log(ndc);
                DrugService.searchForDrug(ndc, function (data, err) {
                    console.log(data, "first step");
                }, function (data, err) {
                    console.log(data);
                });
            }
        };

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
                        //console.log(fields);
                        DrugService.addDrug(fields, $scope.drugWeekList, function(data, err){
                            if(err){
                                //something broke
                            }

                        });
                        $('#addDrugForm').form('reset');
                        $('#addDrugForm .error.message').empty();
                    },
                    onFailure: function (formErrors, fields) {
                        return null; // What happens when the form is not filed out
                    },
                    keyboardShortcuts: false //disables enter key trigger
                });

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
                        }
                    },
                    onSuccess: function (event, fields) {
                        //what happens when the form is filed in
                        //console.log(fields);
                        DrugService.scheduleDrug(fields, function(data, err){
                            if(err){
                                //something broke
                            }
                        });
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

        var loadDrugList = function(reload){
            DrugService.getDrugList(reload, function(list){
                $scope.drugList = list;
            });
        };

        var loadDrugSchedule = function(reload){
            DrugService.getDrugSchedule(reload, function(list){
                $scope.drugSchedule = list;
            });
        };

        //on scope load
        $scope.$on('$viewContentLoaded', function () {
            loadDrugList(false);
            loadDrugSchedule(true);
            dayPageSetup();
            $('.dropdown').dropdown();
        });
    }]);
