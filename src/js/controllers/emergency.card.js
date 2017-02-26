'use strict';

/**
 * @ngdoc function
 * @name StillKickingApp.controller:LoginCtrl
 * @description
 * # EmergencyCard
 * Controller of the StillKickingApp
 */
angular.module('StillKickingApp')
    .controller('eCardCtrl', ['$scope', 'DrugService', 'ConditionService','UserService', '$state', function ($scope, DrugService, ConditionService, UserService, $state) {

        $scope.selectDrug = function (drug) {
            $scope.activeDrug = drug;
            $('#drugModal').modal('show');
        };

        $scope.addCondition = function () {
            $('#addConditionModal').modal('show');
            $('#addConditionForm').form('reset');
            $('#addConditionForm .error.message').empty();
        };

        $scope.activeDrug = {};

        $scope.userinfo = {
            name: 'Jedediah Doe',
            dob: '05/25/37',
            age: 80,
            medicalConditions: []
        };

        $scope.drugHistory = [];

        var modalConfig = function () {
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
            $.fn.form.settings.rules.conditionAlreadyExists = function (value, arg1) {
                return !$scope.userinfo.medicalConditions.includes(value.toLowerCase());
            };
            $('#addConditionForm')
                .form({
                    //Handles the validation on the form
                    fields: {
                        name: {
                            identifier: 'name',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter a condition'
                                },
                                {
                                    type: 'conditionAlreadyExists[0]',
                                    prompt: '{value} is already an condition'
                                }
                            ]
                        }
                    },
                    onSuccess: function (event, fields) {
                        //what happens when the form is filed in
                        ConditionService.addCondition(fields.name, function(data, condition,  err){
                           if(data)
                               $scope.userinfo.medicalConditions.push(condition.toLowerCase());
                        });
                    },
                    onFailure: function (formErrors, fields) {
                        return null; // What happens when the form is not filed out
                    },
                    keyboardShortcuts: false //disables enter key trigger
                });
        };

        var loadMedHistory = function () {
            DrugService.getPast48(function (list) {
                if (list) {
                    list.forEach(function (item) {
                        item.displayName = item.drug_name + " - " + item.drug_dosage + " mg";
                        item.dateTime = new Date(item.completed_time).toLocaleString();
                    });
                    $scope.drugHistory = list;
                }
            });
        };

        var loadConditions = function () {
            ConditionService.getConditions(function (data) {
                if (data) {
                    $scope.userinfo.medicalConditions = [];
                    data.forEach(function (item) {
                        $scope.userinfo.medicalConditions.push(item.Name.toLowerCase());
                    });
                    data.sort();
                }
            });
        };

        var loadDetails = function(){
            UserService.getSelf(function(data){
                $scope.userinfo.name = data.Name;
                $scope.userinfo.dob = data.DOB;
                $scope.userinfo.age = calculateAge(new Date(data.DOB));
            });
        };


        var calculateAge = function(dob) {
            var ageDifMs = Date.now() - dob.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        };

        $scope.$on('$viewContentLoaded', function () {
            formConfig();
            loadDetails();
            modalConfig();
            loadMedHistory();
            loadConditions();
        });
    }]);
