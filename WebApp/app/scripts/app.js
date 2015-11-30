'use strict';

/**
 * @ngdoc overview
 * @name unccdApp
 * @description
 * # unccdApp
 *
 * Main module of the application.
 */
var unccdApp    = angular.module('unccdApp', [
                        'ngAnimate',
                        'ngCookies',
                        'ngResource',
                        'ngRoute',
                        'ngSanitize',
                        'ngTouch',
                        'angular-loading-bar',
                        'uiGmapgoogle-maps',
                        'LocalStorageModule',
                        'pascalprecht.translate',
                        'ui.bootstrap'     //Used for pagination - https://github.com/angular-ui/bootstrap-bower
                    ]);


//Google Maps module configuration - http://angular-ui.github.io/angular-google-maps/#!/
unccdApp.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});


//Local Storage module configuration - https://github.com/grevory/angular-local-storage
unccdApp.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('unccdApp')
        .setStorageType('sessionStorage')
        .setNotify(true, true);
});


//Angular Translate module configuration - https://angular-translate.github.io/
unccdApp.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', {
        'source':'Source',
        'langname':'Language',
        'keywords':'Keywords',
        'regions_nav':'Regions',
        'annexes_nav':'Annexes',
        'nonannexes_nav':'Non Annexes',
        'landmanagement_nav':'Land Management',
        'classifications':'Capacity Building Marketplace Classification',
        'climatezones_nav':'Climate Zones',
        'typology':'Typology',
        'datatype':'Data Type',
        'format':'Format',
        'authors_nav':'Authors',
        'yearpublished':'Year Published',
        'country':'Country',
        'disciplines':'Disciplines',
        'specializations':'Specializations',
        'postcop':'Postcop',
        'thematicareas':'Thematic Areas',
        'topics':'Topics',
        'infoformats':'Information Formats',
        'description':'Description',
        'description_en':'Description (en)',
        'description_it':'Description (it)',
        'abstract':'Abstract',
        'body':'Body',
        'body_en':'Body (en)',
        'body_es':'Body (en)',
        'lastname':'Last Name',
        'firstname':'First Name',
        'institution':'Institution',
        'workexperience':'Work Experience',
        'knowledgebase':'Knowledge Base',
        'kss':'Knowledge Sharing System',
        'managingentity':'Managing Entity',
        'city':'City',
        'yearmodified':'Year Modified',
        'rearchived':'Rearchived',
        'division':'Division',
        'modified':'Modified',
        'id':'ID',
        'expertemail':'Expert Email',
        'website':'Website',
        'languages':'Other Languages',
        'persontitle':'Title',
        'sex':'Sex',
        'score':'Score',
        'nationality':'Nationality',
        'telnumber':'Phone Number',
        'geolocation':'Geolocation',
        'registrationreq':'Registration Required',
        'translation':'Translation',
        'managingentitytype':'Managing Entity Type',
        'searchcapability':'Search Capability',
        'regions':'Regions',
        'annexes':'Annexes',
        'url':'URL',
        'size':'Size',
        'title':'Title',
        'title_en':'Title (en)',
        'title_es':'Title (es)',
        'title_de':'Title (de)',
        'title_it':'Title (it)',
        'title_fr':'Title (fr)',
        'nonannexes':'Non Annexes',
        'landmanagement':'Land Management',
        'contactemail':'Contact Email',
        'citationcode':'Citation Code',
        'contactname':'Contact Name',
        'publication':'Publication',
        'publishers':'Publishers',
        'contactphone':'Contact Phone',
        'published':'Published',
        'contactorganisation':'Contact Organisation',
        'partnername':'Partner Name',
        'authors':'Authors',
        'abstract_en':'Abstract',
        'abstract_es':'Abstract',
        'abstract_de':'Abstract',
        'abstract_it':'Abstract',
        'abstract_fr':'Abstract',
        'region':'Region',
        'recarchived':'Record Archived',
        'thematicareas_nav':'Thematic Areas',
        'topics_nav':'Topics',
        'type':'Type',
        'climatezones':'Climatezones',
        'docsource':'Docsource',
        'subjects':'Subjects',
        'volume':'Volume',
        'yearsubmitte':'Year submitte',
        'disciplines_nav':'Disciplines',
        'specialization_nav':'Specialization',
        'specializations_nav':'Specializations',
        'postcop_nav':'Postcop'
    });
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.preferredLanguage('en');
}]);



//Route definition for the UNCCD Project

unccdApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/partials/homeView.html',
            controller: 'homeController',
            activeTab: 'home'
        })
        .when('/results', {
            templateUrl: 'views/partials/resultsView.html',
            controller: 'searchResultsController',
            activeTab: 'results'
        })
        .when('/about', {
            templateUrl: 'views/partials/aboutView.html',
            controller: 'aboutController',
            activeTab: 'about'
        })
        .when('/guides', {
            templateUrl: 'views/partials/guidesView.html',
            controller: 'guidesController',
            activeTab: 'guides'
        })
        .when('/partners', {
            templateUrl: 'views/partials/partnersView.html',
            controller: 'partnersController',
            activeTab: 'partners'
        })
        .when('/advancedSearch', {
            templateUrl: 'views/partials/advancedSearchView.html',
            controller: 'advancedSearchController',
            activeTab: 'advancedSearch'
        })
        .when('/disclaimer', {
            templateUrl: 'views/partials/disclaimerView.html',
            controller: 'disclaimerController',
            activeTab: 'disclaimer'
        })
        .when('/contact', {
            templateUrl: 'views/partials/contactView.html',
            controller: 'contactController',
            activeTab: 'contact'
        })
        .otherwise({
            redirectTo: '/'
        });
});