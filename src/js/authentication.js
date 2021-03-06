'use strict';

var setToken = function(type, token) {
    sessionStorage.setItem(type, token);
};

var getToken = function(tokenName) {
    return sessionStorage.getItem(tokenName);
};

var removeToken = function(token) {
    sessionStorage.removeItem(token);
};

var clearTokens = function() {
    var tokenList = ['auth-token', 'token'];
    tokenList.forEach(function(token) {
        removeToken(token);
    });
};

var hasAccess = function() {
    var token = getToken('token');
    if (!token) {
        return false;
    } else {
        return true;
    }
};

var toggleSideMenu = function() {
    $('.ui.inverted.sidebar').sidebar('toggle');
};