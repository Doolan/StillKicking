'use strict';
var host = "http://stillkickingme.azurewebsites.net/api/";
var token = getToken('auth-token');

angular.module('DataManager', [])
    .service('AuthService', ['$http', function ($http) {
        var self = this;

        self.login = function (username, password, callback) {
            var pkt = { username: username, password: password };
            $http({
                method: 'POST',
                url: host + "patient/login",
                data: pkt,
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json"
                }
            }).then(function (data) {
                token = data.data;
                setToken('token', token);
                callback(token);
            }, function errorCallback(response) {
                console.log('error occurred: ', response);
                callback('', response);
                //UPDATE STUFF FOR INCORRECT USER NAME PASSWORD VS SERVER ERROR
            });
        };

        self.register = function(pkt, callback){
            $http({
                method: 'POST',
                url: host + "patient/register",
                data: pkt,
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json"
                }
            }).then(function (data) {
                token = data.data;
                setToken('token', token);
                callback(token);
               }, function errorCallback(response) {
                console.log('error occurred: ', response);
                callback('', response);
            });
        }
    }])
    .service('DrugService', ['$http', function($http){
        var self = this;
        var drugList=[];
        var scheduleOfDrugs = [];

        self.addDrug = function(fields, callback){
            //var pkt = fields....
            console.log('pretending to register', fields);

            //AJAX REQUEST

            callback('','');
        };

        self.scheduleDrug = function(fields, days, callback){
            //var pkt = fields....
            console.log('pretending to schedule', fields, days);

            //AJAX REQUEST

            callback();
        };

        self.getDrugList = function(hardReload, callback){
            if(!hardReload && drugList && drugList.length >0){
                return drugList;
            }else{
                //ajax call
                drugList = [
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
                callback(drugList);
            }
        };

        self.getDrugSchedule = function(hardReload, callback){
            if(!hardReload && scheduleOfDrugs && scheduleOfDrugs.length >0){
                return scheduleOfDrugs;
            }else{
                //ajax call
                $http({
                    method: 'GET',
                    url: host + "/Patient/ScheduleDrugs",
                    headers: {
                        'Content-Type': "application/json",
                        'Accept': "application/json",
                        'Authorization':getToken('token')
                    }
                }).then(function (data) {
                    scheduleOfDrugs = data.data;
                    callback(scheduleOfDrugs);
                }, function errorCallback(response) {
                    console.log('error occurred: ', response);
                    callback('', response);
                });
            }
        };

        self.searchForDrug = function(id, callback1, callback2){
            $http({
                method: 'GET',
                url: 'https://rxnav.nlm.nih.gov/REST/rxcui.json?idtype=NDC&id='+ id,
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                    'Authorization': token
                }
            }).then(function (response) {
                console.log('found: ', response);
                if(response && response.idGroup && response.idGroup.rxnormId){
                    var rxnormId= response.idGroup.rxnormId;
                    callback1(rxnormId);
                    //further down the rabbit hole
                    $http({
                        method: 'GET',
                        url: 'https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui='+ rxnormId,
                        headers: {
                            'Content-Type': "application/json",
                            'Accept': "application/json",
                            'Authorization': token
                        }
                    }).then(function (response) {
                        console.log('found more stuff: ', response);
                        if(response && response.interactionTypeGroup
                            && response.interactionTypeGroup.interactionType
                            && response.interactionTypeGroup.interactionType.minConceptItem){
                            callback2(response.interactionTypeGroup.interactionType.minConceptItem);
                        }else{
                            callback2('', 'not found');
                        }
                    }, function errorCallback(response){
                        callback2('', response);
                    });
                }else{
                    callback1('', 'not found')
                    callback2('', 'not found')
                }

            }, function errorCallback(response) {
                console.log('error occured: ', response);
                callback1('', response);
                callback2('', response);
            });
        };


    }]);
