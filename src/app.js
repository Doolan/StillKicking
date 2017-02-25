(function () {
    var app = angular.module('StillKickingApp', ['DataManager', 'ui.router', 'chart.js', 'angular-centered']);


    app.run(function ($state, $rootScope) {
        $rootScope.$on('$stateChangeError', function (evt, toState, toParams, fromState, fromParams, error) {
            if (angular.isObject(error) && angular.isString(error.code)) {
                switch (error.code) {
                    case 'NOT_AUTH':
                        // go to the login page
                        $state.go('login');
                        break;
                    // case 'ALREADY_AUTH':
                    //     //go to the dash board
                    //     $state.go('user.history');
                    //     break;
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
                    //security: ['$q', function ($q) {
                    //  if (!hasAccess()) {
                    //    return $q.reject({ code: 'NOT_AUTH' });
                    //  }
                    //}]
                  },
                templateUrl: 'views/user.html',
                controller: 'UserCtrl',
                controllerAs: 'user'
            })
            .state('user.day', {
                url:'/day',
                abstract:false,
                templateUrl: '../views/day.html',
                controller:'DayCtrl',
                controllerAs: 'dayCtrl'
            })
            .state('user.card', {
                url:'/card',
                abstract:false,
                templateUrl: '../views/emergency.card.html',
                controller:'eCardCtrl',
                controllerAs: 'cardCtrl'
            })
            .state('login', {
                url: '/',
                abstract: false,
                templateUrl: '../views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'login',
                resolve: {
                    //security: ['$q', function ($q) {
                    //    if (hasAccess()) {
                    //        return $q.reject({code: 'ALREADY_AUTH'});
                    //    }
                    //}]
                }
            });
    });

    app.exports = app;
})();
