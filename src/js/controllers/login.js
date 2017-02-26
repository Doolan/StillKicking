'use strict';

/**
 * @ngdoc function
 * @name StillKickingApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the StillKickingApp
 */
angular.module('StillKickingApp')
    .controller('LoginCtrl', ['$scope', 'AuthService', '$state', function ($scope, AuthService, $state) {

        var loginPageSetup = function () {

            $('#login')
                .form({
                    fields: {
                        username: {
                            identifier: 'username',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter your username'
                                }
                            ]
                        },
                        password: {
                            identifier: 'password',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter your password'
                                }
                            ]
                        }
                    },
                    inline: false,
                    onSuccess: function (event, fields) {
                        if (event) {
                            event.preventDefault();
                        }
                        AuthService.login(fields.username, fields.password, function(data, error){
                            if(!error && data){
                                $state.go('user.day');
                            }else{
                                //display error
                            }
                        });
                        return false;
                    },
                    onFailure: function (formErrors, fields) {
                        return;
                    }

                });
        };



        //on scope load
        $scope.$on('$viewContentLoaded', function () {
            loginPageSetup();
        });


        var stopButtons = function () {
            $('.ui.button').addClass('disabled');
        };

        var freeButtons = function () {
            $('.ui.button').removeClass('disabled');
        };


        $scope.authenticate = function () {
            $('#login').form('validate form');
            if(!$('#login').form('is valid'))
                return;
            stopButtons();
            var fields = $('#login').form('get values');
            AuthService.login(fields.username, fields.password, function (token, err) {
                if (err) {
                    $('.ui.error.message').html(
                        '<ui class="list"><li>Invalid Username or Password</li></ui>').show();
                    freeButtons();
                } else {
                    $state.go('user.day');
                }
            });
        }
    }]);
