angular.module('StillKickingApp')
    .controller('RegisterCtrl', ['$scope', function ($scope) {

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
                                        prompt: 'Please enter a password'
                                    },
                                    {
                                        type: 'minLength[6]',
                                        prompt: 'Your password must be at least 6 characters'
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
                            //what happens when the form is filed in
                            //console.log(fields);
                            $('#registerForm').form('reset');
                            $('#registerForm .error.message').empty();
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
        });
    }]);