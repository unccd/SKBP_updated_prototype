
'use strict';

/*
 File Utility Service: has method to deal with file content
 */


unccdApp.service('fileUtilityService', function (communicationService) {

    //Get highlights filenames from strings with the following format (comma separated):
    //  file1,file2,file3
    this.getHighlightsFilenames   = function (filenamesListStr) {
        var filenamesList       = [];
        var allFilenames        = filenamesListStr.split('\n');
        var splittedFilenames   = allFilenames[0].split(","); //allFilenames[0] contains the highlights filenames only (the first line of the file)
        for(var i = 0; i < splittedFilenames.length; i++){
            filenamesList.push(splittedFilenames[i]);
        }
        return filenamesList;
    };


    //Get images filenames from strings with the following format (comma separated):
    //  file1,file2,file3
    this.getImagesFilenames   = function (filenamesListStr) {
        var filenamesList       = [];
        var allFilenames        = filenamesListStr.split('\n');
        if(allFilenames[1]){
            var splittedFilenames   = allFilenames[1].split(","); //allFilenames[1] contains the images filenames only (the second line of the file)
            for(var i = 0; i < splittedFilenames.length; i++){
                filenamesList.push(''+communicationService.url+'/'+communicationService.highlightsDir+'/'+splittedFilenames[i]);
            }
        }
        return filenamesList;
    };


    //Created a highlight JSON based in the file content (String format)
    this.createHighlightObject  = function (fileStr) {
        var highlight   = {};
        var description = '';
        var fileLines   = fileStr.split("\n");

        if(fileLines.length > 2){
            highlight.title = fileLines[0];
            highlight.url   = fileLines[1];
            for(var i = 2; i < fileLines.length; i++){
                description = description+' '+fileLines[i];
            }
            highlight.description   = description;
        }
        else{
            console.log('ERROR. Incorrect highlight file content format: Number of lines lower than 3');
        }

        return highlight;
    };

});