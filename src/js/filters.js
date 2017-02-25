angular.module('StillKickingApp')
    .filter('militaryTime', function() {
        return function(time) {
            time = String(time);
            if (!time || time.length < 2) {
                return time || '';
            }
            if(time.length == 3){
                time = "0" + time;
            }
            var hour = parseInt(time.substr(0,2));
            var min = time.substr(2,2);
            var wildcard = hour > 11? ' pm': ' am';
            hour = hour > 12 ? hour - 12: hour;
            return hour + ':' + min + wildcard;
        };
    });

