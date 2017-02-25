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
                title: 'physician',
                id:'0'
            },
            {
                title: 'primary',
                id:'1'
            },
            {
                title: 'secondary',
                id:'2'
            },
            {
                title: 'family',
                id:'3'
            },
            {
                title: 'friend',
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

        $scope.addResourceOpen = function () {
            $('#addResourceModal').modal('show');
            $('#addResourceForm').form('reset');
            $('#addResourceForm .error.message').empty();
        };



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
            $('#addResourceForm')
                .form({
                    //Handles the validation on the form
                    fields: {
                        ndc: {
                            identifier: 'name',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter a name'
                                }
                            ]
                        },
                        rxcui: {
                            identifier: 'role',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please select a role'
                                }
                            ]
                        },
                        name: {
                            identifier: 'phone number',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter a phone number'
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
