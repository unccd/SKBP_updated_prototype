'use strict';

/**
 * @ngdoc function
 * @name unccdApp.controller:homeController
 * @description
 * # HomeCtrl
 * Controller of the unccdApp
 */
unccdApp.controller('homeController', function ($scope, $http, $timeout, localStorageService, communicationService, fileUtilityService) {

    /**************/
    /* HIGHLIGHTS */
    /**************/
    $scope.highlights           = [];
    $scope.imgHighlights        = [];
    $scope.highlightsCounter    = 0;
    $scope.showCarousel         = false;



    //Get the highlights file names
    //http://81.143.99.157:8983/solr/highlights/fileNames.txt
    $scope.getHighlightsFilenames = function(){
        $http.get('highlights/filenames.txt', {}, {})
            .success(function(res) {
                console.log('Get fileNames file success');
                $scope.createHighlights(fileUtilityService.getHighlightsFilenames(res));
                //TODO show images as background in the highlights - Uncomment line below as part of the solution - Get the images filenames from the same file than the highlights (no highlights name file)
                //$scope.imgHighlights    = fileUtilityService.getImagesFilenames(res);
            }).error(function (data) {
                console.log("ERROR getting the highlights filenames: "+JSON.stringify(data));
            }
        );
    };


    //Created the highlights based on the names received as a parameter
    $scope.createHighlights = function (highlightFilenames) {
        for(var i = 0; i < highlightFilenames.length; i++){
            $scope.highlightsCounter = $scope.highlightsCounter + 1;
            $scope.getHighlightFile(highlightFilenames[i]);
        }
    };


    //Add the images to the highlights based on the names received as a parameter
    /*$scope.createImgHighlights  = function (highlightImgFilenames) {
        for(var i = 0; i < highlightImgFilenames.length; i++){
            //$scope.getImgHighlight(highlightImgFilenames[i]);
            $scope.imgHighlights.;
        }
    };*/


    //Gets the content of a file
    $scope.getHighlightFile = function (filename) {
        $http.get('highlights/'+filename, {}, {})
            .success(function(res) {
                console.log('Get file success');
                $scope.highlights.push(fileUtilityService.createHighlightObject(res));
                $scope.highlightsCounter = $scope.highlightsCounter - 1;

                $timeout( function(){
                    if($scope.highlightsCounter === 0){
                        $scope.setCarousel();
                    }
                }, 10); //Added small delay to make sure that the DOM have an element called unccd-highlights-carousel before initializing carouFredSel

            }).error(function (data) {
                $scope.highlightsCounter = $scope.highlightsCounter - 1;
                console.log("ERROR getting the highlight file: "+JSON.stringify(data));
            }
        );
    };


    $scope.getHighlightsFilenames();
    /********************/
    /* END - HIGHLIGHTS */
    /********************/



    /**********/
    /* SEARCH */
    /**********/

    $scope.search   = function () {
        console.log('Setting range facets in the home page');
        $http.get(''+communicationService.url+'/'+communicationService.collectionName+'/'+communicationService.searchHandler+'?'+'q=*', {}, {}) //q=* is to retrieve all the values
            .success(function(response) {
                if(response.response.docs && response.facet_counts.facet_fields){
                    console.log('Range facets set in the home page');
                    localStorageService.set('rangeFacets', $scope.rangeFacets);
                }
                else{
                    console.log('ERROR: Search error: Incorrect response format');
                }
            }).error(function (data) {
                console.log('Search error: '+JSON.stringify(data));
            }
        );
    };

    //$scope.search(); //Search performed on page load

    /****************/
    /* END - SEARCH */
    /****************/



    /************/
    /* CAROUSEL */
    /************/

    //Sets the carousel
    $scope.setCarousel  = function () {
        $scope.showCarousel = true;
        $('#unccd-highlights-carousel').carouFredSel({
            scroll: {items:1, duration: 1000}, //set duration here
            auto: 3000,
            responsive: true,
            width: '100%',
            //scroll: 2,
            prev: '#prev',
            next: '#next',
            //pagination: "#pager",
            mousewheel: true,
            swipe: {
                onMouse: true,
                onTouch: true
            },
            items: {
                width: 400,
                visible: {
                    min: 2,
                    max: 3
                }
            }
        });
    };
    /******************/
    /* END - CAROUSEL */
    /******************/
    /*** end Carousel ***/
});
