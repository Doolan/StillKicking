'use strict';

/**
 * @ngdoc function
 * @name StillKickingApp.controller:LoginCtrl
 * @description
 * # StillKickingApp
 * Controller of the StillKickingApp
 */
angular.module('StillKickingApp')
    .controller('ResourcesCtrl', ['$scope', 'AuthService', 'DrugService', function ($scope, AuthService, DrugService) {

        /* -----  Scope Variables ------ */

        $scope.roles = [
            {
                roles: 'physician',
                id:'1'
            },
            {
                roles: 'primary',
                id:'2'
            },
            {
                roles: 'secondary',
                id:'2'
            },
            {
                roles: 'family',
                id:'3'
            },
            {
                roles: 'friend',
                id:'4'
            }
        ];

        $scope.contacts = [
            {
                id:'12',
                name: 'John Doe',
                phone:'+18002004000',
                type:'physician',
                typeId: '1',
                notes:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et.'
            }
        ];



        /* -----  Scope Functions ------ */


        /* -----  Set Up & Config Function ------ */

        var modalConfigs = function () {
            //$('#addDrugModal').modal({
            //    closable: false,//forces the user to close the modal through one of the buttons
            //    //On Deny & On Approve handle the closing of the modal.
            //    //if they return true, modal closes
            //    onDeny: function () {
            //        //Reset the form on the cancel button
            //        $('#addDrugForm').form('reset');
            //        $('#addDrugForm .error.message').empty(); //clears Error messages
            //        return true;
            //    },
            //    onApprove: function () {
            //        //checks the validation of the form
            //        var isValid = $('#addDrugForm').form('is valid');
            //        $('#addDrugForm').form('validate form');//call the form's on success or on failure
            //        return isValid;
            //    }
            //});
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
                        DrugService.addDrug(fields, $scope.drugWeekList, function (data, err) {
                            if (err) {
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
        };

        var resourcePageSetup = function () {
            modalConfigs();
            formConfig();
        };

        var loadContactList = function(reload){
            //DrugService.getDrugList(reload, function(list){
            //    $scope.drugList = list;
            //});
        };

        //on scope load
        $scope.$on('$viewContentLoaded', function () {
            loadContactList(true);
            resourcePageSetup();
            $('.dropdown').dropdown();
        });
    }]);
