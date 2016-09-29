'use strict';

unccdApp.directive('headerDirective', function() {
    return {
        restrict:       'AE',
        replace:        'true',
        templateUrl:    'views/directives/headerView.html'
    }
});
