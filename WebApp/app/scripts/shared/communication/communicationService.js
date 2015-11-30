
'use strict';

/*
 Communication Service to handle the communication between this UI and the project's API
 */


unccdApp.service('communicationService', function ($cookieStore, $resource, localStorageService) {

    this.url                    = 'http://81.143.99.157/solr';
    //this.url            = 'http://localhost:8983/solr';
    this.collectionName         = 'unccd';
    this.searchHandler          = 'select';
    this.highlightsDir          = 'highlights';

    this.autocompleteHandler    = 'terms';



    /*************/
    /* Utilities */
    /*************/

    //Gets the URL
    this.getUrl = function () {
        return this.url;
    };

    //Gets the search handler based on the value in the parameter
    this.getSearchHandlerName   = function (source) {
        var searchHandlerName   = 'select';
        //partner cbw roe kb
        switch (source){
            case 'Partner':
                searchHandlerName   = 'partner';
                break;
            case 'CBW':
                searchHandlerName   = 'cbw';
                break;
            case 'ROE':
                searchHandlerName   = 'roe';
                break;
            case 'KB':
                searchHandlerName   = 'kb';
                break;
            default:
                searchHandlerName   = 'select';
        }
        return searchHandlerName;
    };

    this.getMapHandlerName   = function (source) {
        var searchHandlerName   = 'selectmap';
        //partner cbw roe kb
        switch (source){
            case 'Partner':
                searchHandlerName   = 'partnermap';
                break;
            case 'CBW':
                searchHandlerName   = 'cbwmap';
                break;
            case 'ROE':
                searchHandlerName   = 'roemap';
                break;
            case 'KB':
                searchHandlerName   = 'kbmap';
                break;
            default:
                searchHandlerName   = 'selectmap';
        }
        return searchHandlerName;
    };

    //Return autocomplete handler
    this.getAutocompleteHandler = function () {
        return this.autocompleteHandler;
    };

    /*******************/
    /* END - Utilities */
    /*******************/





    /******************/
    /* Search Results */
    /******************/

    //Search results
    this.search = $resource(''+this.url+'/'+this.collectionName+'/'+this.searchHandler+'?:query',{},{
        get:{
            method:"GET",
            headers:{"Content-Type":"application/json"}
        }
    });

    //TODO This method may not be required. Can be removed if tested
    //Search results
    this.getFile = $resource(''+this.url+'/'+this.highlightsDir+'/fileNames.txt',{},{
        get:{
            method:"GET",
            headers:{"Content-Type":"text/plain"}
        }
    });


    /************************/
    /* END - Search Results */
    /************************/

});