'use strict';
var host = "http://stillkickingme.azurewebsites.net/api/";
var token = getToken('auth-token');

angular.module('DataManager', [])
    .service('AuthService', ['$http', function ($http) {
        var self = this;

        self.login = function (username, password, callback) {
            var pkt = {username: username, password: password};
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

        self.register = function (pkt, callback) {
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

    .service('APIService', ['$http', function ($http) {
        var self = this;

        self.IMO_CheckSeverity = function (keyword, callback) {
            var pkt = {
                "searchTerm": keyword,
                "numberOfResults": 10,
                "clientApp": 'TestApp',
                "clientAppVersion": '0.0.1',
                "siteId": 'site',
                "userId": 'user'

            };
            $http({
                method: 'POST',
                url: 'http://184.73.124.73:80/PortalWebService/api/v2/product/problemIT_Professional/search/',
                data: pkt,
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                    'Authorization': 'Basic cnJ5YTM3bTB3aXk2YWs='
                }
            }).then(function (data) {
                callback(data.data);
            }, function errorCallback(response) {
                console.log('error occurred: ', response);
                callback('', response);
            });
        };
    }])

    .service('ConditionService', ['$http', function ($http) {
        var self = this;
        var conditions = []

        self.getConditions = function (callback) {
            //ajax call

            $http({
                method: 'GET',
                url: host + "patient/conditions",
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                    'Authorization': getToken('token')
                }
            }).then(function (data) {
                conditions = data.data;
                callback(conditions);
            }, function errorCallback(response) {
                console.log('error occurred: ', response);
                callback('', response);
            });
        };

        self.addCondition = function (condition, callback) {
            $http({
                method: 'POST',
                url: host + "patient/conditions",
                data: {name: condition},
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                    'Authorization': getToken('token')
                }
            }).then(function (data) {
                callback(data.data, condition);
            }, function errorCallback(conditions) {
                console.log('error occurred: ', response);
                callback('', condition, response);

            });
        }
    }])

    .service('DrugService', ['$http', function ($http) {
        var self = this;
        var drugList = [];
        var scheduleOfDrugs = [];

        self.addDrug = function (pkg, callback) {
            $http({
                method: 'POST',
                url: host + "patient/medication",
                data: pkg,
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                    'Authorization': getToken('token')
                }
            }).then(function (data) {
                callback(data.data);
            }, function errorCallback(response) {
                console.log('error occurred: ', response);
                callback('', response);
            });
        };

        self.scheduleDrug = function (pkg, callback) {
            $http({
                method: 'POST',
                url: host + "patient/schedule",
                data: pkg,
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                    'Authorization': getToken('token')
                }
            }).then(function (data) {
                callback(data.data);
            }, function errorCallback(response) {
                console.log('error occurred: ', response);
                callback('', response);
            });
        };

        self.getDrugList = function (hardReload, callback) {
            if (!hardReload && drugList && drugList.length > 0) {
                callback(drugList);
                return null;
            } else {
                $http({
                    method: 'GET',
                    url: host + "patient/medications",
                    headers: {
                        'Content-Type': "application/json",
                        'Accept': "application/json",
                        'Authorization': getToken('token')
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

        self.getDrugSchedule = function (hardReload, callback) {
            if (!hardReload && scheduleOfDrugs && scheduleOfDrugs.length > 0) {
                return scheduleOfDrugs;
            } else {
                //ajax call
                $http({
                    method: 'GET',
                    url: host + "/Patient/ScheduleDrugs",
                    headers: {
                        'Content-Type': "application/json",
                        'Accept': "application/json",
                        'Authorization': getToken('token')
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

        self.searchForDrug = function (id, callback1, callback2) {
            $http({
                method: 'GET',
                url: 'https://rxnav.nlm.nih.gov/REST/rxcui.json?idtype=NDC&id=' + id,
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json"//,
                    //'Authorization': token
                }
            }).then(function (response) {
                console.log('found: ', response);
                if (response && response.idGroup && response.idGroup.rxnormId) {
                    var rxnormId = response.idGroup.rxnormId;
                    callback1(rxnormId);
                    //further down the rabbit hole
                    $http({
                        method: 'GET',
                        url: 'https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=' + rxnormId,
                        headers: {
                            'Content-Type': "application/json",
                            'Accept': "application/json",
                            'Authorization': token
                        }
                    }).then(function (response) {
                        console.log('found more stuff: ', response);
                        if (response && response.interactionTypeGroup
                            && response.interactionTypeGroup.interactionType
                            && response.interactionTypeGroup.interactionType.minConceptItem) {
                            callback2(response.interactionTypeGroup.interactionType.minConceptItem);
                        } else {
                            callback2('', 'not found');
                        }
                    }, function errorCallback(response) {
                        callback2('', response);
                    });
                } else {
                    callback1('', 'not found');
                    callback2('', 'not found');
                }

            }, function errorCallback(response) {
                console.log('error occured: ', response);
                callback1('', response);
                callback2('', response);
            });
        };

        self.getTodaysHistory = function (callback) {
            $http({
                method: 'GET',
                url: host + "patient/today",
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                    'Authorization': getToken('token')
                }
            }).then(function (data) {
                callback(data.data);
            }, function errorCallback(response) {
                console.log('error occurred: ', response);
                callback('', response);
            });
        };

        self.getPast48 = function (callback) {
            $http({
                method: 'GET',
                url: host + "patient/history",
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                    'Authorization': getToken('token')
                }
            }).then(function (data) {
                callback(data.data);
            }, function errorCallback(response) {
                console.log('error occurred: ', response);
                callback('', response);
            });
        };

        self.addToHistory = function (pkg, callback) {
            $http({
                method: 'POST',
                url: host + "patient/history",
                data: pkg,
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                    'Authorization': getToken('token')
                }
            }).then(function (data) {
                callback(data.data);
            }, function errorCallback(response) {
                console.log('error occurred: ', response);
                callback('', response);
            });
        };


    }])

    .service('ResourceService', ['$http', function ($http) {
        var self = this;
        self.data = {types: null};

        self.getContactTypes = function (callback) {
            if (self.data.types) {
                callback(self.data);
            } else {
                $http({
                    method: 'GET',
                    url: host + "contacts/types",
                    headers: {
                        'Content-Type': "application/json",
                        'Accept': "application/json",
                        'Authorization': getToken('token')
                    }
                }).then(function (data) {
                    self.data.types = data.data;
                    callback(self.data.types);
                }, function errorCallback(response) {
                    console.log('error occurred: ', response);
                    callback('', response);
                });
            }
        };

        self.getContacts = function (callback) {
            $http({
                method: 'GET',
                url: host + "patient/contacts",
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                    'Authorization': getToken('token')
                }
            }).then(function (data) {
                callback(data.data);
            }, function errorCallback(response) {
                console.log('error occurred: ', response);
                callback('', response);
            });
        };

        self.postContacts = function (pkg, callback) {
            $http({
                method: 'POST',
                url: host + "patient/contact",
                data: pkg,
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                    'Authorization': getToken('token')
                }
            }).then(function (data) {
                callback(data.data);
            }, function errorCallback(response) {
                console.log('error occurred: ', response);
                callback('', response);
            });
        };

        self.putContacts = function (pkg, callback) {
            $http({
                method: 'PUT',
                url: host + "patient/contact",
                data: pkg,
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                    'Authorization': getToken('token')
                }
            }).then(function (data) {
                callback(data.data);
            }, function errorCallback(response) {
                console.log('error occurred: ', response);
                callback('', response);
            });
        };
    }])

    .service('UserService', ['$http', function ($http) {
        var self = this;
        self.data = null;

        self.getSelf = function (callback) {
            if (self.data) {
                callback(self.data);
            } else {
                $http({
                    method: 'GET',
                    url: host + "patient",
                    headers: {
                        'Content-Type': "application/json",
                        'Accept': "application/json",
                        'Authorization': getToken('token')
                    }
                }).then(function (data) {
                    self.data = data.data;
                    callback(self.data);
                }, function errorCallback(response) {
                    console.log('error occurred: ', response);
                    callback('', response);
                });
            }
        };
    }]);

