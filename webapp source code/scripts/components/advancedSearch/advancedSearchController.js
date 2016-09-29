'use strict';


unccdApp.controller('advancedSearchController', function ($scope, $location) {
    $scope.advSources           = ['SKBP Partners', 'Capacity Building Marketplace', 'Roster of Experts', 'Knowledge Bases'];
    $scope.advSelectedSource    = '';

    $scope.advLanguages         = [
        {lang:'English',    code:'en'},
        {lang:'Spanish',    code:'es'},
        {lang:'German',     code:'de'},
        {lang:'Italian',    code:'it'},
        {lang:'French',     code:'fr'}
    ];
    $scope.selectedLang         = $scope.advLanguages[0];

    //SKBP Partners fields
    $scope.skbpFields   = [
        {
            name:           'langname',
            value:          '',
            type:           'langSelect',
            needsAppend:    false
        },
        {
            name:           'title',
            value:          '',
            type:           'string',
            needsAppend:    true
        },
        {
            name:           'description',
            value:          '',
            type:           'string',
            needsAppend:    true
        },
        {
            name:           'abstract',
            value:          '',
            type:           'string',
            needsAppend:    true
        },
        {
            name:           'body',
            value:          '',
            type:           'string',
            needsAppend:    true
        },
        {
            name:           'published',
            valueTo:        '',
            valueFrom:      '',
            type:           'year',
            pFrom:          'From year', //from placeholder
            pTo:            'To year', //to placeholder
            needsAppend:    true
        }
    ];
//<input ng-if="skbpField.type == 'dateField'" type="text" name="skbpField.name" class="form-control" ng-model="skbpField.fromValue"/>


    //CBW fields
    $scope.cbwFields    = [
        {
            name:           'langname',
            value:          '',
            type:           'langSelect',
            needsAppend:    false
        },
        {
            name:           'title',
            value:          '',
            type:           'string',
            needsAppend:    true
        },
        {
            name:           'body',
            value:          '',
            type:           'string',
            needsAppend:    true
        }
    ];

    //Roster of Experts Fields
    $scope.roeFields   = [
        {
            name:           'firstname',
            value:          '',
            type:           'string',
            needsAppend:    false
        },
        {
            name:           'lastname',
            value:          '',
            type:           'string',
            needsAppend:    false
        },
        {
            name:           'institution',
            value:          '',
            type:           'string',
            needsAppend:    false
        },
        {
            name:           'workexperience',
            value:          '',
            type:           'string',
            needsAppend:    false
        }
    ];

    // Knowledge Base fields
    $scope.kbFields = [
        {
            name:           'kss',
            value:          '',
            type:           'string',
            needsAppend:    false
        },
        {
            name:           'managingentity',
            value:          '',
            type:           'string',
            needsAppend:    false
        }
    ];



    //Submits the content of the input fields from the form based on the selected source
    $scope.advSubmit   = function(){
        var source  = '';
        var fields  = '';

        if($scope.advSelectedSource && ($scope.advSelectedSource !== '')){
            switch($scope.advSelectedSource) {
                case 'SKBP Partners':
                    source  = 'Partner';
                    fields  = $scope.getSkbpFields();
                    break;
                case 'Capacity Building Marketplace':
                    source  = '"CBW"';
                    fields  = $scope.getCbwFields();
                    break;
                case 'Roster of Experts':
                    source  = '"ROE"';
                    fields  = $scope.getRoeFields();
                    break;
                case 'Knowledge Bases':
                    source  = '"KB"';
                    fields  = $scope.getKbFields();
                    break;
                default:
                    console.log('ERROR: the selected source is incorrect');
                    //fq=title_en:"america"+body_en:"america"
            }

            $location.path('/results').search('source', source).search('fq', fields);
        }

    };


    $scope.getSkbpFields = function () {
        var fields      =   '';

        var langCode    = $scope.selectedLang.code; //To get the language code

        fields  = fields + 'langname:"' + $scope.selectedLang.lang + '"'; //Language should be defined

        if($scope.getValueFromField($scope.skbpFields, 'title')[0].value != ''){
            if(fields.length > 0){ 
                fields = fields + '+';
            }
            fields      = fields + 'title_'+ langCode+ ':"' + $scope.getValueFromField($scope.skbpFields, 'title')[0].value + '"';
        }
        if($scope.getValueFromField($scope.skbpFields, 'description')[0].value != ''){
            if(fields.length > 0){ 
                fields = fields + '+';
            }
            fields  = fields + 'description_' + langCode + ':"' + $scope.getValueFromField($scope.skbpFields, 'description')[0].value + '"';
        }
        if($scope.getValueFromField($scope.skbpFields, 'abstract')[0].value != ''){
            if(fields.length > 0){ 
                fields = fields + '+';
            }
            fields  = fields + 'abstract_' + langCode + ':"' + $scope.getValueFromField($scope.skbpFields, 'abstract')[0].value + '"';
        }
        if($scope.getValueFromField($scope.skbpFields, 'body')[0].value !== ''){
            if(fields.length > 0){ 
                fields = fields + '+';
            }
            fields  = fields + 'body_' + langCode + ':"' + $scope.getValueFromField($scope.skbpFields, 'body')[0].value + '"';
        }
        var skbpPublished = $scope.getValueFromField($scope.skbpFields, 'published')[0];
        if(skbpPublished.valueFrom !== '' || skbpPublished.valueTo !== ''){
            if(fields.length > 0){ 
                fields = fields + '+';
            }
            
console.log('published: '+JSON.stringify($scope.getValueFromField($scope.skbpFields, 'published')));

            var vFrom = skbpPublished.valueFrom !== '' ? skbpPublished.valueFrom : '*';
            var vTo = skbpPublished.valueTo !== '' ? skbpPublished.valueTo : '*';
            fields  = fields + 'yearpublished' + ':{' + vFrom + '+TO+' + vTo + "}";
        }
        return fields;
    };


    $scope.getCbwFields = function () {
        var fields      =   '';
        //var langCode    = $.grep($scope.advLanguages, function(e){ return e.lang == $scope.selectedLang.lang; })[0].code; //To get the language code
        var langCode    = $scope.selectedLang.code; //To get the language code

        fields  = fields + 'langname:"' + $scope.selectedLang.lang + '"'; //Language should be defined

        if($scope.getValueFromField($scope.cbwFields, 'title')[0].value != ''){
            if(fields.length > 0){ fields = '+' + fields }
            fields      = fields + 'title_'+ langCode+ ':"' + $scope.getValueFromField($scope.cbwFields, 'title')[0].value + '"';
        }
        if($scope.getValueFromField($scope.cbwFields, 'body')[0].value != ''){
            if(fields.length > 0){ fields = '+' + fields }
            fields  = fields + 'body_' + langCode + ':"' + $scope.getValueFromField($scope.cbwFields, 'body')[0].value + '"';
        }
        return fields;
    };


    $scope.getRoeFields = function () {
        var fields      =   '';

        if($scope.getValueFromField($scope.roeFields, 'firstname')[0].value != ''){
            if(fields.length > 0){ fields = '+' + fields }
            fields      = fields + 'firstname:"' + $scope.getValueFromField($scope.roeFields, 'firstname')[0].value + '"';
        }
        if($scope.getValueFromField($scope.roeFields, 'lastname')[0].value != ''){
            if(fields.length > 0){ fields = '+' + fields }
            fields  = fields + 'lastname:"' + $scope.getValueFromField($scope.roeFields, 'lastname')[0].value + '"';
        }
        if($scope.getValueFromField($scope.roeFields, 'institution')[0].value != ''){
            if(fields.length > 0){ fields = '+' + fields }
            fields  = fields + 'institution:"' + $scope.getValueFromField($scope.roeFields, 'institution')[0].value + '"';
        }
        if($scope.getValueFromField($scope.roeFields, 'workexperience')[0].value != ''){
            if(fields.length > 0){ fields = '+' + fields }
            fields  = fields + 'workexperience:"' + $scope.getValueFromField($scope.roeFields, 'workexperience')[0].value + '"';
        }
        return fields;
    };


    $scope.getKbFields  = function () {
        var fields      =   '';

        if($scope.getValueFromField($scope.kbFields, 'kss')[0].value != ''){
            if(fields.length > 0){ fields = '+' + fields }
            fields      = fields + 'kss:"' + $scope.getValueFromField($scope.kbFields, 'kss')[0].value + '"';
        }
        if($scope.getValueFromField($scope.kbFields, 'managingentity')[0].value != ''){
            if(fields.length > 0){ fields = '+' + fields }
            fields  = fields + 'managingentity:"' + $scope.getValueFromField($scope.kbFields, 'managingentity')[0].value + '"';
        }
        return fields;
    };


    $scope.getValueFromField    = function (myArray, fieldName) {
        return $.grep(myArray, function(e){ return e.name == fieldName; });
    };

});
