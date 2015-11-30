'use strict';

/**
 * @ngdoc function
 * @name unccdApp.controller:homeController
 * @description
 * # HomeCtrl
 * Controller of the unccdApp
 */
unccdApp.controller('searchResultsController', ['$scope', '$http', '$location', '$compile', '$timeout', '$route', '$modal', 'localStorageService', 'communicationService', 'resultsService',
    function ($scope, $http, $location, $compile, $timeout, $route, $modal, localStorageService, communicationService, resultsService) {

    $scope.results              = {};       //The results
    $scope.mapModeResults       = [];       //The results shown under the map
    $scope.facets               = {};       //The object with the facets as properties
    $scope.currentResultItem    = {};       //The current result item that is displayed in the modal
    $scope.resultsMode          = 'list';   //Results page mode, list or map
    $scope.rangeFacetsNames     = [];       //List of range facet names
    $scope.loading              = true;     //Loading status (to show or hide sections of the page)

    //Map variables
    $scope.documentsInMap       = 0;

    //Pagination variables. Required for the pagination plugin (angular-ui)
    $scope.itemsPerPage     = 10;   //Default documents per page = 10
    $scope.maxSize          = 5;    //Maximum amount of pages showed in the pagination
    $scope.bigTotalItems    = 0;
    $scope.bigCurrentPage   = 1;

    $scope.openedInfoWindow;        //To keep track of the last opened info window (in the Google Map)
    $scope.mapResultsCount  = 0;    //Results count in map mode (used during switch)
    $scope.listResultsCount = 0;    //Results count in list mode (used during switch)

    $scope.sourceDescription    = '';
    /**************/
    /* PAGINATION */
    /**************/

    $scope.setupPaginationInfo = function(response){
        if(response){
            if(response.numFound){
                $scope.bigTotalItems    = response.numFound;
                $scope.listResultsCount = $scope.bigTotalItems;
            }
            if(response.start){
                $scope.bigCurrentPage   = response.start;
            }
            if(response.docs){
                $scope.itemsPerPage     = response.docs.length;
            }
        }
    };

    //Pagination methods
    $scope.setPage = function (pageNo) {
        $scope.bigCurrentPage = pageNo;
    };

    $scope.pageChanged = function() {
        $location.search('start',$scope.bigCurrentPage).search('rows',$scope.itemsPerPage);
    };

    /********************/
    /* END - PAGINATION */
    /********************/



    /********/
    /* MODE */
    /********/

    //Switch the mode of the results page between list and map
    $scope.executeMapSearch    = function(newResultsMode){
        if(newResultsMode == 'list' || newResultsMode == 'map'){
            $scope.resultsMode  = newResultsMode;
            if(newResultsMode == 'map'){
                $scope.bigTotalItems    = $scope.mapModeResults;
                //Map
                $timeout( function(){
                    $scope.searchMapValues($scope.generateQueryString($location.search()));
                }, 10); //Added small delay to make sure that the DOM have an element called map_canvas before initializing the map
            }
            else{
                $scope.bigTotalItems    = $scope.listResultsCount;
            }
        }
        else{
            console.log('The selected button: '+newResultsMode+', is not a valid option');
        }
    };


    //Switch the mode of the results page between list and map
    $scope.changeResultsMode    = function(newResultsMode){
        if(newResultsMode == 'list' || newResultsMode == 'map'){
            $scope.resultsMode  = newResultsMode;
            if(newResultsMode == 'map'){
                $location.search('resultsMode', 'map');
                $scope.bigTotalItems    = $scope.mapModeResults;
                //Map
                $timeout( function(){
                    $scope.searchMapValues($scope.generateQueryString($location.search()));
                }, 10); //Added small delay to make sure that the DOM have an element called map_canvas before initializing the map
            }
            else{
                $scope.bigTotalItems    = $scope.listResultsCount;
                $location.search('resultsMode', 'list');
            }
        }
        else{
            console.log('The selected button: '+newResultsMode+', is not a valid option');
        }
    };

    /**************/
    /* END - MODE */
    /**************/



    /***************/
    /* RESULT ITEM */
    /***************/

    //Prepares the result item modal
    /*
    $scope.prepareResultModal   = function(docId){
        $scope.currentResultItem    = {};
        $http.get(''+communicationService.url+'/'+communicationService.collectionName+'/'+communicationService.getSearchHandlerName($location.search().source)+'?fq=id:'+docId, {}, {})
            .success(function(response) {
                if(response.response && response.response.docs && response.response.docs.length > 0){
                    $scope.currentResultItem    = response.response.docs[0];
                }
            }).error(function (data) {
                console.log('ERROR - Error getting the document details information: '+JSON.stringify(data));
            }
        );
    };*/

    $scope.prepareResultModal   = function(resultIndex) {
console.log('preparing1...');
        $scope.currentResultItem = $scope.results[resultIndex];
        $scope.items = $scope.currentResultItem;
        $scope.openModal();
        //$scope.$parent.$broadcast('setCurrentItem', $scope.currentResultItem);
    };

    $scope.prepareResultModalWithId   = function(docId){
console.log('preparing2...');
        $scope.currentResultItem    = {};
        $http.get(''+communicationService.url+'/'+communicationService.collectionName+'/'+communicationService.getSearchHandlerName($location.search().source)+'?fq=id:'+docId, {}, {})
            .success(function(response) {
                if(response.response && response.response.docs && response.response.docs.length > 0){
                    $scope.currentResultItem    = response.response.docs[0];
                    //$scope.$parent.$broadcast('setCurrentItem', $scope.currentResultItem);
                    $scope.items = $scope.currentResultItem;
                    $scope.openModal();
                }
            }).error(function (data) {
                console.log('ERROR - Error getting the document details information: '+JSON.stringify(data));
            }
        );
    };

    /*********************/
    /* END - RESULT ITEM */
    /*********************/



    /**********/
    /* FACETS */
    /**********/

    //Sets the state of the facets based on the url search parameters
    $scope.setFacetsState   = function () {

    };

    //Triggered when a facet is selected
    $scope.facetSelected    = function (refinerGroup, selectedRefiner, dateFrom, dateTo) {

        var facetOptions    = $scope.facets[refinerGroup];
        var found           = false;
        var removedRefiner  = '';
        var dateRefiner     = false;

        if(dateFrom || dateTo){
            dateRefiner = true;
        }

        for(var i = 0; (i < facetOptions.length)&&(!found); i++){
            if(facetOptions[i].name === selectedRefiner){
                if($scope.facets[refinerGroup][i].enabled){
                    removedRefiner  = resultsService.removeRefiner(selectedRefiner, $location.search()[refinerGroup]);
                    if(removedRefiner === ''){  //If there are no selected refiners for this facet
                        removedRefiner = null;  //Remove it by assigning it a null value
                    }
                    $location.search(refinerGroup, removedRefiner);
                }
                else{
                    if($location.search()[refinerGroup]){
                        if(dateRefiner){
                            $location.search(refinerGroup,$location.search()[refinerGroup]+','+resultsService.encodeDateRefiner(dateFrom, dateTo));
                        }
                        else{
                            $location.search(refinerGroup,$location.search()[refinerGroup]+','+resultsService.encodeRefiner(selectedRefiner));
                        }
                    }
                    else{
                        if(dateRefiner){
                            $location.search(refinerGroup,resultsService.encodeDateRefiner(dateFrom, dateTo));
                        }
                        else{
                            $location.search(refinerGroup,resultsService.encodeRefiner(selectedRefiner));
                        }
                    }
                }
                found   = true;
            }
        }

    };

    /****************/
    /* END - FACETS */
    /****************/



    /*******/
    /* MAP */
    /*******/

    $scope.map          = {center: {latitude: 20, longitude: 0 }, zoom: 2, bounds: {}}; //Map configuration
    $scope.options      = {scrollwheel: false}; //Map options
    $scope.mapMarkers   = [];

    /*************/
    /* END - MAP */
    /*************/



    /**********/
    /* SEARCH */
    /**********/

    //Returns true if the param string is found in the local storage
    $scope.isInLocalStorage = function (name) {
        var inLocalStorage  = false;
        if(localStorageService.get(name) && localStorageService.get(name).length > 0){
            inLocalStorage  = true;
        }
        return inLocalStorage;
    };

    $scope.countDocuments   = function(documents){
        var docCount    = 0;
        for(var i = 0; i < documents.length; i++) {
            if(documents[i]['geolocation']){
                docCount = docCount + 1;
            }
        }
        return docCount;
    };

    //Executes the searchInput to the back end
    $scope.search   = function (queryString) {
        $scope.loading  = true;

        $scope.getMapCount(queryString); //To get the amount of the results in map mode

        $http.get(''+communicationService.url+'/'+communicationService.collectionName+'/'+communicationService.getSearchHandlerName($location.search().source)+'?'+queryString, {}, {})
            .success(function(response) {
                if(response.response.docs && response.facet_counts.facet_fields){
                    //Results
                    $scope.results          = response.response.docs;
                    $scope.setupPaginationInfo(response.response);

                    //Facets
                    $scope.rangeFacetsNames = Object.getOwnPropertyNames(response.facet_counts.facet_ranges);
                    $scope.facets           = resultsService.buildFacets(response.facet_counts.facet_fields, response.facet_counts.facet_ranges, $location.search());
                    $scope.documentsInMap   = $scope.countDocuments($scope.results);
                }
                else{
                    console.log('ERROR: Search error: Incorrect response format');
                }
                $scope.loading  = false;
            }).error(function (data) {
                console.log('Search error: '+JSON.stringify(data));
                $scope.loading  = false;
            }
        );
    };

    $scope.map;

    $scope.initialize   = function(id) {
        var mapOptions = {
            center: new google.maps.LatLng(20, 0),
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(id, mapOptions);

    };


    $scope.showMarkers  = function(scope, list) {

        var resultList  = [];
        var latLon      = []; //Latitude and longitude array. latLon[0] = latitude, latLon[1] = longitude

        for(var i = 0; i < list.length; i++) {

            if(list[i]['geolocation']) {
                latLon  = list[i]['geolocation'].split(',');
                list[i].listPosition    = i;

                var position = new google.maps.LatLng(
                    latLon[0],
                    latLon[1]);
                var marker = new google.maps.Marker({
                    position: position,
                    map: $scope.map
                });

                var infowindow = new google.maps.InfoWindow();
                var contentString = '<infowindow></infowindow>';

                //var compiled    = contentString;
                var compiled = $compile(contentString)(scope);

                google.maps.event.addListener(marker, 'click', (function (marker, scope, place) {
                    return function () {
                        if($scope.openedInfoWindow){
                            $scope.openedInfoWindow.close();
                            scope.place = {};
                        }
                        $http.get(''+communicationService.url+'/'+communicationService.collectionName+'/'+communicationService.getSearchHandlerName($location.search().source)+'?fq=id:'+place['id'], {}, {})
                            .success(function(response) {
                                if(response.response && response.response.docs && response.response.docs.length > 0){
                                    scope.currentId = place['id'];
                                    scope.place = response.response.docs[0];
                                    infowindow.setContent(compiled[0]);
                                    infowindow.open($scope.map, marker);
                                    $scope.openedInfoWindow = infowindow;
                                }
                            }).error(function (data) {
                                console.log('ERROR - Error getting the pin information: '+JSON.stringify(data));
                            }
                        );
                    };
                })(marker, scope, list[i]));

            }
            else{
                resultList.push(list[i]);
            }
        }
        return resultList;
    };


    $scope.polling_interval=1; //1ms
    $scope.addMarkersByIntervals    = function(param1, param2, results, resultsCount)
    {
        if((param2 + 100) > resultsCount){
            $scope.showMarkers($scope, results.slice(param1, resultsCount-1)); //Generates the map markers
        }
        else{
            $scope.showMarkers($scope, results.slice(param1, param2)); //Generates the map markers
            $timeout(function() {$scope.addMarkersByIntervals(param1+100, param2+100, results, resultsCount)}, $scope.polling_interval);
        }
    };


    //Executes the searchInput to the back end
    $scope.searchMapValues   = function (queryString) {

        var mapObject = document.getElementById("map_canvas");
        $scope.initialize(mapObject); //Map initialization

        $http.get(''+communicationService.url+'/'+communicationService.collectionName+'/'+communicationService.getMapHandlerName($location.search().source)+'?'+queryString, {}, {})
            .success(function(response) {
                if(response.response && response.response.docs){

                    var mapResults  = response.response.docs;
                    $scope.bigTotalItems    = response.response.numFound;
                    $scope.mapResultsCount  = $scope.bigTotalItems;

                    //Facets
                    $scope.facets   = {}; //Cleaning facets before repopulating them
                    $scope.facets   = resultsService.buildFacets(response.facet_counts.facet_fields, response.facet_counts.facet_ranges, $location.search());

                    //Google Map markers
                    $scope.addMarkersByIntervals(0, 99, mapResults, mapResults.length);
                    google.maps.event.trigger($scope.map, 'resize'); //To show the map after map mode loading...
                    $scope.map.setCenter(new google.maps.LatLng(20, 0)); //Sets the center to avoid repositioning
                }
                else{
                    console.log('ERROR - Map search error: Incorrect response format');
                }

            }).error(function (data) {
                console.log('Map search error: '+JSON.stringify(data));

            }
        );
    };


    //Executes the searchInput to the back end
    $scope.getMapCount  = function (queryString) {

        $http.get(''+communicationService.url+'/'+communicationService.collectionName+'/'+communicationService.getMapHandlerName($location.search().source)+'?'+queryString, {}, {})
            .success(function(response) {
                if(response.response && response.response.docs){
                    $scope.mapResultsCount  = response.response.numFound;
                }
                else{
                    console.log('ERROR - Map search error: Incorrect response format');
                    $scope.mapResultsCount  = 0;
                }

            }).error(function (data) {
                console.log('Map search error: '+JSON.stringify(data));
                $scope.mapResultsCount  = 0;
            }
        );
    };


    //Generate the query string using the values received as parameter (URL param format)
    $scope.generateQueryString  = function (urlParameters) {
        var queryString     = '';
        var currentParamStr;

        for(var param in urlParameters){
            currentParamStr = resultsService.generateQueryFromParam(param, urlParameters[param]);
            if(currentParamStr != ''){
                queryString = queryString + resultsService.generateQueryFromParam(param, urlParameters[param])+'&';
            }
        }
        queryString = queryString.substring(0, queryString.length - 1);

        return queryString;
    };


    //Execute the search on load
    $scope.search($scope.generateQueryString($location.search()));

    /****************/
    /* END - SEARCH */
    /****************/



    /*************/
    /* UTILITIES */
    /*************/
    //Shows the formatted versions of the value received as parameter
    $scope.getFormattedVersion  = function (resultValue) {
        var formattedValue  = '';
        if(Array.isArray(resultValue)){
            for(var i = 0; i < resultValue.length; i++){
                if(i !== 0){
                    formattedValue = formattedValue + ', ';
                }
                formattedValue = formattedValue + resultValue[i];
            }
            return formattedValue;
        }
        else{
            return resultValue;
        }
    };


    //Use the string to get the source code
    $scope.getSourceDescription = function (source) {
        var description;
        switch(source) {
            case 'Partner':
                description = '<span class="glyphicon glyphicon-info-sign" > </span>&#160;&#160;The UNCCD Knowledge Portal SKBP connects to various knowledge bases of our partners, containing relevant SLM best practices and scientific knowledge to allow users to search for the required data. <a href="#/partners" >More information on SKBP Partners.</a>';
                break;
            case 'CBW':
                description = '<span class="glyphicon glyphicon-info-sign" > </span>&#160;&#160;The UNCCD Capacity Building Marketplace brings together needs and possible solutions, linking demand for and supply of capacity building within the framework of the UNCCD for all concerned directly or otherwise with the UNCCD process. Various offerings of the Capacity Building Marketplace are shared through the Knowledge Portal SKPB. <a href="http://www.unccd.int/marketplace" target="_blank">Visit the Marketplace for more.</a>';
                break;
            case 'ROE':
                description = '<span class="glyphicon glyphicon-info-sign" > </span>&#160;&#160;The Roster of independent Experts has been established in accordance with article 24, paragraph 2, of the Convention. It is maintained and managed by the UNCCD Secretariat. In the future all information regarding the Roster of Experts will be made available through the UNCCD Knowledge Portal SKPB. <a href="http://www.unccd.int/en/programmes/Science/Roster-of-Experts/Pages/default.aspx" target="_blank">More information on the Roster of Experts</a>';
                break;
            case 'KB':
                description = '<span class="glyphicon glyphicon-info-sign" > </span>&#160;&#160;The SKBP Knowledge Base interactive map provides an overview of knowledge bases and websites reported by country Parties in biannual reports submitted to the UNCCD secretariat.  Information below is based on the reports up the last reporting cycle in 2014, and searchable by Reporting Entity, by Country Coverage of the knowledge base and Country Location of the knowledge base.';
                break;
            default:
                console.log('No resource selected');
        }
        return description;
    };

    $scope.isSourceSelected = function () {
        var isSourceSelected    = false;
        if($location.search().source){
            isSourceSelected    = true;
        }
        return isSourceSelected;
    };


    //Set the results mode based on resultsMode parameter or the selected source
    $scope.setResultsMode   = function (params) {
        if(params.resultsMode){
            if(params.resultsMode === 'map'){
                $scope.changeResultsMode('map');
            }
            else{
                $scope.changeResultsMode('list');
            }
        }
        else if(params.source){
            if(params.source === 'KB' || params.source === 'ROE'){
                $scope.changeResultsMode('map');
            }
            else{
                $scope.changeResultsMode('list');
            }
        }
        else{ //No results mode or source description defined in the params - Default behaviour is list mode
            $scope.changeResultsMode('list');
        }
    };
    /*******************/
    /* END - UTILITIES */
    /*******************/



    /**************/
    /* ON STARTUP */
    /**************/

    //Sets the results mode. Map or list view
    $scope.setResultsMode($location.search());

    //Gets the source description
    $scope.sourceDescription    = $scope.getSourceDescription($location.search().source);

    /********************/
    /* END - ON STARTUP */
    /********************/

    $scope.items = $scope.currentResultItem;

    $scope.openModal = function () {

        var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'views/directives/myModalContent.html',
            controller: 'ModalInstanceController',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });

    }

}]);
