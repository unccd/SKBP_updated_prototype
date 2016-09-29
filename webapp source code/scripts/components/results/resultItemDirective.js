'use strict';

unccdApp.directive('resultItemDirective', function() {
    return {
        restrict:       'AE',
        replace:        'true',
        templateUrl:    'views/directives/resultItemView.html'
    }
});
