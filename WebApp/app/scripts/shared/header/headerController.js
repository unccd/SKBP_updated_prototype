'use strict';


//Header controller
unccdApp.controller('headerController', function ($scope, $route) {
    $scope.$route    = $route;

    console.log('route: '+JSON.stringify($route.current.$$route.activeTab));

});
