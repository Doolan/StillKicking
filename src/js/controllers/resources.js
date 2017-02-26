'use strict';

/**
 * @ngdoc function
 * @name StillKickingApp.controller:LoginCtrl
 * @description
 * # StillKickingApp
 * Controller of the StillKickingApp
 */
angular.module('StillKickingApp')
    .controller('ResourcesCtrl', ['$scope', 'APIService', 'ResourceService', function ($scope, APIService, ResourceService) {

        /* -----  Scope Variables ------ */
        $scope.currentContactId = "";

        $scope.roles = [];

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

        $scope.severity = {
            mcc:false,
            cc:false,
            message:''
        };

        var findMCC = function(data) {
            if(!data || !data.SearchTermResponse || !data.SearchTermResponse.items){
                $scope.severity.message ='Nothing Found.';
                return;
            }

            var objects = data.SearchTermResponse.items;
            var MCC = 0;
            var CC = 0;

            for(var i=0; i<objects.length; i++){
                MCC += parseInt(objects[i].MCC_FLAG);
                CC += parseInt(objects[i].CC_FLAG);
            }
            if (MCC > 0){
                $scope.severity.mcc = true;
                $scope.severity.message ='You should go to the hospital!';
            }else if (CC > 0){
                $scope.severity.cc = true;
                $scope.severity.message ='You might want to go to the hospital.';
            }else{
                $scope.severity.message ='Not too bad. You should not need to go to the hospital.';
            }
        };

        $scope.addResourceOpen = function () {
            $scope.currentContactId = 0;
            $('#contactModal').modal('show');
            $('#contactForm').form('reset');
            $('#contactForm .error.message').empty();
        };

        $scope.editResourceOpen = function (contact) {
            $('#contactForm').form('set values', {
                name:contact.Name,
                role:contact.ContactType_IDFK,
                phone:contact.Phone,
                notes:contact.Notes
            });
            $('#contactForm .dropdown').dropdown('set text', contact.TypeName);
            $('#contactForm .dropdown').dropdown('set value', contact.ContactType_IDFK);

            $scope.currentContactId = contact.Id;
            $('#contactModal').modal('show');
            $('#contactForm .error.message').empty();
        };

        $scope.getSeverity = function(){
            var word = $("input").val();
            $scope.severity = {
                mcc:false,
                cc:false,
                message:''
            };
            APIService.IMO_CheckSeverity(word, function(data){
                findMCC(data);
            });
        };


        /* -----  Scope Functions ------ */


        /* -----  Set Up & Config Function ------ */

        var modalConfigs = function () {
            $('#contactModal').modal({
                closable: false,//forces the user to close the modal through one of the buttons
                //On Deny & On Approve handle the closing of the modal.
                //if they return true, modal closes
                onDeny: function () {
                    //Reset the form on the cancel button
                    $('#contactForm').form('reset');
                    $('#contactForm .error.message').empty(); //clears Error messages
                    return true;
                },
                onApprove: function () {
                    //checks the validation of the form
                    var isValid = $('#contactForm').form('is valid');
                    $('#contactForm').form('validate form');//call the form's on success or on failure
                    return isValid;
                }
            });
        };


        var formConfig = function () {
            $('#contactForm')
                .form({
                    //Handles the validation on the form
                    fields: {
                        name: {
                            identifier: 'name',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter a name'
                                }
                            ]
                        },
                        role: {
                            identifier: 'role',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please select a role'
                                }
                            ]
                        },
                        phone: {
                            identifier: 'phone',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter a phone number'
                                }
                            ]
                        }
                    },
                    onSuccess: function (event, fields) {
                        var pkg = {
                            Name:fields.name,
                            Notes:fields.notes,
                            phone:fields.phone,
                            ContactType:fields.role
                        };
                        if($scope.currentContactId){
                            pkg.Id = $scope.currentContactId;
                            //update command
                            ResourceService.putContacts(pkg, function(data){
                                $scope.contacts = data;
                            });
                        }else{
                            //create new contact
                            ResourceService.postContacts(pkg, function(data){
                                if(data)
                                    $scope.contacts = data;
                            });
                        }

                        $('#contactForm').form('reset');
                        $('#contactForm .error.message').empty();
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

        var loadContactList = function(){
            ResourceService.getContacts(function(data){
                if(data)
                    $scope.contacts = data;
            });
        };

        var loadContactTypes = function(){
            ResourceService.getContactTypes(function(data){
                if(data)
                    $scope.roles = data;
            });
        };

        //on scope load
        $scope.$on('$viewContentLoaded', function () {
            loadContactList();
            resourcePageSetup();
            loadContactTypes();
            $('.dropdown').dropdown();
        });
    }]);
