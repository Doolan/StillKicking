'use strict';
angular.module('StillKickingApp')
    .controller('RegisterCtrl', ['$scope', 'AuthService', '$state', function ($scope, AuthService, $state) {

        $scope.registerForm = function(){
            $('#registerForm').form('validate form');
        };

        var formConfig = function () {
                $('#registerForm')
                    .form({
                        fields: {
                            name: {
                                identifier: 'name',
                                rules: [
                                    {
                                        type: 'empty',
                                        prompt: 'Please enter your name'
                                    }
                                ]
                            },
                            email: {
                                identifier: 'email',
                                rules: [
                                    {
                                        type: 'email',
                                        prompt: 'Please enter a valid email'
                                    }
                                ]
                            },
                            password: {
                                identifier: 'password',
                                rules: [
                                    {
                                        type: 'empty',
                                        prompt: 'Please enter a password at least 6 characters in length'
                                    }
                                ]
                            },
                            patientDateOfBirth: {
                                identifier: 'patientDateOfBirth',
                                rules: [
                                    {
                                        type: 'empty',
                                        prompt: 'Please select a date of birth'
                                    }
                                ]
                            },
                            patientSex: {
                                identifier: 'patientSex',
                                rules: [
                                    {
                                        type: 'empty',
                                        prompt: 'Please select a sex'
                                    }
                                ]
                            }
                        },
                        onSuccess: function (event, fields) {
                            //$('#registerForm').form('reset');
                            //$('#registerForm .error.message').empty();
                            if (event) {
                                event.preventDefault();
                            }
                            var pkt = {
                                Email: fields.email,
                                Name:fields.name,
                                Password:fields.password,
                                DOB:fields.patientDateOfBirth,
                                sex: fields.patientSex
                            };
                            AuthService.register(pkt, function(data, error){
                                if(!error && data){
                                    $state.go('user.day');
                                }else{
                                    //display error
                                }
                            });
                            return false;

                        },
                        onFailure: function (formErrors, fields) {
                            return null; // What happens when the form is not filed out
                        },
                        keyboardShortcuts: false //disables enter key trigger
                        });
            };

        var registerPageSetup = function () {
            formConfig();
        };


        //on scope load
        $scope.$on('$viewContentLoaded', function () {
            registerPageSetup();
            $('.dropdown').dropdown();
            $('#example2').calendar();
        });


    }]);