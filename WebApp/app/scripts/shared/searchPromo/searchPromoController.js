'use strict';


//Search controller
unccdApp.controller('searchPromoController', function ($scope, $http, communicationService) {
    $scope.resultsCount = 0;


    //Executes the searchInput to the back end
    $scope.getDocsCount = function () {
        $scope.loading  = true;
        $http.get(''+communicationService.url+'/'+communicationService.collectionName+'/'+communicationService.getSearchHandlerName()+'?q=*&rows=1', {}, {})
            .success(function(response) {
                if(response.response && response.response.numFound){
                    $scope.resultsCount = response.response.numFound;
                }
                else{
                    console.log('ERROR - Error getting the documents count: Count value is not in the response');
                }
            }).error(function (data) {
                console.log('ERROR - Error getting the documents count: '+JSON.stringify(data));
            }
        );
    };

    $scope.getDocsCount();

});
