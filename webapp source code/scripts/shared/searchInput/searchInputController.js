'use strict';


//Search controller
unccdApp.controller('searchInputController', function ($scope, $location, $route, $http, localStorageService, communicationService) {
  $scope.inputValue = "";
  $scope.selectedSource = "";
  $scope.sources = ["SKBP Partners",
    //"Marketplace",
    "Capacity Building Marketplace",
    //"Experts",
    "Roster of Experts",
    //"WOCAT best practices",
    "WOCAT Best Practices",
    //"Knowledge Base",
    "Knowledge Bases"];
  $scope.autocompleteValues = [];

  $scope.sorts = communicationService.sorts;
  $scope.selectedSort = $scope.sorts[0];

  $scope.rows = config.rows;
  $scope.selectedRows = $scope.rows[0];


  //Submits the content of the search box to the results page to execute the query
  $scope.submit = function () {

    $location.$$search = {}; //Reset the facets

    localStorageService.set('query', $scope.inputValue);
    if ($scope.selectedSource === '') {
      $location.path('/results')
              .search('q', $scope.inputValue)
              .search('sort', $scope.selectedSort)
              .search('rows', $scope.selectedRows);
    } else {
      $location.path('/results')
              .search('q', $scope.inputValue)
              .search('sort', $scope.selectedSort)
              .search('rows', $scope.selectedRows)
              .search('source', $scope.getSource($scope.selectedSource));
    }
  };


  //This is to show the current query in the search results page search input
  if (($location.path() == '/results') && $location.search()['q'] && $location.search()['q'] !== '') {
    $scope.inputValue = $location.search()['q'];
  }


  //Use the string to get the source
  $scope.getSource = function (strSource) {
    var source;
    switch (strSource) {
      case 'SKBP Partners':
        source = 'Partner';
        break;
      case 'Capacity Building Marketplace':
        source = 'CBW';
        break;
      case 'Roster of Experts':
        source = 'ROE';
        break;
      case 'Knowledge Bases':
        source = 'KB';
        break;
      case 'WOCAT Best Practices':
        source = 'WOCATBP';
        break;
      default:
        console.log('ERROR: the selected source is incorrect');
    }
    return source;
  };


  //Use the string to get the source code
  $scope.getSourceString = function (source) {
    var sourceStr;
    switch (source) {
      case 'Partner':
        sourceStr = 'SKBP Partners';
        break;
      case 'CBW':
                sourceStr  = 'Capacity Building Marketplace';
        break;
      case 'ROE':
        sourceStr = 'Roster of Experts';
        break;
      case 'KB':
        sourceStr = 'Knowledge Bases';
        break;
      case 'WOCATBP':
        sourceStr = 'WOCAT Best Practices';
        break;
      default:
        console.log('ERROR: the source is incorrect');
    }
    return sourceStr;
  };


  //To set the source select with the current source
  if ($location.search().source) {
    $scope.selectedSource = $scope.getSourceString($location.search().source);
  }


  //To set the sort select with the current sort
  if ($location.search().sort) {
    $scope.selectedSort = $location.search().sort;
  }

  //To set the sort select with the current sort
  if ($location.search().rows) {
    $scope.selectedRows = $location.search().rows;
  }



  /****************/
  /* AUTOCOMPLETE */
  /****************/
  //Generates the autocomplete query based on the query string received as parameter
  $scope.getAutocompleteQuery = function (queryString) {
    return 'terms.fl=keywords&terms.prefix=' + queryString + '&terms.sort=count&wt=json';
  };


  //Generates autocomplete values using the query string received as parameter
  $scope.generateAutocompleteValues = function () {
    $http.get('' + communicationService.url + '/' + communicationService.collectionName + '/' + communicationService.getAutocompleteHandler() + '?' + $scope.getAutocompleteQuery($scope.inputValue), {}, {})
            .success(function (response) {
              if (response.terms && response.terms.keywords) {
                $scope.autocompleteValues = $scope.getEvenValues(response.terms.keywords);
              }
            }).error(function (data) {
      console.log('ERROR: Unable to get autocomplete data: ' + JSON.stringify(data));
    }
    );
  };


  $scope.getEvenValues = function (arr) {
    if (arr && arr.length > 0) {
      var evenValues = [];
      for (var i = 0; i < arr.length; i += 2) {
        evenValues.push(arr[i]);
      }
      return evenValues;
    } else {
      return arr;
    }

  };
  /**********************/
  /* END - AUTOCOMPLETE */
  /**********************/

});
