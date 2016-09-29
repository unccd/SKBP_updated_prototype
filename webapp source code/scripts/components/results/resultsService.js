
'use strict';

/*
 Results Service: Model for the results
 */


unccdApp.service('resultsService', ['$sce', function ($sce) {

    var nonFacetParams  = ['q', 'start', 'rows']; //All the parameters that are not facets
    
    this.usedFilters = [];

    /****************/
    /* BUILD FACETS */
    /****************/

    //Get filenames from strings with the following format (comma separated):
    //  file1,file2,file3
    this.buildFacets   = function (unformattedFacets, unformattedRangeFacet, searchParams) {
        var facets    = {};
        
        this.usedFilters = [];

        //For the unformmattedFacets
        for(var facetName in unformattedFacets){
            if(unformattedFacets[facetName].length > 0) {
                facets[facetName] = this.buildFacet(unformattedFacets[facetName], searchParams[facetName], facetName);
            }
        }

        //For the unformattedRangeFacets
        for(var facetName in unformattedRangeFacet){
            if(Object.getOwnPropertyNames(unformattedRangeFacet[facetName]).length > 0) {
                facets[facetName] = this.buildRangeFacet(unformattedRangeFacet[facetName], searchParams[facetName]);
            }
        }

        return facets;
    };


    //Builds a list of facets with the count
    this.buildFacet = function (listOfFacetElements, searchParam, facetName) {
        var refinerEnabled;

        var formattedFacets = [];

        for(var i = 0; i < listOfFacetElements.length; i=i+2){
            if(searchParam && (this.isInString(listOfFacetElements[i],searchParam))){
                refinerEnabled = true;
                this.usedFilters.push({"field": facetName, "value":listOfFacetElements[i]});
            }
            else{
                refinerEnabled = false;
            }
            formattedFacets.push({"name":listOfFacetElements[i], "count":listOfFacetElements[i+1], "enabled":refinerEnabled});
            
        }
        return formattedFacets;
    };


    //Builds a range facet
    this.buildRangeFacet    = function (rangeFacetContent, searchParam) {
        var rangeElements   = rangeFacetContent.counts;

        var formattedFacets     = [];

        //BEFORE
        if(rangeFacetContent.before > 0){
            formattedFacets.push({
                "name":"Before "+rangeFacetContent.start,
                "count":rangeFacetContent.before,
                "enabled":this.isDateParam(searchParam),
                'from':null,
                'to':rangeFacetContent.start});
        }
        //END - BEFORE

        //BETWEEN
        for(var i = 0; i < rangeElements.length; i=i+2){
            if(rangeElements[i+2]){
                formattedFacets.push({  "name":"From "+rangeElements[i]+" to "+rangeElements[i+2],
                                        "count":rangeElements[i+1],
                                        "enabled":this.isDateParam(searchParam),
                                        'from':rangeElements[i],
                                        'to':rangeElements[i+2]});
            }
            else{
                formattedFacets.push({  "name":"From "+rangeElements[i]+' to '+(parseInt(rangeElements[i])+rangeFacetContent.gap),
                                        "count":rangeElements[i+1],
                                        "enabled":this.isDateParam(searchParam),
                                        'from':rangeElements[i],
                                        'to':rangeFacetContent.end});//Doesn't have TO value
            }
        }
        //END - BETWEEN

        //AFTER
        if(rangeFacetContent.after > 0) {
            formattedFacets.push({
                "name": "After " + rangeFacetContent.end,
                "count": rangeFacetContent.after,
                "enabled": this.isDateParam(searchParam),
                'from': rangeFacetContent.end,
                'to': null
            });
        }
        //END - AFTER

        return formattedFacets;
    };

    /**********************/
    /* END - BUILD FACETS */
    /**********************/



    /***********************/
    /* URL TRANSFORMATIONS */
    /***********************/

    //Removes a refiner from a list of refiners
    this.removeRefiner  = function (refinerStr, refinersListStr) {
        var finalRefinersList   = refinersListStr.replace(refinerStr+',', '');
        if(refinersListStr === finalRefinersList){ //If the refiner to remove was at the end
            finalRefinersList   = '';
            var refinersList    = refinersListStr.split(',');
            for(var i = 0; i < refinersList.length - 1; i++){ //Include all but the last
                finalRefinersList   = finalRefinersList + refinersList[i];
                if(i != refinersList.length - 2){ //Avoid including a comma at the end of the string
                    finalRefinersList   = finalRefinersList + ',';
                }
            }
        }

        return finalRefinersList;
    };


    //Returns true if the parameter is a non facet parameter
    this.isNonFacetParam = function (paramName) {
        var isNonFacetParam = false;
        if(nonFacetParams.indexOf(paramName) > -1){
            isNonFacetParam = true;
        }
        return isNonFacetParam;
    };


    //Generates the section of the query from the value received as parameter
    this.generateQueryFromParam = function (paramName, paramValues) {
        var queryString = '';
        if(paramName && paramValues && (paramValues != '')){
            if(paramName === 'q'){ //Query
                queryString = 'q='+paramValues;
            }
            if(paramName === 'fq'){ //Query
                queryString = 'fq='+paramValues;
            }
            if(paramName === 'sort'){ //Query
                queryString = 'sort='+ config.sortsMap[paramValues];
            }
            else if(this.isNonFacetParam(paramName)){
                queryString = paramName+'='+paramValues;
            }
            else if(this.isDateParam(paramValues)){ //Range facets
                queryString = 'fq='+paramName+':'+paramValues;
            }
            else if(paramName === 'resultsMode'){
                //Skip this param, is just know which mode display, list or map
            }
            else{
                var paramList   = paramValues.split(',');
                for(var i = 0; i < paramList.length; i++){
                    var escaped = this.decodeRefiner(paramList[i]);
                            
                    escaped  = escaped.replace('&','%26');
                    
                    //multiple facets
                    if(config.multipleFacets.indexOf(paramName) < 0){
                        queryString = queryString + 'fq='+paramName+':'+escaped;
                    }else{
                        if(i === 0){
                            queryString = queryString + 'fq={!tag='+paramName+'F}'+paramName+':('+escaped;
                        }else{
                            queryString = queryString + ' OR '+escaped;
                        }
                        
						if(i === paramList.length - 1){
							queryString = queryString + ')';
						}
                    }
                }
            }
        }
        else{
            if(paramName === 'q'){
                return 'q=*'; //If the q parameter does not have values, then use asterisk instead
            }
        }
        return queryString;
    };


    //Encodes the date refiner. Receive the from and to date as parameters
    this.encodeDateRefiner  = function (dateFrom, dateTo) {
        var encodedDate = '[';
        if(dateFrom){
            encodedDate = encodedDate + dateFrom;
        }
        else{
            encodedDate = encodedDate + '*'
        }
        encodedDate = encodedDate + '+TO+';
        if(dateTo){
            encodedDate = encodedDate + dateTo;
        }
        else{
            encodedDate = encodedDate + '*'
        }
        encodedDate = encodedDate + '}';
        return encodedDate;
    };

    /*****************************/
    /* END - URL TRANSFORMATIONS */
    /*****************************/



    /*******************/
    /* UTILITY METHODS */
    /*******************/

    //Returns true if the format of the string matches the Solr date format
    this.isDateParam    = function (param) {
        var isDateParam = false;
        if(param && param.match){
            if (param.match(/\[(.*?)\}/) || param.match(/\[(.*?)\]/) || param.match(/\{(.*?)\]/) || param.match(/\{(.*?)\}/)) {
                isDateParam = true;
            }
        }
        return isDateParam;
    };


    //Return true if the elem (first parameter) is found in the list of elements (second parameters)
    //elemListStr is a list of elements separated by a comma. Ej: elem1,elem2,elem3
    this.isInString = function (elem, elemListStr) {

        elemListStr = ''+elemListStr;   //This line is necessary due to problems with the split (not recognizing this variable as string)
        var found       = false;
        var elemList    = elemListStr.split(',');
        for(var i = 0; (i < elemList.length)&&(!found); i++){
            if(this.encodeRefiner(elem) === elemList[i]){
                found   = true;
            }
        }
        return found;
    };


    //Encode the refiner based on Solr parameters
    this.encodeRefiner  = function (rawRefiner) {
        var encodedRefiner  = rawRefiner;
        encodedRefiner  = encodedRefiner.replace(',','%2C');
        return encodedRefiner;
    };


    //Decode the refiner based on Solr parameters
    this.decodeRefiner  = function (rawRefiner) {
        
//console.log(rawRefiner);        
            var decoded = angular.element('<textarea />').html(rawRefiner).text();
            
//console.log(decoded);        
            var decodedRefiner = $sce.getTrustedUrl($sce.trustAsUrl(rawRefiner));
//console.log(decodedRefiner);            
//        var decodedRefiner  = '';
//        var decodedRefiner  = rawRefiner;
        decodedRefiner  = decodedRefiner.replace('%25','%'); //This decode step should be always first
        
        //decodedRefiner  = decodedRefiner.replace('&amp;','&');
        decodedRefiner  = decodedRefiner.replace(' ','+');
        if(decodedRefiner.indexOf('"') < 0){
            decodedRefiner  = '"'+decodedRefiner+'"';
        }
        return decodedRefiner;
    };

    /*************************/
    /* END - UTILITY METHODS */
    /*************************/


}]);

