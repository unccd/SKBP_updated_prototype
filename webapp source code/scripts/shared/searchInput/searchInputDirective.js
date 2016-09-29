'use strict';

/*
* Should be used with the searchInput controller
* */

unccdApp.directive('searchInputDirective', function() {
    return {
        restrict:       'AE',
        replace:        'true',
        templateUrl:    'views/directives/searchInputView.html'
    }
});
