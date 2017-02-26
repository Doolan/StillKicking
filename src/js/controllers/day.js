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
                sunday: false,
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false
            }
        };


        $scope.completePill = function (evt) {

            for(var i in evt.drugs) {
                var drug = evt.drugs[i];
                var pkg = {
                    drug_idfk: drug.id,
                    timecode: evt.time,
                    amount_taken: drug.numPill,
                    on_time: true
                };
                DrugService.addToHistory(pkg, function(data){
                   //do nothing
                });
            };

            evt.completed = true;

        };

        $scope.lookupDrug = function () {
            var ndc = $('#addDrugForm').form('get value', ndc);
            if (ndc) {
                console.log(ndc);
                DrugService.searchForDrug(ndc, function (data, err) {
                    console.log(data, "first step");
                }, function (data, err) {
                    console.log(data);
                });
            }
        };


        /* ----- Manipulate Data ------ */
        var createSchedule = function (eventArray) {
            var events = {};

            for (var i = 0; i < eventArray.length; i++) {
                var drug = eventArray[i];
                var drugObj = {
                    id: drug.drug_id,
                    name: drug.name,
                    dosage: drug.dosage,
                    numPill: drug.pillsToTake,
                    severity: drug.severity
                };

                if (!drug.repeatHours)
                    drug.repeatHours = 24;

                var pillCount = 0;
                var hourIncrement = drug.repeatHours * 100;
                for (var j = parseInt(drug.repeatStart); j < 2400 && pillCount <= drug.maxPills; j += hourIncrement) {
                    if (events[j]) {
                        var evt = events[j];
                        evt.food = evt.food || drug.eatWithFood;
                        evt.severity = Math.max(drug.severity, evt.severity);
                        evt.drugs.push(drugObj);
                        evt.completed = false;
                    } else {
                        events[j] = {
                            time: j,
                            food: drug.eatWithFood,
                            severity: drug.severity,
                            drugs: [drugObj]
                        }
                    }
                    pillCount += drug.pillsToTake;
                }
            }
            $scope.drugSchedule = events;
            loadHistory();
        };

        var markCompleted = function(eventArray){
            for(var i in eventArray) {
                var evt = eventArray[i];
                if($scope.drugSchedule[evt.timecode])
                    $scope.drugSchedule[evt.timecode].completed = true;
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
                        name: {
                            identifier: 'name',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter your name'
                                }
                            ]
                        },
                        max_pills: {
                            identifier: 'max_pills',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter a dosage'
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
                        startDate: {
                            identifier: 'startDate',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter a start date'
                                }
                            ]
                        }
                    },
                    onSuccess: function (event, fields) {
                        var pkt = {
                            name: fields.name,
                            dosage_mg: fields.dosage,
                            eat_with_food: !!fields.food,
                            max_pill: fields.max_pills,
                            notes: fields.notes
                        };
                        DrugService.addDrug(pkt, function (list, err) {
                            if (err) {
                                //something broke
                            }
                            if (list) {
                                list.forEach(function (item) {
                                    item.displayName = item.Name + " - " + item.dosage_mg + " mg";
                                });
                                $scope.drugList = list;
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
                        drug: {
                            identifier: 'drug',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please choose a drug'
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
                        repeat: {
                            identifier: 'repeat',
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
                        var weekly = '';
                        if ($scope.drugWeekList.monday)
                            weekly += 'M';
                        if ($scope.drugWeekList.tuesday)
                            weekly += 'T';
                        if ($scope.drugWeekList.wednesday)
                            weekly += 'W';
                        if ($scope.drugWeekList.thursday)
                            weekly += 'R';
                        if ($scope.drugWeekList.friday)
                            weekly += 'F';
                        if ($scope.drugWeekList.saturday)
                            weekly += 'S';
                        if ($scope.drugWeekList.sunday)
                            weekly += 'U';

                        var pkg = {
                            med_id: fields.drug,
                            amount: fields.amount,
                            time_to_take: fields.time,
                            week_repeat_code: weekly,
                            start_date: fields.startDate,
                            end_date: fields.endDate,
                            severity: 1,
                            repeat_interval: fields.repeat,
                            active: true

                        };
                        DrugService.scheduleDrug(pkg, function (data, err) {
                            if (err) {
                                //something broke
                            } else if (data) {
                                createSchedule(data);
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

        var loadDrugList = function (reload) {
            DrugService.getDrugList(reload, function (list) {
                //createSchedule(list);
                list.forEach(function (item) {
                    item.displayName = item.Name + " - " + item.dosage_mg + " mg";
                });
                $scope.drugList = list;
            });
        };

        var loadDrugSchedule = function (reload) {
            DrugService.getDrugSchedule(reload, function (list) {
                //$scope.drugSchedule = list;
                createSchedule(list);
            });
        };



        var loadHistory = function(){
            DrugService.getTodaysHistory(function(data){
                markCompleted(data);
            });
        };

        //on scope load
        $scope.$on('$viewContentLoaded', function () {
            loadDrugList(false);
            loadDrugSchedule(true);
            dayPageSetup();
            $('.dropdown').dropdown();
            $('#startDate').calendar({
                type: 'date'
            });
            $('#endDate').calendar({
                type: 'date'
            });
        });
    }]);
