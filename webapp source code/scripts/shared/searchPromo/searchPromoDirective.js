'use strict';

/*
* Should be used with the searchInput controller
* */

unccdApp.directive('searchPromoDirective', function() {
    return {
        restrict:       'AE',
        replace:        'true',
        templateUrl:    'views/directives/searchPromoView.html'
    }
});
