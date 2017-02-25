'use strict';
var host = "??/";
var token = getToken('auth-token');

angular.module('DataManager', [])
    .service('AuthService', ['$http', function ($http) {
        var self = this;

        self.login = function (username, password, callback) {
            var pkt = { email: username, password: password };
            //$http({
            //    method: 'POST',
            //    url: host + "login",
            //    data: pkt,
            //    headers: {
            //        'Content-Type': "application/json",
            //        'Accept': "application/json"
            //    }
            //}).then(function (data) {
            //    console.log('SUCCESS - login', data.data, data.data.access_token);
            //    setToken('auth-token', 'Bearer ' + data.data.access_token);
            //    $http.defaults.headers.common.Authorization = 'Bearer ' + data.data.access_token;
            //    token = 'Bearer ' + data.data.access_token;
            //    callback(data.data.access_token);
            //}, function errorCallback(response) {
            //    console.log('error occured: ', response);
            //    callback('', response);
            //    //UPDATE STUFF FOR INCORRECT USER NAME PASSWORD VS SERVER ERROR
            //});
                token = 'valid';
                var role= 'user';
                setToken('role', role);
                setToken('token',token);
            callback(token);
        };

        self.register = function(fields, callback){
            var pkt = fields;


            //AJAX CALL
                token = 'valid';
                var role= 'user';
                setToken('role', role);
                setToken('token',token);
            callback(token);
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
                scheduleOfDrugs = [
                    {
                        name: 'Breakfast',
                        startTime: '0800',
                        expireTime: '0900',
                        drugs: [
                            {
                                name: 'Drug 1',
                                amt: 1,
                                taken: true,
                                optional: false
                            },
                            {
                                name: 'Drug 2',
                                amt: 2,
                                taken: true,
                                optional: false
                            },
                            {
                                name: 'Drug 3',
                                amt: 1,
                                taken: true,
                                optional: false
                            },
                            {
                                name: 'Drug 4',
                                amt: 1,
                                taken: false,
                                optional: false
                            }
                        ]
                    },
                    {
                        name: '',
                        startTime: '1030',
                        expireTime: '1130',
                        drugs: [
                            {
                                name: 'drug 4',
                                amt: 1,
                                taken: true,
                                optional: false
                            }
                        ]
                    },
                    {
                        name: 'Lunch',
                        startTime: '1200',
                        expireTime: '1300',
                        drugs: [
                            {
                                name: 'Drug 1',
                                amt: 1,
                                taken: true,
                                optional: false
                            },
                            {
                                name: 'Drug 3',
                                amt: 1,
                                taken: false,
                                optional: false
                            }
                        ]
                    },
                    {
                        name: 'Dinner',
                        startTime: '1700',
                        expireTime: '1800',
                        drugs: [
                            {
                                name: 'Drug 3',
                                amt: 1,
                                taken: false,
                                optional: false
                            },
                            {
                                name: 'Drug 6',
                                amt: 1,
                                taken: false,
                                optional: false
                            }
                        ]
                    },
                    {
                        name: '',
                        startTime: '2000',
                        expireTime: '2330',
                        drugs: [
                            {
                                name: 'drug 4',
                                amt: 1,
                                taken: false,
                                optional: false
                            }
                        ]
                    }
                ];
                callback(scheduleOfDrugs);
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
