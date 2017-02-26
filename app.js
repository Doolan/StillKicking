'use strict';
(function () {
        //Node Modules
    var angular = require('angular');
    require('angular-ui-router');
    require('angular-sanitize');
    require('angular-centered');
    require('chart.js');
    require('angular-chart.js');
    // require('semantic-ui-calendar');
    // require('ng-sortable');
    // require('./js/authentication.js');
    // require('./js/services');

    var app = angular.module('StillKickingApp', ['DataManager', 'ui.router', 'chart.js', 'angular-centered']);
    // require('./js/filter.js');
    require('./src/js/controllers/');

    app.run(function ($state, $rootScope) {
        $rootScope.$on('$stateChangeError', function (evt, toState, toParams, fromState, fromParams, error) {
            if (angular.isObject(error) && angular.isString(error.code)) {
                switch (error.code) {
                    case 'NOT_AUTH':
                        // go to the login page
                        $state.go('anon.login');
                        break;
                     case 'ALREADY_AUTH':
                         //go to the dash board
                         $state.go('user.day');
                         break;
                    default:
                        // set the error object on the error state and go there
                        $state.get('error').error = error;
                        $state.go('error');
                }
            }
            else {
                // unexpected error
                $state.go('home');
            }
        });
    });
    app.config(function ($stateProvider, $urlRouterProvider) {//, $locationProvider) {
        // $locationProvider.html5Mode(true);
        $urlRouterProvider.when('/user', '/user/history');
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('user', {
                url: '/user',
                abstract: true,
                  resolve: {
                    security: ['$q', function ($q) {
                      if (!hasAccess()) {
                        return $q.reject({ code: 'NOT_AUTH' });
                      }
                    }]
                  },
                templateUrl: 'views/user.html',
                controller: 'UserCtrl',
                controllerAs: 'user'
            })
            .state('anon', {
                url: '',
                abstract: true,
                resolve: {
                    security: ['$q', function ($q) {
                      if (hasAccess()) {
                        return $q.reject({ code: 'ALREADY_AUTH' });
                      }
                    }]
                },
                templateUrl: 'views/anon.html',
                controller: 'AnonCtrl',
                controllerAs: 'anonCtrl'
            })
            .state('user.day', {
                url:'/day',
                abstract:false,
                templateUrl: '../views/auth_partials/day.html',
                controller:'DayCtrl',
                controllerAs: 'dayCtrl'
            })
            .state('user.card', {
                url:'/card',
                abstract:false,
                templateUrl: '../views/auth_partials/emergency.card.html',
                controller:'eCardCtrl',
                controllerAs: 'cardCtrl'
            })
            .state('user.resources', {
                url:'/resources',
                abstract:false,
                templateUrl: '../views/auth_partials/resources.html',
                controller:'ResourcesCtrl',
                controllerAs: 'resourcesCtrl'
            })
            .state('anon.login', {
                url: '/',
                abstract: false,
                templateUrl: '../views/non_auth_partials/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'login'
            })
            .state('anon.register', {
                url: '/register',
                abstract: false,
                templateUrl: '../views/non_auth_partials/register.html',
                controller: 'RegisterCtrl',
                controllerAs: 'register'
            });
    });

    app.exports = app;
})();
