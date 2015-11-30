'use strict';

/*
* Should be used with the searchInput controller
* */

unccdApp.directive('partnerLogosDirective', function() {
    return {
        restrict:       'AE',
        replace:        'true',
        templateUrl:    'views/directives/partnerLogosView.html'
    }
});
